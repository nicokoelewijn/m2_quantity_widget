define([
    'jquery',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/model/messageList',
    'mage/decorate',
    'mage/collapsible',
    'mage/cookies'
], function ($, customerData, messageList) {
    'use strict';

    return function (config, element) {
        var debounceTimer;
        var originalValue = $(element).find('.qty').val(); // Store original value

        function updateCart(qty) {
            $(element).find('.quantity_input_wrapper').addClass('loading');

            $.ajax({
                url: `/default/checkout/sidebar/updateItemQty/`,
                type: 'POST',
                dataType: 'json',
                data: {
                    item_id: config.itemId,
                    item_qty: qty,
                    form_key: $.mage.cookies.get('form_key')
                },
                success: function (response) {
                    if (response.success) {
                        // Cart updated successfully
                        customerData.reload(['cart'], true);
                        $(element).find('.quantity_input_wrapper').removeClass('warning'); // Remove warning class
                        $(element).parent().find('.quantity_input__error-message').html(''); // Remove error message
                    } else {
                        // Handle specific error message
                        if (response.error_message) {
                            $(element).parent().find('.quantity_input__error-message').html(response.error_message);
                            $(element).find('.quantity_input_wrapper').addClass('warning'); // Add warning class
                        }
                    }
                },
                error: function (xhr, status, error) {
                    $(element).find('.quantity_input__error-message').text(response.error_message);
                    return false;
                },
                complete: function () {
                    $(element).find('.quantity_input_wrapper').removeClass('loading'); // Remove loading class after AJAX request
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
