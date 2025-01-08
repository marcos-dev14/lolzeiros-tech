@push('styles')
    <link rel="stylesheet" href="{{ mix('css/seller-panel.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/buyer.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section id="seller-panel">
        <div class="container">
            @include('components._breadcrumb', ['currentLink' => ['label' => 'Minha Conta']])

            <div class="row">
                <div class="seller-content">
                    <div class="col-md-3 seller-menu">
                        <aside>
                            <div class="hidden-items">
                                <ul class="nav">
                                    <li class="nav-item nav-seller ">
                                       <a href="" title="Nome do comercial" data-toggle="tooltip">
                                            <x-icons.like-new></x-icons.like-new>

                                            <div class="text">
                                                <p>Comercial</p>
                                                <span>Thiago Lopes</span>
                                            </div>
                                       </a>
                                    </li>

                                    <li class="nav-item nav-client @if(url()->current() == route('seller.clients')) active @endif">
                                        <a href="{{ route('seller.clients') }}" title="Meus Clientes" data-toggle="tooltip">
                                            <x-icons.user-plus></x-icons.user-plus>

                                            <p>Meus Clientes</p>
                                            <span>(250)</span>
                                        </a>
                                    </li>

                                     <li class="nav-item nav-client @if(url()->current() == route('seller.orders')) active @endif">
                                        <a href="{{ route('seller.orders') }}" title="Meus Pedidos" data-toggle="tooltip">
                                            <x-icons.bag-seller></x-icons.bag-seller>

                                            <p>Meus Pedidos</p>
                                        </a>
                                    </li>

                                    <li class="nav-item nav-client @if(url()->current() == route('seller.clients')) active @endif">
                                        <a href="{{ route('seller.clients') }}" title="Carrinhos abandonados" data-toggle="tooltip">
                                            <x-icons.shopping-cart></x-icons.shopping-cart>

                                            <p>Carrinhos abandonados</p>
                                        </a>
                                    </li>

                                    <li class="nav-item nav-client @if(url()->current() == route('seller.opportunities.index')) active @endif">
                                        <a href="{{ route('seller.opportunities.index') }}" title="Clientes Disponíveis" data-toggle="tooltip">
                                            <x-icons.users></x-icons.users>

                                            <p>Clientes Disponíveis</p>
                                            <span>(1000)</span>
                                        </a>
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
        </div>
    </section>

    <x-fixed.footer></x-fixed.footer>
</x-layouts.base>
