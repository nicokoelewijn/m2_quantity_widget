define([
    'jquery',
    'Magento_Checkout/js/action/get-totals',
    'Magento_Customer/js/customer-data'

], function ($, getTotalsAction, customerData) {
    'use strict';

    return function (config, element) {
        var debounceTimer;
        var originalValue = $(element).find('.qty').val(); // Store original value

        function updateCart(qty) {
            $(element).find('.quantity_input_wrapper').addClass('loading');

            var form = $('form#form-validate');
            $.ajax({
                url: form.attr('action'),
                data: form.serialize(),
                showLoader: true,
                success: function (res) {
                    var parsedResponse = $.parseHTML(res);
                    var result = $(parsedResponse).find("#form-validate");
                    var sections = ['cart'];

                    $("#form-validate").replaceWith(result);

                    // The mini cart reloading
                    customerData.reload(sections, true);

                    // The totals summary block reloading
                    var deferred = $.Deferred();
                    getTotalsAction([], deferred);
                },
                error: function (xhr, status, error) {
                    var err = eval("(" + xhr.responseText + ")");
                    console.log(err.Message);
                }
            });
        }

        function adjustQty(adjustment) {
            var currentQty = parseInt($(element).find('.qty').val());
            var newQty = currentQty + adjustment;
            $(element).find('.qty').val(newQty);
            updateCart(newQty);
        }

        $(element).find('.increase').on('click', function () {
            adjustQty(1);
        });

        $(element).find('.decrease').on('click', function () {
            adjustQty(-1);
        });

        $(element).find('.qty').on('input', function () {
            clearTimeout(debounceTimer);
            var qty = $(this).val();

            debounceTimer = setTimeout(function () {
                updateCart(qty);
            }, 500); // 500ms delay
        }).on('blur', function () {
            if ($(this).hasClass('warning')) {
                // If still has warning class, revert to original value
                $(this).val(originalValue).removeClass('warning');
            }
        });
    };
});
