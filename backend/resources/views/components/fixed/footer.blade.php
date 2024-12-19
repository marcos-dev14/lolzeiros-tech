@php
    $navigations = \App\Services\NavigationService::getAllByLocation(
        \App\Services\NavigationService::LOCATION_FOOTER
    );

//    $navigations = collect();
@endphp

<footer id="footer">
    <div class="footer-primary">
        <div class="container">
            <div class="row">
                @if(!empty($navigations))
                    @foreach($navigations as $navigation)
                        <div class="col-xs-12 col-sm-4 col-md-3">
                            <h4>{{ $navigation->title }}</h4>

                            <ul>
                                @foreach($navigation->links as $link)
{{--                                    @dd($link->toArray(), $link->url, $link->linkable_type)--}}
                                    <li>
                                        <a
                                            href="{{ url($link?->url) }}"
{{--                                            @if($link->isExternal()) target="_blank" noopener noreferrer @endif--}}
                                            title="{{ $link->label }}">{{ $link->label }}
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                    @endforeach

                    <div class="col-xs-12 col-sm-6 col-md-3">
                        <h4>Contate-nos</h4>

                        <ul class="list-buttons">
                            <li>
                                <a href="mailto:contato@augeapp.com.br" title="Clique para enviar um email">
                                    <span>Enviar E-mail</span>
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
                                        <span>{{ config('seo_config.whatsapp') }}</span>
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
                                        <span>{{ config('seo_config.phone') }}</span>
                                        <x-icons.phone></x-icons.phone>
                                    </a>
                                </li>
                            @endif
                        </ul>

                        @include('components._list-social')

                        <a href="https://transparencyreport.google.com/safe-browsing/search?url={{ url('/') }}" target="_blank" noreferrer noopener id="box-google">
                            <small>Segurança Autenticada</small>
                            <x-icons.google></x-icons.google>
                        </a>
                    </div>
                @endif
            </div>
        </div>
    </div>

    <div class="footer-secondary">
        <div class="container">
            <div class="row">
                <div class="col-xs-12">
                    <h5>Auge App · CNPJ 07.558.145/0001-51 · Avenida do Contorno, 5436, Savassi, Belo Horizonte/MG</h5>
                </div>
            </div>
        </div>
    </div>
</footer>
