<section id="banners">
    <div class="container">
        @if($isMobile)
            <!-- Banners para dispositivos móveis -->
            @if(count($banner1->mobileImages))
                <div class="slider">
                    @foreach($banner1->mobileImages as $image)
                        <div>
                            <a href="{{ $image->link ?? 'javascript:void(0);' }}">
                                <img src="{{ $image->image }}" alt="{{ $image->label }}">
                            </a>
                        </div>
                    @endforeach
                </div>
            @endif

            <div class="list-banners">
                <!-- Banners adicionais para dispositivos móveis -->
                @if(count($banner2->mobileImages))
                    <div class="item-banner">
                        <a href="{{ $banner2->mobileImages->first()?->link ?? 'javascript:void(0);' }}">
                            <figure>
                                <img
                                    src="{{ $banner2->mobileImages->first()?->image }}"
                                    alt="{{ $banner2->mobileImages->first()?->label }}"
                                >
                            </figure>
                        </a>
                    </div>
                @endif

                @if(count($banner3->mobileImages))
                    <div class="item-banner">
                        <a href="{{ $banner3->mobileImages->first()?->link ?? 'javascript:void(0);' }}">
                            <figure>
                                <img
                                    src="{{ $banner3->mobileImages->first()?->image }}"
                                    alt="{{ $banner3->mobileImages->first()?->label }}"
                                >
                            </figure>
                        </a>
                    </div>
                @endif

                @if(count($banner4->mobileImages))
                    <div class="item-banner">
                        <a href="{{ $banner4->mobileImages->first()?->link ?? 'javascript:void(0);' }}">
                            <figure>
                                <img
                                    src="{{ $banner4->mobileImages->first()?->image }}"
                                    alt="{{ $banner4->mobileImages->first()?->label }}"
                                >
                            </figure>
                        </a>
                    </div>
                @endif

                @if(count($banner5->mobileImages))
                    <div class="item-banner">
                        <a href="{{ $banner5->mobileImages->first()?->link ?? 'javascript:void(0);' }}">
                            <figure>
                                <img
                                    src="{{ $banner5->mobileImages->first()?->image }}"
                                    alt="{{ $banner5->mobileImages->first()?->label }}"
                                >
                            </figure>
                        </a>
                    </div>
                @endif
            </div>
        @else
            <!-- Banners para dispositivos desktop -->
            @if(count($banner1->desktopImages))
                <div class="slider">
                    @foreach($banner1->desktopImages as $image)
                        <div>
                            <a href="{{ $image->link ?? 'javascript:void(0);' }}">
                                <img src="{{ $image->image }}" alt="{{ $image->label }}">
                            </a>
                        </div>
                    @endforeach
                </div>
            @endif

            <div class="list-banners">
                <!-- Banners adicionais para dispositivos desktop -->
                @if(count($banner2->desktopImages))
                    <div class="item-banner">
                        <a href="{{ $banner2->desktopImages->first()?->link ?? 'javascript:void(0);' }}">
                            <figure>
                                <img
                                    src="{{ $banner2->desktopImages->first()?->image }}"
                                    alt="{{ $banner2->desktopImages->first()?->label }}"
                                >
                            </figure>
                        </a>
                    </div>
                @endif

                @if(count($banner3->desktopImages))
                    <div class="item-banner">
                        <a href="{{ $banner3->desktopImages->first()?->link ?? 'javascript:void(0);' }}">
                            <figure>
                                <img
                                    src="{{ $banner3->desktopImages->first()?->image }}"
                                    alt="{{ $banner3->desktopImages->first()?->label }}"
                                >
                            </figure>
                        </a>
                    </div>
                @endif

                @if(count($banner4->desktopImages))
                    <div class="item-banner">
                        <a href="{{ $banner4->desktopImages->first()?->link ?? 'javascript:void(0);' }}">
                            <figure>
                                <img
                                    src="{{ $banner4->desktopImages->first()?->image }}"
                                    alt="{{ $banner4->desktopImages->first()?->label }}"
                                >
                            </figure>
                        </a>
                    </div>
                @endif

                @if(count($banner5->desktopImages))
                    <div class="item-banner">
                        <a href="{{ $banner5->desktopImages->first()?->link ?? 'javascript:void(0);' }}">
                            <figure>
                                <img
                                    src="{{ $banner5->desktopImages->first()?->image }}"
                                    alt="{{ $banner5->desktopImages->first()?->label }}"
                                >
                            </figure>
                        </a>
                    </div>
                @endif
            </div>
        @endif
    </div>
</section>
