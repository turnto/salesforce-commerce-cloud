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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/components/clientSideValidation.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/components/clientSideValidation.js":
/*!*******************************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/components/clientSideValidation.js ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n/**\r\n * Validate whole form. Requires `this` to be set to form object\r\n * @param {jQuery.event} event - Event to be canceled if form is invalid.\r\n * @returns {boolean} - Flag to indicate if form is valid\r\n */\r\nfunction validateForm(event) {\r\n    var valid = true;\r\n    if (this.checkValidity && !this.checkValidity()) {\r\n        // safari\r\n        valid = false;\r\n        if (event) {\r\n            event.preventDefault();\r\n            event.stopPropagation();\r\n            event.stopImmediatePropagation();\r\n        }\r\n        $(this).find('input, select').each(function () {\r\n            if (!this.validity.valid) {\r\n                $(this).trigger('invalid', this.validity);\r\n            }\r\n        });\r\n    }\r\n    return valid;\r\n}\r\n\r\n/**\r\n * Remove all validation. Should be called every time before revalidating form\r\n * @param {element} form - Form to be cleared\r\n * @returns {void}\r\n */\r\nfunction clearForm(form) {\r\n    $(form).find('.form-control.is-invalid').removeClass('is-invalid');\r\n}\r\n\r\nmodule.exports = {\r\n    invalid: function () {\r\n        $('form input, form select').on('invalid', function (e) {\r\n            e.preventDefault();\r\n            this.setCustomValidity('');\r\n            if (!this.validity.valid) {\r\n                var validationMessage = this.validationMessage;\r\n                $(this).addClass('is-invalid');\r\n                if (this.validity.patternMismatch && $(this).data('pattern-mismatch')) {\r\n                    validationMessage = $(this).data('pattern-mismatch');\r\n                }\r\n                if ((this.validity.rangeOverflow || this.validity.rangeUnderflow)\r\n                    && $(this).data('range-error')) {\r\n                    validationMessage = $(this).data('range-error');\r\n                }\r\n                if ((this.validity.tooLong || this.validity.tooShort)\r\n                    && $(this).data('range-error')) {\r\n                    validationMessage = $(this).data('range-error');\r\n                }\r\n                if (this.validity.valueMissing && $(this).data('missing-error')) {\r\n                    validationMessage = $(this).data('missing-error');\r\n                }\r\n                $(this).parents('.form-group').find('.invalid-feedback')\r\n                    .text(validationMessage);\r\n            }\r\n        });\r\n    },\r\n\r\n    submit: function () {\r\n        $('form').on('submit', function (e) {\r\n            return validateForm.call(this, e);\r\n        });\r\n    },\r\n\r\n    buttonClick: function () {\r\n        $('form button[type=\"submit\"], form input[type=\"submit\"]').on('click', function () {\r\n            // clear all errors when trying to submit the form\r\n            clearForm($(this).parents('form'));\r\n        });\r\n    },\r\n\r\n    functions: {\r\n        validateForm: function (form, event) {\r\n            validateForm.call($(form), event || null);\r\n        },\r\n        clearForm: clearForm\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/components/clientSideValidation.js?");

/***/ })

/******/ });