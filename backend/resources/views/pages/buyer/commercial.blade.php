<x-layouts.buyer-panel title="Meu Comercial Auge App"
    subtitle="Precisa de ajuda? Converse com o especialista por sua conta aqui na AugeApp." icon="icons.commercial">
    @if (!$commercialList)
        <div class="boxes-list">
            <button type="button">
                <x-icons.hand-shake></x-icons.hand-shake>
                <span class="h5">Sua loja ainda não tem um especialista, entre em contato conosco pelos canais de
                    atendimento.</span>
            </button>
        </div>
    @else
    <div class="boxes-list">
            @foreach ($commercialList as $commercial)
                @if ($commercial->seller)
                    <button type="button">
                        <x-icons.hand-shake></x-icons.hand-shake>
                        @if ($commercial->seller)
                            @if ($commercial->seller->name)
                                <span class="h5">{{ $commercial->seller->name }}</span>
                            @endif

                            @if ($commercial->seller->email)
                                <span class="p">{{ $commercial->seller->email }}</span>
                            @endif

                            @if ($commercial->seller->phone)
                                <span class="p">{{ $commercial->seller->phone }}</span>
                            @endif

                            @if ($commercial->seller->cellphone)
                                <span class="p">{{ $commercial->seller->cellphone }}</span>
                            @endif
                            @if ($commercial->supplier->name)
                                <span class="p">{{ $commercial->supplier->name }}</span>
                            @endif
                        @endif
                    </button>
                @endif
            @endforeach
        </div>
    @endif
</x-layouts.buyer-panel>
