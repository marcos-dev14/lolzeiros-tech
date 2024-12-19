<div class="col-xs-12 col-md-4">
    <x-form.input
        type="text"
        class="w-bg"
        name="name"
        value="{{ $contact->name ?? old('name') ?? null }}"
        label="Nome do Colaborador"
        required
        data-format="Pascal"
        autofocus
    ></x-form.input>
</div>

<div class="col-xs-12 col-md-4 select-100">
    <x-form.select
        name="role_id"
        :values="$roles"
        selected="{{ $contact->role_id ?? old('role_id') ?? null }}"
        label="Cargo na empresa"
        required
    ></x-form.select>
</div>

<div class="col-xs-12 col-md-4">
    <x-form.input
        type="text"
        class="w-bg mask-cellphone"
        name="cellphone"
        value="{{ $contact->cellphone ?? old('cellphone') ?? null }}"
        label="Celular"
    ></x-form.input>
</div>

<div class="col-xs-12 col-md-3">
    <x-form.input
        type="text"
        class="w-bg mask-phone"
        name="phone"
        value="{{ $contact->phone ?? old('phone') ?? null }}"
        label="Telefone Fixo"
    ></x-form.input>
</div>

<div class="col-xs-12 col-md-1">
    <x-form.input
        type="text"
        class="w-bg"
        name="phone_branch"
        value="{{ $contact->phone_ramal ?? old('phone_ramal') ?? null }}"
        label="Ramal"
    ></x-form.input>
</div>

<div class="col-xs-12 col-md-3">
    <x-form.input
        type="text"
        class="w-bg mask-cellphone"
        name="whatsapp"
        value="{{ $contact->whatsapp ?? old('whatsapp') ?? null }}"
        label="Whatsapp"
    ></x-form.input>
</div>

<div class="col-xs-12 col-md-5">
    <x-form.input
        type="email"
        class="w-bg"
        name="email"
        label="Email"
        value="{{ $contact->email ?? old('email') ?? null }}"
        required
        onkeyup="this.value = this.value.toLowerCase();"
    ></x-form.input>
</div>
