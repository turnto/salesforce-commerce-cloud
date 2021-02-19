'use strict';

var ProductMgr = require('dw/catalog/ProductMgr');
var Status = require('dw/system/Status');
var Transaction = require('dw/system/Transaction');

/* Script Modules */
var TurnToHelper = require('*/cartridge/scripts/util/turnToHelperUtil');

// Globally scoped variables
var products;
var allowedLocales = TurnToHelper.getAllowedLocales();

/**
 * function is executed only ONCE
 * @param {*} parameters -
 * @returns {dw.system.Status} -
 */
function beforeStep(parameters) {
    if (parameters.IsDisabled) {
        return new Status(Status.OK, 'OK', 'Reset Data job step is disabled.');
    }

    var result = null;
    products = ProductMgr.queryAllSiteProducts();

	// Check mandatory parameters
    if (empty(parameters.DataType) || (parameters.DataType !== 'ratings' && parameters.DataType !== 'ugc')) {
        result = new Status(Status.ERROR, 'ERROR', 'Data Type is missing or value is invalid. Current data type: ' + parameters.DataType);
    }
    return result;
}

/**
 * A function that returns the total number of items that are available,
 * this function is called by the framework exactly once before chunk processing begins.
 * A known total count allows better monitoring.
 * For example, to show that 50 of 100 items have already been processed.
 * @returns {number} - count of Products
 */
function getTotalCount() {
    return !empty(products) ? products.count : 0;
}

/**
 * The read function returns either one product or nothing
 * It returns nothing if there are no more items available in the chunk
 * @returns {dw.catalog.Product} - next product
 */
function read() {
    return (products && products.hasNext()) ? products.next() : null;
}

/**
 * The function receives the item returned by the read function which is the next sequential product in the current chunk,
 * then resets either the reviews or UGC data depending on the "dataType" and then returns to the read function
 * for the next product in the chunk if there is one
 * @param {dw.catalog.Product} product -
 * @param {Object} parameters -
 */
function process(product, parameters) {
    if (!empty(product)) {
        var currentProduct = product;

		var logging = parameters.Logging;
		// Iterate all locales and reset TurnTo product attributes to an empty string;
        allowedLocales.forEach(function (currentLocale) {
			// set the request to the current locale so localized attributes will be used
            request.setLocale(currentLocale);
            try {
                Transaction.begin();
				// dataType is either "ratings" or "ugc"
                if (parameters.DataType === 'ratings') {
                    currentProduct.custom.turntoAverageRating = '';
                    currentProduct.custom.turntoReviewCount = 0;
                    currentProduct.custom.turntoRelatedReviewCount = 0;
                    currentProduct.custom.turntoCommentCount = 0;
                } else {
                    currentProduct.custom.turntoUserGeneratedContent = '';
                }

                Transaction.commit();
            } catch (e) {
                Transaction.rollback();
				if (logging) {
					TurnToHelper.getLogger().error('Product SKU {0} failed to reset due to {1}', product.ID, e.message);
				}
            }
        });
    }
}

/**
 * Empty write function, required to have the write function per Job Framework documentation even if it's empty
 */
function write() {
    return;
}

module.exports = {
    beforeStep: beforeStep,
    getTotalCount: getTotalCount,
    read: read,
    process: process,
    write: write
};
