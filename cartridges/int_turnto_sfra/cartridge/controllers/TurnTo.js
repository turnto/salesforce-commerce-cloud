'use strict';

/**
 * SFRA Controller that renders the static content for TurnTo,
 * including Product Question & Answer and Product Reviews
 *
 * @module controllers/TurnTo
 */

/* Script Modules */
var server = require('server');

/**
 * @function
 * @name GetProductQA
 * @description Renders the Question & Answer content
 */
server.get('GetProductQA', function(req, res, next) {
	try {
		var pid = req.querystring.pid.stringValue;
		var ProductQAReviewsModel = require('int_turnto_core/cartridge/scripts/models/ProductQAReviewsModel');
		var catItemHtml = ProductQAReviewsModel.getProductQA(pid);

		res.render('product/viewqa', {
			catItemHtml: catItemHtml
		});

	} catch (e){
		res.render('error/notfound');
	}
	return next();
});

/**
 * @function
 * @name GetProductReviews
 * @description Renders the Reviews content
 */
server.get('GetProductReviews', function(req, res, next) {
	try {
		var pid = req.querystring.pid;
		var ProductQAReviewsModel = require('int_turnto_core/cartridge/scripts/models/ProductQAReviewsModel');
		var catItemReviewsHtml = ProductQAReviewsModel.getProductReviews(pid);

		res.render('product/viewreviews', {
			catItemReviewsHtml: catItemReviewsHtml
		});
	} catch (e){
		res.render('error/notfound');
	}
	return next();
});

/**
 * @function
 * @name MobileLanding
 * @description Renders the required Mobile Landing page
 */
server.get('MobileLanding', function(req, res, next) {
	var TurnToHelper = require('int_turnto_core/cartridge/scripts/util/HelperUtil');
	var isMobileLandingPageDisabled = TurnToHelper.isMobileLandingPageDisabled();
	var URLUtils = require('dw/web/URLUtils');
	if (isMobileLandingPageDisabled) {
		res.redirect(URLUtils.url('Home-Show'));
	} else {
		res.render('turnto/mobilelanding');
	}
	return next();
});

/**
 * @function
 * @name CheckoutCommentsPinboard
 * @description Renders the Checkout Comments Pinboard page
*/
server.get('CheckoutCommentsPinboard', function(req, res, next) {
	res.render('product/viewpinboard', {
		PinboardType: "checkoutComments"
	});
	return next();
});

/**
 * @function
 * @name VisualContentPinboard
 * @description Renders the Visual Content Pinboard page
*/
server.get('VisualContentPinboard', function(req, res, next) {
	res.render('product/viewpinboard', {
		PinboardType: "visualContent"
	});
	return next();
});

module.exports = server.exports();
