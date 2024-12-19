<div id="myModal" class="modal fade" role="dialog" aria-modal="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <div class="header-content w-100">
                    <h5 class="modal-title">Importar pedido</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>

            <div class="modal-body">
                <div class="mt-3 alert alert-warning" role="alert">
                    <p class="mb-0">Baixe o nosso exemplo para garantir que a importação seja realizada corretamente.</p>
                    <button id="downloadBtn" class="btn btn-success"><i class="fas fa-download"></i> Download</button>
                </div>
            </div>

            <div class="modal-footer d-flex">
                <form class="uploadForm d-flex" id="uploadForm" enctype="multipart/form-data">
                    <div class="file-upload-wrapper d-flex">
                        <label for="fileToUpload" id="uploadLabel" class="btn btn-secondary">Escolher arquivo</label>
                        <span id="fileName" class="file-name ml-2">Nenhum arquivo selecionado</span>
                        <input type="file" name="fileToUpload" id="fileToUpload" style="display: none;">
                    </div>
                    <button id="submitBtn" class="btn btn-primary submitBtn ml-6" type="submit">Enviar</button>
                </form>
            </div>

            <div id="progressContainer">
                <div class="progress">
                    <div id="progressBar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
                </div>
                <small id="progressText" class="text-center text-lg mt-2" style="font-size: 1.25rem; display: block;"></small>
            </div>

            <div id="logContainer" class="mt-3" style="display: none;">
                <ul id="logMessages" class="list-group"></ul>
            </div>

            <div id="action-button-cart"></div>
        </div>
    </div>
</div>

<script>
    document.getElementById('downloadBtn').addEventListener('click', function () {
        window.location.href = '/exemplo.xlsx';
    });
</script>
