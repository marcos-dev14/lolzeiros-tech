<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\BlogAuthorRequest;
use App\Http\Resources\BlogAuthorResource;
use App\Services\BlogAuthorService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class BlogAuthorController extends BaseController
{
    #[NoReturn]
    public function __construct(protected BlogAuthorService $entityService){}

    public function index(Request $request): JsonResponse
    {
        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                BlogAuthorResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            BlogAuthorResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function show(int $id): JsonResponse
    {
        try {
            $item = $this->entityService->getById($id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BlogAuthorResource($item),
            Lang::get('custom.found_register')
        );
    }

    public function store(BlogAuthorRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->makeWithImage($request->validated());
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BlogAuthorResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(BlogAuthorRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->updateWithImage($itemId, $request->validated());
            $item = $this->entityService->getById($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BlogAuthorResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(int $itemId): JsonResponse
    {
        try {
            $this->entityService->destroyWithImage($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }
}
