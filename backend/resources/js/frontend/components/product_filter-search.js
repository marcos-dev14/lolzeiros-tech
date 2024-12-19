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
