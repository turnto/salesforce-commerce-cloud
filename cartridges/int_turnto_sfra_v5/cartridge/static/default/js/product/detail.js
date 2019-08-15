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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/product/detail.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/product/detail.js":
/*!*************************************************************************************!*\
  !*** ./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/product/detail.js ***!
  \*************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar base = __webpack_require__(/*! ./detail */ \"./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/product/detail.js\");\r\n\r\nmodule.exports = {\r\n    availability: base.availability,\r\n\r\n    addToCart: base.addToCart,\r\n\r\n    updateAttributesAndDetails: function () {\r\n        $('body').on('product:statusUpdate', function (e, data) {\r\n            var $productContainer = $('.product-detail[data-pid=\"' + data.id + '\"]');\r\n\r\n            $productContainer.find('.description-and-detail .product-attributes')\r\n                .empty()\r\n                .html(data.attributesHtml);\r\n\r\n            if (data.shortDescription) {\r\n                $productContainer.find('.description-and-detail .description')\r\n                    .removeClass('hidden-xl-down');\r\n                $productContainer.find('.description-and-detail .description .content')\r\n                    .empty()\r\n                    .html(data.shortDescription);\r\n            } else {\r\n                $productContainer.find('.description-and-detail .description')\r\n                    .addClass('hidden-xl-down');\r\n            }\r\n\r\n            if (data.longDescription) {\r\n                $productContainer.find('.description-and-detail .details')\r\n                    .removeClass('hidden-xl-down');\r\n                $productContainer.find('.description-and-detail .details .content')\r\n                    .empty()\r\n                    .html(data.longDescription);\r\n            } else {\r\n                $productContainer.find('.description-and-detail .details')\r\n                    .addClass('hidden-xl-down');\r\n            }\r\n        });\r\n    },\r\n\r\n    showSpinner: function () {\r\n        $('body').on('product:beforeAddToCart product:beforeAttributeSelect', function () {\r\n            $.spinner().start();\r\n        });\r\n    },\r\n    updateAttribute: function () {\r\n        $('body').on('product:afterAttributeSelect', function (e, response) {\r\n            if ($('.product-detail>.bundle-items').length) {\r\n                response.container.data('pid', response.data.product.id);\r\n                response.container.find('.product-id').text(response.data.product.id);\r\n            } else if ($('.product-set-detail').eq(0)) {\r\n                response.container.data('pid', response.data.product.id);\r\n                response.container.find('.product-id').text(response.data.product.id);\r\n            } else {\r\n                $('.product-id').text(response.data.product.id);\r\n                $('.product-detail:not(\".bundle-item\")').data('pid', response.data.product.id);\r\n            }\r\n            TurnToCmd('set', {'sku': response.data.product.id});\r\n        });\r\n        \r\n    },\r\n    updateAddToCart: function () {\r\n        $('body').on('product:updateAddToCart', function (e, response) {\r\n            // update local add to cart (for sets)\r\n            $('button.add-to-cart', response.$productContainer).attr('disabled',\r\n                (!response.product.readyToOrder || !response.product.available));\r\n\r\n            var enable = $('.product-availability').toArray().every(function (item) {\r\n                return $(item).data('available') && $(item).data('ready-to-order');\r\n            });\r\n            $('button.add-to-cart-global').attr('disabled', !enable);\r\n        });\r\n    },\r\n    updateAvailability: function () {\r\n        $('body').on('product:updateAvailability', function (e, response) {\r\n            $('div.availability', response.$productContainer)\r\n                .data('ready-to-order', response.product.readyToOrder)\r\n                .data('available', response.product.available);\r\n\r\n            $('.availability-msg', response.$productContainer)\r\n                .empty().html(response.message);\r\n\r\n            if ($('.global-availability').length) {\r\n                var allAvailable = $('.product-availability').toArray()\r\n                    .every(function (item) { return $(item).data('available'); });\r\n\r\n                var allReady = $('.product-availability').toArray()\r\n                    .every(function (item) { return $(item).data('ready-to-order'); });\r\n\r\n                $('.global-availability')\r\n                    .data('ready-to-order', allReady)\r\n                    .data('available', allAvailable);\r\n\r\n                $('.global-availability .availability-msg').empty()\r\n                    .html(allReady ? response.message : response.resources.info_selectforstock);\r\n            }\r\n        });\r\n    },\r\n    sizeChart: function () {\r\n        var $sizeChart = $('.size-chart-collapsible');\r\n        $('.size-chart a').on('click', function (e) {\r\n            e.preventDefault();\r\n            var url = $(this).attr('href');\r\n            if ($sizeChart.is(':empty')) {\r\n                $.ajax({\r\n                    url: url,\r\n                    type: 'get',\r\n                    dataType: 'json',\r\n                    success: function (data) {\r\n                        $sizeChart.append(data.content);\r\n                    }\r\n                });\r\n            }\r\n            $sizeChart.toggleClass('active');\r\n        });\r\n\r\n        $('body').on('click touchstart', function (e) {\r\n            if ($('.size-chart').has(e.target).length <= 0) {\r\n                $sizeChart.removeClass('active');\r\n            }\r\n        });\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/product/detail.js?");

/***/ })

/******/ });