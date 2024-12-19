<div class="products-list" {{ $attributes }}>
    <div class="product-header">
        <div class="col"></div>

        <div class="col">
            <span>Item</span>
        </div>

        <div class="col centered">
            <span>Ref.</span>
        </div>

        <div class="col centered">
            <span>Quant.</span>
        </div>

        <div class="col centered">
            <span>Preço S/ IPI</span>
        </div>

        <div class="col centered">
            <span>IPI</span>
        </div>

        <div class="col centered">
            <span>Preço c/ IPI</span>
        </div>

        @if ($attributes->has('isCart'))
            <div class="col"></div>
        @endif

        <div class="col">
            <span>Subtotal</span>
        </div>

        <div class="col">
            <span>Tags</span>
        </div>

        @if ($attributes->has('isCart'))
            <div class="col"></div>
        @endif
    </div>
    {{-- @dd($products) --}}

    @foreach ($products as $product)
        @if (!$isMobile)
            <div class="product-list product-item">
                <div class="col">
                    <figure>
                        {{--                        <a href="{{ route('route', $product?->product?->route?->url ?? 'null') }}" title="{{ $product->title }}"> --}}
                        <picture>
                            <source srcset="{{ $product->webp_thumb }}" type="image/webp">
                            <source srcset="{{ $product->thumb }}" type="image/jpeg">
                            <img src="{{ $product->thumb }}" alt="{{ $product->title }}">
                        </picture>
                        {{--                        </a> --}}
                    </figure>
                </div>

                <div class="col">
                    {{--                    <a href="{{ route('route', $product?->product?->route?->url ?? 'null') }}" title="{{ $product->title }}"> --}}
                    <p>{{ $product->title }}</p>
                    {{--                    </a> --}}
                </div>

                <div class="col centered">
                    <p>{{ $product->reference }}</p>
                </div>

                <div class="col centered">
                    <p data-selector="label-quantity">{{ $product->qty }}</p>
                </div>

                <div class="col centered">
                    @if ($product->getRawOriginal('discount') > 0.0)
                        <p><s>R$ {{ $product->original_price }}</s></p>
                    @endif

                    <p data-coupon-unit-price='' data-percentage='' data-selector="label-unit-price"
                        id="label-unit-price-{{ $product->reference }}" class="centered"
                        data-original-price="{{ $product->unit_price }}">
                        R$
                        {{ $product->getUnitPrice() }}
                    </p>

                    @if ($product->product && $product->product->getDiscountPercentage($product->qty) > 0.0)
                        <p class="highlight">
                            {{ "-{$product->product->getDiscountPercentage($product->qty)}%" }}
                        </p>
                    @endif
                </div>

                <div class="col centered">
                    <p data-selector="label-ipi">{{ $product->ipi ?? 0 }}%</p>
                </div>

                <div class="col centered">
                    <p data-selector="label-unit-price-with-ipi" data-coupon-unit-price='' data-percentage=''
                        data-original-price="{{ $product->unit_price }}"
                        data-wipi="{{ $product->unit_price_with_ipi }}"
                        data-value="{{ $product->unit_price_with_ipi ?? 0.0 }}"
                        id="label-unit-price-with-ipi-{{ $product->reference }}">
                        R$
                        {{ $product->getUnitPriceWithIpi() }}
                    </p>
                </div>

                @if ($attributes->has('isCart'))
                    <div class="col">
                        <x-quantity-selector {{-- class="cart-qty-selector" --}} container=".product-item"
                            minQuantity="{{ $product->product->getMinimalQuantity() }}"
                            unitPrice="{{ $product->product->discounted_price }}"
                            currentQuantity="{{ $product->qty }}" item="{{ $product->product_id }}"
                            data-update-route="{{ route('cart.update') }}"
                            instance="{{ $instance }}"></x-quantity-selector>
                    </div>
                @endif


                <div class="col">
                    <p data-percentage='' data-selector="label-total-price-with-ipi"
                        data-value="{{ $product->subtotal_with_ipi }}"
                        id="label-total-price-with-ipi-{{ $product->reference }}">
                        <strong>R$
                            {{ $product->getSubtotalWithIpi() }}</strong>
                    </p>
                </div>

                <div class="col">
                    @if (
                        $product->availability === \App\Enums\Product\AvailabilityType::PRE_SALE ||
                            $product->product?->coupons?->isNotEmpty() ||
                            $product->product?->brand?->coupons?->isNotEmpty() ||
                            $product->product?->category?->coupons?->isNotEmpty() ||
                            $product->product?->supplier?->coupons?->isNotEmpty() ||
                            $product->coupon_discount_unit_ipi != 0)
                        <div class="discount-product">
                            @if ($product->availability === \App\Enums\Product\AvailabilityType::PRE_SALE)
                                <div class="pre-sale">
                                    <img src="{{ asset('images/cupom/calendar_clock.svg') }}" alt="">
                                </div>
                            @endif
                            @if (
                                (($product->product?->coupons?->isNotEmpty() ||
                                $product->product?->brand?->coupons?->isNotEmpty() ||
                                $product->product?->category?->coupons?->isNotEmpty() ||
                                $product->product?->supplier?->coupons?->isNotEmpty()) &&
                                    ($product->unit_price_promotional == null && $product->box_price_promotional == null)) ||
                                    ($product->coupon_discount_unit_ipi != 0 &&
                                        ($product->unit_price_promotional == null && $product->box_price_promotional == null)))
                                <div class="coupon-product">
                                    <img src="{{ asset('images/cupom/coupon-product.svg') }}" alt="">
                                </div>
                            @endif
                        </div>
                    @endif

                    <p class="highlight small @if ($product->getRawOriginal('discount') <= 0.0) hide @endif"
                        data-selector="label-discount">Economia R$ {{ $product->discount }}
                    </p>
                </div>

                @if ($attributes->has('isCart'))
                    <div class="col">
                        {!! Form::open([
                            'route' => ['cart.remove', [$instance, $product->product_id]],
                            'class' => 'form-remove',
                        ]) !!}
                        <button type="submit">
                            <x-icons.cart-trash></x-icons.cart-trash>
                        </button>
                        {!! Form::close() !!}
                    </div>
                @endif
            </div>
        @else
            <div class="product-list product-item-mobile">
                <div class="header-product-item">
                    <div class="col">
                        <figure>
                            {{--                            <a href="{{ route('route', $product?->product?->route?->url ?? 'null') }}" title="{{ $product->title }}"> --}}
                            <picture>
                                <source srcset="{{ $product->webp_thumb }}" type="image/webp">
                                <source srcset="{{ $product->thumb }}" type="image/jpeg">
                                <img src="{{ $product->thumb }}" alt="{{ $product->title }}">
                            </picture>
                            {{--                            </a> --}}
                        </figure>
                    </div>

                    <div class="title-reference">
                        <div class="col">
                            <p class="ref">Ref.{{ $product->reference }}</p>
                        </div>
                        <div class="col">
                            {{--                            <a href="{{ route('route', $product?->product?->route?->url ?? 'null') }}" title="{{ $product->title }}"> --}}
                            <p>{{ $product->title }}</p>
                            {{--                            </a> --}}
                        </div>
                    </div>
                </div>

                <div class="center-product-item">
                    <div class="col centered">
                        @if ($product->getRawOriginal('discount') > 0.0)
                            <p><s>R$ {{ $product->original_price }}</s></p>
                        @endif

                        @if ($attributes->has('isCart'))
                            <div>
                                <span class="label label-cart">Preço s/ IPI</span>
                                <p data-selector="label-unit-price" class="centered" data-percentage=''
                                    data-coupon-unit-price='' id="label-unit-price-{{ $product->reference }}"
                                    class="centered" data-original-price="{{ $product->unit_price }}">
                                    R$
                                    {{ $product->getUnitPrice() }}
                                </p>
                            </div>
                        @endif

                        @if ($product->product && $product->product->getDiscountPercentage($product->qty) > 0.0)
                            <p class="highlight">
                                {{ "-{$product->product->getDiscountPercentage($product->qty)}%" }}
                            </p>
                        @endif
                    </div>

                    @if (!$attributes->has('isCart'))
                        <div class="col centered">
                            <span class="label label-cart">Quantidade</span>
                            <p data-selector="label-quantity">{{ $product->qty }}</p>
                        </div>
                    @endif

                    <div class="col centered">
                        @if ($attributes->has('isCart'))
                            <span class="label label-cart">Preço c/ IPI</span>
                        @else($attributes->has('isCart'))
                            <span class="label label-cart">Preço</span>
                        @endif

                        <p data-selector="label-unit-price-with-ipi" data-coupon-unit-price='' data-percentage=''
                            data-original-price="{{ $product->unit_price }}"
                            data-wipi="{{ $product->unit_price_with_ipi }}"
                            data-value="{{ $product->unit_price_with_ipi ?? 0.0 }}"
                            id="label-unit-price-with-ipi-{{ $product->reference }}">
                            R$
                            {{ $product->getUnitPriceWithIpi() }}
                        </p>
                    </div>

                    @if ($attributes->has('isCart'))
                        <div class="col">
                            <x-quantity-selector {{-- class="cart-qty-selector" --}} container=".product-item"
                                minQuantity="{{ $product->product->getMinimalQuantity() }}"
                                unitPrice="{{ $product->product->discounted_price }}"
                                currentQuantity="{{ $product->qty }}" item="{{ $product->product_id }}"
                                data-update-route="{{ route('cart.update') }}"
                                instance="{{ $instance }}"></x-quantity-selector>
                        </div>
                    @endif
                </div>

                <div class="footer-product-item">

                    @if ($attributes->has('isCart'))
                        <div class="col">
                            {!! Form::open([
                                'route' => ['cart.remove', [$instance, $product->product_id]],
                                'class' => 'form-remove',
                            ]) !!}
                            <button type="submit">
                                <x-icons.cart-trash></x-icons.cart-trash>
                            </button>
                            {!! Form::close() !!}
                        </div>
                    @endif

                    <div class="col">
                        <p data-percentage='' data-value="{{ $product->subtotal_with_ipi }}"
                            data-selector="label-total-price-with-ipi">
                            <strong>R$
                                {{ $product->getSubtotalWithIpi() }}</strong>
                        </p>
                    </div>

                    <div class="col col-mobile">
                        @if (
                            $product->availability === \App\Enums\Product\AvailabilityType::PRE_SALE ||
                                $product->product?->coupons?->isNotEmpty() ||
                                $product->product?->brand?->coupons?->isNotEmpty() ||
                                $product->product?->category?->coupons?->isNotEmpty() ||
                                $product->product?->supplier?->coupons?->isNotEmpty() ||
                                $product->coupon_discount_unit_ipi != 0)
                            <div class="discount-product">
                                @if ($product->availability === \App\Enums\Product\AvailabilityType::PRE_SALE)
                                    <div class="pre-sale">
                                        <img src="{{ asset('images/cupom/calendar_clock.svg') }}" alt="">
                                    </div>
                                @endif

                                @if (
                                    (($product->product?->coupons?->isNotEmpty() ||
                                $product->product?->brand?->coupons?->isNotEmpty() ||
                                $product->product?->category?->coupons?->isNotEmpty() ||
                                $product->product?->supplier?->coupons?->isNotEmpty()) &&
                                        ($product->unit_price_promotional == null && $product->box_price_promotional == null)) ||
                                        ($product->coupon_discount_unit_ipi != 0 &&
                                            ($product->unit_price_promotional == null && $product->box_price_promotional == null)))
                                    <div class="coupon-product">
                                        <img src="{{ asset('images/cupom/coupon-product.svg') }}" alt="">
                                    </div>
                                @endif
                            </div>
                        @endif

                        <p class="highlight small @if ($product->getRawOriginal('discount') <= 0.0) hide @endif"
                            data-selector="label-discount">
                            Economia R$ {{ $product->discount }}
                        </p>
                    </div>
                </div>
            </div>
        @endif
    @endforeach
</div>
