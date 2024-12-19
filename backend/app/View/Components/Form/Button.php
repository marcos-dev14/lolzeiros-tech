<?php

namespace App\View\Components\Form;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Button extends Component
{
    public string $label;

    public string $formGroup;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($label, $formGroup = false)
    {
        $this->label = $label;
        $this->formGroup = $formGroup ?? false;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return Application|Factory|View
     */
    public function render(): View|Factory|Application
    {
        return view('components.form.button');
    }
}
