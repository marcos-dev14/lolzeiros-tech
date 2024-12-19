<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} | Orçamento</title>

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
        <h2>Orçamento de Pedido</h2>

        <h3 class="width-80">
            Este é um orçamento de pedido feito através da Auge App para sua loja realizada em
            {{ now()->format('d/m/Y H:i') }}h ainda não enviado para {{ $supplier->name }}. Estoques, preços e
            promoções sujeitos a alterações, aproveite  oportunidade e finalize logo o seu pedido
            <a href="{{ route('cart.show_order', $instance->uuid) }}" target="_blank">clicando aqui</a>
        </h3>
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

            @if(!empty($client->main_address))
                <div class="col-2-4">
                    <p>{{ $client->main_address?->street }}, {{ $client->main_address?->number }}</p>
                    <p>{{ $client->main_address?->district }}, {{ $client->main_address?->city?->name }}, {{ $client->main_address?->state?->name }}</p>
                    <p>CEP {{ $client->main_address?->zipcode }}</p>
                </div>
            @endif

            @if(!empty($client->buyer))
                <div class="col-2-4">
                    <p>Comprador: {{ $client->buyer?->name }}</p>
                    <p>{{ $client->buyer?->cellphone }}</p>
                    <p>{{ $client->buyer?->email }}</p>
                </div>
            @endif

            @if(!empty($seller))
                <div class="col-2-4">
                    <p>Comercial Auge: {{ $seller?->name }}</p>
                    <p> {{ $seller?->phone }}</p>
                    <p> {{ $seller?->email }}</p>
                </div>
            @endif
        </div>

        <div class="row">
            <div class="col-2-4">
                <p>Fornecedor: <b>{{ $supplier->name }}</b></p>
                <p>CNPJ {{ $supplier->document }}</p>

                @if(!empty($supplier->contacts))
                    <p>{{ $supplier->contacts?->first()?->cellphone }}</p>
                @endif
            </div>

            <div class="col-2-4">
                <p>Origem da Compra: Orçamento</p>
                <p>Canal de Vendas: Site</p>
                <p>Status do pedido: Orçamento</p>
            </div>

            @if(!empty($supplier->leadTime))
                <div class="col-3">
                    <p>Entrega estimada: {{ $supplier->leadTime?->name }}</p>
                </div>
            @endif
        </div>
    </div>

    @if(count($products))
        <div class="table-container">
            <table>
                <thead>
                <tr>
                    <th>Item</th>
                    <th></th>
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
                        <td width="50px">
                            <a href="{{ route('route', $product?->product?->route?->url ?? 'null') }}" target="_blank">
                                <img src="{{ asset($product->thumb) }}" alt="{{ $product->title }}" width="50">
                            </a>
                        </td>

                        <td>{{ $product->title }}</td>
                        <td class="text-center">{{ $product->reference }}</td>
                        <td class="text-center">{{ $product?->product?->ean13 }}</td>
                        <td class="text-center">{{ $product->qty }}</td>
                        <td class="text-center" width="50px">R$ {{ $product->unit_price }}</td>
                        <td class="text-center">{{ $product->ipi }}%</td>
                        <td class="text-center" width="60px">R$ {{ $product->unit_price_with_ipi }}</td>
                        <td class="text-center">{{ $product?->product?->ncm }}</td>
                        <td class="text-center" width="60px">R$ {{ $product->subtotal_with_ipi }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <footer class="footer-pdf">
        <div class="left-side">
            <p>Quantidade: {{ $instance->products_count }} produtos, {{ $instance->products_sum_qty }} peças no total</p>
        </div>

        <div class="right-side">
            <p>Total do pedido sem IPI: <b>R$ {{ formatMoney($instance->products_sum_subtotal) }}</b></p>
            <p class="total">R$ {{ formatMoney($instance->products_sum_subtotal_with_ipi) }}</p>
            <p>Total do pedido com IPI</p>

            @if($instance->products_sum_discount > 0)
                <p>Economia Financeira + Promoções: <span class="economy">R$ {{ formatMoney($instance->products_sum_discount) }}</span></p>
            @endif
        </div>
    </footer>
</main>
</body>
</html>
