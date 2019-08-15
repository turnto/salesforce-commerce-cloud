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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/summary.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/summary.js":
/*!****************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/checkout/summary.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n/**\r\n * updates the totals summary\r\n * @param {Array} totals - the totals data\r\n */\r\nfunction updateTotals(totals) {\r\n    $('.shipping-total-cost').text(totals.totalShippingCost);\r\n    $('.tax-total').text(totals.totalTax);\r\n    $('.sub-total').text(totals.subTotal);\r\n    $('.grand-total-sum').text(totals.grandTotal);\r\n\r\n    if (totals.orderLevelDiscountTotal.value > 0) {\r\n        $('.order-discount').show();\r\n        $('.order-discount-total').text('- ' + totals.orderLevelDiscountTotal.formatted);\r\n    } else {\r\n        $('.order-discount').hide();\r\n    }\r\n\r\n    if (totals.shippingLevelDiscountTotal.value > 0) {\r\n        $('.shipping-discount').show();\r\n        $('.shipping-discount-total').text('- ' +\r\n            totals.shippingLevelDiscountTotal.formatted);\r\n    } else {\r\n        $('.shipping-discount').hide();\r\n    }\r\n}\r\n\r\n/**\r\n * updates the order product shipping summary for an order model\r\n * @param {Object} order - the order model\r\n */\r\nfunction updateOrderProductSummaryInformation(order) {\r\n    var $productSummary = $('<div />');\r\n    order.shipping.forEach(function (shipping) {\r\n        shipping.productLineItems.items.forEach(function (lineItem) {\r\n            var pli = $('[data-product-line-item=' + lineItem.UUID + ']');\r\n            $productSummary.append(pli);\r\n        });\r\n\r\n        var address = shipping.shippingAddress || {};\r\n        var selectedMethod = shipping.selectedShippingMethod;\r\n\r\n        var nameLine = address.firstName ? address.firstName + ' ' : '';\r\n        if (address.lastName) nameLine += address.lastName;\r\n\r\n        var address1Line = address.address1;\r\n        var address2Line = address.address2;\r\n\r\n        var phoneLine = address.phone;\r\n\r\n        var shippingCost = selectedMethod ? selectedMethod.shippingCost : '';\r\n        var methodNameLine = selectedMethod ? selectedMethod.displayName : '';\r\n        var methodArrivalTime = selectedMethod && selectedMethod.estimatedArrivalTime\r\n            ? '( ' + selectedMethod.estimatedArrivalTime + ' )'\r\n            : '';\r\n\r\n        var tmpl = $('#pli-shipping-summary-template').clone();\r\n\r\n        if (shipping.productLineItems.items && shipping.productLineItems.items.length > 1) {\r\n            $('h5 > span').text(' - ' + shipping.productLineItems.items.length + ' '\r\n                + order.resources.items);\r\n        } else {\r\n            $('h5 > span').text('');\r\n        }\r\n\r\n        var stateRequiredAttr = $('#shippingState').attr('required');\r\n        var isRequired = stateRequiredAttr !== undefined && stateRequiredAttr !== false;\r\n        var stateExists = (shipping.shippingAddress && shipping.shippingAddress.stateCode)\r\n            ? shipping.shippingAddress.stateCode\r\n            : false;\r\n        var stateBoolean = false;\r\n        if ((isRequired && stateExists) || (!isRequired)) {\r\n            stateBoolean = true;\r\n        }\r\n\r\n        var shippingForm = $('.multi-shipping input[name=\"shipmentUUID\"][value=\"' + shipping.UUID + '\"]').parent();\r\n\r\n        if (shipping.shippingAddress\r\n            && shipping.shippingAddress.firstName\r\n            && shipping.shippingAddress.address1\r\n            && shipping.shippingAddress.city\r\n            && stateBoolean\r\n            && shipping.shippingAddress.countryCode\r\n            && (shipping.shippingAddress.phone || shipping.productLineItems.items[0].fromStoreId)) {\r\n            $('.ship-to-name', tmpl).text(nameLine);\r\n            $('.ship-to-address1', tmpl).text(address1Line);\r\n            $('.ship-to-address2', tmpl).text(address2Line);\r\n            $('.ship-to-city', tmpl).text(address.city);\r\n            if (address.stateCode) {\r\n                $('.ship-to-st', tmpl).text(address.stateCode);\r\n            }\r\n            $('.ship-to-zip', tmpl).text(address.postalCode);\r\n            $('.ship-to-phone', tmpl).text(phoneLine);\r\n\r\n            if (!address2Line) {\r\n                $('.ship-to-address2', tmpl).hide();\r\n            }\r\n\r\n            if (!phoneLine) {\r\n                $('.ship-to-phone', tmpl).hide();\r\n            }\r\n\r\n            shippingForm.find('.ship-to-message').text('');\r\n        } else {\r\n            shippingForm.find('.ship-to-message').text(order.resources.addressIncomplete);\r\n        }\r\n\r\n        if (shipping.isGift) {\r\n            $('.gift-message-summary', tmpl).text(shipping.giftMessage);\r\n        } else {\r\n            $('.gift-summary', tmpl).addClass('d-none');\r\n        }\r\n\r\n        // checking h5 title shipping to or pickup\r\n        var $shippingAddressLabel = $('.shipping-header-text', tmpl);\r\n        $('body').trigger('shipping:updateAddressLabelText',\r\n            { selectedShippingMethod: selectedMethod, resources: order.resources, shippingAddressLabel: $shippingAddressLabel });\r\n\r\n        if (shipping.selectedShippingMethod) {\r\n            $('.display-name', tmpl).text(methodNameLine);\r\n            $('.arrival-time', tmpl).text(methodArrivalTime);\r\n            $('.price', tmpl).text(shippingCost);\r\n        }\r\n\r\n        var $shippingSummary = $('<div class=\"multi-shipping\" data-shipment-summary=\"'\r\n            + shipping.UUID + '\" />');\r\n        $shippingSummary.html(tmpl.html());\r\n        $productSummary.append($shippingSummary);\r\n    });\r\n\r\n    $('.product-summary-block').html($productSummary.html());\r\n}\r\n\r\nmodule.exports = {\r\n    updateTotals: updateTotals,\r\n    updateOrderProductSummaryInformation: updateOrderProductSummaryInformation\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/checkout/summary.js?");

/***/ })

/******/ });