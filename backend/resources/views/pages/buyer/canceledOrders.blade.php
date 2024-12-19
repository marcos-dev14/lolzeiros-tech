<x-layouts.buyer-panel
    title="Pedidos Cancelados"
    subtitle="Ops, não deu certo desta vez mas estamos sempre por aqui prontos para lhe atender. <br> Entre sempre em contato com seu comercial Auge APP <b> Thiago Lopes (31) 98635-9192.</b>"
    icon="icons.bag
">
    <div class="orders-list">
        @foreach($client->orders->sortByDesc('id') as $order)
            @include('pages.buyer.partials._order-item')
        @endforeach
    </div>
</x-layouts.buyer-panel>
