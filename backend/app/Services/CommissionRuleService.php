<?php

namespace App\Services;

use App\Models\CommissionRule;

class CommissionRuleService extends BaseService
{
    public function __construct()
    {
        $this->model = new CommissionRule();
    }
}
