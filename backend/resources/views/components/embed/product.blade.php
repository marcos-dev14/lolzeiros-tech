<div class="product-embed">
    <div class="card-header">
        <div class="left-side">
            <a href="{{ route('route', $embed->route?->url ?? 'null') }}" title="{{ $embed->title }}">
                <figure>
                    <picture>
                        <source srcset="{{ $embed->getCover()?->webp_thumb }}" type="image/webp">
                        <source srcset="{{ $embed->getCover()?->thumb }}" type="image/jpeg">
                        <img src="{{ $embed->getCover()?->thumb }}" alt="{{ $embed->title }}">
                    </picture>
                </figure>
            </a>
        </div>

        <div class="right-side">
            <h3>
                <a href="{{ route('route', $embed->route?->url ?? 'null') }}">
                    {{ $embed->title }}
                </a>
            </h3>

            @if(!empty($embed->inner_code))
                <div class="row-line row-absolute">
                    <img src="{{ asset('images/ico-barcode.svg') }}" alt="Barcode" width="25px" height="23px">
                    <span>{{ $embed->reference }}</span>
                </div>
            @endif

            <div class="price-box">
                <p data-selector="price-base">
                    @if(auth()->guard('buyer')->user() && $embed->canBeSold() === true)
                        <span>R$ {{ formatMoney($embed->getBaseValueWithPromotions($embed->in_cart_data['qty'] ?? null)) }}/un</span>
                        <br>
                        <small>
                            @if($embed->getDiscountPercentage($embed->in_cart_data['qty'] ?? null) > 0)
                                <s>R$ {{ formatMoney($embed->getBaseValuePromotion()) }}</s>
                            @endif
                        </small>
                    @endif
                </p>
            </div>

            @if(!empty($embed->supplier->image) || !empty($embed->brand->image))
                <div class="card-bottom">
                    <div class="row-line logos">
                        @if(!empty($embed->supplier->image))
                            <img src="{{ asset("{$embed->supplier->image_path}/{$embed->supplier->image}") }}" alt="{{ $embed->supplier->name }}">
                        @endif

                        @if(!empty($embed->brand->image))
                            <img src="{{ asset("{$embed->brand->image_path}/{$embed->brand->image}") }}" alt="{{ $embed->brand->name }}">
                        @endif
                    </div>
                </div>
            @endif
        </div>
    </div>
</div>
