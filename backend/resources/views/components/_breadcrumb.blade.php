<div class="row">
    <div class="col-xs-12">
        <div id="breadcrumb">
            <nav>
                <ul>
                    <li><a href="{{ route('index') }}" title="Página Inicial">Página Inicial</a></li>

                    <li>
                        @if(!auth()->guard('buyer')->user())
                            <a
                                href="{{ route('buyer.showLoginForm') }}"
                                title="Entrar e fazer meu pedido">
                                Entrar e fazer meu pedido
                            </a>
                        @elseif(!empty(session('cart')['full']['instances']))
                            <a
                                href="{{ route('products') . '?rp=' . session('filters.suppliers.selected') ?? session('cart')['full']['instances']?->first()?->id }}"
                                title="Continuar comprando">
                                Continuar comprando
                            </a>
                        @else
                            <a
                                href="{{ route('products') }}"
                                title="Fazer meu pedido">
                                Fazer meu pedido
                            </a>
                        @endif
                    </li>

                    @if(!empty($links))
                        @foreach($links as $link)
                            <li><a href="{{ $link['url'] }}" title="{{ $link['label'] }}">{{ $link['label'] }}</a></li>
                        @endforeach
                    @endif

                    @if(!empty($currentLink))
                        <li>
                            <a
                                href="javascript:void(0);"
                                class="active"
                                title="{{ $currentLink['title'] ?? $currentLink['label'] }}"
                                data-toggle="tooltip"
                            >
                                {{ $currentLink['label'] }}
                            </a>
                        </li>
                    @endif
                </ul>
            </nav>
        </div>
    </div>
</div>
