<x-layouts.buyer-panel title="Contatos" icon="icons.users">
    {!! Form::open(['route' => 'buyer.contacts.store_edit', 'method' => 'POST', 'id' => 'storeForm']) !!}
        {!! Form::hidden('contact_id', null, ['id' => 'contact_id']) !!}

        <div class="col-xs-4">
            <x-form.input
                type="text"
                class="w-bg"
                name="name"
                label="Seu nome"
                required
                autofocus
            ></x-form.input>
        </div>

        <div class="col-xs-4">
            <x-form.select
                name="role_id"
                :values="$roles"
                selected="{{ $contact->role_id ?? old('role_id') ?? null }}"
                label="Cargo na empresa"
                required
            ></x-form.select>
        </div>

        <div class="col-xs-4">
            <x-form.input
                type="text"
                class="w-bg mask-cellphone"
                name="cellphone"
                label="Celular"
            ></x-form.input>
        </div>

        <div class="col-xs-3">
            <x-form.input
                type="text"
                class="w-bg mask-phone"
                name="phone"
                label="Telefone Fixo"
            ></x-form.input>
        </div>

        <div class="col-xs-1">
            <x-form.input
                type="text"
                class="w-bg"
                name="phone_branch"
                label="Ramal"
            ></x-form.input>
        </div>

        <div class="col-xs-4 col-xs-offset-4">
            <x-form.input
                type="text"
                class="w-bg mask-cellphone"
                name="whatsapp"
                label="Whatsapp"
            ></x-form.input>
        </div>

        <div class="col-xs-5">
            <x-form.input
                type="email"
                class="w-bg"
                name="email"
                label="Email Corporativo"
                required
                onkeyup="this.value = this.value.toLowerCase();"
            ></x-form.input>
        </div>

        <div class="col-xs-5 col-xs-offset-2">
            <x-form.button
                form-group
                label="Adicionar Contato"
                class="bt btn-block btn-sm"
            ></x-form.button>
        </div>
    {!! Form::close() !!}

    @push('content')
        @if(count($client->contacts))
            <div id="boxes-list">
                @foreach($client->contacts as $contact)
                    <div class="panel-box">
                        <div class="panel-header">
                            <h2>
                                <x-icons.users></x-icons.users>

                                {{ $contact->name }}
                            </h2>
                        </div>

                        <div class="panel-body">
                            <p>
                                @if($contact->role)
                                    {!! "{$contact->role->name}<br>" !!}
                                @endif

                                @if($contact->cellphone)
                                    {{ "$contact->cellphone | " }}
                                @endif

                                @if($contact->phone)
                                    {{ "$contact->phone " }}
                                @endif

                                @if($contact->phone_branch)
                                    {!! "($contact->phone_branch)<br>" !!}
                                @endif

                                @if($contact->email)
                                    {{ $contact->email }}
                                @endif
                            </p>
                        </div>

                        <div class="panel-footer">
                            {!! Form::open(['route' => ['buyer.contacts.show', $contact], 'class' => 'editForm']) !!}
                                <x-form.button label="Editar" class="bt btn-block btn-sm"></x-form.button>
                            {!! Form::close() !!}

                            {!! Form::open(['route' => ['buyer.contacts.delete', $contact], 'method' => 'DELETE']) !!}
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
                const fieldName = storeForm.find('#name')
                const fieldRole = storeForm.find('#role_id')
                const fieldCellphone = storeForm.find('#cellphone')
                const fieldPhone = storeForm.find('#phone')
                const fieldPhoneBranch = storeForm.find('#phone_branch')
                const fieldWhatsapp = storeForm.find('#whatsapp')
                const fieldEmail = storeForm.find('#email')
                const fieldContactId = storeForm.find('#contact_id')

                $('.editForm').on('submit', function (e) {
                    e.preventDefault()
                    let form = $(this)
                    let action = form.prop('action')
                    let box  = form.closest('.panel-box')

                    boxesList.find('.panel-box').removeClass('editing')
                    box.addClass('editing')

                    $.get(action, function (data) {
                        fieldContactId.val(data.id)
                        fieldName.val(data?.name)
                        fieldRole.val(data?.role_id).trigger('change')
                        fieldCellphone.val(data?.cellphone)
                        fieldPhone.val(data?.phone)
                        fieldPhoneBranch.val(data?.phone_branch)
                        fieldWhatsapp.val(data?.whatsapp)
                        fieldEmail.val(data?.email)
                    })
                })
            })
        </script>
    @endpush
</x-layouts.buyer-panel>
