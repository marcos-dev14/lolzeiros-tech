@push('styles')
    <link rel="stylesheet" href="{{ mix('css/pages-industry.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/suppliers.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section>
        <div class="container">
            @include('components._breadcrumb', ['currentLink' => ['label' => 'Fornecedores']])
        </div>
    </section>

    <section id="suppliers">
        <header class="with-title">
            <h2>Compre diretamente dos fabricantes e importadores</h2>
            <p>Preços baixos, promoções, rápido acesso às novidades e muita conveniência aqui na Auge App.</p>
        </header>

        <div class="container">
            <div class="list">
                @foreach ($suppliers as $supplier)
                    @if (!empty($supplier->image))
                        <a
                            href="{{ $supplier->blogPost->url ?? route('products', "rp=$supplier->id") }}"
                            title="{{ $supplier->name }}"
                            @if(session('filter.supplier') == $supplier->id) class="active" @endif
                        >
                            <figure>
                                <img src="{{ "$supplier->image_path/$supplier->image" }}" alt="{{ $supplier->name ?? $supplier->company_name }}">
                            </figure>

                            <p>{{ $supplier->available_products_count }} Produtos</p>
                        </a>
                    @endif
                @endforeach
            </div>
        </div>
    </section>

    @include('pages.sections._cta')

    <x-fixed.footer></x-fixed.footer>
</x-layouts.base>
