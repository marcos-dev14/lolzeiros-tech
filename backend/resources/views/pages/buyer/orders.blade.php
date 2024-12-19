<x-layouts.buyer-panel
    title="Pedidos em andamento"
    subtitle="Pedidos recebidos pela Auge em fase de aprovações, faturamento e envio. Em caso de dúvidas, contate o seu comercial Auge APP {{ $client->seller?->name }} {{ $client->seller?->cellphone }}"
    icon="icons.bag
">
    <div class="orders-list">
        @foreach($client->orders->sortByDesc('id') as $order)
            @include('pages.buyer.partials._order-item')
        @endforeach
    </div>
</x-layouts.buyer-panel>
