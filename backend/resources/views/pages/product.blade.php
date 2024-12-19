@push('styles')
    <link rel="stylesheet" href="{{ mix('css/product-details.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush
<style>
    .line {
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: yellow;
        padding: 10px;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .message, .arrival {
        white-space: nowrap;
        margin-right: 15px;
        font-size: 16px;
    }

    @media (max-width: 600px) {
        .line {
            flex-direction: column;
            align-items: flex-start;
        }

        .message, .arrival {
            white-space: normal;
            margin-right: 0;
            margin-bottom: 10px;
            font-size: 14px;
        }
    }
</style>
@push('scripts')
    <script src="{{ mix('js/product.js') }}"></script>
    <script>
        $(function() {
            makeSlick($('.slick-default'));

            const selectVariation = $('#select-variation');
            selectVariation.on('change', function() {
                const select = $(this);
                const url = select.val();

                if (url !== '') {
                    window.location.href = url;
                }
            });
        });
    </script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section id="product-details">
        <div class="container">
            @include('components._breadcrumb', [
                'links' => [['url' => route('page.industry'), 'label' => 'Fornecedores']],
                'currentLink' => ['label' => $product?->category?->name],
            ])

            <div class="row">
                <div class="hero" data-is-in-cart="{{ !empty($product->in_cart_data['qty']) ? 1 : 0 }}">
                    <x-loader id="item-{{ $product->id }}"></x-loader>

                    <div class="row">
                        <div class="col-xs-12 col-md-5 col-lg-6">
                            @if (count($product->images))
                                <div class="gallery">
                                    @if (auth()->guard('buyer')->user())
                                        <span data-selector="discount-label"
                                            class="discount-label @if ($product->getDiscountPercentage($product->in_cart_data['qty'] ?? null) <= 0) hide @endif">
                                            {{ "-{$product->getDiscountPercentage($product->in_cart_data['qty'] ?? null)}%" }}
                                        </span>

                                        <button class="wishlist @if (session('buyer.clients.selected')?->wishlistProducts?->contains('id', $product->id)) on @endif"
                                            data-add-route="{{ route('buyer.wishlistAdd', $product->id) }}"
                                            data-remove-route="{{ route('buyer.wishlistRemove', $product->id) }}">
                                            <x-icons.heart-borded></x-icons.heart-borded>
                                        </button>
                                    @endif

                                    <div class="photoswipe slick-default">
                                        @foreach ($product->images as $key => $image)
                                            <figure>
                                                <a href="{{ asset($image->image) }}"
                                                    data-size="{{ $image->dimensions }}">
                                                    @if ($product->badge)
                                                        <img class="badge" src="{{ $product->badge->image_url }}"
                                                            alt="{{ $product->badge?->name }}">
                                                    @endif

                                                    <picture>
                                                        <source srcset="{{ $image->webp_image }}" type="image/webp">
                                                        <source srcset="{{ $image->image }}" type="image/jpeg">
                                                        <img src="{{ $image->image }}" alt="{{ $image->label }}">
                                                    </picture>
                                                </a>
                                            </figure>
                                        @endforeach
                                    </div>
                                </div>

                                <div class="gallery-product">
                                    <div class="photoswipe" id="gallery-{{ $product->id }}">
                                        @foreach ($product->images as $image)
                                            <figure>
                                                <a href="{{ asset($image->image) }}"
                                                    data-size="{{ $image->dimensions }}">
                                                    <picture>
                                                        <source srcset="{{ $image->webp_thumb }}" type="image/webp">
                                                        <source srcset="{{ $image->thumb }}" type="image/jpeg">
                                                        <img loading="lazy" src="{{ $image->thumb }}"
                                                            alt="{{ $image->label }}">
                                                    </picture>
                                                </a>
                                            </figure>
                                        @endforeach
                                    </div>
                                </div>
                            @endif
                        </div>

                        <div class="col-xs-12 col-md-7 col-lg-6">
                            <h1>{{ $product->title }}</h1>


                            <div class="codebar-line">
                                <img src="{{ asset('images/ico-barcode.svg') }}" alt="Barcode" width="27px"
                                    height="23px">
                                <span>Referência {{ $product->reference }}</span>
                            </div>

                            {{-- CUPOM --}}
                            @php
                                $couponDisplayed = false;
                            @endphp

                            @if (
                                $product &&
                                    $product->coupons?->isNotEmpty() &&
                                    !$couponDisplayed &&
                                    ($product->unit_price_promotional == null && $product->box_price_promotional == null))
                                @php $couponDisplayed = true; @endphp
                                <div class="coupon-icon">
                                    <img src="{{ asset('images/cupom/coupon-product.svg') }}" alt="">
                                </div>

                                <p>Este produto contém cupom!</p>
                            @endif

                            @if (
                                $product &&
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

                                        <p>Este produto contém cupom!</p>
                                    @break
                                @endif
                            @endforeach
                        @endif

                        @if (
                            $product &&
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

                                    <p>Este produto contém cupom!</p>
                                @break
                            @endif
                        @endforeach
                    @endif

                    @if (
                        $product &&
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

                                <p>Este produto contém cupom!</p>
                            @break
                        @endif
                    @endforeach
                @endif
                {{-- CUPOM --}}

                <div class="logos-line">
                    @if (!empty($product->supplier->image))
                        <img loading="lazy"
                            src="{{ asset("{$product->supplier->image_path}/{$product->supplier->image}") }}"
                            alt="{{ $product->supplier->name }}">
                    @endif

                    @if (!empty($product->brand->image))
                        <img loading="lazy"
                            src="{{ asset("{$product->brand->image_path}/{$product->brand->image}") }}"
                            alt="{{ $product->brand->name }}">
                    @endif

                    <div>
                        @if (auth()->guard('buyer')->user() &&
                                $product->canBeSold() === true &&
                                ($product->availability === \App\Enums\Product\AvailabilityType::AVAILABLE ||
                                    $product->availability === \App\Enums\Product\AvailabilityType::PRE_SALE))
                            <p>Vendido por AugeApp</p>
                            <p>Fornecido por {{ $product->supplier?->name }} CNPJ
                                {{ $product->supplier?->document }}</p>
                        @endif

                        @if (auth()->guard('buyer')->user() && isset($product->supplier) && $product->supplier->shippingType?->id === 2)
                            <p>
                                <x-icons.truck></x-icons.truck>
                                <span>Frete Grátis</span>
                            </p>
                        @endif
                    </div>
                </div>

                @if (!auth()->guard('buyer')->user())
                    @include('pages._partials.product.login-required')
                @elseif($product->canBeSold() !== true && $product->availability !== \App\Enums\Product\AvailabilityType::PRE_SALE)
                    @include('pages._partials.product.cannot-sale')
                @else
                    @if ($maxInstallments > 0)
                        <div class="installment-line">
                            <div>
                                <span>Até</span>
                                <strong>{{ $maxInstallments }}x</strong>
                            </div>

                            <div>
                                <p>Pagamento por boleto bancário em até <b>{{ $maxInstallments }}
                                        vezes</b>, sujeito a análise de crédito.</p>
                                <p>Consulte outras opções de pagamento <b>(31) 3213-2204</b></p>
                            </div>
                        </div>
                    @endif

                    <div class="promotions-line">
                        @if (!empty($product->supplier->leadTime))
                            <div class="line">
                                <span>Faturamento Estimado</span>
                                <strong>{{ $product->supplier->leadTime->name }}</strong>
                                <strong>&nbsp;</strong>
                            </div>
                        @endif

                        @if (count($product->getProductQuantityPromotions()))
                            @foreach ($product->getProductQuantityPromotions()->sortBy('min_quantity') as $productPromotion)
                                <div class="line">
                                    <span>A partir de {{ $productPromotion->min_quantity }} unidades</span>
                                    <strong>{{ number_format($productPromotion->discount_value, 2) }}%
                                        desconto</strong>
                                    <strong>Válido até
                                        {{ $productPromotion->valid_until->format('d/m/Y') }}</strong>
                                </div>
                            @endforeach
                        @endif
                        @if ($product->availability === \App\Enums\Product\AvailabilityType::PRE_SALE)
                            <div class="line" style="background-color: yellow; justify-content: start">
                                <span style="white-space: nowrap">OPS, produto sem estoque</span>
                                <strong style="white-space: nowrap">Previsão de chegada:
                                    {{ $product->expected_arrival?->format('d/m/Y') }}</strong>
                            </div>
                        @endif

                        @if (count($product->getCategoryQuantityPromotions()))
                            @foreach ($product->getCategoryQuantityPromotions()->sortBy('min_quantity') as $productPromotion)
                                <div class="line">
                                    <span>A partir de {{ $productPromotion->min_quantity }} unidades</span>
                                    <strong>{{ number_format($productPromotion->discount_value, 2) }}%
                                        desconto</strong>
                                    <strong>Válido até
                                        {{ $productPromotion->valid_until->format('d/m/Y') }}</strong>
                                </div>
                            @endforeach
                        @endif
                    </div>

                    @if (!empty($product->variations) && $product->variations->count())
                        <div class="variations-line">
                            <h5>Variações do produto:</h5>

                            <select name="select_variation" id="select-variation" class="select-no-search">
                                <option value="" selected>Veja aqui outras opções</option>

                                @foreach ($product->variations as $variation)
                                    <option
                                        value="{{ route('route', $variation->route?->url ?? 'null') }}">
                                        {{ $variation->title }} - R$
                                        {{ formatMoney($variation->getBaseValueWithPromotions($variation->in_cart_data['qty'] ?? null)) }}/un
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    @endif
                    @if ($product->packaging)
                        <h3 style="font-size: 20px">{{ $product->packaging }}</h3>
                    @endif
                    <div>
                        @if ($product->packaging)
                            @php
                                $packaging = $product->packaging;
                                if ($packaging == 'DUZIA') {
                                    $number = 12;
                                } else {
                                    preg_match('/(\d+)$/', $packaging, $matches);
                                    $number = (int) ($matches[1] ?? 1);
                                }

                            @endphp
                            @if ($number !== 1)
                                <div class="price-block" data-selector="price-uni">
                                    <small><b>Preço unitário sem IPI</b></small>
                                    @if ($product->prices['discount'] > 0)
                                            <s style="font-size: 13px">R$
                                                {{ formatMoney($product->prices['original_price'] / $number) }}</s>
                                            ({{ $product->prices['discount_percentage'] * -1 }}%)
                                    @endif
                                    <small>R$</small>{{ formatMoney($product->prices['unit_price'] / $number) }}

                                    {{-- <strong>
                                        <small>R$</small>{{ formatMoney($product->prices['unit_price'] / $number) }}

                                        {{ $product->ipi > 0 ? '- IPI: ' . $product->ipi . '%' : '' }}
                                        {{ $product->icms > 0 ? '- ICMS: ' . $product->icms . '%' : '' }}
                                    </strong>
                                    <small>
                                        @if ($product->prices['discount'] > 0)
                                            <s>R$
                                                {{ formatMoney($product->prices['original_price'] / $number) }}</s>
                                            ({{ $product->prices['discount_percentage'] * -1 }}%)
                                        @endif
                                    </small> --}}
                                </div>
                            @endif
                        @endif
                    </div>

                    <div class="price-line">

                        <div class="price-block" data-selector="price-base">
                            <small><b>Preço sem IPI</b></small>
                            <strong>
                                <small>R$</small>{{ formatMoney($product->prices['unit_price']) }}
                            </strong>
                            <small>
                                @if ($product->prices['discount'] > 0)
                                    <s>R$ {{ formatMoney($product->prices['original_price']) }}</s>
                                    ({{ $product->prices['discount_percentage'] * -1 }}%)
                                    {{-- <s>R$ {{ formatMoney($embed->getBaseValuePromotion()) }}</s>
                                                ({{ ($product->product->getDiscountPercentage($product->qty)) }}%) --}}
                                @else
                                    &nbsp;
                                @endif
                            </small>
                        </div>

                        <div class="price-block" data-selector="price-ipi">
                            <small><b>Preço com IPI</b></small>
                            <strong><small>R$</small>{{ formatMoney($product->prices['unit_price_with_ipi']) }}</strong>
                            <small>IPI ({{ number_format($product->prices['ipi'] ?? 0.0, 2) }}%)</small>
                        </div>

                        <div class="buttons-container" data-selector="button-box">
                            <div data-selector="quantity-container"
                                class="@if (empty($product->in_cart_data['qty'])) hide @endif">
                                <p>
                                    <span class="color-primary" data-selector="label-in-cart-quantity">
                                        {{ $product->in_cart_data['qty'] ?? 0 }}&nbsp;
                                    </span>
                                    {{ ($product->in_cart_data['qty'] ?? 0) > 1 ? 'unidades' : 'unidade' }}
                                    no carrinho
                                </p>

                                <x-quantity-selector container=".hero"
                                    minQuantity="{{ $product->getMinimalQuantity() }}"
                                    unitPrice="{{ $product->discounted_price }}"
                                    currentQuantity="{{ $product->in_cart_data['qty'] ?? $product->getMinimalQuantity() }}"
                                    item="{{ $product->id }}"
                                    data-update-route="{{ route('cart.update') }}"
                                    data-remove-route="{{ route('cart.remove', [$product->in_cart_data['instance'] ?? 'instance', $product->id]) }}"
                                    instance="{{ $product->in_cart_data['instance'] ?? 'instance' }}"></x-quantity-selector>

                                <form
                                    action="{{ route('cart.remove', [$product->in_cart_data['instance'] ?? 'instance', $product->id]) }}"
                                    data-container=".hero" class="form-remove" method="POST"
                                    data-container=".product-card">
                                    @csrf
                                    <button type="submit">
                                        <x-icons.cart-trash></x-icons.cart-trash>
                                    </button>
                                </form>
                            </div>
                            <div data-selector="button-container"
                                @if (!empty($product->in_cart_data['qty'])) class="hide" @endif>
                                @if ($product->availability === \App\Enums\Product\AvailabilityType::PRE_SALE)
                                    <p>Previsão de estoque
                                        <span>{{ $product->expected_arrival?->format('d/m/Y') }}</span>
                                    </p>
                                    <button class="pre-sale" data-selector="addToCart"
                                        id="add-to-cart"
                                        data-product="{{ $product->id }}"
                                        data-qty="{{ $product->in_cart_data['qty'] ?? $product->getMinimalQuantity() }}"
                                        data-url="{{ route('cart.add') }}" data-container=".hero">
                                        Disponível em pré-venda
                                    </button>
                                @else
                                    <p data-selector="label-min-quantity">Quantidade mínima
                                        {{ $product->prices['qty'] }} unidades</p>
                                    <button data-selector="addToCart" data-product="{{ $product->id }}"
                                        id="add-to-cart"
                                        data-qty="{{ $product->in_cart_data['qty'] ?? $product->getMinimalQuantity() }}"
                                        data-url="{{ route('cart.add') }}" data-container=".hero">
                                        <x-icons.shopping-cart></x-icons.shopping-cart>
                                        Comprar
                                    </button>
                                @endif
                            </div>
                        </div>

                        <div class="price-block subtotal" data-selector="price-subtotal">
                            <small><b>Subtotal com IPI</b></small>
                            <strong>
                                <small>R$</small><span>{{ formatMoney($product->prices['subtotal_with_ipi']) }}</span>
                            </strong>
                            <small>
                                @if ($product->prices['price_difference'] > 0)
                                    Economia de <b>R$
                                        {{ formatMoney($product->prices['price_difference']) }}</b>
                                @else
                                    &nbsp;
                                @endif
                            </small>
                        </div>
                    </div>
                @endif
                {{-- <div class="form-group">
                                <label for="coupon">Cupom:</label>
                                <div class="input-group" style="display: flex">
                                    <input type="text" style="width: 22rem" class="form-control" id="coupon" name="coupon" placeholder="Digite seu cupom aqui">
                                    <div class="input-group-append">
                                        <button type="button" id="btn-usar-cupom" class="btn btn-primary">Usar cupom</button>
                                    </div>
                                </div>
                                <input type="hidden" id="couponHidden" name="couponHidden">
                            </div> --}}
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-xs-12">
        <div class="share-container">
            <p>Compartilhe esse produto</p>

            <ul>
                <li>
                    <a href="https://www.facebook.com/sharer/sharer.php?u={{ url()->current() }}&quote=Confira esse produto"
                        target="_blank" noreferrer noopener title="Compartilhe no Facebook">
                        <x-icons.facebook></x-icons.facebook>
                        <span class="hidden-xs hidden-sm">Facebook</span>
                    </a>
                </li>

                <li>
                    <a href="https://api.whatsapp.com/send?text=Veja%20este%20produto%3A%20{{ url()->current() }}"
                        target="_blank" noreferrer noopener title="Compartilhe no Whatsapp">
                        <x-icons.whatsapp></x-icons.whatsapp>
                        <span class="hidden-xs hidden-sm">Whatsapp</span>
                    </a>
                </li>

                <li>
                    <a href="mailto:?subject=Confira {{ $product->title }}&amp;body=Veja este produto: {{ url()->current() }}"
                        target="_blank" noreferrer noopener title="Compartilhe no Email">
                        <x-icons.mail></x-icons.mail>
                        <span class="hidden-xs hidden-sm">Email</span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-xs-12 col-md-6">
        <article class="description-container">
            <h3 class="title">{{ $product->title }}</h3>

            <div>{!! $product->primary_text !!}</div>

            @includeWhen(
                $product->post && $product->embed_type == \App\Models\BlogPost::class,
                'components.embed.post',
                ['embed' => $product->post]
            )

            @includeWhen(
                $product->product && $product->embed_type == \App\Models\Product::class,
                'components.embed.product',
                ['embed' => $product->product]
            )

            <div>{!! $product->secondary_text !!}</div>

            @if ($product->files->count())
                <div class="files-container">
                    @foreach ($product->files as $file)
                        <a href="{{ $file->url }}" title="{{ $file->label }}" target="_blank"
                            noopener noreferrer>
                            <figure>
                                <x-icons.pdf></x-icons.pdf>
                                <figcaption>{{ $file->label }}</figcaption>
                            </figure>
                        </a>
                    @endforeach
                </div>
            @endif
        </article>
    </div>

    <div class="col-xs-12 col-md-6">
        <div class="description-container">
            <h3 class="title">
                Dados Técnicos
                <button id="toggleTechnicalData" class="btn-toggle collapsed">
                    <x-icons.down />
                </button>
            </h3>

            <div id="technicalDataContent" class="table-grid" style="display: none;">
                @if (!empty($product->release_year))
                    <div class="line">
                        <p>Lançamento</p>
                        <p>{{ $product->release_year }}</p>
                    </div>
                @endif

                @if (!empty($product->catalog_name))
                    <div class="line">
                        <p>Catálogo</p>
                        <p>{{ $product->catalog_name }}</p>
                    </div>
                @endif

                @if (!empty($product->catalog_page))
                    <div class="line">
                        <p>Página do Catálogo</p>
                        <p>{{ $product->catalog_page }}</p>
                    </div>
                @endif

                @if (!empty($product->availability))
                    <div class="line">
                        <p>Disponibilidade</p>
                        <p>{{ $product->availability }}</p>
                    </div>
                @endif

                @if (!empty($product->age_group))
                    <div class="line">
                        <p>Faixa Etária</p>
                        <p>{{ $product->age_group }}</p>
                    </div>
                @endif

                @if (!empty($product->certification) && $product->certification !== '[]')
                    <div class="line">
                        <p>Certificação</p>
                        <p>{{ $product->certification }}</p>
                    </div>
                @endif

                @if (!empty($product->brand))
                    <div class="line">
                        <p>Marca</p>
                        <p>{{ $product->brand->name }}</p>
                    </div>
                @endif

                @if (!empty($product->box_width) && !empty($product->box_height) && !empty($product->box_length))
                    <div class="line">
                        <p>Caixa master LxAxC</p>
                        <p>{{ "$product->box_width x $product->box_height x $product->box_length" }} cm</p>
                    </div>
                @endif

                @if (!empty($product->box_weight))
                    <div class="line">
                        <p>Peso da caixa master</p>
                        <p>{{ $product->box_weight }}</p>
                    </div>
                @endif

                @if (!empty($product->box_cubic))
                    <div class="line">
                        <p>Cubagem m³</p>
                        <p>{{ $product->box_cubic }}</p>
                    </div>
                @endif

                @if (!empty($product->origin))
                    <div class="line">
                        <p>Origem</p>
                        <p>{{ $product->origin }}</p>
                    </div>
                @endif

                @if ($product->pAttributes)
                    @foreach ($product->pAttributes->sortBy('order') as $attribute)
                        <div class="line">
                            <p>{{ $attribute->name }}</p>
                            <p>{{ $attribute->pivot->value }}</p>
                        </div>
                    @endforeach
                @endif
            </div>
        </div>

        <div class="description-container">
            <h3 class="title">
                Dados Complementares
                <button id="toggleAdditionalData" class="btn-toggle collapsed">
                    <x-icons.down />
                </button>
            </h3>

            <div id="additionalDataContent" class="table-grid" style="display: none;">
                @if (!empty($product->ean13))
                    <div class="line">
                        <p>EAN</p>
                        <p>{{ $product->ean13 }}</p>
                    </div>
                @endif

                @if (!empty($product->dun14))
                    <div class="line">
                        <p>DUN14</p>
                        <p>{{ $product->dun14 }}</p>
                    </div>
                @endif

                @if (!empty($product->display_code))
                    <div class="line">
                        <p>EAN DISPLAY</p>
                        <p>{{ $product->display_code }}</p>
                    </div>
                @endif

                <div class="line">
                    <p>IPI</p>
                    <p>{{ $product->ipi ?? '0.00%' }}</p>
                </div>

                @if (!empty($product->ncm))
                    <div class="line">
                        <p>NCM</p>
                        <p>{{ $product->ncm }}</p>
                    </div>
                @endif

                @if (!empty($product->cst))
                    <div class="line">
                        <p>CST</p>
                        <p>{{ $product->cst }}</p>
                    </div>
                @endif

                @if (!empty($product->icms))
                    <div class="line">
                        <p>ICMS</p>
                        <p>{{ $product->icms }}</p>
                    </div>
                @endif

                @if (!empty($product->cfop))
                    <div class="line">
                        <p>CFOP</p>
                        <p>{{ $product->cfop }}</p>
                    </div>
                @endif

                @if (!empty($product->certification) && $product->certification !== '[]')
                    <div class="line">
                        <p>Certificação</p>
                        <p>{{ $product->certification }}</p>
                    </div>
                @endif
            </div>
        </div>
    </div>
</div>
</div>
</section>

<section id="products">
<div class="container">
<div class="row">
    <div class="col-xs-12">
        <header class="with-title">
            <h3 id="relacionados">Confira estas sugestões que fizemos especialmente para você!</h3>
        </header>
    </div>
</div>

<div class="grid-products">
    @foreach ($products as $item)
        <div>
            @include('components._card', ['product' => $item])
        </div>
    @endforeach
</div>
</div>
</section>

@include('pages.sections._cta')

<x-fixed.footer></x-fixed.footer>

<x-fixed.photoswipe></x-fixed.photoswipe>
</x-layouts.base>

<script>
    $(document).ready(function () {
        // Função para verificar o tamanho da tela e ajustar o estado inicial
        function adjustToggleState() {
            if ($(window).width() <= 768) { // Padrão collapsed para dispositivos móveis
                $('#technicalDataContent').hide();
                $('#additionalDataContent').hide();
                $('#toggleTechnicalData').addClass('collapsed');
                $('#toggleAdditionalData').addClass('collapsed');
            } else { // Padrão expanded para dispositivos tablet/desktop
                $('#technicalDataContent').show();
                $('#additionalDataContent').show();
                $('#toggleTechnicalData').removeClass('collapsed');
                $('#toggleAdditionalData').removeClass('collapsed');
            }
        }

        // Chamada inicial ao carregar a página
        adjustToggleState();

        // Atualiza o estado ao redimensionar a janela
        $(window).resize(function () {
            adjustToggleState();
        });

        // Toggle para Dados Técnicos
        $('#toggleTechnicalData').on('click', function () {
            $('#technicalDataContent').slideToggle(300); // Alterna exibição
            $(this).toggleClass('collapsed'); // Alterna ícone
        });

        // Toggle para Dados Complementares
        $('#toggleAdditionalData').on('click', function () {
            $('#additionalDataContent').slideToggle(300); // Alterna exibição
            $(this).toggleClass('collapsed'); // Alterna ícone
        });
    });
</script>

{{-- <script>
    document.addEventListener("DOMContentLoaded", function() {
        const btnUsarCupom = document.getElementById('btn-usar-cupom');
        var couponInput = document.getElementById('coupon');
        var couponHiddenInput = document.getElementById('couponHidden');
        const form = document.getElementById('shippingCompanyForm');

        btnUsarCupom.addEventListener('click', function() {
            const cupomInput = document.getElementById('coupon');
            const cupomValue = cupomInput.value.trim();
            const shippingCompanyIdElement = document.getElementById('shipping_company_id');
            const shippingCompanyId = shippingCompanyIdElement ? shippingCompanyIdElement.value : null;

            if (!cupomValue) {
                alert('Por favor, insira um cupom válido.');
                rightSideSpan.text('Por favor, insira um cupom válido.');
                return;
            }

            // Fazer a requisição AJAX
            fetch('{{ route('coupon') }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}' // Se estiver usando CSRF
                    },
                    body: JSON.stringify({
                        coupon: cupomValue,
                        shippingCompanyId: shippingCompanyId
                    })
                })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw response;
                })
                .then(data => {
                    console.log(data);
                    Swal.fire({
                        icon: 'success',
                        title: 'Cupon Usado com Sucesso!',
                        text: data.message
                    });
                    couponInput.disabled = true;
                    btnUsarCupom.disabled = true;
                    couponHiddenInput.value = cupomValue;
                    const totalWithDiscount = data.total_with_discount;

                    const totalWithIpiElement = document.getElementById('total-with-ipi');
                    totalWithIpiElement.innerText = 'R$ ' + totalWithDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    totalWithIpiElement.dataset.value = totalWithDiscount;

                    const totalDiscElement = document.getElementById('total-disc');
                    totalDiscElement.innerText = 'Economia pelo cupom R$ ' + data.discount;
                })
                .catch(error => {
                    error.json().then(errorMessage => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: errorMessage.message ||
                                'Erro ao usar o cupon tente novamente!'
                        });
                    });
                });
        });
    });
</script> --}}
