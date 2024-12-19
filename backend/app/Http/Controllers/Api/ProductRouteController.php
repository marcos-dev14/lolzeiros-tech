<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\Route;
use App\Services\RouteService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductRouteController extends BaseController
{
    public function __construct(
        private RouteService $_routeService,
        private Route $_model,
        private Product $_productModel
    ) {}

    public function isAvailable(Request $request, int $productId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'url' => 'required|string'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $product = $this->_productModel->find($productId);

        if (!$product) {
            return $this->sendError('Produto não encontrado');
        }

        if (!$this->checkAvailability($product, $this->cleanUrl($request->url))) {
            return $this->sendError('Esta URL não está disponível para uso', [], 400);
        }

        return $this->sendResponse([], 'URL disponível para uso.');
    }

    protected function checkAvailability(Model $product, $requestedUrl): bool
    {
        return $this->_model->isAvailable($product, $requestedUrl);
    }

    protected function cleanUrl($requestedUrl): string
    {
        $basePath = url('/');

        return str_replace($basePath, '', $requestedUrl);
    }

    public function update(Request $request, int $productId): JsonResponse
    {
        $product = $this->_productModel->find($productId);

        if (!$product) {
            return $this->sendError('Produto não encontrado');
        }

        $validator = Validator::make($request->all(), [
            'url' => 'required|string'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $url = $this->cleanUrl($request->url);
        $fullUrl = url($url);
        if (!$this->checkAvailability($product, $url)) {
            return $this->sendError('Esta URL não está disponível para uso', [], 400);
        }

        try {
            if (!empty($product->route)) {
                $route = $product->route;

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

            $this->_routeService->store($product, $url);
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage());
        }

        return $this->sendResponse([
            'url' => $url,
            'full_url' => $fullUrl
        ], 'URL adicionada com sucesso');
    }
}
