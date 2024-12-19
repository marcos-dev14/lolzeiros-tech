<?php

namespace App\Services;

use App\Models\SupplierProfileFractionations;

class SupplierProfileFractionalService extends BaseService
{
    public function __construct()
    {
        $this->model = new SupplierProfileFractionations();
    }
}
