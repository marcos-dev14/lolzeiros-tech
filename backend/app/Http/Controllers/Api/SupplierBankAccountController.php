<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\BankAccountRequest;
use App\Http\Resources\BankAccountResource;
use App\Models\Supplier;
use App\Services\BankAccountService;
use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class SupplierBankAccountController extends BaseController
{
    #[NoReturn]
    public function __construct(protected BankAccountService $entityService) {}

    public function store(Supplier $supplier, BankAccountRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->make(
                array_merge($request->validated(), [
                    'bankable' => $supplier
                ])
            );

            $this->entityService->relations = ['bank'];
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BankAccountResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(Supplier $supplier, BankAccountRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteriaCollection(
                QueryCriteriaCollection::OPERATOR_AND,
                new QueryCriteria('bankable_type', $supplier::class),
                new QueryCriteria('bankable_id', $supplier->id),
            );

            $item = $this->entityService->getById($itemId);
            $this->entityService->update($item, $request->validated());

            $item->load('bank');
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new BankAccountResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(Supplier $supplier, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteriaCollection(
                QueryCriteriaCollection::OPERATOR_AND,
                new QueryCriteria('bankable_type', $supplier::class),
                new QueryCriteria('bankable_id', $supplier->id),
            );

            $item = $this->entityService->getById($itemId);
            $this->entityService->destroy($item);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }
}
