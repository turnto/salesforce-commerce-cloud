'use strict';

/**
 * SFRA Controller that handles the Single Sign On Logic
 *
 * @module controllers/TurnToSSO
 */

/* Script Modules */
var server = require('server');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');

/*Script Modules*/
var TurnToHelper = require('*/cartridge/scripts/util/HelperUtil');

/**
 * @function
 * @name GetUserInfo
 * @description Retrieve User Info if user is authenticated, return JSON of user information to be sent to TurnTo
*/
server.get(
	'GetUserInfo',
	function (req, res, next) {
		var data;

		if(session.customerAuthenticated) {
			var profile = req.currentCustomer.profile;

			data = TurnToHelper.buildUserInfoObject(profile);

			res.json({
				success: true,
				user_auth_token : data['user_auth_token'],
				first_name: data['first_name'],
				last_name: data['last_name'],
				email: data['email'],
				email_confirmed: data['email_confirmed'],
				nickname: data['nickname'],
				issued_at: data['issued_at'],
				signature: data['signature']
			});
		} else {
			res.json({
				success: false
			});
		}
		return next();
	}
);

/**
 * @function
 * @name ShowLogin
 * @description Render template for the login pop-up
*/
server.get(
	'ShowLogin',
	consentTracking.consent,
	server.middleware.https,
	csrfProtection.generateToken,
	function (req, res, next) {
		var URLUtils = require('dw/web/URLUtils');
		var Resource = require('dw/web/Resource');

		var rememberMe = false;
		var userName = '';
		var actionUrl = URLUtils.url('Account-Login');
		var navTabValue = req.querystring.action;

		if (req.currentCustomer.credentials) {
			rememberMe = true;
			userName = req.currentCustomer.credentials.username;
		}

		var breadcrumbs = [
			{
				htmlValue: Resource.msg('global.home', 'common', null),
				url: URLUtils.home().toString()
			}
		];

		var profileForm = server.forms.getForm('profile');
		profileForm.clear();

		res.render('/account/loginpage', {
			navTabValue: navTabValue || 'login',
			rememberMe: rememberMe,
			userName: userName,
			actionUrl: actionUrl,
			profileForm: profileForm,
			breadcrumbs: breadcrumbs,
			oAuthReentryEndpoint: 1
		});
		return next();
	}
);

/**
 * @function
 * @name GetLoginStatus
 * @description Retrieve User Login Status
*/
server.get(
	'GetLoginStatus',
	function (req, res, next) {
		if(session.customerAuthenticated) {
			res.json({
				success: true,
				loggedIn: true
			});
		} else {
			res.json({
				success: true,
				loggedIn: false
			});
		}
		return next();
	}
);

module.exports = server.exports();
