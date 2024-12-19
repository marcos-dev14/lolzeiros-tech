<?php

namespace App\Services;

use App\Models\CountryState;

class CountryStateService extends BaseService
{
    public function __construct() {
        $this->model = new CountryState();
    }
}
