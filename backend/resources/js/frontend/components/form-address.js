const zipcodeInput = $('.zipcode');
zipcodeInput.on('change', function () {
    let $changedZipcodeField = $(this);
    let zipcode = $changedZipcodeField.val().replace(/[^0-9]/gi, '');
    let form = $changedZipcodeField.closest('form');

    const $fieldStreet = form.find("input[name='street']");
    const $fieldDistrict = form.find("input[name='district']");
    const $fieldState = form.find("input[name='country_state_id']");

    $fieldStreet.add($fieldDistrict).val('...');
    $fieldState.val('').trigger('change');

    const clearAddressForm = () => {
        $fieldDistrict.val('');
        $fieldState.val('').trigger('change');
        $fieldStreet.val('Endereço não encontrado!');
    }

    if (zipcode.length === 8) {
        $.get(`https://viacep.com.br/ws/${zipcode}/json/`, function (data) {
            if (!("erro" in data)) {
                $fieldStreet.val(data.logradouro);
                $fieldDistrict.val(data.bairro);
                $fieldState.val(data.uf).trigger('change');

                sessionStorage.setItem('SELECTED_CITY', data.localidade);
            } else {
                clearAddressForm();
            }
        });
    } else {
        clearAddressForm();
    }

    const $fieldCountryState = $('#country_state_id');
    const $fieldCountryCities = $('#country_city_id');
    $fieldCountryState.on('change', function () {
        let self = $(this);
        let val = self.val();
        let getCitiesRoute = self.data('cities-route');

        getCitiesRoute = getCitiesRoute.replace('state', val);

        $fieldCountryCities.empty();
        $fieldCountryCities.append(`<option value="">Aguarde...</option>`);

        $.get(getCitiesRoute)
            .done(function ({ data }) {
                $fieldCountryCities.empty().append(`<option value="">Selecione</option>`);

                $.each(data, function (index, value) {
                    const selected = sessionStorage.getItem('SELECTED_CITY') === value.name ? 'selected' : '';
                    $fieldCountryCities.append(`<option value="${value.id}" ${selected}>${value.name}</option>`);
                });

                sessionStorage.removeItem('SELECTED_CITY');
            })
            .fail(function () {
                $fieldCountryCities.empty().append(`<option value="">Erro ao carregar cidades</option>`);
            });
    });
});
