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
/******/ 	return __webpack_require__(__webpack_require__.s = "./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js":
/*!*************************************************************************************************!*\
  !*** ./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js ***!
  \*************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* globals google */\r\n\r\n\r\n/**\r\n * appends params to a url\r\n * @param {string} url - Original url\r\n * @param {Object} params - Parameters to append\r\n * @returns {string} result url with appended parameters\r\n */\r\nfunction appendToUrl(url, params) {\r\n    var newUrl = url;\r\n    newUrl += (newUrl.indexOf('?') !== -1 ? '&' : '?') + Object.keys(params).map(function (key) {\r\n        return key + '=' + encodeURIComponent(params[key]);\r\n    }).join('&');\r\n\r\n    return newUrl;\r\n}\r\n\r\n/**\r\n * Uses google maps api to render a map\r\n */\r\nfunction maps() {\r\n    var map;\r\n    var infowindow = new google.maps.InfoWindow();\r\n\r\n    // Init U.S. Map in the center of the viewport\r\n    var latlng = new google.maps.LatLng(37.09024, -95.712891);\r\n    var mapOptions = {\r\n        scrollwheel: false,\r\n        zoom: 4,\r\n        center: latlng\r\n    };\r\n\r\n    map = new google.maps.Map($('.map-canvas')[0], mapOptions);\r\n    var mapdiv = $('.map-canvas').attr('data-locations');\r\n\r\n    mapdiv = JSON.parse(mapdiv);\r\n\r\n    var bounds = new google.maps.LatLngBounds();\r\n\r\n    // Customized google map marker icon with svg format\r\n    var markerImg = {\r\n        path: 'M13.5,30.1460153 L16.8554555,25.5 L20.0024287,25.5 C23.039087,25.5 25.5,' +\r\n            '23.0388955 25.5,20.0024287 L25.5,5.99757128 C25.5,2.96091298 23.0388955,0.5 ' +\r\n            '20.0024287,0.5 L5.99757128,0.5 C2.96091298,0.5 0.5,2.96110446 0.5,5.99757128 ' +\r\n            'L0.5,20.0024287 C0.5,23.039087 2.96110446,25.5 5.99757128,25.5 L10.1445445,' +\r\n            '25.5 L13.5,30.1460153 Z',\r\n        fillColor: '#0070d2',\r\n        fillOpacity: 1,\r\n        scale: 1.1,\r\n        strokeColor: 'white',\r\n        strokeWeight: 1,\r\n        anchor: new google.maps.Point(13, 30),\r\n        labelOrigin: new google.maps.Point(12, 12)\r\n    };\r\n\r\n    Object.keys(mapdiv).forEach(function (key) {\r\n        var item = mapdiv[key];\r\n        var lable = parseInt(key, 10) + 1;\r\n        var storeLocation = new google.maps.LatLng(item.latitude, item.longitude);\r\n        var marker = new google.maps.Marker({\r\n            position: storeLocation,\r\n            map: map,\r\n            title: item.name,\r\n            icon: markerImg,\r\n            label: { text: lable.toString(), color: 'white', fontSize: '16px' }\r\n        });\r\n\r\n        marker.addListener('click', function () {\r\n            infowindow.setOptions({\r\n                content: item.infoWindowHtml\r\n            });\r\n            infowindow.open(map, marker);\r\n        });\r\n\r\n        // Create a minimum bound based on a set of storeLocations\r\n        bounds.extend(marker.position);\r\n    });\r\n    // Fit the all the store marks in the center of a minimum bounds when any store has been found.\r\n    if (mapdiv && mapdiv.length !== 0) {\r\n        map.fitBounds(bounds);\r\n    }\r\n}\r\n\r\n/**\r\n * Renders the results of the search and updates the map\r\n * @param {Object} data - Response from the server\r\n */\r\nfunction updateStoresResults(data) {\r\n    var $resultsDiv = $('.results');\r\n    var $mapDiv = $('.map-canvas');\r\n    var hasResults = data.stores.length > 0;\r\n\r\n    if (!hasResults) {\r\n        $('.store-locator-no-results').show();\r\n    } else {\r\n        $('.store-locator-no-results').hide();\r\n    }\r\n\r\n    $resultsDiv.empty()\r\n        .data('has-results', hasResults)\r\n        .data('radius', data.radius)\r\n        .data('search-key', data.searchKey);\r\n\r\n    $mapDiv.attr('data-locations', data.locations);\r\n\r\n    if ($mapDiv.data('has-google-api')) {\r\n        maps();\r\n    } else {\r\n        $('.store-locator-no-apiKey').show();\r\n    }\r\n\r\n    if (data.storesResultsHtml) {\r\n        $resultsDiv.append(data.storesResultsHtml);\r\n    }\r\n}\r\n\r\n/**\r\n * Search for stores with new zip code\r\n * @param {HTMLElement} element - the target html element\r\n * @returns {boolean} false to prevent default event\r\n */\r\nfunction search(element) {\r\n    var dialog = element.closest('.in-store-inventory-dialog');\r\n    var spinner = dialog.length ? dialog.spinner() : $.spinner();\r\n    spinner.start();\r\n    var $form = element.closest('.store-locator');\r\n    var radius = $('.results').data('radius');\r\n    var url = $form.attr('action');\r\n    var urlParams = { radius: radius };\r\n\r\n    var payload = $form.is('form') ? $form.serialize() : { postalCode: $form.find('[name=\"postalCode\"]').val() };\r\n\r\n    url = appendToUrl(url, urlParams);\r\n\r\n    $.ajax({\r\n        url: url,\r\n        type: $form.attr('method'),\r\n        data: payload,\r\n        dataType: 'json',\r\n        success: function (data) {\r\n            spinner.stop();\r\n            updateStoresResults(data);\r\n            $('.select-store').prop('disabled', true);\r\n        }\r\n    });\r\n    return false;\r\n}\r\n\r\nmodule.exports = {\r\n    init: function () {\r\n        if ($('.map-canvas').data('has-google-api')) {\r\n            maps();\r\n        } else {\r\n            $('.store-locator-no-apiKey').show();\r\n        }\r\n\r\n        if (!$('.results').data('has-results')) {\r\n            $('.store-locator-no-results').show();\r\n        }\r\n    },\r\n\r\n    detectLocation: function () {\r\n        // clicking on detect location.\r\n        $('.detect-location').on('click', function () {\r\n            $.spinner().start();\r\n            if (!navigator.geolocation) {\r\n                $.spinner().stop();\r\n                return;\r\n            }\r\n\r\n            navigator.geolocation.getCurrentPosition(function (position) {\r\n                var $detectLocationButton = $('.detect-location');\r\n                var url = $detectLocationButton.data('action');\r\n                var radius = $('.results').data('radius');\r\n                var urlParams = {\r\n                    radius: radius,\r\n                    lat: position.coords.latitude,\r\n                    long: position.coords.longitude\r\n                };\r\n\r\n                url = appendToUrl(url, urlParams);\r\n                $.ajax({\r\n                    url: url,\r\n                    type: 'get',\r\n                    dataType: 'json',\r\n                    success: function (data) {\r\n                        $.spinner().stop();\r\n                        updateStoresResults(data);\r\n                        $('.select-store').prop('disabled', true);\r\n                    }\r\n                });\r\n            });\r\n        });\r\n    },\r\n\r\n    search: function () {\r\n        $('.store-locator-container form.store-locator').submit(function (e) {\r\n            e.preventDefault();\r\n            search($(this));\r\n        });\r\n        $('.store-locator-container .btn-storelocator-search[type=\"button\"]').click(function (e) {\r\n            e.preventDefault();\r\n            search($(this));\r\n        });\r\n    },\r\n\r\n    changeRadius: function () {\r\n        $('.store-locator-container .radius').change(function () {\r\n            var radius = $(this).val();\r\n            var searchKeys = $('.results').data('search-key');\r\n            var url = $('.radius').data('action-url');\r\n            var urlParams = {};\r\n\r\n            if (searchKeys.postalCode) {\r\n                urlParams = {\r\n                    radius: radius,\r\n                    postalCode: searchKeys.postalCode\r\n                };\r\n            } else if (searchKeys.lat && searchKeys.long) {\r\n                urlParams = {\r\n                    radius: radius,\r\n                    lat: searchKeys.lat,\r\n                    long: searchKeys.long\r\n                };\r\n            }\r\n\r\n            url = appendToUrl(url, urlParams);\r\n            var dialog = $(this).closest('.in-store-inventory-dialog');\r\n            var spinner = dialog.length ? dialog.spinner() : $.spinner();\r\n            spinner.start();\r\n            $.ajax({\r\n                url: url,\r\n                type: 'get',\r\n                dataType: 'json',\r\n                success: function (data) {\r\n                    spinner.stop();\r\n                    updateStoresResults(data);\r\n                    $('.select-store').prop('disabled', true);\r\n                }\r\n            });\r\n        });\r\n    },\r\n    selectStore: function () {\r\n        $('.store-locator-container').on('click', '.select-store', (function (e) {\r\n            e.preventDefault();\r\n            var selectedStore = $(':checked', '.results-card .results');\r\n            var data = {\r\n                storeID: selectedStore.val(),\r\n                searchRadius: $('#radius').val(),\r\n                searchPostalCode: $('.results').data('search-key').postalCode,\r\n                storeDetailsHtml: selectedStore.siblings('label').find('.store-details').html(),\r\n                event: e\r\n            };\r\n\r\n            $('body').trigger('store:selected', data);\r\n        }));\r\n    },\r\n    updateSelectStoreButton: function () {\r\n        $('body').on('change', '.select-store-input', (function () {\r\n            $('.select-store').prop('disabled', false);\r\n        }));\r\n    }\r\n};\r\n\n\n//# sourceURL=webpack:///./cartridges/app_storefront_base/cartridge/client/default/js/storeLocator/storeLocator.js?");

/***/ })

/******/ });