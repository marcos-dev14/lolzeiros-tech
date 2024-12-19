<x-layouts.buyer-panel
    title="Meu Comercial Auge App"
    subtitle="Precisa de ajuda? Converse com o especialista por sua conta aqui na AugeApp."
    icon="icons.commercial"
>
    <div class="boxes-list">
        <button type="button">
            <x-icons.hand-shake></x-icons.hand-shake>

            @if(!$commercial)
                <span class="h5">Sua loja ainda não tem um especialista, entre em contato conosco pelos canais de atendimento.</span>
            @else
                @if($commercial->name)
                    <span class="h5">{{ $commercial->name }}</span>
                @endif

                @if($commercial->email)
                    <span class="p">{{ $commercial->email }}</span>
                @endif

                @if($commercial->phone)
                    <span class="p">{{ $commercial->phone }}</span>
                @endif

                @if($commercial->cellphone)
                    <span class="p">{{ $commercial->cellphone }}</span>
                @endif
            @endif
        </button>
    </div>
</x-layouts.buyer-panel>
