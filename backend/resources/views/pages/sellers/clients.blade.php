<x-layouts.seller-panel
    title="Clientes"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong>, aqui estão todos os seus clientes junto à AugeApp."
    icon="icons.users"
>
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>CNPJ</th>
                    <th>Estado</th>
                    <th>Cadastro</th>
                    <th>Último Login</th>
                </tr>
            </thead>
            <tbody>
                @if($clients->count())
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
                @else
                    <tr>
                        <td colspan="6" class="text-center">Nenhum cliente encontrado.</td>
                    </tr>
                @endif
            </tbody>
        </table>

        <div class="d-flex justify-content-center">
            {{ $clients->links() }}
        </div>
    </div>
</x-layouts.seller-panel>
