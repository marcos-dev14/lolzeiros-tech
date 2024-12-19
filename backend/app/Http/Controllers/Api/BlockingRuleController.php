<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\JustNameResource;
use App\Models\BlockingRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class BlockingRuleController extends BaseController
{
    #[NoReturn]
    public function __construct(private BlockingRule $_model) {}

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
        $requestFields = $request->only('name');
        $validator = Validator::make($requestFields, ['name' => 'required']);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item = $this->_model->fill($requestFields);
        $item->save();

        return $this->sendResponse(new JustNameResource($item), 'Registro adicionado com sucesso.', 201);
    }

    public function update(Request $request, $itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError('Registro não encontrado', [], 404);
        }

        $requestFields = $request->only('name');
        $validator = Validator::make($requestFields, ['name' => 'required']);

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
            return $this->sendError('Registro não encontrado', [], 404);
        }

        $item->delete();

        return $this->sendResponse([], 'Registro removido');
    }
}
