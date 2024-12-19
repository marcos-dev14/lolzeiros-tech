@push('styles')
    <link rel="stylesheet" href="{{ mix('css/home.css') }}">
    <link rel="stylesheet" href="{{ mix('css/plugins.css') }}">
@endpush

@push('scripts')
    <script>
        let imageUrl = "{{ asset('images/cupom/active-coupon.svg') }}";
        let closeModal = "{{ asset('images/cupom/icon-close-modal.svg') }}";
        let apiUrl = '{{ route('buyer.cupons') }}?countCoupons=true';
        let linkCoupons = "{{ route('buyer.cupons') }}"
    </script>
    <script src="{{ mix('js/home.js') }}"></script>
@endpush

<x-layouts.base>
    <x-fixed.header></x-fixed.header>

    <div>
        @includeWhen(isset($banner1) || isset($banner2) || isset($banner3) || isset($banner4) || isset($banner5),
            'pages.sections._banners')

        @includeWhen(!empty($suppliers), 'pages.sections._suppliers')

        @includeWhen(!empty($brands), 'pages.sections._brands')

        @include('pages.sections._cta')

        @includeWhen(!empty($blogPosts), 'pages.sections._blog-posts')

        @include('components.modal-home')
    </div>

    <x-fixed.footer></x-fixed.footer>
</x-layouts.base>

