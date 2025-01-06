<x-layouts.seller-panel
    title="Oportunidades"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong> aqui estão todas oportunidades disponiveis pra você arrasar com a AugeApp."
    icon="icons.users"
>
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Client Group</th>
                    <th>#</th>
                    <th>Supplier</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($opportunities as $opportunity)
                    <tr>
                        <td>{{ $opportunity->id }}</td>
                        <td>{{ $opportunity->name }}</td>
                        <td>{{ $opportunity->description }}</td>
                        <td>{{ $opportunity->clientGroup->name ?? 'N/A' }}</td>
                        <td>#</td>
                        <td>{{ $opportunity->supplier->name ?? 'N/A' }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</x-layouts.seller-panel>

