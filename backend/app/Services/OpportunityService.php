<?php

namespace App\Services;

use App\Models\Opportunity;
use App\Services\BaseService;

class OpportunityService extends BaseService
{
    public function __construct()
    {
        $this->model = new Opportunity();
    }

}
