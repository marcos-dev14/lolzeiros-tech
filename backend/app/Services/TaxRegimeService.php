<?php

namespace App\Services;

use App\Models\TaxRegime;

class TaxRegimeService extends BaseService
{
    public function __construct() {
        $this->model = new TaxRegime();
    }
}
