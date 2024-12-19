const fieldDocument = $('#document');
const fieldReceitaws = $('#receitaws');
const fieldName = $('input#name');

fieldDocument.on('change', function () {
    let loaderId = 'register-loader';
    let loaderMessage = 'Aguarde enquanto buscamos os dados';

    let self = $(this);
    let document = self.val().replace(/[^0-9]/gi, '');

    if (!isValidCNPJ(document)) {
        fieldReceitaws.add(fieldName).val('');

        swal.fire({
            icon: 'error',
            title: 'Digite um CNPJ válido',
            confirmButtonText: 'Fechar',
            confirmButtonColor: '#39c6b5'
        });

        return false;
    }

    showLoader(loaderMessage, loaderId);

    $.ajax({
        url: `https://www.receitaws.com.br/v1/cnpj/${document}`,
        jsonp: "callback",
        dataType: "jsonp",
        tryCount: 0,
        retryLimit: 4,
        success: function (response) {
            let { nome } = response;
            fieldName.val(nome).trigger('change');
            fieldReceitaws.val(JSON.stringify(response));
            hideLoader(loaderId);
        },
        error: function (xhr) {
            fieldName.val('').trigger('change');

            if (xhr.status === 429 || xhr.status === 404) {
                let xhrRequest = this;
                xhrRequest.tryCount++;

                if (xhrRequest.tryCount <= xhrRequest.retryLimit) {
                    setTimeout(function () {
                        let message = loaderMessage;
                        switch (xhrRequest.tryCount) {
                            case 1:
                                message = `${loaderMessage}.<br>Parece que a rede da Receita Federal está ocupada, aguarde só mais um momento`;
                                break;
                            case 2:
                                loaderMessage = `${loaderMessage}.<br>Este processo pode demorar até 2 minutos`;
                                break;
                            case 3:
                                loaderMessage = `${loaderMessage}.<br>Estamos quase lá, aguarde só mais um momento`;
                                break;
                        }

                        showLoader(message, loaderId);
                        $.ajax(xhrRequest);
                    }, 30000);

                    return false;
                }
            }

            showLoader('Não foi possível buscar os dados na Receita Federal<br>Por favor, entre em contato através de nossos canais de atendimento.');
            setTimeout(function () {
                hideLoader();
            }, 5000);
        }
    });
});
