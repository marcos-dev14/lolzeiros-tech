@if($product->canBeSold() !== true && !str_contains($product->canBeSold(), 'estoque'))
    <div class="message-line">
        <x-icons.emoji-sad></x-icons.emoji-sad>
        <span>Atualmente, não podemos vender para você os produtos da {{ $product->supplier->name }}</span>
    </div>

    @if(!empty($availableSuppliers))
        <div class="supplier-list">
            <p>
                Apesar disso, temos outras ótimas opções de produtos para
                <strong>{{ $selectedClient?->name ?? 'você' }}</strong> agradar<br> seus clientes.
                <strong>Confira estes Fornecedores:</strong>
            </p>

            <ul>
                @foreach($availableSuppliers as $supplier)
                    <li>
                        <a href="{{ route('products') . "?rp=$supplier->id" }}" title="Veja os produtos da {{ $supplier->name }}">{{ $supplier->name }}</a>
                    </li>
                @endforeach
            </ul>

            @if(!empty($seller))
                <p>
                    Entre em contato com o seu comercial AugeApp para mais informações!<br>
                    {{ $seller->name }} {{ $seller->cellphone }}
                    | <a href="mailto:{{ $seller->email }}" title="Clique para enviar um email">{{ $seller->email }}</a>
                </p>
            @endif
        </div>
    @endif
@else
    <div class="message-line">
        <x-icons.emoji-stupid></x-icons.emoji-stupid>
        <span>Ops, não temos este produto em estoque no momento<br>estamos trabalhando para regularizar isto!</span>
    </div>

    <div class="unavailable-buttons">
{{--        <a href="javascript:void(0);" class="btn-tell_me">--}}
{{--            <x-icons.warning></x-icons.warning>--}}
{{--            <span>Avise-me quando estiver disponível</span>--}}
{{--        </a>--}}

        <a href="#relacionados" class="btn-suggests anchor">
            <x-icons.hand-point-down></x-icons.hand-point-down>
            <span>Veja abaixo outras sugestões de produtos para <b>{{ $selectedClient?->name ?? 'você' }}</b></span>
        </a>
    </div>
@endif
