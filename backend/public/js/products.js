/**
 * Verify if element exists and execute callback
 * @param callback
 * @returns {$}
 */
$.fn.exists = function (callback) {
    let args = [].slice.call(arguments, 1);

    if (this.length) {
        callback.call(this, args);
    }

    return this;
};

function isMobile() {
    return window.innerWidth <= 768;
}

function calculatePercentageDifference(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);

    if (isNaN(a) || isNaN(b) || a === 0) {
        return 0;
    }

    return ((b - a) / a) * 100;
}

function disableLink(link, title = null) {
    link.attr('disabled', true);
    link.prop('href', '');
    link.attr('aria-disabled', 'true');

    if (title !== null) {
        link.attr('title', title);
    }
}

function enableLink(link, title = null) {
    link.attr('disabled', false);
    link.prop('href', link.data('href'));
    link.attr('aria-disabled', 'false');

    if (title !== null) {
        link.attr('title', title);
    }
}

document.body.addEventListener('click', (event) => {
    if (event.target.nodeName === 'A' && event.target.getAttribute('aria-disabled') === 'true') {
        event.preventDefault();
    }
});

function handleBtnOpenClick() {
    const self = $(this);
    const container = self.closest(self.data('container'));

    if (container.hasClass('opened')) {
        container.removeClass('opened');
        self.text(self.data('text-closed')).removeClass('active');
    } else {
        const containers = $(`${self.data('container')}.opened`);
        containers.each((idx, item) => {
            $(item).find('button.btn-open').trigger('click');
        });

        container.addClass('opened');
        self.text(self.data('text-opened')).addClass('active');
    }
}

function isHome() {
    let pathname = location.pathname;
    return pathname.replace(/^\//, '') === "produtos";
}

function showLoader(message = null, id = null) {
    const loader = id ? $(`#${id}`) : $("div[data-toggle='loader']");

    if (message) {
        loader.find('p').html(message);
    }

    loader.removeClass('hide');
}

function hideLoader(id = null) {
    const loader = id ? $(`#${id}`) : $("div[data-toggle='loader']");
    loader.addClass('hide');
}

function toggleMenu(element) {
    const { parent } = element.dataset;
    const self = $(element);

    self.toggleClass('rotate-180');
    $(parent).toggleClass('expanded');
}

function ucfirst(str, force) {
    const newStr = force ? str.toLowerCase() : str;

    return newStr.replace(
        /\b[a-zA-Z]/g,
        (firstLetter) => firstLetter.toUpperCase()
    );
}

function ucwords(str, force) {
    str = force ? str.toLowerCase() : str;

    return str.replace(
        /(\b)([a-zA-Z])/g,
        (match, p1, p2) => p1 + p2.toUpperCase()
    );
}

function isValidCNPJ(document) {
    const cleanDocument = document.replace(/[^0-9]/g, '');
    const DOCUMENT_LENGTH = 14;

    if (cleanDocument.length !== DOCUMENT_LENGTH || cleanDocument.match(/(\d)\1{13}/) !== null) {
        return false;
    }

    let length = cleanDocument.length - 2;
    let numbers = cleanDocument.substring(0, length);
    let digits = cleanDocument.substring(length);
    let sum = 0;
    let position = length - 7;

    for (let i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * position--;

        position = position < 2 ? 9 : position;
    }

    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;

    if (result !== parseInt(digits.charAt(0))) {
        return false;
    }

    length = length + 1;
    numbers = cleanDocument.substring(0, length);
    sum = 0;
    position = length - 7;

    for (let i = length; i >= 1; i--) {
        sum += numbers.charAt(length - i) * position--;

        position = position < 2 ? 9 : position;
    }

    result = sum % 11 < 2 ? 0 : 11 - sum % 11;

    return !(result !== parseInt(digits.charAt(1)));
}

function formatCPF(value) {
    return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function formatCNPJ(value) {
    return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}

/* Select2 */
function initializeSelect2() {
    $("select:not(select.select-no-search, select.swal2-select)").select2();
}

function initializeSelect2NoSearch() {
    $(".select-no-search").select2({
        minimumResultsForSearch: -1
    });
}
/* SELECT2 END */

/* TOOLTIP */
function initializeTooltip() {
    $('[data-toggle="tooltip"]').tooltip();
}
/* TOOLTIP END */

/* SLICK SLIDER */
function makeSlick(container, options = {}) {
    options.dots = options.dots ?? false;
    options.infinite = options.infinite ?? true;
    options.autoplay = options.autoplay ?? false;
    options.arrows = options.arrows ?? false;
    options.autoplaySpeed = options.autoplaySpeed ?? 5000;
    options.speed = options.speed ?? 700;
    options.slidesToShow = options.slidesToShow ?? 1;
    options.slidesToScroll = options.slidesToScroll ?? 1;
    options.centerMode = options.centerMode ?? false;
    options.responsive = options.responsive ?? [];

    container.slick(options);
}
/* SLICK SLIDER END */

function initializeInputMask(maskFormats = {}) {
    for (const [selector, mask] of Object.entries(maskFormats)) {
        $(selector).inputmask(mask);
    }
}

const laravelToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

function updateCartBoxValuesOnSelectChange() {
    $('#cart-box, #cart-box-mobile').exists(function () {
        const cartBox = this;

        const $select = cartBox.find('select');
        const $minOrderLabel = cartBox.find('.label-absolute');
        const rightSideSpan = cartBox.find('.right-side span');

        $select.on('change', function () {
            const selectedOption = $(this).find('option:selected');
            const value = selectedOption.data('value');
            const minOrder = selectedOption.data('min') ?? '0';
            const unformattedMinOrder = parseInt(minOrder.replace('.', '').replace(',', ''));
            const unformattedValue = parseInt(value.replace('.', '').replace(',', ''));

            $minOrderLabel.text(minOrder !== '0' ? `Pedido mínimo R$ ${minOrder}` : '');
            $minOrderLabel.toggleClass('completed', unformattedValue >= unformattedMinOrder);
            rightSideSpan.text(`R$ ${value}`);
        });
    });
}

function updateCartBoxComponent() {
    $('#cart-box, #cart-box-mobile').exists(function () {
        const cartBox = this;
        const route = cartBox.data('route');

        $.get(route).done(function (html) {
            cartBox.replaceWith(html);

            updateCartBoxValuesOnSelectChange();

            const cartBoxSelect = $(`#${$(cartBox).prop('id')}`).find('select');
            cartBoxSelect.select2({
                minimumResultsForSearch: -1
            });
        });
    });
}

function smoothScrollToAnchor(anchor) {
    const target = document.querySelector(anchor);

    if (target !== null) {
        const rect = target.getBoundingClientRect();
        const topPosition = rect.top - 130;

        window.scrollTo({
            top: topPosition,
            behavior: 'smooth'
        });
    }
}

function toggleCanvas() {
    event.preventDefault();

    let canvas = $('#offset-canvas');

    if (canvas.hasClass('opened-canvas')) {
        setTimeout(function () {
            canvas.addClass('hide');
        }, 1200);
    } else {
        canvas.removeClass('hide');
    }

    setTimeout(function () {
        canvas.toggleClass('opened-canvas');
    }, 10);
}

function handleRemoveProductFromCart(itemContainer, removeRoute) {
    removeProductFromCart(
        itemContainer,
        removeRoute,
        function (itemContainer, elements) {
            const {
                ipi,
                basePrice,
                discountedPrice,
                discountedPriceWithIpi,
                subtotalWithIpi,
                discount,
                discountPercentage
            } = elements;

            if (itemContainer.hasClass('hero')) {
                itemContainer.find("[data-selector='quantity-container']").addClass('hide');
                itemContainer.find("[data-selector='button-container']").removeClass('hide');

                const input = itemContainer.find('.qty-selector input');
                const labelMinQuantity = itemContainer.find("[data-selector='label-min-quantity']");
                const minQuantity = input.data('min');
                input.val(`${minQuantity} un`);
                labelMinQuantity.text(`Quantidade mínima ${minQuantity} unidades`);

                itemContainer.attr('data-is-in-cart', '0');

                const priceBaseContainer = itemContainer.find("[data-selector='price-base']");
                const priceIpiContainer = itemContainer.find("[data-selector='price-ipi']");
                const subtotalContainer = itemContainer.find("[data-selector='price-subtotal']");
                const galleryDiscountLabel = itemContainer.find("[data-selector='discount-label']");

                galleryDiscountLabel.text(`${discountPercentage}%`).toggleClass('hide', discountPercentage === 0);
                priceBaseContainer.find('strong').html(`<small>R$</small>${discountedPrice}`);
                priceBaseContainer.find('strong + small').html(discountPercentage !== 0 ? `<s>R$ ${basePrice}</s> (${discountPercentage}%)` : '&nbsp;');
                priceIpiContainer.find('strong').html(`<small>R$</small>${discountedPriceWithIpi}`);
                priceIpiContainer.find('strong + small').html(ipi > 0 ? `IPI (${ipi}%)` : '&nbsp;');
                subtotalContainer.find('strong').html(`<small>R$</small>${subtotalWithIpi}`);
                subtotalContainer.find('strong + small').html(discountPercentage !== 0 ? `Economia de <b>R$ ${discount}</b>` : '&nbsp;');
            } else {
                itemContainer.find("[data-selector='quantity-container']").addClass('hide');

                const input = itemContainer.find('.qty-selector input');
                const minQuantity = input.data('min');
                input.val(`${minQuantity} un`);

                const button = itemContainer.find("[data-selector='addToCart']");
                button.data('qty', minQuantity).removeClass('hide');

                itemContainer.attr('data-is-in-cart', '0');

                const buttonBox = itemContainer.find('.button-box');
                buttonBox.find('p').removeClass('color-primary').html("&nbsp;");

                const priceBaseContainer = itemContainer.find("[data-selector='price-base']")
                const discountLabel = itemContainer.find("[data-selector='discount-label']");

                priceBaseContainer.find('span').text(`R$ ${discountedPrice}/un`);
                priceBaseContainer.find('small').html(discountPercentage !== 0 ? `<s>R$ ${basePrice}</s>` : '&nbsp;');

                discountLabel.text(discountPercentage !== 0 ? `${discountPercentage}%` : '');
                discountLabel.toggleClass('hide', discountPercentage === 0);
            }
        }
    );
}

function removeProductFromCart(itemContainer, removeRoute, callback) {
    swal
        .fire({
            title: "Tem certeza?",
            text: "Gostaria de remover este produto do carrinho?",
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: "#39c6b5",
            confirmButtonText: "Sim! Remover.",
            confirmButtonColor: "#9ba3aa",
            showLoaderOnConfirm: false,
        })
        .then(({ isConfirmed }) => {
            if (isConfirmed) {
                let loaderId = itemContainer.find("div[data-toggle='loader']").prop('id');
                showLoader('Por favor aguarde...', loaderId);

                $.ajax({
                    url: removeRoute,
                    type: "DELETE",
                    success: function (
                        responseData
                    ) {
                        const { redirectUrl } = responseData;
                        if (redirectUrl !== undefined) {
                            window.location.href = redirectUrl;
                            return;
                        }

                        if (status === "error") {
                            swal.fire("Oops", message, status);
                            hideLoader(loaderId);
                            return;
                        }

                        if (typeof callback === "function") {
                            callback(itemContainer, responseData);
                        }

                        updateCartBoxComponent();
                        hideLoader(loaderId);
                    }
                });
            }
        });
}

function addProductToCart(button, productData, callback) {
    let container = button.closest(button.data('container'));

    let loaderId = container.find("div[data-toggle='loader']").prop('id');
    showLoader('Por favor, aguarde...', loaderId);

    $.post(button.data('url'), productData, function ({
        redirectUrl,
        removeUrl,
        currentQuantity,
        instance
    }) {
        if (redirectUrl !== undefined) {
            window.location.href = redirectUrl;
            return;
        }

        let buttonBox = container.find("[data-selector='button-box']");
        buttonBox.find('p').addClass('color-primary').html(
            `<span class="color-primary" data-selector="label-in-cart-quantity">${currentQuantity}</span>&nbsp;` +
            `${currentQuantity > 1 ? 'unidades' : 'unidade'} no carrinho`
        );

        let qtySelector = buttonBox.find('.qty-selector');
        qtySelector.data('remove-route', removeUrl);
        qtySelector.find('input').data('instance', `${instance}`);

        if (typeof callback === "function") {
            callback(buttonBox, currentQuantity);
        }

        container.attr('data-is-in-cart', '1');

        hideLoader(loaderId);

        updateCartBoxComponent();
    });
}

/* Wishlist Card */
$('button.wishlist').on('click', function () {
    const button = $(this);
    const card = button.closest('.card');
    const isOnWishlist = button.hasClass('on');
    const loaderId = card.find("div[data-toggle='loader']").prop('id');
    const upperContainer = button.closest('.grid-products');

    showLoader('Por favor, aguarde...', loaderId);

    $.ajax({
        type: isOnWishlist ? 'DELETE' : 'POST',
        url: isOnWishlist ? button.data('add-route') : button.data('remove-route'),
        success: function () {
            if (upperContainer && upperContainer.data('action') === 'delete-after-wishlist') {
                card.remove();
            } else {
                isOnWishlist ? button.removeClass('on') : button.addClass('on');
            }

            hideLoader(loaderId);
        }
    });
});
/* Wishlist Card End */

/* Initialize */
$(function () {
    initializeSelect2();
    initializeSelect2NoSearch();
    initializeTooltip();

    //$('img.with-zoom').ezPlus();

    // $('.slick-default').exists(function () {
    //     makeSlick($(this))
    // })

    initializeInputMask({
        '.mask-cpf': '999.999.999-99',
        '.mask-cnpj': '99.999.999/9999-99',
        '.mask-cellphone': '(99) 99999-9999',
        '.mask-phone': '(99) 9999-9999',
        '.zipcode': '99999-999'
    });

    updateCartBoxComponent();

    setTimeout(function () {
        $('#cart-box').find('select').trigger('change');
    }, 100);

    $("input[data-format='Pascal']").on('keyup change', function () {
        $(this).val(
            ucwords(
                $(this).val(),
                true
            )
        );
    });

    $("input[data-format='number']").on('keypress', function (e) {
        if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
            return false;
        }
    });

    $("input[data-format='cpf-cnpj']").each(function () {
        const input = $(this);

        input.on('keypress', function (e) {
            if (e.which !== 8 && e.which !== 0 && (e.which < 48 || e.which > 57)) {
                return false;
            }
        });

        input.on('click', function (e) {
            const value = input.val().replace(/\D/g, '');
            input.val(value);
        });

        input.on('blur', function (e) {
            const value = input.val().replace(/\D/g, '');
            const isCpf = input.val().replace(/\D/g, '').length === 11;

            input.val(isCpf ? formatCPF(value) : formatCNPJ(value));
        });
    });

    /* ANCHOR */
    /* Check to see if it has an anchor and moves to it */
    const storedAnchor = localStorage.getItem('anchor');
    if (storedAnchor !== null) {
        smoothScrollToAnchor(storedAnchor);
        localStorage.removeItem('anchor');
    }

    const anchorElements = document.querySelectorAll('.anchor');
    anchorElements.forEach(function (element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();

            const hash = this.hash;

            if (
                location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') &&
                location.hostname === this.hostname
            ) {
                smoothScrollToAnchor(hash);
            } else {
                localStorage.setItem('anchor', hash);
                location.href = this.href.replace(hash, '');
            }
        });
    });
    /* ANCHOR END */

    // Add Product to Card
    $('#product-details .hero')
        .add('.card')
        .find("[data-selector='addToCart']").on('click', function () {
            let self = $(this);
            let container = self.closest(self.data('container'));

            let loaderId = container.find("div[data-toggle='loader']").prop('id');
            showLoader('Por favor, aguarde...', loaderId);

            addProductToCart(self, {
                product: self.data('product'),
                qty: self.data('qty')
            }, function (buttonBox, currentQuantity) {
                if (container.hasClass('hero')) {
                    buttonBox.find("[data-selector='quantity-container']").removeClass('hide');
                    buttonBox.find("[data-selector='button-container']").addClass('hide');
                } else {
                    buttonBox.find('.buttons').removeClass('hide');
                    buttonBox.find('> button').addClass('hide');
                }
            })
        });

    // Change Cart Product Quantity
    $('.qty-selector')
        .find('a').on('click', function () {
            let self = $(this);

            let input = self.siblings('input');
            let operator = $(this).data('operator');
            let minQty = parseInt(input.data('min'));
            let currentQty = parseInt(input.val());
            let resultOperation = eval(`${currentQty} ${operator} ${minQty}`);

            if (resultOperation < minQty) {
                let selectorContainer = self.closest('.qty-selector');
                let containerClass = selectorContainer.data('container');

                handleRemoveProductFromCart(
                    self.closest(containerClass),
                    selectorContainer.data('remove-route')
                );
            } else if (resultOperation > 0) {
                input.val(
                    eval(`${currentQty} ${operator} ${minQty}`)
                ).trigger('change');
            }
        });

    $('.card .qty-selector input')
        .add('#product-details .qty-selector input')
        .on('change', function () {
            let self = $(this);


            let selectorContainer = self.closest('.qty-selector');
            let itemContainer = $(self.closest(selectorContainer.data('container')));

            let loaderId = itemContainer.find("div[data-toggle='loader']").prop('id');
            showLoader('Atualizando carrinho, aguarde', loaderId);

            let instance = self.data('instance');
            let product = self.data('item');
            let currentQty = parseInt(self.val());
            let multiple = Math.ceil(currentQty / self.data('min'));

            currentQty = multiple * self.data('min');

            $.ajax({
                url: selectorContainer.data('update-route'),
                type: 'PUT',
                data: { qty: currentQty, product, instance },
                success: function ({
                    ipi,
                    discount,
                    discountPercentage,
                    basePrice,
                    discountedPrice,
                    discountedPriceWithIpi,
                    subtotalWithIpi,
                    currentQuantity
                }) {
                    self.val(`${currentQuantity} un`);

                    if (itemContainer.hasClass('card')) {
                        itemContainer.find('.button-box p').html(`
                            <span class="color-primary" data-selector="label-in-cart-quantity">${currentQuantity}</span>&nbsp;` +
                            `${currentQuantity > 1 ? 'unidades' : 'unidade'} no carrinho
                        `);

                        const priceBaseContainer = itemContainer.find("[data-selector='price-base']")
                        const discountLabel = itemContainer.find("[data-selector='discount-label']");

                        priceBaseContainer.find('span').text(`R$ ${discountedPrice}/un`);
                        priceBaseContainer.find('small').html(discountPercentage !== 0 ? `<s>R$ ${basePrice}</s>` : '&nbsp;');

                        discountLabel.text(discountPercentage !== 0 ? `${discountPercentage}%` : '');
                        discountLabel.toggleClass('hide', discountPercentage === 0);
                    } else {
                        const quantityContainer = itemContainer.find("[data-selector='label-in-cart-quantity']");
                        const priceBaseContainer = itemContainer.find("[data-selector='price-base']");
                        const priceIpiContainer = itemContainer.find("[data-selector='price-ipi']");
                        const subtotalContainer = itemContainer.find("[data-selector='price-subtotal']");
                        const galleryDiscountLabel = itemContainer.find("[data-selector='discount-label']");

                        galleryDiscountLabel.text(`${discountPercentage}%`).toggleClass('hide', discountPercentage === 0);
                        quantityContainer.text(currentQuantity);
                        priceBaseContainer.find('strong').html(`<small>R$</small>${discountedPrice}`);
                        priceBaseContainer.find('strong + small').html(discountPercentage !== 0 ? `<s>R$ ${basePrice}</s> (${discountPercentage}%)` : '&nbsp;');
                        priceIpiContainer.find('strong').html(`<small>R$</small>${discountedPriceWithIpi}`);
                        priceIpiContainer.find('strong + small').html(ipi > 0 ? `IPI (${ipi}%)` : '&nbsp;');
                        subtotalContainer.find('strong').html(`<small>R$</small>${subtotalWithIpi}`);
                        subtotalContainer.find('strong + small').html(discountPercentage !== 0 ? `Economia de <b>R$ ${discount}</b>` : '&nbsp;');
                    }

                    updateCartBoxComponent();
                    hideLoader(loaderId);
                }
            });
        });
    // Change Cart Product Quantity | END

    // Remove Product From by Form
    $('.card')
        .add('#product-details')
        .find('.form-remove').on('submit', function (e) {
            e.preventDefault();

            let form = $(this);
            let containerClass = form.data('container');
            let card = form.closest(containerClass);

            handleRemoveProductFromCart(
                form.closest(containerClass),
                card.find('.qty-selector').data('remove-route')
            );
        });

    // Clear form input on focus
    $('#form-search').find('input').on('focus', function () {
        $(this).val('');
    });
});

const productsFilter = $('#products-filter');
const selectSort = $('#select-sort');
const selectSortMobile = $('#select-sort-mobile');
const formSearch = $('#form-search');
const sectionProducts = $('#products');

formSearch.on('submit', function (e) {
   productsFilter.trigger('submit');
});

function openFilter() {
    sectionProducts.find('.aside-filter').removeClass('hide');
    sectionProducts.find('.filter-close').removeClass('hide');
    sectionProducts.find('.select-az').addClass('hide');
}

function closeFilter() {
    sectionProducts.find('.aside-filter').addClass('hide');
    sectionProducts.find('.filter-close').addClass('hide');
    sectionProducts.find('.select-az').removeClass('hide');
}

selectSort.on('change', function () {
    productsFilter.trigger('submit');
});

selectSortMobile.on('change', function () {
    selectSort.val($(this).val()).trigger('change');
});

productsFilter.on('submit', (e) => {
    e.preventDefault();

    const form = $(e.currentTarget);
    const queryString = getFilterQueryString(form);


    window.location.href = form.prop('action') + '?' + queryString.slice(0, -1);
    }).find("input[type='checkbox'], input[type='radio']").on('click', (e) => {
        
    const element = $(e.currentTarget);

    if (element.prop('type') === 'radio') {
        productsFilter.find("input[type='checkbox']:checked")
            .removeAttr('checked')
            .trigger('change');
    }

    if (element.prop('name') === 'categories') {
        productsFilter.find("input[data-input-type='attributes']:checked")
            .removeAttr('checked')
            .trigger('change');
    }

    formSearch.find('input').val('');

    productsFilter.trigger('submit');
});

const buttonSeeMore = $('#see-more');

buttonSeeMore.on('click', function () {
    const queryString = getFilterQueryString();
    const route = $(this).data('route');

    $.get(`${route}?${queryString.slice(0, -1)}`, function (response) {
        $('.grid-products').append(response);
    });
});

function getFilterQueryString(form = null) {
    const formFilter = form ?? productsFilter;

    const categories = formFilter.find("input[name='categories']:checked").map((index, element) => $(element).val()).get();
    const brands = formFilter.find("input[name='brands']:checked").map((index, element) => $(element).val()).get();
    const attributes = formFilter.find("input[data-input-type='attributes']:checked").map((index, element) => $(element).val()).get();

    const selectedSort = selectSort.val();
    const searchSelectedSupplier = formSearch.find('select').val();
    const searchTerms = formSearch.find('input').val();
    const supplierId = (searchSelectedSupplier !== '' && searchTerms !== '')
        ? searchSelectedSupplier
        : formFilter.find("input[name='supplier']:checked").val();

    const routeParams = {
        ...(supplierId !== undefined && { rp: supplierId }),
        ...(categories.length > 0 && { ca: categories }),
        ...(brands.length > 0 && { ma: brands }),
        ...(attributes.length > 0 && { attr: attributes }),
        ...(searchTerms !== '' && { pe: searchTerms }),
        ...(selectedSort !== '' && { or: selectedSort }),
    };

    let queryString = '';
    Object.entries(routeParams).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            if (key === 'ca' || key === 'ma') {
                queryString += `${key}=[${value.join(',')}]&`;
            } else if (key === 'attr') {
                value = JSON.stringify(value);
                queryString += `${key}=${value}&`;
            } else {
                value.forEach((v) => {
                    queryString += `${key}=${v}&`;
                });
            }
        } else {
            queryString += `${key}=${value}&`;
        }
    });

    return queryString;
}