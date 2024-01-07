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
        function adjustQty(adjustment) {
            var currentQty = parseInt($(element).find('.qty').val());
            var newQty = currentQty + adjustment;
            $(element).find('.qty').val(newQty);
        }

        $(element).find('.increase').on('click', function () {
            adjustQty(1);
        });

        $(element).find('.decrease').on('click', function () {
            adjustQty(-1);
        });
    };
});