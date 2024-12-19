$(function () {
    $('.btn-open').on('click', handleBtnOpenClick);

    $("[data-selector='toggle-order']").on('click', function () {
        const self = $(this);
        const order = self.data('item');
        const container = self.closest('.order-item');
        const expensiveBlocks = container.find(`[data-selector='item-${order}']`);

        self.toggleClass('opened');
        expensiveBlocks.toggleClass('hide');
    });

    // $('.expand-order-icon').on('click', function () {
    //     const self = $(this);
    //     const id = self.data('id');
    //     const container = self.closest('.order-item');
    //     const rowTotalMobile = container.find('.row-total-mobile');
    //     const element = $(`[data-expand-id="${id}"]`);
    //
    //     self.toggleClass('flipped-order');
    //
    //     // verifica se rowTotalMobile esta display none se tiver mostra se nao esconde
    //     if (rowTotalMobile.css('display') === 'none') {
    //         rowTotalMobile.css('display', 'block');
    //     } else {
    //         rowTotalMobile.css('display', 'none');
    //     }
    //
    //     element.toggleClass("hidden-order-items");
    // });

    // $('.btn-open').on('click', function () {
    //     const self = $(this);
    //     console.log(self);
    //     const id = self.data('id');
    //     const container = $(self.data('container') + `[data-id="${id}"]`);
    //     if (container.hasClass('opened')) {
    //         container.removeClass('opened');
    //         self.text(self.data('text-closed')).removeClass('active');
    //     } else {
    //         const containers = $(`${self.data('container')}.opened` + `[data-id!="${id}"]`);
    //         containers.each((idx, item) => {
    //             $(item).find('button.btn-open').trigger('click');
    //         });
    //
    //         container.addClass('opened');
    //         self.text(self.data('text-opened')).addClass('active');
    //     }
    // });
});
