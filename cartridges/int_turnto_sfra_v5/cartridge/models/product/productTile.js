'use strict';
var base = module.superModule;
var ratingsDecorator = require('~/cartridge/models/product/decorators/ratingsTurnto');

/**
 * Decorate product with product tile information
 * @param {Object} product - Product Model to be decorated
 * @param {dw.catalog.Product} apiProduct - Product information returned by the script API
 * @param {string} productType - Product type information
 *
 * @returns {Object} - Decorated product model
 */
module.exports = function productTile(product, apiProduct, productType) {
	base.call(this, product, apiProduct, productType);
	ratingsDecorator(product, apiProduct);

    return product;
};
