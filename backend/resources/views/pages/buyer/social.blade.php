<x-layouts.buyer-panel
    title="Minhas Redes Sociais"
    subtitle="Uma amizade virtual também sempre é bem-vinda."
    icon="icons.facebook"
>
    {!! Form::model($client, ['route' => ['buyer.client.update', $client], 'method' => 'PUT']) !!}
        <div class="col-xs-12">
            <div class="form-group">
                <x-form.input
                    type="checkbox"
                    name="has_ecommerce"
                    checked="{{ $client->has_ecommerce ? 'true' : 'false' }}"
                    label="Você tem Loja Virtual?"
                ></x-form.input>
            </div>
        </div>

        <div class="col-xs-12 col-sm-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="website"
                value="{{ $client->website ?? null }}"
                label="Site da Empresa"
                autofocus
            ></x-form.input>
        </div>

        <div class="col-xs-12 col-sm-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="instagram"
                value="{{ $client->instagram ?? null }}"
                label="Instagram da Empresa"
            ></x-form.input>
        </div>

        <div class="col-xs-12 col-sm-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="facebook"
                value="{{ $client->facebook ?? null }}"
                label="Facebook da Empresa"
            ></x-form.input>
        </div>

        <div class="col-xs-12 col-sm-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="youtube"
                value="{{ $client->youtube ?? null }}"
                label="Youtube da Empresa"
            ></x-form.input>
        </div>

        <div class="col-xs-12 col-sm-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="twitter"
                value="{{ $client->twitter ?? null }}"
                label="Twitter da Empresa"
            ></x-form.input>
        </div>

        <div class="separator"></div>

        <div class="col-xs-12 col-sm-3 col-sm-offset-9">
            <x-form.button label="Salvar Redes Sociais" class="bt btn-block btn-sm button-one"></x-form.button>
        </div>
    {!! Form::close() !!}
</x-layouts.buyer-panel>
