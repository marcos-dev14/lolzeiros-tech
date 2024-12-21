<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\SellerRequest;
use App\Http\Resources\SellerResource;
use App\Models\Seller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use JetBrains\PhpStorm\NoReturn;

class SellerController extends BaseController
{
    #[NoReturn]
    public function __construct(private Seller $_model) {}

    public function index(Request $request): JsonResponse
    {
        $builder = $this->_model->orderBy('name');

        if ($request->paginated == 'true') {
            $items = $builder->paginate();

            return $this->sendResponse(
                SellerResource::collection($items)->response()->getData(),
                'Vendedores encontrados.'
            );
        }

        $items = $builder->get();

        return $this->sendResponse(SellerResource::collection($items), 'Vendedores encontrados.');
    }

    public function show(int $itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError('Vendedor não encontrado.', 404);
        }

        return $this->sendResponse(new SellerResource($item), 'Vendedor encontrado.');
    }


    public function store(SellerRequest $request): JsonResponse
    {
        $requestFields = $request->validated();

        if (isset($requestFields['password'])) {
            $requestFields['password'] = bcrypt($requestFields['password']);
        }

        $item = $this->_model->create($requestFields);

        return $this->sendResponse(new SellerResource($item), 'Vendedor adicionado com sucesso.');
    }


    public function update(SellerRequest $request, $itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError('Vendedor não encontrado', [], 404);
        }

        $data = $request->validated();

        if (isset($data['password'])) {

            $data['password'] = bcrypt($data['password']);
        }

        $item->update($data);

        return $this->sendResponse(new SellerResource($item), 'Vendedor atualizado.');
    }

    public function destroy($itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError('Vendedor não encontrado', [], 404);
        }

        $item->delete();

        return $this->sendResponse([], 'Vendedor removido');
    }
}
