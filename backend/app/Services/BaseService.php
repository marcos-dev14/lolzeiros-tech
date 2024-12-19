<?php

namespace App\Services;

use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;
use Exception;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Str;
use Throwable;

abstract class BaseService
{
    public array $relations = [];

    public array $counts = [];

    public array $fields = ['*'];

    public string $orderBy = 'updated_at';

    public string $orderDirection = 'desc';

    public int|null $limit = null;

    public QueryCriteriaCollection|QueryCriteria|null $criteria;

    public Model $model;

    public function all($paginated = true,$per_page = 100): Collection|LengthAwarePaginator|array
    {
        $builder = $this->makeBuilder();

        return $paginated ? $builder->paginate($per_page) : $builder->get();
    }

    protected function makeBuilder(): Builder
    {
        $builder = $this->model
            ->with($this->relations)
            ->withCount($this->counts)
            ->orderBy($this->orderBy, $this->orderDirection);

        if ($this->fields[0] !== '*') {
            $builder->select(...$this->fields);
        }

        if ($this->limit) {
            $builder->take($this->limit);
        }

        return self::applyCriteria($builder);
    }

    protected function applyCriteria(Builder $builder): Builder
    {
        if (empty($this->criteria)) {
            return $builder;
        }

        $criteria = $this->criteria;

        if ($criteria instanceof QueryCriteria) {
            return $this->applyQueryCriteria($builder, $criteria);
        }

        return $builder->where(function ($query) use ($criteria) {
            $rules = $criteria->getRules();
            $operator = $criteria->getOperator();

            foreach ($rules as $rule) {
                $this->applyQueryCriteria($query, $rule, $operator);
            }
        });
    }

    protected function applyQueryCriteria(Builder $builder, QueryCriteria $criteria, $operator = null): Builder
    {
        return match ($criteria->getOperator()) {
            'hasScope' => $this->applyHasScopeCriteria($builder, $criteria),
            'hasRelation' => $this->applyHasRelationCriteria($builder, $criteria),
            'whereBetween' => $this->applyWhereBetweenCriteria($builder, $criteria),
            'doesntHaveRelation' => $this->applyDoesntHasRelationCriteria($builder, $criteria),
            default => $this->applySimpleCriteria($builder, $criteria, $operator)
        };
    }

    protected function applyWhereBetweenCriteria(Builder $builder, QueryCriteria $criteria): Builder
    {
        return $builder->where(function($query) use ($criteria) {
            $query->whereBetween($criteria->getField(), $criteria->getValue());
        });
    }

    protected function applyHasScopeCriteria(Builder $builder, QueryCriteria $criteria): Builder
    {
        $scope = $criteria->getField();
        return $builder->$scope($criteria->getValue() ?? null);
    }

    protected function applyHasRelationCriteria(Builder $builder, QueryCriteria $criteria): Builder
    {
        return $builder->has($criteria->getField());
    }

    protected function applyDoesntHasRelationCriteria(Builder $builder, QueryCriteria $criteria): Builder
    {
        return $builder->doesntHave($criteria->getField());
    }

    protected function applySimpleCriteria(Builder $builder, QueryCriteria $criteria, $operator): Builder
    {
        if ($operator == QueryCriteriaCollection::OPERATOR_OR) {
            return $builder->orWhere($criteria->getField(), $criteria->getOperator(), $criteria->getValue());
        }

        if ($criteria->getOperator() == QueryCriteriaCollection::OPERATOR_IN) {
            return $builder->whereIn($criteria->getField(), $criteria->getValue());
        }

        $value = $criteria->getOperator() === 'like' ? "%{$criteria->getValue()}%" : $criteria->getValue();

        return $builder->where($criteria->getField(), $criteria->getOperator(), $value);
    }

    public function make(array $data): Model
    {
        return $this->model::create($data);
    }

    /**
     * @throws Throwable
     */
    public function update(int|Model $item, array $data): bool
    {
        if (is_int($item)) {
            $item = self::getById($item);
        }

        throw_if(!$item, ModelNotFoundException::class);

        return $item->update($data);
    }

    /**
     * @throws Throwable
     */
    public function getById(string|int $id): Model|null
    {
        $builder = self::makeBuilder();

        $builder = self::applyCriteria($builder);

        $item = $builder->find($id);

        throw_if(!$item, new Exception(
                Lang::get('custom.model_not_found'),
                404
            )
        );

        return $item;
    }

    /**
     * @throws Throwable
     */
    public function getBy(int|string $value, string $field = 'id', $operator = '='): Model|Builder|null
    {
        if ($field == 'id') {
            return $this->getById($value);
        }

        $builder = self::makeBuilder();

        $builder = self::applyCriteria($builder);

        if ($operator === 'like') {
            $value = "%$value%";
        }

        $item = $builder->where($field, $operator, $value)->first();

        throw_if(!$item, new Exception(
                Lang::get('custom.model_not_found'),
                404
            )
        );

        return $item;
    }

    /**
     * @throws Throwable
     */
    public function destroy(int|Model $item): void
    {
        if (is_int($item)) {
            $item = self::getById($item);
        }

        throw_if(!$item, ModelNotFoundException::class);

        $item->delete();
    }

    public function extractRelationsFromArray(array $data): array
    {
        $relations = [];

        foreach ($data as $key => $value) {
            if (Str::contains($key, 'with_') && $value == "true") {
                $relations[] = str_replace('with_', '', $key);
            }
        }

        return $relations;
    }
}
