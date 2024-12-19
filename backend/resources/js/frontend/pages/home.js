const bannerSlider = $('#banners').find('.slider');

$(function () {
    makeSlick(bannerSlider, {
        dots: true,
        arrows: true,
        autoplay: true,
        responsive: [
            {
                breakpoint: 767,
                settings: {
                    arrows: false
                }
            }
        ]
    });
});


$(document).ready(function() {
    function openModalCoupon(response) {
        if (response.coupons && response.coupons != 0) {
            let modalBodyContent = `
                <img src="${imageUrl}" alt="Resultado da operação">
                <div class="modal-text">
                    <span>
                        Temos ${response.coupons} cupons disponíveis
                        para você.
                    </span>
                    <p>Aproveite para economizar em seus pedidos.</p>
                </div>
                <button type="button" class="btn button-close" data-dismiss="modal">
                    <img src="${closeModal}" alt=""/>
                </button>
                <a href="${linkCoupons}" class="more-coupons">Ver Cupons</a>
            `;

            let modalBody = document.querySelector('#modal-home .modal-home-center');
            modalBody.innerHTML = modalBodyContent;

            $('#modal-home').modal('show');
        }
    }

    function fetchCouponCount() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                setTimeout(function() {
                    openModalCoupon(response);
                }, 2000); // Delay de 2 segundos
            },
            error: function(xhr, status, error) {}
        });
    }

    fetchCouponCount();
});
