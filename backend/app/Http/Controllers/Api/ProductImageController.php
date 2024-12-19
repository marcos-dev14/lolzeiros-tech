<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\GalleryImageResource;
use App\Models\GalleryImage;
use App\Models\Product;
use App\Services\GalleryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;
use Mavinoo\Batch\BatchFacade;

class ProductImageController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private Product        $_model,
        private GalleryService $_galleryService
    ) {}

    public function store(Request $request, $productId): JsonResponse
    {
        $images = $request->images;
        $isMain = $request->routeIs('api.product.main-images.store');

        if (empty($request->images)) {
            return $this->sendError('Envie pelo menos uma imagem', ['images' => ["O campo images é obrigatório"]], 400);
        }

        if (!is_array($images) && !$isMain) {
            $images = [$images];
        }

        $validator = Validator::make(['images' => $images], [
            'images' => 'required',
            'images.*' => 'mimes:png,jpeg,jpg'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $product = $this->_model->find($productId);

        if (is_null($product)) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $path = str_replace('{id}', $product->id, $this->_model::IMAGEABLE_PATH);

        try {
            $method = $isMain ? 'storeMain' : 'store';
            $this->_galleryService->$method(
                $product,
                $images,
                $path,
                '1200x1200',
                "$product->title-$product->reference-" . rand(100, 999)
            );
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500);
        }

        return $this->sendResponse([], 'Imagens enviadas com sucesso.');
    }

    public function destroy($productId, $imageId): JsonResponse
    {
        $product = $this->_model->find($productId);

        if (is_null($product)) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $image = $product->images()->find($imageId);

        if (!$image) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $path = str_replace('{id}', $product->id, $this->_model::IMAGEABLE_PATH);
        $this->_galleryService->destroy($path, $image);

        return $this->sendResponse([], 'Imagem removida');
    }

    public function sort(Request $request, $productId): JsonResponse
    {
        $product = $this->_model->find($productId);

        if (is_null($product)) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $validator = Validator::make($request->fields, [
            '*.id' => 'required|distinct',
            '*.order' => 'required|int|distinct'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        BatchFacade::update(new (GalleryImage::class), $request->fields, 'id');

        $images = $product->images->sortBy('order');

        return $this->sendResponse(GalleryImageResource::collection($images), 'Imagens ordenadas com sucesso.');
    }
}
