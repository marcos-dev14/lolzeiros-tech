<?php

namespace App\Observers;

use App\Models\CartInstance;
use Illuminate\Support\Str;

class CartInstanceObserver
{
    public function creating(CartInstance $cartInstance)
    {
        $cartInstance->uuid = Str::uuid();
    }
}
