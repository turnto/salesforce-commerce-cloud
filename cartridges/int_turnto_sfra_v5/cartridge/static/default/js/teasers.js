/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/teasers.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/teasers.js":
/*!******************************************************************************!*\
  !*** ./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/teasers.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * @name teaser.js\n * @description helper script to retrieve reviews and comments and render them on a page\n * @note this script is identical to the core teasers.js script, but it is needed in this particular directory for proper webpack compilation\n */\n\n/**\n * @function\n * @description The loadTeaserCounts function first loads the UGC counts maintained by TurnTo and then calls the ​populateTeaser​ function.\n * @name loadTeaserCounts\n * @param {String} sku the product ID \n */\nfunction loadTeaserCounts(sku) {\n\tvar xhr = new XMLHttpRequest();\n\tvar turntoUrl = $('span.turntoUrl').text();\n\tvar siteKey = $('span.siteKey').text();\n\n\tif(turntoUrl.length == 0 || siteKey.length == 0) {\n\t\treturn;\n\t}\n\t\n\tvar ugcCountsUrl = 'https://cdn-ws.' + turntoUrl +'/v5/sitedata/' + siteKey + '/' + sku + '/d/ugc/counts/' + turnToConfig.locale;\n\txhr.open('GET', ugcCountsUrl, true);\n\txhr.addEventListener('load', function() {\n\t\t/*sample return JSON\n\t\t\t{\n\t\t\t\t\"questions\": 0,\n\t\t\t\t\"directQuestions\": 0, \n\t\t\t\t\"answers\": 0, \n\t\t\t\t\"directAnswers\": 0, \n\t\t\t\t\"reviews\": 100,\n\t\t\t\t\"avgRating\": 2.91, \n\t\t\t\t\"relatedReviews\": 0, \n\t\t\t\t\"comments\": 0, \n\t\t\t\t\"active\": true\n\t\t\t}\n\t\t*/\n\t\tif (xhr.responseText) { \n\t\t\tpopulateTeaser(JSON.parse(xhr.responseText));\n\t\t} \n\t});\n\txhr.send(); \n}\n\n/**\n * @function\n * @name populateTeaser\n * @description This function calls other functions to build specific parts of your CGC Teaser. It should be modified to account for what content types you want to promote and/or the messaging you want based on the count returned. It ends with the ​writeReview​ function that spawns the TurnTo review form from your CGC Teaser. Note: If the reviews list and/or comments are initially hidden under a tab, see the ​Linking to your Content Underneath a Tab​ section for an example of how to handle this situation.\n * @param {Object} counts response from ugc counts URL\n */\nfunction populateTeaser(counts) {\n\tvar fragment = document.createDocumentFragment(); \n\tif (counts.reviews > 0) { // has reviews\n\t\t\tfragment.appendChild(generateTeaserStars(counts.avgRating)); \n\t\t\tfragment.appendChild(generateReadReviews(counts.reviews));\n\t\t\tif (counts.questions > 0) {\n\t\t\t\tfragment.appendChild(document.createTextNode(' | '));\n\t\t\t\tfragment.appendChild(generateQuestions(counts.questions, counts.answers));\n\t\t\t}\n\t\t\tif (counts.comments > 0) {\n\t\t\t\tfragment.appendChild(document.createTextNode(' | '));\n\t\t\t\tfragment.appendChild(generateReadComments(counts.comments)); \n\t\t\t}\n\t\t\tfragment.appendChild(document.createTextNode(' or '));\n\t\t\tfragment.appendChild(generateWriteReview('Write a Review')); \n\t} else { // no reviews\n\t\tif (counts.questions > 0) {\n\t\t\tfragment.appendChild(generateQuestions(counts.questions, counts.answers));\n\t\t\tfragment.appendChild(document.createTextNode(' or '));\n\t\t} \n\t\tif (counts.comments > 0) {\n\t\t\tfragment.appendChild(generateReadComments(counts.comments)); \n\t\t\tfragment.appendChild(document.createTextNode(' or '));\n\t\t}\n\t\tfragment.appendChild(generateWriteReview('Be the first to write a review'));\n\t}\n\tvar teaserElem = document.getElementById('tt-teaser');\n\tif (!teaserElem) {\n\t\treturn;\n\t}\n\tteaserElem.appendChild(fragment);\n\t// add event listener to handle click to open the write a review screen \n\tdocument.querySelector('.TTteaser__write-review').addEventListener('click', function(e) {\n\t\tTurnToCmd('reviewsList.writeReview');\n\t});\n}\n\n/**\n * @function\n * @name createTeaserElement\n * @description This is a helper function used by other functions to create an element with a specific tag name and class name. Optionally pass “text” to populate the element with the provided text.\n * @param {String} tag type of DOM element\n * @param {String} className name of the element class\n * @param {String} text value to be added to the element\n * @return {Object} el DOM object\n */\nfunction createTeaserElement(tag, className, text) { \n\tvar el = document.createElement(tag); \n\tel.setAttribute('class', className);\n\tif (text) {\n\t\tel.innerText = text; \n\t}\n\treturn el; \n}\n\n/**\n * @function\n * @name generateWriteReview\n * @description This function is called by the populateTeaser function to simply create a ‘Write a Review’ link. The click event handler for this element is added in the ​populateTeaser​ function after the teaser has been rendered on the page.\n * @param {String} text value to be added to the element\n * @return {Object} DOM object\n */\nfunction generateWriteReview(text) {\n\treturn createTeaserElement('button', 'TTteaser__write-review', text); \n}\n\n/**\n * @function\n * @name generateReadComments\n * @description This function is called by the populateTeaser function to generate the link that will move to the place in the page where the Checkout Comments are located by placing the name of the Checkout Comments div id in the href.\n * @param {Number} numComments\n * @return {Object} el DOM object\n */\nfunction generateReadComments(numComments) {\n\t// Populate the 'x Buyer Comments' text with the number of comments and set\n\tvar text = numComments + ' Buyer Comment' + (numComments > 1 ? 's' : '');\n\tvar el = createTeaserElement('a', 'TTteaser__read-comments', text);\n\tel.setAttribute('href', '#tt-chatter-widget');\n\treturn el; \n}\n\n/**\n * @function\n * @name generateQuestions\n * @description This function is called by the populateTeaser function to generate the read questions\n * @param {Number} numQuestions\n * @return {Object} el DOM object\n */\nfunction generateQuestions(num_questions, num_answers) {\n\t// Populate 'x Questions' text with the number of questions\n\tvar text = num_questions + ' Question' + (num_questions > 1 ? 's' : '');\n\t\n\t// then populate the number of answers\n\tif (num_answers > 0) {\n\t text = text + ', ' + num_answers + ' Answer' + (num_answers > 1 ? 's' : '');\n\t}\n\t\n\tvar el = createTeaserElement('a', 'TTteaser__read-qa', text);\n\t el.setAttribute('href', '#tt-instant-answers-widget');\n\t\n\t//For the Q&A list widget set to the following\n\tel.setAttribute('href', '#tt-qa-list');\n\t\n\treturn el;\n}\n\n/**\n * @function\n * @name generateReadReviews\n * @description This function is called by the populateTeaser function to generate the link that will move to the place in the page where the reviews list is located by placing the name of the reviews list div id in the href.\n * @param {Number} numReviews\n * @return {Object} el DOM object\n */\nfunction generateReadReviews(numReviews) {\n\t// Populate the 'Read x Reviews' text with the number of reviews and set\n\tvar text = 'Read ' + numReviews + ' Review' + (numReviews > 1 ? 's' : '');\n\tvar el = createTeaserElement('a', 'TTteaser__read-reviews', text);\n\tel.setAttribute('href', '#tt-reviews-list'); \n\treturn el;\n}\n\n/**\n * @function\n * @name generateTeaserStar\n * @description The generateTeaserStars function creates an SVG element that references one of three possible stars (full, half or empty). The SVGs must be defined at the top of the body of the page.\n * @param {String} starType\n * @return {Object} el DOM object\n */\nfunction generateTeaserStar(starType) { \n\tvar svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');\n\tsvgEl.setAttribute('class', 'TTteaser__icon--' + starType);\n\tuseEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');\n\tuseEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',\n\t'#tt-teaser-star--' + starType);\n\tsvgEl.appendChild(useEl);\n\tvar el = createTeaserElement('span', 'TTteaser__star');\n\tel.appendChild(svgEl);\n\treturn el;\n}\n\n/**\n * @function\n * @name getAdjustedRating\n * @description the getAdjustedRating function adjusts/rounds the rating to have decimal value of .0 or .5\n * @param {String} rating\n * @return {Number} adjusted rating decimal value\n */\nfunction getAdjustedRating(rating) {\n\tvar floorValue = Math.floor(rating);\n\tvar rounded = Math.round(rating * 100) / 100;\n\tvar decimalValue = parseFloat((rounded - floorValue).toFixed(2));\n\tif (decimalValue < 0.25) {\n\t  return floorValue;\n\t} else if (decimalValue < 0.75) {\n\t  return floorValue + 0.5;\n\t}\n\treturn floorValue + 1;\n  }\n\n/**\n * @function\n * @name generateTeaserStars\n * @description The generateTeaserStars function is called by the ​populateTeaser​ function to create the review stars.\n * @param {String} rating\n * @return {Object} el DOM object\n */\nfunction generateTeaserStars(rating) {\n\tvar el = createTeaserElement('div', 'TTteaser__rating');\n\tvar adjustedRating = getAdjustedRating(rating);\n\tfor (var i = 1; i <= 5 ; i++) {\n\t  if (i > adjustedRating && i - adjustedRating >= 1) {\n\t\tel.appendChild(generateTeaserStar('empty'));\n\t  } else if (i <= adjustedRating) {\n\t\tel.appendChild(generateTeaserStar('full'));\n\t  } else {\n\t\tel.appendChild(generateTeaserStar('half'));\n\t  }\n\t}\n\treturn el;\n}\n\n/* Javascript to load on page load*/\n$(document).ready(function () {\n\t//PDP teasers only\n\tif( $('span.product-id').text().length ) {\n\t\tloadTeaserCounts($('span.product-id').text());\n\t}\n});\n\n\n//# sourceURL=webpack:///./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/teasers.js?");

/***/ })

/******/ });