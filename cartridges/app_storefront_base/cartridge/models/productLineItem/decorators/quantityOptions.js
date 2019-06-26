'use strict';

var ProductInventoryMgr = require('dw/catalog/ProductInventoryMgr');

/**
 * get the min and max numbers to display in the quantity drop down.
 * @param {Object} productLineItem - a line item of the basket.
 * @param {number} quantity - number of items for this product
 * @returns {Object} The minOrderQuantity and maxOrderQuantity to display in the quantity drop down.
 */
function getMinMaxQuantityOptions(productLineItem, quantity) {
    var availableToSell = productLineItem.product.availabilityModel.inventoryRecord.ATS.value;
    if (productLineItem.productInventoryListID) {
        var inventoryList = ProductInventoryMgr.getInventoryList(productLineItem.productInventoryListID);
        var inventoryRecord = inventoryList.getRecord(productLineItem.product.ID);
        availableToSell = inventoryRecord.ATS.value;
    }

    var max = Math.max(Math.min(availableToSell, 10), quantity);

    return {
        minOrderQuantity: productLineItem.product.minOrderQuantity.value || 1,
        maxOrderQuantity: max
    };
}

module.exports = function (object, productLineItem, quantity) {
    Object.defineProperty(object, 'quantityOptions', {
        enumerable: true,
        value: getMinMaxQuantityOptions(productLineItem, quantity)
    });
};
