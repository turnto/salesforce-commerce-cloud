'use strict';

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var Logger = require('dw/system/Logger');
var CustomerMgr = require('dw/customer/CustomerMgr');

// Load additional dependencies
var authHelper = require('*/cartridge/scripts/util/AuthHelper');
var endpoints = require('*/cartridge/config/oAuthRenentryRedirectEndpoints');
var TurnToHelper = require('*/cartridge/scripts/util/TurnToHelperUtil');


server.post('UserData', server.middleware.https, function (req, res, next) {
    var customer = session.getCustomer();
    var userAuthToken = session.getSessionID();
    var isUserLoggedIn = customer.authenticated && customer.registered;
    var userDataToken = isUserLoggedIn ? authHelper.getUserDataToken(customer, userAuthToken) : null;

    if (isUserLoggedIn) {
        res.json({
            isUserLoggedIn: true,
            userDataToken: userDataToken
        });
        return next();
    }

    var target = request.getHttpReferer();
    var validatedUrl = TurnToHelper.validateRedirectUrl(target);
    if (!validatedUrl) {
        Logger.error('SpeedFlex-UserData: Invalid or missing redirect URL: {0}', target);
        res.json({
            error: true,
            errorMessage: 'Invalid or missing redirect URL',
            isUserLoggedIn: false
        });
        return next();
    }

    var rurlEndpoint = null;

    Object.keys(endpoints).forEach(function(key) {
        if (endpoints[key] === 'SpeedFlex-LoginRedirect') {
            rurlEndpoint = parseInt(key, 10);
        }
    });

    if (!rurlEndpoint) {
        Logger.error('SpeedFlex-UserData: SpeedFlex-LoginRedirect endpoint not found in oAuthRenentryRedirectEndpoints');
        res.json({
            error: true,
            errorMessage: 'Redirect endpoint not configured',
            isUserLoggedIn: false
        });
        return next();
    }

    // Store the validated URL and return login redirect
    req.session.privacyCache.set('speedFlexRedirectUrl', validatedUrl);
    var redirectUrl = URLUtils.url('Login-Show', 'rurl', rurlEndpoint).toString();

    res.json({
        isUserLoggedIn: false,
        redirectUrl: redirectUrl
    });
    return next();
});

server.post('LoggedInData', server.middleware.https, function (req, res, next) {

    var customer = session.getCustomer();
    var userAuthToken = session.getSessionID();
    var userDataToken = authHelper.getLoggedInDataToken(customer, userAuthToken);

    res.json({
        userDataToken: userDataToken
    });
    return next();
});

server.post('LoggedOut', server.middleware.https, function (req, res, next) {
    CustomerMgr.logoutCustomer(false);
    res.json({
        isUserLoggedIn: false
    });
    return next();
});

server.get('LoginRedirect', function (req, res, next) {
    var redirectUrl = req.session.privacyCache.get('speedFlexRedirectUrl');
    if (redirectUrl) {
        req.session.privacyCache.set('speedFlexRedirectUrl', null);
        res.redirect(redirectUrl);
    } else {
        res.redirect(URLUtils.url('Account-Show'));
    }

    return next();
});

module.exports = server.exports();
