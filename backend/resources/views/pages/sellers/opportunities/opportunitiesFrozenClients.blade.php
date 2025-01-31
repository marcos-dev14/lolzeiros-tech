@push('styles')
    <link rel="stylesheet" href="{{ mix('css/opportunities-details.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/seller.js') }}"></script>
@endpush

<x-layouts.seller-panel title="Oportunidades"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong> aqui estão todas oportunidades disponiveis pra você arrasar com a AugeApp."
    icon="icons.users"
    comercial="{{$seller->name}}"
>
    <x-menu />
    <h1>Oportunidades Congeladas</h1>


    @if ($clients->isEmpty())
        <p>Não há clientes para exibir.</p>
    @else
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <table id="clients-table" class="table">
            <div class="search-container">
                <button class="filter-button" id="open-modal-btn">Filtro</button>
            </div>

            <thead>
                <tr>
                    <th>Grupo</th>
                    <th>Nome</th>
                    <th>Perfil</th>
                    <th>Documento</th>
                    <th>Estado</th>
                    <th>Registro</th>
                    <th>Último Login</th>
                    <th>Status</th>
                    <th>Carrinho Abandonado</th>
                    <th>AÇÃO</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($clients as $client)
                    <tr>
                        <td>{{ $client->group }}</td>
                        <td>{{ $client->name }}</td>
                        <td>{{ $client->profile }}</td>
                        <td>{{ $client->document }}</td>
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
                        <td>{{ $client->status }}</td>
                        <td>
                            <div class="formatted-input">
                                <div class="formatted-input-icon">
                                    <x-icons.calendar></x-icons.calendar>
                                </div>

                                <input type="text" id="date" disabled value="{{ $client->lastLogin }}">
                            </div>
                        </td>
                        <td>
                            <div class="action-buttons">
                                {{-- <button class="collapse-button">
                                    <x-icons.collapse></x-icons.collapse>
                                </button> --}}

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
                @endforeach
            </tbody>
        </table>

        @if ($opportunities->lastPage() > 1)
            <div class="opportunities-pagination">
                <ul class="pagination">
                    <li class="{{ $opportunities->currentPage() == 1 ? 'disabled' : '' }}">
                        <a href="{{ $opportunities->url(1) }}">
                            Primeira
                        </a>
                    </li>

                    <li class="{{ $opportunities->currentPage() == 1 ? 'disabled' : '' }}">
                        <a href="{{ $opportunities->previousPageUrl() }}">
                            ←
                        </a>
                    </li>

                    @for ($i = max(1, $opportunities->currentPage() - 2); $i <= min($opportunities->lastPage(), $opportunities->currentPage() + 2); $i++)
                        <li class="{{ $opportunities->currentPage() == $i ? 'active' : '' }}">
                            <a href="{{ $opportunities->url($i) }}">
                                {{ $i }}
                            </a>
                        </li>
                    @endfor

                    <li class="{{ $opportunities->currentPage() == $opportunities->lastPage() ? 'disabled' : '' }}">
                        <a href="{{ $opportunities->nextPageUrl() }}">
                            →
                        </a>
                    </li>

                    <li class="{{ $opportunities->currentPage() == $opportunities->lastPage() ? 'disabled' : '' }}">
                        <a href="{{ $opportunities->url($opportunities->lastPage()) }}">
                            Última
                        </a>
                    </li>
                </ul>
            </div>
        @endif
    @endif

    <div id="modal-overlay" class="modal-overlay" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Filtro de Clientes</h2>
                <button class="close-button" id="close-modal">×</button>
            </div>
            <div class="modal-body">
                <form id="filter-form" method="GET" action="{{ route('seller.frozenClients') }}">
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
</x-layouts.seller-panel>
