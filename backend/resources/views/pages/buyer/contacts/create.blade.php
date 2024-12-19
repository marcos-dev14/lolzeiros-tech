<x-layouts.buyer-panel
    title="Novo Colaborador"
    subtitle="Cadastre pessoas importantes do time da <strong>{{ $client->name }}</strong> no dia-a-dia comercial com a equipe AugeApp."
    icon="icons.users"
>
    {!! Form::open(['route' => 'buyer.contact.store', 'method' => 'POST']) !!}
        <div class="row">
            <div class="col-xs-12">
                @include('pages.buyer.partials._form-contact')
            </div>
            <div class="col-xs-12 col-md-12">
                <div class="col-xs-8 col-md-8">
                    <x-form.button form-group label="Salvar Colaborador" class="bt btn-block btn-sm button-one"></x-form.button>
                </div>
                <div class="col-xs-4 col-md-4">
                    <div class="form-group">
                        <label>&nbsp;</label>
                        <a href="{{ route('buyer.contact.list') }}" title="Retornar a página de colaboradores" class="bt btn-block btn-sm button-back">
                            Voltar
                        </a>
                    </div>
                </div>

            </div>
        </div>
    {!! Form::close() !!}
</x-layouts.buyer-panel>