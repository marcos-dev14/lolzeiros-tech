<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ShippingCompanyRequest;
use App\Http\Resources\ShippingCompanyResource;
use App\Services\ShippingCompanyService;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class ShippingCompanyController extends BaseController
{
    #[NoReturn]
    public function __construct(protected ShippingCompanyService $entityService) {}

    public function index(Request $request): JsonResponse
    {
        try {
            $this->entityService->enableFilters(
                $request->only(
                    $this->entityService->model->getFillable()
                )
            );
        } catch (Exception $exception) {
            return $this->sendError($exception->getMessage(), [$exception->getMessage()], 400);
        }

        $this->entityService->relations = ['countryState'];
        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                ShippingCompanyResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            ShippingCompanyResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function store(ShippingCompanyRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->make($request->validated());
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new ShippingCompanyResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(ShippingCompanyRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->update($itemId, $request->validated());
            $item = $this->entityService->getById($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new ShippingCompanyResource($item),
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