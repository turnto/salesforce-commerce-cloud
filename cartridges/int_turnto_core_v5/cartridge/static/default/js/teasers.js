/**
 * @name teaser.js
 * @description helper script to retrieve reviews and comments and render them on a page
 */

/**
 * @function
 * @description The ​loadTeaserCounts​ function first loads the UGC counts maintained by TurnTo and then calls the ​populateTeaser​ function.
 * @name loadTeaserCounts
 * @param {String} sku the product ID
 */
function loadTeaserCounts(sku) {
	var xhr = new XMLHttpRequest();
	var ugcCountsUrl = 'https://cdn-ws.turnto.com/v5/sitedata/' + siteKey + '/' + sku + '/d/ugc/counts/' + turnToConfig.locale;
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
			if (counts.comments > 0) {
				fragment.appendChild(document.createTextNode(' | '));
				fragment.appendChild(generateReadComments(counts.comments)); 
			}
			fragment.appendChild(document.createTextNode(' or '));
			fragment.appendChild(generateWriteReview('Write a Review')); 
	} else { // no reviews
		if (counts.comments > 0) {
			fragment.appendChild(generateReadComments(counts.comments)); 
			fragment.appendChild(document.createTextNode(' or '));
		}
		fragment.appendChild(generateWriteReview('Be the first to write a review'));
	}
	document.getElementById('tt-teaser').appendChild(fragment);
	// add event listener to handle click to open the write a review screen 
	document.querySelector('.TTteaser__write-review').addEventListener('click', function(e) { 
		TurnToCmd('reviewsList.writeReview');
	});
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
 * @description This function is called by the ​populateTeaser​ function to simply create a ‘Write a Review’ link. The click event handler for this element is added in the ​populateTeaser​ function after the teaser has been rendered on the page.
 * @param {String} text value to be added to the element
 * @return {Object} DOM object
 */
function generateWriteReview(text) {
	return createTeaserElement('button', 'TTteaser__write-review', text); 
}

/**
 * @function
 * @name generateReadComments
 * @description This function is called by the ​populateTeaser​ function to generate the link that will move to the place in the page where the Checkout Comments are located by placing the name of the Checkout Comments div id in the href.
 * @param {Number} numComments
 * @return {Object} el DOM object
 */
function generateReadComments(numComments) {
	// Populate the 'x Buyer Comments' text with the number of comments and set
	var text = numComments + ' Buyer Comment' + (numComments > 1 ? 's' : '');
	var el = createTeaserElement('a', 'TTteaser__read-comments', text);
	//HASH in front of tt-chatter-widget breaks page, had to delete to render page
	//el.setAttribute('href', '#tt-chatter-widget');
	return el; 
}

/**
 * @function
 * @name generateReadReviews
 * @description This function is called by the ​populateTeaser​ function to generate the link that will move to the place in the page where the reviews list is located by placing the name of the reviews list div id in the href.
 * @param {Number} numReviews
 * @return {Object} el DOM object
 */
function generateReadReviews(numReviews) {
	// Populate the 'Read x Reviews' text with the number of reviews and set
	var text = 'Read ' + numReviews + ' Review' + (numReviews > 1 ? 's' : '');
	var el = createTeaserElement('a', 'TTteaser__read-reviews', text);
	//HASH in front of tt-reviews-list breaks page, had to delete to render page
	//el.setAttribute('href', '#tt-reviews-list'); 
	return el;
}

/**
 * @function
 * @name generateTeaserStar
 * @description The ​generateTeaserStars​ function creates an SVG element that references one of three possible stars (full, half or empty). The SVGs must be defined at the top of the body of the page.
 * @param {String} starType
 * @return {Object} el DOM object
 */
function generateTeaserStar(starType) { 
	var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); 
	svgEl.setAttribute('class', 'TTteaser__icon--' + starType); 
	useEl = document.createElementNS('http://www.w3.org/2000/svg','use'); 
	//HASH in front of tt-teaser-start breaks page, had to delete to render page
	useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#tt-teaser-star--' + starType);
	svgEl.appendChild(useEl);
	var el = createTeaserElement('span', 'TTteaser__star'); 
	el.appendChild(svgEl);
	return el;
}

/**
 * @function
 * @name generateTeaserStars
 * @description The ​generateTeaserStars​ function is called by the ​populateTeaser​ function to create the review stars.
 * @param {String} rating
 * @return {Object} el DOM object
 */
function generateTeaserStars(rating) {
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
	return el;
}
