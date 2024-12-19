<x-layouts.buyer-panel
    title="Alterar Loja"
    subtitle="Aqui estão todas as lojas que você pode fazer pedidos na AugeApp, clique em cima da loja para ativá-la!<br>Cadastre mais lojas em poucos passos!"
    icon="icons.swipe2"
>
    <div class="boxes-list">
        @if(!empty($allClients))
            @foreach($allClients as $client)
                <form action="{{ route('buyer.changeSelectedClient') }}" method="POST">
                    <input type="hidden" value="{{ $client->id }}" name="client_id">

                    <button
                        type="{{ $client->id == $selectedClient->id ? 'button' : 'submit' }}"
                        @if($client->id == $selectedClient->id) class="active" @endif
                        title="Selecionar loja"
                    >
                        <x-icons.store></x-icons.store>
                        <span class="h5">{{ $client->company_name }}</span>
                        <span class="p">{{ $client->document }}</span>
                        <span class="h5">{!! $client->pdfType?->name ?? "&nbsp;" !!}</span>
                        <span class="h6">O pedido será enviado para:</span>
                        <span class="p">{!! $client->main_address?->full_address ?? "&nbsp;" !!}</span>
                    </button>
                </form>
            @endforeach
        @endif

        <a href="{{ route('buyer.clients.new') }}" id="add-more" title="Adicionar nova loja">
            <x-icons.plus></x-icons.plus>
        </a>
    </div>
</x-layouts.buyer-panel>
