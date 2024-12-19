<style>
   .price-info {
        font-size: 10px; 
        color: #333; 
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 10px;
    }
    .price-base {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }
    .r1 {
        gap: 2px
    }

    .price-i {
        font-size: 10px; 
        color: #333; 
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 10px;
        margin-top: -5px;
    }

    .price-label {
        font-weight: bold;
        color: #484848;
    }

    .ipi-value, .icms-value, .ncm-value {
        font-weight: normal; /* Deixa os valores em peso normal */
        color: #666;
    }

    .packaging-info {
        font-size: 12px!important; 
        color: #999; 
        font-weight: normal; 
        margin-left: 5px;
        vertical-align: middle;
    }
</style>
<div class="card" data-is-in-cart="{{ !empty($product->in_cart_data['qty']) ? 1 : 0 }}">
    <x-loader id="item-{{ $product->id }}"></x-loader>

    <div class="card-header">
        @if (auth()->guard('buyer')->user())
            <span data-selector="discount-label" class="discount-label @if ($product->getDiscountPercentage($product->in_cart_data['qty'] ?? null) <= 0) hide @endif">
                {{ "-{$product->getDiscountPercentage($product->in_cart_data['qty'] ?? null)}%" }}
            </span>
            <button class="wishlist @if (session('buyer.clients.selected')?->wishlistProducts?->contains('id', $product->id)) on @endif"
                data-add-route="{{ route('buyer.wishlistAdd', $product->id) }}"
                data-remove-route="{{ route('buyer.wishlistRemove', $product->id) }}">
                <x-icons.heart></x-icons.heart>
            </button>
        @endif
        <a href="{{ route('route', $product->route?->url ?? 'null') }}" title="{{ $product->title }}">
            <figure>
                @if ($product->badge)
                    <img class="badge" src="{{ $product->badge->image_url }}" alt="{{ $product->badge?->name }}">
                @endif

                <picture class="lazy-picture">
                    <source data-srcset="{{ $product->getCover()?->webp_thumb }}" type="image/webp">
                    <source data-srcset="{{ $product->getCover()?->thumb }}" type="image/jpeg">
                    <img data-src="{{ $product->getCover()?->thumb }}" alt="{{ $product->title }}">
                </picture>
            </figure>
        </a>
    </div>

    <div class="card-bottom">
        @if (!empty($product->inner_code))
            <div class="row-line">
                <img src="{{ asset('images/ico-barcode.svg') }}" alt="Barcode" width="18px" height="14px">
                 <span> {{ $product->ean13 }}</span>
            </div>
        @endif

        @if ($product->supplier)
            <div class="row-line r1">
                <span>{{ $product->supplier?->name }} @if ($product->supplier?->name == 'Reval')
                        - {{ $product->brand?->name }}
                    @endif </span> -
                <span>{{ $product->reference }}</span>
            </div>
        @endif

        <h3>{{ $product->title }} </h3>

        @if (!auth()->guard('buyer')->user())
            <a href="{{ route('buyer.showLoginForm') }}" title="Entrar com sua conta"
                class="login-required text-uppercase">
                <x-icons.cursor></x-icons.cursor>
                <span>Faça login para ver os preços e montar seu pedido.</span>
            </a>
        @elseif($product->canBeSold() !== true)
            <a href="{{ route('route', $product->route?->url ?? 'null') }}"
                title="Ops, venda não liberada. Clique para mais detalhes." class="cannot-be-sold">
                <x-icons.shopping-cart-blocked></x-icons.shopping-cart-blocked>
                <span>Ops, venda não liberada.<br>Clique para mais detalhes.</span>
            </a>
        @else
            {{-- CUPOM --}}
            @php
                $couponDisplayed = false;
            @endphp
            @if (
                $product->coupons->isNotEmpty() &&
                    !$couponDisplayed &&
                    ($product->unit_price_promotional == null && $product->box_price_promotional == null))
                @php $couponDisplayed = true; @endphp
                <div class="coupon-icon">
                    <img src="{{ asset('images/cupom/coupon-product.svg') }}" alt="">
                </div>
            @endif

            @if (
                !$couponDisplayed &&
                    $product->supplier->coupons?->isNotEmpty() &&
                    ($product->unit_price_promotional == null && $product->box_price_promotional == null))
                @foreach ($product->supplier->coupons as $coupon)
                    @if (
                        $coupon->brand_id == $product->brand->id ||
                            is_null($coupon->brand_id) ||
                            ($coupon->category_id == $product->category->id || is_null($coupon->category_id)))
                        @php $couponDisplayed = true; @endphp
                        <div class="coupon-icon">
                            <img src="{{ asset('images/cupom/coupon-product.svg') }}" alt="">
                        </div>
                    @break
                @endif
            @endforeach
        @endif

        @if (
            !$couponDisplayed &&
                $product->brand->coupons?->isNotEmpty() &&
                ($product->unit_price_promotional == null && $product->box_price_promotional == null))
            @foreach ($product->brand->coupons as $coupon)
                @if (
                    $coupon->supplier_id == $product->supplier->id ||
                        is_null($coupon->supplier_id) ||
                        ($coupon->category_id == $product->category->id || is_null($coupon->category_id)))
                    @php $couponDisplayed = true; @endphp
                    <div class="coupon-icon">
                        <img src="{{ asset('images/cupom/coupon-product.svg') }}" alt="">
                    </div>
                @break
            @endif
        @endforeach
    @endif

    @if (
        !$couponDisplayed &&
            $product->category->coupons?->isNotEmpty() &&
            ($product->unit_price_promotional == null && $product->box_price_promotional == null))
        @foreach ($product->category->coupons as $coupon)
            @if (
                $coupon->supplier_id == $product->supplier->id ||
                    is_null($coupon->supplier_id) ||
                    ($coupon->brand_id == $product->brand->id || is_null($coupon->brand_id)))
                @php $couponDisplayed = true; @endphp
                <div class="coupon-icon">
                    <img src="{{ asset('images/cupom/coupon-product.svg') }}" alt="">
                </div>
            @break
        @endif
    @endforeach
@endif
{{-- CUPOM --}}

<div class="price-box">
    <p data-selector="price-base" class="price-base">
        
        <small>
            @if ($product->getDiscountPercentage($product->in_cart_data['qty'] ?? null) > 0)
                <s>R$ {{ formatMoney($product->getBaseValuePromotion()) }}</s>
            @else
                &nbsp;
            @endif
        </small>
        <span>R$
            {{ formatMoney($product->getBaseValueWithPromotions($product->in_cart_data['qty'] ?? null)) }}
            @if ($product->packaging)
                <span class="packaging-info">/{{ $product->packaging }}</span>
            @else
                <span class="packaging-info">/un</span>
            @endif
        </span>
    </p>
</div>
    @php
        $packaging = $product->packaging;
        if ($packaging == 'DUZIA') {
            $number = 12;
        } else {
            preg_match('/(\d+)$/', $packaging, $matches);
            $number = (int) ($matches[1] ?? 1);
        }
    @endphp
    <div class="price-i">
        <span class="price-label">Preço Unitário:</span> 
        <span class="price-value">R$ {{ formatMoney($product->getBaseValueWithPromotions($product->in_cart_data['qty'] ?? null) / $number) }}</span>
    </div>
    <div class="price-info">
        <span class="price-label">IPI:</span>
        <span class="ipi-value">{{ $product->ipi > 0 ? $product->ipi . '%' : '0%' }}</span>
        <span class="price-label">ICMS:</span>
        <span class="icms-value">{{ $product->icms > 0 ? $product->icms . '%' : '0%' }}</span>
        <span class="price-label">NCM:</span>
        <span class="ncm-value">{{ $product->ncm }}</span>
    </div>


<div class="button-box" data-selector="button-box">
    @if (!empty($product->in_cart_data['qty']))
        <p class="color-primary">
            <span class="color-primary" data-selector="label-in-cart-quantity">
                {{ $product->in_cart_data['qty'] ?? 0 }}
            </span>

            {{ ($product->in_cart_data['qty'] ?? 0) > 1 ? ' unidades' : ' unidade' }} no carrinho
        </p>
    @endif

    <div class="buttons cart-actions @if (empty($product->in_cart_data['qty'])) hide @endif"
        data-selector="quantity-container">
        <x-quantity-selector container=".card" minQuantity="{{ $product->getMinimalQuantity() }}"
            unitPrice="{{ $product->discounted_price }}"
            currentQuantity="{{ $product->in_cart_data['qty'] ?? $product->getMinimalQuantity() }}"
            item="{{ $product->id }}" data-update-route="{{ route('cart.update') }}"
            data-remove-route="{{ route('cart.remove', [$product->in_cart_data['instance'] ?? 'instance', $product->id]) }}"
            instance="{{ $product->in_cart_data['instance'] ?? 'instance' }}"></x-quantity-selector>

        <form
            action="{{ route('cart.remove', [$product->in_cart_data['instance'] ?? 'instance', $product->id]) }}"
            data-container=".card" class="form-remove" method="POST" data-container=".product-card">
            @csrf
            <button type="submit">
                <x-icons.cart-trash></x-icons.cart-trash>
            </button>
        </form>
    </div>

    @if ($product->availability === \App\Enums\Product\AvailabilityType::PRE_SALE)
        <p>Previsão de estoque <span>{{ $product->expected_arrival?->format('d/m/Y') }}</span></p>
        <button class="pre-sale" id="add-to-cart" data-selector="addToCart" data-product="{{ $product->id }}"
            data-qty="{{ $product->in_cart_data['qty'] ?? $product->getMinimalQuantity() }}"
            data-url="{{ route('cart.add') }}" data-container=".card">
            Pré-venda
        </button>
    @else
        <button class="@if (!empty($product->in_cart_data['qty'])) hide @endif" data-selector="addToCart"
            data-product="{{ $product->id }}"
            data-qty="{{ $product->in_cart_data['qty'] ?? $product->getMinimalQuantity() }}"
            data-url="{{ route('cart.add') }}" data-container=".card">
            <x-icons.shopping-cart></x-icons.shopping-cart>
            Comprar
        </button>
    @endif
</div>
@endif
</div>
</div>
