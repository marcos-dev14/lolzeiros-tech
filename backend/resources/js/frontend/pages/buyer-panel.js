$(function () {
    $('.expand-icon').on('click', function () {
        const self = $(this);
        self.find('.rotate-icon').toggleClass('rotate');
        $('.hidden-items').toggle();

        // Invert the SVG icon
        const svgIcon = self.find('svg');
        svgIcon.toggleClass('flipped');
    });

    $('.expand-register-icon').on('click', function () {
        const self = $(this);
        self.find('.rotate-icon').toggleClass('rotate');
        $('.hidden-register-items').toggle();

        // Invert the SVG icon
        const svgIcon = self.find('svg');
        svgIcon.toggleClass('flipped');
    });

    if (isMobile()) {
        $('#page-title').exists(function () {
            $('html, body').animate({
                scrollTop: $(this).offset().top - 90
            }, 1000);
        });
    }
});
