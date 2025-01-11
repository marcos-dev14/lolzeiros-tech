$(document).ready(function () {
    // Adiciona um listener de clique a todos os botões com a classe 'collapse-button'
    $(".collapse-button").on("click", function () {
        // Encontra a linha <tr> atual
        var currentRow = $(this).closest("tr");

        // Encontra a próxima linha <tr> que deve ser a 'collapsable-row'
        var collapsableRow = currentRow.next(".collapsable-row");

        if (collapsableRow.length) {
            collapsableRow.slideToggle(300);

            // Alterna uma classe para mudar o ícone, se desejado
            $(this).toggleClass("active");
        }
    });

    $(".heart").click(function () {
        let type = $(this).data("type"); // Assuming data-type attribute exists on the heart button
        let id = $(this).data("id"); // Assuming data-id attribute exists on the heart button
        let isFavorited = $(this).data("favorite");
        let self = this;

        $.ajax({
            url:
                isFavorited === 0
                    ? "/vendedor/add-favorito"
                    : "/vendedor/rem-favorito",
            type: "POST",
            data: {
                type: type,
                id: id,
                _token: $('meta[name="csrf-token"]').attr("content"), // Include CSRF token
            },
            success: function (response) {
                // Toggle the heart icon (implementation-specific)
                $(self).toggleClass("favorited"); // Example: Add/remove a 'favorited' class
            },
            error: function (error) {
                console.error("Error favoritando/desfavoritando:", error);
                // Handle errors (e.g., display an error message)
            },
        });
    });
});
