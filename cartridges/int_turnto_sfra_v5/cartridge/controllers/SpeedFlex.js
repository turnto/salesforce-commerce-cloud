'use strict';

var server = require('server');

server.post('UserData', server.middleware.https, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var authHelper = require('*/cartridge/scripts/util/AuthHelper');

    var target = request.getHttpReferer();
    var redirectUrl = URLUtils.url('Login-Show', 'rurl', target).toString();

    var customer = session.getCustomer();
    var userAuthToken = session.getSessionID();
    var isUserLoggedIn = customer.authenticated && customer.registered;
    var userDataToken = isUserLoggedIn ? authHelper.getUserDataToken(customer, userAuthToken) : null;

    res.json({
        isUserLoggedIn: isUserLoggedIn,
        redirectUrl: redirectUrl,
        userDataToken: userDataToken
    });
    return next();
});

server.post('LoggedInData', server.middleware.https, function (req, res, next) {
    var authHelper = require('*/cartridge/scripts/util/AuthHelper');

    var customer = session.getCustomer();
    var userAuthToken = session.getSessionID();
    var userDataToken = authHelper.getLoggedInDataToken(customer, userAuthToken);

    res.json({
        userDataToken: userDataToken
    });
    return next();
});

server.post('LoggedOut', server.middleware.https, function (req, res, next) {
    var CustomerMgr = require('dw/customer/CustomerMgr');
    CustomerMgr.logoutCustomer(false);
    res.json({
        isUserLoggedIn: false
    });
    return next();
});

module.exports = server.exports();
