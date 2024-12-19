<x-layouts.buyer-panel
    title="Meus Endereços"
    subtitle="Aqui você pode cadastrar um ou mais endereços da <strong>{{ $client->name }}</strong>.<br>Endereço principal é o cadastrado no Portal da Receita Federal e obrigatoriamente será o endereço de faturamento de seu pedido."
    icon="icons.map-marker"
>
    <div class="boxes-list">
        @foreach($client->addresses as $address)
            <div class="box-item {{ $address->id === $client->mainAddress?->id ? 'active' : null }}">
                <x-icons.map-marker-large></x-icons.map-marker-large>

                <span class="h5">
                    {{ $address->id === $client->mainAddress?->id ? 'Endereço Principal' : $address?->type?->name }}
                </span>

                <span class="p">{!! $address->full_address !!}</span>

                <div class="box-footer">
                    @if($address->id !== $client->mainAddress?->id)
                        <a href="{{ route('buyer.address.edit', $address) }}" class="bt btn-block btn-sm">Editar</a>

                        {!! Form::open(['route' => ['buyer.address.destroy', $address], 'method' => 'DELETE']) !!}
                            <x-form.button label="Apagar" class="bt btn-block btn-sm bt-inverse"></x-form.button>
                        {!! Form::close() !!}
                    @endif
                </div>
            </div>
        @endforeach

        <a href="{{ route('buyer.address.create') }}" id="add-more" title="Adicionar novo endereço">
            <x-icons.plus></x-icons.plus>
        </a>
    </div>
</x-layouts.buyer-panel>
