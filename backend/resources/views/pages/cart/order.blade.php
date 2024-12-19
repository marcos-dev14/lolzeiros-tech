@push('styles')
    <link rel="stylesheet" href="{{ mix('css/cart.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/cart.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section id="cart">
        <div class="container">
            @include('components._breadcrumb', ['currentLink' => ['label' => 'Carrinho de Compras']])

            <div class="cart-container">
                <div class="cart-supplier-list">
                    <div class="cart-supplier-item flex gap-20"
                        data-route-update="{{ route('cart.update_data', $instance->uuid) }}">
                        <x-loader id="item-{{ $instance->id }}"></x-loader>

                        {!! Form::open([
                            'route' => 'cart.store_order',
                            'id' => 'form-order',
                            'method' => 'POST',
                            'class' => 'flex gap-20',
                        ]) !!}
                        {!! Form::hidden('cart', $instance->cart_id) !!}
                        {!! Form::hidden('instance', $instance->uuid) !!}
                        {!! Form::hidden('installment_rule_id', null) !!}

                        <div class="header">
                            <div class="header-top">
                                <div class="col-logo">
                                    @if (!empty($instance->supplier->image))
                                        <a href="{{ route('products', "rp={$instance->supplier->id}") }}"
                                            title="Filtrar por {{ $instance->supplier->name }}"
                                            @if (session('filter.supplier') == $instance->supplier->id) class="active" @endif>
                                            <figure>
                                                <picture>
                                                    <source
                                                        srcset="{{ str_replace('jpg', 'webp', "{$instance->supplier->image_path}/{$instance->supplier->image}") }}"
                                                        type="image/webp">

                                                    <source
                                                        srcset="{{ "{$instance->supplier->image_path}/{$instance->supplier->image}" }}"
                                                        type="image/jpeg">

                                                    <img src="{{ "{$instance->supplier->image_path}/{$instance->supplier->image}" }}"
                                                        alt="{{ $instance->supplier->name ?? $instance->supplier->company_name }}">
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
                                        R$ <span data-selector="label-header-total-with-ipi"
                                            data-disc-value=''
                                            data-value="{{ $instance->products_sum_subtotal_with_ipi }}">
                                            {{ number_format($instance->products_sum_subtotal_with_ipi, 2, ',', '.') }}
                                        </span>
                                    </h3>

                                    <p>
                                        Pedido mínimo de
                                        R$ {{ number_format($instance->supplier->min_order, 2, ',', '.') }}</p>
                                </div>
                            </div>

                            <div class="col-info flex">
                                <div class="line-general flex">
                                    <div class="column-left flex gap-20">
                                        <div class="left-side">
                                            <p>Fornecedor</p>
                                            <p>Quantidades</p>
                                            <p>Transportadora</p>
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

                                            <p data-selector="label-shipping-company">Não informado</p>
                                        </div>
                                    </div>

                                    <div class="column-center flex gap-20">
                                        <div class="left-side">
                                            <p>Data do pedido</p>

                                            <p>
                                                Faturamento <span class="hidden-xs">estimado</span>

                                                <span class="hidden-sm hidden-md hidden-lg" data-toggle="tooltip"
                                                    title="Faturamento estimado {{ $instance?->supplier?->leadTime?->name ?? '-' }}">
                                                    <x-icons.exclamation-circle></x-icons.exclamation-circle>
                                                </span>
                                            </p>

                                            <p>
                                                Prazo <span class="hidden-xs">de pagamento</span>

                                                <span class="hidden-sm hidden-md hidden-lg" data-toggle="tooltip"
                                                    title="Prazo de pagamento">
                                                    <x-icons.exclamation-circle></x-icons.exclamation-circle>
                                                </span>
                                            </p>
                                        </div>

                                        <div class="right-side">
                                            <p>{{ \Carbon\Carbon::now()->format('d/m/Y') }}</p>
                                            <p><b>{{ $instance?->supplier?->leadTime?->name ?? 'Não Informado' }}</b>
                                            </p>
                                            <p data-selector="label-installments">Não informado</p>
                                        </div>
                                    </div>

                                    <div class="column-right flex">
                                        <div class="line-top flex gap-20">
                                            <div class="left-side">
                                                <p>Total sem IPI</p>
                                                <p>IPI</p>
                                            </div>

                                            <div class="right-side">
                                                <p id="total" data-selector="label-header-total"
                                                    data-disc-value=''
                                                    data-value="{{ $instance->products_sum_subtotal }}">
                                                    R$
                                                    {{ number_format($instance->products_sum_subtotal, 2, ',', '.') }}
                                                </p>
                                                @php
                                                    $ipiValue = $instance->products_sum_subtotal_with_ipi;
                                                    $subtotal = $instance->products_sum_subtotal;

                                                    $percentageDifference = (($ipiValue - $subtotal) / $subtotal) * 100;
                                                @endphp
                                                <p style="display: none" data-selector="label-header-ipi"
                                                    data-value="{{ $percentageDifference }}">
                                                    {{ number_format($percentageDifference, 2) }} %
                                                </p>

                                                <p id="ipi" data-selector="label-header-ipi-value"
                                                    data-value="{{ $instance->products_sum_ipi_value }}">
                                                    R$
                                                    {{ number_format($instance->products_sum_ipi_value, 2, ',', '.') }}
                                                </p>
                                            </div>
                                        </div>

                                        <div class="line-bottom">
                                            <h3>
                                                R$ <span id="total-with-ipi" data-selector="label-header-total-with-ipi"
                                                    data-disc-value=''
                                                    data-value="{{ $instance->products_sum_subtotal_with_ipi }}">
                                                    {{ number_format($instance->products_sum_subtotal_with_ipi, 2, ',', '.') }}
                                                </span>
                                            </h3>

                                            <p>Total com IPI</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="line-extra flex">
                                    <h5 class="flex">
                                        @if ($instance->supplier->shippingType?->id === 2)
                                            <x-icons.truck></x-icons.truck>
                                            Frete Grátis
                                        @else
                                            &nbsp;
                                        @endif
                                    </h5>

                                    <div id="savings" class="purchase-savings hide">
                                        <h4>Você economizou:</h4>

                                        <span
                                            data-selector="label-header-total-economy-coupon"
                                            data-value=""
                                            id="total-disc-coupon"
                                            class="hide"
                                        >
                                        <x-icons.cupon-item></x-icons.cupon-item>

                                        </span>

                                        <span
                                            data-selector="label-header-total-economy"
                                            id="on-promotion"
                                            data-value="{{ $instance->products_sum_discount }}"
                                            class="hide"
                                        >
                                        <x-icons.prom-item></x-icons.porom-item>

                                            @if($instance->products_sum_discount !== null && $instance->products_sum_discount !== "0.00")
                                                R$
                                                {{ number_format($instance->products_sum_discount, 2, ',', '.') }}
                                                em promoções
                                            @endif
                                        </span>

                                        <span
                                            data-selector="label-payment-condition"
                                            data-value=""
                                            id="payment-condition"
                                            class="hide"
                                        >
                                        <x-icons.cond-item></x-icons.cond-item>

                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="main-container flex">
                            <div class="left-side">
                                @if (count($shippingCompanies))
                                    <div class="line">
                                        <div>
                                            <x-form.select name="shipping_company_id"
                                                data-selector="shipping_company_select" :values="$shippingCompanies"
                                                label="Transportadora" required></x-form.select>
                                        </div>

                                        <div data-selector="shipping_company_fields" class="hide">
                                            <x-form.input type="text" class="w-bg rounded"
                                                name="shipping_company[name]" data-selector="shipping_company_name"
                                                label="Nome da Transportadora"></x-form.input>
                                        </div>

                                        <div data-selector="shipping_company_fields" class="hide">
                                            <x-form.input type="text" class="w-bg rounded mask-cnpj"
                                                name="shipping_company[document]"
                                                data-selector="shipping_company_document"
                                                label="CNPJ da Transportadora"></x-form.input>
                                        </div>

                                        <div data-selector="shipping_company_fields" class="hide">
                                            <x-form.input type="text" class="w-bg rounded mask-cellphone"
                                                name="shipping_company[phone]" data-selector="shipping_company_phone"
                                                label="Telefone da Transportadora"></x-form.input>
                                        </div>
                                    </div>
                                @endif

                                <div class="line">
                                    <x-form.input type="textarea" name="comments" class="w-bg rounded"
                                        label="Observações Adicionais"
                                        placeholder="Escreva aqui qualquer informação adicional"
                                        rows="4"></x-form.input>
                                </div>

                                <div class="coupon-input">
                                    <img src='{{ asset('images/cupom/cupom-icon.svg') }}' alt="" />

                                    <label for="coupon">ATIVAR CUPOM</label>
                                    <input type="text" class="form-control" id="coupon" name="coupon"
                                        placeholder="Digite aqui o seu cupom">
                                    <button type="button" class="btn btn-danger" style="display: none;" id="refresh-button">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <button type="button" id="btn-usar-cupom" class="btn btn-primary">
                                        <img src='{{ asset('images/cupom/arrow-right.svg') }}' alt="" />
                                    </button>
                                    <p id="coupon-success-message" style="display: none;">Cupom aplicado, economia garantida!</p>
                                    <input type="hidden" id="couponHidden" name="couponHidden">
                                </div>
                            </div>

                            <div class="right-side">
                                @if (!empty($instance->installmentRules))
                                    <div class="installment-rules-container">
                                        <div class="custom-select">
                                            <label>
                                                Condições de pagamento

                                                @if (!empty($instance->supplier->min_ticket))
                                                    <small>Parcelamentos liberados considerando boletos mínimos de
                                                        <strong>R$
                                                            {{ number_format($instance->supplier->min_ticket, 2, ',', '.') }}</strong></small>
                                                @endif
                                            </label>

                                            <div class="select-header">
                                                <span class="selected-option">Selecione uma opção</span>
                                                <span class="arrow"></span>
                                            </div>

                                            <table class="options">
                                                @foreach ($instance->installmentRules as $installmentRule)
                                                    <tr class="option @if (
                                                        $instance->products_sum_subtotal_with_ipi / $installmentRule['count_installments'] <
                                                            $instance->supplier->min_ticket) locked @endif"
                                                        data-days="{{ $installmentRule['installments'] }}"
                                                        data-variator="@if ($installmentRule['additional'] > 0.0) additional @elseif($installmentRule['discount'] > 0.0)discount @else none @endif"
                                                        data-value="{{ $installmentRule['additional'] > 0.0 ? $installmentRule['additional'] : $installmentRule['discount'] }}"
                                                        data-id="{{ $installmentRule['id'] }}"
                                                        data-text="
                                                                {{ $installmentRule['count_installments'] > 1 ? " {$installmentRule['count_installments']} parcelas" : "{$installmentRule['count_installments']} parcela" }}
                                                                {{ " - {$installmentRule['installments']}" }}
                                                                {{ $installmentRule['additional'] > 0.0 ? " - Acréscimo de {$installmentRule['additional']}%" : null }}
                                                                {{ $installmentRule['additional'] > 0.0 ? " - Acréscimo de {$installmentRule['additional']}%" : null }}
                                                                {{ $installmentRule['discount'] > 0.0 ? " - Desconto de {$installmentRule['discount']}%" : null }}
                                                                {{ $installmentRule['discount'] > 0.0 ? " - Desconto de {$installmentRule['discount']}%" : null }}
                                                        ">
                                                        <td>
                                                            <span class="hidden-xs hiddem-sm">
                                                                {{ $installmentRule['count_installments'] > 1
                                                                    ? "{$installmentRule['count_installments']} parcelas"
                                                                    : "{$installmentRule['count_installments']} parcela" }}
                                                            </span>

                                                            <span class="hidden-md hidden-lg">
                                                                {{ "{$installmentRule['count_installments']}x" }}
                                                            </span>

                                                        </td>

                                                        <td>{{ $installmentRule['installments'] }}</td>

                                                        <td>
                                                            @if ($installmentRule['additional'] <= 0.0 && $installmentRule['discount'] <= 0.0)
                                                                &nbsp;
                                                            @elseif($installmentRule['additional'] > 0.0)
                                                                <span class="hidden-xs hidden-sm">
                                                                    {{ "Acréscimo de {$installmentRule['additional']}%" }}
                                                                </span>

                                                                <span class="hidden-md hidden-lg">
                                                                    {{ "+{$installmentRule['additional']}%" }}
                                                                </span>
                                                            @else
                                                                <span class="hidden-xs hidden-sm">
                                                                    {{ "Desconto de {$installmentRule['discount']}%" }}
                                                                </span>

                                                                <span class="hidden-md hidden-lg">
                                                                    {{ "-{$installmentRule['discount']}%" }}
                                                                </span>
                                                            @endif
                                                        </td>

                                                        <td>
                                                            {{ $instance->products_sum_subtotal_with_ipi / $installmentRule['count_installments'] <
                                                            $instance->supplier->min_ticket
                                                                ? "Adicione mais R$ " .
                                                                    number_format(
                                                                        ($instance->supplier->min_ticket -
                                                                            $instance->products_sum_subtotal_with_ipi / $installmentRule['count_installments']) *
                                                                            $installmentRule['count_installments'],
                                                                        2,
                                                                        ',',
                                                                        '.',
                                                                    )
                                                                : null }}
                                                        </td>

                                                        <td>
                                                            @if (
                                                                $instance->products_sum_subtotal_with_ipi / $installmentRule['count_installments'] <
                                                                    $instance->supplier->min_ticket)
                                                                <x-icons.cart-lock></x-icons.cart-lock>
                                                            @else
                                                                <x-icons.cart-unlock></x-icons.cart-unlock>
                                                            @endif
                                                        </td>
                                                    </tr>
                                                @endforeach
                                            </table>
                                        </div>
                                    </div>
                                @endif

                                <div class="billing-data">
                                    <h5>Dados de Faturamento</h5>

                                    <div class="columns">
                                        <div>
                                            <p>Razão Social</p>
                                            <p>CNPJ</p>
                                            <p>E-mail</p>
                                            <p>Telefone</p>
                                        </div>

                                        <div>
                                            <p>
                                                <b>{{ \Illuminate\Support\Str::limit($clientBillingData->name, 22) }}</b>
                                                <span data-toggle="tooltip"
                                                    title="Razão Social {{ $clientBillingData->name }}">
                                                    <x-icons.exclamation-circle></x-icons.exclamation-circle>
                                                </span>
                                            </p>

                                            <p>{{ $clientBillingData->document }}</p>
                                            <p class="email">
                                                {{ \Illuminate\Support\Str::limit($clientBillingData->email, 22) }}</p>
                                            <p>{{ $clientBillingData->phone }}</p>
                                        </div>

                                        <div>
                                            <p><strong>O pedido será enviado para:</strong></p>
                                            <p>{{ $clientBillingData->address?->street }},
                                                {{ $clientBillingData->address?->number }}</p>
                                            <p>{{ $clientBillingData->address?->district }},
                                                {{ $clientBillingData->address?->city?->name }},
                                                {{ $clientBillingData->address?->state?->name }}</p>
                                            <p>CEP {{ $clientBillingData->address?->zipcode }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="footer flex">
                            <a href="{{ route('cart.index') }}">Voltar</a>

                            <a href="{{ route('cart.cancel_order', $instance->uuid) }}">Cancelar Pedido</a>

                            <a href="{{ route('cart.download_pdf', $instance->uuid) }}" target="_blank">Download
                                Pedido
                            </a>

                            <button type="button" class="btn-open" data-text-opened="Recolher Produtos"
                                data-text-closed="Ver Produtos" data-container=".cart-supplier-item">
                                Ver Produtos
                            </button>

                            <button type="submit" {{--                                    disabled --}} {{--                                    readonly --}} {{--                                    aria-disabled="true" --}}
                                data-selector="button-finish" class="button-glow">
                                Finalizar Pedido
                            </button>
                        </div>
                        {!! Form::close() !!}

                        <x-products-list-nc :products="$instance->products" :instance="$instance->uuid" isCart></x-products-list-nc>
                    </div>
                </div>
            </div>
        </div>
    </section>

    @include('components.modal-coupon');

    <x-fixed.footer></x-fixed.footer>

    @push('scripts-inline')
        <script>
            function openModalCoupon(data) {
                let imageUrl;
                if (data.success) {
                    imageUrl = "{{ asset('images/cupom/active-coupon.svg') }}";
                } else {
                    imageUrl = "{{ asset('images/cupom/coupon-not-active.svg') }}";
                }

                let modalBodyContent = `
                    <img src="${imageUrl}" alt="Resultado da operação">
                    <div class="modal-text">
                        <span>${data.success
                            ? 'Parabéns, Desconto aplicado.'
                            : 'Este cupom não é válido.'}
                        </span>
                        <p>${data.message}</p>
                    </div>
                    <button type="button" class="btn button-close" data-dismiss="modal">OK</button>
                `;

                let modalBody = document.querySelector('#successModal .modal-center');
                modalBody.innerHTML = modalBodyContent;

                $('#successModal').modal('show');
            }

            document.addEventListener("DOMContentLoaded", function() {
                const couponSuccessMessage = document.getElementById('coupon-success-message');
            const btnUsarCupom = document.getElementById('btn-usar-cupom');
            const couponInput = document.getElementById('coupon');
            const couponHiddenInput = document.getElementById('couponHidden');
            const form = document.getElementById('shippingCompanyForm');

            $(document).ready(function() {
                $('#refresh-button').on('click', function() {
                    location.reload();
                });
            });

            btnUsarCupom.addEventListener('click', function() {
                const cupomValue = couponInput.value.trim();
                const shippingCompanyIdElement = document.getElementById('shipping_company_id');
                const shippingCompanyId = shippingCompanyIdElement ? shippingCompanyIdElement.value : null;

                if (!cupomValue) {
                    alert('Por favor, insira um cupom válido.');
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
                        instance: '{{ $instance->uuid }}',
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

                    openModalCoupon(data);
                    if (data.success) {
                        $('#couponSuccessMessage').css('display', 'block');
                        $('#refresh-button').css('display', 'block');

                    }

                    if (data.products_with_discount) {
                        // Itera sobre cada produto com desconto
                        data.products_with_discount.forEach(product => {
                            // Verifica se a referência existe
                            if (product.reference) {
                                const reference = product.reference;

                                // Seleciona os elementos no DOM usando a referência do produto
                                const unitPriceElement = document.getElementById(`label-unit-price-${reference}`);
                                const unitPriceWithIpiElement = document.getElementById(`label-unit-price-with-ipi-${reference}`);
                                const totalPriceWithIpiElement = document.getElementById(`label-total-price-with-ipi-${reference}`);

                                // Obtém os preços atuais
                                let unitPrice = parseFloat(unitPriceElement.innerText.trim().replace('R$', '').replace('.', '').replace(',', '.'));
                                let unitPriceWithIpi = parseFloat(unitPriceWithIpiElement.innerText.trim().replace('R$', '').replace('.', '').replace(',', '.'));
                                let totalPriceWithIpi = parseFloat(totalPriceWithIpiElement.innerText.trim().replace('R$', '').replace('.', '').replace(',', '.'));


                                // Calcula os preços com desconto
                                const discountFull = data.discountFull / 100;
                                const discountedUnitPrice = unitPrice - (unitPrice * discountFull);
                                const discountedUnitPriceWithIpi = unitPriceWithIpi - (unitPriceWithIpi * discountFull);
                                const discountedTotalPriceWithIpi = totalPriceWithIpi - (totalPriceWithIpi * discountFull);

                                console.log(`unitPrice ${discountFull}`);
                                console.log(`unitPriceWIPI ${discountedUnitPriceWithIpi}`);

                                // Atualiza os preços no DOM
                                unitPriceElement.innerText = `R$ ${discountedUnitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                unitPriceWithIpiElement.innerText = `R$ ${discountedUnitPriceWithIpi.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                totalPriceWithIpiElement.querySelector('strong').innerText = `R$ ${discountedTotalPriceWithIpi.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                                // Atualiza os atributos data-coupon
                                unitPriceElement.dataset.couponUnitPrice = discountedUnitPrice;
                                unitPriceElement.dataset.percentage = discountFull;
                                unitPriceWithIpiElement.dataset.couponUnitPrice = discountedUnitPriceWithIpi;
                                unitPriceWithIpiElement.dataset.percentage = discountFull;
                                totalPriceWithIpiElement.dataset.couponUnitPrice = discountedTotalPriceWithIpi;

                                console.log(unitPriceElement.dataset);

                            }
                        });
                    }

                    // Desabilita o input de cupom e o botão após aplicar o cupom
                    couponInput.disabled = true;
                    btnUsarCupom.disabled = true;
                    couponHiddenInput.value = cupomValue;

                    // Atualiza outros elementos conforme necessário
                    const totalWithDiscount = data.total_with_discount;
                    const discountPercentage = data.discount_Percentage;
                    const totalWithIpiElement = $("[data-selector='label-header-total-with-ipi']");
                    const totalWithIpiValue = parseFloat(totalWithIpiElement.data("discValue"));
                    const totalWithIpiValue1 = parseFloat(totalWithIpiElement.data("value"));

                    const totalWithIpiDiscount = totalWithIpiValue - (totalWithIpiValue * discountPercentage);
                    const totalWithIpiDiscount1 = totalWithIpiValue1 - (totalWithIpiValue1 * discountPercentage);

                    const totalElement = $("[data-selector='label-header-total']");
                    const totalValue = parseFloat(totalElement.data("discValue"));
                    const totalValue2 = parseFloat(totalElement.data("value"));

                    const discountValue = data.discount;
                    const totalDiscount = totalValue - (totalValue * discountPercentage);
                    const totalDiscount1 = totalValue2 - (totalValue2 * discountPercentage);

                    totalDiscount ?
                    totalElement.text(`R$ ${totalDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                        :
                    totalElement.text(`R$ ${totalDiscount1.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

                    totalElement.data("value", totalDiscount1 );

                    totalWithIpiDiscount ?
                    totalWithIpiElement.text(`R$ ${totalWithIpiDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) :
                    totalWithIpiElement.text(`R$ ${totalWithIpiDiscount1.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

                    totalWithIpiElement.data('value', totalWithIpiDiscount1);

                    const ipiElement = document.querySelector("[data-selector='label-header-ipi-value']");
                    const ipiValue = parseFloat(ipiElement.dataset.value);
                    const ipiDiscount = ipiValue - (ipiValue * discountPercentage);

                    document.getElementById('ipi').innerText = `R$ ${ipiDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

                    document.getElementById('ipi').dataset.value = ipiDiscount;

                    const totalDiscElement = document.getElementById('total-disc-coupon');

                    const formatValue = discountValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

                    totalDiscElement.innerText = `R$${formatValue} em cupons`;

                    // Adicionar valor ao data-value
                    $('#total-disc-coupon').attr('data-value', formatValue);
                    $('#total-disc-coupon').removeClass('hide');

                    checkPromotions()
                })
                .catch(error => {
                    error.json().then(errorMessage => {
                        openModalCoupon(errorMessage);
                    });
                });
            });
         });
        </script>
    @endpush
</x-layouts.base>
