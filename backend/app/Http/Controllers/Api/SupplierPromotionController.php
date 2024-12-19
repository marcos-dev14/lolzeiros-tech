<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\SupplierPromotionResource;
use App\Models\Category;
use App\Models\Product;
use App\Models\SupplierPromotion;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class SupplierPromotionController extends BaseController
{
    #[NoReturn]
    public function __construct(private SupplierPromotion $_model) {}

    public function store(Request $request, int $supplierId): JsonResponse
    {
        $fields = array_merge($this->_model->getFillable(), ['items']);
        $requestFields = array_merge(['supplier_id' => $supplierId], $request->only($fields));

        $validationRules = $this->_model->validationRules;
        $validationRules['items'] = 'required';
        $validator = Validator::make($requestFields, $validationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $items = array_pop($requestFields);

        $promotion = $this->_model->fill(
            collect($requestFields)->except('items')->toArray()
        );
        $promotion->save();

        $this->attachItems($promotion, $supplierId, $items);
        $promotion->load($promotion->type);

        return $this->sendResponse(
            new SupplierPromotionResource($promotion),
            'Registro adicionado com sucesso.'
        );
    }

    public function update(Request $request, int $supplierId, $itemId): JsonResponse
    {
        $promotion = $this->_model
            ->with(['products', 'categories'])
            ->where('supplier_id', $supplierId)
            ->find($itemId);

        if (!$promotion) {
            return $this->sendError('Registro não encontrado', [], 404);
        }

        if (!isset($request->items)) {
            $request['items'] = [];
        }

        $requestFields = $request->only(array_merge($this->_model->getFillable(), ['items']));
        $validator = Validator::make($requestFields, $this->_model->validationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $newItems = $requestFields['items'];
        if ($promotion->type !== $requestFields['type'] || !empty($newItems)) {
            $oldType = (string)$promotion->type;

            if (!empty($promotion->$oldType)) {
                $promotion->$oldType()->detach($promotion->$oldType->pluck('id')->toArray());
            }
        }

        if (!empty($newItems)) {
            $this->attachItems($promotion, $supplierId, $newItems);
        }

        $promotion->load($promotion->type);
        $promotion->update($requestFields);

        return $this->sendResponse(new SupplierPromotionResource($promotion), 'Registro atualizado.');
    }

    protected function attachItems(Model $promotion, int $supplierId, $items)
    {
        if (is_string($items)) {
            $items = explode(',', $items);
        }

        foreach ($items as $item) {
            $type = $promotion->type;
            $queryModel = $type == 'categories'
                ? Category::select('id', 'supplier_id')
                : Product::select('id', 'supplier_id');
            $itemInstance = $queryModel->where('supplier_id', $supplierId)->find((int)$item);

            if ($itemInstance instanceof Model) {
                $promotion->$type()->attach($itemInstance);
            }
        }
    }

    public function destroy(int $supplierId, $itemId): JsonResponse
    {
        $item = $this->_model->where('supplier_id', $supplierId)->find($itemId);

        if (!$item) {
            return $this->sendError('Registro não encontrado', [], 404);
        }

        $type = $item->type;
        $item->$type()->detach();
        $item->delete();

        return $this->sendResponse([], 'Registro removido');
    }
}
