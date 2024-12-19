<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SupplierPaymentPromotionResource;
use App\Models\SupplierPaymentPromotion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class SupplierPaymentPromotionController extends BaseController
{
    #[NoReturn]
    public function __construct(private SupplierPaymentPromotion $_model) {}

    public function store(Request $request, int $supplierId): JsonResponse
    {
        $requestFields = $request->only($this->_model->getFillable());
        $requestFields['supplier_id'] = $supplierId;
        $validator = Validator::make($requestFields, $this->_model->validationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $exists = $this->_model
            ->where('order_deadline', reformatDateString($request->order_deadline))
            ->where('min_value', $request->min_value)
            ->where('payment_term_start', reformatDateString($request->payment_term_start))
            ->where('supplier_id', $supplierId)
            ->count();

        if ($exists) {
            return $this->sendError("Já existe um registro com os mesmos dados", [], 400);
        }

        $item = $this->_model->fill($requestFields);
        $item->save();

        return $this->sendResponse(new SupplierPaymentPromotionResource($item), 'Promoção adicionada com sucesso.');
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

        return $this->sendResponse(new SupplierPaymentPromotionResource($item), 'Registro atualizado.');
    }

    public function destroy(int $supplierId, $itemId): JsonResponse
    {
        $item = $this->_model->where('supplier_id', $supplierId)->find($itemId);

        if (!$item) {
            return $this->sendError('Promoção não encontrada', [], 404);
        }

        $item->delete();

        return $this->sendResponse([], 'Promoção removida');
    }
}
