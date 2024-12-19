<section id="blog">
    <div class="container">
        <header class="with-title">
            <h1>{!! 'Acesse nosso blog' !!}</h1>
            <p>{!! 'Conteúdos exclusivos sobre negócios e produtos para você se manter sempre bem informado.' !!}</p>
        </header>

        <div class="blog-posts">
            @foreach($blogPosts as $post)
                @include('components._post-card')
            @endforeach
        </div>
    </div>
</section>
