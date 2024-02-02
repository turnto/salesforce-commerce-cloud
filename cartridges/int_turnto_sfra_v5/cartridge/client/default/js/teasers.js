'use strict';

var teasersModules = require('./teaser/teasersModules');

/* Javascript to load on page load*/
/* global turnToProductSku:readonly */
$(document).ready(function () {
	// PDP teasers only
    if ($('span.product-id').text().length) {
        teasersModules.loadTeaserCounts(turnToProductSku);
    }
});
