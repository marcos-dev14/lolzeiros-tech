<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SupplierInstallmentRuleResource;
use App\Models\SupplierInstallmentRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class SupplierInstallmentRuleController extends BaseController
{
    #[NoReturn]
    public function __construct(private SupplierInstallmentRule $_model) {}

    public function store(Request $request, int $supplierId): JsonResponse
    {
        $requestFields = $request->only($this->_model->getFillable());
        $requestFields['supplier_id'] = $supplierId;
        $validator = Validator::make($requestFields, $this->_model->validationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item = $this->_model->fill($requestFields);
        $item->save();

        return $this->sendResponse(new SupplierInstallmentRuleResource($item), 'Registro adicionado com sucesso.');
    }

    public function update(Request $request, int $supplierId, $itemId): JsonResponse
    {
        $item = $this->_model->where('supplier_id', $supplierId)->find($itemId);

        if (!$item) {
            return $this->sendError('Registro não encontrado', [], 404);
        }

        $requestFields = $request->only($this->_model->getFillable());
        $validator = Validator::make($requestFields, $this->_model->validationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item->update($requestFields);

        return $this->sendResponse(new SupplierInstallmentRuleResource($item), 'Registro atualizado.');
    }

    public function destroy(int $supplierId, $itemId): JsonResponse
    {
        $item = $this->_model->where('supplier_id', $supplierId)->find($itemId);

        if (!$item) {
            return $this->sendError('Registro não encontrado', [], 404);
        }

        $item->delete();

        return $this->sendResponse([], 'Registro removido');
    }
}
