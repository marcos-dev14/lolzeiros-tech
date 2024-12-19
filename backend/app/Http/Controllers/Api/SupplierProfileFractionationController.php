<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\JustNameRequest;
use App\Http\Requests\SupplierProfileFractionationRequest;
use App\Http\Resources\JustNameResource;
use App\Http\Resources\SupplierProfileFractionalResource;
use App\Models\Supplier;
use App\Services\SupplierProfileFractionalService;
use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class SupplierProfileFractionationController extends BaseController
{
    #[NoReturn]
    public function __construct(protected SupplierProfileFractionalService $entityService) {}

    public function store(SupplierProfileFractionationRequest $request): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteriaCollection(
                QueryCriteriaCollection::OPERATOR_AND,
                new QueryCriteria('client_profile_id', $request->client_profile_id),
                new QueryCriteria('product_supplier_id', $request->product_supplier_id),
            );

            $exists = $this->entityService->all(false)->count();

            if ($exists) {
                return $this->sendError("Já existe uma configuração para este perfil", [], 400);
            }

            $item = $this->entityService->make($request->validated());

            $this->entityService->criteria = null;
            $this->entityService->relations = ['profile'];
            $item = $this->entityService->getById($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new SupplierProfileFractionalResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(SupplierProfileFractionationRequest $request, int $supplierId, int $itemId): JsonResponse
    {
        try {
            $this->entityService->criteria = new QueryCriteriaCollection(
                QueryCriteriaCollection::OPERATOR_AND,
                new QueryCriteria('client_profile_id', $request->client_profile_id),
                new QueryCriteria('product_supplier_id', $request->product_supplier_id),
                new QueryCriteria('id', $itemId, '!=')
            );

            $exists = $this->entityService->all(false)->count();

            if ($exists) {
                return $this->sendError("Já existe outra configuração para o perfil informado", [], 400);
            }

            $this->entityService->criteria = null;
            $this->entityService->relations = ['profile'];

            $this->entityService->update($itemId, $request->validated());
            $item = $this->entityService->getById($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new SupplierProfileFractionalResource($item),
            Lang::get('custom.register_updated')
        );
    }

    public function destroy(int $supplierId, int $itemId): JsonResponse
    {
        try {
            $this->entityService->destroy($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }
}
