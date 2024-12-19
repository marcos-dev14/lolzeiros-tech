@php
    $navigation = \App\Services\NavigationService::getAllByLocation(
        \App\Services\NavigationService::LOCATION_HEADER
    )->first();

    $logoName = config('seo_config.logo');
    $logoPath = !empty($logoName) && File::exists(public_path("storage/logo/$logoName"))
        ? asset("storage/logo/$logoName")
        : asset('images/logo.svg');
@endphp

@include('components.fixed._menu-mobile')

<header id="header">
    <div class="container">
        <div class="row-top">
            <a href="{{ route('index') }}" title="Página Inicial" class="logo">
                <img src="{{ $logoPath }}" alt="{{ config('app.name') ?? 'Logo' }}" />
            </a>

            <div class="search-box hidden-xs hidden-sm hidden-md">
                {!! Form::open(['route' => 'products', 'method' => 'GET', 'id' => 'form-search']) !!}
                    {!! Form::select(
                        'rp',
                        session('filters.suppliers.available')?->pluck('name', 'id') ?? ['Todos'],
                        session('filters.suppliers.selected') ?? null,
                        ['id' => 'selectSearch', 'class' => 'select-no-search']
                    ) !!}

                    <div class="search-container">
                        <input
                            type="text"
                            name="pe"
                            id="product-search"
                            value="{{ session('filters.searchTerms') ?? null }}"
                            placeholder="O que você procura?"
                            autocomplete="off"
                            oninput="handleSearch(this.value)"
                            onfocus="showSuggestions()"
                            onblur="hideSuggestions()">

                        <ul id="suggestions-box" class="suggestions hidden"></ul>
                    </div>

                    <button type="button" id="search-button" onclick="handleSearchSubmit()">
                        <x-icons.search></x-icons.search>
                    </button>
                {!! Form::close() !!}
            </div>

            <div class="sign-in hidden-xs hidden-sm hidden-md">
                @if(!auth()->guard('buyer')->user())
                    <a href="{{ route('buyer.showLoginForm') }}" class="login-off" title="Entrar com sua conta">
                        <x-icons.cursor></x-icons.cursor>
                        Entrar
                    </a>
                @else
                    <a href="{{ route('buyer.clients') }}" class="logged-in" title="Acessar painel do cliente">
                        <x-icons.like></x-icons.like>
                        <span>
                            Olá, {{
                                session('buyer.clients.selected') instanceof \App\Models\Client
                                    ? \Illuminate\Support\Str::limit(
                                        session('buyer.clients.selected')?->company_name
                                        ?? session('buyer.clients.selected')?->name,
                                    10)
                                    : strtok(auth()->guard('buyer')->user()?->name, ' ')
                            }}
                        </span>
                    </a>

                    <form action="{{ route('buyer.logout') }}" method="POST">
                        <button type="submit">Sair</button>
                    </form>
                @endif
            </div>

            @if(!$isMobile)
                <div id="cart-box" class="loading" data-route="{{ route('cart.html') }}">
                    <div class="left-side">
                        <span>Carrinho</span>

                        <a href="{{ route('cart.index') }}" class="right-side">
                            <svg xmlns="http://www.w3.org/2000/svg" width="19.006" height="18.21" viewBox="0 0 19.006 18.21">
                                <g transform="translate(-0.75 -0.75)">
                                    <path fill="none" stroke-width="1.7px" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" d="M13.591,30.8a.8.8,0,1,1-.8-.8A.8.8,0,0,1,13.591,30.8Z" transform="translate(-4.93 -13.381)"></path>
                                    <path fill="none" stroke-width="1.7px" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" d="M30.091,30.8a.8.8,0,1,1-.8-.8A.8.8,0,0,1,30.091,30.8Z" transform="translate(-12.677 -13.381)"></path>
                                    <path fill="none" stroke-width="1.7px" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor" d="M1.5,1.5H4.683L6.815,12.155a1.591,1.591,0,0,0,1.591,1.281h7.734a1.591,1.591,0,0,0,1.591-1.281l1.273-6.676H5.479"></path>
                                </g>
                            </svg>
                            <span>R$ 0,00</span>
                        </a>
                    </div>
                </div>
            @endif
        </div>
    </div>

    @if(!empty($navigation))
        <div class="row-middle hidden-xs hidden-sm">
            <div class="row-bottom">
                <div class="container">
                    <ul>
                        @foreach($navigation->links->sortBy('order') as $link)
                            <li>
                                <a
                                    href="{{ $link->isExternal() ? $link->url : url($link?->url) }}"
                                    @if($link->isExternal()) target="_blank" noopener noreferrer @endif
                                    @if(url()->current() == $link->url) class="active" @endif
                                    title="{{ $link->label }}">{{ $link->label }}
                                </a>
                            </li>
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>

        @if($isMobile)
            <div class="row-middle visible-xs visible-sm">
                <div class="row-bottom">
                    <div class="container">
                        <div id="cart-box-mobile" data-route="{{ route('cart.html') }}?mobile=true"></div>
                    </div>
                </div>
            </div>
        @endif
    @endif
</header>
