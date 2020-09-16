/**
 * @name teaser.js
 * @description helper script to retrieve reviews and comments and render them on a page
 * @note this script is identical to the core teasers.js script, but it is needed in this particular directory for proper webpack compilation
 */

/**
 * @function
 * @description The loadTeaserCounts function first loads the UGC counts maintained by TurnTo and then calls the ​populateTeaser​ function.
 * @name loadTeaserCounts
 * @param {String} sku the product ID 
 */
function loadTeaserCounts(sku) {
	var xhr = new XMLHttpRequest();
	var turntoUrl = $('span.turntoUrl').text();
	var siteKey = $('span.siteKey').text();

	if(turntoUrl.length == 0 || siteKey.length == 0) {
		return;
	}
	
	var ugcCountsUrl = 'https://cdn-ws.' + turntoUrl +'/v5/sitedata/' + siteKey + '/' + sku + '/d/ugc/counts/' + turnToConfig.locale;
	xhr.open('GET', ugcCountsUrl, true);
	xhr.addEventListener('load', function() {
		/*sample return JSON
			{
				"questions": 0,
				"directQuestions": 0, 
				"answers": 0, 
				"directAnswers": 0, 
				"reviews": 100,
				"avgRating": 2.91, 
				"relatedReviews": 0, 
				"comments": 0, 
				"active": true
			}
		*/
		if (xhr.responseText) { 
			populateTeaser(JSON.parse(xhr.responseText));
		} 
	});
	xhr.send(); 
}

/**
 * @function
 * @name populateTeaser
 * @description This function calls other functions to build specific parts of your CGC Teaser. It should be modified to account for what content types you want to promote and/or the messaging you want based on the count returned. It ends with the ​writeReview​ function that spawns the TurnTo review form from your CGC Teaser. Note: If the reviews list and/or comments are initially hidden under a tab, see the ​Linking to your Content Underneath a Tab​ section for an example of how to handle this situation.
 * @param {Object} counts response from ugc counts URL
 */
function populateTeaser(counts) {
	var fragment = document.createDocumentFragment(); 
	if (counts.reviews > 0) { // has reviews
		fragment.appendChild(generateTeaserStars(counts.avgRating)); 
		fragment.appendChild(generateReadReviews(counts.reviews));
		if (counts.questions > 0) {
			fragment.appendChild(document.createTextNode(' | '));
			fragment.appendChild(generateQuestions(counts.questions, counts.answers));
		}
		if (counts.comments > 0) {
			fragment.appendChild(document.createTextNode(' | '));
			fragment.appendChild(generateReadComments(counts.comments)); 
		}
		fragment.appendChild(document.createTextNode(' or '));
		fragment.appendChild(generateWriteReview('Write a Review')); 
	} else { // no reviews
		if (counts.questions > 0) {
			fragment.appendChild(generateQuestions(counts.questions, counts.answers));
			fragment.appendChild(document.createTextNode(' or '));
		} 
		if (counts.comments > 0) {
			fragment.appendChild(generateReadComments(counts.comments)); 
			fragment.appendChild(document.createTextNode(' or '));
		}
		fragment.appendChild(generateWriteReview('Be the first to write a review'));
	}
	var teaserElem = document.getElementById('tt-teaser');
	if (!teaserElem) {
		return;
	}
	teaserElem.appendChild(fragment);
	// add event listener to handle click to open the write a review screen 
	document.querySelector('.TTteaser__write-review').addEventListener('click', function(e) {
		TurnToCmd('reviewsList.writeReview');
	});

	// add event listener to display the tab the reviews are displayed under
	document.querySelector('.TTteaser__read-reviews').addEventListener('click',
		function(e) { showTab(); }
	);

	// event listener to display the tab Q&A is displayed under
	document.querySelector('.TTteaser__read-qa').addEventListener('click',
		function(e) { showTab(); }
	);
}

/**
 * @function
 * @name showTab
 * @description This is a helper function used by other functions to open a tab on the PDP page
 * @param {String} tag type of tab to open
 */
function showTab() { 
	$('.tabs .reviews input').click();
}

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
 * @name generateWriteReview
 * @description This function is called by the populateTeaser function to simply create a ‘Write a Review’ link. The click event handler for this element is added in the ​populateTeaser​ function after the teaser has been rendered on the page.
 * @param {String} text value to be added to the element
 * @return {Object} DOM object
 */
function generateWriteReview(text) {
	return createTeaserElement('button', 'TTteaser__write-review', text); 
}

/**
 * @function
 * @name generateReadComments
 * @description This function is called by the populateTeaser function to generate the link that will move to the place in the page where the Checkout Comments are located by placing the name of the Checkout Comments div id in the href.
 * @param {Number} numComments
 * @return {Object} el DOM object
 */
function generateReadComments(numComments) {
	// Populate the 'x Buyer Comments' text with the number of comments and set
	var text = numComments + ' Buyer Comment' + (numComments > 1 ? 's' : '');
	var el = createTeaserElement('a', 'TTteaser__read-comments', text);
	el.setAttribute('href', '#tt-chatter-widget');
	return el; 
}

/**
 * @function
 * @name generateQuestions
 * @description This function is called by the populateTeaser function to generate the read questions
 * @param {Number} numQuestions
 * @return {Object} el DOM object
 */
function generateQuestions(num_questions, num_answers) {
	// Populate 'x Questions' text with the number of questions
	var text = num_questions + ' Question' + (num_questions > 1 ? 's' : '');
	
	// then populate the number of answers
	if (num_answers > 0) {
	 text = text + ', ' + num_answers + ' Answer' + (num_answers > 1 ? 's' : '');
	}
	
	var el = createTeaserElement('a', 'TTteaser__read-qa', text);
	 el.setAttribute('href', '#tt-instant-answers-widget');
	
	//For the Q&A list widget set to the following
	el.setAttribute('href', '#tt-qa-list');
	
	return el;
}

/**
 * @function
 * @name generateReadReviews
 * @description This function is called by the populateTeaser function to generate the link that will move to the place in the page where the reviews list is located by placing the name of the reviews list div id in the href.
 * @param {Number} numReviews
 * @return {Object} el DOM object
 */
function generateReadReviews(numReviews) {
	// Populate the 'Read x Reviews' text with the number of reviews and set
	var text = 'Read ' + numReviews + ' Review' + (numReviews > 1 ? 's' : '');
	var el = createTeaserElement('a', 'TTteaser__read-reviews', text);
	el.setAttribute('href', '#tt-reviews-list'); 
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
	//PDP teasers only
	if( $('span.productsku').text().length ) {
		loadTeaserCounts($('span.productsku').text());
	}
});

