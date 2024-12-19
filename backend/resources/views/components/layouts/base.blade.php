<!DOCTYPE html>
<!--suppress HtmlRequiredTitleElement -->
<html lang="{{ config('app.locale', 'pt-BR') }}">

@php
    $themeName = config('seo_config.theme') ?? '';

    $faviconName = config('seo_config.favicon');
    $faviconPath = !empty($faviconName) && File::exists(public_path("storage/favicon/$faviconName"))
        ? asset("storage/favicon/$faviconName")
        : asset('images/favicon.svg');
@endphp

<head>
    {!! SEO::generate() !!}

    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no" />

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta http-equiv="Content-Security-Policy" content="script-src * 'self' 'unsafe-inline' 'unsafe-eval';">

    <link rel="shortcut icon" href="{{ $faviconPath }}">

    @stack('styles')

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap" rel="stylesheet">
    <!-- Clarity -->
    <script type="text/javascript">
        (function(c, l, a, r, i, t, y) {
            c[a] = c[a] || function() {
                (c[a].q = c[a].q || []).push(arguments)
            };
            t = l.createElement(r);
            t.async = 1;
            t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, "clarity", "script", "i9kpakpu7g");
    </script>
    <!-- End Clarity -->
    <!-- Google Tag Manager -->
    <script>
        (function(w, d, s, l, i) {
            w[l] = w[l] || [];
            w[l].push({
                'gtm.start': new Date().getTime(),
                event: 'gtm.js'
            });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-ND44PBFX');
    </script>
    <!-- End Google Tag Manager -->

    <!-- Meta Pixel Code -->
    <script>
        ! function(f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function() {
                n.callMethod ?
                    n.callMethod.apply(n, arguments) : n.queue.push(arguments)
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s)
        }(window, document, 'script',
            'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '647199770668627');
        fbq('track', 'PageView');
    </script>
    <noscript>
        <img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=647199770668627&ev=PageView&noscript=1" />
    </noscript>
    <!-- End Meta Pixel Code -->

    @if(!empty($themeName) && File::exists(public_path("themes/js/$themeName.js")))
        <script src="{{ mix("themes/js/$themeName.js") }}"></script>
    @endif
</head>
<body
    style="
        @if(!empty(config('seo_config.color_primary'))) --customColorPrimary: {{ config('seo_config.color_primary') }}; @endif
        @if(!empty(config('seo_config.color_highlight'))) --customColorHighlight: {{ config('seo_config.color_highlight') }}; @endif
        @if(!empty(config('seo_config.color_highlight2'))) --customColorHighlight2: {{ config('seo_config.color_highlight2') }}; @endif
        @if(!empty(config('seo_config.color_highlight3'))) --customColorHighlight3: {{ config('seo_config.color_highlight3') }}; @endif
    "
    @if(!empty($themeName)) class="{{ $themeName }}" @endif
>
    <!-- Google Tag Manager (noscript) -->
        <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-ND44PBFX"
                height="0" width="0" style="display:none;visibility:hidden">
            </iframe>
        </noscript>
    <!-- End Google Tag Manager (noscript) -->
    
    <main>
        @if(
            !empty($themeName)
            && File::exists(resource_path("themes/$themeName/$themeName.blade.php"))
        )
            @include("themes.$themeName.$themeName")
        @endif

        {{ $slot }}

        @include('components.fixed.tab-bar')

        @include('components.modal-search', ['id' => 'modal-product'])
    </main>

    <script src="{{ mix('js/dependencies.js') }}"></script>

    @stack('scripts')
    @stack('scripts-inline')

    @include('sweetalert::alert')
    
    <script type="text/javascript" async src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/73295c67-27a0-43b0-97de-91401f25ff0d-loader.js" ></script>
</body>
</html>
