<?php

namespace App\Services;

use App\Models\ShippingCompany;
use App\Services\Utils\QueryCriteria;
use App\Services\Utils\QueryCriteriaCollection;

class ShippingCompanyService extends BaseService
{
    public function __construct() {
        $this->model = new ShippingCompany();
    }

    public function enableFilters(array $filters): void
    {
        if (!empty($filters)) {
            $criteria = [];

            foreach ($filters as $key => $value) {
                $criteria[] = new QueryCriteria($key, $value, 'like');
            }

            if (count($criteria)) {
                $this->criteria = new QueryCriteriaCollection('and', ...$criteria);
            }
        }
    }
}
