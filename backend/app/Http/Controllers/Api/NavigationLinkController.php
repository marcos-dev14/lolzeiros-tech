<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\NavigationLinkRequest;
use App\Http\Resources\NavigationLinkResource;
use App\Models\Navigation;
use App\Services\NavigationLinkService;
use App\Services\Utils\QueryCriteria;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;
use Mavinoo\Batch\BatchFacade;
use Illuminate\Support\Facades\Validator;

class NavigationLinkController extends BaseController
{
    #[NoReturn]
    public function __construct(protected NavigationLinkService $entityService) {}

    public function index(Request $request, Navigation $navigation): JsonResponse
    {
        $this->entityService->criteria = new QueryCriteria('navigation_id', $navigation->id);
        $this->entityService->orderBy = 'order';
        $this->entityService->orderDirection = 'asc';

        $items = $this->entityService->all($request->paginated);

        if ($items instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                NavigationLinkResource::collection($items)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            NavigationLinkResource::collection($items),
            Lang::get('custom.found_registers')
        );
    }

    public function store(NavigationLinkRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->make($request->validated());
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new NavigationLinkResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function types(): JsonResponse
    {
        $types = $this->entityService->model?->labelTypes;

        return $this->sendResponse($types, Lang::get('custom.found_registers'));
    }

    public function update(NavigationLinkRequest $request, Navigation $navigation, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteria('navigation_id', $navigation->id);

            $item = $this->entityService->getById($itemId);
            $this->entityService->update($item, $request->validated());
            $item->refresh();
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new NavigationLinkResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(Navigation $navigation, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteria('navigation_id', $navigation->id);

            $item = $this->entityService->getById($itemId);
            $this->entityService->destroy($item);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }

    public function updateOrder(Request $request, Navigation $navigation): JsonResponse
    {
        $validator = Validator::make($request->fields, [
            '*.id' => 'required|distinct',
            '*.order' => 'required|int|distinct'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        BatchFacade::update(new ($this->entityService->model), $request->fields, 'id');

        $links = $navigation->links->sortBy('order');

        return $this->sendResponse(NavigationLinkResource::collection($links), Lang::get('custom.sorted'));
    }
}
