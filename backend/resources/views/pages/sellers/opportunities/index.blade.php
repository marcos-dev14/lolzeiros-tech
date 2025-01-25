@push('styles')
    <link rel="stylesheet" href="{{ mix('css/opportunities.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

<x-layouts.seller-panel title="Oportunidades"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong> aqui estão todas oportunidades disponiveis pra você arrasar com a AugeApp."
    comercial="{{$seller->name}}"
    icon="icons.users">
    <div class="container">
        <div id="opportunities-list">
            @foreach ($suppliers as $supplier)
                {{-- @if (!empty($supplier->image)) --}}
                    <a
                        href="{{ route('seller.opportunitiesFromSupplier', $supplier['slug']) }}"
                        title="Filtrar por {{ $supplier['name'] }}"
                        {{-- @if(session('filter.supplier') == $supplier->id) class="active" @endif --}}
                    >
                        <figure>
                            <picture class="lazy-picture">

                                <img
                                    src="{{ $supplier['image_url'] }}"
                                    {{-- loading="lazy"
                                    data-src="{{ "$supplier->image_path/$supplier->image" }}" --}}
                                    alt="{{ $supplier['name'] }}"
                                >
                            </picture>
                        </figure>

                        {{-- <p>{{ $supplier->available_products_count }} Produtos</p> --}}
                    </a>
                {{-- @endif --}}
            @endforeach
        </div>
    </div>
</x-layouts.seller-panel>
