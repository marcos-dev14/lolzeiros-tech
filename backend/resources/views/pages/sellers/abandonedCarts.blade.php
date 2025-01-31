@push('styles')
    <link rel="stylesheet" href="{{ mix('css/clients-seller.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/seller.js') }}"></script>
@endpush

<x-layouts.seller-panel title="Carrinhos Abandonados"
    subtitle="Olá <strong>{{ $seller->name }}</strong>, aqui estão os carrinhos abandonados dos seus clientes."
    comercial="{{$seller->name}}"
    icon="icons.shopping-cart">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <table id="clients-table" class="table">
        <div class="search-container">
            <button class="filter-button" id="open-modal-btn">Filtro</button>
        </div>
        <thead>
            <tr>
                <th>RAZÃO SOCIAL</th>
                <th>CNPJ</th>
                <th>GRUPO</th>
                <th>ESTADO</th>
                <th>CADASTRO</th>
                <th>ÚLTIMO LOGIN</th>
                <th>CARRINHO ABANDONADO</th>
                <th>STATUS</th>
                <th>AÇÃO</th>
            </tr>
        </thead>
        <tbody>

            @if ($clients->count())
                @foreach ($clients as $client)
                    <tr>
                        <td>{{ $client->name }}</td>
                        <td>{{ $client->document }}</td>
                        <td>{{ $client->group }}</td>
                        <td>{{ $client->state ?? 'N/A' }}</td>
                        <td>
                            <div class="formatted-input">
                                <div class="formatted-input-icon">
                                    <x-icons.calendar></x-icons.calendar>
                                </div>

                                <input type="text" id="date" disabled value="{{ $client->register }}">
                            </div>
                        </td>
                        <td>
                            <div class="formatted-input">
                                <div class="formatted-input-icon">
                                    <x-icons.calendar></x-icons.calendar>
                                </div>

                                <input type="text" id="date" disabled value="{{ $client->lastLogin }}">
                            </div>
                        </td>
                        <td>
                            <div class="formatted-input">
                                <div class="formatted-input-icon">
                                    <x-icons.calendar></x-icons.calendar>
                                </div>

                                <input type="text" id="date" disabled value="{{ $client->cartAbandoned }}">
                            </div>
                        </td>
                        <td>{{ $client->status }}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="collapse-button">
                                    <x-icons.collapse></x-icons.collapse>
                                </button>

                                <button class="contacts">
                                    <a
                                        href="{{ route('seller.showSellerLoginForm', ['email' => $seller->email, 'client_id' => $client->client_id]) }}">
                                        <x-icons.contatos>
                                            Contatos
                                        </x-icons.contatos>
                                    </a>
                                </button>

                                <meta name="csrf-token" content="{{ csrf_token() }}">
                                <button class="heart {{ $client->favorite === 1 ? 'favorited' : '' }}"
                                    data-type="Client" data-id="{{ $client->client_id }}"
                                    data-favorite="{{ $client->favorite }}">
                                    <x-icons.heart></x-icons.heart>
                                </button>
                            </div>
                        </td>
                    </tr>
                    {{-- @dd($client->suppliers) --}}
                    <tr class="collapsable-row" style="display: none;">
                        <td colspan="9"
                            style= "width: 100%;background-color: #F4F5F8; padding: 1.25rem 0.625rem 0.625rem 0.75rem; box-sizing: border-box;">
                            <div style="display: flex;flex-direction: column;width: 100%;height: 100%;">
                                <div class="profile-client">
                                    <span>Perfil do cliente:</span> {{ $client->profile }}
                                </div>
                                <div class="suppliers-list">
                                    @foreach ($client->suppliers as $supplier)
                                        <div class="card-supplier">
                                            <div class="card-header">
                                                <h4>
                                                    {{ $supplier->name }}
                                                </h4>

                                                @if (isset($supplier->last_buy))
                                                    <div
                                                        style="border-radius: 0.3rem; border: 1px solid #ECEFF6; padding: 0.5rem; display: flex; gap: 0.5rem;">
                                                        <x-icons.calendar style="color: #3699CF;"></x-icons.calendar>
                                                        <strong>Última compra:</strong>
                                                        {{ $supplier->last_buy }}
                                                    </div>
                                                @else
                                                    <span>Nenhuma compra realizada</span>
                                                @endif
                                            </div>

                                            <div class="label-list-supplier">
                                                @if (isset($supplier->days))
                                                    <label>Dias no carrinho:
                                                        <span>{{ $supplier->days }}</span></label>
                                                @endif

                                                @if (isset($supplier->day))
                                                    <label>Data do carrinho:
                                                        <span>{{ $supplier->day }}</span></label>
                                                @endif

                                                @if (isset($supplier->value))
                                                    <label>Valor do Carrinho:
                                                        <span>R${{ formatMoney($supplier->value) }}</span></label>
                                                @endif
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="9" class="text-center">Nenhum cliente encontrado.</td>
                </tr>
            @endif
        </tbody>
        <div id="modal-overlay" class="modal-overlay" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Filtro de Clientes</h2>
                    <button class="close-button" id="close-modal">×</button>
                </div>
                <div class="modal-body">
                    <form id="filter-form" method="GET" action="{{ route('seller.abandonedCarts') }}">
                        <div class="filter-group">
                            <div class="filter-item">
                                <label>Pesquisa</label>
                                <input type="text" name="search" placeholder="Digite aqui..." class="search-input">
                            </div>
                        </div>
                        <div class="filter-group">
                            <div class="filter-item">
                                <label>Status do Cliente</label>
                                <select name="status">
                                    <option value="">Selecione</option>
                                    <option value="Ativa">Ativo</option>
                                    <option value="Suspenso">Suspenso</option>
                                </select>
                            </div>
                        </div>
                        <div class="filter-group">
                            <div class="filter-item">
                                <label>Último Login</label>
                                <input type="month" name="lastLogin">
                            </div>
                            <div class="filter-item">
                                <label>Data de cadastro</label>
                                <input type="month" name="register">
                            </div>
                        </div>
                        <div class="filter-group">
                            <div class="filter-item">
                                <label>Carrinho abandonado</label>
                                <input type="month" name="cartAbandoned">
                            </div>
                            <div class="filter-item modal-checkbox">
                                <input type="checkbox" name="favorite" id="favorite">
                                <p>Favoritos</p>
                            </div>
                        </div>
                        <div class="filter-group">
                            <button type="submit" class="apply-button">Filtrar Clientes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </table>

    {{ $clients->links('pagination::custom') }}
</x-layouts.seller-panel>
