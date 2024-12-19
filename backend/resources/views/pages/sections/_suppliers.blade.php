<section id="suppliers">
    <div class="container">
        <header class="with-title">
            <h1>{!! $title ?? 'Compre direto dos fabricantes e importadores' !!}</h1>
            <p>{!! $subtitle ?? 'Preços baixos, promoções, rápido acesso às novidades e muita conveniência aqui na Auge App.' !!}</p>
        </header>

        <div class="list">
            @foreach ($suppliers as $supplier)
                @if (!empty($supplier->image))
                    <a
                        href="{{ route('products', "rp=$supplier->id") }}"
                        title="Filtrar por {{ $supplier->name }}"
                        @if(session('filter.supplier') == $supplier->id) class="active" @endif
                    >
                        <figure>
                            <picture class="lazy-picture">
                                <source data-srcset="{{ "$supplier->image_path/$supplier->webp_image" }}" type="image/webp">
                                <source data-srcset="{{ "$supplier->image_path/$supplier->image" }}" type="image/jpeg">

                                <img
                                    loading="lazy"
                                    data-src="{{ "$supplier->image_path/$supplier->image" }}"
                                    alt="{{ $supplier->name ?? $supplier->company_name }}"
                                >
                            </picture>
                        </figure>

                        <p>{{ $supplier->available_products_count }} Produtos</p>
                    </a>
                @endif
            @endforeach
        </div>
    </div>
</section>
