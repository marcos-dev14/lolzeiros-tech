<?php

namespace App\Services;

use App\Models\BlogCategory;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Lang;
use Mavinoo\Batch\Batch;
use Throwable;

class BlogCategoryService extends BaseService
{
    public function __construct(protected Batch $batch)
    {
        $this->model = new BlogCategory();
    }

    public function all($paginated = true,$per_page = 100): Collection|LengthAwarePaginator|array
    {
        $builder = $this->makeBuilder();
        $builder = $builder->get()->toTree();

        return $paginated ? $builder->paginate() : $builder;
    }

    public function makeBuilder(): Builder
    {
        $builder = $this->model->tree();

        $builder->with($this->relations)
            ->withCount($this->counts)
            ->orderBy($this->orderBy, $this->orderDirection);

        return self::applyCriteria($builder);
    }

    /**
     * @throws Throwable
     */
    public function getTreeById(int $id): Model|null|\Staudenmeir\LaravelAdjacencyList\Eloquent\Collection
    {
        $item = $this->model
            ->treeOf(function ($query) use ($id) {
                $query->where('id', $id);
                self::applyCriteria($query);
            })
            ->with($this->relations)
            ->withCount($this->counts)
            ->orderBy($this->orderBy, $this->orderDirection)
            ->get()
            ->toTree()
            ->first()
        ;

        throw_if(!$item, new \Exception(
                Lang::get('custom.model_not_found'),
                404
            )
        );

        return $item;
    }

    /**
     * @throws Throwable
     */
    public function update(int|Model $item, array $data): bool
    {
        if (isset($data['parent_id'])) {
            $itemId = is_int($item) ? $item : $item->id;

            throw_if(
                !$this->canUpdateParentId($itemId, $data['parent_id']),
                new \Exception(Lang::get('custom.not_permitted'), 400)
            );
        }

        return parent::update($item, $data);
    }

    protected function canUpdateParentId(int $itemId, int $targetParentId): bool
    {
        return !$this->model->query()
            ->where('id', $itemId)
            ->where('parent_id', '!=', $targetParentId)
            ->where(function ($query) use ($targetParentId) {
                $query->whereHas('descendants', function ($query) use ($targetParentId) {
                    $query->where('id', $targetParentId);
                })->orWhereHas('ancestors', function ($query) use ($targetParentId) {
                    $query->where('id', $targetParentId);
                });
            })
            ->count();
    }
}
