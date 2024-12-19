<div class="modal fade" id="modal-search-mobile" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="myModalLabel">BUSCA</h4>

                <button type="button" class="filter-close" data-dismiss="modal">
                    <x-icons.close></x-icons.close>
                </button>
            </div>

            <div class="modal-body">
                <div class="search-box">
                    {!! Form::open(['route' => 'products', 'method' => 'GET', 'id' => 'form-search-mobile']) !!}
                        {!! Form::select(
                            'rp',
                            session('filters.suppliers.available')?->pluck('name', 'id') ?? ['Todos'],
                            session('filters.suppliers.selected') ?? null,
                            ['id' => 'selectSearchModal', 'class' => 'select-no-search']
                        ) !!}

                        <input
                            class="input-search"
                            type="text"
                            name="pe"
                            value="{{ session('filters.searchTerms') ?? null }}"
                            placeholder=" Procure aqui"
                        >

                        <button type="submit" aria-label="Procurar">
                            <x-icons.search></x-icons.search>

                            <span>PROCURAR</span>
                        </button>
                    {!! Form::close() !!}
                </div>
            </div>
        </div>
    </div>
</div>
