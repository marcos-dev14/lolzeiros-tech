<?php

namespace App\View\Components\Form;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Collection;
use Illuminate\View\Component;

class Select extends Component
{
    public Collection|array|null $values;

    public string|null $selected;

    public string|null $id;

    public string $name;

    public string $label;

    public string $placeholder;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($values, $name, $label, $placeholder = 'Selecione', $selected = null, $id = null)
    {
        $this->values = $values;
        $this->id = $id;
        $this->name = $name;
        $this->label = $label;
        $this->selected = $selected;
        $this->placeholder = $placeholder;
    }

    /**
     * Get the view / contents that represent the component.
     *
     * @return Application|Factory|View
     */
    public function render(): View|Factory|Application
    {
        return view('components.form.select');
    }
}
