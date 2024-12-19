<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\JustNameResource;
use App\Models\ClientProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class ClientProfileController extends BaseController
{
    #[NoReturn]
    public function __construct(private ClientProfile $_model) {}

    public function index(Request $request): JsonResponse
    {
        $builder = $this->_model->latest();

        if ($request->paginated == 'true') {
            $items = $builder->paginate();

            return $this->sendResponse(
                JustNameResource::collection($items)->response()->getData(),
                'Perfis encontrados.'
            );
        }

        $items = $builder->get();

        return $this->sendResponse(JustNameResource::collection($items), 'Perfis encontrados.');
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

        return $this->sendResponse(new JustNameResource($item), 'Perfil adicionado com sucesso.');
    }

    public function update(Request $request, $itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError('Perfil não encontrado', [], 404);
        }

        $requestFields = $request->only($this->_model->getFillable());
        $validator = Validator::make($requestFields, $this->_model->validationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item->update($requestFields);

        return $this->sendResponse(new JustNameResource($item), 'Perfil atualizado.');
    }

    public function destroy($itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError('Perfil não encontrado', [], 404);
        }

        if ($item->id < 4) {
            return $this->sendError('Este perfil não pode ser removido', [], 400);
        }

        $item->delete();

        return $this->sendResponse([], 'Perfil removido');
    }
}
