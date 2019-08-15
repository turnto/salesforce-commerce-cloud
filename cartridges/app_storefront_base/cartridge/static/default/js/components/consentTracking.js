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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/components/consentTracking.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/components/consentTracking.js":
/*!**************************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/components/consentTracking.js ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n/**\r\n * Renders a modal window that will track the users consenting to accepting site tracking policy\r\n */\r\nfunction showConsentModal() {\r\n    if (!$('.tracking-consent').data('caonline')) {\r\n        return;\r\n    }\r\n\r\n    var urlContent = $('.tracking-consent').data('url');\r\n    var urlAccept = $('.tracking-consent').data('accept');\r\n    var urlReject = $('.tracking-consent').data('reject');\r\n    var textYes = $('.tracking-consent').data('accepttext');\r\n    var textNo = $('.tracking-consent').data('rejecttext');\r\n    var textHeader = $('.tracking-consent').data('heading');\r\n\r\n    var htmlString = '<!-- Modal -->'\r\n        + '<div class=\"modal show\" id=\"consent-tracking\" role=\"dialog\" style=\"display: block;\">'\r\n        + '<div class=\"modal-dialog\">'\r\n        + '<!-- Modal content-->'\r\n        + '<div class=\"modal-content\">'\r\n        + '<div class=\"modal-header\">'\r\n        + textHeader\r\n        + '</div>'\r\n        + '<div class=\"modal-body\"></div>'\r\n        + '<div class=\"modal-footer\">'\r\n        + '<div class=\"button-wrapper\">'\r\n        + '<button class=\"affirm btn btn-primary\" data-url=\"' + urlAccept + '\">'\r\n        + textYes\r\n        + '</button>'\r\n        + '<button class=\"decline btn btn-primary\" data-url=\"' + urlReject + '\">'\r\n        + textNo\r\n        + '</button>'\r\n        + '</div>'\r\n        + '</div>'\r\n        + '</div>'\r\n        + '</div>'\r\n        + '</div>';\r\n    $.spinner().start();\r\n    $('body').append(htmlString);\r\n\r\n    $.ajax({\r\n        url: urlContent,\r\n        type: 'get',\r\n        dataType: 'html',\r\n        success: function (response) {\r\n            $('.modal-body').html(response);\r\n        },\r\n        error: function () {\r\n            $('#consent-tracking').remove();\r\n        }\r\n    });\r\n\r\n    $('#consent-tracking .button-wrapper button').click(function (e) {\r\n        e.preventDefault();\r\n        var url = $(this).data('url');\r\n        $.ajax({\r\n            url: url,\r\n            type: 'get',\r\n            dataType: 'json',\r\n            success: function () {\r\n                $('#consent-tracking .modal-body').remove();\r\n                $('#consent-tracking').remove();\r\n                $.spinner().stop();\r\n            },\r\n            error: function () {\r\n                $('#consent-tracking .modal-body').remove();\r\n                $('#consent-tracking').remove();\r\n                $.spinner().stop();\r\n            }\r\n        });\r\n    });\r\n}\r\n\r\nmodule.exports = function () {\r\n    if ($('.consented').length === 0 && $('.tracking-consent').hasClass('api-true')) {\r\n        showConsentModal();\r\n    }\r\n\r\n    if ($('.tracking-consent').hasClass('api-true')) {\r\n        $('.tracking-consent').click(function () {\r\n            showConsentModal();\r\n        });\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/components/consentTracking.js?");

/***/ })

/******/ });