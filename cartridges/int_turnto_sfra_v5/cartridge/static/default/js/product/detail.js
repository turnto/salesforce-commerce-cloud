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
eval("\nvar base = __webpack_require__(/*! ./detail */ \"./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/product/detail.js\");\n\nmodule.exports = {\n    availability: base.availability,\n\n    addToCart: base.addToCart,\n\n    updateAttributesAndDetails: function () {\n        $('body').on('product:statusUpdate', function (e, data) {\n            var $productContainer = $('.product-detail[data-pid=\"' + data.id + '\"]');\n\n            $productContainer.find('.description-and-detail .product-attributes')\n                .empty()\n                .html(data.attributesHtml);\n\n            if (data.shortDescription) {\n                $productContainer.find('.description-and-detail .description')\n                    .removeClass('hidden-xl-down');\n                $productContainer.find('.description-and-detail .description .content')\n                    .empty()\n                    .html(data.shortDescription);\n            } else {\n                $productContainer.find('.description-and-detail .description')\n                    .addClass('hidden-xl-down');\n            }\n\n            if (data.longDescription) {\n                $productContainer.find('.description-and-detail .details')\n                    .removeClass('hidden-xl-down');\n                $productContainer.find('.description-and-detail .details .content')\n                    .empty()\n                    .html(data.longDescription);\n            } else {\n                $productContainer.find('.description-and-detail .details')\n                    .addClass('hidden-xl-down');\n            }\n        });\n    },\n\n    showSpinner: function () {\n        $('body').on('product:beforeAddToCart product:beforeAttributeSelect', function () {\n            $.spinner().start();\n        });\n    },\n    updateAttribute: function () {\n        $('body').on('product:afterAttributeSelect', function (e, response) {\n            if ($('.product-detail>.bundle-items').length) {\n                response.container.data('pid', response.data.product.id);\n                response.container.find('.product-id').text(response.data.product.id);\n            } else if ($('.product-set-detail').eq(0)) {\n                response.container.data('pid', response.data.product.id);\n                response.container.find('.product-id').text(response.data.product.id);\n            } else {\n                $('.product-id').text(response.data.product.id);\n                $('.product-detail:not(\".bundle-item\")').data('pid', response.data.product.id);\n            }\n            TurnToCmd('set', {'sku': response.data.product.id});\n        });\n        \n    },\n    updateAddToCart: function () {\n        $('body').on('product:updateAddToCart', function (e, response) {\n            // update local add to cart (for sets)\n            $('button.add-to-cart', response.$productContainer).attr('disabled',\n                (!response.product.readyToOrder || !response.product.available));\n\n            var enable = $('.product-availability').toArray().every(function (item) {\n                return $(item).data('available') && $(item).data('ready-to-order');\n            });\n            $('button.add-to-cart-global').attr('disabled', !enable);\n        });\n    },\n    updateAvailability: function () {\n        $('body').on('product:updateAvailability', function (e, response) {\n            $('div.availability', response.$productContainer)\n                .data('ready-to-order', response.product.readyToOrder)\n                .data('available', response.product.available);\n\n            $('.availability-msg', response.$productContainer)\n                .empty().html(response.message);\n\n            if ($('.global-availability').length) {\n                var allAvailable = $('.product-availability').toArray()\n                    .every(function (item) { return $(item).data('available'); });\n\n                var allReady = $('.product-availability').toArray()\n                    .every(function (item) { return $(item).data('ready-to-order'); });\n\n                $('.global-availability')\n                    .data('ready-to-order', allReady)\n                    .data('available', allAvailable);\n\n                $('.global-availability .availability-msg').empty()\n                    .html(allReady ? response.message : response.resources.info_selectforstock);\n            }\n        });\n    },\n    sizeChart: function () {\n        var $sizeChart = $('.size-chart-collapsible');\n        $('.size-chart a').on('click', function (e) {\n            e.preventDefault();\n            var url = $(this).attr('href');\n            if ($sizeChart.is(':empty')) {\n                $.ajax({\n                    url: url,\n                    type: 'get',\n                    dataType: 'json',\n                    success: function (data) {\n                        $sizeChart.append(data.content);\n                    }\n                });\n            }\n            $sizeChart.toggleClass('active');\n        });\n\n        $('body').on('click touchstart', function (e) {\n            if ($('.size-chart').has(e.target).length <= 0) {\n                $sizeChart.removeClass('active');\n            }\n        });\n    }\n};\n\n\n//# sourceURL=webpack:///./cartridges/int_turnto_sfra_v5/cartridge/client/default/js/product/detail.js?");

/***/ })

/******/ });