@push('styles')
    <link rel="stylesheet" href="{{ mix('css/product-details.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section id="product-details">
        <div class="container">
            @include('components._breadcrumb', [
                'links' => [
                    ['url' => route('page.industry'), 'label' => 'Fornecedores']
                ],
                'currentLink' => ['label' => $product?->category?->name]
            ])

            <div class="row">
                <div class="hero">
                    <div class="row">
                        <div class="col-xs-12">
                            <div class="col-xs-12 col-md-6">
                                <div class="gallery photoswipe slick-default">
                                    @if(count($product->images))
                                        @foreach ($product->images as $key => $image)
                                            <figure>
                                                <a href="{{ asset($image->image) }}" data-size="{{ $image->dimensions }}">
                                                    @if($product->badge)
                                                        <img class="badge" src="{{ $product->badge->image_url }}" alt="{{ $product->badge?->name }}">
                                                    @endif

                                                    <picture>
                                                        <source srcset="{{ $image->webp_image }}" type="image/webp">
                                                        <source srcset="{{ $image->image }}" type="image/jpeg">
                                                        <img src="{{ $image->image }}" alt="{{ $image->label }}">
                                                    </picture>
                                                </a>
                                            </figure>
                                        @endforeach
                                    @endif
                                </div>
                            </div>

                            <div class="col-md-6 col-sm-12 col-xs-12">
                                <h1>{{ $product->title }}</h1>

                                <div class="codebar-line">
                                    <img src="{{ asset('images/ico-barcode.svg') }}" alt="Barcode" width="27px" height="23px">
                                    <span>Referência {{ $product->reference }}</span>
                                </div>

                                @if(!empty($product->supplier->image) || !empty($product->brand->image))
                                    <div class="logos-line">
                                        @if(!empty($product->supplier->image))
                                            <img loading="lazy" src="{{ asset("{$product->supplier->image_path}/{$product->supplier->image}") }}" alt="{{ $product->supplier->name }}">
                                        @endif

                                        @if(!empty($product->brand->image))
                                            <img loading="lazy" src="{{ asset("{$product->brand->image_path}/{$product->brand->image}") }}" alt="{{ $product->brand->name }}">
                                        @endif
                                    </div>
                                @endif

                                <div class="price-line">
                                    <x-quantity-selector
                                        container=".price-line"
                                        minQuantity="{{ $product->getMinimalQuantity() }}"
                                        unitPrice="{{ $product->discounted_price }}"
                                        currentQuantity="{{ $product->getMinimalQuantity() }}"
                                        item="{{ $product->id }}"
                                    ></x-quantity-selector>

                                    <div class="price-box unit-price-box">
                                        <small>Valor Unitário</small>
                                        <p><small>R$</small><span>{{ $product->formated_discounted_price ?? 0.00 }}</span></p>
                                    </div>

                                    <div class="price-box total-price-box">
                                        <small>Valor Total</small>
                                        <p data-selector="total-price">
                                            <small>R$</small>
                                            <span>{{ number_format($product->discounted_price * $product->getMinimalQuantity(), 2, ',', '.') }}</span>
                                        </p>
                                    </div>
                                </div>

                                @if($product->canBeSold() === true)
                                    @if(count($product->getProductQuantityPromotions()))
                                        @foreach($product->getProductQuantityPromotions() as $productPromotion)
                                            <div class="promotions-container">
                                                <span>Compre o mínimo de {{ $productPromotion->min_quantity }} unidades e obtenha desconto de {{ $productPromotion->discount_value }}% no fechamento do pedido. Promoção válida até {{ $productPromotion->valid_until->format('d/m/Y') }}</span>
                                            </div>
                                        @endforeach
                                    @endif
                                @else
                                    <h4>{{ $product->canBeSold() }}</h4>
                                @endif
                            </div>
                        </div>
                    </div>

                    <div class="col-xs-12">
                        <div class="gallery-product">
                            @if(count($product->images))
                                <div class="photoswipe" id="gallery-{{ $product->id }}">
                                    @foreach ($product->images as $image)
                                        <figure>
                                            <a href="{{ asset($image->image) }}" data-size="{{ $image->dimensions }}">
                                                <picture>
                                                    <source srcset="{{ $image->webp_thumb }}" type="image/webp">
                                                    <source srcset="{{ $image->thumb }}" type="image/jpeg">
                                                    <img loading="lazy" src="{{ $image->thumb }}" alt="{{ $image->label }}">
                                                </picture>
                                            </a>
                                        </figure>
                                    @endforeach
                                </div>
                            @endif
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-xs-12">
                    <div class="share-container unavailable">
                        <p>Este produto está indisponível no momento</p>

                        {{-- // TODO remover as linhas abaixo quando os testes forem encerrados --}}
                        @if(is_null($product->title) || $product->title == '')
                            <p>Campo "título" vazio</p>
                        @endif

                        @if(is_null($product->category_id))
                            <p>Produto sem categoria</p>
                        @endif

                        @if(is_null($product->brand_id))
                            <p>Produto sem marca</p>
                        @endif

                        @if(is_null($product->box_price) || $product->box_price <= 0.00)
                            <p>Preço da caixa vazio ou igual a 0.00</p>
                        @endif

                        @if(is_null($product->box_minimal) || $product->box_minimal == 0.0)
                            <p>Quantidade mínima da caixa vazio ou igual a 0</p>
                        @endif

                        @if(is_null($product->cst) || $product->cst <= 0.0)
                            <p>CST vazio ou igual a 0.0</p>
                        @endif

                        @if(is_null($product->ean13) || $product->ean13 == '')
                            <p>Campo "EAN13" vazio</p>
                        @endif

                        @if(is_null($product->ipi) || $product->ipi <= 0.0)
                            <p>IPI vazio ou igual a 0.0</p>
                        @endif

                        @if(is_null($product->ncm) || $product->ncm == '')
                            <p>Campo "NCM" vazio</p>
                        @endif

                        @if($product->published_at->gt(\Carbon\Carbon::now()))
                            <p>Produto será publicado em {{ $product->published_at->format('d/m/Y H:i') }}</p>
                        @endif

                        @if($product->images->count() <= 0)
                            <p>Produto não possui imagem</p>
                        @endif
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
                             'components.embed.post', ['embed' => $product->post]
                        )

                        @includeWhen(
                            $product->product && $product->embed_type == \App\Models\Product::class,
                             'components.embed.product', ['embed' => $product->product]
                        )

                        <div>{!! $product->secondary_text !!}</div>

                        @if($product->files->count())
                            <div class="files-container">
                                @foreach($product->files as $file)
                                    <a href="{{ $file->url }}" title="{{ $file->label }}" target="_blank" noopener noreferrer>
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
                        <h3 class="title">Dados Técnicos</h3>

                        <div class="table-grid">
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

                            @if (!empty($product->certification))
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
                                    <p>Dimensões da caixa master LxAxC</p>
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
                                @foreach($product->pAttributes->sortBy('order') as $attribute)
                                    <div class="line">
                                        <p>{{ $attribute->name }}</p>
                                        <p>{{ $attribute->pivot->value }}</p>
                                    </div>
                                @endforeach
                            @endif
                        </div>
                    </div>

                    <div class="description-container">
                        <h3 class="title">Dados Complementares</h3>

                        <div class="table-grid">
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

                            @if (!empty($product->ipi))
                                <div class="line">
                                    <p>IPI</p>
                                    <p>{{ $product->ipi }}</p>
                                </div>
                            @endif

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
                        <h1>Veja Também</h1>
                    </header>
                </div>
            </div>

            <div class="row">
                @foreach($products as $product)
                    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                        @include('components._card')
                    </div>
                @endforeach
            </div>
        </div>
    </section>

    @include('pages.sections._cta')

    <x-fixed.footer></x-fixed.footer>

    <x-fixed.photoswipe></x-fixed.photoswipe>
</x-layouts.base>
