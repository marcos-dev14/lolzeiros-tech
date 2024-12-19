<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} | Pedido</title>

    <link rel="stylesheet" href="{{ asset('css/invoice.css') }}">

    @if(!empty(request()->view))
        <style>
            header, main {
                max-width: 991px;
                margin: 0 auto;
            }

            header {
                top: 0;
                position: relative;
                display: block;
            }
            .custom-economy {
                display: inline-block;
                padding: 8px 12px;
                background: #ffffff; 
                border-radius: 15px;
                font-size: 14px;
                font-weight: 600;
                color: #39C6B5;
                margin-top: 2px;
            }
            
        </style>
    @endif
</head>
<body>
<header>
    <div class="logo">
        <img src="{{ asset('images/pdf/logo.png') }}" alt="Logo">
    </div>

    <div class="phones">
        <div class="col">
            <p>
                <img src="{{ asset('images/pdf/phone.png') }}" alt="Phone">
                {{ config('square_config.phone_two') }}
            </p>

            <p>
                <img src="{{ asset('images/pdf/whatsapp.png') }}" alt="Mobile">
                {{ config('square_config.whatsapp') }}
            </p>
        </div>

        <div class="col">
            <p>
                <img src="{{ asset('images/pdf/email.png') }}" alt="Email">
                {{ config('square_config.mail_receive') }}
            </p>

            <p>
                <img src="{{ asset('images/pdf/site.png') }}" alt="Site">
                www.augeapp.com.br
            </p>
        </div>

        <div class="col">
            <p>
                <img src="{{ asset('images/pdf/email.png') }}" alt="CNPJ">
                CNPJ {{ config('square_config.document') }}
            </p>

            <p>
                <img src="{{ asset('images/pdf/map.png') }}" alt="Site">
                {{ config('square_config.address') }}
            </p>
        </div>
    </div>
</header>

<main>
    <div class="box-title">
        <h2>Ótima escolha, agradecemos por sua compra com a Auge App.</h2>
        <h3>Aproveite a grande variedade de produtos e promoções abastecendo sua loja pelo nosso site e App. Sempre á sua disposição, sempre bem-vindo!</h3>
    </div>

    <div class="hero">
        <h3 class="no-margin">{{ $client->company_name }}</h3>
        <p>Cliente {{ $client->id }} - Grupo {{ !empty($client->group) ? " - {$client->group?->name}" : null }}</p>

        <div class="row with-border">
            <div class="col-2-4">
                <p>CNPJ {{ $client->document }}</p>
                <p>IE. {{ $client->state_registration }}</p>

                @if(!empty($client->activity_start))
                    <p>Fundação: {{ $client->activity_start->format('d/m/Y') }}</p>
                @endif
            </div>

            <div class="col-2-4">
                <p>{{ $order->address_street }}, {{ $order->address_number }}</p>
                <p>{{ $order->address_district }}, {{ $order->address_city }}, {{ $order->address_state }}</p>
                <p>CEP {{ $order->address_zipcode }}</p>
            </div>

            <div class="col-2-4">
                <p>Comprador: {{ $order->buyer_name }}</p>
                <p>{{ $order->buyer_cellphone }}</p>
                <p>{{ $order->buyer_email }}</p>
            </div>

            @if(!empty($order->seller))
                <div class="col-2-4">
                    <p>Comercial Auge: {{ $order->seller->name }}</p>
                    <p> {{ $order->seller->cellphone }}</p>
                    <p> {{ $order->seller->email }}</p>
                </div>
            @endif
        </div>

        <div class="row with-border">
            <div class="col-2-4">
                <p>Fornecedor: <b>{{ $order->supplier?->name }}</b></p>
                <p>CNPJ {{ $order->supplier?->document }}</p>
                <p>{{ $order->supplier?->contacts?->first()?->cellphone }}</p>
            </div>

            <div class="col-2-4">
                <p>Origem da Compra: {{ $order->origin }}</p>
                <p>Canal de Vendas: {{ $order->saleChannel->name }}</p>
                <p>Status do pedido: {{ $order->current_status }}</p>
            </div>

            <div class="col-3">
                <p>Estado do pedido: {{ $order->current_status }}</p>
                <p>Prazo de pagamento: {{ $order->installment_rule ?? 'Não informado' }}</p>
                <p>Transportadora: {{ $order->shipping_company_name }}</p>
                <p>CNPJ Transportadora: {{ $order->shippingCompany?->document ?? 'Não informado' }}</p>

                @if(!empty($order->lead_time))
                    <p>Entrega estimada: {{ $order->lead_time }}</p>
                @endif
            </div>

            <div class="col-3">
                <h1>Pedido <span>{{ $order->code }}</span></h1>
                <h1>Data <span>{{ \Carbon\Carbon::parse($order->created_at)->format('H:i d/m/Y') }}</span></h1>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
            </div>
        </div>
    </div>

    @if(count($products))
        <div class="table-container">
            <table>
                <thead>
                <tr>
                    <th>Item</th>

                    @if(!$internalAccess)
                        <th></th>
                    @endif

                    <th class="text-center">Ref.</th>
                    <th class="text-center">EAN</th>
                    <th class="text-center">Quant.</th>
                    <th class="text-center">Preço</th>
                    <th class="text-center">IPI</th>
                    <th class="text-center">Preço c/ IPI</th>
                    <th class="text-center">NCM</th>
                    <th class="text-center">Sub Total</th>
                </tr>
                </thead>
                <tbody>
                    @foreach($products as $product)
                        <tr>
                            @if(!$internalAccess)
                                <td width="50px">
                                    <a href="{{ route('route', $product?->product?->route?->url ?? 'null') }}" target="_blank">
                                        <img src="{{ asset($product->thumb) }}" alt="{{ $product->title }}" width="50">
                                    </a>
                                </td>
                            @endif

                            <td>
                                <a href="{{ route('route', $product?->product?->route?->url ?? 'null') }}" target="_blank">
                                    {{ $product->title }}
                                </a>
                            </td>

                            <td class="text-center">{{ $product->reference }}</td>
                            <td class="text-center">{{ $product?->product->ean13 }}</td>
                            <td class="text-center">{{ $product->qty }}</td>
                            <td class="text-center" width="50px">R$ {{ $product->getUnitPrice() }}</td>
                            <td class="text-center">{{ $product->ipi }}%</td>
                            <td class="text-center" width="60px">R$ {{ formatMoney($product->getUnitPriceWithIpi()) }}</td>
                            <td class="text-center">{{ $product?->product?->ncm }}</td>
                            <td class="text-center" width="60px">R$ {{ formatMoney($product->getSubtotalWithIpi()) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <footer>
        <div class="left-side">
            <p>Quantidades: {{ $order->count_products }} produtos, {{ $order->count_sum_products }} peças no total</p>
            <br>
            <p><b>Observações do pedido:</b> {{ $order->comments }}</p>
        </div>

        <div class="right-side">
            <p>Total do pedido sem IPI: <b>R$ {{ formatMoney($order->getTotalValue()) }} </b></p>
            <p class="total">R$ {{ formatMoney($order->getTotalValueWithIpi()) }}</p>
            <p>Total do pedido com IPI</p>

            @if($order->total_discount > 0)
                <p>Economia Financeira + Promoções: 
                    <span class="custom-economy">
                        R$ {{ formatMoney($order->total_discount) }}
                    </span>
                </p>
            @endif
            @if ($order->installment_discount_value !== '0.00' && $order->installment_discount_value)
                <p>
                    Prazos de pagamento:
                    <span class="custom-economy">
                        R$ {{$order->installment_discount_value}}
                    </span>
                </p>
            @endif
            @if ($order->coupon_discount_value && $order->coupon_discount_value !== "0.00")
                <p>
                    Cupom:
                    <span class="custom-economy">
                        R$ {{$order->coupon_discount_value}}
                    </span>
                </p>
            @endif

        </div>
    </footer>
</main>
</body>
</html>
