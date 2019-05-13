'use strict';

module.exports = function (object, apiProduct) {

    Object.defineProperty(object, 'starRating', {
        enumerable: true,
        value: (Object.prototype.hasOwnProperty.call(apiProduct.custom, 'turntoAverageRating') && apiProduct.custom.turntoAverageRating) ? apiProduct.custom.turntoAverageRating : 0
    });
};
