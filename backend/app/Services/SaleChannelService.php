<?php

namespace App\Services;

use App\Models\SaleChannel;

class SaleChannelService extends BaseService
{
    public function __construct()
    {
        $this->model = new SaleChannel();
    }
}
