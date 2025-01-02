<?php

namespace App\Services;

use App\Models\Seller;
use App\Services\BaseService;

class SellerService extends BaseService
{
    public function __construct()
    {
        $this->model = new Seller();
    }

}
