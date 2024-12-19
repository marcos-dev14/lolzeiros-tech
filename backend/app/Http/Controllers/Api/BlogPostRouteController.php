<?php

namespace App\Http\Controllers\Api;

use App\Models\BlogPost;
use App\Models\Route;
use App\Services\RouteService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;

class BlogPostRouteController extends BaseController
{
    public function __construct(
        private RouteService $_routeService,
        private Route $_model,
        private BlogPost $_postModel
    ) {}

    public function isAvailable(Request $request, int $postId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'url' => 'required|string'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $post = $this->_postModel->find($postId);

        if (!$post) {
        //    return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        if (!$this->checkAvailability($post, $this->cleanUrl($request->url))) {
            return $this->sendError('Esta URL não está disponível para uso', [], 400);
        }

        return $this->sendResponse([], 'URL disponível para uso.');
    }

    protected function checkAvailability(Model $post, $requestedUrl): bool
    {
        return $this->_model->isAvailable($post, $requestedUrl);
    }

    protected function cleanUrl($requestedUrl): string
    {
        $requestedUrl = str_replace(url('/'), '', $requestedUrl);

        if (str_starts_with($requestedUrl, '/')) {
            $requestedUrl = substr($requestedUrl, 1);
        }

        return $requestedUrl;
    }

    public function update(Request $request, int $postId): JsonResponse
    {
        $post = $this->_postModel->find($postId);

        if (!$post) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $validator = Validator::make($request->all(), [
            'url' => 'required|string'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $url = $this->cleanUrl($request->url);
        $fullUrl = url($url);

        if (!$this->checkAvailability($post, $url)) {
            return $this->sendError('Esta URL não está disponível para uso', [], 400);
        }

        try {
            if (!empty($post->route)) {
                $route = $post->route;

                if ($route->url == $url) {
                    return $this->sendResponse([], 'A URL informada é igual a atual, não necessita de atualização');
                }

                $route->update([
                    'url' => $url,
                    'full_url' => $fullUrl
                ]);

                return $this->sendResponse([
                    'url' => $url,
                    'full_url' => $fullUrl
                ], 'URL atualizada com sucesso');
            }

            $this->_routeService->store($post, $url);
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage());
        }

        return $this->sendResponse([
            'url' => $url,
            'full_url' => $fullUrl
        ], 'URL adicionada com sucesso');
    }
}
