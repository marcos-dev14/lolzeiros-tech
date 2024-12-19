<x-layouts.buyer-panel
    title="Dados de Acesso ao login"
    subtitle="Estes são os seus dados de acesso cadastrados aqui na AugeApp. Utilize o e-mail e senha para entrar em sua conta (login)."
    icon="icons.lock"
>
    {!! Form::model($buyer, ['route' => 'buyer.password.update', 'method' => 'PUT']) !!}
        <div class="col-xs-12 col-md-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="email"
                value="{{ $buyer->email }}"
                label="Email"
                readonly
            ></x-form.input>
        </div>

        <div class="separator"></div>

        <div class="col-xs-12">
            <label class="label-info">
                Não é possível alteração de e-mail, <a href="{{ route('buyer.commercial') }}" title="Clique aqui para ver os dados de contato do comercial" data-toggle="tooltip">contate seu comercial</a> Auge App para uma atualização rápida.
            </label>
        </div>

        <div class="separator"></div>

        <div class="col-xs-12 col-md-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="name"
                label="Nome"
                value="{{ $buyer->name }}"
                required
                autofocus
            ></x-form.input>
        </div>

        <div class="col-xs-12 col-md-4 select-100">
            <x-form.select
                name="role_id"
                :values="$roles"
                selected="{{ $buyer->role_id ?? old('role_id') ?? null }}"
                label="Cargo"
                required
            ></x-form.select>
        </div>

        <div class="col-xs-12 col-md-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="cellphone"
                label="Celular"
                value="{{ $buyer->cellphone }}"
                required
            ></x-form.input>
        </div>

        <div class="col-xs-12">
            <label class="label-info">Para alterar sua Senha, preencha os campos abaixo!</label>
        </div>

        <div class="col-xs-12 col-md-4">
            <x-form.input
                type="password"
                class="w-bg"
                name="current_password"
                label="Senha atual"
            ></x-form.input>
        </div>

        <div class="col-xs-12 col-md-4">
            <x-form.input
                type="password"
                class="w-bg"
                name="new_password"
                label="Nova Senha"
            ></x-form.input>
        </div>

        <div class="col-xs-12 col-md-4">
            <x-form.input
                type="password"
                class="w-bg"
                name="new_password_confirmation"
                label="Repetir nova Senha"
            ></x-form.input>
        </div>

        <div class="col-xs-6 col-xs-offset-3">
            <x-form.button
                label="Alterar senha"
                class="bt btn-block btn-sm button-one"
            ></x-form.button>
        </div>
    {!! Form::close() !!}
</x-layouts.buyer-panel>
