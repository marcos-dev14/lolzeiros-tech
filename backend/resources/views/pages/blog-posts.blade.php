@push('styles')
    <link rel="stylesheet" href="{{ mix('css/blog-posts.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/products.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section id="blog-posts">
        <div class="container">
            @include('components._breadcrumb', ['currentLink' => ['label' => 'Blog Auge App']])

            <div class="row">
                <div class="col-xs-12">
                    <header class="with-title">
                        <h2 class="color-initial">Bem-vindo ao nosso blog!</h2>
                        <p>Aqui você encontra conteúdos exclusivos para se manter atualizado sobre negócios e produtos. Divirta-se!</p>
                    </header>
                </div>

                <div class="row">
                    <div class="col-xs-12">
                        @include('components._pagination-container', ['items' => $posts])
                    </div>
                </div>

                <div class="cols-count">
                    @foreach($posts as $post)
                        <div class="cols col-xs-12 col-sm-12 col-md-4">
                            @include('components._post-card')
                        </div>
                    @endforeach
                <div>
            </div>
        </div>
    </section>

    @include('pages.sections._cta')

    <x-fixed.footer></x-fixed.footer>
</x-layouts.base>
