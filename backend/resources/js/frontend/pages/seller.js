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
                $(self).data("favorite", isFavorited === 0 ? 1 : 0);
            },
            error: function (error) {
                console.error("Error favoritando/desfavoritando:", error);
                // Handle errors (e.g., display an error message)
            },
        });
    });

    // Get elements
    const openModalBtn = document.getElementById("open-modal-btn");
    const modal = document.getElementById("modal-overlay");
    const closeBtn = document.getElementById("close-modal");

    // Open modal
    openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close modal
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside of modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});

function formatDate(dateString) {
    const date = new Date(dateString.split('T')[0]);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value).replace('R$', '').trim();
}

document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('date');
    const valueInput = document.getElementById('value');

    const formattedDate = formatDate('2024-12-22T22:43:00');
    const formattedValue = formatCurrency(99999.99);

    dateInput.value = formattedDate;
    valueInput.value = formattedValue;
});
