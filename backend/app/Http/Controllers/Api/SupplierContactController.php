<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ContactRequest;
use App\Http\Resources\ContactResource;
use App\Models\Supplier;
use App\Services\ContactService;
use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class SupplierContactController extends BaseController
{
    #[NoReturn]
    public function __construct(protected ContactService $entityService) {}

    public function store(Supplier $supplier, ContactRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->make(
                array_merge($request->validated(), [
                    'contactable' => $supplier
                ])
            );

            $this->entityService->relations = ['role'];

            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new ContactResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(Supplier $supplier, ContactRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteriaCollection(
                QueryCriteriaCollection::OPERATOR_AND,
                new QueryCriteria('contactable_type', $supplier::class),
                new QueryCriteria('contactable_id', $supplier->id),
            );

            $item = $this->entityService->getById($itemId);
            $this->entityService->update($item, $request->validated());

            $item->load('role');
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new ContactResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(Supplier $supplier, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteriaCollection(
                QueryCriteriaCollection::OPERATOR_AND,
                new QueryCriteria('contactable_type', $supplier::class),
                new QueryCriteria('contactable_id', $supplier->id),
            );

            $item = $this->entityService->getById($itemId);
            $this->entityService->destroy($item);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }
}
