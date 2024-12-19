<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController;
use App\Http\Resources\Product\AttributeResource;
use App\Models\Attribute;
use App\Models\AttributeCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JetBrains\PhpStorm\NoReturn;
use Mavinoo\Batch\BatchFacade;
use Illuminate\Support\Str;

class AttributeController extends BaseController
{
    #[NoReturn]
    public function __construct(
        private AttributeCategory $_baseModel,
        private Attribute $_model
    ) {}

    public function index(Request $request, int $categoryId): JsonResponse
    {
        $builder = $this->_model->where('attribute_category_id', $categoryId)->latest();

        if ($request->paginated == 'true') {
            $attributes = $builder->paginate();

            return $this->sendResponse(
                AttributeResource::collection($attributes)->response()->getData(),
                'Atributos encontrados.'
            );
        }

        $attributes = $builder->get();

        return $this->sendResponse(AttributeResource::collection($attributes), 'Atributos encontrados.');
    }

    public function show(int $attributeCategoryId, int $id): JsonResponse
    {
        $attribute = $this->_model->find($id);

        if (is_null($attribute)) {
            return $this->sendError('Atributo não existe', [], 404);
        }

        return $this->sendResponse(new AttributeResource($attribute), 'Atributo encontrado');
    }

    public function store(Request $request, AttributeCategory $attributeCategory): JsonResponse
    {
        $requestFields = $request->only($this->_model->getFillable());
        $validator = Validator::make($requestFields, [
            'name' => 'required|min:4',
            'values' => 'string'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $requestFields = $requestFields + [
            'order' => $this->getNextOrder($attributeCategory),
            'attribute_category_id' => $attributeCategory->id
        ];

        $attribute = $this->_model->fill($requestFields);
        $attribute->save();

        return $this->sendResponse(new AttributeResource($attribute), 'Atributo adicionado com sucesso.');
    }

    protected function getNextOrder(AttributeCategory $attributeCategory): int
    {
        return $attributeCategory
            ->attributes()
            ->latest()
            ->pluck('order')
            ->first() + 1;
    }

    public function update(Request $request, int $attributeCategory, $attributeId): JsonResponse
    {
        $attribute = $this->_model->find($attributeId);

        if (!$attribute) {
            return $this->sendError('Atributo não encontrado: ' . __FILE__, [], 404);
        }

        $requestFields = $request->only($this->_model->getFillable());
        $validator = Validator::make($requestFields, [
            'name' => 'min:4',
            'values' => 'string'
        ]);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $attribute->update($requestFields);

        return $this->sendResponse(new AttributeResource($attribute), 'Atributo atualizado.');
    }

    public function destroy(int $attributeCategory, $attributeId): JsonResponse
    {
        $attribute = $this->_model->find($attributeId);

        if (!$attribute) {
            return $this->sendError('Atributo não encontrado' . __FILE__, [], 404);
        }

        $attribute->delete();

        return $this->sendResponse([], 'Atributo removido');
    }

    public function sort(Request $request, AttributeCategory $attributeCategory): JsonResponse
    {
        if (!empty($request->fields)) {
            $validator = Validator::make($request->fields, [
                '*.id' => 'required|distinct',
                '*.order' => 'required|int|distinct'
            ]);

            if ($validator->fails()) {
                return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
            }

            BatchFacade::update(new ($this->_model::class), $request->fields, 'id');

            $attributes = $attributeCategory->attributes->sortBy('order');

            return $this->sendResponse(AttributeResource::collection($attributes), 'Atributos ordenados com sucesso');
        }

        $attributes = $attributeCategory->attributes->each(function ($attribute) {
            $attribute['slug'] = Str::slug($attribute->name);

            return $attribute;
        })->sortBy('slug');

        $i = 1;
        foreach ($attributes as $attribute) {
            unset($attribute['slug']);
            $attribute->update(['order' => $i]);
            $i++;
        }

        return $this->sendResponse(AttributeResource::collection($attributes), 'Atributos ordenados com sucesso');
    }
}
