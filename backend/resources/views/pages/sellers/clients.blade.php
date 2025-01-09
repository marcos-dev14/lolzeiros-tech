@push('styles')
    <link rel="stylesheet" href="{{ mix('css/clients-seller.css') }}">
@endpush

<x-layouts.seller-panel title="Clientes"
    subtitle="Olá <strong>{{ $seller->name ?? 'Wesley Bananas' }}</strong>, aqui estão todos os seus clientes junto à AugeApp."
    icon="icons.users">
    <table id="clients-table" class="table">
        <thead>
            <tr>
                <th>RAZÃO SOCIAL</th>
                <th>CNPJ</th>
                <th>GRUPO</th>
                <th>ESTADO</th>
                <th>CADASTRO</th>
                <th>ÚLTIMO LOGIN</th>
                <th>CARRINHO ABANDONADO</th>
                <th>STATUS</th>
                <th>AÇÃO</th>
            </tr>
        </thead>
        <tbody>
            @dd($clients)
            @if ($clients->count())
                @foreach ($clients as $client)
                    <tr>
                        <td>{{ $client->name }}</td>
                        <td>{{ $client->document }}</td>
                        <td>{{ $client->group }}</td>
                        <td>{{ $client->state ?? 'N/A' }}</td>
                        <td>
                            <div class="formatted-input">
                                <div class="formatted-input-icon">
                                    <x-icons.calendar></x-icons.calendar>
                                </div>

                                <input type="text" id="date" disabled value="{{ $client->register }}">
                            </div>
                        </td>
                        <td>
                            <div class="formatted-input">
                                <div class="formatted-input-icon">
                                    <x-icons.calendar></x-icons.calendar>
                                </div>

                                <input type="text" id="date" disabled value="{{ $client->lastLogin }}">
                            </div>
                        </td>
                        <td>
                            <div class="formatted-input">
                                <div class="formatted-input-icon">
                                    <x-icons.calendar></x-icons.calendar>
                                </div>

                                <input type="text" id="date" disabled value="{{ $client->cartAbandoned }}">
                            </div>
                        </td>
                        <td>{{ $client->status }}</td>
                        <td>
                            <div class="action-buttons">
                                <button class="collapse">
                                    <x-icons.collapse></x-icons.collapse>
                                </button>

                                <button class="contacts">
                                    <x-icons.contatos></x-icons.contatos>
                                </button>

                                <button class="heart">
                                    <x-icons.order-heart></x-icons.order-heart>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr class="collapsable-row" style="display: none;">
                        <td colspan="9" style= "width: 100%;background-color: #F4F5F8; padding: 1.25rem 0.625rem 0.625rem 0.75rem; box-sizing: border-box;">
                            <div style="display: flex;flex-direction: column;width: 100%;height: 100%;">
                                <div class="profile-client">
                                    <span>Perfil do cliente:</span> {p.profile.name}
                                </div>
                            </div>
                        </td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="6" class="text-center">Nenhum cliente encontrado.</td>
                </tr>
            @endif
        </tbody>
    </table>

    <div class="d-flex justify-content-center">
        {{ $clients->links() }}
    </div>
</x-layouts.seller-panel>

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const collapseButton = document.querySelectorAll('.collapse');


            collapseButton.addEventListener('click', () => {
                const row = button.closest('tr');
                const nextRow = row.nextElementSibling;
                nextRow.style.display = nextRow.style.display === 'none' ? 'table-row' : 'none';
            });

        });
    </script>
@endpush

