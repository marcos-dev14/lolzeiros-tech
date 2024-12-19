<x-layouts.buyer-panel
    title="Meus Endereços"
    subtitle="Aqui você pode cadastrar um ou mais endereços da <strong>{{ $client->name }}</strong>.<br>Endereço principal é o cadastrado no Portal da Receita Federal e obrigatoriamente será o endereço de faturamento de seu pedido."
    icon="icons.map-marker"
>
    {!! Form::model($address, ['route' => ['buyer.address.update', $address], 'method' => 'PUT', 'id' => 'storeForm']) !!}
        {!! Form::hidden('selected_state', $address?->state?->code, ['id' => 'selected_state']) !!}
        {!! Form::hidden('selected_city', $address?->city?->name, ['id' => 'selected_city']) !!}

        @include('pages.buyer.partials._form-address', ['item' => $address])

        <div>
            <div class="col-xs-8 col-md-8">
                <x-form.button label="Salvar Endereço" class="bt btn-block btn-sm button-one px-2"></x-form.button>
            </div>
            <div class="col-xs-4 col-md-4">
                <div class="form-group">
                    <a href="{{ route('buyer.address.list') }}" title="Retornar a página de endereços" class="bt btn-block btn-sm button-back px-2">
                        Voltar
                    </a>
                </div>
            </div>
        </div>
    {!! Form::close() !!}

    @push('scripts-inline')
    <script>
        const form = $('#storeForm')
        const fieldState = form.find('#country_state_id')
        const fieldCity = form.find('#country_city_id')

        $(function () {
            sessionStorage.setItem('SELECTED_CITY', form.find('#selected_city').val())
            fieldState.val(form.find('#selected_state').val()).trigger('change')
        })
    </script>
    @endpush
</x-layouts.buyer-panel>
