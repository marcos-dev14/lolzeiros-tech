@push('styles')
    <link rel="stylesheet" href="{{ mix('css/cart.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/products.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section id="cart">
        <div class="container">
            @include('components._breadcrumb', ['currentLink' => ['label' => 'Carrinho']])

            <div class="cart-container">
                <div class="cart-supplier-list">
                    <div class="cart-supplier-item">
                        <x-loader id="item-{{ $instance->id }}"></x-loader>

                        <div class="hero">
                            <div>
                                <h3>O seu cesto de compras: {{ $instance?->supplier?->name }}</h3>
                            </div>
                        </div>

                        <div class="header">
                            <div class="col">
                                @if(!empty($instance->supplier->image))
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
                                @else
                                    <h3>{{ $instance->supplier->name ?? $instance->supplier->company_name }}</h3>
                                @endif
                            </div>

                            <div class="col">
                                <p>Fornecedor</p>
                                <p>Transportadora</p>
                                <p>Data do Pedido</p>
                                <p>Prazo de Pagamento</p>
                                <p>Envio Estimado</p>
                            </div>

                            <div class="col">
                                <p>{{ $instance->supplier->name ?? $instance->supplier->company_name }}</p>
                                <p data-selector="label-shipping-company"></p>
                                <p>{{ \Carbon\Carbon::now()->format('d/m/Y') }}</p>
                                <p data-selector="label-installment-name">{{ $instance?->installmentRule?->installments }}</p>
                                <p>{{ $instance?->supplier?->leadTime?->name }}</p>
                            </div>

                            <div class="col col-full">
                                <p>
                                    Total do Pedido com IPI<br>
                                    <strong class="size-upper">R$
                                        <span
                                            data-selector="label-header-total-with-ipi"
                                            data-value="{{ $instance->products_sum_subtotal_with_ipi }}"
                                        >
                                            {{ number_format($instance->products_sum_subtotal_with_ipi, 2, ',', '.') }}
                                        </span>
                                    </strong>
                                </p>

                                <p>
                                    Total do Pedido sem IPI:
                                    <strong>R$
                                        <span data-selector="label-header-total">
                                            {{ number_format($instance->products_sum_subtotal, 2, ',', '.') }}
                                        </span>
                                    </strong>
                                </p>

                                <p>
                                    Economia Financeira + Promoções:
                                    <strong>R$
                                        <span data-selector="label-header-total-discount">
                                            {{ number_format($instance->products_sum_discount, 2, ',', '.') }}
                                        </span>
                                    </strong>
                                </p>

                                <p>
                                    Quantidades:
                                    <span data-selector="label-header-qty-items">
                                        {{ $instance->products->count() }}
                                    </span> produtos,
                                    <span data-selector="label-header-qty">{{ $instance->products_sum_qty }}</span>
                                    peças no total
                                </p>

                                <p>
                                    Data Estimada da Primeira Parcela: <strong><span>16/02/2023</span></strong>
                                </p>

                                <p>
                                    Valor das Parcelas:
                                    <strong>
                                        <span data-selector="label-installment-value">
                                            R$ {{ number_format($instance->products_sum_subtotal_with_ipi, 2, ',', '.') }}
                                        </span>
                                    </strong>
                                </p>
                            </div>
                        </div>

                        {!! Form::open(['route' => 'cart.store_order', 'id' => 'form-order', 'method' => 'POST', 'class' => 'mt-20']) !!}
                            {!! Form::hidden('cart', $instance->cart_id) !!}
                            {!! Form::hidden('instance', $instance->uuid) !!}

                            <div class="row">
                                <div class="col-xs-12">
                                    @if(count($shippingCompanies))
                                        <div class="row">
                                            <div class="col-xs-3">
                                                <x-form.select
                                                    name="shipping_company_id"
                                                    id="shipping_company_select"
                                                    :values="$shippingCompanies"
                                                    label="Transportadora"
                                                    required
                                                ></x-form.select>
                                            </div>

                                            <div id="shipping_company_fields" class="hide">
                                                <div class="col-xs-3">
                                                    <x-form.input
                                                        type="text"
                                                        class="w-bg rounded"
                                                        name="shipping_company[name]"
                                                        id="shipping_company_name"
                                                        label="Nome da Transportadora"
                                                    ></x-form.input>
                                                </div>

                                                <div class="col-xs-3">
                                                    <x-form.input
                                                        type="text"
                                                        class="w-bg rounded mask-cnpj"
                                                        name="shipping_company[document]"
                                                        id="shipping_company_document"
                                                        label="CNPJ da Transportadora"
                                                    ></x-form.input>
                                                </div>

                                                <div class="col-xs-3">
                                                    <x-form.input
                                                        type="text"
                                                        class="w-bg rounded mask-phone"
                                                        name="shipping_company[phone]"
                                                        id="shipping_company_phone"
                                                        label="Telefone da Transportadora"
                                                    ></x-form.input>
                                                </div>
                                            </div>
                                        </div>
                                    @endif
                                </div>

                                <div class="col-xs-12">
                                    <x-form.input
                                        type="textarea"
                                        name="comments"
                                        class="w-bg rounded"
                                        label="Observações Adicionais"
                                        placeholder="Escreva aqui qualquer informação adicional"
                                        rows="4"
                                    ></x-form.input>
                                </div>
                            </div>

                            <div class="row">
                                <button disabled readonly aria-disabled="true" id="finish">Finalizar Pedido</button>
                            </div>
                        {!! Form::close() !!}
                    </div>
                </div>
            </div>
        </div>
    </section>

    <x-fixed.footer></x-fixed.footer>

@push('scripts-inline')
    <script>
        const selectShippingCompany = $('#shipping_company_select')
        const buttonFinish = $('#finish')
        const inputShippingCompanyName = $("#shipping_company_name")
        const inputShippingCompanyDocument = $('#shipping_company_document')
        const inputShippingCompanyPhone = $('#shipping_company_phone')

        selectShippingCompany.on('change', function () {
            let self = $(this)
            let shippingCompany = self.val()

            if (shippingCompany === 'new') {
                // if (
                //     inputShippingCompanyName.val() !== ''
                //     || inputShippingCompanyDocument.val() !== ''
                //     || inputShippingCompanyPhone.val() !== ''
                // ) {
                    enableLink(buttonFinish)
                // }
            } else if (!isNaN(parseInt(shippingCompany))) {
                enableLink(buttonFinish)
            } else {
                disableLink(buttonFinish)
            }
        })
    </script>
@endpush
</x-layouts.base>
