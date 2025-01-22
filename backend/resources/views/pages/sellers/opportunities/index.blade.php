<x-layouts.seller-panel title="Oportunidades"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong> aqui estão todas oportunidades disponiveis pra você arrasar com a AugeApp."
    comercial="{{$seller->name}}"
    icon="icons.users">
    <div class="container">
        <table class="table">
            <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>image path</th>
                    <th>image url</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($suppliers as $supplier)
                    <tr>
                        <td>{{ $supplier['id'] }}</td>
                        <td><a
                                href="{{ route('seller.opportunitiesFromSupplier', $supplier['slug']) }}">{{ $supplier['name'] }}</a>
                        </td>
                        <td><img src="{{ $supplier['image_url'] }}" alt="{{ $supplier['name'] }}"></td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</x-layouts.seller-panel>
