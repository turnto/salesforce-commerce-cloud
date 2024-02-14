'use strict';
var base = require('base/product/base');
var teasersModules = require('../teaser/teasersModules');

/**
 * Enable/disable UI elements
 * @param {boolean} enableOrDisable - true or false
 */
function updateAddToCartEnableDisableOtherElements(enableOrDisable) {
    $('button.add-to-cart-global').attr('disabled', enableOrDisable);
}

module.exports = {
    methods: {
        updateAddToCartEnableDisableOtherElements: updateAddToCartEnableDisableOtherElements
    },

    availability: base.availability,

    addToCart: base.addToCart,

    updateAttributesAndDetails: function () {
        $('body').on('product:statusUpdate', function (e, data) {
            var $productContainer = $('.product-detail[data-pid="' + data.id + '"]');

            $productContainer.find('.description-and-detail .product-attributes')
                .empty()
                .html(data.attributesHtml);

            if (data.shortDescription) {
                $productContainer.find('.description-and-detail .description')
                    .removeClass('hidden-xl-down');
                $productContainer.find('.description-and-detail .description .content')
                    .empty()
                    .html(data.shortDescription);
            } else {
                $productContainer.find('.description-and-detail .description')
                    .addClass('hidden-xl-down');
            }

            if (data.longDescription) {
                $productContainer.find('.description-and-detail .details')
                    .removeClass('hidden-xl-down');
                $productContainer.find('.description-and-detail .details .content')
                    .empty()
                    .html(data.longDescription);
            } else {
                $productContainer.find('.description-and-detail .details')
                    .addClass('hidden-xl-down');
            }
        });
    },

    showSpinner: function () {
        $('body').on('product:beforeAddToCart product:beforeAttributeSelect', function () {
            $.spinner().start();
        });
    },
    updateAttribute: function () {
        $('body').on('product:afterAttributeSelect', function (e, response) {
            if ($('.product-detail>.bundle-items').length) {
                response.container.data('pid', response.data.product.id);
                response.container.find('.product-id').text(response.data.product.id);
            } else if ($('.product-set-detail').eq(0)) {
                response.container.data('pid', response.data.product.id);
                response.container.find('.product-id').text(response.data.product.id);
            } else {
                $('.product-id').text(response.data.product.id);
                $('.product-detail').not('.bundle-item').data('pid', response.data.product.id);
            }
            // Only run if client has variant products enabled
            if (useVariantsPreference) {
                TurnToCmd('set', { sku: response.data.product.id }); // eslint-disable-line new-cap
                teasersModules.loadTeaserCounts(response.data.product.id);
                TurnToCmd('gallery.set', { skus: [response.data.product.id] });// eslint-disable-line new-cap
            }
        });
    },
    updateAddToCart: function () {
        $('body').on('product:updateAddToCart', function (e, response) {
            // update local add to cart (for sets)
            $('button.add-to-cart', response.$productContainer).attr('disabled',
                (!response.product.readyToOrder || !response.product.available));

            var enable = $('.product-availability').toArray().every(function (item) {
                return $(item).data('available') && $(item).data('ready-to-order');
            });
            module.exports.methods.updateAddToCartEnableDisableOtherElements(!enable);
        });
    },
    updateAvailability: function () {
        $('body').on('product:updateAvailability', function (e, response) {
            $('div.availability', response.$productContainer)
                .data('ready-to-order', response.product.readyToOrder)
                .data('available', response.product.available);

            $('.availability-msg', response.$productContainer)
                .empty().html(response.message);
            var $globalAvailabilityEl = $('.global-availability');
            if ($globalAvailabilityEl.length) {
                var $productAvailabilityEl = $('.product-availability');
                var allAvailable = $productAvailabilityEl.toArray()
                    .every(function (item) { return $(item).data('available'); });

                var allReady = $productAvailabilityEl.toArray()
                    .every(function (item) { return $(item).data('ready-to-order'); });

                $globalAvailabilityEl
                    .data('ready-to-order', allReady)
                    .data('available', allAvailable);

                $('.global-availability .availability-msg').empty()
                    .html(allReady ? response.message : response.resources.info_selectforstock);
            }
        });
    },
    sizeChart: function () {
        $('.size-chart a').on('click', function (e) {
            e.preventDefault();
            var url = $(this).attr('href');
            var $prodSizeChart = $(this).closest('.size-chart').find('.size-chart-collapsible');
            if ($prodSizeChart.is(':empty')) {
                $.ajax({
                    url: url,
                    type: 'get',
                    dataType: 'json',
                    success: function (data) {
                        $prodSizeChart.append(data.content);
                    }
                });
            }
            $prodSizeChart.toggleClass('active');
        });

        var $sizeChart = $('.size-chart-collapsible');
        $('body').on('click touchstart', function (e) {
            if ($('.size-chart').has(e.target).length <= 0) {
                $sizeChart.removeClass('active');
            }
        });
    },
    copyProductLink: function () {
        $('body').on('click', '#fa-link', function () {
            event.preventDefault();
            var $temp = $('<input>');
            var $messageEl = $('.copy-link-message');
            $('body').append($temp);
            $temp.val($('#shareUrl').val()).select();
            document.execCommand('copy');
            $temp.remove();
            $messageEl.attr('role', 'alert');
            $messageEl.removeClass('d-none');
            setTimeout(function () {
                $('.copy-link-message').addClass('d-none');
            }, 3000);
        });
    },

    focusChooseBonusProductModal: base.focusChooseBonusProductModal()
};
