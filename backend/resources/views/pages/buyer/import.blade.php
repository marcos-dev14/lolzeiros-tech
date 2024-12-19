<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
  </head>
  <link rel="stylesheet" href="{{ mix('css/home.css') }}">
<x-layouts.buyer-panel
    title="Importar pedido"
    subtitle="Escolha o fornecedor."
    icon="icons.bag"
>
<section id="suppliers">
        <form>
            <div class="form-group">
                <input type="text" class="form-control" id="searchInput" placeholder="Pesquisar fornecedores">
            </div>
        </form>
        <div class="list">
            @foreach($suppliers as $supplier)
                    <a data-toggle="modal" data-target="#myModal" data-supplier-id="{{ $supplier->id }}" style="cursor: pointer;">
                        <figure>
                            <picture class="lazy-picture">
                                <source data-srcset="{{ "$supplier->image_path/$supplier->webp_image" }}" type="image/webp">
                                <source data-srcset="{{ "$supplier->image_path/$supplier->image" }}" type="image/jpeg">

                                <img
                                    loading="lazy"
                                    data-src="{{ "$supplier->image_path/$supplier->image" }}"
                                    alt="{{ $supplier->name ?? $supplier->company_name }}"
                                >
                            </picture>
                        </figure>
                        <h5 style="display: none" class="card-title">{{ $supplier->name }}</h5>
                    </a>
            @endforeach
        </div>
</section>
    @include('pages.buyer.importModal')
</x-layouts.buyer-panel>

<script>
    $(document).ready(function () {
        var supplierId = null;
        var importId = null;
        var progressInterval;

        $('#myModal').on('show.bs.modal', function (event) {
            const button = $(event.relatedTarget);
            supplierId = button.data('supplier-id');

            $('#fileName').text('Nenhum arquivo selecionado');
            $('#submitBtn').prop('disabled', true);
        });

        $('#myModal').on('show.bs.modal', function() {
            $('#fileToUpload').off('change').on('change', function() {
                var fileName = this.files.length > 0 ? this.files[0].name : "Nenhum arquivo selecionado";
                $('#fileName').text(fileName);
                $('#submitBtn').prop('disabled', false);
            });
        });

        $("#myModal").on('submit', '.uploadForm', function (event) {
            event.preventDefault();

            if ($('#fileToUpload').get(0).files.length === 0) {
                alert('Por favor, selecione um arquivo para upload.');
                return;
            }

            var formData = new FormData($(this)[0]);
            formData.append('supplier_id', supplierId);

            $('#submitBtn').prop('disabled', true);
            $('#progressContainer').show();

            updateProgress(0);
            clearLogs();

            $.ajax({
                url: "{{ route('cart.upload') }}",
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (responseData) {
                    importId = responseData.import_id;
                    supplierId = responseData.supplier_id;
                    startProgressUpdate(supplierId);
                },
                error: function (xhr) {
                    $('#progressText').text('Erro no processamento.');
                    $('#progressBar').addClass('bg-danger');

                    let errorMessage = 'Ocorreu um erro no processamento.';
                    try {
                        const errorResponse = xhr.responseJSON || JSON.parse(xhr.responseText);
                        if (errorResponse && errorResponse.message) {
                            errorMessage = errorResponse.message;
                        }
                    } catch (e) {}

                    if (errorResponse.message) {
                        $('#logMessages').append(
                            `<li class="list-group-item text-danger">${errorResponse.message}</li>`
                        );
                    }

                    $('#logContainer').show();
                    $('#submitBtn').prop('disabled', false);
                }
            });
        });

        function startProgressUpdate(supplierId) {

            updateProgress(0);

            progressInterval = setInterval(() => {
                $.ajax({
                    url: "{{ route('cart.progress') }}",
                    type: 'GET',
                    data: {
                        supplier_id: supplierId,
                        import_id: importId
                    },
                    success: function (data) {
                        const progress = Math.round(data.progress);
                        updateProgress(progress);

                        if (progress >= 100) {
                            clearInterval(progressInterval);

                            $('#progressBar').addClass('bg-success');
                            $('#progressText').text('Seu pedido foi importado, confira os detalhes logo abaixo!');
                            fetchLogs(supplierId, importId);

                            $('#uploadForm :input').prop('disabled', false);

                            if (!$('#btnToCart').length) {
                                var buttonHtml = $('<div>', { class: 'mt-4 button-wrapper' }).append(
                                    $('<button>', {
                                        id: 'btnToCart',
                                        type: 'button',
                                        class: 'btn btn-primary',
                                        text: 'Ir para o carrinho'
                                    })
                                );

                                if ($('#action-button-cart').length) {
                                    $('#action-button-cart').show().append(buttonHtml);
                                    console.log('Botão adicionado com sucesso!');
                                } else {
                                    console.error('Elemento #action-button-cart não encontrado!');
                                }

                                $('#submitBtn').prop('disabled', false);
                            }
                        } else {
                            $('#progressText').text(`Processando... ${progress}% concluído.`);
                        }
                    },
                    error: function () {
                        clearInterval(progressInterval);
                        $('#progressText').text('Erro ao consultar progresso.');
                        $('#progressBar').addClass('bg-danger');
                        $('#submitBtn').prop('disabled', false);
                        $('#btnToCart').remove();
                    },
                });
            }, 500);
        }

        $(document).on('click', '#btnToCart', function () {
            window.location.href = "{{ route('cart.index') }}";
        });

        function updateProgress(percent) {

            if ($('#progressContainer').css('display') === 'none') {
                $('#progressContainer').css('display', 'block');
            }

            $('#progressBar')
                .css('width', percent + '%')
                .attr('aria-valuenow', percent)
                .text(percent + '%');
        }

        function fetchLogs(supplierId, importId) {
            $.ajax({
                url: "{{ route('cart.logs') }}",
                type: 'GET',
                data: {
                    supplier_id: supplierId,
                    import_id: importId
                },
                success: function (data) {
                    if (data.logs) {
                        $('#logContainer').show();
                        data.logs.forEach(log => {
                            $('#logMessages').append(`<li class="list-group-item">${log}</li>`);
                        });
                    }
                },
                error: function () {
                    $('#logMessages').append('<li class="list-group-item text-danger">Erro ao carregar logs.</li>');
                },
            });
        }

        function clearLogs() {
            $('#fileToUpload').val('');
            $('#action-button-cart').hide();
            $('#btnToCart').remove();
            $('#logMessages').empty();
            $('#logContainer').hide();
            $('#progressContainer').hide();
            $('#progressBar')
                .css('width', '0%')
                .removeClass('bg-success bg-danger')
                .attr('aria-valuenow', 0)
                .text('0%');
            $('#progressText').text('');
        }

        $('#myModal').on('hidden.bs.modal', function () {
            clearLogs();
            $('#uploadForm :input').prop('disabled', false);
            if (progressInterval) {
                clearInterval(progressInterval);
            }
        });
    });

</script>
