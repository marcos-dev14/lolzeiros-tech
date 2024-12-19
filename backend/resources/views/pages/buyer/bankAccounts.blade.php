<x-layouts.buyer-panel title="Conta Bancária" icon="icons.graph">
    {!! Form::open(['route' => 'buyer.bankAccounts.store_edit', 'method' => 'POST', 'id' => 'storeForm']) !!}
        {!! Form::hidden('bank_account_id', null, ['id' => 'bank_account_id']) !!}

        <div class="col-xs-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="owner_name"
                label="Proprietário da Conta" required autofocus
                data-format="Pascal"
            ></x-form.input>
        </div>

        <div class="col-xs-3">
            <x-form.input
                type="text"
                class="w-bg mask-cpf"
                name="document"
                label="CPF"
            ></x-form.input>
        </div>

        <div class="col-xs-5">
            <x-form.select
                name="bank_id"
                :values="$banks"
                selected="{{ $bankAccount->bank_id ?? old('bank_id') ?? null }}"
                label="Banco"
                required
            ></x-form.select>
        </div>

        <div class="col-xs-3">
            <x-form.input
                type="text"
                class="w-bg"
                name="account_number"
                label="Conta Corrente"
                data-format="number"
            ></x-form.input>
        </div>

        <div class="col-xs-2">
            <x-form.input
                type="text"
                class="w-bg"
                name="agency"
                label="Agência"
                data-format="number"
            ></x-form.input>
        </div>

        <div class="col-xs-2">
            <x-form.input
                type="text"
                class="w-bg"
                name="operation"
                label="Operação"
                data-format="number"
            ></x-form.input>
        </div>

        <div class="col-xs-2">
            <x-form.input
                type="text"
                class="w-bg"
                name="pix_key"
                label="Chave Pix"
            ></x-form.input>
        </div>

        <div class="col-xs-3">
            <x-form.input
                type="text"
                class="w-bg"
                name="paypal"
                label="Paypal"
            ></x-form.input>
        </div>

        <div class="col-xs-5 col-xs-offset-7">
            <x-form.button
                form-group
                label="Adicionar Conta bancária"
                class="bt btn-block btn-sm"
            ></x-form.button>
        </div>
    {!! Form::close() !!}

    @push('content')
        @if(count($client->bankAccounts))
            <div id="boxes-list">
                @foreach($client->bankAccounts as $account)
                    <div class="panel-box">
                        <div class="panel-header">
                            <h2>
                                <x-icons.graph></x-icons.graph>

                                {{ $account->owner_name }}
                            </h2>
                        </div>

                        <div class="panel-body">
                            <br>
                            <p class="p-line"><span>Banco</span> <span>{{ $account->bank?->name }}</span></p>
                            <p class="p-line"><span>CPF</span> <span>{{ $account->document }}</span></p>
                            <p class="p-line"><span>Conta Corrente</span><span> {{ $account->account_number }}</span></p>
                            <p class="p-line"><span>Agência</span> <span>{{ $account->agency }}</span></p>
                            <p class="p-line"><span>Operação</span> <span>{{ $account->operation }}</span></p>
                            <p class="p-line"><span>Chave PIX</span><span> {{ $account->pix_key }}</span></p>
                            <p class="p-line"><span>Paypal</span> <span>{{ $account->paypal }}</span></p>
                            <br>
                        </div>

                        <div class="panel-footer">
                            {!! Form::open(['route' => ['buyer.bankAccounts.show', $account], 'class' => 'editForm']) !!}
                            <x-form.button label="Editar" class="bt btn-block btn-sm"></x-form.button>
                            {!! Form::close() !!}

                            {!! Form::open(['route' => ['buyer.bankAccounts.delete', $account], 'method' => 'DELETE']) !!}
                            <x-form.button label="Apagar" class="bt btn-block btn-sm bt-inverse"></x-form.button>
                            {!! Form::close() !!}
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    @endpush

    @push('scripts-inline')
        <script>
            $(function () {
                const boxesList = $('#boxes-list')
                const storeForm = $('#storeForm')
                const fieldOwnerName = storeForm.find('#owner_name')
                const fieldDocument = storeForm.find('#document')
                const fieldBank = storeForm.find('#bank_id')
                const fieldAccountNumber = storeForm.find('#account_number')
                const fieldAgency = storeForm.find('#agency')
                const fieldOperation = storeForm.find('#operation')
                const fieldPixKey = storeForm.find('#pix_key')
                const fieldPaypal = storeForm.find('#paypal')
                const fieldBankAccountId = storeForm.find('#bank_account_id')

                $('.editForm').on('submit', function (e) {
                    e.preventDefault()
                    let form = $(this)
                    let action = form.prop('action')
                    let box  = form.closest('.panel-box')

                    boxesList.find('.panel-box').removeClass('editing')
                    box.addClass('editing')

                    $.get(action, function (data) {
                        fieldBankAccountId.val(data.id)
                        fieldOwnerName.val(data?.owner_name)
                        fieldDocument.val(data?.document)
                        fieldBank.val(data?.bank_id).trigger('change')
                        fieldAccountNumber.val(data?.account_number)
                        fieldAgency.val(data?.agency)
                        fieldOperation.val(data?.operation)
                        fieldPixKey.val(data?.pix_key)
                        fieldPaypal.val(data?.paypal)
                    })
                })
            })
        </script>
    @endpush
</x-layouts.buyer-panel>
