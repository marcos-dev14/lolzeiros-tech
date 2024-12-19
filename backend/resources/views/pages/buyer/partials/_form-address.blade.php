<div class="col-xs-12 col-md-4 select-100">
    <x-form.select
        name="address_type_id"
        :values="$addressTypes"
        selected="{{ $address->address_type_id ?? old('address_type_id') ?? 2 ?? null }}"
        label="Tipo de Endereço"
        required
    ></x-form.select>
</div>

<div class="separator"></div>

<div class="col-xs-12 col-md-2">
    <x-form.input
        type="text"
        class="w-bg zipcode"
        name="zipcode"
        value="{{ $address->zipcode ?? old('zipcode') ?? null }}"
        label="Cep"
        required
        autofocus
    ></x-form.input>
</div>

<div class="col-xs-12 col-md-4">
    <x-form.input
        type="text"
        class="w-bg"
        name="street"
        value="{{ $address->street ?? old('street') ?? null }}"
        label="Endereço"
        required
        data-format="Pascal"
    ></x-form.input>
</div>

<div class="col-xs-12 col-md-3">
    <x-form.input
        type="text"
        class="w-bg"
        name="number"
        value="{{ $address->number ?? old('number') ?? null }}"
        label="Número"
        required
        data-format="Pascal"
    ></x-form.input>
</div>

<div class="col-xs-12 col-md-3">
    <x-form.input
        type="text"
        class="w-bg"
        name="complement"
        value="{{ $address->complement ?? old('complement') ?? null }}"
        label="Complemento"
        data-format="Pascal"
    ></x-form.input>
</div>

<div class="col-xs-12 col-md-5">
    <x-form.input
        type="text"
        class="w-bg"
        name="district"
        value="{{ $address->district ?? old('district') ?? null }}"
        label="Bairro"
        required
        data-format="Pascal"
    ></x-form.input>
</div>

<div class="col-xs-12 col-md-2 select-100">
    <x-form.select
        name="country_state"
        id="country_state_id"
        :values="$countryStates"
        selected="{{ $address->country_state_id ?? old('country_state_id') ?? null }}"
        label="Estado"
        data-cities-route="{{ route('api.country_cities', 'state') }}"
        required
    ></x-form.select>
</div>

<div class="col-xs-12 col-md-5 select-100">
    <x-form.select
        name="country_city_id"
        :values="[]"
        placeholder="Selecione o Estado"
        label="Cidade"
        required
    ></x-form.select>
</div>
