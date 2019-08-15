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

eval("/**\r\n * @name teaser.js\r\n * @description helper script to retrieve reviews and comments and render them on a page\r\n * @note this script is identical to the core teasers.js script, but it is needed in this particular directory for proper webpack compilation\r\n */\r\n\r\n/**\r\n * @function\r\n * @description The loadTeaserCounts function first loads the UGC counts maintained by TurnTo and then calls the ​populateTeaser​ function.\r\n * @name loadTeaserCounts\r\n * @param {String} sku the product ID \r\n */\r\nfunction loadTeaserCounts(sku) {\r\n\tvar xhr = new XMLHttpRequest();\r\n\tvar ugcCountsUrl = 'https://cdn-ws.' + turntoUrl +'/v5/sitedata/' + siteKey + '/' + sku + '/d/ugc/counts/' + turnToConfig.locale;\r\n\txhr.open('GET', ugcCountsUrl, true); \r\n\txhr.addEventListener('load', function() {\r\n\t\t/*sample return JSON\r\n\t\t\t{\r\n\t\t\t\t\"questions\": 0,\r\n\t\t\t\t\"directQuestions\": 0, \r\n\t\t\t\t\"answers\": 0, \r\n\t\t\t\t\"directAnswers\": 0, \r\n\t\t\t\t\"reviews\": 100,\r\n\t\t\t\t\"avgRating\": 2.91, \r\n\t\t\t\t\"relatedReviews\": 0, \r\n\t\t\t\t\"comments\": 0, \r\n\t\t\t\t\"active\": true\r\n\t\t\t}\r\n\t\t*/\r\n\t\tif (xhr.responseText) { \r\n\t\t\tpopulateTeaser(JSON.parse(xhr.responseText));\r\n\t\t} \r\n\t});\r\n\txhr.send(); \r\n}\r\n\r\n/**\r\n * @function\r\n * @name populateTeaser\r\n * @description This function calls other functions to build specific parts of your CGC Teaser. It should be modified to account for what content types you want to promote and/or the messaging you want based on the count returned. It ends with the ​writeReview​ function that spawns the TurnTo review form from your CGC Teaser. Note: If the reviews list and/or comments are initially hidden under a tab, see the ​Linking to your Content Underneath a Tab​ section for an example of how to handle this situation.\r\n * @param {Object} counts response from ugc counts URL\r\n */\r\nfunction populateTeaser(counts) {\r\n\tvar fragment = document.createDocumentFragment(); \r\n\tif (counts.reviews > 0) { // has reviews\r\n\t\t\tfragment.appendChild(generateTeaserStars(counts.avgRating)); \r\n\t\t\tfragment.appendChild(generateReadReviews(counts.reviews)); \r\n\t\t\tif (counts.questions > 0) {\r\n\t\t\t\tfragment.appendChild(document.createTextNode(' | '));\r\n\t\t\t\tfragment.appendChild(generateQuestions(counts.questions, counts.answers));\r\n\t\t\t} else if (counts.comments > 3) {\r\n\t\t\t\tfragment.appendChild(document.createTextNode(' | '));\r\n\t\t\t\tfragment.appendChild(generateReadComments(counts.comments)); \r\n\t\t\t} \r\n\t\t\tfragment.appendChild(document.createTextNode(' or '));\r\n\t\t\tfragment.appendChild(generateWriteReview('Write a Review')); \r\n\t} else { // no reviews\r\n\t\tif (counts.questions > 0) {\r\n\t\t\tfragment.appendChild(generateQuestions(counts.questions, counts.answers));\r\n\t\t\tfragment.appendChild(document.createTextNode(' or ')); \r\n\t\t} else if (counts.comments > 3) {\r\n\t\t\tfragment.appendChild(generateReadComments(counts.comments)); fragment.appendChild(document.createTextNode(' or '));\r\n\t\t}\r\n\t\tfragment.appendChild(generateWriteReview('Be the first to write a review'));\r\n\t}\r\n\tdocument.getElementById('tt-teaser').appendChild(fragment);\r\n\t// add event listener to handle click to open the write a review screen \r\n\tdocument.querySelector('.TTteaser__write-review').addEventListener('click', function(e) {\r\n\t\tTurnToCmd('reviewsList.writeReview');\r\n\t});\r\n}\r\n\r\n/**\r\n * @function\r\n * @name createTeaserElement\r\n * @description This is a helper function used by other functions to create an element with a specific tag name and class name. Optionally pass “text” to populate the element with the provided text.\r\n * @param {String} tag type of DOM element\r\n * @param {String} className name of the element class\r\n * @param {String} text value to be added to the element\r\n * @return {Object} el DOM object\r\n */\r\nfunction createTeaserElement(tag, className, text) { \r\n\tvar el = document.createElement(tag); \r\n\tel.setAttribute('class', className);\r\n\tif (text) {\r\n\t\tel.innerText = text; \r\n\t}\r\n\treturn el; \r\n}\r\n\r\n/**\r\n * @function\r\n * @name generateWriteReview\r\n * @description This function is called by the populateTeaser function to simply create a ‘Write a Review’ link. The click event handler for this element is added in the ​populateTeaser​ function after the teaser has been rendered on the page.\r\n * @param {String} text value to be added to the element\r\n * @return {Object} DOM object\r\n */\r\nfunction generateWriteReview(text) {\r\n\treturn createTeaserElement('button', 'TTteaser__write-review', text); \r\n}\r\n\r\n/**\r\n * @function\r\n * @name generateReadComments\r\n * @description This function is called by the populateTeaser function to generate the link that will move to the place in the page where the Checkout Comments are located by placing the name of the Checkout Comments div id in the href.\r\n * @param {Number} numComments\r\n * @return {Object} el DOM object\r\n */\r\nfunction generateReadComments(numComments) {\r\n\t// Populate the 'x Buyer Comments' text with the number of comments and set\r\n\tvar text = numComments + ' Buyer Comment' + (numComments > 1 ? 's' : '');\r\n\tvar el = createTeaserElement('a', 'TTteaser__read-comments', text);\r\n\tel.setAttribute('href', '#tt-chatter-widget');\r\n\treturn el; \r\n}\r\n\r\n/**\r\n * @function\r\n * @name generateReadReviews\r\n * @description This function is called by the populateTeaser function to generate the link that will move to the place in the page where the reviews list is located by placing the name of the reviews list div id in the href.\r\n * @param {Number} numReviews\r\n * @return {Object} el DOM object\r\n */\r\nfunction generateReadReviews(numReviews) {\r\n\t// Populate the 'Read x Reviews' text with the number of reviews and set\r\n\tvar text = 'Read ' + numReviews + ' Review' + (numReviews > 1 ? 's' : '');\r\n\tvar el = createTeaserElement('a', 'TTteaser__read-reviews', text);\r\n\tel.setAttribute('href', '#tt-reviews-list'); \r\n\treturn el;\r\n}\r\n\r\n/**\r\n * @function\r\n * @name generateTeaserStar\r\n * @description The generateTeaserStar function creates an SVG element that references one of three possible stars (full, half or empty). The SVGs must be defined at the top of the body of the page.\r\n * @param {String} starType\r\n * @return {Object} el DOM object\r\n */\r\nfunction generateTeaserStar(starType) { \r\n\tvar svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); \r\n\tsvgEl.setAttribute('class', 'TTteaser__icon--' + starType); \r\n\tuseEl = document.createElementNS('http://www.w3.org/2000/svg','use'); \r\n\tuseEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#tt-teaser-star--' + starType);\r\n\tsvgEl.appendChild(useEl);\r\n\tvar el = createTeaserElement('span', 'TTteaser__star'); \r\n\tel.appendChild(svgEl);\r\n\treturn el;\r\n}\r\n\r\n/**\r\n * @function\r\n * @name generateTeaserStars\r\n * @description The generateTeaserStars function is called by the ​populateTeaser​ function to create the review stars.\r\n * @param {String} rating\r\n * @return {Object} el DOM object\r\n */\r\nfunction generateTeaserStars(rating) {\r\n\tvar el = createTeaserElement('div', 'TTteaser__rating'); \r\n\tvar numFullStars = Math.floor(rating);\r\n\tfor (var i = 0; i < numFullStars; i++) {\r\n\t\tel.appendChild(generateTeaserStar('full')); \r\n\t}\r\n\tvar hasHalfStar = (rating - numFullStars) >= 0.5; \r\n\tif (hasHalfStar) {\r\n\t\tel.appendChild(generateTeaserStar('half')); \r\n\t}\r\n\tvar emptyStarsStartIdx = numFullStars + (hasHalfStar ? 1 : 0); \r\n\tfor (var i = emptyStarsStartIdx; i < 5; i++) {\r\n\t\tel.appendChild(generateTeaserStar('empty')); \r\n\t}\r\n\treturn el;\r\n}\r\n\r\n/**\r\n * @function\r\n * @name generateQuestions\r\n * @description The generateQuestions function is called by the populateTeaser function to generate the link that will move a user to the place in the page where the Q&A widgets are located. There are two possible places to link to depending on where you want to direct shoppers: The Instant Answers widget denoted by the anchor ​#tt-instant-answers-widget,​ or the Q&A list widget denoted by the anchor ​#tt-qa-list​.\r\n * @param {Number} num_questions\r\n * @param {Number} num_answers\r\n * @return {Object} el DOM object\r\n */\r\nfunction generateQuestions(num_questions, num_answers) {\r\n\t// Populate 'x Questions' text with the number of questions \r\n\tvar text = num_questions + ' Question' + (num_questions > 1 ? 's' : '');\r\n\t\r\n\t// then populate the number of answers \r\n\tif (num_answers > 0) {\r\n\t\ttext = text + ', ' + num_answers + ' Answer' + (num_answers > 1 ? 's' : '');\r\n\t}\r\n\tvar el = createTeaserElement('a', 'TTteaser__read-qa', text); \r\n\tel.setAttribute('href', '#tt-instant-answers-widget');\r\n\t\r\n\t//For the Q&A list widget set to the following \r\n\t//el.setAttribute('href', '#tt-qa-list');\r\n\t\r\n\treturn el; \r\n}\r\n\r\n/**\r\n * @function\r\n * @name generateReadComments\r\n * @description The generateQuestions is called by the populateTeaser function to generate the link that will move to the place in the page where the Checkout Comments are located by placing the name of the Checkout Comments div id in the href.\r\n * @param {Number} num_comments\r\n * @return {Object} el DOM object\r\n */\r\nfunction generateReadComments(numComments) {\r\n\t// Populate the 'x Buyer Comments' text with the number of comments and set\r\n\tvar text = numComments + ' Buyer Comment' + (numComments > 1 ? 's' : '');\r\n\tvar el = createTeaserElement('a', 'TTteaser__read-comments', text);\r\n\tel.setAttribute('href', '#tt-chatter-widget'); \r\n\t\r\n\treturn el;\r\n}\r\n\r\n/* Javascript to load on page load*/\r\n$(document).ready(function () {\r\n\t//PDP teasers only\r\n\tif( $('.product-id').length ) {\r\n\t\tloadTeaserCounts($('.product-id').text());\r\n\t}\r\n});\r\n\n\n//# sourceURL=webpack:///./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/teasers.js?");

/***/ })

/******/ });