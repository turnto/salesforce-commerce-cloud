'use strict';

/**
* This script serves as utility helper to use throughout the TurnTo logic
*
* To use specify the global variable TurnToHelper then a dot then the function name (e.g. TurnToHelper().getLocalizedTurnToPreferenceValue() )
*
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
	 * @param {string} locale The locale in which to retrieve a value. If not matching locale is returned, the default is used
	 * @return {Object} The localized value of the Site Preference specified by the preferenceName parameter
	 */
    getLocalizedTurnToPreferenceValue: function (locale) {
        var preferenceValue = {};
        var hashMapOfKeys = TurnToHelper.getHashMapOfKeys();
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
	 * @return {string} The localized value of the Site Preference specified by the preferenceName parameter
	 */
	getLocalizedSitePreferenceFromRequestLocale: function () {
		return TurnToHelper.getLocalizedTurnToPreferenceValue(request.locale);
	},

	/**
	 * @function
	 * @name hasSiteAndAuthKeyPerLocale
	 * @param {string} locale The locale in which to check if a site and auth key exists
	 * @return {boolean} true if the locale contains both auth and site keys; false if it does not contain an auth key, site key or both
	 */
    hasSiteAndAuthKeyPerLocale: function (locale) {
        var hashMapOfKeys = TurnToHelper.getHashMapOfKeys();

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
	 * @description retrieve the allowed lcoales per site
	 * @description retrieve the allowed locales per site that contain both a site and auth key
	 * @returns {List} allowed locales
	 */
    getAllowedLocales: function () {
		// loop through site enabled locales to generate a catalog export for each locale
        var siteAllowedLocales = Site.getCurrent().getAllowedLocales();
        var adjustedAllowedLocales = [];

        Object.keys(siteAllowedLocales).forEach(function (key) {
            if (key == "default") {
                key = "en_US"
            }
			// If turntoAuthKey and turntoSiteKey values are not defined for a particular locale the job should skip the locale.
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
	 * @param {string} str The string to replace if null
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
        var clnStr = TurnToHelper.replaceNull(str, '');
        var replaceStr = replace || '';
        return clnStr.replace(/\s+/g, replaceStr);
    },

	/**
	 * @function
	 * @name getHashMapOfKeys
	 * @description Function to get map of TurnTo keys with locales, authKey from custom prefernce
	 * @returns {string} - Return map of TurnTo keys with locales, authKey
	 */
    getHashMapOfKeys: function () {
        var TurnToSiteAuthKey = Site.getCurrent().getCustomPreferenceValue('turntoSiteAuthKeyJSON');
        var rg = new RegExp('\\s+', 'gm');
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

		// NOTE: these can be modified if you need more or less defined page IDs
		// if you do modify the following switch cases then make sure you adjust the conditional statements in 'htmlHeadIncludeJS.isml'
		// also new page IDs will need to be added to the TurnTo system in order for features to work, reach out to your TurnTo representative
        if (currentPage.indexOf('Product') > -1) {
            pageID = 'pdp-page';
        } else if (currentPage.indexOf('Confirm') > -1 || currentPage.indexOf('Submit') > -1) {
            pageID = 'order-confirmation-page';
        } else if (currentPage.indexOf('Search') > -1) {
            pageID = 'search-page';
        } else if (currentPage.indexOf('Page') > -1) {
			// Special case here as this could be any content page as well.
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
	 * @returns {string} -
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
        var productId = product.isMaster() ? lookupId : product.getMasterProduct().getID();
        return productId;
    },

    getProductSku: function (lookupId) {
        var useVariants = Boolean(Site.getCurrent().getCustomPreferenceValue('turntoUseVariants'));
        var productSku = useVariants ? lookupId : TurnToHelper.getParentSku(lookupId);
        return productSku;
    }
};

module.exports = TurnToHelper;
