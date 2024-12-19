@props(['instance'])

@if(!empty($instance) && $instance->supplier->min_order > 0)
    <small class="label-absolute {{ $instance->supplier->min_order < $instance->products_sum_subtotal_with_ipi ? 'hide' : null }}">
        Pedido mínimo R$ {{ number_format($instance->supplier->min_order, 2, ',', '.') }}
    </small>
@endif
