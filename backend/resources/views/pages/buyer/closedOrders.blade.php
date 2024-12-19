<x-layouts.buyer-panel
    title="Pedidos Faturados"
    subtitle="Tudo certo! Pedido faturado com sucesso. Utilize os sistemas da Auge App e contate o seu comercial Auge App {{ $client->seller?->name }} {{ $client->seller?->cellphone }} sempre que precisar"
    icon="icons.status-check
">
    <div class="orders-list">
        @foreach($client->orders->sortByDesc('id') as $order)
            @include('pages.buyer.partials._order-item')
        @endforeach
    </div>
</x-layouts.buyer-panel>
