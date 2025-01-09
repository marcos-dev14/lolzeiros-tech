<x-layouts.seller-panel title="Oportunidades"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong> aqui estão todas oportunidades disponiveis pra você arrasar com a AugeApp."
    icon="icons.users">
    
    <div class="container">
        <h1>Oportunidades do Fornecedor</h1>

        @if ($clients->isEmpty())
            <p>Não há clientes para exibir.</p>
        @else
            <table class="table">
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
                    </tr>
                </thead>
                <tbody>
                    @foreach ($clients as $client)
                        <tr>
                            <td>{{ $client->group }}</td>
                            <td>{{ $client->name }}</td>
                            <td>{{ $client->profile }}</td>
                            <td>{{ $client->document }}</td>
                            <td>{{ $client->state }}</td>
                            <td>{{ $client->register }}</td>
                            <td>{{ $client->lastLogin }}</td>
                            <td>{{ $client->status }}</td>
                            <td>{{ $client->cartAbandoned }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            {{-- Exibe os links de paginação das oportunidades --}}
            <div class="d-flex justify-content-center">
                {{ $opportunities->links() }}
            </div>
        @endif
    </div>
</x-layouts.seller-panel>
