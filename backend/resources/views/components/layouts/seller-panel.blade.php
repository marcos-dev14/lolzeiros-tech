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
                                                <span>{{ $comercial }}</span>
                                            </div>
                                        </a>
                                    </li>

                                    <li class="nav-item nav-client @if (url()->current() == route('seller.clients')) active @endif">
                                        <a href="{{ route('seller.clients') }}" title="Meus Clientes"
                                            data-toggle="tooltip">
                                            <x-icons.user-plus></x-icons.user-plus>

                                            <p>Meus Clientes</p>
                                            @php
                                                $seller = auth()->guard('seller')->user();

                                                $countClient =
                                                    $seller
                                                        ?->ClientHasSeller()
                                                        ->with('clientGroup.clients')
                                                        ->get()
                                                        ->pluck('clientGroup.clients')
                                                        ->flatten()
                                                        ->count() ?? 0;
                                            @endphp
                                            <span>({{ $countClient ?? 0 }})</span>
                                        </a>
                                    </li>

                                    <li class="nav-item nav-client @if (url()->current() == route('seller.orders')) active @endif">
                                        <a href="{{ route('seller.orders') }}" title="Meus Pedidos"
                                            data-toggle="tooltip">
                                            <x-icons.bag-seller></x-icons.bag-seller>

                                            <p>Meus Pedidos</p>
                                        </a>
                                    </li>

                                    <li class="nav-item nav-client @if (url()->current() == route('seller.abandonedCarts')) active @endif">
                                        <a href="{{ route('seller.abandonedCarts') }}" title="Carrinhos abandonados"
                                            data-toggle="tooltip">
                                            <x-icons.shopping-cart></x-icons.shopping-cart>

                                            <p>Carrinhos abandonados</p>
                                        </a>
                                    </li>

                                    <li class="nav-item nav-client @if (url()->current() == route('seller.opportunities.index')) active @endif">
                                        <a href="{{ route('seller.opportunities.index') }}" title="Clientes Disponíveis"
                                            data-toggle="tooltip">
                                            <x-icons.users></x-icons.users>
                                            @php

                                                $countOpportunities =
                                                App\Models\Opportunity
                                                        ::with('clientGroup.clients')
                                                        ->get()
                                                        ->pluck('clientGroup.clients')
                                                        ->flatten()
                                                        ->count() ?? 0;
                                            @endphp
                                            <p>Oportunidades</p>
                                             <span>({{$countOpportunities}})</span> 
                                        </a>
                                    </li>
                                    <li class="nav-item nav-client @if (url()->current() == route('seller.opportunities.index')) active @endif">
                                        <a href="{{ route('seller.opportunities.index') }}" title="Clientes Disponíveis"
                                            data-toggle="tooltip">
                                            <x-icons.users></x-icons.users>

                                            <p>Clientes Disponíveis</p>
                                            {{-- <span>(100)</span> --}}

                                        </a>
                                    </li>

                                </ul>
                            </div>
                        </aside>
                    </div>

                    <div class="col-md-9 seller-options">
                        <div class="panel-box @if (!isset($title)) bg-transparent @endif">
                            @if (isset($title))
                                <div class="panel-header">
                                    <div class="panel-top">
                                        <h2 id="page-title">
                                            @if (isset($icon))
                                                <x-dynamic-component :component="$icon"></x-dynamic-component>
                                            @endif

                                            {{ $title }}
                                        </h2>
                                        @if (isset($subtitle))
                                            <p>{!! $subtitle !!}</p>
                                        @endif
                                    </div>

                                    @if (isset($backButton))
                                        <div class="painel-action">
                                            <a href="{{ $backButton }}" class="back-button">
                                                <x-icons.arrow-back></x-icons.arrow-back>

                                                <p>Voltar</p>
                                            </a>
                                        </div>
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
