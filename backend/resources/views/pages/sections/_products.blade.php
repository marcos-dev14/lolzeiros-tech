<section id="products">
    <div class="container">
        @include('components._breadcrumb')

        <div class="row">
            <div class="filter-container">
                <button type="button" onclick="openFilter()" class="filter-button">
                    Filtro <x-icons.filter></x-icons.filter>
                </button>

                <button type="button" onclick="closeFilter()" class="filter-close hide">
                    <x-icons.close></x-icons.close>
                </button>

                <div class="select-az disabled hidden-md hidden-lg hidden-xl">
                    <form action="">
                        {!! Form::select(
                            'sort',
                            $availableSorts,
                            session('filters.selectedSort') ?? 'release-desc',
                            ['id' => 'select-sort-mobile', 'class' => 'select-no-search']
                        ) !!}
                    </form>
                </div>
            </div>

            <div class="col-xs-12 col-md-3">
                <aside class="
                    aside-filter
                    @if(count($products)) with-margin @endif
                    @if($isMobile) hide @endif
                ">
                    @include('components._products-filter')
                </aside>
            </div>

            <div class="col-xs-12 col-md-9">
                @if(!count($products))
                    <div class="row">
                        <div class="col-xs-12">
                            <h4>Nenhum produto foi encontrado.</h4>
                        </div>
                    </div>
                @else
                    <div class="
                        row-pagination
                        @if(!auth()->guard('buyer')->user() || !isset($supplier) || $supplier->shippingType?->id !== 2) flex-end @endif
                    ">
                        @if(auth()->guard('buyer')->user() && isset($supplier) && $supplier->shippingType?->id === 2)
                            <div class="left-side">
                                <x-icons.truck></x-icons.truck>
                                <span>Todos os produtos <strong>{{ $supplier->name }}</strong> com Frete Grátis</span>
                            </div>
                        @endif

                        <div class="right-side disabled hidden-xs hidden-sm">
                            <form action="">
                                {!! Form::select(
                                    'sort',
                                    $availableSorts,
                                    session('filters.selectedSort') ?? 'release-desc',
                                    ['id' => 'select-sort', 'class' => 'select-no-search']
                                ) !!}
                            </form>

                            @if($products->hasPages())
                                @include('components._pagination-container', ['items' => $products, 'class' => 'product-pagination'])
                            @endif
                        </div>
                    </div>

                    <div class="grid-products">
                        @foreach($products as $product)
                            <div>
                                @include('components._card')
                            </div>
                        @endforeach
                    </div>

                    @if($products->hasPages())
                        <div class="row">
                            <div class="col-xs-12">
                                @include('components._pagination-container', ['items' => $products])
                            </div>
                        </div>
                    @endif

{{--                    <div class="row">--}}
{{--                        <div class="col-xs-12 text-center">--}}
{{--                            <button id="see-more" class="btn btn-info" data-route="{{ url()->current() }}">Ver mais produtos</button>--}}
{{--                        </div>--}}
{{--                    </div>--}}
                @endif
            </div>
        </div>
    </div>
</section>
