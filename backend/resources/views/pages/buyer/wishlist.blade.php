<x-layouts.buyer-panel
    title="Meus Favoritos"
    subtitle="Navegue e traga seus produtos prediletos para sua secção de favoritos."
    icon="icons.wishlist"
>
    @if(!count($products))
        <div class="row">
            <div class="col-xs-12">
                <h4>Você ainda não adicionou nenhum produto aos seus favoritos.</h4>
            </div>
        </div>
    @else
        <div class="row-pagination flex-end">
            <div class="right-side">
                <form action="{{ route('buyer.wishlist') }}">
                    {!! Form::select(
                        'rp',
                        $suppliers,
                        $selectedSupplier ?? null,
                        ['id' => 'select-filter', 'class' => 'select-no-search', 'placeholder' => 'Todos'],
                    ) !!}
                </form>

                @if($products->hasPages())
                    @include('components._pagination-container', ['items' => $products, 'class' => 'product-pagination'])
                @endif
            </div>
        </div>

        <div class="grid-products" data-action="delete-after-wishlist">
            @foreach($products as $product)
                @include('components._card')
            @endforeach
        </div>

        @if($products->hasPages())
            <div class="row">
                <div class="col-xs-12">
                    @include('components._pagination-container', ['items' => $products])
                </div>
            </div>
        @endif
    @endif

    @push('scripts-inline')
        <script>
            const selectFilter = $('#select-filter')
            $(function () {
                selectFilter.on('change', function () {
                    $(this).closest('form').trigger('submit');
                });
            });
        </script>
    @endpush
</x-layouts.buyer-panel>
