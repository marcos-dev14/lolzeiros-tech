<div id="cart-box-mobile" data-route="{{ route('cart.html') }}">
    @if(!auth()->guard('buyer')->user())
        <div class="left-side">
            <span>Carrinho</span>
        </div>

        <x-cart-link
            :route="route('cart.index')"
            :total="0"
        ></x-cart-link>
    @else
        <div class="left-side logged-in">
            <x-cart-select
                :instances="session('cart')['full']['instances'] ?? []"
                :selected="session('filters.suppliers.selected')"
                :id="'cart-select-instance-mobile'"
            ></x-cart-select>

            @php
                $selected = session('filters.suppliers.selected');
                $instances = session('cart')['full']['instances'] ?? collect([]);

                $selectedInstance = $instances->where('supplier.id', session('filters.suppliers.selected'))?->first();
                $total = $selected
                    ? $selectedInstance->products_sum_subtotal_with_ipi ?? 0
                    : $instances->sum('products_sum_subtotal_with_ipi') ?? 0
            @endphp


            <div class="cart-and-value">
                <x-cart-link
                    :route="route('cart.index')"
                    :total="$total"
                ></x-cart-link>

                    <x-cart-min-order :instance="(
                        !empty(session('cart')['full']['instances']) && is_null(session('filters.suppliers.selected')))
                        ? session('cart')['full']['instances']->first()
                        : session('cart')['full']['instances']->where('supplier.id', session('filters.suppliers.selected'))->first()">
                    </x-cart-min-order>
            </div>
        </div>
    @endif
</div>
