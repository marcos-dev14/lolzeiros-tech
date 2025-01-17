@push('styles')
    <link rel="stylesheet" href="{{ mix('css/order-seller.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

<x-layouts.seller-panel
    title="Meus Pedidos"
    subtitle="Resumo do Pedido | {{ $order->code }} | {{ $order->created_at }}"
    icon="icons.bag-seller"
    backButton="{{ route('seller.orders') }}"
>
    <div class="container">
        <div id="order-content">
            <div class="order-form">
                {!! Form::open(['route' => 'buyer.login', 'method' => 'post', 'data-toggle' => 'validator', 'id' => 'login-client', 'class' => 'active']) !!}
                    <div class="form-wrapper">
                        <div class="order-form-group" style="width: 140px">
                            <label>Faturamento estimado</label>

                            <input type="text" value="{{ $order->lead_time }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 140px">
                            <label>Fornecedor</label>

                            <input type="text" value="{{ $order->supplier?->company_name ?? $order->supplier?->name }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 100px">
                            <label>Origem</label>

                            <input type="text" value="{{ $order->origin }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 170px">
                            <label>Tipo do pedido</label>

                            <input type="text" value="{{ $order->type->name }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 140px">
                            <label>N° Pedido Fornecedor</label>

                            <input type="text" value="{{ $order->external_order_id }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 140px">
                            <label>Data pedido Fornecedor</label>

                            <input type="tex-date" value="{{ $order->external_created_at }}" disabled>
                        </div>
                    </div>

                    <div class="status-form-wrapper">
                        <div class="status-list">
                            <span>Status do pedido</span>

                            @foreach ( $order->orderStatuses as $status)
                                <div class="status-item">
                                    <div class="texts">
                                        <p>24/04/2024 09:00</p>
                                        <p>Thiago Lopes</p>
                                    </div>

                                    <div class="status-icon {{
                                        $status->name === 'Novo' ? 'status-novo' :
                                        ($status->name === 'Liberado' ? 'status-liberado' :
                                        ($status->name === 'Recebido' ? 'status-recebido' :
                                        ($status->name === 'Faturado' ? 'status-faturado' :
                                        ($status->name === 'Transmitido' ? 'status-transmitido' :
                                        ($status->name === 'Cancelado' ? 'status-cancelado' : '')))))
                                    }}">
                                        @if($status->name === 'Novo' || $status->name === 'Transmitido')
                                            <x-icons.order-star></x-icons.order-star>
                                        @elseif($status->name === 'Cancelado')
                                            <x-icons.order-cancel></x-icons.order-cancel>
                                        @elseif($status->name === 'Liberado')
                                            <x-icons.order-free></x-icons.order-free>
                                        @elseif($status->name === 'Recebido')
                                            <x-icons.order-free-2></x-icons.order-free-2>
                                        @elseif($status->name === 'Faturado')
                                            <x-icons.order-free-2></x-icons.order-free-2>
                                        @endif

                                        <p>{{ $status->name }}</p>
                                    </div>
                                </div>
                            @endforeach
                        </div>

                        <div class="status-form">
                            <div class="form-wrapper">
                                <div class="order-form-group" style="width: 170px">
                                    <label>Transportadora</label>

                                    <input id="order-quantity" class="order-quantity" value="{{ $order->shippingCompany?->company_name ?? $order->shippingCompany?->name }}" disabled />
                                </div>

                                <div class="order-form-group" style="width: 180px">
                                    <label>CNPJ Da Transportadora</label>

                                    <input id="order-cnpj-transporter" class="order-cnpj-transporter" value="{{ $order->shippingCompany?->document }}" disabled />
                                </div>

                                <div class="order-form-group" style="width: 264px">
                                    <label>Quantidade</label>

                                    <input id="order-quantity" class="order-quantity" value="{{ $order->count_products }} produtos {{ $order->count_sum_products }} peças no total" disabled />
                                </div>

                                <div class="order-form-group" style="width: 100px">
                                    <label>Caixa fracionada</label>

                                    <input id="order-quantity" value="{{ $order->fractional_box === 1 ? 'Sim' : 'Não' }}" class="order-quantity" disabled />
                                </div>
                            </div>

                            <div class="form-wrapper">
                                <div class="order-form-group" style="width: 180px">
                                    <label>Perfil do Cliente</label>

                                    <input id="order-customer-profile" class="order-customer-profile" value="{{ $order->client->profile->name }}" disabled />
                                </div>

                                <div class="order-form-group" style="width: 180px">
                                    <label>Desconto perfil cliente</label>

                                    <div class="icon-input">
                                        <div class="icon">
                                            <p>%</p>
                                        </div>

                                        <input type="texDigite aqui..." value="{{ $order->profile_discount }}" disabled />
                                    </div>
                                </div>

                                <div class="order-form-group" style="width: 180px">
                                    <label>Desconto de ICMS entre estados</label>

                                    <div class="icon-input">
                                        <div class="icon">
                                            <p>%</p>
                                        </div>

                                        <input type="texDigite aqui..." value="{{ $order->icms }}" disabled />
                                    </div>
                                </div>

                                <div class="order-form-group" style="width: 180px">
                                    <label>Desconto financeiro</label>

                                    <div class="icon-input">
                                        <div class="icon">
                                            <p>%</p>
                                        </div>

                                        <input type="texDigite aqui..." value="{{ $order->installment_rule_value }}" disabled />
                                    </div>
                                </div>
                            </div>

                            <div class="form-wrapper">
                                <div class="order-form-group" style="width: 180px">
                                    <label>Total do pedido sem ipi</label>

                                    <div class="icon-input">
                                        <div class="icon">
                                            <x-icons.money></x-icons.money>
                                        </div>

                                        <input type="texDigite aqui..." value="{{ $order->total_value }}" disabled />
                                    </div>
                                </div>

                                <div class="order-form-group" style="width: 180px">
                                    <label>Total do pedido com ipi</label>

                                    <div class="icon-input">
                                        <div class="icon">
                                            <x-icons.money></x-icons.money>
                                        </div>

                                        <input type="texDigite aqui..." value="{{ $order->total_value_with_ipi }}" disabled />
                                    </div>
                                </div>

                                <div class="order-form-group" style="width: 180px">
                                    <label>Economia total</label>

                                    <div class="icon-input">
                                        <div class="icon">
                                            <x-icons.money></x-icons.money>
                                        </div>

                                        <input type="texDigite aqui..." value="{{ $order->total_discount }}" disabled />
                                    </div>
                                </div>

                                <div class="order-form-group">
                                    <label>Prazo de pagamento</label>

                                    <input type="text" value="{{ $order->installment_rule }}" disabled>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="observations">
                        <div class="form-group">
                            <label>Observações do Cliente</label>

                            <textarea id="observations-client" class="form-control" value="{{ $order->comments }}" rows="3" disabled></textarea>
                        </div>

                        <div class="form-group">
                            <label>Observações Auge</label>

                            <textarea id="observations-auge" class="form-control" value="{{ $order->internal_comments }}" rows="3" disabled></textarea>
                        </div>
                    </div>

                    <div class="title-form-wrapper">
                        <span>Comercial</span>
                    </div>

                    <div class="form-wrapper">
                        <div class="order-form-group">
                            <label>Comercial da auge</label>

                            <input type="text" value="{{ $order->seller->name }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 260px">
                            <label>Email</label>

                            <div class="icon-input">
                                <div class="icon">
                                    <x-icons.order-mail></x-icons.order-mail>
                                </div>

                                <input type="texDigite aqui..." value="{{ $order->seller->email }}" disabled />
                            </div>
                        </div>

                        <div class="order-form-group">
                            <label> </label>

                            <div class="icon-input">
                                <div class="icon">
                                   +55
                                </div>

                                <input type="texDigite aqui..." value="{{ $order->seller->cellphone }}" disabled />
                            </div>
                        </div>

                        <div class="order-form-group">
                            <label>Canal de vendas</label>

                            <input type="text" value="{{ $order->saleChannel->name }}" disabled>
                        </div>
                    </div>

                    <div class="title-form-wrapper">
                        <span>Cliente</span>
                    </div>

                    <div class="form-wrapper" style="margin-top: 20px">
                        <div class="order-form-group">
                            <label>CNPJ</label>

                            <input type="text" value="{{ $order->client->document }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Razão Social</label>

                            <input type="text" value="{{ $order->client->company_name ?? $order->client->name }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>IE</label>

                            <input type="text" value="{{ $order->client->state_registration }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Grupo</label>

                            <input type="text" value="{{ $order->clientGroup?->name }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Código do cliente</label>

                            <input type="text" value="{{ $order->client->code }}" disabled>
                        </div>
                    </div>

                    <div class="form-wrapper" style="margin-top: 20px">
                        <div class="order-form-group">
                            <label>Status do CNPJ</label>

                            <input type="text" value="{{ $order->client->document_status }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Status Comercial</label>

                            <input type="text" value="{{ $order->seller->status }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Tipo de PDV</label>

                            <input type="text" value="{{ $order->client->pdvType->name }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 230px">
                            <label>Ultima compra</label>

                            <div class="icon-input">
                                <div class="icon">
                                    <x-icons.order-calendar></x-icons.order-calendar>
                                </div>

                                <input type="texDigite aqui..." value="{{ \Carbon\Carbon::parse($order->client_last_order)->format('d/m/Y H:i') }}" disabled />
                            </div>
                        </div>
                    </div>

                    <div class="form-wrapper" style="margin-top: 20px">
                        <div class="order-form-group">
                            <label>Comprador</label>

                            <input type="text" value="{{ $order->buyer->name }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 230px">
                            <label>Email</label>

                            <div class="icon-input">
                                <div class="icon">
                                    <x-icons.order-mail></x-icons.order-mail>
                                </div>

                                <input type="texDigite aqui..." value="{{ $order->buyer->email }}" disabled />
                            </div>
                        </div>

                        <div class="order-form-group">
                            <label>Contato</label>

                            <input type="text" value="{{ $order->buyer->cellphone }}" disabled>
                        </div>
                    </div>

                    <div class="title-form-wrapper">
                        <span>Endereço Principal - Faturamento</span>
                    </div>

                    <div class="form-wrapper">
                        <div class="order-form-group" style="width: 332px">
                            <label>Endereço</label>

                            <input type="text" value="{{ $order->address_street }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 100px">
                            <label>Número</label>

                            <input type="text" value="{{ $order->address_number }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 140px">
                            <label>Complemento</label>

                            <input type="text" value="{{ $order->address_complement }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 140px">
                            <label>Bairro</label>

                            <input type="text" value="{{ $order->address_district }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Cidade</label>

                            <input type="text" value="{{ $order->address_city }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 100px">
                            <label>Cep</label>

                            <input type="text" value="{{ $order->address_zipcode }}" disabled>
                        </div>


                        <div class="order-form-group" style="width: 90px">
                            <label>Estado</label>

                            <input type="text" value="{{ $order->address_state }}" disabled>
                        </div>
                    </div>
                {!! Form::close() !!}

                <div class="order-info">
                    <span>Pedido | {{ $order->code }}</span>

                    <div class="order-reviews">
                        <span>Avaliações</span>

                        <div class="stars">
                            <span class="star filled">&#9733;</span>
                            <span class="star filled">&#9733;</span>
                            <span class="star filled">&#9733;</span>
                            <span class="star filled">&#9733;</span>
                            <span class="star">&#9733;</span>
                        </div>
                    </div>
                </div>

                <div class="order-table">
                    <table>
                      <thead>
                        <tr>
                          <th>ITEM</th>
                          <th>REF.</th>
                          <th>QUANT.</th>
                          <th>PREÇO BRUTO</th>
                          <th>PREÇO LÍQUIDO</th>
                          <th>PREÇO C/ IPI</th>
                          <th>SUBTOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        @foreach ($order->products as $product)
                            <tr>
                                <td>
                                    <img
                                        src="{{ $product->thumb }}"
                                        alt="{{ $product->title }}"
                                    >
                                    <span>{{ $product->title }}</span>
                                </td>
                                <td>{{ $product->reference }}</td>
                                <td>{{ $product->qty }}</td>
                                <td>R$ {{ $product->original_price }}</td>
                                <td>R$ {{ $product->unit_price }}</td>
                                <td>R$ {{ $product->unit_price_with_ipi }}</td>
                                <td>R$ {{ $product->subtotal_with_ipi }}</td>
                            </tr>
                        @endforeach
                      </tbody>
                    </table>
                  </div>
            </div>
        </div>
    </div>
</x-layouts.seller-panel>
