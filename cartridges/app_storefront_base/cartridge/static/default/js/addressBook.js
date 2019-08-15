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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/addressBook.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/addressBook.js":
/*!***********************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/addressBook.js ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nvar processInclude = __webpack_require__(/*! ./util */ \"./cartridges/app_storefront_base/cartridge/client/default/js/util.js\");\r\n\r\n$(document).ready(function () {\r\n    processInclude(__webpack_require__(/*! ./addressBook/addressBook */ \"./cartridges/app_storefront_base/cartridge/client/default/js/addressBook/addressBook.js\"));\r\n});\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/addressBook.js?");

/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/addressBook/addressBook.js":
/*!***********************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/addressBook/addressBook.js ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nvar formValidation = __webpack_require__(/*! ../components/formValidation */ \"./cartridges/app_storefront_base/cartridge/client/default/js/components/formValidation.js\");\r\n\r\nvar url;\r\nvar isDefault;\r\n\r\n/**\r\n * Create an alert to display the error message\r\n * @param {Object} message - Error message to display\r\n */\r\nfunction createErrorNotification(message) {\r\n    var errorHtml = '<div class=\"alert alert-danger alert-dismissible valid-cart-error ' +\r\n        'fade show\" role=\"alert\">' +\r\n        '<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">' +\r\n        '<span aria-hidden=\"true\">&times;</span>' +\r\n        '</button>' + message + '</div>';\r\n\r\n    $('.error-messaging').append(errorHtml);\r\n}\r\n\r\nmodule.exports = {\r\n    removeAddress: function () {\r\n        $('.remove-address').on('click', function (e) {\r\n            e.preventDefault();\r\n            isDefault = $(this).data('default');\r\n            if (isDefault) {\r\n                url = $(this).data('url')\r\n                    + '?addressId='\r\n                    + $(this).data('id')\r\n                    + '&isDefault='\r\n                    + isDefault;\r\n            } else {\r\n                url = $(this).data('url') + '?addressId=' + $(this).data('id');\r\n            }\r\n            $('.product-to-remove').empty().append($(this).data('id'));\r\n        });\r\n    },\r\n\r\n    removeAddressConfirmation: function () {\r\n        $('.delete-confirmation-btn').click(function (e) {\r\n            e.preventDefault();\r\n            $.ajax({\r\n                url: url,\r\n                type: 'get',\r\n                dataType: 'json',\r\n                success: function (data) {\r\n                    $('#uuid-' + data.UUID).remove();\r\n                    if (isDefault) {\r\n                        var addressId = $('.card .address-heading').first().text();\r\n                        var addressHeading = addressId + ' (' + data.defaultMsg + ')';\r\n                        $('.card .address-heading').first().text(addressHeading);\r\n                        $('.card .card-make-default-link').first().remove();\r\n                        $('.remove-address').data('default', true);\r\n                        if (data.message) {\r\n                            var toInsert = '<div><h3>' +\r\n                                data.message +\r\n                                '</h3><div>';\r\n                            $('.addressList').after(toInsert);\r\n                        }\r\n                    }\r\n                },\r\n                error: function (err) {\r\n                    if (err.responseJSON.redirectUrl) {\r\n                        window.location.href = err.responseJSON.redirectUrl;\r\n                    } else {\r\n                        createErrorNotification(err.responseJSON.errorMessage);\r\n                    }\r\n                    $.spinner().stop();\r\n                }\r\n            });\r\n        });\r\n    },\r\n\r\n    submitAddress: function () {\r\n        $('form.address-form').submit(function (e) {\r\n            var $form = $(this);\r\n            e.preventDefault();\r\n            url = $form.attr('action');\r\n            $form.spinner().start();\r\n            $('form.address-form').trigger('address:submit', e);\r\n            $.ajax({\r\n                url: url,\r\n                type: 'post',\r\n                dataType: 'json',\r\n                data: $form.serialize(),\r\n                success: function (data) {\r\n                    $form.spinner().stop();\r\n                    if (!data.success) {\r\n                        formValidation($form, data);\r\n                    } else {\r\n                        location.href = data.redirectUrl;\r\n                    }\r\n                },\r\n                error: function (err) {\r\n                    if (err.responseJSON.redirectUrl) {\r\n                        window.location.href = err.responseJSON.redirectUrl;\r\n                    }\r\n                    $form.spinner().stop();\r\n                }\r\n            });\r\n            return false;\r\n        });\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/addressBook/addressBook.js?");

/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/components/formValidation.js":
/*!*************************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/components/formValidation.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n/**\r\n * Remove all validation. Should be called every time before revalidating form\r\n * @param {element} form - Form to be cleared\r\n * @returns {void}\r\n */\r\nfunction clearFormErrors(form) {\r\n    $(form).find('.form-control.is-invalid').removeClass('is-invalid');\r\n}\r\n\r\nmodule.exports = function (formElement, payload) {\r\n    // clear form validation first\r\n    clearFormErrors(formElement);\r\n    $('.alert', formElement).remove();\r\n\r\n    if (typeof payload === 'object' && payload.fields) {\r\n        Object.keys(payload.fields).forEach(function (key) {\r\n            if (payload.fields[key]) {\r\n                var feedbackElement = $(formElement).find('[name=\"' + key + '\"]')\r\n                    .parent()\r\n                    .children('.invalid-feedback');\r\n\r\n                if (feedbackElement.length > 0) {\r\n                    if (Array.isArray(payload[key])) {\r\n                        feedbackElement.html(payload.fields[key].join('<br/>'));\r\n                    } else {\r\n                        feedbackElement.html(payload.fields[key]);\r\n                    }\r\n                    feedbackElement.siblings('.form-control').addClass('is-invalid');\r\n                }\r\n            }\r\n        });\r\n    }\r\n    if (payload && payload.error) {\r\n        var form = $(formElement).prop('tagName') === 'FORM'\r\n            ? $(formElement)\r\n            : $(formElement).parents('form');\r\n\r\n        form.prepend('<div class=\"alert alert-danger\">'\r\n            + payload.error.join('<br/>') + '</div>');\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/components/formValidation.js?");

/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/util.js":
/*!****************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/util.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nmodule.exports = function (include) {\r\n    if (typeof include === 'function') {\r\n        include();\r\n    } else if (typeof include === 'object') {\r\n        Object.keys(include).forEach(function (key) {\r\n            if (typeof include[key] === 'function') {\r\n                include[key]();\r\n            }\r\n        });\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/util.js?");

/***/ })

/******/ });