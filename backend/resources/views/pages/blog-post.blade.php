@push('styles')
    <link rel="stylesheet" href="{{ mix('css/blog-post.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/products.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section id="blog-post">
        <div class="container-fluid"> <!-- Alteração: Usando container-fluid para tornar o conteúdo responsivo -->
            <div class="post-container">
                @include('components._breadcrumb', [
                    'links' => [
                        ['url' => url('blog'), 'label' => 'Blog da Auge']
                    ],
                    'currentLink' => [
                        'label' => \Illuminate\Support\Str::limit($post->title, 20),
                        'title' => $post->title
                    ]
                ])

                @if(count($post->images))
                    <figure>
                        @if($post?->category)
                            <figcaption>{{ $post->category->name }}</figcaption>
                        @endif

                        <picture>
                            <source srcset="{{ $post->getCover()?->webp_image ?? asset("images/default/product/default.jpg") }}" type="image/webp">
                            <source srcset="{{ $post->getCover()?->image ?? asset("images/default/product/default.jpg") }}" type="image/jpeg">
                            <img src="{{ $post->getCover()?->image ?? asset("images/default/product/default.jpg") }}" alt="{{ $post->title }}">
                        </picture>
                    </figure>
                @endif

                <div class="container-body">
                    <p>{{ $post->published_at->format('d/m/Y H:i') }}h</p>

                    <h1>{{ $post->title }}</h1>

                    <div class="post-description">
                        {!! $post->primary_text !!}
                    </div>

                    @includeWhen(
                        $post->post && $post->embed_type == \App\Models\BlogPost::class,
                         'components.embed.post', ['embed' => $post->post]
                    )

                    @includeWhen(
                        $post->product && $post->embed_type == \App\Models\Product::class,
                         'components.embed.product', ['embed' => $post->product]
                    )

                    <div class="post-description">
                        {!! $post->secondary_text !!}
                    </div>
                </div>
            </div>
        </div>
    </section>

    @includeWhen(!empty($suppliers), 'pages.sections._suppliers')

    @include('pages.sections._cta')

    <x-fixed.footer></x-fixed.footer>
</x-layouts.base>
