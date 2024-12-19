@push('styles')
    <link rel="stylesheet" href="{{ mix('css/buyer-panel.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/buyer.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section id="buyer-panel">
        <div class="container">
            @include('components._breadcrumb', ['currentLink' => ['label' => 'Minha Conta']])

            <div class="row">
                <div class="col-md-3">
                    <aside>
                        <div class="title">
                            <x-icons.like></x-icons.like>

                            <h4>Loja Ativa</h4>

                            <h1>{{ session('buyer.clients.selected')?->company_name ?? \Illuminate\Support\Str::limit(session('buyer.clients.selected')?->name, 25) }}</h1>

                            <div class="expand-icon disabled hidden-md hidden-lg">
                                <span>
                                    <x-icons.down class="flipped"></x-icons.down>
                                </span>
                            </div>
                        </div>

                        <div class="hidden-items">
                            <ul class="nav flex-column">
                                <li class="nav-item separator"></li>

                                <li class="nav-item @if(url()->current() == route('buyer.clients')) active @endif">
                                    <a class="nav-link" href="{{ route('buyer.clients') }}" title="Clique para selecionar outra loja" data-toggle="tooltip" id="change-client">
                                        <x-icons.swipe2></x-icons.swipe2>
                                        Alterar loja
                                    </a>
                                </li>

                                <li class="nav-item separator"></li>

                                <li class="nav-item coupom-link @if(url()->current() == route('buyer.canceledOrders')) active @endif">
                                    <a class="nav-link" href="{{ route('buyer.cupons') }}" title="Importar Pedidos" data-toggle="tooltip">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-percent" viewBox="0 0 16 16">
                                            <path d="M13.442 2.558a.625.625 0 0 1 0 .884l-10 10a.625.625 0 1 1-.884-.884l10-10a.625.625 0 0 1 .884 0M4.5 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m7 6a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m0 1a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                                          </svg>
                                          Meus Cupons
                                    </a>
                                </li>

                                <li class="nav-item fav-link @if(url()->current() == route('buyer.wishlist')) active @endif">
                                    <a class="nav-link" href="{{ route('buyer.wishlist') }}" title="Gerencie seus Favoritos" data-toggle="tooltip">
                                        <x-icons.wishlist></x-icons.wishlist>
                                        Meus Favoritos
                                    </a>
                                </li>

                                <li class="nav-item separator"></li>

                                <li class="nav-item @if(url()->current() == route('buyer.orders')) active @endif">
                                    <a class="nav-link" href="{{ route('buyer.orders') }}" title="Veja os Pedidos em Andamento" data-toggle="tooltip">
                                        <x-icons.bag></x-icons.bag>
                                        Pedidos em andamento
                                    </a>
                                </li>

                                <li class="nav-item @if(url()->current() == route('buyer.closedOrders')) active @endif">
                                    <a class="nav-link" href="{{ route('buyer.closedOrders') }}" title="Veja os Pedidos Faturados" data-toggle="tooltip">
                                        <x-icons.status-check></x-icons.status-check>
                                        Pedidos Faturados
                                    </a>
                                </li>

                                <li class="nav-item @if(url()->current() == route('buyer.canceledOrders')) active @endif">
                                    <a class="nav-link" href="{{ route('buyer.canceledOrders') }}" title="Veja os Pedidos Cancelados" data-toggle="tooltip">
                                        <x-icons.bag-stroke></x-icons.bag-stroke>
                                        Pedidos Cancelados
                                    </a>
                                </li>
                                <li class="nav-item @if(url()->current() == route('buyer.canceledOrders')) active @endif">
                                    <a class="nav-link" href="{{ route('buyer.ordersImport') }}" title="Importar Pedidos" data-toggle="tooltip">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-down-fill" viewBox="0 0 16 16">
                                            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1m-1 4v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 11.293V7.5a.5.5 0 0 1 1 0"/>
                                        </svg>
                                        Importar Pedidos
                                    </a>
                                </li>

                                <li class="nav-item separator"></li>

{{--                            <li @if(url()->current() == route('buyer.support')) class="active" @endif>--}}
{{--                                <a href="{{ route('buyer.support') }}" title="Suporte Auge" data-toggle="tooltip">--}}
{{--                                    <x-icons.chat></x-icons.chat>--}}
{{--                                    Suporte Auge--}}
{{--                                </a>--}}
{{--                            </li>--}}

                                <li @if(url()->current() == route('buyer.commercial')) class="active" @endif>
                                    <a href="{{ route('buyer.commercial') }}" title="Veja os dados de contato do seu Comercial Auge App" data-toggle="tooltip">
                                        <x-icons.commercial></x-icons.commercial>
                                        Meu Comercial Auge App
                                    </a>
                                </li>

                                <li class="separator"></li>

                                <li @if(url()->current() == route('buyer.password')) class="active" @endif>
                                    <a href="{{ route('buyer.password') }}" title="Gerencie os Dados de acesso ao login" data-toggle="tooltip">
                                        <x-icons.lock></x-icons.lock>
                                        Dados de acesso ao login
                                    </a>
                                </li>

                                <li class="separator"></li>

    {{--                            <li @if(url()->current() == route('buyer.company')) class="active" @endif>--}}
    {{--                                <a href="{{ route('buyer.company') }}" title="Informação da Empresa" data-toggle="tooltip">--}}
    {{--                                    <x-icons.company></x-icons.company>--}}
    {{--                                    Informação da Empresa--}}
    {{--                                </a>--}}
    {{--                            </li>--}}

                                <li @if(url()->current() == route('buyer.address.list')) class="active" @endif>
                                    <a href="{{ route('buyer.address.list') }}" title="Gerencie seus Endereços" data-toggle="tooltip">
                                        <x-icons.map-marker></x-icons.map-marker>
                                        Meus Endereços
                                    </a>
                                </li>

                                <li @if(url()->current() == route('buyer.contact.list')) class="active" @endif>
                                    <a href="{{ route('buyer.contact.list') }}" title="Gerencie sua equipe" data-toggle="tooltip">
                                        <x-icons.users></x-icons.users>
                                        Minha Equipe
                                    </a>
                                </li>

                                <li @if(url()->current() == route('buyer.bank_account.list')) class="active" @endif>
                                    <a href="{{ route('buyer.bank_account.list') }}" title="Gerencie seus bancos" data-toggle="tooltip">
                                        <x-icons.graph></x-icons.graph>
                                        Meus bancos
                                    </a>
                                </li>

                                <li @if(url()->current() == route('buyer.social')) class="active" @endif>
                                    <a href="{{ route('buyer.social') }}" title="Configure suas Redes Sociais" data-toggle="tooltip">
                                        <x-icons.facebook></x-icons.facebook>
                                        Minhas Redes Sociais
                                    </a>
                                </li>

                                <li class="separator"></li>

                                <li class="nav-item logout">
                                    <form action="{{ route('buyer.logout') }}" method="POST">
                                        <button type="submit" class="btn btn-link">
                                            <x-icons.logout></x-icons.logout>
                                            Sair da Conta
                                        </button>
                                    </form>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>

                <div class="col-md-9">
                    <div class="panel-box @if(!isset($title)) bg-transparent @endif">
                        @if(isset($title))
                            <div class="panel-header">
                                <h2 id="page-title">
                                    @if(isset($icon))
                                        <x-dynamic-component :component="$icon"></x-dynamic-component>
                                    @endif

                                    {{ $title }}
                                </h2>
                                @if(isset($subtitle))
                                    <p>{!! $subtitle !!}</p>
                                @endif
                            </div>
                        @endif

                        <div class="panel-body">
                            {{ $slot }}
                        </div>
                    </div>
                    @stack('content')
                </div>
            </div>
        </div>
    </section>

    <x-fixed.footer></x-fixed.footer>
</x-layouts.base>
