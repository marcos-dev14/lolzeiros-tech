@push('styles')
    <style>
        .pagination {
            display: flex;
            list-style: none;
            padding: 0;
            margin: 1rem 0 0;
            justify-content: flex-end;
        }

        .pagination .page-link,
        .pagination .page-link:visited,
        .pagination .page-link:active {
            display: block;
            padding: 8px 12px;
            border: 1px solid #ddd;
            /* Borda fina cinzenta */
            text-decoration: none;
            color: #333;
            /* Cor do texto */
            background-color: #fff;
            /* Fundo branco para os botões inactivos */
            transition: background-color 0.2s, color 0.2s;
        }

        .pagination .page-item:last-child .page-link {
            border-top-right-radius: 0.25rem;
            border-bottom-right-radius: 0.25rem;
        }

        .pagination .page-item:first-child .page-link {
            border-top-left-radius: 0.25rem;
            border-bottom-left-radius: 0.25rem;
        }

        .pagination .page-link:hover {
            background-color: #f0f0f0;
            /* Leve destaque ao passar o rato */
            color: #000;
        }

        .pagination .page-item.active .page-link {
            background-color: #007bff;
            /* Cor de fundo para o item activo */
            color: #fff;
            /* Texto branco para destaque */
            border-color: #007bff;
        }

        .pagination .page-item.disabled .page-link {
            color: #aaa;
            /* Texto mais claro */
            background-color: #f8f8f8;
            border-color: #ddd;
            cursor: not-allowed;
        }
    </style>
@endpush

@if ($paginator->hasPages())
    <ul class="pagination">
        {{-- Botão "First" --}}
        @if ($paginator->onFirstPage())
            <li class="page-item disabled"><span class="page-link">Primeira</span></li>
        @else
            <li class="page-item"><a href="{{ $paginator->url(1) }}" class="page-link">Primeira</a></li>
        @endif

        {{-- Botão "Previous" --}}
        @if ($paginator->onFirstPage())
            <li class="page-item disabled"><span class="page-link">←</span></li>
        @else
            <li class="page-item"><a href="{{ $paginator->previousPageUrl() }}" class="page-link">←</a></li>
        @endif

        {{-- Páginas --}}
        @foreach ($elements as $element)
            @if (is_string($element))
                <li class="page-item disabled"><span class="page-link">{{ $element }}</span></li>
            @elseif (is_array($element))
                @foreach ($element as $page => $url)
                    @if ($page == $paginator->currentPage())
                        <li class="page-item active"><span class="page-link">{{ $page }}</span></li>
                    @else
                        <li class="page-item"><a href="{{ $url }}" class="page-link">{{ $page }}</a>
                        </li>
                    @endif
                @endforeach
            @endif
        @endforeach

        {{-- Botão "Next" --}}
        @if ($paginator->hasMorePages())
            <li class="page-item"><a href="{{ $paginator->nextPageUrl() }}" class="page-link">→</a></li>
        @else
            <li class="page-item disabled"><span class="page-link">→</span></li>
        @endif

        {{-- Botão "Last" --}}
        @if ($paginator->hasMorePages())
            <li class="page-item"><a href="{{ $paginator->url($paginator->lastPage()) }}" class="page-link">Última</a>
            </li>
        @else
            <li class="page-item disabled"><span class="page-link">Última</span></li>
        @endif

    </ul>
@endif
