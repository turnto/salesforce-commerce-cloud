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

eval("/**\n * @name teasersProductGrid.js\n * @description helper script to render reviews stars per product tile\n * @note this script is identical to the core teasersProductGrid.js script, but it is needed in this particular directory for proper webpack compilation\n */\n\n/**\n * @function\n * @name createTeaserElement\n * @description This is a helper function used by other functions to create an element with a specific tag name and class name. Optionally pass “text” to populate the element with the provided text.\n * @param {String} tag type of DOM element\n * @param {String} className name of the element class\n * @param {String} text value to be added to the element\n * @return {Object} el DOM object\n */\nfunction createTeaserElement(tag, className, text) { \n    var el = document.createElement(tag);\n    el.setAttribute('class', className);\n    if (text) {\n        el.innerText = text;\n    }\n    return el;\n}\n\n/**\n * @function\n * @name generateTeaserStar\n * @description The generateTeaserStars function creates an SVG element that references one of three possible stars (full, half or empty). The SVGs must be defined at the top of the body of the page.\n * @param {String} starType\n * @return {Object} el DOM object\n */\nfunction generateTeaserStar(starType) { \n\tvar svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');\n\tsvgEl.setAttribute('class', 'TTteaser__icon--' + starType);\n\tuseEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');\n\tuseEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',\n\t'#tt-teaser-star--' + starType);\n\tsvgEl.appendChild(useEl);\n\tvar el = createTeaserElement('span', 'TTteaser__star');\n\tel.appendChild(svgEl);\n\treturn el;\n}\n\n/**\n * @function\n * @name getAdjustedRating\n * @description the getAdjustedRating function adjusts/rounds the rating to have decimal value of .0 or .5\n * @param {String} rating\n * @return {Number} adjusted rating decimal value\n */\nfunction getAdjustedRating(rating) {\n\tvar floorValue = Math.floor(rating);\n\tvar rounded = Math.round(rating * 100) / 100;\n\tvar decimalValue = parseFloat((rounded - floorValue).toFixed(2));\n\tif (decimalValue < 0.25) {\n\t  return floorValue;\n\t} else if (decimalValue < 0.75) {\n\t  return floorValue + 0.5;\n\t}\n\treturn floorValue + 1;\n  }\n\n/**\n * @function\n * @name generateTeaserStars\n * @description The generateTeaserStars function is called by the ​populateTeaser​ function to create the review stars.\n * @param {String} rating\n * @return {Object} el DOM object\n */\nfunction generateTeaserStars(rating) {\n\tvar el = createTeaserElement('div', 'TTteaser__rating');\n\tvar adjustedRating = getAdjustedRating(rating);\n\tfor (var i = 1; i <= 5 ; i++) {\n\t  if (i > adjustedRating && i - adjustedRating >= 1) {\n\t\tel.appendChild(generateTeaserStar('empty'));\n\t  } else if (i <= adjustedRating) {\n\t\tel.appendChild(generateTeaserStar('full'));\n\t  } else {\n\t\tel.appendChild(generateTeaserStar('half'));\n\t  }\n\t}\n\treturn el;\n}\n\n/* Javascript to load on page load*/\n$(document).ready(function () {\n\t//product grid teaser stars ONLY\n\tvar allTeaserDivs = document.getElementsByClassName('TTteaser');\n\tfor(var i=0; i <  allTeaserDivs.length; i++) {\n\t\tvar teaserDiv = allTeaserDivs[i];\n\t\tif('starrating' in teaserDiv.dataset && teaserDiv.dataset.starrating > 0) {\n\t\t\tvar el = generateTeaserStars(teaserDiv.dataset.starrating);\n\t\t\tdocument.getElementById(teaserDiv.dataset.productid).appendChild(el);\n\n\t\t}\n\t}\n});\n\n\n//# sourceURL=webpack:///./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/teasersproductgrid.js?");

/***/ })

/******/ });