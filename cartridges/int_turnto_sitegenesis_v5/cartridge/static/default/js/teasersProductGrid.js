/**
 * @name teasersProductGrid.js
 * @description helper script to render reviews stars per product tile
 * @note this script is identical to the core teasersProductGrid.js script, but it is needed in this particular directory for proper webpack compilation
 */

/**
 * @function
 * @name createTeaserElementProductTile
 * @description This is a helper function used by other functions to create an element with a specific tag name and class name. Optionally pass “text” to populate the element with the provided text.
 * @param {String} tag type of DOM element
 * @param {String} className name of the element class
 * @param {String} text value to be added to the element
 * @return {Object} el DOM object
 */
function createTeaserElementProductTile(tag, className, text) { 
    var el = document.createElement(tag);
    el.setAttribute('class', className);
    if (text) {
        el.innerText = text;
    }
    return el;
}

/**
 * @function
 * @name generateTeaserStarProductTile
 * @description The generateTeaserStarProductTile function creates an SVG element that references one of three possible stars (full, half or empty). The SVGs must be defined at the top of the body of the page.
 * @param {String} starType
 * @return {Object} el DOM object
 */
function generateTeaserStarProductTile(starType) { 
	var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); 
	svgEl.setAttribute('class', 'TTteaser__icon--' + starType); 
	var useEl = document.createElementNS('http://www.w3.org/2000/svg','use'); 
	useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#tt-teaser-star--' + starType);
	svgEl.appendChild(useEl);
	var el = createTeaserElementProductTile('span', 'TTteaser__star'); 
	el.appendChild(svgEl);
	return el;
}

/**
 * @function
 * @name generateTeaserStarsProductTile
 * @description The generateTeaserStarsProductTile function is called by the ​populateTeaser​ function to create the review stars.
 * @param {String} rating
 * @return {Object} el DOM object
 */
function generateTeaserStarsProductTile(id, rating) {
    var el = createTeaserElementProductTile('div', 'TTteaser__rating');
    var numFullStars = Math.floor(rating);
    for (var i = 0; i < numFullStars; i++) {
        el.appendChild(generateTeaserStarProductTile('full'));
    }
    var hasHalfStar = (rating - numFullStars) >= 0.5;
    if (hasHalfStar) {
        el.appendChild(generateTeaserStarProductTile('half'));
    }
    var emptyStarsStartIdx = numFullStars + (hasHalfStar ? 1 : 0);
    for (var i = emptyStarsStartIdx; i < 5; i++) {
        el.appendChild(generateTeaserStarProductTile('empty'));
    }
    document.getElementById(id).appendChild(el);
}

/* Javascript to load on page load*/
$(document).ready(function () {
	//product grid teaser stars ONLY
	var allTeaserDivs = $('.product-tile .TTteaser');
	for(var i=0; i <  allTeaserDivs.length; i++) {
		var teaserDiv = allTeaserDivs[i];
		if('starrating' in teaserDiv.dataset && teaserDiv.dataset.starrating > 0) {
			generateTeaserStarsProductTile(teaserDiv.dataset.productid, teaserDiv.dataset.starrating);
		}
	}
});
