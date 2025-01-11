@push('styles')
    <link rel="stylesheet" href="{{ mix('css/order-seller.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

<x-layouts.seller-panel
    title="Meus Pedidos"
    subtitle="Resumo do Pedido | {{ $order->code }} | {{ $order->created_at }}"
    icon="icons.bag-seller"
>
    <div class="container">
        <div id="order-content">
            <div class="order-form">
                {!! Form::open(['route' => 'buyer.login', 'method' => 'post', 'data-toggle' => 'validator', 'id' => 'login-client', 'class' => 'active']) !!}
                    <div class="form-wrapper">
                        <div class="order-form-group" style="width: 230px">
                            <label>Status do pedido</label>

                            <input type="text" value="{{ $order->current_status }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 140px">
                            <label>Faturamento estimado</label>

                            <input type="text" disabled>
                        </div>

                        <div class="order-form-group" style="width: 140px">
                            <label>Fornecedor</label>

                            <input type="text" value="{{ $order->product_supplier_name }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 100px">
                            <label>Origem</label>

                            <input type="text" value="{{ $order->origin }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 170px">
                            <label>Tipo do pedido</label>

                            <input type="text" value="{{ $order->order_type }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 140px">
                            <label>N° Pedido Fornecedor</label>

                            <input type="text" disabled>
                        </div>

                        <div class="order-form-group" style="width: 140px">
                            <label>Data pedido Fornecedor</label>

                            <input type="tex-date" value="{{ $order->formated_date }}" disabled>
                        </div>
                    </div>

                    <div class="status-form-wrapper">
                        <div class="status-list">
                            <div class="status-item">
                                <div class="texts">
                                    <p>24/04/2024 09:00</p>
                                    <p>Thiago Lopes</p>
                                </div>

                                <div class="status-icon">
                                    <x-icons.order-cancel></x-icons.order-cancel>
                                    <p>Cancelado</p>
                                </div>
                            </div>
                        </div>

                        <div class="status-form">
                            <div class="form-wrapper">
                                <div class="order-form-group" style="width: 170px">
                                    <label>Transportadora</label>

                                    <input id="order-quantity" class="order-quantity" disabled />
                                </div>

                                <div class="order-form-group" style="width: 180px">
                                    <label>CNPJ Da Transportadora</label>

                                    <input id="order-cnpj-transporter" class="order-cnpj-transporter" disabled />
                                </div>

                                <div class="order-form-group" style="width: 264px">
                                    <label>Quantidade</label>

                                    <input id="order-quantity" class="order-quantity" disabled />
                                </div>

                                <div class="order-form-group" style="width: 100px">
                                    <label>Caixa fracionada</label>

                                    <input id="order-quantity" value="{{ $order->fractional_box === 1 ? 'Sim' : 'Não' }}" class="order-quantity" disabled />
                                </div>
                            </div>

                            <div class="form-wrapper">
                                <div class="order-form-group" style="width: 180px">
                                    <label>Perfil do Cliente</label>

                                    <input id="order-customer-profile" class="order-customer-profile" disabled />
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

                                        <input type="texDigite aqui..." value="{{ $order->discount_value }}" disabled />
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

                                        <input type="texDigite aqui..." value="{{ $order->installment_discount_value }}" disabled />
                                    </div>
                                </div>

                                <div class="order-form-group" style="width: 180px">
                                    <label>Total do pedido com ipi</label>

                                    <div class="icon-input">
                                        <div class="icon">
                                            <x-icons.money></x-icons.money>
                                        </div>

                                        <input type="texDigite aqui..." value="{{ $order->installment_discount_value_ipi }}" disabled />
                                    </div>
                                </div>

                                <div class="order-form-group" style="width: 180px">
                                    <label>Economia total</label>

                                    <div class="icon-input">
                                        <div class="icon">
                                            <x-icons.money></x-icons.money>
                                        </div>

                                        <input type="texDigite aqui..." disabled />
                                    </div>
                                </div>

                                <div class="order-form-group">
                                    <label>Prazo de pagamento</label>

                                    <input type="text" disabled>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="observations">
                        <div class="form-group">
                            <label>Observações do Client</label>

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

                            <input type="text" value="{{ $order->buyer_name }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 260px">
                            <label>Email</label>

                            <div class="icon-input">
                                <div class="icon">
                                    <x-icons.order-mail></x-icons.order-mail>
                                </div>

                                <input type="texDigite aqui..." value="{{ $order->buyer_email }}" disabled />
                            </div>
                        </div>

                        <div class="order-form-group">
                            <label> </label>

                            <div class="icon-input">
                                <div class="icon">
                                   +55
                                </div>

                                <input type="texDigite aqui..." value="{{ $order->buyer_cellphone }}" disabled />
                            </div>
                        </div>

                        <div class="order-form-group">
                            <label>Canal de vendas</label>

                            <input type="text" value="{{ $order->sale_channel_id }}" disabled>
                        </div>
                    </div>

                    <div class="title-form-wrapper">
                        <span>CLiente</span>
                    </div>

                    <div class="form-wrapper" style="margin-top: 20px">
                        <div class="order-form-group">
                            <label>CNPJ</label>

                            <input type="text" value="{{ $order->client_document }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Razão Social</label>

                            <input type="text" value="{{ $order->client_name }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>IE</label>

                            <input type="text" value="{{ $order->old_id }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Grupo</label>

                            <input type="text" value="{{ $order->client_group }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Código do cliente</label>

                            <input type="text" value="{{ $order->client_code }}" disabled>
                        </div>
                    </div>

                    <div class="form-wrapper" style="margin-top: 20px">
                        <div class="order-form-group">
                            <label>Status do CNPJ</label>

                            <input type="text" value="{{ $order->client_status }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Status Comercial</label>

                            <input type="text" value="{{ $order->client_commercial_status }}" disabled>
                        </div>

                        <div class="order-form-group">
                            <label>Tipo de PDV</label>

                            <input type="text" value="{{ $order->client_pdv_name }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 230px">
                            <label>Ultima compra</label>

                            <div class="icon-input">
                                <div class="icon">
                                    <x-icons.order-calendar></x-icons.order-calendar>
                                </div>

                                <input type="texDigite aqui..." value="{{ $order->client_last_order }}" disabled />
                            </div>
                        </div>
                    </div>

                    <div class="form-wrapper" style="margin-top: 20px">
                        <div class="order-form-group">
                            <label>Comprador</label>

                            <input type="text" value="{{ $order->buyer_name }}" disabled>
                        </div>

                        <div class="order-form-group" style="width: 230px">
                            <label>Email</label>

                            <div class="icon-input">
                                <div class="icon">
                                    <x-icons.order-mail></x-icons.order-mail>
                                </div>

                                <input type="texDigite aqui..." value="{{ $order->buyer_email }}" disabled />
                            </div>
                        </div>

                        <div class="order-form-group">
                            <label>Contato</label>

                            <input type="text" value="{{ $order->buyer_cellphone }}" disabled>
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
                    <span>Pedido | Código do pedido</span>

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
                        <tr>
                          <td>
                            <img src="https://via.placeholder.com/50" alt="Produto 1">
                            <span>Jogo Educativo O Alfabeto</span>
                          </td>
                          <td>1034</td>
                          <td>6</td>
                          <td>R$ 14,75</td>
                          <td>R$ 14,75</td>
                          <td>R$ 15,71</td>
                          <td>R$ 94,27</td>
                        </tr>
                        <tr>
                          <td>
                            <img src="https://via.placeholder.com/50" alt="Produto 2">
                            <span>Quebra Cabeça Redondo Planeta Terra 500 Peças</span>
                          </td>
                          <td>10764</td>
                          <td>2</td>
                          <td>R$ 27,52</td>
                          <td>R$ 27,52</td>
                          <td>R$ 29,31</td>
                          <td>R$ 58,61</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
            </div>
        </div>
    </div>
</x-layouts.seller-panel>
