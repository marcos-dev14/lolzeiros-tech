<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\Product\ProductVariationResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JetBrains\PhpStorm\NoReturn;

class ProductVariationController extends BaseController
{
    #[NoReturn]
    public function __construct(private Product $_model) {}

    public function store(Request $request, $id): JsonResponse
    {
        $attachProductId = $request->attach_product_id;
        $attachProduct = $this->_model->select(['id', 'title', 'reference', 'ean13', 'dun14'])->find($attachProductId);
        $product = $this->_model->select(['id'])->with('variations')->find($id);

        if (is_null($product)) {
            return $this->sendError('Produto não existe', [], 404);
        } elseif (is_null($attachProduct)) {
            return $this->sendError('Variação de produto não existe', [], 404);
        } elseif ($product->variations->contains($attachProductId)) {
            return $this->sendError('Os produtos informados já estão relacionados', [], 400);
        }

        $product->variations()->attach($attachProduct);

        return $this->sendResponse(
            new ProductVariationResource($attachProduct),
            'Variação de Produto adicionada com sucesso.'
        );
    }

    public function destroy($id, $detachProductId): JsonResponse
    {
        $detachProduct = $this->_model->select(['id'])->find($detachProductId);
        $product = $this->_model->select(['id'])->with('variations')->find($id);

        if (is_null($product)) {
            return $this->sendError('Produto não existe', [], 404);
        } elseif (is_null($detachProduct)) {
            return $this->sendError('Variação de produto não existe', [], 404);
        } elseif (!$product->variations->contains($detachProductId)) {
            return $this->sendError('Os produtos informados não estão relacionados', [], 400);
        }

        $product->variations()->detach($detachProduct);

        return $this->sendResponse([], 'Variação de Produto removida com sucesso.');
    }
}
