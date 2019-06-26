'use strict';

/**
 *   Name: ServiceFactory
 */

/* API Modules */
var Logger = require('dw/system/Logger');
var Site = require('dw/system/Site');
var ProductMgr = require('dw/catalog/ProductMgr');

/*Script Modules*/
var TurnToHelper = require('int_turnto_core/cartridge/scripts/util/HelperUtil');

// Public
var ServiceFactory = {
		
	CONSTANTS: {
		QAHTML		 : '<div id="TurnToContent"></div>',
		REVIEWSHTML	: '<div id="TurnToReviewsContent"></div>'
			
	},

	// Service IDs
	SERVICES: {
		PRODUCTQA		 : 'turnto.http.static.qa.get',
		PRODUCTREVIEWS	: 'turnto.http.static.reviews.get',
		IMPORT			: 'turnto.http.import.get',
		UPLOAD			: 'turnto.http.upload.get'
	},

	/*****************************************************
	 * Preferences
	 ****************************************************/
	
	/**
	 * @name getSiteKeyPreference
	 * @desc returns the site key custom site preference
	 */
	getSiteKeyPreference: function () {
		return TurnToHelper.getLocalizedSitePreferenceFromRequestLocale('turntoSiteKey');
	},
	
	/**
	 * @name getAuthKeyPreference
	 * @desc returns the auth key custom site preference
	 */
	getAuthKeyPreference: function () {
		return TurnToHelper.getLocalizedSitePreferenceFromRequestLocale('turntoAuthKey');
	},

	/**
	 * @name getLocalizedSiteKeyPreference
	 * @desc returns the site key custom site preference using the parameter locale
	 */
	getLocalizedSiteKeyPreference: function (currentLocale) {
		return TurnToHelper.getLocalizedTurnToPreferenceValue('turntoSiteKey', currentLocale);
	},
	
	/**
	 * @name getLocalizedAuthKeyPreference
	 * @desc returns the auth key custom site preference using the parameter locale
	 */
	getLocalizedAuthKeyPreference: function (currentLocale) {
		return TurnToHelper.getLocalizedTurnToPreferenceValue('turntoAuthKey', currentLocale);
	},

	/**
	 * @name getVersionNumberPreference
	 * @desc returns the version number custom site preference
	 */
	getVersionNumberPreference: function () {
		return Site.getCurrent().getCustomPreferenceValue('turntoVersionNumber');
	},

	/**
	 * @name getUseVariantsPreference
	 * @desc returns the use variants custom site preference
	 */
	getUseVariantsPreference: function () {
		return Site.getCurrent().getCustomPreferenceValue('turntoUseVariants') == true;
	},

	/**
	 * @name getStaticURLPreference
	 * @desc returns the static URL custom site preference
	 */
	getStaticURLPreference: function () {
		return Site.getCurrent().getCustomPreferenceValue('turntoStaticURL');
	},
	
	/**
	 * @name getURLPreference
	 * @desc returns the static URL custom site preference
	 */
	getURLPreference: function () {
		return Site.getCurrent().getCustomPreferenceValue('turntoURL');
	},

	/*****************************************************
	 * Other Getters
	 ****************************************************/

	/**
	 * @name getLogger
	 * @desc returns the logger
	 */
	getLogger: function (method) {
		return Logger.getLogger('TurnToProduct');
	},

	/**
	 * @name getProduct
	 * @desc returns the product ID 
	 */
	getProduct: function(pid) {
		var product = ProductMgr.getProduct(pid);
		var useVariants : Boolean = ServiceFactory.getUseVariantsPreference();
		if (product.isMaster() && useVariants) {
			pid = product.getVariationModel().defaultVariant.ID;
		} else {
			pid = product.isVariant() && !useVariants ? product.masterProduct.ID : product.ID;
		}
		return pid;
	},

	/**
	 * @name getURLPath
	 * @desc returns the URL path with appended parameters
	 */
	getURLPath: function (productID, append) {
		return '/sitedata/' + ServiceFactory.getSiteKeyPreference() + "/v" + ServiceFactory.getVersionNumberPreference().replace('.', '_') + "/" + productID + "/d/" + append;

	},

	/*****************************************************
	 * Request Data Containers
	 ****************************************************/

	/**
	 * @function
	 * @name buildGetProductQARequestContainer
	 * @param {String} pid
	 */
	buildGetProductQARequestContainer: function (pid) {
		
		var productID = ServiceFactory.getProduct(pid);
		var append = 'catitemhtml';

		var requestDataContainer = {
			requestMethod: 'GET',
			path: ServiceFactory.getURLPath(productID, append)
		};

		return requestDataContainer;
	},

	/**
	 * @function
	 * @name buildGetProductReviewsRequestContainer
	 * @param {String} pid
	 */
	buildGetProductReviewsRequestContainer: function (pid) {
		
		var productID = ServiceFactory.getProduct(pid);
		var append = 'catitemreviewshtml';

		var requestDataContainer = {
			requestMethod: 'GET',
			path: ServiceFactory.getURLPath(productID, append)
		};

		return requestDataContainer;
	},

	/**
	 * @function
	 * @name buildFeedDownloadRequestContainer
	 * @param {String} xmlName
	 * @param {String} currentLocale
	 * @param {String} file
	 */
	buildFeedDownloadRequestContainer: function (xmlName, currentLocale, file) {

		var siteKey = ServiceFactory.getLocalizedSiteKeyPreference(currentLocale);
		var authKey = ServiceFactory.getLocalizedAuthKeyPreference(currentLocale);
		
		//If turntoAuthKey and turntoSiteKey values are not defined for a particular locale the job should skip the locale.
		if(empty(siteKey) || empty(authKey)) {
			return false;
		}
		
		//Distinguish two different download URLs (Example for UGC http://www.turnto.com/static/export/YOURSITEKEY/YOURAUTHKEY/turnto-ugc.xml)
		//"/turnto-skuaveragerating.xml" OR "/turnto-ugc.xml"
		var url = "http://" + ServiceFactory.getStaticURLPreference() + "/static/export/" + siteKey + "/" + authKey + xmlName;

		var requestDataContainer = {
			requestMethod: 'GET',
			path: url,
			outfile : file
		};

		return requestDataContainer;
	},
	
	/**
	 * @function
	 * @name buildFeedUploadRequestContainer
	 * @param {String} postFileLocation
	 * @param {String} currentLocale
	 * @param {String} file
	 */
	buildFeedUploadRequestContainer: function (postFileLocation, currentLocale, file) {

		var siteKey = ServiceFactory.getLocalizedSiteKeyPreference(currentLocale);
		var authKey = ServiceFactory.getLocalizedAuthKeyPreference(currentLocale);

		//If turntoAuthKey and turntoSiteKey values are not defined for a particular locale the job should skip the locale.
		if(empty(siteKey) || empty(authKey)) {
			return false;
		}

		//Create array of request parts to add to request
		var arrayOfRequestParts : Array = new Array();
		arrayOfRequestParts.push(new dw.net.HTTPRequestPart('file', file));
		arrayOfRequestParts.push(new dw.net.HTTPRequestPart('siteKey', siteKey));
		arrayOfRequestParts.push(new dw.net.HTTPRequestPart('authKey', authKey));
		arrayOfRequestParts.push(new dw.net.HTTPRequestPart('feedStyle', 'tab-style.1'));

		var url = "http://" + ServiceFactory.getURLPreference() + postFileLocation;

		var requestDataContainer = {
			requestMethod: 'POST',
			path: url,
			outfile: file,
			args: arrayOfRequestParts
		};

		return requestDataContainer;
	}

};

module.exports = ServiceFactory;