<?php

namespace App\View\Components\Header;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class CartBox extends Component
{
    public function render(): Application|Factory|View
    {
        return view('components.cart-box');
    }
}
