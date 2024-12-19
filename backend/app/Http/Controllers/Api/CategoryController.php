<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\CategoryRequest;
use App\Http\Requests\CategorySortRequest;
use App\Http\Resources\Product\CategoryResource;
use App\Models\Category;
use App\Models\Supplier;
use App\Services\CategoryService;
use App\Services\Utils\QueryCriteria;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\NoReturn;
use Mavinoo\Batch\BatchFacade;

class CategoryController extends BaseController
{
    #[NoReturn]
    public function __construct(protected CategoryService $entityService)
    {
        $this->entityService->orderBy = 'order';
        $this->entityService->orderDirection = 'asc';
        $this->entityService->counts = ['products'];
    }

    public function index(Request $request, int|string $supplierId): JsonResponse
    {
        $this->entityService->criteria = new QueryCriteria('supplier_id', $supplierId);

        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                CategoryResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            CategoryResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function show(int $supplierId, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteria('supplier_id', $supplierId);
            $item = $this->entityService->getById($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new CategoryResource($item),
            Lang::get('custom.found_register')
        );
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->make($request->validated());
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new CategoryResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(CategoryRequest $request, int $supplierId, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteria('supplier_id', $supplierId);

            $item = $this->entityService->getById($itemId);
            $this->entityService->update($item, $request->validated());
            $item = $this->entityService->getById($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new CategoryResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(int $supplierId, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteria('supplier_id', $supplierId);

            $item = $this->entityService->getById($itemId);
            $this->entityService->destroy($item);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }

    public function updateOrder(CategorySortRequest $request, int $supplierId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteria('supplier_id', $supplierId);

            $this->entityService->updateOrder($request->validated()['fields'] ?? []);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        $this->entityService->criteria = new QueryCriteria('supplier_id', $supplierId);
        $items = $this->entityService->all();

        return $this->sendResponse(
            CategoryResource::collection($items),
            Lang::get('custom.registers_updated')
        );
    }
}
