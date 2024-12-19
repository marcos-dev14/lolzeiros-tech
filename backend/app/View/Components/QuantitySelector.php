<?php

namespace App\View\Components;

use Closure;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class QuantitySelector extends Component
{
    public string|null $class;

    public string $container;

    public int $minQuantity;

    public string|float $unitPrice;

    public int $currentQuantity;

    public int $item;

    public string|null $instance;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($container, $minQuantity, $unitPrice, $currentQuantity, $item, $instance = null, $class = null)
    {
        $this->class = $class;
        $this->container = $container;
        $this->minQuantity = $minQuantity;
        $this->unitPrice = $unitPrice;
        $this->currentQuantity = $currentQuantity;
        $this->item = $item;
        $this->instance = $instance;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return View|Closure|string
     */
    public function render(): View|Closure|string
    {
        return view('components.quantity-selector');
    }
}
