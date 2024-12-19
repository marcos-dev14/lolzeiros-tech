<section id="brands">
    <div class="container">
        <header>
            <h4>Tenha em sua loja as principais marcas e os personagens mais queridos pelos seus clientes.</h4>
        </header>

        <div class="slider">
            @foreach($brands as $brand)
                <a
                    href="{{ route('products') }}?ma=[{{ $brand->id }}]"
                    title="Confira os produtos da marca {{ $brand->name }}"
                >
                    <figure>
                        <picture class="lazy-picture">
                            <source data-srcset="{{ changeToWebp("$brand->image_path/$brand->image") }}" type="image/webp">
                            <source data-srcset="{{ "$brand->image_path/$brand->image" }}" type="image/jpeg">

                            <img
                                loading="lazy"
                                data-src="{{ "$brand->image_path/$brand->image" ?? asset("images/default/product/default.jpg") }}"
                                src="{{ asset('images/default/product/default.jpg') }}" alt="{{ $brand->name }}"
                            />
                        </picture>
                    </figure>
                </a>
            @endforeach
        </div>

        <footer>
            <a href="{{ route('page.brands') }}" title="Confira todas as marcas que trabalhamos">
                <x-icons.plus></x-icons.plus>
                Ver <span>mais</span> marcas
            </a>
        </footer>
    </div>
</section>
