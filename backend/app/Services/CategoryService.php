<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Database\Eloquent\Model;
use Mavinoo\Batch\Batch;

class CategoryService extends BaseService
{
    public function __construct(protected Batch $batch)
    {
        $this->model = new Category();
    }

    public function make(array $data): Model
    {
        $newData = $data;
        $newData['order'] = $this->model->getNextOrder($data['supplier_id']);

        return parent::make($newData);
    }

    public function updateOrder(array $fields = []): bool|int
    {
        if (!empty($fields)) {
            return $this->batch->update($this->model, $fields, 'id');
        }

        $builder = $this->model->orderBy('slug', 'asc');
        $this->applyCriteria($builder);
        $items = $builder->pluck('name', 'id');

        $fields = [];
        $i = 1;
        foreach ($items as $id => $name) {
            $fields[] = [
                'id' => $id,
                'order' => $i
            ];

            $i++;
        }

        return $this->batch->update($this->model, $fields, 'id');
    }
}
