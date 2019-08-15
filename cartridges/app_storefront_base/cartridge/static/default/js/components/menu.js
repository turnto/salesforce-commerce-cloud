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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/components/menu.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/components/keyboardAccessibility.js":
/*!********************************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/components/keyboardAccessibility.js ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nmodule.exports = function (selector, keyFunctions, preFunction) {\r\n    $(selector).on('keydown', function (e) {\r\n        var key = e.which;\r\n        var supportedKeyCodes = [37, 38, 39, 40, 27];\r\n        if (supportedKeyCodes.indexOf(key) >= 0) {\r\n            e.preventDefault();\r\n        }\r\n        var returnedScope = preFunction.call(this);\r\n        if (keyFunctions[key]) {\r\n            keyFunctions[key].call(this, returnedScope);\r\n        }\r\n    });\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/components/keyboardAccessibility.js?");

/***/ }),

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/components/menu.js":
/*!***************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/components/menu.js ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\n\r\nvar keyboardAccessibility = __webpack_require__(/*! ./keyboardAccessibility */ \"./cartridges/app_storefront_base/cartridge/client/default/js/components/keyboardAccessibility.js\");\r\n\r\nvar clearSelection = function (element) {\r\n    $(element).closest('.dropdown').children('.dropdown-menu').children('.top-category')\r\n        .detach();\r\n    $(element).closest('.dropdown.show').children('.nav-link').attr('aria-expanded', 'false');\r\n    $(element).closest('.dropdown.show').removeClass('show');\r\n    $(element).closest('li').detach();\r\n};\r\n\r\nmodule.exports = function () {\r\n    var isDesktop = function (element) {\r\n        return $(element).parents('.menu-toggleable-left').css('position') !== 'fixed';\r\n    };\r\n\r\n    $('.header-banner .close').on('click', function () {\r\n        $('.header-banner').addClass('hide');\r\n    });\r\n\r\n    keyboardAccessibility('.main-menu .nav-link, .main-menu .dropdown-link',\r\n        {\r\n            40: function (menuItem) { // down\r\n                if (menuItem.hasClass('nav-item')) { // top level\r\n                    $('.navbar-nav .show').removeClass('show')\r\n                        .children('.dropdown-menu')\r\n                        .removeClass('show');\r\n                    menuItem.addClass('show').children('.dropdown-menu').addClass('show');\r\n                    $(this).attr('aria-expanded', 'true');\r\n                    menuItem.find('ul > li > a')\r\n                        .first()\r\n                        .focus();\r\n                } else {\r\n                    menuItem.removeClass('show').children('.dropdown-menu').removeClass('show');\r\n                    $(this).attr('aria-expanded', 'false');\r\n                    menuItem.next().children().first().focus();\r\n                }\r\n            },\r\n            39: function (menuItem) { // right\r\n                if (menuItem.hasClass('nav-item')) { // top level\r\n                    menuItem.removeClass('show').children('.dropdown-menu').removeClass('show');\r\n                    $(this).attr('aria-expanded', 'false');\r\n                    menuItem.next().children().first().focus();\r\n                } else if (menuItem.hasClass('dropdown')) {\r\n                    menuItem.addClass('show').children('.dropdown-menu').addClass('show');\r\n                    $(this).attr('aria-expanded', 'true');\r\n                    menuItem.find('ul > li > a')\r\n                        .first()\r\n                        .focus();\r\n                }\r\n            },\r\n            38: function (menuItem) { // up\r\n                if (menuItem.hasClass('nav-item')) { // top level\r\n                    menuItem.removeClass('show').children('.dropdown-menu').removeClass('show');\r\n                    $(this).attr('aria-expanded', 'false');\r\n                } else if (menuItem.prev().length === 0) {\r\n                    menuItem.parent().parent().removeClass('show')\r\n                        .children('.nav-link')\r\n                        .attr('aria-expanded', 'false');\r\n                    menuItem.parent().parent().children().first()\r\n                        .focus();\r\n                } else {\r\n                    menuItem.prev().children().first().focus();\r\n                }\r\n            },\r\n            37: function (menuItem) { // left\r\n                if (menuItem.hasClass('nav-item')) { // top level\r\n                    menuItem.removeClass('show').children('.dropdown-menu').removeClass('show');\r\n                    $(this).attr('aria-expanded', 'false');\r\n                    menuItem.prev().children().first().focus();\r\n                } else {\r\n                    menuItem.closest('.show').removeClass('show')\r\n                        .closest('li.show').removeClass('show')\r\n                        .children()\r\n                        .first()\r\n                        .focus()\r\n                        .attr('aria-expanded', 'false');\r\n                }\r\n            },\r\n            27: function (menuItem) { // escape\r\n                var parentMenu = menuItem.hasClass('show')\r\n                    ? menuItem\r\n                    : menuItem.closest('li.show');\r\n                parentMenu.children('.show').removeClass('show');\r\n                parentMenu.removeClass('show').children('.nav-link')\r\n                    .attr('aria-expanded', 'false');\r\n                parentMenu.children().first().focus();\r\n            }\r\n        },\r\n            function () {\r\n                return $(this).parent();\r\n            }\r\n        );\r\n\r\n    $('.dropdown:not(.disabled) [data-toggle=\"dropdown\"]')\r\n        .on('click', function (e) {\r\n            if (!isDesktop(this)) {\r\n                $('.modal-background').show();\r\n                // copy parent element into current UL\r\n                var li = $('<li class=\"dropdown-item top-category\" role=\"button\"></li>');\r\n                var link = $(this).clone().removeClass('dropdown-toggle')\r\n                    .removeAttr('data-toggle')\r\n                    .removeAttr('aria-expanded')\r\n                    .attr('aria-haspopup', 'false');\r\n                li.append(link);\r\n                var closeMenu = $('<li class=\"nav-menu\"></li>');\r\n                closeMenu.append($('.close-menu').first().clone());\r\n                $(this).parent().children('.dropdown-menu')\r\n                    .prepend(li)\r\n                    .prepend(closeMenu);\r\n                // copy navigation menu into view\r\n                $(this).parent().addClass('show');\r\n                $(this).attr('aria-expanded', 'true');\r\n                e.preventDefault();\r\n            }\r\n        })\r\n        .on('mouseenter', function () {\r\n            if (isDesktop(this)) {\r\n                var eventElement = this;\r\n                $('.navbar-nav > li').each(function () {\r\n                    if (!$.contains(this, eventElement)) {\r\n                        $(this).find('.show').each(function () {\r\n                            clearSelection(this);\r\n                        });\r\n                        if ($(this).hasClass('show')) {\r\n                            $(this).removeClass('show');\r\n                            $(this).children('ul.dropdown-menu').removeClass('show');\r\n                            $(this).children('.nav-link').attr('aria-expanded', 'false');\r\n                        }\r\n                    }\r\n                });\r\n                // need to close all the dropdowns that are not direct parent of current dropdown\r\n                $(this).parent().addClass('show');\r\n                $(this).siblings('.dropdown-menu').addClass('show');\r\n                $(this).attr('aria-expanded', 'true');\r\n            }\r\n        })\r\n        .parent()\r\n        .on('mouseleave', function () {\r\n            if (isDesktop(this)) {\r\n                $(this).removeClass('show');\r\n                $(this).children('.dropdown-menu').removeClass('show');\r\n                $(this).children('.nav-link').attr('aria-expanded', 'false');\r\n            }\r\n        });\r\n\r\n    $('.navbar>.close-menu>.close-button').on('click', function (e) {\r\n        e.preventDefault();\r\n        $('.menu-toggleable-left').removeClass('in');\r\n        $('.modal-background').hide();\r\n    });\r\n\r\n    $('.navbar-nav').on('click', '.back', function (e) {\r\n        e.preventDefault();\r\n        clearSelection(this);\r\n    });\r\n\r\n    $('.navbar-nav').on('click', '.close-button', function (e) {\r\n        e.preventDefault();\r\n        $('.navbar-nav').find('.top-category').detach();\r\n        $('.navbar-nav').find('.nav-menu').detach();\r\n        $('.navbar-nav').find('.show').removeClass('show');\r\n        $('.menu-toggleable-left').removeClass('in');\r\n        $('.modal-background').hide();\r\n    });\r\n\r\n    $('.navbar-toggler').click(function (e) {\r\n        e.preventDefault();\r\n        $('.main-menu').toggleClass('in');\r\n        $('.modal-background').show();\r\n    });\r\n\r\n    keyboardAccessibility('.navbar-header .user',\r\n        {\r\n            40: function ($popover) { // down\r\n                if ($popover.children('a').first().is(':focus')) {\r\n                    $popover.children('a').first().next().focus();\r\n                } else {\r\n                    $popover.children('a').first().focus();\r\n                }\r\n            },\r\n            38: function ($popover) { // up\r\n                if ($popover.children('a').first().is(':focus')) {\r\n                    $(this).focus();\r\n                    $popover.removeClass('show');\r\n                } else {\r\n                    $popover.children('a').first().focus();\r\n                }\r\n            },\r\n            27: function ($popover) { // escape\r\n                $(this).focus();\r\n                $popover.removeClass('show');\r\n            },\r\n            9: function ($popover) { // tab\r\n                $popover.removeClass('show');\r\n            }\r\n        },\r\n        function () {\r\n            var $popover = $('.user .popover');\r\n            if (!($popover.hasClass('show'))) {\r\n                $popover.addClass('show');\r\n            }\r\n            return $popover;\r\n        }\r\n    );\r\n\r\n    $('.navbar-header .user').on('mouseenter focusin', function () {\r\n        if ($('.navbar-header .user .popover').length > 0) {\r\n            $('.navbar-header .user .popover').addClass('show');\r\n        }\r\n    });\r\n\r\n    $('.navbar-header .user').on('mouseleave', function () {\r\n        $('.navbar-header .user .popover').removeClass('show');\r\n    });\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/components/menu.js?");

/***/ })

/******/ });