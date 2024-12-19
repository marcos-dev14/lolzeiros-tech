<div class="col-xs-6">
    <x-form.select
        name="client_pdv_id"
        :values="$pdvs"
        selected="{{ $client->client_pdv_id ?? old('client_pdv_id') ?? null }}"
        label="Área de Atuação da Empresa"
        autofocus
    ></x-form.select>
</div>

<div class="col-xs-3">
    <x-form.input
        type="text"
        class="w-bg mask-cnpj"
        name="document"
        value="{{ $client->document ?? old('document') ?? null }}"
        label="CNPJ"
        required
        isDisabled="{{ isset($client) }}"
    ></x-form.input>
</div>

<div class="col-xs-3">
    <x-form.input
        type="text"
        class="w-bg"
        name="state_registration"
        value="{{ $client->state_registration ?? old('state_registration') ?? null }}"
        label="Inscrição Estadual"
        required
        data-format="number"
    ></x-form.input>
</div>

<div class="col-xs-6">
    <x-form.input
        type="text"
        class="w-bg"
        name="company_name"
        value="{{ $client->company_name ?? old('company_name') ?? null }}"
        label="Razão Social"
        required
        isDisabled="{{ isset($client) }}"
    ></x-form.input>
</div>

<div class="col-xs-6">
    <x-form.input
        type="text"
        class="w-bg"
        name="name"
        value="{{ $client->name ?? old('name') ?? null }}"
        label="Nome Fantasia"
        required
        isDisabled="{{ isset($client) }}"
    ></x-form.input>
</div>
