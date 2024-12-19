<?php

namespace App\Observers;

use App\Models\CartInstanceProduct;

class CartInstanceProductObserver
{
    public function created(CartInstanceProduct $instanceProduct): void
    {
        $this->touchInstanceAndCart($instanceProduct);
    }

    public function updated(CartInstanceProduct $instanceProduct): void
    {
        $this->touchInstanceAndCart($instanceProduct);
    }

    public function deleted(CartInstanceProduct $instanceProduct): void
    {
        $this->touchInstanceAndCart($instanceProduct);
    }

    protected function touchInstanceAndCart(CartInstanceProduct $instanceProduct): void
    {
        $instanceProduct->loadMissing('instance.cart');

        $instance = $instanceProduct->instance;
        $cart = $instance->cart;

        $instance->touch();
        $cart->touch();
    }
}
