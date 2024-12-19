<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\BlogCategoryRequest;
use App\Http\Resources\BlogCategoryResource;
use App\Services\BlogCategoryService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class BlogCategoryController extends BaseController
{
    #[NoReturn]
    public function __construct(protected BlogCategoryService $entityService) {}

    public function index(Request $request): JsonResponse
    {
        $this->entityService->counts = ['recursivePosts'];

        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                BlogCategoryResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            BlogCategoryResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function store(BlogCategoryRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->make($request->validated());
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BlogCategoryResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(BlogCategoryRequest $request, int $itemId): JsonResponse
    {
        try {
            $item = $this->entityService->getById($itemId);
            $this->entityService->update($item, $request->validated());

            $this->entityService->counts = ['recursivePosts'];
            $item = $this->entityService->getTreeById($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BlogCategoryResource($item),
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
