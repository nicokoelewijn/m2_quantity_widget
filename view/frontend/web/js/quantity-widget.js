define([
    'jquery',
    'Magento_Checkout/js/action/get-totals',
    'Magento_Customer/js/customer-data'
], function ($, getTotalsAction, customerData) {
    'use strict';

    return function (config, element) {
        var debounceTimer;
        var qtyElement = $(element).find('.qty');
        var originalValue = qtyElement.val(); // Store original value

        function updateCart() {
            $(element).find('.quantity_input_wrapper').addClass('loading');

            var form = $('form#form-validate');
            $.ajax({
                url: form.attr('action'),
                data: form.serialize(),
                showLoader: true,
                success: function (res) {
                    updateCartUI(res);
                },
                error: function (xhr) {
                    console.error("Error updating cart:", xhr.responseText);
                }
            });
        }

        function updateCartUI(res) {
            var parsedResponse = $.parseHTML(res);
            var result = $(parsedResponse).find("#form-validate");
            $("#form-validate").replaceWith(result);

            // Reload mini cart and totals summary block
            customerData.reload(['cart'], true);
            getTotalsAction([], $.Deferred());
        }

        function adjustQty(adjustment) {
            var currentQty = parseInt(qtyElement.val(), 10);
            var newQty = currentQty + adjustment;
            qtyElement.val(newQty);
            updateCart();
        }

        function setupEventHandlers() {
            $(element).find('.increase').on('click', function () {
                adjustQty(1);
            });

            $(element).find('.decrease').on('click', function () {
                adjustQty(-1);
            });

            qtyElement.on('input', function () {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function () {
                    updateCart();
                }, 500); // 500ms delay
            }).on('blur', function () {
                if ($(this).hasClass('warning')) {
                    $(this).val(originalValue).removeClass('warning');
                }
            });
        }

        setupEventHandlers();
    };
});
