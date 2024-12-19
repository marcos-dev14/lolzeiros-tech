<?php

namespace App\Services;

use App\Models\AddressType;

class AddressTypeService extends BaseService
{
    public function __construct()
    {
        $this->model = new AddressType();
    }
}
