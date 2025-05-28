'use strict';

/**
* This script serves as utility for global helper methods
*/

/* API Includes */
var Site = require('dw/system/Site');
var ProductMgr = require('dw/catalog/ProductMgr');
var HashMap = require('dw/util/HashMap');
var Logger = require('dw/system/Logger');

var TurnToHelper = {
    /**
	 * @function
	 * @name getLocalizedTurnToPreferenceValue
	 * @param {string} locale The locale in which to retrieve a value
	 * @return {Object} The values from turntoSiteAuthKeyJSON for provided locale
	 */
    getLocalizedTurnToPreferenceValue: function (locale) {
        var preferenceValue = {};
        var hashMapOfKeys = TurnToHelper.getHashMapOfKeys();
        if (!hashMapOfKeys) {
            TurnToHelper.getLogger().error('TurnToHelperUtil.js error: {0}', 'Found no SiteAuthKeyJSON for site');
            return null;
        }
        try {
            var setOfPreference = hashMapOfKeys.entrySet().iterator();
            while (setOfPreference.hasNext()) {
                var obj = setOfPreference.next();
                if (obj.value.locales.indexOf(locale) !== -1) {
                    preferenceValue = {
                        turntoSiteKey: JSON.parse(obj.key),
                        turntoAuthKey: obj.value.authKey,
                        domain: obj.value.domain || TurnToHelper.getDefaultDataCenterUrl()
                    };
                    break;
                }
            }
        } catch (e) {
            TurnToHelper.getLogger().error('TurnToHelperUtil.js error: {0}', e.message);
        }
        return preferenceValue;
    },

    /**
	 * @function
	 * @name getLocalizedSitePreferenceFromRequestLocale
	 * @return {string} The values from turntoSiteAuthKeyJSON for request locale
	 */
    getLocalizedSitePreferenceFromRequestLocale: function () {
        return TurnToHelper.getLocalizedTurnToPreferenceValue(request.locale);
    },

    /**
	 * @function
	 * @name hasSiteAndAuthKeyPerLocale
	 * @param {string} locale The locale in which to check if a site and auth key exists
	 * @return {boolean} true if the locale contains both auth and site keys; otherwise false
	 */
    hasSiteAndAuthKeyPerLocale: function (locale) {
        var hashMapOfKeys = TurnToHelper.getHashMapOfKeys();
        if (!hashMapOfKeys) {
            TurnToHelper.getLogger().error('TurnToHelperUtil.js error: {0}', 'Found no SiteAuthKeyJSON for site');
            return false;
        }

        try {
            var setOfPreference = hashMapOfKeys.entrySet().iterator();
            while (setOfPreference.hasNext()) {
                var obj = setOfPreference.next();
                if (obj.value.locales.indexOf(locale) !== -1 && 'authKey' in obj.value && obj.value.authKey) {
                    return true;
                }
            }
        } catch (e) {
            TurnToHelper.getLogger().error('TurnToHelperUtil.js error: {0}', e.message);
        }

        return false;
    },

    /**
	 * @function
	 * @name getAllowedLocales
	 * @description Retrieve the allowed locales per site with valid site and auth key
	 * @returns {Array} allowed locales
	 */
    getAllowedLocales: function () {
        var siteAllowedLocales = Site.getCurrent().getAllowedLocales();
        var adjustedAllowedLocales = [];

        /* loop through site enabled locales and add locale if turntoAuthKey and turntoSiteKey values are not defined */
        Object.keys(siteAllowedLocales).forEach(function (key) {
            if (TurnToHelper.hasSiteAndAuthKeyPerLocale(siteAllowedLocales[key])) {
                adjustedAllowedLocales.push(siteAllowedLocales[key]);
            }
        });

        return adjustedAllowedLocales;
    },

    /**
	 * @function
	 * @name replaceNull
	 * @description Replaces null with the specified replacement string.
	 * @param {string|Array} str The string to replace if null
	 * @param {string} replace The string to use as a replacement
	 * @returns {string} - replace if str is null, otherwise str
	 */
    replaceNull: function (str, replace) {
        return (!empty(str)) ? str : replace;
    },

    /**
	 * @function
	 * @name sanitizeStr
	 * @description Strip out tabs, carriage returns, and newlines in string.
	 * @param {string} str - The string to use as a replacement
	 * @param {string} replace - The string to use as a replacement
	 * @returns {string} - replace if str is null, otherwise str
	 */
    sanitizeStr: function (str, replace) {
        var clnStr = TurnToHelper.replaceNull(str, ' ');
        var replaceStr = replace || '';
        return clnStr.replace(/\s+/g, replaceStr);
    },

    /**
     * Site Key JSON object from custom preference
     * {
     *    "siteKeyA": {
     *      "locales": "en_US,en_CA",
     *      "domain": "turnto.com",
     *      "authKey": "authKeyA"
     *    },
     *    "siteKeyB": {
     *      "locales": "en_GB,fr_FR",
     *      "domain": "turnto.eu",
     *      "authKey": "authKeyB"
     *    }
     * }
     * @typedef {Object} SiteKeysJson - JSON object from custom preference
     * @property {AuthKeyJson} siteKey - Object with Site Key as key
     */

    /**
     * @typedef {Object} AuthKeyJson - JSON object with Auth Key for site
     * @property {string} siteKey.locales - Comma separated list of locales
     * @property {string} siteKey.domain - TurnTo domain "turnto.com" or "turnto.eu"
     * @property {string} siteKey.authKey - Site's Auth Key
     */

    /**
     * @returns {SiteKeysJson|null} Site Key JSON object
     */
    getSiteKeys: function () {
        var TurnToSiteAuthKey = Site.getCurrent().getCustomPreferenceValue('turntoSiteAuthKeyJSON');
        if (empty(TurnToSiteAuthKey)) {
            return null;
        }

        return JSON.parse(TurnToSiteAuthKey.replace(/\s+/gm, ''));
    },

    /**
	 * @function
	 * @name getHashMapOfKeys
	 * @description Get map of TurnTo keys with locales, authKey from custom preference
	 * @returns {HashMap|null} Return map of TurnTo keys with locales, authKey
	 */
    getHashMapOfKeys: function () {
        var TurnToSiteAuthKey = Site.getCurrent().getCustomPreferenceValue('turntoSiteAuthKeyJSON');
        if (!TurnToSiteAuthKey) {
            return null;
        }
        var rg = /\s+/gm;
        var result = JSON.parse(TurnToSiteAuthKey.replace(rg, ''));
        var hashMapOfKeys = new HashMap();
        Object.keys(result).forEach(function (key) {
            hashMapOfKeys.put(JSON.stringify(key), result[key]);
        });
        return hashMapOfKeys;
    },

    /**
	 * @function
	 * @name getPageID
	 * @description Retrieve Page ID from current URL
	 * @returns {string} page ID
	 */
    getPageID: function () {
        var pageID;
        var currentPage = request.httpPath;

        /* NOTE: To add additional pages, reach out to support to add new page IDs in TurnTo. Add the new IDs to the
            logic below. The conditional statements in 'htmlHeadJS.isml' must also be updated to reflect the changes. */
        if (currentPage.indexOf('Product') > -1) {
            pageID = 'pdp-page';
        } else if (currentPage.indexOf('Confirm') > -1 || currentPage.indexOf('Submit') > -1) {
            pageID = 'order-confirmation-page';
        } else if (currentPage.indexOf('Search') > -1) {
            pageID = 'search-page';
        } else if (currentPage.indexOf('Page') > -1) {
            /* Special case here as this could be any content page as well. */
            if (Site.getCurrent().getCustomPreferenceValue('turntoVCPinboardEnabled')) {
                pageID = 'pinboard-page';
            } else {
                pageID = 'non-defined-page';
            }
        } else {
            pageID = 'non-defined-page';
        }

        return pageID;
    },

    /**
	 * @function
	 * @return {string} default url for TurnTo
	 */
    getDefaultDataCenterUrl: function () {
        return Site.getCurrent().getCustomPreferenceValue('turntoDefaultDataCenterUrl');
    },

    /**
	 * @name getLogger
	 * @desc returns the logger
	 * @returns {dw.system.Logger} Logger
	 */
    getLogger: function () {
        return Logger.getLogger('int_core_turnto_core_v5');
    },

    /**
	 * @name getTurnToStarClass
	 * @desc returns the turnto star class
	 * @param {string} presentationID -
	 * @returns {string} - Star class
	 */
    getTurnToStarClass: function (presentationID) {
        var turntoStarClass = '';

        if (!empty(presentationID)) {
            turntoStarClass = 'TTratingBox TTrating-' + presentationID;
        }
        return turntoStarClass;
    },

    /**
	 * @name getTopCommentSKUsLegacy
	 * @desc returns the turnto top comment SKUs for Site Genesis (Legacy) only
	 * @param {ProductLineItems} productLineItems -
	 * @returns {string} - turnto top comment SKUs
	 */
    getTopCommentSKUsLegacy: function (productLineItems) {
        var topCommentSkus = [];
        Object.keys(productLineItems).forEach(function (key) {
            topCommentSkus.push(productLineItems[key].getProduct().getID());
        });
        return topCommentSkus.join(',');
    },

    /**
	 * @name getTopCommentSKUs
	 * @desc returns the turnto top comment SKUs
	 * @param {ShippingModel} shipping -
	 * @returns {string} - turnto top comment SKUs
	 */
    getTopCommentSKUs: function (shipping) {
        var topCommentSkus = [];
        Object.keys(shipping).forEach(function (key) {
            var shippingModel = shipping[key];
            Object.keys(shippingModel.productLineItems.items).forEach(function (attr) {
                var item = shippingModel.productLineItems.items[attr];
                topCommentSkus.push(item.id);
            });
        });
        return topCommentSkus.join(',');
    },

    getParentSku: function (lookupId) {
        var product = ProductMgr.getProduct(lookupId);
        return product.isMaster() ? lookupId : product.getMasterProduct().getID();
    },

    getProductSku: function (lookupId) {
        var useVariants = Boolean(Site.getCurrent().getCustomPreferenceValue('turntoUseVariants'));
        return useVariants ? lookupId : TurnToHelper.getParentSku(lookupId);
    }
};

module.exports = TurnToHelper;
