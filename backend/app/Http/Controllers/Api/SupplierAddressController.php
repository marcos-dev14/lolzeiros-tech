<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\AddressRequest;
use App\Http\Resources\AddressResource;
use App\Models\Supplier;
use App\Services\AddressService;
use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class SupplierAddressController extends BaseController
{
    #[NoReturn]
    public function __construct(protected AddressService $entityService) {}

    public function store(Supplier $supplier, AddressRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->make(
                array_merge($request->validated(), [
                    'addressable' => $supplier
                ])
            );

            $this->entityService->relations = ['type', 'state', 'city'];
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new AddressResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(Supplier $supplier, AddressRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteriaCollection(
                QueryCriteriaCollection::OPERATOR_AND,
                new QueryCriteria('addressable_type', $supplier::class),
                new QueryCriteria('addressable_id', $supplier->id),
            );

            $item = $this->entityService->getById($itemId);
            $this->entityService->update($item, $request->validated());

            $item->load('type', 'state', 'city');
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new AddressResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(Supplier $supplier, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteriaCollection(
                QueryCriteriaCollection::OPERATOR_AND,
                new QueryCriteria('addressable_type', $supplier::class),
                new QueryCriteria('addressable_id', $supplier->id),
            );

            $item = $this->entityService->getById($itemId);
            $this->entityService->destroy($item);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }
}
