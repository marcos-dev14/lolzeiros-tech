<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Product\AttributeCategoryResource;
use App\Models\AttributeCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;

class AttributeCategoryController extends BaseController
{
    #[NoReturn]
    public function __construct(private AttributeCategory $_model) {}

    public function index(Request $request): JsonResponse
    {
        $builder = $this->_model->with('attributes')->latest();

        if ($request->paginated == 'true') {
            $categories = $builder->paginate();

            return $this->sendResponse(
                AttributeCategoryResource::collection($categories)->response()->getData(),
                'Categorias de Atributo encontradas.'
            );
        }

        $categories = $builder->get();

        return $this->sendResponse(AttributeCategoryResource::collection($categories), 'Categorias de Atributo encontradas.');
    }

    public function show($id): JsonResponse
    {
        $category = $this->_model->with('attributes')->find($id);

        if (is_null($category)) {
            return $this->sendError('Categoria de Atributo não existe', [], 404);
        }

        return $this->sendResponse(new AttributeCategoryResource($category), 'Categoria de Atributo encontrada');
    }

    public function store(Request $request): JsonResponse
    {
        $requestFields = $request->only($this->_model->getFillable());
        $validator = Validator::make($requestFields, ['name' => 'required|min:4']);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $category = $this->_model->fill($requestFields);
        $category->save();

        return $this->sendResponse(new AttributeCategoryResource($category), 'Categoria de Atributo adicionado com sucesso.');
    }

    public function update(Request $request, $categoryId): JsonResponse
    {
        $category = $this->_model->find($categoryId);

        if (!$category) {
            return $this->sendError('Categoria de Atributo não encontrada', [], 404);
        }

        $requestFields = $request->only($this->_model->getFillable());
        $validator = Validator::make($requestFields, ['name' => 'min:4']);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $category->update($requestFields);
        $category->load('attributes');

        return $this->sendResponse(new AttributeCategoryResource($category), 'Categoria de Atributo atualizado.');
    }

    public function destroy($categoryId): JsonResponse
    {
        $category = $this->_model->find($categoryId);

        if (!$category) {
            return $this->sendError('Categoria de Atributo não encontrada', [], 404);
        }

        if (count($category->products)) {
            return $this->sendError('A Categoria não pode ser excluida pois têm vínculo com produtos', [], 404);
        }

        $category->delete();

        return $this->sendResponse([], 'Categoria de Atributo removida');
    }
}
