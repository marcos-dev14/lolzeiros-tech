<div class="product-card" data-is-in-cart="{{ !empty($product->in_cart_data['qty']) ? 1 : 0 }}">
    <x-loader id="item-{{ $product->id }}"></x-loader>

    <div class="card-header">
        <span class="discount-label">-7%</span>

        <a href="{{ route('route', $product->route?->url ?? 'null') }}" title="{{ $product->title }}">
            <figure>
                @if($product->badge)
                    <img class="badge" src="{{ $product->badge->image_url }}" alt="{{ $product->badge?->name }}">
                @endif

                <picture>
                    <source srcset="{{ $product->getCover()?->webp_thumb }}" type="image/webp">
                    <source srcset="{{ $product->getCover()?->thumb }}" type="image/jpeg">
                    <img src="{{ $product->getCover()?->thumb }}" alt="{{ $product->title }}">
                </picture>

                {{--<span @if(empty($product->in_cart_data)) class="hide" @endif>
                    {{ !empty($product->in_cart_data) ? $product->in_cart_data['qty'] : null }}
                </span>--}}
            </figure>
        </a>
    </div>

    <div class="card-bottom">
        @if(!empty($product->inner_code))
            <div class="row-line">
                <img src="{{ asset('images/ico-barcode.svg') }}" alt="Barcode" width="25px" height="23px">
                <span>{{ $product->reference }}</span>
            </div>
        @endif
        <h3>{{ $product->title }}</h3>

        @if(!empty($product->supplier->image) || !empty($product->brand->image))
            <div class="row-line logos">
                @if(!empty($product->supplier->image))
                    <img src="{{ asset("{$product->supplier->image_path}/{$product->supplier->image}") }}" alt="{{ $product->supplier->name }}">
                @endif

                @if(!empty($product->brand->image))
                    <img src="{{ asset("{$product->brand->image_path}/{$product->brand->image}") }}" alt="{{ $product->brand->name }}">
                @endif
            </div>
        @endif

        <div class="values">
            <div class="values-container">
                @if(auth()->guard('buyer')->user())
                    <div class="price-box unit-price-box">
                        <p data-selector="unit-price">
                            <small>
                                @if($product->original_price != $product->discounted_price)
                                    <s>R$ {{ $product->formated_original_price }}</s> por
                                @endif
                                R$
                            </small>
                            <span>{{ $product->in_cart_data['unit_price'] ?? $product->formated_discounted_price ?? 0.00 }}</span>
                        </p>
                    </div>
                @endif
            </div>

            @if($product->canBeSold() === true)
                <button
                    id="add-to-cart"
                    data-selector="addToCart"
                    data-product="{{ $product->id }}"
                    data-qty="{{ $product->in_cart_data['qty'] ?? $product->getMinimalQuantity() }}"
                    data-cart-instance="{{ $product->in_cart_data['instance'] ?? null }}"
                    data-url="{{ isset($product->in_cart_data['qty']) ? route('cart.update') : route('cart.add') }}"
                    data-container=".product-card"
                    @if(!auth()->guard('buyer')->user()) class="mtop-50" @endif
                >
                    <img src="{{ asset('images/ico-bag.svg') }}" width="40" alt="Ícone de visualizar">
                </button>
            @endif

            @if(auth()->guard('buyer')->user())
                <form
                    action="{{ route('cart.remove', [$product->in_cart_data['instance'] ?? 'instance', $product->id]) }}"
                    class="form-remove {{ empty($product->in_cart_data) ? 'hide' : null }}"
                    method="POST"
                    data-container=".product-card"
                >
                    @csrf
                    <button type="submit">
                        <x-icons.cart-trash></x-icons.cart-trash>
                    </button>
                </form>
            @endif
        </div>

        @if(auth()->guard('buyer')->user())
            <div class="buttons">
                <x-quantity-selector
                    container=".product-card"
                    minQuantity="{{ $product->getMinimalQuantity() }}"
                    unitPrice="{{ $product->discounted_price }}"
                    currentQuantity="{{ $product->in_cart_data['qty'] ?? $product->getMinimalQuantity() }}"
                    item="{{ $product->id }}"
                    data-price-route="{{ route('products.prices', [$product->id, 'qty']) }}"
                ></x-quantity-selector>

{{--                <div class="total-price-box">--}}
{{--                    <small>Valor Total</small>--}}
{{--                    <p data-selector="total-price">--}}
{{--                        <small>R$</small>--}}
{{--                        <span>{{--}}
{{--                            $product->in_cart_data['total_price'] ??--}}
{{--                            number_format($product->discounted_price * $product->getMinimalQuantity(), 2, ',', '.')--}}
{{--                        }}</span>--}}
{{--                    </p>--}}
{{--                </div>--}}
            </div>
        @endif
    </div>
</div>
