<x-layouts.buyer-panel
    title="Meus Bancos"
    subtitle="As contas bancárias serão utilizadas em casos de pedidos antecipados com depósito em conta ou para eventuais estornos de pagamentos."
    icon="icons.graph"
>
    <div class="boxes-list">
        @foreach($client->bankAccounts as $account)
            <div class="box-item">
                <x-icons.bank></x-icons.bank>

                <span class="h5">
                    {{ $account->owner_name }}
                </span>

                <span class="p justify-between">Banco <span class="text-right">{{ $account->bank?->name }}</span></span>
                <span class="p justify-between">CNPJ / CPF <span class="text-right">{{ $account->document }}</span></span>
                <span class="p justify-between">Conta Corrente <span class="text-right">{{ $account->account_number }}</span></span>
                <span class="p justify-between">Agência <span class="text-right">{{ $account->agency }}</span></span>
                <span class="p justify-between">Operação <span class="text-right">{{ $account->operation }}</span></span>
                <span class="p justify-between">Chave PIX <span class="text-right">{{ $account->pix_key }}</span></span>
                <span class="p justify-between">Paypal <span class="text-right">{{ $account->paypal }}</span></span>

                <div class="box-footer">
                    <a href="{{ route('buyer.bank_account.edit', $account) }}" class="bt btn-block btn-sm">Editar</a>

                    {!! Form::open(['route' => ['buyer.bank_account.destroy', $account], 'method' => 'DELETE']) !!}
                        <x-form.button label="Apagar" class="bt btn-block btn-sm bt-inverse"></x-form.button>
                    {!! Form::close() !!}
                </div>
            </div>
        @endforeach

        <a href="{{ route('buyer.bank_account.create') }}" id="add-more" title="Adicionar novo">
            <x-icons.plus></x-icons.plus>
        </a>
    </div>
</x-layouts.buyer-panel>
