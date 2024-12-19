<div class="post-embed">
    <a href="{{ route('route', $embed->route?->url ?? 'blog') }}" title="{{ $embed->title }}">
        <figure>
            <picture>
                <source srcset="{{ $embed->getCover()?->webp_image ?? asset("images/default/product/default.jpg") }}" type="image/webp">
                <source srcset="{{ $embed->getCover()?->image ?? asset("images/default/product/default.jpg") }}" type="image/jpeg">
                <img src="{{ $embed->getCover()?->image ?? asset("images/default/product/default.jpg") }}" alt="{{ $embed->title }}">
            </picture>
        </figure>

        <h4>{{ $embed->title }}</h4>
    </a>
</div>
