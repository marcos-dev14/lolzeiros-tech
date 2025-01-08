<x-layouts.seller-panel
    title="Clientes"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong> aqui estão todas suas vendas junta a AugeApp."
    icon="icons.users"
>
    <div class="container">
        <table class="table">
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
                @endif
            </tbody>
        </table>
    </div>
</x-layouts.seller-panel>
