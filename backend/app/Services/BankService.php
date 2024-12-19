<?php

namespace App\Services;

use App\Models\Bank;

class BankService extends BaseService
{
    public function __construct()
    {
        $this->model = new Bank();
    }
}
