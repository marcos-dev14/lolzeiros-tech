@if($formGroup)
    <div class="form-group">
        <label for="">&nbsp;</label>
        <button
            type="{{ $type ?? 'submit' }}"
            {{ $attributes->merge(['class' => 'btn']) }}
        >{{ $label }}</button>
    </div>
@else
    <button
        type="{{ $type ?? 'submit' }}"
        {{ $attributes->merge(['class' => 'btn']) }}
    >{{ $label }}</button>
@endif
