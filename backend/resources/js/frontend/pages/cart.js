function updateProgressBar(mainContainer, minOrderRemaining, minOrderRemainingPercentage) {
    const progressBar = mainContainer.find('.progress-bar');
    const minOrderValue = progressBar.data('min-value');

    progressBar.prop('aria-valuenow', minOrderRemainingPercentage).css({ "width": `${minOrderRemainingPercentage}%` });

    if (minOrderRemainingPercentage >= 100) {
        progressBar.addClass('completed');
        mainContainer.find('p').html('<p>Seu pedido já pode ser finalizado! Clique em continuar comprando para incluir mais produtos ou em continuar para escolher forma de pagamento e liberar o seu pedido.</p>');
    } else {
        progressBar.removeClass('completed');
        mainContainer.find('p').html(`<p>Precisamos que complete mais <span data-selector="min-value-remaining">R$ ${minOrderRemaining}</span> para atingir o pedido mínimo de <b>R$ ${minOrderValue}</b>. Clique em continuar comprando para incluir mais produtos em seu carrinho!</p>`);
    }
}

$(function () {
    $('.btn-open').on('click', handleBtnOpenClick);

    const formRemove = $('.form-remove')
    formRemove.on('submit', function (e) {
        e.preventDefault();

        const form = $(this);
        const removeRoute = form.prop('action');
        const upperContainer = form.closest('.cart-supplier-item');

        const mainContainer = upperContainer.find('.main');

        removeProductFromCart(
            upperContainer,
            removeRoute,
            function (itemContainer, elements) {
                const {
                    instanceCountItems,
                    instanceCountProducts,
                    instanceSubtotal,
                    instanceSubtotalWithIpi,
                    instanceIpiValue,
                    instanceDiscount,
                    minOrderRemaining,
                    minOrderRemainingPercentage
                } = elements;

                if (instanceCountItems === 0) {
                    upperContainer.remove();
                } else {
                    upperContainer.find("[data-selector='label-header-qty']").text(instanceCountProducts);
                    upperContainer.find("[data-selector='label-header-qty-items']").text(instanceCountItems);
                    upperContainer.find("[data-selector='label-header-total']").text(`R$ ${instanceSubtotal}`);
                    upperContainer.find("[data-selector='label-header-total-with-ipi']").text(`R$ ${instanceSubtotalWithIpi}`);
                    upperContainer.find("[data-selector='label-header-ipi-value']").text(`R$ ${instanceIpiValue}`);
                    upperContainer.find("[data-selector='label-header-total-economy']").text(`Economia R$ ${instanceDiscount}`);

                    const buttonContinue = upperContainer.find("[data-selector='button-continue']");

                    form.closest('.product-list').remove();

                    updateProgressBar(mainContainer, minOrderRemaining, minOrderRemainingPercentage);

                    if (minOrderRemainingPercentage >= 100) {
                        enableLink(buttonContinue, 'Revise e finalize o seu pedido');
                    } else {
                        disableLink(buttonContinue, 'Complete o pedido mínimo para continuar');
                    }
                }
            }
        );
    });

    $('.product-list input').on('change', function () {
        const input = $(this);
        const selectorContainer = input.closest('.qty-selector');
        const upperContainer = input.closest('.cart-supplier-item');
        const mainContainer = upperContainer.find('.main');

        const itemContainer = input.closest('.product-list');
        const loaderId = itemContainer.find("div[data-toggle='loader']").prop('id');
        const instance = input.data('instance');
        const product = input.data('item');
        let currentQty = parseInt(input.val());
        const url = selectorContainer.data('update-route');
        let multiple = Math.ceil(currentQty / input.data('min'));

        currentQty = multiple * input.data('min');

        showLoader('Atualizando carrinho, aguarde', loaderId);

        $.ajax({
            url: url,
            type: 'PUT',
            data: { qty: currentQty, product, instance },
            success: function (responseData) {
                const {
                    currentQuantity,
                    discountedPrice,
                    ipi,
                    discountedPriceWithIpi,
                    subtotalWithIpi,
                    discount,
                    instanceCountItems,
                    instanceCountProducts,
                    instanceSubtotal,
                    instanceSubtotalWithIpi,
                    instanceIpiValue,
                    instanceDiscount,
                    minOrderRemaining,
                    minOrderRemainingPercentage
                } = responseData;

                input.val(`${currentQuantity} un`);

                itemContainer.find("[data-selector='label-quantity']").text(currentQuantity);
                itemContainer.find("[data-selector='label-unit-price']").text(`R$ ${discountedPrice}`);
                itemContainer.find("[data-selector='label-ipi']").text(`${ipi}%`);
                itemContainer.find("[data-selector='label-unit-price-with-ipi']").text(`R$ ${discountedPriceWithIpi}`);
                itemContainer.find("[data-selector='label-total-price-with-ipi'] strong").text(`R$ ${subtotalWithIpi}`);
                itemContainer.find("[data-selector='label-discount']").text(`Economia R$ ${discount}`);

                upperContainer.find("[data-selector='label-header-qty']").text(instanceCountProducts);
                upperContainer.find("[data-selector='label-header-qty-items']").text(instanceCountItems);
                upperContainer.find("[data-selector='label-header-total']").text(`R$ ${instanceSubtotal}`);
                upperContainer.find("[data-selector='label-header-total-with-ipi']").text(`R$ ${instanceSubtotalWithIpi}`);
                upperContainer.find("[data-selector='label-header-ipi-value']").text(`R$ ${instanceIpiValue}`);
                upperContainer.find("[data-selector='label-header-total-economy']").text(`Economia R$ ${instanceDiscount}`);

                const buttonContinue = upperContainer.find("[data-selector='button-continue']");

                updateProgressBar(mainContainer, minOrderRemaining, minOrderRemainingPercentage);

                if (minOrderRemainingPercentage >= 100) {
                    enableLink(buttonContinue, 'Revise e finalize o seu pedido');
                } else {
                    disableLink(buttonContinue, 'Complete o pedido mínimo para continuar');
                }

                updateCartBoxComponent();
                hideLoader(loaderId);
            }
        });
    });

    $('.custom-select').exists(function () {
        const select = $(this);
        const selectHeader = select.find('.select-header');
        const optionsContainer = select.find('.options');

        selectHeader.click(function () {
            optionsContainer.toggleClass('open', !optionsContainer.hasClass('open'));
        });

        optionsContainer.find('.option').on('click', function (e) {
            const selectedOption = $(this);

            if (selectedOption.hasClass('locked')) {
                return false;
            }

            // Altera o campo oculto "installment_rule_id"
            $("input[name='installment_rule_id']").val(selectedOption.data('id'));

            // Altera o texto do select fechado
            $('.custom-select').find('.selected-option').text(selectedOption.data('text'));

            // Altera o texto no header do carrinho em "Prazo de Pagamento"
            $("[data-selector='label-installments']").text(selectedOption.data('days'));

            // Atualiza o valor total no header
            //const labelTotal = $("[data-selector='label-header-total-with-ipi']");

            const labelTotalWithIpi = $("[data-selector='label-header-total-with-ipi']");
            const labelTotal = $("[data-selector='label-header-total']");
            const labelIpi = $("[data-selector='label-header-ipi-value']");
            const labelIpiPorcent = $("[data-selector='label-header-ipi']");
            const ipiValue = labelIpi.data('value');
            const ipiPorcent = labelIpiPorcent.data('value');
            const initialTotalValue = labelTotal.data('value');
            const initialTotalValueWithIpi = labelTotalWithIpi.data('value');
            const selectedOptionVariation = $.trim(selectedOption.data('variator'));
            const selectedOptionValue = selectedOption.data('value');
            const calculatedValue = (initialTotalValue * (selectedOptionValue / 100));
            const operator = selectedOptionVariation === 'discount' ? '-' : '+';
            const percentageDifference = ((initialTotalValueWithIpi - initialTotalValue) / initialTotalValue) * 100;
            const newTotalValue = eval(`${initialTotalValue} ${operator} ${calculatedValue}`);
            const newIpiValue = (percentageDifference / 100) * newTotalValue;
            const newTotalValueWithipi = eval(`${initialTotalValue} ${operator} ${calculatedValue} + ${newIpiValue}`);

            const paymentCondition = $("[data-selector='label-payment-condition']");
            if (
                selectedOptionVariation === 'discount'
                || (selectedOptionVariation === 'none')
            ) {

                const formatValue = calculatedValue.toLocaleString("pt-BR", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })

                paymentCondition.text(`R$` + formatValue + ` em condições PG`);

                $('#payment-condition').attr('data-value', formatValue);
                $('#payment-condition').removeClass('hide');
            }


            labelTotalWithIpi.text(newTotalValueWithipi.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));

            labelIpi.text(newIpiValue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));

            labelTotal.text(newTotalValue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }));

            const labelTotalWithIpiDataset = $('[data-selector="label-header-total-with-ipi"]');
            labelTotalWithIpiDataset.data('discValue', newTotalValueWithipi);

            const labelTotalDataset = $('[data-selector="label-header-total"]');
            labelTotalDataset.data('discValue', newTotalValue);

            console.log(labelTotalWithIpiDataset.data());


            //   const labelIpiDataset = $('[data-selector="label-header-ipi-value"]');
            //   labelIpiDataset.data('valuex', newIpiValue);



            /// CALCULO DE PRODUTOS VIA CONDIÇÃO DE PAGAMENTO ///
            const labelsTotalPriceWithIpi = document.querySelectorAll('[data-selector="label-total-price-with-ipi"]');
            labelsTotalPriceWithIpi.forEach(TotalPriceWithIpi => {
                const dataValue = TotalPriceWithIpi.dataset.value;
                const sanitizedValue = dataValue.replace(/\./g, '');
                const originalPrice = parseFloat(sanitizedValue.replace(',', '.'));
            
                const calculatedValue = (originalPrice * (selectedOptionValue / 100));
                const x = eval(`${originalPrice} ${operator} ${calculatedValue}`);
                console.log(originalPrice, calculatedValue, x);
            
                if (!isNaN(originalPrice) && !isNaN(calculatedValue) && !isNaN(selectedOptionValue)) {
                    TotalPriceWithIpi.querySelector('strong').innerText =
                        `R$ ${(x).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}`;
                } else {
                    console.error('Invalid input for price calculation');
                }
            });
            

            const labelsUnitPriceWithIpi = document.querySelectorAll('[data-selector="label-unit-price-with-ipi"]');
            labelsUnitPriceWithIpi.forEach(UnitPriceWithIpi => {
                const originalPrice = parseFloat(UnitPriceWithIpi.dataset.wipi.replace(',', '.'));
                const percentage = parseFloat(UnitPriceWithIpi.dataset.percentage);

                let discountedPrice = '';
                const discountAmount = (selectedOptionValue / 100) * originalPrice;
                const couponDescount = (originalPrice * percentage);
                if (isNaN(percentage)) {
                    discountedPrice = eval(`${originalPrice} ${operator} ${discountAmount}`);
                } else {
                    discountedPrice = eval(`(${originalPrice} ${operator} ${discountAmount}) - ${couponDescount}`);
                }

                console.log(discountedPrice);

                UnitPriceWithIpi.textContent =
                    `R$ ${discountedPrice.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`;

            });

            const labelsUnitPrice = document.querySelectorAll('[data-selector="label-unit-price"]');
            labelsUnitPrice.forEach(UnitPrice => {
                const originalPrice = parseFloat(UnitPrice.dataset.originalPrice.replace(',', '.'));
                const percentage = parseFloat(UnitPrice.dataset.percentage);

                let discountedPrice = '';
                const discountAmount = (selectedOptionValue / 100) * originalPrice;
                const couponDescount = (originalPrice * percentage);
                if (isNaN(percentage)) {
                    discountedPrice = eval(`${originalPrice} ${operator} ${discountAmount}`);
                } else {
                    discountedPrice = eval(`(${originalPrice} ${operator} ${discountAmount}) - ${couponDescount}`);
                }

                UnitPrice.textContent =
                    `R$ ${discountedPrice.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}`;
            });
            /// FIM CALCULO DE PRODUTOS VIA CONDIÇÃO DE PAGAMENTO ///

            // Atualiza o valor de economia no header
            const labelEconomy = $("[data-selector='label-header-total-economy']");
            const initialEconomyValue = labelEconomy.data('value');
            const newEconomyValue = (selectedOptionVariation === 'discount' && initialEconomyValue !== "0.00")
                ? (parseFloat(initialEconomyValue) + (initialTotalValueWithIpi - newTotalValueWithipi))
                : initialEconomyValue;


            const formatValue = newEconomyValue.toLocaleString("pt-BR", {
                style: "decimal",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })

            labelEconomy.text(`R$` + formatValue + ` em promoções`);

            $('#on-promotion').attr('data-value', formatValue);

            optionsContainer.removeClass('open');
            checkPromotions()
        });

    $(document).on('click', function (event) {
        const target = $(event.target);

            if (!target.closest(select).length) {
                optionsContainer.removeClass('open');
            }
        });
    });

// Shipping Company
const selectShippingCompany = $("[data-selector='shipping_company_select']");
// const inputShippingCompanyName = $("[data-selector='shipping_company_name']");
// const inputShippingCompanyDocument = $("[data-selector='shipping_company_document']");
// const inputShippingCompanyPhone = $("[data-selector='shipping_company_phone']");
const newShippingCompanyFields = $("[data-selector='shipping_company_fields']");
// const buttonFinish = $("[data-selector='button-finish']");
const labelShippingCompany = $("[data-selector='label-shipping-company']");
selectShippingCompany.on('change', function () {
    const self = $(this);
    const container = self.closest('.line');
    const selectedShippingCompany = self.val();

    if (selectedShippingCompany === 'new') {
        container.addClass('new');
        labelShippingCompany.text('Nova transportadora');

        newShippingCompanyFields.removeClass('hide');
        // if (
        //     inputShippingCompanyName.val() !== ''
        //     || inputShippingCompanyDocument.val() !== ''
        //     || inputShippingCompanyPhone.val() !== ''
        // ) {
        //     enableLink(buttonFinish);
        // }
    } else if (!isNaN(parseInt(selectedShippingCompany))) {
        container.removeClass('new');
        //enableLink(buttonFinish);
        let selectedOption = self.find('option:selected').text();

        labelShippingCompany.text(selectedOption.substring(0, 28) + '...');
    } else {
        container.removeClass('new');
        newShippingCompanyFields.addClass('hide');
        labelShippingCompany.text('Não informado');

        //disableLink(buttonFinish)
    }
})

// CARRINHO
$('.cart-supplier-list .expand-cart-icon').on('click', function () {
    const self = $(this);
    const container = self.closest('.cart-supplier-item');
    const btnSeeProducts = container.find('.btn-open');

    if (btnSeeProducts.hasClass('active')) {
        btnSeeProducts.trigger('click');
    }

    self.toggleClass('flipped-cart');

    const id = self.data('id');

        const element = $(`[data-expand-id="${id}"]`);
        const elementFooter = $(`[data-expand-footer-id="${id}"]`);

        element.toggleClass("hidden-cart-items");
        elementFooter.toggleClass("hidden-cart-items");
    });
})

function checkPromotions() {
    const onPromotion = document.getElementById('on-promotion').getAttribute('data-value');
    const paymentCondition = document.getElementById('payment-condition').getAttribute('data-value');
    const coupon = document.getElementById('total-disc-coupon').getAttribute('data-value');

    if (onPromotion !== "0.00" || paymentCondition || coupon) {
        // Verifica se qualquer um tem valor
        document.getElementById('savings').classList.remove('hide');
    }

    if (onPromotion) {
        document.getElementById('on-promotion').classList.remove('hide');
    }

    if (paymentCondition) {
        document.getElementById('payment-condition').classList.remove('hide');
    }

    if (coupon) {
        document.getElementById('total-disc-coupon').classList.remove('hide');
    }

    if (onPromotion === "0.00") {
        document.getElementById('on-promotion').classList.add('hide');
    }

    if (paymentCondition === "0,00") {
        document.getElementById('payment-condition').classList.add('hide');
    }

    if (onPromotion === "0.00" && paymentCondition === "0,00" && !coupon) {
        document.getElementById('savings').classList.add('hide');
    }
}


