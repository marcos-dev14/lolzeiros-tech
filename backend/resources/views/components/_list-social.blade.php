<ul class="list-inline list-social">
    @if(!empty(config('seo_config.social_facebook')))
        <li>
            <a href="https://facebook.com/profile.php?id=100092109952079" title="Curta nossa página no Facebook" target="_blank">
                <x-icons.facebook-f></x-icons.facebook-f>
            </a>
        </li>
    @endif

    @if(!empty(config('seo_config.social_instagram')))
        <li>
            <a href="{{ config('seo_config.social_instagram') }}" title="Siga a Auge App no Instagram" target="_blank">
                <x-icons.instagram></x-icons.instagram>
            </a>
        </li>
    @endif

    @if(!empty(config('seo_config.social_youtube')))
        <li>
            <a href="{{ config('seo_config.social_youtube') }}" title="Inscreva-se em nosso canal no Youtube" target="_blank">
                <x-icons.youtube></x-icons.youtube>
            </a>
        </li>
    @endif

    @if(!empty(config('seo_config.social_linkedin')))
        <li>
            <a href="{{ config('seo_config.social_linkedin') }}" title="Conheça nossa empresa no Linkedin" target="_blank">
                <x-icons.linkedin></x-icons.linkedin>
            </a>
        </li>
    @endif
</ul>
