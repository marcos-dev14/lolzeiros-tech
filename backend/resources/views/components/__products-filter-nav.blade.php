@if(!empty($items) && count($items))
    <nav>
        @if(!empty($title))
            <h4>{{ $title }}</h4>
        @endif

        <h6>{{ $subtitle }}</h6>

        @if(count($items) > 20)
            <a onclick="toggleMenu(this);" data-parent="#list{{ ucfirst($collectionName) }}" class="expand">
                <x-icons.down></x-icons.down>
            </a>
        @endif

        <ul id="list{{ ucfirst($collectionName) }}">
            @foreach($items as $item)
                <li>
                    <label title="{{ isset($nameField) ? $item->$nameField : $item->name ?? null }}" data-toggle="tooltip">
                        <input
                            type="{{ $inputType ?? 'checkbox' }}"
                            name="{{ $collectionName }}"
                            @if ($item->checked) checked @endif
                            value="{{ $item?->id }}"
                        >
                        {{ \Illuminate\Support\Str::limit(isset($nameField) ? $item->$nameField : $item->name, 25) }}
{{--                        @if (!empty($item->available_products_count)) {{ " ($item->available_products_count)" }} @endif--}}
                    </label>
                </li>
            @endforeach
        </ul>
    </nav>
@endif
