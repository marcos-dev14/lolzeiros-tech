@props(['instances', 'selected', 'id'])

<div class="select-container">
    <select id="{{ $id ?? 'cart-select-instance' }}" class="select-no-search">
        <option
            data-value="{{ number_format(count($instances) ? $instances->sum('products_sum_subtotal_with_ipi') : 0.0, 2, ',', '.')   }}"
            data-min="null"
            {{ empty($selected) ? 'selected' : '' }}
        >Todos</option>

        @foreach($instances as $instance)
            <option
                data-value="{{ number_format($instance->products_sum_subtotal_with_ipi, 2, ',', '.') }}"
                data-min="{{ number_format($instance->supplier->min_order ?? 0.00, 2, ',', '.') }}"
                {{ $selected === $instance->supplier->id ? 'selected' : '' }}
            >{{ $instance->supplier->name }}</option>
        @endforeach
    </select>
</div>
