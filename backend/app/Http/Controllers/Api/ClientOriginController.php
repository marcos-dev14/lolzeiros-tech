<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\JustNameResource;
use App\Models\ClientOrigin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class ClientOriginController extends BaseController
{
    #[NoReturn]
    public function __construct(private ClientOrigin $_model) {}

    public function index(Request $request): JsonResponse
    {
        $builder = $this->_model->latest();

        if ($request->paginated == 'true') {
            $items = $builder->paginate();

            return $this->sendResponse(
                JustNameResource::collection($items)->response()->getData(),
                'Registros encontrados.'
            );
        }

        $items = $builder->get();

        return $this->sendResponse(JustNameResource::collection($items), 'Registros encontrados.');
    }

    public function store(Request $request): JsonResponse
    {
        $requestFields = $request->only($this->_model->getFillable());
        $validator = Validator::make($requestFields, $this->_model->validationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item = $this->_model->fill($requestFields);
        $item->save();

        return $this->sendResponse(new JustNameResource($item), 'Registro adicionado com sucesso.');
    }

    public function update(Request $request, $itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError('Registro não encontrado', [], 404);
        }

        $requestFields = $request->only($this->_model->getFillable());
        $validator = Validator::make($requestFields, $this->_model->validationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item->update($requestFields);

        return $this->sendResponse(new JustNameResource($item), 'Registro atualizado.');
    }

    public function destroy($itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError('Registros não encontrado', [], 404);
        }

        $item->delete();

        return $this->sendResponse([], 'Registros removido');
    }
}
