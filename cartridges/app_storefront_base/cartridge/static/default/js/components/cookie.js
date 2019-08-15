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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/components/cookie.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/components/cookie.js":
/*!*****************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/components/cookie.js ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\n/**\r\n * Get cookie value by cookie name from browser\r\n * @param {string} cookieName - name of the cookie\r\n * @returns {string} cookie value of the found cookie name\r\n */\r\nfunction getCookie(cookieName) {\r\n    var name = cookieName + '=';\r\n    var decodedCookie = decodeURIComponent(document.cookie);\r\n    var cookieArray = decodedCookie.split(';');\r\n    for (var i = 0; i < cookieArray.length; i++) {\r\n        var cookieItem = cookieArray[i];\r\n        while (cookieItem.charAt(0) === ' ') {\r\n            cookieItem = cookieItem.substring(1);\r\n        }\r\n        if (cookieItem.indexOf(name) === 0) {\r\n            return cookieItem.substring(name.length, cookieItem.length);\r\n        }\r\n    }\r\n    return '';\r\n}\r\n\r\nmodule.exports = function () {\r\n    if ($('.valid-cookie-warning').length > 0) {\r\n        var previousSessionID = window.localStorage.getItem('previousSid');\r\n        var currentSessionID = getCookie('sid');\r\n        if (!previousSessionID && currentSessionID) {\r\n            // When a user first time visit the home page,\r\n            // set the previousSessionID to currentSessionID\r\n            // and Show the cookie alert\r\n            previousSessionID = currentSessionID;\r\n            window.localStorage.setItem('previousSid', previousSessionID);\r\n            $('.cookie-warning-messaging').show();\r\n        } else if (previousSessionID && previousSessionID === currentSessionID) {\r\n            // Hide the cookie alert if user is in the same session\r\n            $('.cookie-warning-messaging').hide();\r\n        } else {\r\n            // Clear the previousSessionID from localStorage\r\n            // when user session is changed or expired\r\n            previousSessionID = '';\r\n            window.localStorage.removeItem('previousSid');\r\n        }\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/components/cookie.js?");

/***/ })

/******/ });