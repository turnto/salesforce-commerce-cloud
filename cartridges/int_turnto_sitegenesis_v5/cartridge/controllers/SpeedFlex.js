/**
* Description of the Controller and the logic it provides
*
* @module  controllers/SpeedFlex
*/

'use strict';

var URLUtils = require('dw/web/URLUtils');
var CustomerMgr = require('dw/customer/CustomerMgr');
var Logger = require('dw/system/Logger');

var guard = require('*/cartridge/scripts/guard');
var Response = require('*/cartridge/scripts/util/Response');
var authHelper = require('*/cartridge/scripts/util/AuthHelper');
var TurnToHelper = require('*/cartridge/scripts/util/TurnToHelperUtil');


var userData = function () {
    try {
        var customer = session.getCustomer();
        var userAuthToken = session.getSessionID();
        var isUserLoggedIn = customer.authenticated && customer.registered;
        var userDataToken = null;
        if (isUserLoggedIn) {
            try {
                var turnToKeys = TurnToHelper.getLocalizedSitePreferenceFromRequestLocale();

                if (!turnToKeys || !turnToKeys.turntoAuthKey) {
                    Logger.error('TurnTo site preferences not configured - missing turntoAuthKey');
                    Response.renderJSON({
                        error: true,
                        errorMessage: 'TurnTo site preferences not configured',
                        isUserLoggedIn: false
                    });
                    return;
                }

                userDataToken = authHelper.getUserDataToken(customer, userAuthToken);
            } catch (tokenError) {
                Logger.error('Error generating userDataToken: {0}', tokenError.message);
                Response.renderJSON({
                    error: true,
                    errorMessage: 'Error generating user token: ' + tokenError.message,
                    isUserLoggedIn: false
                });
                return;
            }
        }

        if (isUserLoggedIn) {
            // User is already logged in, return success
            Response.renderJSON({
                isUserLoggedIn: true,
                userDataToken: userDataToken
            });
        } else {
            // User not logged in, redirect to guarded endpoint
            var redirectUrl = URLUtils.url('SpeedFlex-LoginRedirect').toString();
            Response.renderJSON({
                isUserLoggedIn: false,
                redirectUrl: redirectUrl
            });
        }
    } catch (e) {
        Logger.error('SpeedFlex-UserData error: {0}', e.message);

        Response.renderJSON({
            error: true,
            errorMessage: 'Error processing user data: ' + e.message,
            isUserLoggedIn: false
        });
    }
};

var loginRedirect = function () {
    var refererUrl = request.getHttpReferer();
    var redirectUrl = TurnToHelper.validateRedirectUrl(refererUrl);
    if (!redirectUrl) {
        redirectUrl = URLUtils.home().toString();
    }

    if (!customer.authenticated) {
        session.custom.TargetLocation = redirectUrl;
        response.redirect(URLUtils.https('Login-Show'));
    } else {
        var targetLocation = session.custom.TargetLocation;
        if (targetLocation) {
            var validatedTarget = TurnToHelper.validateRedirectUrl(targetLocation);
            if (validatedTarget) {
                Logger.warn('Redirecting back to validated stored target location: {0}', validatedTarget);
                delete session.custom.TargetLocation;
                response.redirect(validatedTarget);
            } else {
                Logger.warn('Stored target location failed validation: {0}, using home', targetLocation);
                delete session.custom.TargetLocation;
                response.redirect(URLUtils.home());
            }
        } else {
            Logger.warn('No stored target, using validated PDP URL: {0}', redirectUrl);
            response.redirect(redirectUrl);
        }
    }
};

var loggedInData = function () {
    try {
        var customer = session.getCustomer();
        var userAuthToken = session.getSessionID();
        var userDataToken = authHelper.getLoggedInDataToken(customer, userAuthToken);

        Response.renderJSON({
            userDataToken: userDataToken
        });
    } catch (e) {
        Response.renderJSON({
            error: true,
            errorMessage: 'Error getting logged in data: ' + e.message
        });
    }
};

var logOut = function () {
    try {
        CustomerMgr.logoutCustomer(false);
        Response.renderJSON({
            isUserLoggedIn: false
        });
    } catch (e) {
        Response.renderJSON({
            error: true,
            errorMessage: 'Error logging out: ' + e.message,
            isUserLoggedIn: false
        });
    }
};

exports.UserData = guard.ensure(['https', 'post'], userData);
exports.LoginRedirect = guard.ensure(['https', 'get'], loginRedirect);
exports.LoggedInData = guard.ensure(['https', 'post'], loggedInData);
exports.Logout = guard.ensure(['https', 'get'], logOut);
