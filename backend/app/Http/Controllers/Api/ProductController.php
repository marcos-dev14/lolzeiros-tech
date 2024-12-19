<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\Product\ProductListResource;
use App\Http\Resources\Product\ProductResource;
use App\Models\BlogPost;
use App\Models\Category;
use App\Models\GalleryImage;
use App\Models\Product;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\NoReturn;

class ProductController extends BaseController
{
    #[NoReturn]
    public function __construct(private Product $_model)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $builder = $this->_model->with([
            'category',
            'brand',
            'badge',
            'post',
            'product',
            'supplier',
            'related',
            'variations',
            'images'
        ])->orderByDesc('updated_at');

        try {
            $builder = $this->filter($builder, $request);
        } catch (Exception $exception) {
            return $this->sendError($exception->getMessage(), [$exception->getMessage()], 400);
        }

        if (!isset($request->paginated) || $request->paginated == 'true') {
            $products = $builder->paginate($request->per_page ?? 200);

            return $this->sendResponse(
                ProductListResource::collection($products)->response()->getData(),
                'Produtos encontrados.'
            );
        }

        $products = $builder->get();

        return $this->sendResponse(ProductListResource::collection($products), 'Produtos encontrados.');
    }

    /**
     * @throws Exception
     */
    protected function filter(Builder $builder, Request $request): Builder
    {
        $filters = $request->only(
            'by_brand',
            'by_supplier',
            'by_category',
            'release_year',
            'availability',
            'with_image',
            'with_related',
            'with_embed',
            'with_ncm',
            'with_ipi',
            'has_promotion',
            'slug',
            'title',
            'reference',
            'origin'
        );

        $validator = Validator::make($filters, [
            'by_brand' => 'string|exists:product_brands,id,deleted_at,NULL',
            'by_supplier' => 'string|exists:product_suppliers,id,deleted_at,NULL',
            'by_category' => 'string|exists:product_categories,id,deleted_at,NULL',
            'release_year' => 'integer|min:2010|max:2030',
            'availability' => 'string',
            'slug' => 'string',
            'title' => 'string',
            'reference' => 'string',
            'with_image' => 'string',
            'with_related' => 'string',
            'with_embed' => 'string',
            'has_promotion' => 'string',
            'with_ncm' => 'string',
            'with_ipi' => 'string',
        ]);

        if ($validator->fails()) {
            throw new Exception($validator->errors()->first(), 400);
        }

        if (!empty($filters['by_supplier']) && !empty($filters['by_category'])) {
            $category = Category::find($filters['by_category']);

            if ($category->supplier_id != $filters['by_supplier']) {
                throw new Exception("A categoria informada não pertence a representada informada", 400);
            }
        }

        foreach ($filters as $key => $value) {
            if (str_contains($key, 'by_')) {
                $relation = str_replace('by_', '', $key);
                $builder->with($relation)->where("{$relation}_id", $value);
                continue;
            }

            if (str_contains($key, 'doesnt_has_')) {
                if ($value === 'false') {
                    continue;
                }

                $field = explode('_', $key)[2];
                $builder->whereNull($field)
                    ->orWhere($field, 0.0)
                    ->orWhere($field, 'like', "%ERRO%");
                continue;
            }

            if (str_contains($key, 'has_')) {
                if ($value === 'false') {
                    continue;
                }

                $scope = explode('_', $key);
                $scope = $scope[0] . ucfirst($scope[1]);

                $builder->$scope();
                continue;
            }

            if (str_contains($key, 'with_')) {
                $scope = explode('_', str_replace('with_', 'has_', $key));
                $field = $scope[1];

                if (in_array($field, ['ncm', 'ipi'])) {
                    if ($value !== 'true') {
                        continue;
                    }

                    $builder->fieldEmptyOrInvalid($field);
                    continue;
                }

                $scope = $scope[0] . ucfirst($field);

                if ($value !== 'false') {
                    $builder->$scope();
                    continue;
                }

                $builder->whereNot(function ($query) use ($scope) {
                    $query->$scope();
                });

                continue;
            }

            if ($key == 'title' || $key == 'slug') {
                $builder->like($key, $value);

                continue;
            }

            $builder->where($key, $value);
        }

        return $builder;
    }

    public function show($id): JsonResponse
    {
        $product = $this->_model->with([
            'category',
            'brand',
            'badge',
            'post',
            'product',
            'supplier',
            'related',
            'variations',
            'images',
            'files',
            'pAttributes',
            'attributeCategory'
        ])->find($id);

        if (is_null($product)) {
            return $this->sendError('Produto não existe', [], 404);
        }

        return $this->sendResponse(new ProductResource($product), 'Produto encontrado');
    }

    /**
     * @throws Exception
     */
    public function store(Request $request): JsonResponse
    {
        $requestFields = $request->only($this->_model->getFillable());

        $rules = $this->_model->validationRules;
        $rules['ean13'] = "required|{$rules['ean13']}";
        $rules['reference'] = "required|{$rules['reference']}";
        $rules['title'] = "required";

        $validator = Validator::make($requestFields, $this->_model->validationRules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $referenceExists = $this->_model->where('reference', $requestFields['reference'])
            ->where('supplier_id', $requestFields['supplier_id'])->count();

        if ($referenceExists) {
            return $this->sendError('Esta referência já está sendo utilizada nesta esta representada', [], 400);
        }

        if (!empty($requestFields['supplier_id']) && !empty($requestFields['category_id'])) {
            $category = Category::find($requestFields['category_id']);

            if ($category->supplier_id != $requestFields['supplier_id']) {
                throw new Exception("A categoria informada não pertence a representada informada", 400);
            }
        }

        $requestFields['slug'] = Str::slug($requestFields['title']);
        $requestFields['seo_title'] = substr($requestFields['title'], 0, 65);

        $product = $this->_model->fill($requestFields);
        $product->save();

        return $this->sendResponse(new ProductResource($product), 'Produto adicionado com sucesso.');
    }

    public function update(Request $request, $productId): JsonResponse
    {
        $product = $this->_model->find(id: $productId);
        $productOld = Product::find($productId);

        if (!$product) {
            return $this->sendError('Produto não encontrado', [], 404);
        }

        $requestFields = $request->only($this->_model->getFillable());

        if (empty($requestFields['published_at']) || $requestFields['published_at'] == null) {
            $requestFields['published_at'] = $productOld->published_at;
        }

        $validationRules = $this->_model->validationRules;
        if ($product->supplier?->fractional_box) {
            $validationRules['unit_price'] = str_replace('nullable', 'required', $validationRules['unit_price']);
            $validationRules['unit_minimal'] = str_replace('nullable', 'required', $validationRules['unit_minimal']);
        }

        $validator = Validator::make($requestFields, $validationRules);

        $requestFields['slug'] = Str::slug($requestFields['title'] ?? $product->title);
        $requestFields['embed_type'] = $this->resolveEmbedType($requestFields['embed_type'] ?? null);
        if (!empty($requestFields['embed_id']) && !empty($requestFields['embed_type'])) {
            if ($requestFields['embed_type'] == 'product') {
                if ($requestFields['embed_id'] == $product->id) {
                    $validator->errors()->add(
                        'embed_id',
                        'O campo embed_id deve ter um valor diferente.
                         Não é possível associar um produto a ele mesmo'
                    );
                }

                $requestFields['embed_type'] = $this->_model::class;
            } else {
                $requestFields['embed_type'] = BlogPost::class;
            }
        } else {
            unset($requestFields['embed_type']);
        }

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        if (!empty($requestFields['title']) && $requestFields['title'] != $product->title) {
            $product->title = $requestFields['title'];
        }

        $product->load('category', 'brand', 'badge', 'post', 'product', 'supplier', 'related', 'variations', 'images');
        $product->update($requestFields);
        $product->load('post', 'product');

        return $this->sendResponse(new ProductResource($product), 'Produto atualizado.');
    }

    protected function resolveEmbedType(string|null $embedType): string|null
    {
        if ($embedType === 'Produto') {
            return 'product';
        }

        if ($embedType === 'Postagem') {
            return 'blog_post';
        }

        return $embedType;
    }

    public function destroy($productId): JsonResponse
    {
        $product = $this->_model->find($productId);

        if (!$product) {
            return $this->sendError('Produto não encontrado', [], 404);
        }

        $product->delete();

        return $this->sendResponse([], 'Produto removido');
    }
}
