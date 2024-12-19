<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} | Pedido</title>

    <style>
        .row {
            display: inline-block;
            width: 100%;
        }

        .row.with-border {
            border-bottom: 1px solid #ccc;
            margin-bottom: 10px;
        }

        .col {
            display: inline-block;
        }

        .col-1 {
            width: 8.33333333%;
            float: left;
            padding-left: 10px;
            padding-right: 10px;
        }

        .col-2 {
            width: 16.66666667%;
            float: left;
            padding-left: 10px;
            padding-right: 10px;
        }

        .col-2-4 {
            width: 20%;
            float: left;
            padding-left: 10px;
            padding-right: 10px;
        }

        .col-3 {
            width: 25%;
            float: left;
            padding-left: 10px;
            padding-right: 10px;
        }

        .col-4 {
            width: 33.333333%;
            float: left;
            padding-left: 10px;
            padding-right: 10px;
        }

        .highlight {
            color: #0e656d;
        }

        .margin-t05 {
            margin-top: 0.5rem;
        }

        .margin-b05 {
            margin-bottom: 0.5rem;
        }

        .margin-t1 {
            margin-top: 1rem;
        }

        .margin-b1 {
            margin-bottom: 1rem;
        }

        .no-margin {
            margin: 0 !important;
        }

        .pull-right {
            text-align: right;
            width: 100%;
        }

        .font-supper {
            font-size: 1.5rem;
        }

        .text-upper {
            text-transform: uppercase;
        }

        .no-background {
            background: none !important;
        }

        .text-red {
            color: #fc7267;
        }

        .text-blue {
            color: #1279b1;
        }

        .text-center {
            text-align: center;
        }

        .text-top {
            text-align: start;
            vertical-align: top;
        }

        .table-container table tbody tr td.text-top {
            vertical-align: top;
        }

        small {
            font-size: 70%;
        }

        .text-left {
            text-align: left !important;
        }

        * {
            box-sizing: border-box;
        }

        body {
            font-size: 10px;
        }

        @page {
            margin-top: 100px;

        }

        header {
            width: 100%;
            display: block;
            position: fixed;
            top: -30px;
            left: 0;
            right: 0;
            font-size: 8px;
        }

        header .logo {
            display: inline-block;
            width: 100px;
            transform: translateY(-16px);
        }

        header .logo img {
            width: inherit;
            display: inline-block;
        }

        header .phones {
            display: inline-block;
            width: calc(100% - 220px);
        }

        header .phones img {
            height: 0.6rem;
            position: relative;
            top: 0.1rem;
            padding-right: 0.3rem;
            border-right: 0.01rem solid;
            margin-right: 0.1rem;
        }

        header .phones p {
            margin: 0 0 10px;
        }

        header .phones .col {
            width: auto;
            margin-left: 20px;
        }

        main .row::after {
            content: "";
            display: table;
            clear: both;
        }

        main {
            margin-top: 20px;
        }

        main p {
            font-size: 9px;
            margin-top: 0;
        }


        main .hero>p {
            margin-bottom: 5px;
            line-height: 15px;
        }

        main .hero h1 {
            margin: 0;
            line-height: 1.1rem;
            font-size: 13px;
            font-weight: normal;
            text-align: right;
        }

        main .hero h1 span {
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            color: #005CAC;
        }

        main .hero h3 {
            margin-bottom: 10px;
        }

        main .hero .row {
            margin-left: -10px;
            margin-right: -10px;
        }

        main .hero .row .col {
            width: calc(70% - 1rem);
            vertical-align: top;
        }

        main .hero .row .col:first-child {
            margin-right: 0.5rem;
            width: 30%;
        }

        .table-container {
            font-size: 9px;
            width: 100%;
            display: inline-block;
            margin-top: 10px;
        }

        .table-container table {
            border-collapse: collapse;
            width: 100%;
            margin: 0;
            padding: 0;
        }

        .table-container table th,
        .table-container table td {
            border-collapse: collapse;
            padding: 0.25rem 0.5rem;
        }

        .tr-billets {
            color: #005CAC;
        }

        .table-container table th a,
        .table-container table td a {
            color: black;
            text-decoration: none;
        }

        .table-container table thead {
            border-bottom: 1px solid #ccc;
        }

        .table-container table thead th {
            text-transform: uppercase;
            text-align: left;
        }

        .table-container table thead th:first-child {
            padding-left: 0;
        }

        .table-container table thead th.text-center {
            text-align: center;
        }

        .table-container table tbody tr {
            border-bottom: 1px solid #ccc;
        }

        .table-container table tbody tr td:first-child {
            padding: 0;
            padding-top: 20px;
            max-height: 30px;
            vertical-align: bottom;
            /* position: relative; */
        }

        .table-container table tbody tr td:first-child a img {
            border: 1px solid #ccc;
            /* position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0; */
            margin: auto;
        }

        main footer {
            margin-top: 20px;
            display: inline-block;
            width: 100%;
        }

        main footer .right-side {
            text-align: right;
            margin-left: auto;
        }

        main footer p {
            margin: 0 0 3px;
            font-size: 12px;
        }

        main footer p:first-child {
            margin-bottom: 0;
        }

        main footer .total {
            font-size: 21px;
            font-weight: 600;
        }

        main footer .total,
        main footer .total+p {
            color: #005CAC;
        }

        main footer .economy {
            color: #005CAC;
        }


        .col-4.col-qrcode {
            display: table;
            text-align: justify;
        }

        .col-4.col-qrcode img {
            width: 30%;
            display: inline-block;
            margin-left: 5%;
        }

        .box-title {
            margin: auto;
            align-self: center;
            text-align: center;
            border-bottom: 0.5px solid #A9A9A9;
            padding: 10px;
        }

        .box-title h2 {
            color: #1279b1;
        }


        .col-4.col-qrcode div {
            display: inline-block;
            vertical-align: top;
        }

        #footer {
            position: fixed;
            width: 100%;
            bottom: -20px;
            left: 0;
            right: 0;
        }

        #footer p {
            margin-left: auto;
            line-height: 1.1rem;
            font-size: 13px;
            font-weight: normal;
            text-align: right;
        }

        #footer p span {
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            color: #005CAC;
        }

        #footer p:after {
            content: 'Página ' counter(page);
        }
    </style>
</head>
<body>
    <footer id="footer">
        <p>Pedido <span>{{ $order->code }} </span></p>
    </footer>

    <header>
        <div class="logo">
            <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/pdf/logo.png'))) }}" alt="Logo">
        </div>

        <div class="phones">
            <div class="col">
                <p>
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/pdf/phone.png'))) }}" alt="Phone">
                    {{ config('square_config.phone_two') }}
                </p>

                <p>
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/pdf/mobile.png'))) }}" alt="Mobile">
                    {{ config('square_config.whatsapp') }}
                </p>
            </div>

            <div class="col">
                <p>
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/pdf/email.png'))) }}" alt="Email">
                    {{ config('square_config.mail_receive') }}
                </p>

                <p>
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/pdf/site.png'))) }}" alt="Site">
                    www.augeapp.com.br
                </p>
            </div>

            <div class="col">
                <p>
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/pdf/apple.png'))) }}" alt="App apple">
                    Auge App para iPhone
                </p>

                <p>
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/pdf/android.png'))) }}"
                        alt="App android">
                    Auge App para Android
                </p>
            </div>

            <div class="col">
                <p>
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/pdf/auge.png'))) }}"
                        alt="CNPJ">
                    CNPJ {{ config('square_config.document') }}
                </p>

                <p>
                    <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/pdf/map.png'))) }}"
                        alt="Endereço">
                    {{ config('square_config.address') }}
                </p>
            </div>
        </div>
    </header>

    <main>
        <div class="box-title">
            <h2>Ótima escolha, agradecemos por sua compra com a Auge App.</h2>
            <h3>Aproveite a grande variedade de produtos e promoções abastecendo sua loja pelo nosso site e App. Sempre
                á sua disposição, sempre bem-vindo!</h3>
        </div>


        <div class="hero">
            <h3>{{ $order->client->company_name }}</h3>
            <p>Cliente {{ $order->client->id }} &nbsp;&nbsp; Grupo {{ !empty($order->client->group) ? "
                {$order->client->group?->name}" : null }}</p>

            <div class="row with-border">
                <div class="col-2">
                    <p>CNPJ {{ $order->client->document }}</p>
                    <p>IE. {{ $order->client->state_registration }}</p>

                    @if(!empty($order->client->activity_start))
                    <p>Fundação: {{ $order->client->activity_start->format('d/m/Y') }}</p>
                    @endif
                </div>

                <div class="col-2">
                    <p>{{ $order->address_street }}, {{ $order->address_number }}</p>
                    <p>{{ $order->address_district }}, {{ $order->address_city }}, {{ $order->address_state }}</p>
                    <p>CEP {{ $order->address_zipcode }}</p>
                </div>

                <div class="col-3">
                    <p>Comprador: {{ $order->buyer_name ?? 'Não informado'}}</p>
                    <p>{{ $order->buyer_cellphone }}</p>
                    <p>{{ $order->buyer_email }}</p>
                </div>

                <div class="col-4 col-qrcode">
                    @if(!empty($order->seller))

                    <div>
                        <p>Comercial Auge: {{ $order->seller->name }}</p>
                        <p> {{ $order->seller->cellphone }}</p>
                        <p> {{ $order->seller->email }}</p>
                    </div>

                    @endif
                    {{-- <img src="data:image/png;base64,{{ base64_encode(file_get_contents(public_path('images/pdf/qrcode.png'))) }}"
                        alt="QR Code"> --}}
                </div>
            </div>

            <div class="row">
                <div class="col-2">
                    <p>Fornecedor: <b>{{ $order->supplier?->name }}</b></p>
                    <p>CNPJ {{ $order->supplier?->document }}</p>
                    <p>{{ $order->supplier?->contacts?->first()?->cellphone }}</p>
                </div>

                <div class="col-2">
                    <p>Origem da Compra: {{ $order->origin }}</p>
                    <p>Canal de Vendas: {{ $order->saleChannel->name }}</p>
                    <p><b>Observações do pedido:</b> {{ $order->comments }}</p>
                </div>

                <div class="col-3">
                    <p>Status do pedido: {{ $order->current_status }}</p>
                    <p>Prazo de pagamento: {{ $order->installment_rule ?? 'Não informado' }}</p>
                    <p>Transportadora: {{ $order->shipping_company_name ?? 'Não informado' }}</p>
                    <p>CNPJ Transportadora: {{ $order->shippingCompany?->document ?? 'Não informado' }}</p>


                    @if(!empty($order->lead_time))
                    <p>Entrega estimada: {{ $order->lead_time ?? 'Não informado' }}</p>
                    @endif
                </div>

                <div class="col-3">
                    <h1>Pedido &nbsp; <span>{{ $order->code }}</span></h1>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                </div>
            </div>
        </div>

        @if(count($invoice))
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>NF-e</th>
                            <th class="text-center">Data</th>
                            <th class="text-center">Parcelas</th>
                            <th class="text-center">Valor</th>
                            <th class="text-center">Porcentagem Auge</th>
                            <th class="text-center">Porcentagem Comercial</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($invoice as $invoiceItem)
                            <tr>
                                <td class="text-top">{{ $invoiceItem->number }}</td>
                                <td class="text-center">{{ $invoiceItem->issuance_date }}</td>
                                <td class="text-center">{{ $invoiceItem->term_qty }}</td>
                                <td class="text-center" width="60px">R$ {{
                                    number_format($invoiceItem->value, 2, ',', '.') }}</td>
                                <td class="text-center">{{ $invoiceItem->percentage_commission }}%</td>
                                <td class="text-center">{{ $invoiceItem->commercial_percentage }}%</td>
                            </tr>
                            @foreach($invoiceItem->invoiceBillets as $billet)
                                <tr class="tr-billets">
                                    <td class="text-top" colspan="2">
                                        <p class="text-top">{{ $invoiceItem->number }}-{{{ $loop->index + 1 }}}</b></p>
                                    </td>
                                    <td colspan="1">
                                        <p>Vencimento: </p>
                                        <p> <b>{{ \Carbon\Carbon::parse($billet->due_date)->format('d/m/Y') ?? '' }}</b></p>
                                    </td>
                                    <td colspan="1">
                                        <p>Valor: </p>
                                        <p><b>R$ {{ number_format($billet->value, 2, ',', '.') }}</b></p>

                                    </td>

                                    @if($billet->paid_at !== null)
                                        <td colspan="1">
                                            <p>Data quitação: </p>
                                            <p> <b>{{ \Carbon\Carbon::parse($billet->paid_at)->format('d/m/Y') ?? '' }}</b></p>
                                        </td>
                                    @endif

                                    <td colspan="2">
                                        <p>Observações: </p>
                                        <p><b>{{ $billet->observation}}</b></p>
                                    </td>
                                </tr>
                            @endforeach
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif

        <footer>
            <div class="right-side">
                <p>Total do pedido com IPI</p>
                <p class="total">R$ {{ number_format($order->total_value_with_ipi, 2, ',', '.') }}</p>
                <p>Total do pedido sem IPI: R$ {{ number_format($order->total_value, 2, ',', '.') }}</p>

                @if($order->total_discount > 0)
                    <p>Economia Financeira + Promoções: <span class="economy">R$ {{
                        number_format($order->total_discount, 2, ',', '.') }}</span></p>
                @endif

                <p>Quantidades: {{ $order->count_products }} produtos, {{ $order->count_sum_products }} peças no total
                </p>
            </div>
        </footer>
    </main>
</body>
</html>
