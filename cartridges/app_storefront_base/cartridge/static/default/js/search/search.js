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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/search/search.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/search/search.js":
/*!*************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/search/search.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n/**\r\n * Update DOM elements with Ajax results\r\n *\r\n * @param {Object} $results - jQuery DOM element\r\n * @param {string} selector - DOM element to look up in the $results\r\n * @return {undefined}\r\n */\r\nfunction updateDom($results, selector) {\r\n    var $updates = $results.find(selector);\r\n    $(selector).empty().html($updates.html());\r\n}\r\n\r\n/**\r\n * Keep refinement panes expanded/collapsed after Ajax refresh\r\n *\r\n * @param {Object} $results - jQuery DOM element\r\n * @return {undefined}\r\n */\r\nfunction handleRefinements($results) {\r\n    $('.refinement.active').each(function () {\r\n        $(this).removeClass('active');\r\n\r\n        $results\r\n            .find('.' + $(this)[0].className.replace(/ /g, '.'))\r\n            .addClass('active');\r\n    });\r\n\r\n    updateDom($results, '.refinements');\r\n}\r\n\r\n/**\r\n * Parse Ajax results and updated select DOM elements\r\n *\r\n * @param {string} response - Ajax response HTML code\r\n * @return {undefined}\r\n */\r\nfunction parseResults(response) {\r\n    var $results = $(response);\r\n    var specialHandlers = {\r\n        '.refinements': handleRefinements\r\n    };\r\n\r\n    // Update DOM elements that do not require special handling\r\n    [\r\n        '.grid-header',\r\n        '.header-bar',\r\n        '.header.page-title',\r\n        '.product-grid',\r\n        '.show-more',\r\n        '.filter-bar'\r\n    ].forEach(function (selector) {\r\n        updateDom($results, selector);\r\n    });\r\n\r\n    Object.keys(specialHandlers).forEach(function (selector) {\r\n        specialHandlers[selector]($results);\r\n    });\r\n}\r\n\r\n/**\r\n * This function retrieves another page of content to display in the content search grid\r\n * @param {JQuery} $element - the jquery element that has the click event attached\r\n * @param {JQuery} $target - the jquery element that will receive the response\r\n * @return {undefined}\r\n */\r\nfunction getContent($element, $target) {\r\n    var showMoreUrl = $element.data('url');\r\n    $.spinner().start();\r\n    $.ajax({\r\n        url: showMoreUrl,\r\n        method: 'GET',\r\n        success: function (response) {\r\n            $target.append(response);\r\n            $.spinner().stop();\r\n        },\r\n        error: function () {\r\n            $.spinner().stop();\r\n        }\r\n    });\r\n}\r\n\r\n/**\r\n * Update sort option URLs from Ajax response\r\n *\r\n * @param {string} response - Ajax response HTML code\r\n * @return {undefined}\r\n */\r\nfunction updateSortOptions(response) {\r\n    var $tempDom = $('<div>').append($(response));\r\n    var sortOptions = $tempDom.find('.grid-footer').data('sort-options').options;\r\n    sortOptions.forEach(function (option) {\r\n        $('option.' + option.id).val(option.url);\r\n    });\r\n}\r\n\r\nmodule.exports = {\r\n    filter: function () {\r\n        // Display refinements bar when Menu icon clicked\r\n        $('.container').on('click', 'button.filter-results', function () {\r\n            $('.refinement-bar, .modal-background').show();\r\n        });\r\n    },\r\n\r\n    closeRefinments: function () {\r\n        // Refinements close button\r\n        $('.container').on('click', '.refinement-bar button.close, .modal-background', function () {\r\n            $('.refinement-bar, .modal-background').hide();\r\n        });\r\n    },\r\n\r\n    resize: function () {\r\n        // Close refinement bar and hide modal background if user resizes browser\r\n        $(window).resize(function () {\r\n            $('.refinement-bar, .modal-background').hide();\r\n        });\r\n    },\r\n\r\n    sort: function () {\r\n        // Handle sort order menu selection\r\n        $('.container').on('change', '[name=sort-order]', function (e) {\r\n            e.preventDefault();\r\n\r\n            $.spinner().start();\r\n            $(this).trigger('search:sort', this.value);\r\n            $.ajax({\r\n                url: this.value,\r\n                data: { selectedUrl: this.value },\r\n                method: 'GET',\r\n                success: function (response) {\r\n                    $('.product-grid').empty().html(response);\r\n                    $.spinner().stop();\r\n                },\r\n                error: function () {\r\n                    $.spinner().stop();\r\n                }\r\n            });\r\n        });\r\n    },\r\n\r\n    showMore: function () {\r\n        // Show more products\r\n        $('.container').on('click', '.show-more button', function (e) {\r\n            e.stopPropagation();\r\n            var showMoreUrl = $(this).data('url');\r\n\r\n            e.preventDefault();\r\n\r\n            $.spinner().start();\r\n            $(this).trigger('search:showMore', e);\r\n            $.ajax({\r\n                url: showMoreUrl,\r\n                data: { selectedUrl: showMoreUrl },\r\n                method: 'GET',\r\n                success: function (response) {\r\n                    $('.grid-footer').replaceWith(response);\r\n                    updateSortOptions(response);\r\n                    $.spinner().stop();\r\n                },\r\n                error: function () {\r\n                    $.spinner().stop();\r\n                }\r\n            });\r\n        });\r\n    },\r\n\r\n    applyFilter: function () {\r\n        // Handle refinement value selection and reset click\r\n        $('.container').on(\r\n            'click',\r\n            '.refinements li a, .refinement-bar a.reset, .filter-value a, .swatch-filter a',\r\n            function (e) {\r\n                e.preventDefault();\r\n                e.stopPropagation();\r\n\r\n                $.spinner().start();\r\n                $(this).trigger('search:filter', e);\r\n                $.ajax({\r\n                    url: e.currentTarget.href,\r\n                    data: {\r\n                        page: $('.grid-footer').data('page-number'),\r\n                        selectedUrl: e.currentTarget.href\r\n                    },\r\n                    method: 'GET',\r\n                    success: function (response) {\r\n                        parseResults(response);\r\n                        $.spinner().stop();\r\n                    },\r\n                    error: function () {\r\n                        $.spinner().stop();\r\n                    }\r\n                });\r\n            });\r\n    },\r\n\r\n    showContentTab: function () {\r\n        // Display content results from the search\r\n        $('.container').on('click', '.content-search', function () {\r\n            if ($('#content-search-results').html() === '') {\r\n                getContent($(this), $('#content-search-results'));\r\n            }\r\n        });\r\n\r\n        // Display the next page of content results from the search\r\n        $('.container').on('click', '.show-more-content button', function () {\r\n            getContent($(this), $('#content-search-results .result-count'));\r\n            $('.show-more-content').remove();\r\n        });\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/search/search.js?");

/***/ })

/******/ });