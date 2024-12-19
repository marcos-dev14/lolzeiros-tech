<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\NavigationRequest;
use App\Http\Resources\NavigationResource;
use App\Services\NavigationService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class NavigationController extends BaseController
{
    #[NoReturn]
    public function __construct(protected NavigationService $entityService) {}

    public function getLocations(): JsonResponse
    {
        return $this->sendResponse(
            $this->entityService::LOCATIONS,
            Lang::get('custom.found_registers')
        );
    }

    public function index(Request $request): JsonResponse
    {
        $this->entityService->relations = $this->entityService->extractRelationsFromArray($request->all());

        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                NavigationResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            NavigationResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function store(NavigationRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->make($request->validated());
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new NavigationResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $this->entityService->relations = $this->entityService->extractRelationsFromArray($request->all());
            $item = $this->entityService->getById($id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new NavigationResource($item),
            Lang::get('custom.found_register')
        );
    }

    public function update(NavigationRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->update($itemId, $request->validated());
            $item = $this->entityService->getById($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new NavigationResource($item),
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
