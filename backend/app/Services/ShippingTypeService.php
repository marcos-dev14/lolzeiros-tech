<?php

namespace App\Services;

use App\Models\ShippingType;

class ShippingTypeService extends BaseService
{
    public function __construct() {
        $this->model = new ShippingType();
    }
}
