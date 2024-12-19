@php
    $topNavigations = \App\Services\NavigationService::getAllByLocation(
        \App\Services\NavigationService::LOCATION_HEADER
    );

    $footerNavigations = \App\Services\NavigationService::getAllByLocation(
        \App\Services\NavigationService::LOCATION_FOOTER
    );

    $navigations = $topNavigations->concat($footerNavigations);
@endphp

<div id="offset-canvas" class="hide">
    <div class="header">
        <a href="{{ route('index') }}" title="Página inicial">
            @if (config('seo_config.logo') !== null && !empty(config('seo_config.logo')))
            <img src="{{ asset('storage/logo/' . config('seo_config.logo')) }}" alt="Logo">
            @else
            <img src="{{ asset('images/logo.svg') }}" alt="Logo">
            @endif
        </a>

        <div class="container-social">
            <ul class="list-inline list-social">
                <li>
                    <a href="https://maps.app.goo.gl/4LcTBHhRn62CdptZA" title="Clique para enviar um email">
                        <x-icons.map-marker></x-icons.map-marker>
                    </a>
                </li>

                <li>
                    <a href="mailto:contato@augeapp.com.br" title="Clique para enviar um email">
                        <x-icons.mail></x-icons.mail>
                    </a>
                </li>

                @if(!empty(config('seo_config.phone')))
                    <li>
                        <a
                            href="https://api.whatsapp.com/send?phone=55{{ onlyNumbers(config('seo_config.whatsapp')) }}"
                            title="Fale conosto pelo Whatsapp"
                            target="_blank"
                        >
                            <x-icons.whatsapp></x-icons.whatsapp>
                        </a>
                    </li>
                @endif

                @if(!empty(config('seo_config.phone')))
                    <li>
                        <a
                            href="tel:{{ onlyNumbers(config('seo_config.phone')) }}"
                            title="Clique para ligar"
                            target="_blank"
                        >
                            <x-icons.phone></x-icons.phone>
                        </a>
                    </li>
                @endif
            </ul>
        </div>

        <div class="container-title">
            <p>
                Categorias
                <x-icons.categories></x-icons.categories>
            </p>

            <button onclick="toggleCanvas()">
                <x-icons.close></x-icons.close>
            </button>
        </div>
    </div>

    <div class="main">
        <div class="container-navigations">
            @if(!empty($navigations))
                <nav>
                    @foreach($navigations as $navigation)
                        <h6>{{ $navigation->title }}</h6>

                        <ul>
                            @foreach($navigation->links as $link)
                                <li>
                                    <a
                                        href="{{ url($link?->url) }}"
                                        @if($link->isExternal()) target="_blank" noopener noreferrer @endif
                                        title="{{ $link->label }}">{{ $link->label }}
                                    </a>
                                </li>
                            @endforeach
                        </ul>
                    @endforeach
                </nav>
            @endif
        </div>

        <div class="footer">
            @include('components._list-social')

            <div class="container-address">
                <p>
                    {{ config('app.name') }} • CNPJ {{ config('square_config.document') }}<br>
                    Avenida do Contorno, 5436, Savassi<br>
                    Belo Horizonte/MG
                </p>
            </div>

            <a href="https://transparencyreport.google.com/safe-browsing/search?url={{ url('/') }}" target="_blank" noreferrer noopener>
                <small>Segurança Autenticada</small><br>
                <x-icons.google></x-icons.google>
            </a>
        </div>
    </div>
</div>
