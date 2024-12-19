@push('styles')
    <link rel="stylesheet" href="{{ mix('css/home.css') }}">
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

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
                        <img
                            class="img-responsive"
                            loading="lazy"
                            width="180px"
                            height="120px"
                            src="{{ "$brand->image_path/$brand->image" }}"
                            alt="{{ $brand->name }}"
                        >
                    </a>
                @endforeach
            </div>
        </div>
    </section>

    <x-fixed.footer></x-fixed.footer>
</x-layouts.base>
