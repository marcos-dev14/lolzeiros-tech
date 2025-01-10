@push('styles')
    <link rel="stylesheet" href="{{ mix('css/orders-seller.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

<x-layouts.seller-panel
    title="Meus Pedidos"
    subtitle="Olá <strong>{{ $seller->name }}</strong> aqui estão todas suas vendas junta a AugeApp."
    icon="icons.bag-seller"
>
    <div class="container">
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
                    @if($seller)
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
                                    <div class="status {{
                                        $order->status === 'Novo' ? 'status-novo' :
                                        ($order->status === 'Liberado' ? 'status-liberado' :
                                        ($order->status === 'Recebido' ? 'status-recebido' :
                                        ($order->status === 'Faturado' ? 'status-faturado' :
                                        ($order->status === 'Transmitido' ? 'status-transmitido' :
                                        ($order->status === 'Cancelado' ? 'status-cancelado' : '')))))
                                    }}">
                                        @if($order->status === 'Novo' || $order->status === 'Transmitido')
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
                                        <a href="{{ route('seller.order', ['orderCode' => $order->code]) }}" class="eye">
                                            <x-icons.eye></x-icons.eye>
                                        </a>

                                        <button class="printer">
                                            <x-icons.printer></x-icons.printer>
                                        </button>

                                        <button class="heart" data-id="{{ $order->order_id }}" onclick="addToFavorites(this)">
                                            <x-icons.order-heart></x-icons.order-heart>
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
