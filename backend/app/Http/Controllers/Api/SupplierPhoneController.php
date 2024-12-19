<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SupplierPhoneResource;
use App\Models\Client;
use App\Models\SupplierPhone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class SupplierPhoneController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Client $_baseModel,
        private SupplierPhone $_model
    ) {}

    public function index(Request $request, int $supplierId): JsonResponse
    {
        $supplier = $this->_baseModel->find($supplierId);

        if (!$supplier) {
            return $this->sendError('Representada não existe', [], 404);
        }

        $builder = $this->_model->where('supplier_id', $supplierId)->latest();

        if ($request->paginated == 'true') {
            $items = $builder->paginate();

            return $this->sendResponse(
                SupplierPhoneResource::collection($items)->response()->getData(),
                'Telefones encontrados.'
            );
        }

        $items = $builder->get();

        return $this->sendResponse(SupplierPhoneResource::collection($items), 'Telefones encontrados.');
    }

    public function store(Request $request, int $supplierId): JsonResponse
    {
        $requestFields = $request->only($this->_model->getFillable());
        $requestFields['supplier_id'] = $supplierId;
        $validator = Validator::make($requestFields, [
            'type' => 'required|in:phone,cellphone,whatsapp',
            'country_code' => 'required',
            'number' => 'required',
            'supplier_id' => 'required|exists:product_suppliers,id,deleted_at,NULL'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item = $this->_model->fill($requestFields);
        $item->save();

        return $this->sendResponse(new SupplierPhoneResource($item), 'Telefone adicionado com sucesso.');
    }

    public function update(Request $request, int $supplierId, int $itemId): JsonResponse
    {
        $item = $this->_model->where('supplier_id', $supplierId)->find($itemId);

        if (!$item) {
            return $this->sendError('Telefone não encontrado', [], 404);
        }

        $requestFields = $request->only($this->_model->getFillable());
        $requestFields['supplier_id'] = $supplierId;
        $validator = Validator::make($requestFields, [
            'type' => 'in:phone,cellphone,whatsapp',
            'supplier_id' => 'exists:product_suppliers,id,deleted_at,NULL'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item->update($requestFields);

        return $this->sendResponse(new SupplierPhoneResource($item), 'Telefone atualizado.');
    }

    public function destroy(int $supplierId, int $itemId): JsonResponse
    {
        $item = $this->_model->where('supplier_id', $supplierId)->find($itemId);

        if (!$item) {
            return $this->sendError('Telefone não encontrado', [], 404);
        }

        $item->delete();

        return $this->sendResponse([], 'Telefone removido');
    }
}
