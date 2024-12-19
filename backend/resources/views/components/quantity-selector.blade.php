<div class="{{ $class ?? 'qty-selector' }}" data-container="{{ $container }}" {{ $attributes }}>
    <a href="javascript:void(0);" class="btn-minus" data-operator="-">
        <x-icons.minus></x-icons.minus>
    </a>

    <input class="disabled"
        type="text"
        data-min="{{ $minQuantity }}"
        data-unit-price="{{ $unitPrice }}"
        value="{{ "$currentQuantity un" }}"
        data-item="{{ $item }}"
        data-instance="{{ $instance }}"
    >

    <a href="javascript:void(0);" class="btn-more" data-operator="+">
        <x-icons.more></x-icons.more>
    </a>
</div>
