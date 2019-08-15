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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/teasersproductgrid.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/teasersproductgrid.js":
/*!*****************************************************************************************!*\
  !*** ./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/teasersproductgrid.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\r\n * @name teasersproductgrid.js\r\n * @description helper script to render reviews stars per product tile\r\n * @note this script is identical to the core teasersproductgrid.js script, but it is needed in this particular directory for proper webpack compilation\r\n */\r\n\r\n/**\r\n * @function\r\n * @name createTeaserElement\r\n * @description This is a helper function used by other functions to create an element with a specific tag name and class name. Optionally pass “text” to populate the element with the provided text.\r\n * @param {String} tag type of DOM element\r\n * @param {String} className name of the element class\r\n * @param {String} text value to be added to the element\r\n * @return {Object} el DOM object\r\n */\r\nfunction createTeaserElement(tag, className, text) { \r\n    var el = document.createElement(tag);\r\n    el.setAttribute('class', className);\r\n    if (text) {\r\n        el.innerText = text;\r\n    }\r\n    return el;\r\n}\r\n\r\n/**\r\n * @function\r\n * @name generateTeaserStar\r\n * @description The generateTeaserStar function creates an SVG element that references one of three possible stars (full, half or empty). The SVGs must be defined at the top of the body of the page.\r\n * @param {String} starType\r\n * @return {Object} el DOM object\r\n */\r\nfunction generateTeaserStar(starType) { \r\n\tvar svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); \r\n\tsvgEl.setAttribute('class', 'TTteaser__icon--' + starType); \r\n\tuseEl = document.createElementNS('http://www.w3.org/2000/svg','use'); \r\n\tuseEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#tt-teaser-star--' + starType);\r\n\tsvgEl.appendChild(useEl);\r\n\tvar el = createTeaserElement('span', 'TTteaser__star'); \r\n\tel.appendChild(svgEl);\r\n\treturn el;\r\n}\r\n\r\n/**\r\n * @function\r\n * @name generateTeaserStars\r\n * @description The generateTeaserStars function is called by the ​populateTeaser​ function to create the review stars.\r\n * @param {String} rating\r\n * @return {Object} el DOM object\r\n */\r\nfunction generateTeaserStars(id, rating) {\r\n\tdocument.getElementById(id).innerHTML = \"\";\r\n    var el = createTeaserElement('div', 'TTteaser__rating');\r\n    var numFullStars = Math.floor(rating);\r\n    for (var i = 0; i < numFullStars; i++) {\r\n        el.appendChild(generateTeaserStar('full'));\r\n    }\r\n    var hasHalfStar = (rating - numFullStars) >= 0.5;\r\n    if (hasHalfStar) {\r\n        el.appendChild(generateTeaserStar('half'));\r\n    }\r\n    var emptyStarsStartIdx = numFullStars + (hasHalfStar ? 1 : 0);\r\n    for (var i = emptyStarsStartIdx; i < 5; i++) {\r\n        el.appendChild(generateTeaserStar('empty'));\r\n    }\r\n    document.getElementById(id).appendChild(el);\r\n}\r\n\r\n/* Javascript to load on page load*/\r\n$(document).ready(function () {\r\n\t//product grid teaser stars ONLY\r\n\tvar allTeaserDivs = document.getElementsByClassName('TTteaser');\r\n\tfor(var i=0; i <  allTeaserDivs.length; i++) {\r\n\t\tvar teaserDiv = allTeaserDivs[i];\r\n\t\tif('starrating' in teaserDiv.dataset && teaserDiv.dataset.starrating > 0) {\r\n\t\t\tgenerateTeaserStars(teaserDiv.dataset.productid, teaserDiv.dataset.starrating);\r\n\t\t}\r\n\t}\r\n});\r\n\n\n//# sourceURL=webpack:///./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/teasersproductgrid.js?");

/***/ })

/******/ });