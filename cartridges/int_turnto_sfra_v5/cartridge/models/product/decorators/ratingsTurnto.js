'use strict';

var Logger = require('dw/system/Logger');

module.exports = function (object, apiProduct) {
    Logger.info('INFO - TTTEST - in ratingsTurnto');
    Object.defineProperty(object, 'starRating', {
        enumerable: true,
        value: (Object.prototype.hasOwnProperty.call(apiProduct.custom, 'turntoAverageRating') && apiProduct.custom.turntoAverageRating) ? apiProduct.custom.turntoAverageRating : 0
    });
    Logger.info('INFO - TTTEST - in ratingsTurnto2');
};
