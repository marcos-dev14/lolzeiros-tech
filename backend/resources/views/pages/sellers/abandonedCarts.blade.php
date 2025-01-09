<x-layouts.seller-panel
    title="Clientes"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong> aqui estão todas seus clientes com carrinho abandonado junto a AugeApp."
    icon="icons.users"
>
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>CNPJ</th>
                    <th>Grupo</th>
                    <th>Estado</th>
                    <th>Cadastro</th>
                    <th>Ultimo login</th>
                </tr>
            </thead>
            <tbody>
                @if($seller)
                    @foreach ($clients as $client)
                        <tr>
                            <td>{{ $loop->iteration + (($clients->currentPage() - 1) * $clients->perPage()) }}</td>
                            <td>{{ $client->name }}</td>
                            <td>{{ $client->document }}</td>
                            <td>{{ $client->state ?? 'N/A' }}</td>
                            <td>{{ $client->register }}</td>
                            <td>{{ $client->lastLogin }}</td>
                        </tr>
                    @endforeach
                @endif
            </tbody>
        </table>
    </div>
</x-layouts.seller-panel>
