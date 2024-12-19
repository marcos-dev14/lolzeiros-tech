<div id="cart-box" class="hidden-xs hidden-sm hidden-md" data-route="{{ route('cart.html') }}">
    @if(!auth()->guard('buyer')->user())
        <div class="left-side">
            <span>Carrinho</span>
        </div>

        <x-cart-link
            :route="route('cart.index')"
            :total="0"
        ></x-cart-link>
    @else
        <x-cart-select
            :instances="session('cart')['full']['instances'] ?? []"
            :selected="session('filters.suppliers.selected')"
        ></x-cart-select>

        <div class="left-side logged-in">
            @php
                $cart = session('cart')['full'] ?? [];
                $selectedSupplierId = session('filters.suppliers.selected');
                $instances = $cart['instances'] ?? collect([]);
                $selectedInstance = $selectedSupplierId ? $instances->where('supplier.id', $selectedSupplierId)->first() : null;
                $total = $selectedSupplierId
                    ? ($selectedInstance->products_sum_subtotal_with_ipi ?? 0)
                    : ($instances->sum('products_sum_subtotal_with_ipi') ?? 0);
            @endphp

            <x-cart-link
                :route="route('cart.index')"
                :total="$total"
            ></x-cart-link>

            <x-cart-min-order :instance="(
                !empty($instances) && is_null($selectedSupplierId))
                ? $instances->first()
                : $instances->where('supplier.id', $selectedSupplierId)->first()
            "></x-cart-min-order>
        </div>
    @endif
</div>
