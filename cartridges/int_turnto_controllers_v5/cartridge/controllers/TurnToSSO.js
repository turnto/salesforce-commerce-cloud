'use strict';

/**
 * Controller that handles the Single Sign On Logic
 *
 * @module controllers/TurnToSSO
 */

/* Script Modules */
var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

/*Script Modules*/
var TurnToHelper = require('*/cartridge/scripts/util/HelperUtil');

/**
 * @function
 * @name getUserInfo
 * @description Retrieve User Info if user is authenticated, return JSON of user information to be sent to TurnTo
*/
function getUserInfo() {

    var data;

    if(pdict.CurrentCustomer.authenticated) {
        var profile = pdict.CurrentCustomer.profile;

        data = TurnToHelper.buildUserInfoObject(profile);

        let r = require('~/cartridge/scripts/util/Response');
        r.renderJSON({
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
    return;
}

/**
 * @function
 * @name showLogin
 * @description Render template for the login pop-up
*/
function showLogin() {

    var pageMeta = require('~/cartridge/scripts/meta');
    var ContentMgr = dw.content.ContentMgr;
    var content = ContentMgr.getContent('myaccount-login');
    var loginForm = app.getForm('login');
    var loginView = app.getView('Login',{
        RegistrationStatus: false
    });

    loginForm.clear();

    if (customer.registered) {
        loginForm.setValue('username', customer.profile.credentials.login);
        loginForm.setValue('rememberme', true);
    }
    app.getView().render('account/loginpage');
}

/**
 * @function
 * @name getLoginStatus
 * @description Retrieve User Login Status
*/
function getLoginStatus() {

    if(pdict.CurrentCustomer.authenticated) {

        let r = require('~/cartridge/scripts/util/Response');
        r.renderJSON({
			success: true,
			loggedIn: true
        });
    } else {
        res.json({
            success: true,
            loggedIn: false
        });
    }
    return;
}

/* Web exposed methods */

/** GetUserInfo makes a server-side call to retrieve user information
 * @see {@link module:controllers/TurnToSSO~GetUserInfo} */
exports.GetUserInfo = guard.ensure(['get'], getUserInfo);
/** ShowLogin retrieves the login page for the pop-up overlay
 * @see {@link module:controllers/TurnToSSO~ShowLogin} */
exports.ShowLogin = guard.ensure(['get'], showLogin);
/** GetLoginStatus retrieves user authentication status
 * @see {@link module:controllers/TurnToSSO~GetLoginStatus} */
exports.GetLoginStatus = guard.ensure(['get'], getLoginStatus);
