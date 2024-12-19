<div class="tab-bar">
    <nav>
        <button onclick="toggleCanvas()" class="menu-button">
            <x-icons.categories></x-icons.categories>
        </button>

        <a class="menu-button" data-toggle="modal" data-target="#modal-search-mobile">
            <x-icons.search></x-icons.search>
        </a>

        <a class="menu-button" href="{{ route('page.industry') }}">
            <x-icons.tag></x-icons.tag>
        </a>

        @if(!auth()->guard('buyer')->user())
            <a class="menu-button no-auth" href="{{ route('buyer.showLoginForm') }}">
                <x-icons.user-check></x-icons.user-check>
            </a>
        @else
            <a class="menu-button" href="{{ route('buyer.clients') }}">
                <x-icons.user-check></x-icons.user-check>
            </a>
        @endif

        <a class="menu-button" href="{{ route('cart.index') }}">
            <x-icons.shopping-cart></x-icons.shopping-cart>
        </a>
    </nav>
</div>
