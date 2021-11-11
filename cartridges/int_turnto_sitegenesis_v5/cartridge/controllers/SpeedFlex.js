/**
* Description of the Controller and the logic it provides
*
* @module  controllers/SpeedFlex
*/

'use strict';

var guard = require('*/cartridge/scripts/guard');
var Response = require('*/cartridge/scripts/util/Response');
var authHelper = require('*/cartridge/scripts/util/authHelper');

var userData = function () {
    var URLUtils = require('dw/web/URLUtils');

    var target = request.getHttpReferer();
    var redirectUrl = URLUtils.url('Login-Show', 'rurl', target).toString();

    var customer = session.getCustomer();
    var userAuthToken = session.getSessionID();
    var isUserLoggedIn = customer.authenticated && customer.registered;
    var userDataToken = isUserLoggedIn ? authHelper.getUserDataToken(customer, userAuthToken) : null;

    Response.renderJSON({
        isUserLoggedIn: isUserLoggedIn,
        redirectUrl: redirectUrl,
        userDataToken: userDataToken
    });
};

var loggedInData = function () {
    var customer = session.getCustomer();
    var userAuthToken = session.getSessionID();
    var userDataToken = authHelper.getLoggedInDataToken(customer, userAuthToken);

    Response.renderJSON({
        userDataToken: userDataToken
    });
};

var logOut = function () {
    var CustomerMgr = require('dw/customer/CustomerMgr');
    CustomerMgr.logoutCustomer(false);
    Response.renderJSON({
        isUserLoggedIn: false
    });
};

exports.UserData = guard.ensure(['https', 'post'], userData);
exports.LoggedInData = guard.ensure(['https', 'post'], loggedInData);
exports.Logout = guard.ensure(['https', 'get'], logOut);
