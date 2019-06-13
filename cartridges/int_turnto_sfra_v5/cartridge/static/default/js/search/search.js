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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/search/search.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/search/search.js":
/*!************************************************************************************!*\
  !*** ./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/search/search.js ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/**\n * Update DOM elements with Ajax results\n *\n * @param {Object} $results - jQuery DOM element\n * @param {string} selector - DOM element to look up in the $results\n * @return {undefined}\n */\nfunction updateDom($results, selector) {\n    var $updates = $results.find(selector);\n    $(selector).empty().html($updates.html());\n}\n\n/**\n * Keep refinement panes expanded/collapsed after Ajax refresh\n *\n * @param {Object} $results - jQuery DOM element\n * @return {undefined}\n */\nfunction handleRefinements($results) {\n    $('.refinement.active').each(function () {\n        $(this).removeClass('active');\n\n        $results\n            .find('.' + $(this)[0].className.replace(/ /g, '.'))\n            .addClass('active');\n    });\n\n    updateDom($results, '.refinements');\n}\n\n/**\n * Parse Ajax results and updated select DOM elements\n *\n * @param {string} response - Ajax response HTML code\n * @return {undefined}\n */\nfunction parseResults(response) {\n    var $results = $(response);\n    var specialHandlers = {\n        '.refinements': handleRefinements\n    };\n\n    // Update DOM elements that do not require special handling\n    [\n        '.grid-header',\n        '.header-bar',\n        '.header.page-title',\n        '.product-grid',\n        '.show-more',\n        '.filter-bar'\n    ].forEach(function (selector) {\n        updateDom($results, selector);\n    });\n\n    Object.keys(specialHandlers).forEach(function (selector) {\n        specialHandlers[selector]($results);\n    });\n}\n\n/**\n * This function retrieves another page of content to display in the content search grid\n * @param {JQuery} $element - the jquery element that has the click event attached\n * @param {JQuery} $target - the jquery element that will receive the response\n * @return {undefined}\n */\nfunction getContent($element, $target) {\n    var showMoreUrl = $element.data('url');\n    $.spinner().start();\n    $.ajax({\n        url: showMoreUrl,\n        method: 'GET',\n        success: function (response) {\n            $target.append(response);\n            $.spinner().stop();\n        },\n        error: function () {\n            $.spinner().stop();\n        }\n    });\n}\n\n/**\n * Update sort option URLs from Ajax response\n *\n * @param {string} response - Ajax response HTML code\n * @return {undefined}\n */\nfunction updateSortOptions(response) {\n    var $tempDom = $('<div>').append($(response));\n    var sortOptions = $tempDom.find('.grid-footer').data('sort-options').options;\n    sortOptions.forEach(function (option) {\n        $('option.' + option.id).val(option.url);\n    });\n}\n\nmodule.exports = {\n    filter: function () {\n        // Display refinements bar when Menu icon clicked\n        $('.container').on('click', 'button.filter-results', function () {\n            $('.refinement-bar, .modal-background').show();\n        });\n    },\n\n    closeRefinments: function () {\n        // Refinements close button\n        $('.container').on('click', '.refinement-bar button.close, .modal-background', function () {\n            $('.refinement-bar, .modal-background').hide();\n        });\n    },\n\n    resize: function () {\n        // Close refinement bar and hide modal background if user resizes browser\n        $(window).resize(function () {\n            $('.refinement-bar, .modal-background').hide();\n        });\n    },\n\n    sort: function () {\n        // Handle sort order menu selection\n        $('.container').on('change', '[name=sort-order]', function (e) {\n            e.preventDefault();\n\n            $.spinner().start();\n            $(this).trigger('search:sort', this.value);\n            $.ajax({\n                url: this.value,\n                data: { selectedUrl: this.value },\n                method: 'GET',\n                success: function (response) {\n                    $('.product-grid').empty().html(response);\n                    $.spinner().stop();\n                },\n                error: function () {\n                    $.spinner().stop();\n                }\n            });\n        });\n    },\n\n    showMore: function () {\n        // Show more products\n        $('.container').on('click', '.show-more button', function (e) {\n            e.stopPropagation();\n            var showMoreUrl = $(this).data('url');\n\n            e.preventDefault();\n\n            $.spinner().start();\n            $(this).trigger('search:showMore', e);\n            $.ajax({\n                url: showMoreUrl,\n                data: { selectedUrl: showMoreUrl },\n                method: 'GET',\n                success: function (response) {\n                    $('.grid-footer').replaceWith(response);\n                    updateSortOptions(response);\n                    $.spinner().stop();\n                },\n                error: function () {\n                    $.spinner().stop();\n                }\n            });\n        });\n    },\n\n    applyFilter: function () {\n        // Handle refinement value selection and reset click\n        $('.container').on(\n            'click',\n            '.refinements li a, .refinement-bar a.reset, .filter-value a, .swatch-filter a',\n            function (e) {\n                e.preventDefault();\n                e.stopPropagation();\n\n                $.spinner().start();\n                $(this).trigger('search:filter', e);\n                $.ajax({\n                    url: e.currentTarget.href,\n                    data: {\n                        page: $('.grid-footer').data('page-number'),\n                        selectedUrl: e.currentTarget.href\n                    },\n                    method: 'GET',\n                    success: function (response) {\n                        parseResults(response);\n                        $.spinner().stop();\n                    },\n                    error: function () {\n                        $.spinner().stop();\n                    }\n                });\n            });\n    },\n\n    showContentTab: function () {\n        // Display content results from the search\n        $('.container').on('click', '.content-search', function () {\n            if ($('#content-search-results').html() === '') {\n                getContent($(this), $('#content-search-results'));\n            }\n        });\n\n        // Display the next page of content results from the search\n        $('.container').on('click', '.show-more-content button', function () {\n            getContent($(this), $('#content-search-results .result-count'));\n            $('.show-more-content').remove();\n        });\n    }\n};\n\n\n//# sourceURL=webpack:///./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/search/search.js?");

/***/ })

/******/ });