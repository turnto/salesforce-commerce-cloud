'use strict';

var Logger = require('dw/system/Logger');

module.exports = function (object, apiProduct) {
    Object.defineProperty(object, 'starRating', {
        enumerable: true,
        value: (Object.prototype.hasOwnProperty.call(apiProduct.custom, 'turntoAverageRating') && apiProduct.custom.turntoAverageRating) ? apiProduct.custom.turntoAverageRating : 0
    });
};
