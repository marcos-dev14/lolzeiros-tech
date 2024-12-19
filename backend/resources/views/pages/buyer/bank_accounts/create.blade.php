<x-layouts.buyer-panel title="Meus Bancos" subtitle="As contas bancárias serão utilizadas em casos de pedidos antecipados com depósito em conta ou para eventuais estornos de pagamentos." icon="icons.graph">
    {!! Form::open(['route' => 'buyer.bank_account.store', 'method' => 'POST']) !!}
        @include('pages.buyer.partials._form-bank_account')

            <div class="col-xs-8 col-md-8">
                <x-form.button label="Salvar Colaborador" class="btn btn-block btn-sm button-one"></x-form.button>
            </div>

            <div class="col-xs-4 col-md-4">
                <div class="form-group">
                    <a href="{{ route('buyer.bank_account.list') }}" title="Retornar a página de colaboradores" class="btn btn-block btn-sm button-back">
                        Voltar
                    </a>
                </div>
            </div>

    {!! Form::close() !!}
</x-layouts.buyer-panel>
