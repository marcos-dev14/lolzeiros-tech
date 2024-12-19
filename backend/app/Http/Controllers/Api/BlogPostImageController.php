<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\GalleryImageResource;
use App\Models\GalleryImage;
use App\Models\BlogPost;
use App\Services\GalleryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;
use Mavinoo\Batch\BatchFacade;

class BlogPostImageController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private BlogPost        $_model,
        private GalleryService $_galleryService
    ) {}

    public function store(Request $request, $postId): JsonResponse
    {
        $images = $request->images;
        $isMain = $request->routeIs('api.blog.post.main-images.store');

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

        $post = $this->_model->find($postId);

        if (is_null($post)) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $path = str_replace('{id}', $post->id, $this->_model::IMAGEABLE_PATH);

        try {
            $method = $isMain ? 'storeMain' : 'store';
            $this->_galleryService->$method(
                $post,
                $images,
                $path,
                '950x630',
                "$post->title-$post->id-" . rand(100, 999)
            );
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 500);
        }

        return $this->sendResponse([], 'Imagens enviadas com sucesso.');
    }

    public function destroy($postId, $imageId): JsonResponse
    {
        $post = $this->_model->find($postId);

        if (is_null($post)) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $image = $post->images()->find($imageId);

        if (!$image) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $path = str_replace('{id}', $post->id, $this->_model::IMAGEABLE_PATH);
        $this->_galleryService->destroy($path, $image);

        return $this->sendResponse([], 'Imagem removida');
    }

    public function sort(Request $request, $postId): JsonResponse
    {
        $post = $this->_model->find($postId);

        if (is_null($post)) {
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

        $images = $post->images->sortBy('order');

        return $this->sendResponse(GalleryImageResource::collection($images), 'Imagens ordenadas com sucesso.');
    }
}
