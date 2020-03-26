/**
 * @name teasersProductGrid.js
 * @description helper script to render reviews stars per product tile
 * @note this script is identical to the core teasersProductGrid.js script, but it is needed in this particular directory for proper webpack compilation
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
 * @description The generateTeaserStars function creates an SVG element that references one of three possible stars (full, half or empty). The SVGs must be defined at the top of the body of the page.
 * @param {String} starType
 * @return {Object} el DOM object
 */
function generateTeaserStar(starType) { 
	var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svgEl.setAttribute('class', 'TTteaser__icon--' + starType);
	useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
	useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
	'#tt-teaser-star--' + starType);
	svgEl.appendChild(useEl);
	var el = createTeaserElement('span', 'TTteaser__star');
	el.appendChild(svgEl);
	return el;
}

/**
 * @function
 * @name getAdjustedRating
 * @description the getAdjustedRating function adjusts/rounds the rating to have decimal value of .0 or .5
 * @param {String} rating
 * @return {Number} adjusted rating decimal value
 */
function getAdjustedRating(rating) {
	var floorValue = Math.floor(rating);
	var rounded = Math.round(rating * 100) / 100;
	var decimalValue = parseFloat((rounded - floorValue).toFixed(2));
	if (decimalValue < 0.25) {
	  return floorValue;
	} else if (decimalValue < 0.75) {
	  return floorValue + 0.5;
	}
	return floorValue + 1;
  }

/**
 * @function
 * @name generateTeaserStars
 * @description The generateTeaserStars function is called by the ​populateTeaser​ function to create the review stars.
 * @param {String} rating
 * @return {Object} el DOM object
 */
function generateTeaserStars(rating) {
	var el = createTeaserElement('div', 'TTteaser__rating');
	var adjustedRating = getAdjustedRating(rating);
	for (var i = 1; i <= 5 ; i++) {
	  if (i > adjustedRating && i - adjustedRating >= 1) {
		el.appendChild(generateTeaserStar('empty'));
	  } else if (i <= adjustedRating) {
		el.appendChild(generateTeaserStar('full'));
	  } else {
		el.appendChild(generateTeaserStar('half'));
	  }
	}
	return el;
}

/* Javascript to load on page load*/
$(document).ready(function () {
	//product grid teaser stars ONLY
	var allTeaserDivs = document.getElementsByClassName('TTteaser');
	for(var i=0; i <  allTeaserDivs.length; i++) {
		var teaserDiv = allTeaserDivs[i];
		if('starrating' in teaserDiv.dataset && teaserDiv.dataset.starrating > 0) {
			var el = generateTeaserStars(teaserDiv.dataset.starrating);
			document.getElementById(teaserDiv.dataset.productid).appendChild(el);
		}
	}
});
