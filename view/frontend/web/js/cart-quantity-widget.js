define([
    'jquery',
    'Magento_Checkout/js/action/get-totals',
    'Magento_Customer/js/customer-data',
    'Magento_Checkout/js/action/select-shipping-method',
    'Magento_Checkout/js/model/quote',
    'Magento_Checkout/js/model/shipping-rate-registry'
], function ($, getTotalsAction, customerData, selectShippingMethodAction, quote, rateReg) {
    'use strict';

    return function (config, element) {
        var debounceTimer;
        var $qtyElement = $(element).find('.qty');
        var originalValue = $qtyElement.val();
        var $quantityWrapper = $(element).find('.quantity_input_wrapper');
        var form = $('form#form-validate');

        // Helper function to debounce any function execution
        function debounce(func, delay) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(func, delay);
        }

        function updateCart() {
            $quantityWrapper.addClass('loading');
            $.ajax({
                url: form.attr('action'),
                data: form.serialize(),
                showLoader: true,
                success: function (res) {
                    updateCartUI(res);
                    updateShippingMethods(); // Refresh shipping methods
                },
                error: function (xhr) {
                    console.error("Error updating cart:", xhr.responseText);
                }
            });
        }

        function updateCartUI(res) {
            var parsedResponse = $.parseHTML(res);
            var $updatedForm = $(parsedResponse).find("#form-validate");

            $("#form-validate").replaceWith($updatedForm);

            // Reload mini cart and totals summary block
            customerData.reload(['cart'], true);
            getTotalsAction([], $.Deferred());
        }

        function updateShippingMethods() {
            var shippingAddress = quote.shippingAddress();
            if (shippingAddress) {
                // Clear the cached rates and refresh the shipping methods
                rateReg.set(shippingAddress.getKey(), null);
                rateReg.set(shippingAddress.getCacheKey(), null);
                selectShippingMethodAction(shippingAddress);
                quote.shippingAddress(shippingAddress); // Trigger shipping method re-calculation
            }
        }

        function adjustQty(adjustment) {
            var currentQty = parseInt($qtyElement.val(), 10);
            var newQty = currentQty + adjustment;

            if (newQty > 0) {
                $qtyElement.val(newQty);
                updateCart();
            }
        }

        function setupEventHandlers() {
            // Handle quantity increase
            $(element).find('.increase').on('click', function () {
                adjustQty(1);
            });

            // Handle quantity decrease
            $(element).find('.decrease').on('click', function () {
                adjustQty(-1);
            });

            // Handle manual input changes with debounce
            $qtyElement.on('input', function () {
                debounce(updateCart, 500); // 500ms delay for debounce
            }).on('blur', function () {
                // Reset to original value if warning class exists
                if ($(this).hasClass('warning')) {
                    $(this).val(originalValue).removeClass('warning');
                }
            });
        }

        setupEventHandlers();
    };
});
