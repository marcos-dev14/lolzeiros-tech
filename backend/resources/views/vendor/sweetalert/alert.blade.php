@if (session()->has('alert.config'))
    @if(config('sweetalert.animation.enable'))
        <link rel="stylesheet" href="{{ config('sweetalert.animatecss') }}">
    @endif

    <script>
        swal.fire({!! session()->pull('alert.config') !!});
    </script>
@endif
