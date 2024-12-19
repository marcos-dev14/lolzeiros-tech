<x-layouts.buyer-panel
    title="Meus Endereços"
    subtitle="Aqui você pode cadastrar um ou mais endereços da <strong>{{ $client->name }}</strong>.<br>Endereço principal é o cadastrado no Portal da Receita Federal e obrigatoriamente será o endereço de faturamento de seu pedido."
    icon="icons.map-marker"
>
    {!! Form::open(['route' => 'buyer.address.store', 'method' => 'POST']) !!}
        <div class="row">
            <div class="col-xs-12">
                @include('pages.buyer.partials._form-address')
            </div>

            <div class="col-xs-12 col-md-12">
                <div class="col-xs-8 col-md-8">
                    <div class="form-group">
                        <button type="submit" class="bt btn-block btn-sm button-one">Salvar Endereço</button>
                    </div>
                </div>
                <div class="col-xs-4 col-md-4">
                    <div class="form-group">
                        <a href="{{ route('buyer.address.list') }}" title="Retornar a página de endereços" class="bt btn-block btn-sm button-back">
                            Voltar
                        </a>
                    </div>
                </div>
            </div>
        </div>
    {!! Form::close() !!}
</x-layouts.buyer-panel>
