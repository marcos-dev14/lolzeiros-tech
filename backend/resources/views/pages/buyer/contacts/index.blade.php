<x-layouts.buyer-panel
    title="Minha equipe"
    subtitle="Cadastre pessoas importantes do time da <strong>{{ $client->name }}</strong> no dia-a-dia comercial com a equipe AugeApp."
    icon="icons.users"
>
    <div class="boxes-list">
        @foreach($client->contacts as $contact)
            <div class="box-item">
                <x-icons.contact-book></x-icons.contact-book>

                <span class="h5">
                    {{ $contact->name }}
                </span>

                @if($contact->role)
                    <span class="p">{{ $contact->role->name }}</span>
                @endif

                @if($contact->cellphone)
                    <span class="p">{{ $contact->cellphone }} Celular</span>
                @endif

                @if($contact->whatsapp)
                    <span class="p">{{ $contact->whatsapp }} Whatsapp</span>
                @endif

                @if($contact->phone)
                    <span class="p">
                        {{ $contact->phone }}
                        @if($contact->phone_branch)
                            Ramal {{ $contact->phone_branch }}
                        @endif
                    </span>
                @endif

                @if($contact->email)
                    <span class="p">{{ $contact->email }}</span>
                @endif

                <div class="box-footer">
                    <a href="{{ route('buyer.contact.edit', $contact) }}" class="bt btn-block btn-sm">Editar</a>

                    {!! Form::open(['route' => ['buyer.contact.destroy', $contact], 'method' => 'DELETE']) !!}
                        <x-form.button label="Apagar" class="bt btn-block btn-sm bt-inverse"></x-form.button>
                    {!! Form::close() !!}
                </div>
            </div>
        @endforeach

        <a href="{{ route('buyer.contact.create') }}" id="add-more" title="Adicionar novo">
            <x-icons.plus></x-icons.plus>
        </a>
    </div>
</x-layouts.buyer-panel>
