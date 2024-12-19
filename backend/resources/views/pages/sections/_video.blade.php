<section id="video">
    <div class="container">
        <div class="video-container">
            <h5>Entenda como comprar em 30 segundos</h5>
            <div id="player" data-plyr-provider="youtube" data-plyr-embed-id="Vz8F0vehrKA"></div>
        </div>
    </div>
</section>

@push('scripts')
    <script>
        $(function() {
            new Plyr('#player', {
                controls: [
                    'play-large',
                    'restart',
                    'play',
                    'progress',
                    'current-time',
                    'duration',
                    'mute',
                    'volume',
                    'settings',
                    'pip',
                    'airplay',
                    'fullscreen',
                ],
                ratio: '16:9',
                youtube: {
                    noCookie: true,
                    rel: 0,
                    showRelatedVideos: false,
                    showInfo: 0
                }
            })
        })
    </script>
@endpush
