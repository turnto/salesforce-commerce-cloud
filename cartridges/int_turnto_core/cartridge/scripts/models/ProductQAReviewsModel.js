'use strict';
/**
 * ProductQAReviewsModel.js
 *
 * The script handles the logic for calling the services for retrieve the product QA or reviews
*/

/* Modules */
var ServiceFactory = require('~/cartridge/scripts/util/ServiceFactory');
var ProductQAService = require('~/cartridge/scripts/service/ProductQAService');
var ProductReviewsService = require('~/cartridge/scripts/service/ProductReviewsService');

var TurnToModel = ({
	
	/**
	 * @function
	 * @name getProductQA
	 * @param {String} pid
	 * @returns {String} html
	*/
	getProductQA : function(pid) {

		if(!empty(pid)) {
			var requestDataContainer = ServiceFactory.buildGetProductQARequestContainer(pid);
			
			var productQAResult = ProductQAService.call(requestDataContainer);
		
			if (productQAResult.isOk()) {
				return productQAResult.getObject().toString();
			}
		}
		return ServiceFactory.CONSTANTS.QAHTML;
	},
	
	/**
	 * @function
	 * @name getProductReviews
	 * @param {String} pid
	 * @returns {String} html
	*/
	getProductReviews : function(pid) {

		if(!empty(pid)) {
			var requestDataContainer = ServiceFactory.buildGetProductReviewsRequestContainer(pid);
			
			var productReviewsResult = ProductReviewsService.call(requestDataContainer);
		
			if (productReviewsResult.isOk()) {
				return productReviewsResult.getObject().toString();
			}
		}
		return ServiceFactory.CONSTANTS.REVIEWSHTML;
	}
});

module.exports = TurnToModel;
