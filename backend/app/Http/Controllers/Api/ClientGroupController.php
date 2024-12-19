<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\ClientGroupResource;
use App\Models\ClientGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class ClientGroupController extends BaseController
{
    #[NoReturn]
    public function __construct(private ClientGroup $_model) {}

    public function index(Request $request): JsonResponse
    {
        $builder = $this->_model->orderBy('name');

        $builder->withCount('clients')->with('buyer');

        if (!empty($request->search)) {
            $searchTerms = $request->search;
            $builder->where(function ($query) use ($searchTerms) {
                $query->where('name', 'like', "%$searchTerms%");
            });
        }

        $hasBuyer = $request->has_buyer;
        if (!empty($hasBuyer)) {
            if ($hasBuyer === 'true') {
                $builder->whereHas('buyer');
            } else {
                $builder->whereDoesntHave('buyer');
            }
        }

        if ($request->paginated == 'true') {
            $items = $builder->paginate(50);

            return $this->sendResponse(
                ClientGroupResource::collection($items)->response()->getData(),
                'Grupos encontrados.'
            );
        }

        $items = $builder->get();

        return $this->sendResponse(ClientGroupResource::collection($items), 'Grupos encontrados.');
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

        return $this->sendResponse(new ClientGroupResource($item), 'Grupo adicionado com sucesso.');
    }

    public function show($id): JsonResponse
    {
        $item = $this->_model->with(['buyer', 'clients'])->withCount('clients')->find($id);

        if (is_null($item)) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        return $this->sendResponse(new ClientGroupResource($item), Lang::get('custom.found_register'));
    }

    public function update(Request $request, $itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError('Grupo não encontrado', [], 404);
        }

        $requestFields = $request->only($this->_model->getFillable());
        $validator = Validator::make($requestFields, $this->_model->validationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $item->update($requestFields);

        return $this->sendResponse(new ClientGroupResource($item), 'Grupo atualizado.');
    }

    public function destroy($itemId): JsonResponse
    {
        $item = $this->_model->find($itemId);

        if (!$item) {
            return $this->sendError('Grupo não encontrado', [], 404);
        }

        $item->delete();

        return $this->sendResponse([], 'Grupo removido');
    }
}
