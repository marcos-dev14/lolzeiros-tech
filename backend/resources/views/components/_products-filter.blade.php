<form action="{{ route('products') }}" id="products-filter">
    @include('components.__products-filter-nav', [
        'items' => $suppliers,
        'title' => 'Fornecedores',
        'subtitle' => '',
        'collectionName' => 'supplier',
        'inputType' => 'radio'
    ])

    @include('components.__products-filter-nav', [
        'items' => $categories,
        'title' => 'Categorias',
        'subtitle' => '',
        'collectionName' => 'categories'
    ])

    @if(!empty($attributes))
        @foreach($attributes as $attribute)
            <nav>
                <h6>{{ $attribute['name'] }}</h6>

                @if(count($attribute['values']) > 13)
                    <a onclick="toggleMenu(this);" data-parent="#listAttributes{{ \Illuminate\Support\Str::ucfirst($attribute['name']) }}" class="expand">
                        <x-icons.down></x-icons.down>
                    </a>
                @endif

                <ul id="listAttributes{{ \Illuminate\Support\Str::ucfirst($attribute['name']) }}">
                    @foreach($attribute['values'] as $value)
                        <li>
                            <label title="{{ $value['name'] }}" data-toggle="tooltip">
                                <input
                                    type="checkbox"
                                    name="{{ $attribute['id'] }}"
                                    data-input-type="attributes"
                                    @if ($value['checked']) checked @endif
                                    value="{{ "{$attribute['id']}|{$value['name']}" }}"
                                    data-test="{{ "{$attribute['id']}|{$value['name']}" }}"
                                    data-checked="{{ $value['checked'] ? 'true' : 'false' }}"
                                >
                                {{ \Illuminate\Support\Str::limit($value['name'], 25) }}
                            </label>
                        </li>
                    @endforeach
                </ul>
            </nav>
        @endforeach
    @endif

    @include('components.__products-filter-nav', [
        'items' => $brands,
        'title' => 'Marcas',
        'subtitle' => '',
        'collectionName' => 'brands'
    ])
</form>
