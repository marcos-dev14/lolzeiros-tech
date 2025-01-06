<x-layouts.seller-panel
    title="Clientes"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong> aqui estão todas seus clientes junta a AugeApp."
    icon="icons.users"
>
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                @if($seller)
                    @foreach ($seller->clients as $client)
                        <tr>
                            <td>{{ $client->name }}</td>
                        </tr>
                    @endforeach
                @endif
            </tbody>
        </table>
    </div>
</x-layouts.seller-panel>
