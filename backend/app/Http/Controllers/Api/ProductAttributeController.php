<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Product\ProductAttributeResource;
use App\Models\Product;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class ProductAttributeController extends BaseController
{
    #[NoReturn]
    public function __construct(private Product $_model) {}

    public function update(Request $request, $productId, $attributeId): JsonResponse
    {
        try {
            $attribute = $this->findProductAttribute($productId, $attributeId);
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], $e->getCode());
        }

        $pivot = $attribute->pivot;

        $requestFields = $request->only('value');
        $validator = Validator::make($requestFields, [
            'value' => 'string'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $pivot->update($requestFields);

        return $this->sendResponse(new ProductAttributeResource($attribute), 'Atributo do produto atualizado.');
    }

    /**
     * @throws Exception
     */
    protected function findProductAttribute($productId, $attributeId)
    {
        $product = $this->_model->find($productId);

        if (!$product) {
            throw new Exception('Produto não encontrado', 404);
        }

        $attribute = $product->pAttributes()->where('attribute_id', (int)$attributeId)->first();

        if (!$attribute) {
            throw new Exception('Atributo não encontrado' . __FILE__, 404);
        }

        return $attribute;
    }

    public function detach($productId, $attributeId): JsonResponse
    {
        try {
            $attribute = $this->findProductAttribute($productId, $attributeId);
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), [], $e->getCode());
        }

        $pivot = $attribute->pivot;
        $pivot->delete();

        return $this->sendResponse([], 'Atributo removido');
    }
}
