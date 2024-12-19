<style>
    .purchase-savings {
        background: white;
        padding: 2px 5px;
        max-width: 330px;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .purchase-savings h4 {
        font-size: 16px;
        font-weight: 600;
        color: #21d0a1;
        margin: 0;
    }

    @media (max-width: 991px) {
        .purchase-savings h4 {
            font-size: 16px;
        }
    }

    .purchase-savings span[data-selector="label-header-total-economy"],
    .purchase-savings span[data-selector="label-header-total-economy-coupon"],
    .purchase-savings span[data-selector="label-payment-condition"] {
        font-size: 14px;
        font-weight: 600;
        color: #21d0a1;
    }

    .purchase-savings span[data-selector="label-header-total-economy"]:first-child,
    .purchase-savings span[data-selector="label-header-total-economy-coupon"]:first-child,
    .purchase-savings span[data-selector="label-payment-condition"]:first-child {
        margin-top: 2px;
    }

    @media (max-width: 991px) {
        .purchase-savings span[data-selector="label-header-total-economy"],
        .purchase-savings span[data-selector="label-header-total-economy-coupon"],
        .purchase-savings span[data-selector="label-payment-condition"] {
            font-size: 12px;
        }
    }
    .custom-confirm-button {
    background-color: #005CAC !important;  /* Cor personalizada do botão */
    border-color: #005CAC !important;  /* Cor da borda (opcional) */
    }

    .custom-confirm-button:hover {
    background-color: #004a91 !important;  /* Cor do botão quando estiver hover (opcional) */
    }

    .custom-confirm-button:focus {
    box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, 0.5) !important;  /* Sombra quando focado (opcional) */
    }

</style>
<div class="order-item">
    <div class="row-header">
        <div class="left-side">
            <figure>
                @if (!empty($order->supplier))
                    <img src="{{ "{$order->supplier->image_path}/{$order->supplier->image}" }}"
                        alt="{{ $order->supplier->name ?? $order->supplier->company_name }}">
                @else
                    <img src="{{ asset('images/default/product/thumb-default.jpg') }}"
                        alt="{{ $order->product_supplier_name ?? null }}">
                @endif
            </figure>

            <div class="line">
                <p>Pedido Número</p>
                <p>{{ $order->code }}</p>
            </div>

            <button data-selector="toggle-order" class="hidden-md hidden-lg" data-item="{{ $order->code }}">
                <x-icons.down></x-icons.down>
            </button>
        </div>

        <div class="right-side" data-selector="item-{{ $order->code }}">
            <ul class="nav nav-pills">
                <li
                    class="
                    nav-item
                    @if ($order->getRawOriginal('current_status') == 'canceled') canceled
                    @elseif($order->orderStatuses->contains('name', 'Novo'))
                        active @endif
                ">
                    <x-icons.status-new></x-icons.status-new>
                    <span>Novo</span>
                </li>

                <li
                    class="
                    nav-item
                    @if ($order->getRawOriginal('current_status') == 'canceled') canceled
                    @elseif($order->orderStatuses->contains('name', 'Transmitido'))
                        active @endif
                ">
                    <x-icons.status-shipped></x-icons.status-shipped>
                    <span>Transmitido</span>
                </li>

                <li
                    class="
                    nav-item
                    @if ($order->getRawOriginal('current_status') == 'canceled') canceled
                    @elseif($order->orderStatuses->contains('name', 'Faturado'))
                        active @endif
                    ">
                    @if ($order->getRawOriginal('current_status') == 'canceled')
                        <x-icons.status-canceled></x-icons.status-canceled>
                        <span>Cancelado</span>
                    @else($order->orderStatuses->contains('name', 'Faturado'))
                        <x-icons.status-billed></x-icons.status-billed>
                        <span>Faturado</span>
                    @endif
                </li>
            </ul>
        </div>
    </div>
    <div class="row row-details" data-selector="item-{{ $order->code }}">
        <div class="col-xs-5 col-md-2">
            <p>Fornecedor</p>
            <p>Transportadora</p>
            <p>Quantidades</p>
            <p>Emissao <strong>{{ $order->created_at->format('d/m/Y') }}</strong></p>
        </div>

        <div class="col-xs-7 col-sm-6 col-md-3">
            <p>
                <b>{{ \Illuminate\Support\Str::limit($order->product_supplier_name ?? ($order->supplier?->name ?? $order->supplier?->company_name), 22) }}</b>
                <span data-toggle="tooltip"
                    title="Fornecedor {{ $order->product_supplier_name ?? ($order->supplier?->name ?? $order->supplier?->company_name) }}">
                    <x-icons.exclamation-circle></x-icons.exclamation-circle>
                </span>
            </p>

            <p>
                {{ \Illuminate\Support\Str::limit($order->shipping_company_name ?? 'Não encontrada', 22) }}
                <span data-toggle="tooltip" title="Transportadora {{ $order->shipping_company_name }}">
                    <x-icons.exclamation-circle></x-icons.exclamation-circle>
                </span>
            </p>

            <p>
                {{ "$order->count_products produtos, $order->count_sum_products peças" }}
                <span class="hidden-xs"> no total</span>
            </p>

            <p>
                Faturamento <span class="hidden-xs">estimado</span> <strong>
                    {{ $order->getRawOriginal('current_status') == 'canceled' ? 'Cancelado' : $order->lead_time ?? '-' }}
                </strong>

                <span class="hidden-sm hidden-md hidden-lg" data-toggle="tooltip"
                    title="Faturamento estimado {{ $order->lead_time ?? '-' }}">
                    <x-icons.exclamation-circle></x-icons.exclamation-circle>
                </span>
            </p>
        </div>

        <div class="col-xs-5 col-md-2">
            <p>Data do pedido</p>
            <p>Prazo de Pagamento</p>
        </div>

        <div class="col-xs-7 col-md-1">
            <p><b>{{ $order->created_at->format('d/m/Y') }}</b></p>
            <p>{{ $order->installment_rule ?? '-' }}</p>
            <p></p>
        </div>

        <div class="col-xs-6 col-md-2 hidden-xs">
            <p class="text-right">Total sem IPI</p>
            <p class="text-right">IPI</p>
        </div>

        <div class="col-xs-6 col-md-2 hidden-xs">
            @if ($order->coupon_discount_value != 0 && $order->installment_discount_value != 0)
                <p class="text-right">R$
                    {{ formatMoney($order->total_value - $order->coupon_discount_value - $order->installment_discount_value) }}
                </p>
                <p class="text-right">R$
                    {{ formatMoney($order->total_value_with_ipi - $order->coupon_discount_value_ipi - $order->installment_discount_value_ipi - ($order->total_value - $order->coupon_discount_value - $order->installment_discount_value)) }}
                </p>
                <h5 @if ($order->getRawOriginal('current_status') == 'canceled') class="canceled" @endif>
                    R$
                    {{ formatMoney($order->total_value_with_ipi - $order->coupon_discount_value_ipi - $order->installment_discount_value_ipi) }}
                </h5>
            @elseif ($order->coupon_discount_value != 0 && ($order->installment_discount_value = 0))
                <p class="text-right">R$
                    {{ formatMoney($order->total_value - $order->coupon_discount_value) }}
                </p>
                <p class="text-right">R$
                    {{ formatMoney($order->total_value_with_ipi - $order->coupon_discount_value_ipi - ($order->total_value - $order->coupon_discount_value)) }}
                </p>
                <h5 @if ($order->getRawOriginal('current_status') == 'canceled') class="canceled" @endif>
                    R$ {{ formatMoney($order->total_value_with_ipi - $order->coupon_discount_value_ipi) }}
                </h5>
            @elseif ($order->installment_discount_value != 0 && ($order->coupon_discount_value = 0))
                <p class="text-right">R$
                    {{ formatMoney($order->total_value - $order->installment_discount_value) }}
                </p>
                <p class="text-right">R$
                    {{ formatMoney($order->total_value_with_ipi - $order->installment_discount_value_ipi - ($order->total_value - $order->installment_discount_value)) }}
                </p>
                <h5 @if ($order->getRawOriginal('current_status') == 'canceled') class="canceled" @endif>
                    R$ {{ formatMoney($order->total_value_with_ipi - $order->installment_discount_value_ipi) }}
                </h5>
            @else
                <p class="text-right">R$ {{ formatMoney($order->total_value ?? 0) }}</p>
                <p class="text-right">R$ {{ formatMoney($order->total_value_with_ipi - $order->total_value) }}</p>
                <h5 @if ($order->getRawOriginal('current_status') == 'canceled') class="canceled" @endif>
                    R$ {{ formatMoney($order->total_value_with_ipi ?? 0) }}
                </h5>
            @endif
            <p @if ($order->getRawOriginal('current_status') == 'canceled') class="canceled" @endif>Total com IPI</p>
        </div>
    </div>

    {{-- @if ($order->total_discount > 0)
        <div class="row-economy hidden-xs" data-selector="item-{{ $order->code }}">
            <div class="col-xs-12 col-md-12">
                <span>Economia R$ {{ formatMoney($order->total_discount) ?? '-' }}</span>
            </div>
        </div>
    @endif --}}

    <div class="row row-main" data-selector="item-{{ $order->code }}">
        <div class="col-xs-5 col-md-2">
            <p>Razão social</p>
            <p>CNPJ</p>
            <p>E-mail</p>
            <p>Telefone</p>
        </div>

        <div class="col-xs-7 col-md-4">
            <p>
                <b>{{ \Illuminate\Support\Str::limit($client->company_name, 22) }}</b>
                <span data-toggle="tooltip" title="Razão Social {{ $client->company_name }}">
                    <x-icons.exclamation-circle></x-icons.exclamation-circle>
                </span>
            </p>

            <p>{{ $client->document }}</p>

            <p class="email">{{ \Illuminate\Support\Str::limit($order->buyer_email, 22) }}</p>

            <p>{{ $order->buyer_cellphone }}</p>
        </div>

        <div class="col-xs-5 visible-xs">
            <p><b>Endereço de envio:</b></p>
        </div>

        <div class="col-xs-7 col-sm-6 col-md-4 visible-xs">
            <p class="hidden-xs"><strong>O pedido será enviado para:</strong></p>
            <p>{{ $order->address_street }}, {{ $order->address_number }}</p>
            <p>{{ $order->address_district }}, {{ $order->address_city }}, {{ $order->address_state }}</p>
            <p>CEP {{ $order->address_zipcode }}</p>
        </div>

        {{-- <div class="col-xs-12">
            <hr class="visible-xs">
        </div> --}}

        <div class="col-xs-5 visible-xs">
            <p class="text-right">Total sem IPI</p>
            <p class="text-right">IPI</p>

            @if (is_null($order->shipping_company_id))
                <p class="text-right">Frete</p>
            @endif

            <p class="text-right">Total com IPI</p>
        </div>

        <div class="col-xs-7 visible-xs">
            <p>R$ {{ formatMoney($order->total_value ?? 0) }}</p>
            <p>R$ {{ formatMoney($order->total_value_with_ipi - $order->total_value) }}</p>

            @if (is_null($order->shipping_company_id))
                <p>Grátis</p>
            @endif

            <h5 @if ($order->getRawOriginal('current_status') == 'canceled') class="canceled" @endif>
                R$ {{ formatMoney($order->total_value_with_ipi ?? 0) }}
            </h5>
        </div>
        {{-- @if ($order->code === 'WRE08241489')
                @dd($order)
        @endif --}}

            @if ($order->installment_discount_value !== '0.00' || $order->total_discount !== '0.00' || $order->coupon_discount_value !== '0.00')
                <div class="row row-economy ">
                    @if (!empty($order->coupon) && $order->coupon_discount_value && $order->coupon_discount_value !== "0.00")
                        <div class="col-xs-7">
                            <h4>Cupom:</h4>
                            <span>{{$order?->coupon?->name}}</span>
                        </div>
                    @endif

                    <div class="col-xs-7">
                        <h4>Econômias:</h4>
                        <div id="savings" class="purchase-savings">
                            @if ($order->installment_discount_value !== '0.00' && $order->installment_discount_value)
                                <span data-selector="label-header-total-economy">
                                    R$
                                    {{$order->installment_discount_value}}
                                    em prazos de pagamento
                                </span>
                            @endif
                            @if($order->total_discount && $order->total_discount !== "0.00")
                                <span
                                data-selector="label-header-total-economy"
                                > R$
                                    {{$order->total_discount}}
                                    em promoções
                                </span>
                            @endif
                            @if ($order->coupon_discount_value && $order->coupon_discount_value !== "0.00")
                                <span data-selector="label-header-total-economy">
                                    R$
                                    {{$order->coupon_discount_value}}
                                    em cupons
                                </span>
                            @endif

                        </div>
                    </div>
                </div>
            @endif

        <div class="col-xs-12">
            <hr class="visible-xs">
        </div>
    </div>

    <div class="row-buttons" data-selector="item-{{ $order->code }}">

        <button class="reorderButton btn btn-primary" data-order-id="{{ $order->id }}">
            Compre Novamente
        </button>

        @if (count($order->products))
            <a href="{{ route('buyer.exportar_order', $order->code) }}" target="_blank" class="active">
                Download em EXCEL
            </a>

            <a href="{{ route('buyer.downloadPDF', $order->code) }}" target="_blank" class="active">
                Download em PDF
            </a>

            <button type="button" class="btn-open" data-text-opened="Recolher Produtos" data-text-closed="Ver Produtos"
                data-container=".order-item">
                Ver Produtos
            </button>
        @endif
    </div>

    @if (count($order->products))
    {{-- @dd($order->products) --}}
        <x-products-list :products="$order->products" data-selector="item-{{ $order->code }}"></x-products-list>
    @endif
</div>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    $(document).ready(function() {
        $('.reorderButton').click(function() {
            var orderId = $(this).data('order-id');
            var button = $(this);

            // Impedir múltiplos cliques durante a execução do AJAX
            if (button.prop('disabled')) return; // Se já estiver desabilitado, não faz nada

            button.prop('disabled', true); // Desabilita o botão
            button.html(
                '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Copiando...'
            ); // Muda o texto do botão para mostrar que está copiando

            $.ajax({
                type: 'POST',
                url: '/carrinho/copiar/' + orderId,
                success: function(response) {
                    console.log('Pedido copiado com sucesso!');
                    Swal.fire({
                        imageUrl: '{{ asset("images/new-1.png") }}',
                        text: 'Todos os produtos disponíveis foram incluídos em seu novo carrinho.',
                        confirmButtonText: 'OK',
                        customClass: {
                            confirmButton: 'custom-confirm-button'  // Adiciona uma classe personalizada ao botão de confirmação
                        }
                    }).then(function() {
                        button.prop('disabled', false).html('Compre Novamente'); // Habilita o botão após fechar o alerta
                    });
                },
                error: function(xhr, status, error) {
                    console.error('Erro ao copiar pedido:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro!',
                        text: 'Ocorreu um erro ao copiar o pedido. Tente novamente mais tarde.',
                        confirmButtonText: 'OK'
                    }).then(function() {
                        button.prop('disabled', false).html('Compre Novamente'); // Habilita o botão após fechar o alerta
                    });
                }
            });
        });
    });
</script>



