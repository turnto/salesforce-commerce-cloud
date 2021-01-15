'use strict';

var assert = require('chai').assert;

var apiProductMock = {
    custom: {
        turntoAverageRating: null
    }
};

describe('int_turnto_sfra_v5/cartridge/models/product/decorators/ratingsTurnto', function () {
    var ratingsTurnto = require('../../../../../../cartridges/int_turnto_sfra_v5/cartridge/models/product/decorators/ratingsTurnto');

    it('should receive TurnTo rating 0', function () {
        var object = {};
        apiProductMock.custom = {};
        ratingsTurnto(object, apiProductMock);

        assert.equal(object.starRating, 0);
    });

    it('should receive TurnTo rating 4.1', function () {
        var object = {};
        apiProductMock.custom.turntoAverageRating = 4.1;
        ratingsTurnto(object, apiProductMock);

        assert.equal(object.starRating, 4.1);
    });
});
