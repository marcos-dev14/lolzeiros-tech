<div class="post-card">
    <a href="{{ route('route', $post->route?->url ?? 'blog') }}" title="{{ $post->title }}">
        <figure>
            @if($post->category)
                <figcaption>{{ $post->category->name }}</figcaption>
            @endif

            <picture class="lazy-picture">
                <source data-srcset="{{ $post->getCover()?->webp_image ?? asset("images/default/product/default.jpg") }}" type="image/webp">
                <source data-srcset="{{ $post->getCover()?->image ?? asset("images/default/product/default.jpg") }}" type="image/jpeg">
                <img loading="lazy" data-src="{{ $post->getCover()?->image ?? asset("images/default/product/default.jpg") }}" src="{{ asset('images/default/product/default.jpg') }}" alt="{{ $post->title }}" />
            </picture>
        </figure>
    </a>

    <div class="card-bottom">
        <p>{{ $post->published_at->format('d/m/Y H:i') }}h</p>

        <h4>
            <a href="{{ route('route', $post->route?->url ?? 'blog') }}" title="{{ $post->title }}">
                {{ $post->title }}
            </a>
        </h4>
    </div>
</div>
