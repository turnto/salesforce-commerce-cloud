/**
 * @name teasersproductgrid.js
 * @description helper script to render reviews stars per product tile
 * @note this script is identical to the core teasersproductgrid.js script, but it is needed in this particular directory for proper webpack compilation
 */

/**
 * @function
 * @name createTeaserElement
 * @description This is a helper function used by other functions to create an element with a specific tag name and class name. Optionally pass “text” to populate the element with the provided text.
 * @param {String} tag type of DOM element
 * @param {String} className name of the element class
 * @param {String} text value to be added to the element
 * @return {Object} el DOM object
 */
function createTeaserElement(tag, className, text) { 
    var el = document.createElement(tag);
    el.setAttribute('class', className);
    if (text) {
        el.innerText = text;
    }
    return el;
}

/**
 * @function
 * @name generateTeaserStar
 * @description The generateTeaserStar function creates an SVG element that references one of three possible stars (full, half or empty). The SVGs must be defined at the top of the body of the page.
 * @param {String} starType
 * @return {Object} el DOM object
 */
function generateTeaserStar(starType) { 
	var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); 
	svgEl.setAttribute('class', 'TTteaser__icon--' + starType); 
	useEl = document.createElementNS('http://www.w3.org/2000/svg','use'); 
	useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#tt-teaser-star--' + starType);
	svgEl.appendChild(useEl);
	var el = createTeaserElement('span', 'TTteaser__star'); 
	el.appendChild(svgEl);
	return el;
}

/**
 * @function
 * @name generateTeaserStars
 * @description The generateTeaserStars function is called by the ​populateTeaser​ function to create the review stars.
 * @param {String} rating
 * @return {Object} el DOM object
 */
function generateTeaserStars(id, rating) {
	document.getElementById(id).innerHTML = "";
    var el = createTeaserElement('div', 'TTteaser__rating');
    var numFullStars = Math.floor(rating);
    for (var i = 0; i < numFullStars; i++) {
        el.appendChild(generateTeaserStar('full'));
    }
    var hasHalfStar = (rating - numFullStars) >= 0.5;
    if (hasHalfStar) {
        el.appendChild(generateTeaserStar('half'));
    }
    var emptyStarsStartIdx = numFullStars + (hasHalfStar ? 1 : 0);
    for (var i = emptyStarsStartIdx; i < 5; i++) {
        el.appendChild(generateTeaserStar('empty'));
    }
    document.getElementById(id).appendChild(el);
}

/* Javascript to load on page load*/
$(document).ready(function () {
	//product grid teaser stars ONLY
	var allTeaserDivs = document.getElementsByClassName('TTteaser');
	for(var i=0; i <  allTeaserDivs.length; i++) {
		var teaserDiv = allTeaserDivs[i];
		if('starrating' in teaserDiv.dataset && teaserDiv.dataset.starrating > 0) {
			generateTeaserStars(teaserDiv.dataset.productid, teaserDiv.dataset.starrating);
		}
	}
});
