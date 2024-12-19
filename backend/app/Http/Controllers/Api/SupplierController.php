<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\SupplierRequest;
use App\Http\Resources\Product\SupplierResource;
use App\Http\Resources\SupplierFromClientResource;
use App\Models\Client;
use App\Models\SupplierDiscount;
use App\Services\SupplierService;
use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use JetBrains\PhpStorm\NoReturn;

class SupplierController extends BaseController
{
    #[NoReturn]
    public function __construct(protected SupplierService $entityService) {}

    public function index(Request $request): JsonResponse
    {
        $this->entityService->counts = ['categories', 'products', 'availableProducts'];

        if (isset($request->sortBy)) {
            $sortByField = $request->sortBy;
            $fillableFields = $this->entityService->model->getFillable();

            if (in_array($sortByField, $fillableFields)) {
                $this->entityService->orderBy = $sortByField;
            }
        }

        if (isset($request->sortDirection)) {
            $sortDirection = $request->sortDirection;
            if (in_array($sortDirection, ['asc', 'desc'])) {
                $this->entityService->orderDirection = $sortDirection;
            }
        }

        $this->enableFilters($request);
        $items = $this->entityService->all($request->paginated);

        // Filtra apenas os itens com status 'Ativo'
        $activeItems = $request->all ? $items : $items->where('is_available', 1)->where('status', 'Ativo');

        if ($request->paginated) {
            $activeItems = $activeItems->paginate($request->per_page ?? 50);
        } else {
            $activeItems = $activeItems->all();
        }

        // Verifica se os itens são pagináveis
        if ($activeItems instanceof LengthAwarePaginator) {
            return $this->sendResponse(
                SupplierResource::collection($activeItems)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        return $this->sendResponse(
            SupplierResource::collection($activeItems),
            Lang::get('custom.found_registers')
        );
    }



    protected function enableFilters(Request $request): void
    {
        $filterNameValue = $request->reference ?? $request->name ?? null;
        if ($filterNameValue) {
            $this->entityService->criteria = new QueryCriteriaCollection(
                'or',
                new QueryCriteria('name', "%$filterNameValue%", 'like'),
                new QueryCriteria('slug', "%$filterNameValue%", 'like')
            );
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $item = $this->entityService->show($id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new SupplierResource($item),
            Lang::get('custom.found_register')
        );
    }

    public function store(SupplierRequest $request): JsonResponse
    {
        try {
            $item = $this->entityService->makeWithImage($request->validated());
            $item = $this->entityService->show($item->id);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new SupplierResource($item),
            Lang::get('custom.register_added'),
            201
        );
    }

    public function update(SupplierRequest $request, int $itemId): JsonResponse
    {
        try {
            $this->entityService->updateWithImage($itemId, $request->validated());
            $item = $this->entityService->show($itemId);
        } catch (\Throwable $e) {
            return $this->sendError($e->getMessage(), [], $this->getExceptionCode($e));
        }

        return $this->sendResponse(
            new SupplierResource($item),
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

    public function getByClient(Client $client): JsonResponse
    {
        $clientMainAddress = $client->main_address;
        $clientStateCode = $clientMainAddress?->state?->code;
        $clientProfile = $client->client_profile_id;
        $this->entityService->fields = ['id', 'name', 'is_available', 'fractional_box'];
        $this->entityService->relations = ['profileDiscounts', 'stateDiscounts.states'];
        $suppliers = $this->entityService->all(false)->where('is_available', 1);
        $data = [];

        foreach ($suppliers as $supplier) {

            $supplierDiscounts = $supplier->profileDiscounts;
            $discountToClientProfile = $supplierDiscounts->where('client_profile_id', $clientProfile)->first();

            $stateDiscountFromClientState = $supplier->stateDiscounts()->whereHas('states', function ($query) use ($clientStateCode) {
                $query->where('code', $clientStateCode);
            })->first();

            $icmsDiscount = 0;
            if ($stateDiscountFromClientState instanceof SupplierDiscount) {
                $icmsDiscount += floatval($stateDiscountFromClientState->discount_value);
                $icmsDiscount += floatval($stateDiscountFromClientState->additional_value);
            }

            $lastOrder = $client->orders
                ->where('product_supplier_id', $supplier->id)
                ->sortByDesc('created_at')
                ->first();

            $lastOrderDate = $lastOrder ? $lastOrder->created_at : null;

            $data[] = [
                'name' => $supplier->name,
                'profile_discount' => $discountToClientProfile->discount_value ?? 0,
                'commercial_commission' => $discountToClientProfile->commercial_commission ?? 0,
                'is_available' => $supplier->is_available,
                'icms' => $icmsDiscount,
                'fractional_box' => $supplier->fractional_box,
                'last_order' => $lastOrderDate
            ];
        }

        return $this->sendResponse(
            SupplierFromClientResource::collection($data),
            Lang::get('custom.found_registers')
        );
    }
}
