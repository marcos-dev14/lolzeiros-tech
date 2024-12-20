<?php

namespace App\View\Components\Form;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class Input extends Component
{
    public string $type;

    public string $name;

    public string $label;

    public ?string $class;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($type, $name, $label, $class = null)
    {
        $this->type = $type;
        $this->name = $name;
        $this->label = $label;
        $this->class = $class;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return Application|Factory|View
     */
    public function render(): View|Factory|Application
    {
        return view('components.form.input');
    }
}
