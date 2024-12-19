<?php

namespace App\Services;

use App\Models\CountryCity;

class CountryCityService extends BaseService
{
    public function __construct()
    {
        $this->model = new CountryCity();
    }
}
