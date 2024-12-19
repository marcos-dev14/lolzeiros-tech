@push('styles')
    <link rel="stylesheet" href="{{ mix('css/products.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script src="{{ mix('js/products.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    @include('pages.sections._products')

    @include('pages.sections._cta')

    <x-fixed.footer></x-fixed.footer>
</x-layouts.base>
