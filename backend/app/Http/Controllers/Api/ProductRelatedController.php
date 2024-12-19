<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Product\AttributeCategoryResource;
use App\Models\AttributeCategory;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class ProductRelatedController extends BaseController
{
    #[NoReturn]
    public function __construct(private Product $_model) {}

    public function store(Request $request, $id): JsonResponse
    {
        $attachProductId = $request->attach_product_id;
        $attachProduct = $this->_model->select(['id'])->find($attachProductId);
        $product = $this->_model->select(['id'])->with('related')->find($id);

        if (is_null($product)) {
            return $this->sendError('Produto não existe', [], 404);
        } elseif (is_null($attachProduct)) {
            return $this->sendError('Produto relacionado não existe', [], 404);
        } elseif ($product->related->contains($attachProductId)) {
            return $this->sendError('Os produtos informados já foram relacionados', [], 400);
        }

        $product->related()->attach($attachProduct);

        return $this->sendResponse([], 'Produto relacionado com sucesso.');
    }

    public function destroy($id, $detachProductId): JsonResponse
    {
        $detachProduct = $this->_model->select(['id'])->find($detachProductId);
        $product = $this->_model->select(['id'])->with('related')->find($id);

        if (is_null($product)) {
            return $this->sendError('Produto não existe', [], 404);
        } elseif (is_null($detachProduct)) {
            return $this->sendError('Produto relacionado não existe', [], 404);
        } elseif (!$product->related->contains($detachProductId)) {
            return $this->sendError('Os produtos informados não possuem relacão', [], 400);
        }

        $product->related()->detach($detachProduct);

        return $this->sendResponse([], 'Produto relacionado removido com sucesso.');
    }
}
