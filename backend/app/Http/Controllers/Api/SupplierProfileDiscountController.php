<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SupplierDiscountResource;
use App\Models\SupplierDiscount;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class SupplierProfileDiscountController extends BaseController
{
    #[NoReturn]
    public function __construct(private SupplierDiscount $_model) {}

    public function store(Request $request, int $supplierId): JsonResponse
    {
        $requestFields = $request->only($this->_model->getProfileDiscountFillable());
        $requestFields['type'] = 'profile_discount';
        $requestFields['supplier_id'] = $supplierId;
        $validator = Validator::make($requestFields, $this->_model->profileDiscountValidationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item = $this->_model->fill($requestFields);
        $item->save();

        if ($request->categories) {
            $item->categories()->sync(explode(',', $request->categories));
        }

        $item->load('profile', 'categories');

        return $this->sendResponse(new SupplierDiscountResource($item), 'Registro adicionado com sucesso.');
    }

    public function update(Request $request, int $supplierId, $itemId): JsonResponse
    {
        $item = $this->_model->profileDiscount()->where('supplier_id', $supplierId)->find($itemId);

        if (!$item) {
            return $this->sendError('Registro não encontrado', [], 404);
        }

        $requestFields = $request->only($this->_model->getProfileDiscountFillable());
        $requestFields['type'] = $item->type;
        $validator = Validator::make($requestFields, $this->_model->profileDiscountValidationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item->update($requestFields);

        $item->categories()->sync($request->categories ? explode(',', $request->categories): []);
        $item->load('categories', 'profile');

        return $this->sendResponse(new SupplierDiscountResource($item), 'Registro atualizado.');
    }

    public function destroy(int $supplierId, $itemId): JsonResponse
    {
        $item = $this->_model->profileDiscount()->where('supplier_id', $supplierId)->find($itemId);

        if (!$item) {
            return $this->sendError('Registro não encontrado', [], 404);
        }

        $item->categories()->detach();
        $item->delete();

        return $this->sendResponse([], 'Registro removido');
    }
}
