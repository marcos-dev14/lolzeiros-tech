<x-layouts.seller-panel
    title="Clientes"
    subtitle="Olá <strong>{{ $seller->name }}</strong> aqui estão todas suas vendas junta a AugeApp."
    icon="icons.users"
>
    <div class="container">
        <table id="orders-table" class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Codigo</th>
                    <th>Cliente</th>
                    <th>Fornecedor</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @if($seller)
                    @foreach ($orders as $order)
                        <tr>
                            <td>{{ $order->code }}</td>
                            <td>{{ $order->cliente }}</td>
                            <td>{{ $order->fornecedor }}</td>
                            <td>{{ $order->data }}</td>
                            <td>{{ $order->valor }}</td>
                            <td>{{ $order->status }}</td>
                        </tr>
                    @endforeach
                @endif
            </tbody>
        </table>
    </div>
</x-layouts.seller-panel>
