@push('styles')
    <link rel="stylesheet" href="{{ mix('css/cart.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/cart.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>
    <style>
        .modal {
            display: none;
            z-index: 1050;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.4);
            padding-top: 60px;
        }

        .import-enviar {
            background-color: rgb(142, 200, 233);
            color: white;
            padding: 1rem 1.2rem;
            border-radius: 0.9rem;
            transition: background-color 0.3s;

        }
        .import-enviar:hover {
            background-color: rgb(72, 136, 197); /* Azul mais escuro para o hover */
        }

        .import-bt{
            background-color: rgb(142, 200, 233);
            color: white;
            padding: 1rem 1.6rem;
            border-radius: 0.9rem;
            border: none;
            transition: background-color 0.3s;
        }

        .import-bt:hover {
            background-color: rgb(72, 136, 197); /* Azul mais escuro para o hover */
        }

        /* Conteúdo do modal */
        .modal-content {
            background-color: #fefefe;
            margin: 5% auto; /* Centralizar verticalmente */
            padding: 20px;
            border: 1px solid #888;
            width: 80%; /* Largura do modal */
        }

        /* Botão de fechar */
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
    </style>

    <section id="cart">
        <div class="container">
            @include('components._breadcrumb', ['currentLink' => ['label' => 'Carrinho de Compras']])

            <div class="cart-container">
                <x-loader id="item-page"></x-loader>

                <div class="cart-supplier-list">
                    @forelse($cart->instances ?? [] as $instance)
                        <div class="cart-supplier-item flex gap-20"
                             data-route-update="{{ route('cart.update_data', $instance->uuid) }}">
                            <x-loader id="item-{{ $instance->id }}"></x-loader>

                            <div class="header">
                                <div class="header-top">
                                    <div class="col-logo">
                                        @if(!empty($instance->supplier->image))
                                            <a
                                                href="{{ route('products', "rp={$instance->supplier->id}") }}"
                                                title="Filtrar por {{ $instance->supplier->name }}"
                                                @if(session('filter.supplier') == $instance->supplier->id) class="active" @endif
                                            >
                                                <figure>
                                                    <picture>
                                                        <source
                                                            srcset="{{ str_replace('jpg', 'webp', "{$instance->supplier->image_path}/{$instance->supplier->image}") }}"
                                                            type="image/webp"
                                                        >

                                                        <source
                                                            srcset="{{ "{$instance->supplier->image_path}/{$instance->supplier->image}" }}"
                                                            type="image/jpeg"
                                                        >

                                                        <img
                                                            src="{{ "{$instance->supplier->image_path}/{$instance->supplier->image}" }}"
                                                            alt="{{ $instance->supplier->name ?? $instance->supplier->company_name }}"
                                                        >
                                                    </picture>
                                                </figure>
                                            </a>
                                        @else
                                            <h3>{{ $instance->supplier->name ?? $instance->supplier->company_name }}</h3>
                                        @endif
                                    </div>

                                    <div class="hidden-md hidden-lg info-mobile">
                                        <p>Total do pedido com IPI</p>
                                        <h3>
                                            R$ <span data-selector="label-header-total-with-ipi">
                                            {{ number_format($instance->products_sum_subtotal_with_ipi, 2, ',', '.') }}
                                            </span>
                                        </h3>

                                        <p>
                                            Pedido mínimo de
                                            R$ {{ number_format($instance->supplier->min_order, 2, ',', '.') }}</p>
                                    </div>

                                    <div class="expand-cart-icon disabled hidden-md hidden-lg rotate-icon"
                                         data-id="{{$instance->id}}">
                                        <span>
                                            <x-icons.down></x-icons.down>
                                        </span>
                                    </div>
                                </div>

                                <div class="col-info flex hidden-cart-items" data-expand-id="{{$instance->id}}">
                                    <p data-selector="progress-message">
                                        @if(empty($instance->supplier->min_order) || $instance->products_sum_subtotal_with_ipi >= $instance->supplier->min_order)
                                            Seu pedido já pode ser finalizado! Clique em continuar comprando para incluir
                                            mais produtos ou em continuar para escolher forma de pagamento e liberar o seu
                                            pedido.
                                        @else
                                            Precisamos que complete mais
                                            <span data-selector="min-value-remaining">
                                            R$ {{ number_format(($instance->supplier->min_order - $instance->products_sum_subtotal_with_ipi), 2, ',', '.') }}
                                        </span>
                                            para atingir o pedido mínimo de
                                            <b>R$ {{ number_format($instance->supplier->min_order, 2, ',', '.') }}</b>.
                                            Clique em continuar comprando para incluir mais produtos em seu carrinho!
                                        @endif
                                    </p>

                                    <div class="progress hidden-md hidden-lg">
                                        <div
                                            class="progress-bar progress-bar-striped active @if(empty($instance->supplier->min_order) || $instance->products_sum_subtotal_with_ipi >= $instance->supplier->min_order) completed @endif"
                                            role="progressbar"
                                            data-min-value="{{ number_format($instance->supplier->min_order, 2, ',', '.') }}"
                                            aria-valuenow="{{ ($instance->products_sum_subtotal_with_ipi >= $instance->supplier->min_order) ? 100 : (($instance->products_sum_subtotal_with_ipi / $instance->supplier->min_order) * 100) }}"
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                            style="width: {{ ($instance->products_sum_subtotal_with_ipi >= $instance->supplier->min_order) ? 100 : (($instance->products_sum_subtotal_with_ipi / $instance->supplier->min_order) * 100) }}%;"
                                        >
                                            <span class="sr-only">{{ ($instance->products_sum_subtotal_with_ipi >= $instance->supplier->min_order) ? 100 : (($instance->products_sum_subtotal_with_ipi / $instance->supplier->min_order) * 100) }}% Complete</span>
                                        </div>
                                    </div>

                                    <div class="line-general flex">
                                        <div class="column-left flex gap-20">
                                            <div class="left-side">
                                                <p>Fornecedor</p>
                                                {{--<p>Transportadora</p>--}}
                                                <p>Quantidades</p>
                                            </div>

                                            <div class="right-side">
                                                <p>
                                                    <b>
                                                        {{ $instance->supplier->name ?? $instance->supplier->company_name }}
                                                    </b>
                                                </p>

                                                <p>
                                                    <span data-selector="label-header-qty">
                                                        {{ $instance->products->count() }}
                                                    </span> produtos,
                                                    <span data-selector="label-header-qty-items">
                                                        {{ $instance->products_sum_qty }}
                                                    </span> peças no total
                                                </p>
                                            </div>
                                        </div>

                                        <div class="column-center flex gap-20">
                                            <div class="left-side">
                                                <p>Pedido criado</p>
                                                <p>Última atualização</p>
                                                <p>Faturamento</p>
                                                {{--<p>Prazo de pagamento</p>--}}
                                            </div>

                                            <div class="right-side">
                                                <p class="data-pedido-text">{{ $instance->created_at->format('d/m/Y') }}</p>
                                                <p class="data-pedido-text">{{ $instance->updated_at->format('d/m/Y') }}</p>
                                                <p>
                                                    <b>{{ $instance?->supplier?->leadTime?->name ?? 'Não Informado' }}</b>
                                                </p>
                                                {{--<p>&nbsp;</p>--}}
                                            </div>
                                        </div>

                                        <div class="column-right flex">
                                            <div class="line-top flex gap-20">
                                                <div class="left-side">
                                                    <p>Total sem IPI</p>
                                                    <p>IPI</p>
                                                </div>

                                                <div class="right-side">
                                                    <p data-selector="label-header-total">
                                                        R$ {{ number_format($instance->products_sum_subtotal, 2, ',', '.') }}
                                                    </p>

                                                    <p data-selector="label-header-ipi-value">
                                                        R$ {{ number_format($instance->products_sum_ipi_value, 2, ',', '.') }}
                                                    </p>
                                                </div>
                                            </div>

                                            <div class="line-bottom">
                                                <h3>
                                                    R$ <span data-selector="label-header-total-with-ipi">
                                                        {{ number_format($instance->products_sum_subtotal_with_ipi, 2, ',', '.') }}
                                                    </span>
                                                </h3>

                                                <p>Total com IPI</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="line-extra flex">
                                        <h5 class="flex">
                                            @if($instance->supplier->shippingType?->id === 2)
                                                <x-icons.truck></x-icons.truck>
                                                Frete Grátis
                                            @else
                                                &nbsp;
                                            @endif
                                        </h5>

                                        @if($instance->products_sum_discount !== null && $instance->products_sum_discount !== "0.00")
                                            <div id="savings" class="purchase-savings">
                                                <h4>Você economizou:</h4>

                                                <span data-selector="label-header-total-economy">
                                                    R${{ number_format($instance->products_sum_discount, 2, ',', '.') }}
                                                     em promoções
                                                </span>
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </div>

                            <div class="visible-md visible-lg main flex"
                                 data-min-order="{{ $instance->supplier->min_order }}">
                                <p data-selector="progress-message">
                                    @if(empty($instance->supplier->min_order) || $instance->products_sum_subtotal_with_ipi >= $instance->supplier->min_order)
                                        Seu pedido já pode ser finalizado! Clique em continuar comprando para incluir
                                        mais produtos ou em continuar para escolher forma de pagamento e liberar o seu
                                        pedido.
                                    @else
                                        Precisamos que complete mais
                                        <span data-selector="min-value-remaining">
                                            R$ {{ number_format(($instance->supplier->min_order - $instance->products_sum_subtotal_with_ipi), 2, ',', '.') }}
                                        </span>
                                        para atingir o pedido mínimo de
                                        <b>R$ {{ number_format($instance->supplier->min_order, 2, ',', '.') }}</b>.
                                        Clique em continuar comprando para incluir mais produtos em seu carrinho!
                                    @endif
                                </p>

                                <div class="progress">
                                    <div
                                        class="progress-bar progress-bar-striped active @if(empty($instance->supplier->min_order) || $instance->products_sum_subtotal_with_ipi >= $instance->supplier->min_order) completed @endif"
                                        role="progressbar"
                                        data-min-value="{{ number_format($instance->supplier->min_order, 2, ',', '.') }}"
                                        aria-valuenow="{{ ($instance->products_sum_subtotal_with_ipi >= $instance->supplier->min_order) ? 100 : (($instance->products_sum_subtotal_with_ipi / $instance->supplier->min_order) * 100) }}"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        style="width: {{ ($instance->products_sum_subtotal_with_ipi >= $instance->supplier->min_order) ? 100 : (($instance->products_sum_subtotal_with_ipi / $instance->supplier->min_order) * 100) }}%;"
                                    >
                                        <span class="sr-only">{{ ($instance->products_sum_subtotal_with_ipi >= $instance->supplier->min_order) ? 100 : (($instance->products_sum_subtotal_with_ipi / $instance->supplier->min_order) * 100) }}% Complete</span>
                                    </div>
                                </div>
                            </div>

                            <div class="footer flex hidden-cart-items" data-expand-footer-id="{{$instance->id}}">
                                <a href="{{ route('cart.download_pdf', $instance->uuid) }}" class="btn-inverse"
                                    target="_blank">Download Pedido</a>

                                <a href="{{ route('cart.remove.all', $instance->uuid) }}">Remover Produtos</a>
                                <button
                                    class="btn-open"
                                    data-text-opened="Recolher Produtos"
                                    data-text-closed="Ver Produtos"
                                    data-container=".cart-supplier-item"
                                >
                                    Ver Produtos
                                </button>
                                <a href="{{ route('cart.cancel_order', $instance->uuid) }}">Cancelar Pedido</a>
                                <a
                                    style="background-color: #005CAC; color: white;"
                                    href="{{ route('products') }}?rp={{ $instance->supplier->id }}"
                                >
                                    Continuar Comprando
                                </a>





                                <a
                                    style="background-color: #39C6B5; color: white;"
                                    class="button-glow"
                                    data-selector="button-continue"
                                    data-toggle="tooltip"
                                    data-href="{{ route('cart.show_order', $instance->uuid) }}"
                                    @if($instance->supplier->min_order > 0 && $instance->supplier->min_order > $instance->products_sum_subtotal_with_ipi)
                                    href="javascript:void(0);"
                                    disabled="disabled"
                                    aria-disabled="true"
                                    title="O pedido mínimo para esta indústria é de R$ {{ number_format($instance->supplier->min_order, 2, ',', '.') }}"
                                    @else
                                    href="{{ route('cart.show_order', $instance->uuid) }}"
                                    title="Revise e finalize o seu pedido"
                                    @endif
                                >
                                PRAZOS DE PAGAMENTO
                                </a>
                            </div>

                            <x-products-list
                                :products="$instance->products"
                                :instance="$instance->uuid"
                                isCart
                            ></x-products-list>
                        </div>
                    @empty
                        <h4>{{ $revalidated ? 'Você ainda não adicionou produtos ao carrinho.' : 'Aguarde enquanto revalidamos suas promoções.' }}</h4>
                    @endforelse
                </div>
            </div>
        </div>

    </section>

    <x-fixed.footer></x-fixed.footer>

    @push('scripts-inline')
        <script>
            $(function() {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                const alreadyValidated = urlParams.get('rv') !== null;

                if(!alreadyValidated) {
                    showLoader('Atualizando carrinho...', 'item-page');
                    $.get('{{ route("cart.revalidate") }}', function ({ status, message, revalidated }) {
                        hideLoader('item-page');
                        if (status === 'error') {
                            alert(message);
                            return;
                        }
    
                        if((revalidated !== undefined && revalidated) || !alreadyValidated) {
                            showLoader('A página será atualizada automaticamente...', 'item-page');
    
                            window.location.href = '{{ route("cart.index", ['rv' => true]) }}';
                        }
                    });
                }
            }); 
        </script>
    @endpush
</x-layouts.base>
