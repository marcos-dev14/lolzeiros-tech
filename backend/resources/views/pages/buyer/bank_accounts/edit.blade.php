<x-layouts.buyer-panel
    title="Meus Bancos"
    subtitle="As contas bancárias serão utilizadas em casos de pedidos antecipados com depósito em conta ou para eventuais estornos de pagamentos."
    icon="icons.graph"
>
    {!! Form::model($bankAccount, ['route' => ['buyer.bank_accounts.update', $bankAccount], 'method' => 'PUT', 'id' => 'storeForm']) !!}
        @include('pages.buyer.partials._form-bank_account', ['item' => $bankAccount])

        <div class="col-xs-2 col-xs-offset-6">
            <div class="form-group">
                <label>&nbsp;</label>
                <a href="{{ route('buyer.bank_account.list') }}" title="Retornar a página de contas bancárias" class="bt btn-block btn-sm">
                    Voltar
                </a>
            </div>
        </div>

        <div class="col-xs-4">
            <x-form.button form-group label="Salvar Conta Bancária" class="bt btn-block btn-sm"></x-form.button>
        </div>
    {!! Form::close() !!}
</x-layouts.buyer-panel>
