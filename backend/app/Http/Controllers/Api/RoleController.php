<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\JustNameRequest;
use App\Http\Resources\JustNameResource;
use App\Services\RoleService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class RoleController extends BaseController
{
    #[NoReturn]
    public function __construct(protected RoleService $entityService) {}

    public function index(Request $request): JsonResponse
    {
        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                JustNameResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            JustNameResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function store(JustNameRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->make($request->validated());
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new JustNameResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(JustNameRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->update($itemId, $request->validated());
            $item = $this->entityService->getById($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new JustNameResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(int $itemId): JsonResponse
    {
        try {
            if ($itemId == 1) {
                return $this->sendError(Lang::get('custom.cannot_be_deleted'), [], 401);
            }

            $this->entityService->destroy($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }
}
