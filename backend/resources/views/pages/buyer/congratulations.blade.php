@push('styles')
    <link rel="stylesheet" href="{{ mix('css/cart.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <section id="congratulations" class="congratulations-page" style="text-align: center; padding: 40px 0;">
        <div class="container">
            <div class="icon-container">
                <x-icons.cart-auge></x-icons.cart-auge>
            </div>

            <h1 style="color: #0C5DA7; font-size: 28px;">Obrigado por comprar com a Auge App!</h1>
            <h1 style="color: #0C5DA7; font-size: 28px;">Esperamos que você volte em breve.</h1>

            <div class="delivery-info" style="margin-top: 20px;">
                <p style="font-size: 20px;">O prazo estimado de entrega do seu pedido é de <strong>{{$order?->lead_time}}</strong>.</p>

                @if ($client->seller)
                    <p style="font-size: 20px;">Caso precise de ajuda, entre em contato com o seu comercial {{ $client->seller->name }}.</p>
                @else
                    <p style="font-size: 20px;">Não conseguimos encontrar um vendedor vinculado à sua conta.</p>
                @endif
            </div>

            @if ($client->seller)
                <div class="actions" style="margin-top: 30px; display: flex; justify-content: center; gap: 20px;">
                    <!-- Botão do WhatsApp -->
                    <a href="https://wa.me/{{ $client->seller->cellphone }}" class="btn btn-outline-success" style="display: flex; align-items: center; gap: 10px; border: none;" target="_blank">
                        <x-icons.whatsapp></x-icons.whatsapp>
                        <span>Chamar no WhatsApp</span>
                    </a>

                    <!-- Botão do Telefone -->
                    <a href="tel:+{{ $client->seller->phone }}" class="btn btn-outline-primary" style="display: flex; align-items: center; gap: 10px; border: none;">
                        <x-icons.phone></x-icons.phone>
                        <span>{{ $client->seller->cellphone }}</span>
                    </a>
                </div>
            @endif

            <div class="order-actions" style="margin-top: 40px;">
                <a href="{{ route('cart.index') }}" class="btn btn-primary" style="background-color: #0C5DA7; border: none; padding: 10px 20px; margin-right: 15px; border-radius: 25px;">Finalizar outros pedidos</a>
                <a href="{{ route('buyer.closedOrders') }}" class="btn btn-primary" style="background-color: #0C5DA7; border: none; padding: 10px 20px; border-radius: 25px;">Ver pedidos finalizados</a>
            </div>
        </div>
    </section>

</x-layouts.base>
