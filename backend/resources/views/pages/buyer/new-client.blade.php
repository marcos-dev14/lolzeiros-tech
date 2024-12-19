<x-layouts.buyer-panel
    title="Nova loja"
    icon="icons.store"
    subtitle="Cadastre abaixo outra loja do seu grupo"
>
    {!! Form::open(['route' => ['buyer.clients.new'], 'method' => 'POST']) !!}
        <x-loader id="register-loader"></x-loader>

            {!! Form::hidden('receita_api', old('receita_api') ?? null, ['id' => 'receitaws']) !!}

        <div class="gray-input col-12 col-sm-6 col-md-4">
            <x-form.select
                name="client_pdv_id"
                :values="$pdvs"
                selected="{{ old('client_pdv_id') ?? null }}"
                label="Área de Atuação da sua Empresa"
                autofocus
                required
                class="lowercase"
            ></x-form.select>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
            <x-form.input
                type="text"
                class="w-bg mask-cnpj"
                name="document"
                value="{{ old('document') ?? null }}"
                label="CNPJ"
                required
                placeholder="__.___.___/____-__"
            ></x-form.input>
        </div>

        <div class="col-12 col-sm-6 col-md-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="name"
                value="{{ old('name') ?? null }}"
                label="Razão Social"
                isDisabled="1"
                required
                data-format="Pascal"
            ></x-form.input>
        </div>

        <div class="d-flex flex-wrap">

            <div class="col-xs-10 col-md-8 col-xs-offset-1 col-md-offset-0" style="margin-bottom: 10px;">
                <x-form.button
                    label="Salvar Informação da Empresa"
                    class="btn btn-block btn-sm button-one"
                ></x-form.button>
            </div>

            <div class="back button col-xs-4 col-xs-offset-4 col-md-4 col-md-offset-0">
                <div class="form-group">
                    <a href="{{ route('buyer.clients') }}" title="Retornar a página de seleção de loja" class="btn btn-block btn-sm button-back">
                        Voltar
                    </a>
                </div>
            </div>

        </div>
    {!! Form::close() !!}
</x-layouts.buyer-panel>
