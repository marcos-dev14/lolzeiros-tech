<?php

namespace App\Services;

use App\Models\LeadTime;

class LeadTimeService extends BaseService
{
    public function __construct() {
        $this->model = new LeadTime();
    }
}
