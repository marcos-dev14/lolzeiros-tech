<x-layouts.seller-panel
    title="Oportunidades"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong> aqui estão todas oportunidades disponiveis pra você arrasar com a AugeApp."
    icon="icons.users"
>
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>Cliente</th>
                    <th>Cnpj</th>
                    <th>Grupo</th>
                    <th>Estado</th>
                    <th>Cadastro</th>
                    <th>ultimo login</th>
                    <th>Carrinho Abandonado</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($paginatedOpportunities as $opportunity)
                    <tr>
                        <td>{{ $opportunity->cliente }}</td>
                        <td>{{ $opportunity->cnpj }}</td>
                        <td>{{ $opportunity->grupo }}</td>
                        <td>{{ $opportunity->estado }}</td>
                        <td>{{ $opportunity->cadastro }}</td>
                        <td>{{ $opportunity->ultimologin }}</td>
                        <td>{{ $opportunity->carrinhoabandonado }}</td>
                        <td>{{ $opportunity->status }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</x-layouts.seller-panel>

