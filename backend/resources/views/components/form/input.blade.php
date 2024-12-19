@if($type == 'checkbox')
    <label for="{{ $name }}" data-type="{{ $type }}">
        <input
            type="{{ $type }}"
            name="{{ $name }}"
            id="{{ $name }}"
            @if($attributes->has('checked') && $attributes->get('checked') == 'true') checked @endif>
        {{ $label }}
    </label>
@elseif($type == 'textarea')
    <div class="form-group">
        <label for="{{ $name }}">
            {{ $label }}

            @if($attributes->has('required'))
                <span>*</span>
            @endif
        </label>

        <textarea name="{{ $name }}" id="{{ $name }}" class="form-control {{ $class }}" {{ $attributes }}></textarea>
    </div>
@else
    <div class="form-group">
        <label for="{{ $name }}">
            {{ $label }}

            @if($attributes->has('required'))
                <span>*</span>
            @endif
        </label>

        <input
            type="{{ $type }}"
            name="{{ $name }}"
            id="{{ $attributes['id'] ?? $name }}"
            class="form-control {{ $class }}"
            {{ $attributes }}
            @if($attributes->has('isDisabled') && $attributes->get('isDisabled')) readonly tabindex="-1" @endif
        >
    </div>
@endif
