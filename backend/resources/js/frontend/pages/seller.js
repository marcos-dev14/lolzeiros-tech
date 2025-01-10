$(document).ready(function() {
    // Adiciona um listener de clique a todos os botões com a classe 'collapse-button'
    $('.collapse-button').on('click', function() {
        // Encontra a linha <tr> atual
        var currentRow = $(this).closest('tr');

        // Encontra a próxima linha <tr> que deve ser a 'collapsable-row'
        var collapsableRow = currentRow.next('.collapsable-row');

        if (collapsableRow.length) {
            // Alterna a visibilidade com animação de deslizamento
            collapsableRow.slideToggle(300);

            // Alterna uma classe para mudar o ícone, se desejado
            $(this).toggleClass('active');
        }
    });
});

$.ajax({
    url: '/vendedor/add-favorito', // Substitua pelo seu endpoint
    method: 'GET', // Ou 'POST', 'PUT', 'DELETE' dependendo da sua necessidade
    data: {
        // Dados a serem enviados para o servidor, se necessário
    },
    success: function(response) {
        // Lógica para lidar com a resposta do servidor
        console.log(response);

        // Exemplo: inserir dados na tabela
        // var newRow = '<tr><td>' + response.data + '</td></tr>';
        // $('.your-table').append(newRow);
    },
    error: function(error) {
        // Lógica para lidar com erros
        console.error(error);
    }
});
