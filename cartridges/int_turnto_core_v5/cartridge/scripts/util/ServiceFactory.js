'use strict';

/**
 *   Name: ServiceFactory
 */

/* API Modules */
var Logger = require('dw/system/Logger');
var Site = require('dw/system/Site');
var File = require('dw/io/File');
var ProductMgr = require('dw/catalog/ProductMgr');
var HTTPRequestPart = require('dw/net/HTTPRequestPart');

/* Script Modules*/
var TurnToHelper = require('*/cartridge/scripts/util/TurnToHelperUtil');

// Public
var ServiceFactory = {

	// Service IDs
    SERVICES: {
        IMPORT: 'turnto.http.import.get',
        UPLOAD: 'turnto.http.upload.get'
    },

	/** ***************************************************
	 * Preferences
	 ****************************************************/

	/**
	 * @name getLocalizedSiteKeyPreference
	 * @desc returns the site key custom site preference using the parameter locale
	 * @param {string} currentLocale - current Site locale
	 * @returns {string} - TurnTo SiteKey
	 */
    getLocalizedSiteKeyPreference: function (currentLocale) {
        return TurnToHelper.getLocalizedTurnToPreferenceValue(currentLocale).turntoSiteKey;
    },

	/**
	 * @name getLocalizedAuthKeyPreference
	 * @desc returns the auth key custom site preference using the parameter locale
	 * @param {string} currentLocale - current Site locale
	 * @returns {string} - TurnTo AuthKey
	 */
    getLocalizedAuthKeyPreference: function (currentLocale) {
        return TurnToHelper.getLocalizedTurnToPreferenceValue(currentLocale).turntoAuthKey;
    },

	/**
	 * @name getUseVariantsPreference
	 * @desc returns the use variants custom site preference
	 * @returns {boolean} - TurnTo use variants
	 */
    getUseVariantsPreference: function () {
        return Site.getCurrent().getCustomPreferenceValue('turntoUseVariants');
    },

	/**
	 * @name getLocalizedDomainURLPreference
	 * @desc returns the localized domain URL
	 * @param {string} currentLocale - current Site locale
	 * @returns {string} - TurnTo domain URL
	 */
    getLocalizedDomainURLPreference: function (currentLocale) {
        return TurnToHelper.getLocalizedTurnToPreferenceValue(currentLocale).domain;
    },

	/** ***************************************************
	 * Other Getters
	 ****************************************************/

	/**
	 * @name getLogger
	 * @desc returns the logger
	 * @returns {dw.system.Log} - TurnTo Logger
	 */
    getLogger: function () {
        return Logger.getLogger('int_turnto_core_v5');
    },

	/**
	 * @name getProduct
	 * @desc returns the product ID
	 * @param {string} pid - Product ID
	 * @returns {string} - Product ID
	 */
    getProduct: function (pid) {
        var product = ProductMgr.getProduct(pid);
        var useVariants = ServiceFactory.getUseVariantsPreference();
        var resultPid;
        if (product.isMaster() && useVariants) {
            resultPid = product.getVariationModel().defaultVariant.ID;
        } else {
            resultPid = product.isVariant() && !useVariants ? product.masterProduct.ID : product.ID;
        }
        return resultPid;
    },


	/** ***************************************************
	 * Request Data Containers
	 ****************************************************/

	/**
	 * @function
	 * @name buildFeedDownloadRequestContainer
	 * @param {string} xmlName -
	 * @param {string} currentLocale -
	 * @param {string} file -
	 * @returns {Object} -
	 */
    buildFeedDownloadRequestContainer: function (xmlName, currentLocale, file) {
        var siteKey = ServiceFactory.getLocalizedSiteKeyPreference(currentLocale);
        var authKey = ServiceFactory.getLocalizedAuthKeyPreference(currentLocale);

		// Skip locales without keys configured
        if (empty(siteKey) || empty(authKey)) {
            return false;
        }

		// Distinguish two different download URLs "/turnto-skuaveragerating.xml" OR "/turnto-ugc.xml"
		// Example for UGC: https://www.turnto.com/static/export/YOURSITEKEY/YOURAUTHKEY/turnto-ugc.xml
        var url = 'https://www.' + ServiceFactory.getLocalizedDomainURLPreference(currentLocale) + File.SEPARATOR + 'static' + File.SEPARATOR + 'export' + File.SEPARATOR + siteKey + File.SEPARATOR + authKey + xmlName;

        return {
            requestMethod: 'GET',
            path: url,
            outfile: file
        };
    },

	/**
	 * @function
	 * @name buildFeedUploadRequestContainer
	 * @param {string} postFileLocation -
	 * @param {string} file -
	 * @param {string} siteKey -
	 * @param {string} authKey -
	 * @param {string} domain -
	 * @param {string} feedStyle -
	 * @returns {Object} -
	 */
    buildFeedUploadRequestContainer: function (postFileLocation, file, siteKey, authKey, domain, feedStyle) {
		// Skip locales without keys configured
        if (empty(siteKey) || empty(authKey) || empty(domain)) {
            return false;
        }

		// Create array of request parts to add to request
        var arrayOfRequestParts = [];
        arrayOfRequestParts.push(new HTTPRequestPart('file', file));
        arrayOfRequestParts.push(new HTTPRequestPart('siteKey', siteKey));
        arrayOfRequestParts.push(new HTTPRequestPart('authKey', authKey));
        arrayOfRequestParts.push(new HTTPRequestPart('feedStyle', feedStyle));

        var url = 'https://' + domain + postFileLocation;

        return {
            requestMethod: 'POST',
            path: url,
            outfile: file,
            args: arrayOfRequestParts
        };
    }

};

module.exports = ServiceFactory;
