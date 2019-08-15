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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js":
/*!****************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n/**\r\n * Populate the Billing Address Summary View\r\n * @param {string} parentSelector - the top level DOM selector for a unique address summary\r\n * @param {Object} address - the address data\r\n */\r\nfunction populateAddressSummary(parentSelector, address) {\r\n    $.each(address, function (attr) {\r\n        var val = address[attr];\r\n        $('.' + attr, parentSelector).text(val || '');\r\n    });\r\n}\r\n\r\n/**\r\n * returns a formed <option /> element\r\n * @param {Object} shipping - the shipping object (shipment model)\r\n * @param {boolean} selected - current shipping is selected (for PLI)\r\n * @param {order} order - the Order model\r\n * @param {Object} [options] - options\r\n * @returns {Object} - the jQuery / DOMElement\r\n */\r\nfunction optionValueForAddress(shipping, selected, order, options) {\r\n    var safeOptions = options || {};\r\n    var isBilling = safeOptions.type && safeOptions.type === 'billing';\r\n    var className = safeOptions.className || '';\r\n    var isSelected = selected;\r\n    var isNew = !shipping;\r\n    if (typeof shipping === 'string') {\r\n        return $('<option class=\"' + className + '\" disabled>' + shipping + '</option>');\r\n    }\r\n    var safeShipping = shipping || {};\r\n    var shippingAddress = safeShipping.shippingAddress || {};\r\n\r\n    if (isBilling && isNew && !order.billing.matchingAddressId) {\r\n        shippingAddress = order.billing.billingAddress.address || {};\r\n        isNew = false;\r\n        isSelected = true;\r\n        safeShipping.UUID = 'manual-entry';\r\n    }\r\n\r\n    var uuid = safeShipping.UUID ? safeShipping.UUID : 'new';\r\n    var optionEl = $('<option class=\"' + className + '\" />');\r\n    optionEl.val(uuid);\r\n\r\n    var title;\r\n\r\n    if (isNew) {\r\n        title = order.resources.addNewAddress;\r\n    } else {\r\n        title = [];\r\n        if (shippingAddress.firstName) {\r\n            title.push(shippingAddress.firstName);\r\n        }\r\n        if (shippingAddress.lastName) {\r\n            title.push(shippingAddress.lastName);\r\n        }\r\n        if (shippingAddress.address1) {\r\n            title.push(shippingAddress.address1);\r\n        }\r\n        if (shippingAddress.address2) {\r\n            title.push(shippingAddress.address2);\r\n        }\r\n        if (shippingAddress.city) {\r\n            if (shippingAddress.state) {\r\n                title.push(shippingAddress.city + ',');\r\n            } else {\r\n                title.push(shippingAddress.city);\r\n            }\r\n        }\r\n        if (shippingAddress.stateCode) {\r\n            title.push(shippingAddress.stateCode);\r\n        }\r\n        if (shippingAddress.postalCode) {\r\n            title.push(shippingAddress.postalCode);\r\n        }\r\n        if (!isBilling && safeShipping.selectedShippingMethod) {\r\n            title.push('-');\r\n            title.push(safeShipping.selectedShippingMethod.displayName);\r\n        }\r\n\r\n        if (title.length > 2) {\r\n            title = title.join(' ');\r\n        } else {\r\n            title = order.resources.newAddress;\r\n        }\r\n    }\r\n    optionEl.text(title);\r\n\r\n    var keyMap = {\r\n        'data-first-name': 'firstName',\r\n        'data-last-name': 'lastName',\r\n        'data-address1': 'address1',\r\n        'data-address2': 'address2',\r\n        'data-city': 'city',\r\n        'data-state-code': 'stateCode',\r\n        'data-postal-code': 'postalCode',\r\n        'data-country-code': 'countryCode',\r\n        'data-phone': 'phone'\r\n    };\r\n    $.each(keyMap, function (key) {\r\n        var mappedKey = keyMap[key];\r\n        var mappedValue = shippingAddress[mappedKey];\r\n        // In case of country code\r\n        if (mappedValue && typeof mappedValue === 'object') {\r\n            mappedValue = mappedValue.value;\r\n        }\r\n\r\n        optionEl.attr(key, mappedValue || '');\r\n    });\r\n\r\n    var giftObj = {\r\n        'data-is-gift': 'isGift',\r\n        'data-gift-message': 'giftMessage'\r\n    };\r\n\r\n    $.each(giftObj, function (key) {\r\n        var mappedKey = giftObj[key];\r\n        var mappedValue = safeShipping[mappedKey];\r\n        optionEl.attr(key, mappedValue || '');\r\n    });\r\n\r\n    if (isSelected) {\r\n        optionEl.attr('selected', true);\r\n    }\r\n\r\n    return optionEl;\r\n}\r\n\r\n/**\r\n * returns address properties from a UI form\r\n * @param {Form} form - the Form element\r\n * @returns {Object} - a JSON object with all values\r\n */\r\nfunction getAddressFieldsFromUI(form) {\r\n    var address = {\r\n        firstName: $('input[name$=_firstName]', form).val(),\r\n        lastName: $('input[name$=_lastName]', form).val(),\r\n        address1: $('input[name$=_address1]', form).val(),\r\n        address2: $('input[name$=_address2]', form).val(),\r\n        city: $('input[name$=_city]', form).val(),\r\n        postalCode: $('input[name$=_postalCode]', form).val(),\r\n        stateCode: $('select[name$=_stateCode],input[name$=_stateCode]', form).val(),\r\n        countryCode: $('select[name$=_country]', form).val(),\r\n        phone: $('input[name$=_phone]', form).val()\r\n    };\r\n    return address;\r\n}\r\n\r\nmodule.exports = {\r\n    methods: {\r\n        populateAddressSummary: populateAddressSummary,\r\n        optionValueForAddress: optionValueForAddress,\r\n        getAddressFieldsFromUI: getAddressFieldsFromUI\r\n    },\r\n\r\n    showDetails: function () {\r\n        $('.btn-show-details').on('click', function () {\r\n            var form = $(this).closest('form');\r\n\r\n            form.attr('data-address-mode', 'details');\r\n            form.find('.multi-ship-address-actions').removeClass('d-none');\r\n            form.find('.multi-ship-action-buttons .col-12.btn-save-multi-ship').addClass('d-none');\r\n        });\r\n    },\r\n\r\n    addNewAddress: function () {\r\n        $('.btn-add-new').on('click', function () {\r\n            var $el = $(this);\r\n            if ($el.parents('#dwfrm_billing').length > 0) {\r\n                // Handle billing address case\r\n                $('body').trigger('checkout:clearBillingForm');\r\n                var $option = $($el.parents('form').find('.addressSelector option')[0]);\r\n                $option.attr('value', 'new');\r\n                $option.text('New Address');\r\n                $option.prop('selected', 'selected');\r\n                $el.parents('[data-address-mode]').attr('data-address-mode', 'new');\r\n            } else {\r\n                // Handle shipping address case\r\n                var $newEl = $el.parents('form').find('.addressSelector option[value=new]');\r\n                $newEl.prop('selected', 'selected');\r\n                $newEl.parent().trigger('change');\r\n            }\r\n        });\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/checkout/address.js?");

/***/ })

/******/ });