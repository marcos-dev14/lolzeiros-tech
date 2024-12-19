// "use strict"

///////////////////////////////////////////

///////////////////////////////////////////

// Alterar quantidade
/*const qtySelector_Box = $('.product-card .qty-selector, .cart-qty-selector');
const qtySelector_Box_Input = $('.product-card .qty-selector').find('input');

$(qtySelector_Box).find('a').on('click', function () {
    let self = $(this);
    let input = self.siblings('input');
    let operator = $(this).data('operator');
    let minQty = parseInt(input.data('min'));
    let currentQty = parseInt(input.val());

    let resultOperation = eval(`${currentQty} ${operator} ${minQty}`);

    if (resultOperation > 0) {
        input.val(
            eval(`${currentQty} ${operator} ${minQty}`)
        ).trigger('change');
    }
});

qtySelector_Box_Input.on('change', function () {
    let self = $(this);
    let topContainer = self.closest('.qty-selector');
    let classContainer = topContainer.data('container');
    let container = $(self.closest(classContainer));
    let loaderId = container.find("div[data-toggle='loader']").prop('id');

    showLoader('Buscando promoções, aguarde...', loaderId);

    let currentQty = parseInt(self.val());

    let priceRoute = topContainer.data('price-route');
    priceRoute = priceRoute.replace('qty', currentQty);
    $.get(priceRoute, function ({ unit_price, original_price }) {
        let newTotalValue = (currentQty * unit_price).toFixed(2).replace('.', ',');
        container.find("[data-selector='total-price']").find('span').html(newTotalValue);
        container.find("[data-selector='addToCart']").data('qty', currentQty);

        let unitPriceContainer = container.find("[data-selector='unit-price']");
        unitPriceContainer.find('span').text(
            parseFloat(unit_price)
                .toFixed(2)
                .replace('.', ',')
        );

        if (unit_price !== original_price) {
            original_price = parseFloat(original_price)
                .toFixed(2)
                .replace('.', ',');

            unitPriceContainer.find('small').html(`<s>R$ ${original_price}</s> por R$`);
        } else {
            unitPriceContainer.find('small').html('R$ ');
        }

        hideLoader(loaderId);
    });
});*/

/*$('.product-card, #product-details').find("[data-selector='addToCart']").on('click', function () {
    let self = $(this);
    let container = self.closest(self.data('container'));
    let isInCart = parseInt(container.data('is-in-cart'));

    let loaderId = container.find("div[data-toggle='loader']").prop('id');
    showLoader('Por favor, aguarde...', loaderId);

    let data = {
        product: self.data('product'),
        qty: self.data('qty'),
        instance: self.data('cart-instance')
    };

    if (isInCart === 0) {
        $.post(self.data('url'), data, function ({
            redirect_url,
            update_url,
            remove_url,
            //current_quantity,
            instance,
            message
        }) {
            if (redirect_url !== undefined) {
                window.location.href = redirect_url;
                return;
            }

            //container.find("figure span").text(current_quantity).removeClass('hide')
            container.data('is-in-cart', '1');
            self.data('url', update_url)
                .data('cart-instance', instance)
                .find('span').text('Atualizar Cesto');

            let formRemove = container.find('form.form-remove');
            formRemove.prop('action', remove_url).removeClass('hide');

            hideLoader(loaderId);

            //swal.fire({
            //    icon: 'success',
            //    title: message,
            //    confirmButtonText: 'Confirmar',
            //    confirmButtonColor: '#39c6b5',
            //});
        })
    } else {
        $.ajax({
            url: self.data('url'),
            data: data,
            type: 'PUT',
            success: function ({ current_quantity, message }) {
                //container.find("figure span").text(current_quantity);

                hideLoader(loaderId);

                //swal.fire({
                //    icon: 'success',
                //    title: message,
                //    confirmButtonText: 'Confirmar',
                //    confirmButtonColor: '#39c6b5',
                //});
            }
        });
    }
});*/
