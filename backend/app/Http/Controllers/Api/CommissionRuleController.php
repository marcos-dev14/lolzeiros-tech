<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\CommissionRuleRequest;
use App\Http\Resources\CommissionRuleResource;
use App\Services\CommissionRuleService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class CommissionRuleController extends BaseController
{
    #[NoReturn]
    public function __construct(protected CommissionRuleService $entityService) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                CommissionRuleResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            CommissionRuleResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function store(CommissionRuleRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->make($request->validated());
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new CommissionRuleResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(CommissionRuleRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->update($itemId, $request->validated());
            $item = $this->entityService->getById($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new CommissionRuleResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(int $itemId): JsonResponse
    {
        try {
            $this->entityService->destroy($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }
}
