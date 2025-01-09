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
                    @foreach ($clientData as $client)
                        <tr>
                            <td>{{ $client->cliente }}</td>
                            <td>{{ $client->cnpj }}</td>
                            <td>{{ $client->grupo }}</td>
                            <td>{{ $client->estado }}</td>
                            <td>{{ $client->cadastro }}</td>
                            <td>{{ $client->ultimologin }}</td>
                        </tr>
                    @endforeach
                @endif
            </tbody>
        </table>
    </div>
</x-layouts.seller-panel>
