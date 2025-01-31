@push('styles')
    <link rel="stylesheet" href="{{ mix('css/orders-seller.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/seller.js') }}"></script>
@endpush

<x-layouts.seller-panel title="Meus Pedidos"
    subtitle="Olá <strong>{{ $seller->name }}</strong> aqui estão todas suas vendas junta a AugeApp."
    comercial="{{ $seller->name }}" icon="icons.bag-seller">
    <div class="container">
        <div class="search-container">
            <button class="filter-button" id="open-modal-btn">Filtro</button>
        </div>

        <div class="table-wrapper">
            <table id="orders-table" class="table">
                <thead>
                    <tr>
                        <th>Codigo</th>
                        <th>Cliente</th>
                        <th>Fornecedor</th>
                        <th>Data</th>
                        <th>Valor</th>
                        <th>Status</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    @if ($seller)
                        @foreach ($orders as $order)
                            <tr>
                                <td>{{ $order->code }}</td>
                                <td>{{ $order->client }}</td>
                                <td>{{ $order->supplier }}</td>
                                <td>
                                    <div class="formatted-input">
                                        <div class="formatted-input-icon">
                                            <x-icons.calendar></x-icons.calendar>
                                        </div>

                                        <input type="text" id="date" disabled value="{{ $order->date }}">
                                    </div>
                                </td>
                                <td>
                                    <div class="formatted-input">
                                        <div class="formatted-input-icon">
                                            <x-icons.money></x-icons.money>
                                        </div>

                                        <input type="text" id="value" disabled value="{{ $order->value }}">
                                    </div>
                                </td>

                                <td>
                                    <div
                                        class="status {{ $order->status === 'Novo'
                                            ? 'status-novo'
                                            : ($order->status === 'Liberado'
                                                ? 'status-liberado'
                                                : ($order->status === 'Recebido'
                                                    ? 'status-recebido'
                                                    : ($order->status === 'Faturado'
                                                        ? 'status-faturado'
                                                        : ($order->status === 'Transmitido'
                                                            ? 'status-transmitido'
                                                            : ($order->status === 'Cancelado'
                                                                ? 'status-cancelado'
                                                                : ''))))) }}">
                                        @if ($order->status === 'Novo' || $order->status === 'Transmitido')
                                            <x-icons.order-star></x-icons.order-star>
                                        @elseif($order->status === 'Cancelado')
                                            <x-icons.order-cancel></x-icons.order-cancel>
                                        @elseif($order->status === 'Liberado')
                                            <x-icons.order-free></x-icons.order-free>
                                        @elseif($order->status === 'Recebido')
                                            <x-icons.order-free-2></x-icons.order-free-2>
                                        @elseif($order->status === 'Faturado')
                                            <x-icons.order-free-2></x-icons.order-free-2>
                                        @endif

                                        {{ $order->status }}
                                    </div>
                                </td>

                                <td>
                                    <div class="action-buttons">
                                        <a href="{{ route('seller.order', ['orderCode' => $order->code]) }}"
                                            class="eye">
                                            <x-icons.eye></x-icons.eye>
                                        </a>

                                        <a href="{{ route('seller.orderExport', ['orderCode' => $order->code]) }}"
                                            class="eye">
                                            <x-icons.printer></x-icons.printer>
                                        </a>

                                        <meta name="csrf-token" content="{{ csrf_token() }}">
                                        <button class="heart {{ $order->favorite === 1 ? 'favorited' : '' }}"
                                            data-type="Order" data-id="{{ $order->order_id }}"
                                            data-favorite="{{ $order->favorite }}">
                                            <x-icons.heart></x-icons.heart>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    @endif
                </tbody>
            </table>

            @if ($orders->lastPage() > 1)
                <div class="orders-pagination">
                    <ul class="pagination">
                        <li class="{{ $orders->currentPage() == 1 ? 'disabled' : '' }}">
                            <a href="{{ $orders->url(1) }}">
                                Primeira
                            </a>
                        </li>

                        <li class="{{ $orders->currentPage() == 1 ? 'disabled' : '' }}">
                            <a href="{{ $orders->previousPageUrl() }}">
                                ←
                            </a>
                        </li>

                        @for ($i = max(1, $orders->currentPage() - 2); $i <= min($orders->lastPage(), $orders->currentPage() + 2); $i++)
                            <li class="{{ $orders->currentPage() == $i ? 'active' : '' }}">
                                <a href="{{ $orders->url($i) }}">
                                    {{ $i }}
                                </a>
                            </li>
                        @endfor

                        <li class="{{ $orders->currentPage() == $orders->lastPage() ? 'disabled' : '' }}">
                            <a href="{{ $orders->nextPageUrl() }}">
                                →
                            </a>
                        </li>

                        <li class="{{ $orders->currentPage() == $orders->lastPage() ? 'disabled' : '' }}">
                            <a href="{{ $orders->url($orders->lastPage()) }}">
                                Última
                            </a>
                        </li>
                    </ul>
                </div>
            @endif
        </div>
    </div>

    <div id="modal-overlay" class="modal-overlay" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Filtro de Vendas</h2>
                <button class="close-button" id="close-modal">×</button>
            </div>
            <div class="modal-body">
                <form id="filter-form" method="GET" action="{{ route('seller.getFilteredOrders') }}">
                    <div class="filter-group">
                        <div class="filter-item">
                            <label>Pesquisa</label>
                            <input type="text" name="search" placeholder="Digite aqui..." class="search-input">
                        </div>
                    </div>
                    <div class="filter-group">
                        <div class="filter-item">
                            <label>Status do Pedido</label>
                            <select name="status">
                                <option value="">Selecione</option>
                                <option value="new">Novo</option>
                                <option value="transmitted">Transmitido</option>
                                <option value="billed">Faturado</option>
                                <option value="canceled">Cancelado</option>
                                <option value="paused">Pausado</option>
                            </select>
                        </div>
                    </div>
                    <div class="filter-group">
                        <div class="filter-item">
                            <label>Período Inicial</label>
                            <input type="date" name="date_from">
                        </div>
                        <div class="filter-item">
                            <label>Período Final</label>
                            <input type="date" name="date_to">
                        </div>
                    </div>
                    <div class="filter-group">
                        <div class="filter-item">
                            <label>Valor Min</label>
                            <input type="value" name="min_value">
                        </div>
                        <div class="filter-item">
                            <label>Valor Max</label>
                            <input type="value" name="max_value">
                        </div>
                        <div class="filter-item modal-checkbox">
                            <input type="checkbox" name="favorite" id="favorite">
                            <p>Favoritos</p>
                        </div>
                    </div>
                    <div class="filter-group">
                        <button type="submit" class="apply-button">Filtrar Vendas</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-layouts.seller-panel>

@push('scripts')
    <script>
        function formatDate(dateString) {
            const date = new Date(dateString.split('T')[0]);
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
            return `${day}/${month}/${year}`;
        }

        function formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value).replace('R$', '').trim();
        }

        document.addEventListener('DOMContentLoaded', () => {
            const dateInput = document.getElementById('date');
            const valueInput = document.getElementById('value');

            const formattedDate = formatDate('2024-12-22T22:43:00');
            const formattedValue = formatCurrency(99999.99);

            dateInput.value = formattedDate;
            valueInput.value = formattedValue;
        });
    </script>
@endpush
