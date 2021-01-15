'use strict';

var teasersModules = require('./teaser/teasersModules');

/**
 * @name teasersProductGrid.js
 * @description helper script to render reviews stars per product tile
 * @note this script is identical to the core teasersProductGrid.js script, but it is needed in this particular directory for proper webpack compilation
 */

/* Javascript to load on page load*/
$(document).ready(function () {
	// product grid teaser stars ONLY
    var allTeaserDivs = document.getElementsByClassName('TTteaser');
    for (var i = 0; i < allTeaserDivs.length; i++) {
        var teaserDiv = allTeaserDivs[i];
        if ('starrating' in teaserDiv.dataset && teaserDiv.dataset.starrating > 0) {
            var el = teasersModules.generateTeaserStars(teaserDiv.dataset.starrating);
            document.getElementById(teaserDiv.dataset.productid).appendChild(el);
        }
    }
});
