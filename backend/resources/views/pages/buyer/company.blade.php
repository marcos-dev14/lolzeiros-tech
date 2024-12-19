<x-layouts.buyer-panel title="Informação da Empresa" icon="icons.company">
    {!! Form::model($client, ['route' => ['buyer.client.update', $client], 'method' => 'PUT']) !!}
        @include('pages.buyer.partials._form-company')

        <div class="col-xs-6 col-xs-offset-6">
            <x-form.button
                form-group
                label="Salvar Informação da Empresa"
                class="bt btn-block btn-sm"
            ></x-form.button>
        </div>
    {!! Form::close() !!}
</x-layouts.buyer-panel>
