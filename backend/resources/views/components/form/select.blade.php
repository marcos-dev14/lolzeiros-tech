<div class="form-group">
    <label for="{{ $name }}">
        {{ $label }}

        @if($attributes->has('required'))
            <span>*</span>
        @endif
    </label>

    {!! Form::select(
        $name,
        $values,
        $selected,
        ['placeholder' => $placeholder, 'id' => $id ?? $name, $attributes]
    ) !!}
</div>
