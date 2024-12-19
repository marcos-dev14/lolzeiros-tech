<div class="col-xs-12 col-sm-6 col-md-4">
    <x-form.input
        type="text"
        class="w-bg"
        name="owner_name"
        value="{{ $bankAccount->owner_name ?? old('owner_name') ?? null }}"
        label="Proprietário da Conta"
        required
        autofocus
        data-format="Pascal"
    ></x-form.input>
</div>

<div class="col-xs-12 col-sm-6 col-md-3">
    <x-form.input
        type="text"
        class="w-bg"
        name="document"
        value="{{ $bankAccount->document ?? old('document') ?? null }}"
        label="CNPJ / CPF"
        data-format="cpf-cnpj"
    ></x-form.input>
</div>

<div class="col-xs-12 col-sm-6 col-md-5 select-100">
    <x-form.select
        name="bank_id"
        :values="$banks"
        selected="{{ $bankAccount->bank_id ?? old('bank_id') ?? null }}"
        label="Banco"
        required
    ></x-form.select>
</div>

<div class="col-xs-12 col-sm-6 col-md-3">
    <x-form.input
        type="text"
        class="w-bg"
        name="account_number"
        value="{{ $bankAccount->account_number ?? old('account_number') ?? null }}"
        label="Conta Corrente"
        data-format="number"
    ></x-form.input>
</div>

<div class="col-xs-12 col-sm-6 col-md-2">
    <x-form.input
        type="text"
        class="w-bg"
        name="agency"
        value="{{ $bankAccount->agency ?? old('agency') ?? null }}"
        label="Agência"
        data-format="number"
    ></x-form.input>
</div>

<div class="col-xs-12 col-sm-6 col-md-2">
    <x-form.input
        type="text"
        class="w-bg"
        name="operation"
        value="{{ $bankAccount->operation ?? old('operation') ?? null }}"
        label="Operação"
        data-format="number"
    ></x-form.input>
</div>

<div class="col-xs-12 col-sm-6 col-md-2">
    <x-form.input
        type="text"
        class="w-bg"
        name="pix_key"
        value="{{ $bankAccount->pix_key ?? old('pix_key') ?? null }}"
        label="Chave Pix"
    ></x-form.input>
</div>

<div class="col-xs-12 col-sm-6 col-md-3">
    <x-form.input
        type="text"
        class="w-bg"
        name="paypal"
        value="{{ $bankAccount->paypal ?? old('paypal') ?? null }}"
        label="Paypal"
    ></x-form.input>
</div>
