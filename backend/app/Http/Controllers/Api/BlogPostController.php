<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\BlogPostListResource;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogPost;
use App\Models\Product;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use JetBrains\PhpStorm\NoReturn;

class BlogPostController extends BaseController
{
    #[NoReturn]
    public function __construct(private BlogPost $_model) {}

    public function index(Request $request): JsonResponse
    {
        $builder = $this->_model->with([
            'category', 'post', 'product', 'files', 'images', 'route'
        ])->latest();

        try {
            $builder = $this->filter($builder, $request);
        } catch (Exception $exception) {
            return $this->sendError($exception->getMessage(), [$exception->getMessage()], 400);
        }

        if (!isset($request->paginated) || $request->paginated == 'true') {
            $posts = $builder->paginate(200);

            return $this->sendResponse(
                BlogPostListResource::collection($posts)->response()->getData(),
                Lang::get('custom.found_registers')
            );
        }

        $posts = $builder->get();

        return $this->sendResponse(BlogPostListResource::collection($posts), Lang::get('custom.found_registers'));
    }

    /**
     * @throws Exception
     */
    protected function filter(Builder $builder, Request $request): Builder
    {
        $filters = collect($request->only(
            'by_blog_category',
            'with_image',
            'with_embed',
            'slug',
            'title'
        ))->filter()->all();

        $validator = Validator::make($filters, [
            'by_blog_category' => 'string|exists:blog_categories,id,deleted_at,NULL',
            'slug' => 'string',
            'title' => 'string',
            'with_image' => 'string',
            'with_embed' => 'string',
        ]);

        if ($validator->fails()) {
            throw new Exception($validator->errors()->first(), 400);
        }

        foreach ($filters as $key => $value) {
            if (str_contains($key, 'by_')) {
                $relation = str_replace('by_', '', $key);

                $builder->with($relation)->where("{$relation}_id", $value);
                continue;
            }

            if (str_contains($key, 'with_')) {
                $scope = explode('_', str_replace('with_', 'has_', $key));
                $scope = $scope[0] . ucfirst($scope[1]);

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
        $post = $this->_model->with(['category', 'files', 'images', 'route', 'author'])->find($id);

        if (is_null($post)) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        return $this->sendResponse(new BlogPostResource($post), Lang::get('custom.found_register'));
    }

    /**
     * @throws Exception
     */
    public function store(Request $request): JsonResponse
    {
        $requestFields = $request->only($this->_model->getFillable());

        $rules = $this->_model->validationRules;
        $rules['title'] = "required";

        $validator = Validator::make($requestFields, $rules);

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        $requestFields['slug'] = Str::slug($requestFields['title']);
        $requestFields['seo_title'] = substr($requestFields['title'], 0, 65);

        $post = $this->_model->fill($requestFields);
        $post->save();

        return $this->sendResponse(new BlogPostResource($post), Lang::get('custom.register_added'), 201);
    }

    public function update(Request $request, $postId): JsonResponse
    {
        $post = $this->_model->find($postId);

        if (!$post) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $requestFields = $request->only($this->_model->getFillable());

        $validator = Validator::make($requestFields, $this->_model->validationRules);

        $requestFields['slug'] = Str::slug($requestFields['title'] ?? $post->title);
        $requestFields['embed_type'] = $this->resolveEmbedType($requestFields['embed_type'] ?? null);
        if (!empty($requestFields['embed_id']) && !empty($requestFields['embed_type'])) {
            if ($requestFields['embed_type'] == 'blog_post') {
                if ($requestFields['embed_id'] == $post->id) {
                    $validator->errors()->add(
                        'embed_id',
                        'O campo embed_id deve ter um valor diferente.
                         Não é possível associar uma postagem a ela mesma'
                    );
                }

                $requestFields['embed_type'] = $this->_model::class;
            } else {
                $requestFields['embed_type'] = Product::class;
            }
        } else {
            $requestFields['embed_id'] = null;
            $requestFields['embed_type'] = null;
        }

        if ($validator->fails()) {
            return $this->sendError($validator->errors()->first(), $validator->errors()->toArray(), 400);
        }

        if (!empty($requestFields['title']) && $requestFields['title'] != $post->title) {
            $post->title = $requestFields['title'];
        }

        $post->load('category', 'post', 'product', 'files', 'images', 'author');
        $post->update($requestFields);
        $post->load('post', 'product');

        return $this->sendResponse(new BlogPostResource($post), Lang::get('custom.register_updated'));
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

    public function destroy($postId): JsonResponse
    {
        $post = $this->_model->find($postId);

        if (!$post) {
            return $this->sendError(Lang::get('custom.model_not_found'), [], 404);
        }

        $post->delete();

        return $this->sendResponse([], Lang::get('custom.register_deleted'));
    }
}
