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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/int_turnto_core_v5/cartridge/client/default/js/teasersproductgrid.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/int_turnto_core_v5/cartridge/client/default/js/teasersproductgrid.js":
/*!*****************************************************************************************!*\
  !*** ./cartridges/int_turnto_core_v5/cartridge/client/default/js/teasersproductgrid.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

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
  useEl = document.createElementNS('http://www.w3.org/2000/svg', 'use');
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

  var hasHalfStar = rating - numFullStars >= 0.5;

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

  for (var i = 0; i < allTeaserDivs.length; i++) {
    var teaserDiv = allTeaserDivs[i];

    if ('starrating' in teaserDiv.dataset && teaserDiv.dataset.starrating > 0) {
      generateTeaserStars(teaserDiv.dataset.productid, teaserDiv.dataset.starrating);
    }
  }
});

/***/ })

/******/ });
//# sourceMappingURL=teasersproductgrid.js.map