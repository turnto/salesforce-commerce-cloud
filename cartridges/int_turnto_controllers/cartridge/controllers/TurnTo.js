'use strict';

/**
 * Controller that renders the static content for TurnTo,
 * including Product Question & Answer and Product Reviews
 *
 * @module controllers/TurnTo
 */

/* Script Modules */
var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

/**
 * Renders the Question & Answer content
 */
function getProductQA() {
	try {
		var pid = request.httpParameterMap.pid.stringValue;
		var GetProductQA = require('int_turnto_core/cartridge/scripts/GetProductQA');
		var catItemHtml = GetProductQA.getProductQA(pid);
		app.getView({
			catItemHtml: catItemHtml
		}).render('product/viewqa');
   	}  catch (e){
   		var ex = e;
   		app.getView().render('error/notfound');
   	}
}

/**
 * Renders the Reviews content
 */
function getProductReviews() {
	try {
		var pid = request.httpParameterMap.pid.stringValue;
		var GetProductReviews = require('int_turnto_core/cartridge/scripts/GetProductReviews');
		var catItemReviewsHtml = GetProductReviews.getProductReviews(pid);
		app.getView({
			catItemReviewsHtml: catItemReviewsHtml
		}).render('product/viewreviews');
   	}  catch (e){
   		var ex = e;
   		app.getView().render('error/notfound');
   	}
}

/**
 * Renders the required Mobile Landing page
 */
function mobileLanding() {
	app.getView().render('turnto/mobilelanding');
}

/**
 * Renders the Checkout Comments Pinboard page
*/
function checkoutCommentsPinboard() {
	app.getView({
		PinboardType: "checkoutComments"
	}).render('product/viewpinboard');
}

/**
 * Renders the Visual Content Pinboard page
*/
function visualContentPinboard() {
	app.getView({
		PinboardType: "visualContent"
	}).render('product/viewpinboard');
}

/* Web exposed methods */

/** GetProductQA makes a server-side call to turnto.com to get the Question and Answer content
 * @see {@link module:controllers/TurnTo~getProductQA} */
exports.GetProductQA = guard.ensure(['get'], getProductQA);
/** GetProductReviews makes a server-side call to turnto.com to get the Reviews content
 * @see {@link module:controllers/TurnTo~getProductReviews} */
exports.GetProductReviews = guard.ensure(['get'], getProductReviews);
/** MobileLanding page is required, regardless of set up type and whether a site is responsive.
 * @see {@link module:controllers/TurnTo~mobileLanding} */
exports.MobileLanding = guard.ensure(['get'], mobileLanding);
/** CheckoutCommentsPinboard is a landing page that showcases customer-submitted checkout comments in a responsive browsing experience.
 * @see {@link module:controllers/TurnTo~checkoutCommentsPinboard} */
exports.CheckoutCommentsPinboard = guard.ensure(['get'], checkoutCommentsPinboard);
/** VisualContentPinboard is a landing page that showcases customer-submitted images and videos in a responsive browsing experience.
 * @see {@link module:controllers/TurnTo~visualContentPinboard} */
exports.VisualContentPinboard = guard.ensure(['get'], visualContentPinboard);