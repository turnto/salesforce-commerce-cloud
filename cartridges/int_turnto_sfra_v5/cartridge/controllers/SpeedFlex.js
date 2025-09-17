'use strict';

var server = require('server');
var URLUtils = require('dw/web/URLUtils');
var Logger = require('dw/system/Logger');
var CustomerMgr = require('dw/customer/CustomerMgr');

// Load additional dependencies
var authHelper = require('*/cartridge/scripts/util/AuthHelper');
var endpoints = require('*/cartridge/config/oAuthRenentryRedirectEndpoints');

/**
 * Validates parameter values to prevent script injection
 * @param {string} value - The parameter value to validate
 * @returns {boolean} - True if value is safe
 */
function isValidParameterValue(value) {
    if (!value) {
        return true; // Empty values are safe
    }

    // Decode URL-encoded value to check actual content
    var decodedValue = decodeURIComponent(value);

    var dangerousPatterns = [
        /</,                 // Any HTML tags (no legitimate use in URL params)
        />/,                 // Closing HTML tags
        /javascript:/i,      // JavaScript protocol
        /vbscript:/i,        // VBScript protocol
        /data:/i,            // Data URLs (can contain scripts)
        /expression\s*\(/i   // CSS expressions
    ];

    // Check if value contains any dangerous patterns
    var isDangerous = dangerousPatterns.some(function(pattern) {
        return pattern.test(decodedValue);
    });

    if (isDangerous) {
        Logger.warn('SpeedFlex blocked dangerous parameter value: {0}', value);
        return false;
    }

    if (decodedValue.length > 500) {
        Logger.warn('SpeedFlex blocked oversized parameter value: {0} chars', decodedValue.length);
        return false;
    }

    return true;
}

/**
 * Validates and sanitizes a redirect URL to prevent open redirect vulnerabilities
 * @param {string} url - The URL to validate
 * @returns {string|null} - Validated URL or null if invalid
 */
function validateRedirectUrl(url) {
    if (!url) {
        return null;
    }

    try {
        // only allow HTTP/HTTPS
        if (!url.match(/^https?:\/\//)) {
            Logger.warn('SpeedFlex blocked non-HTTP(S) protocol: {0}', url);
            return null;
        }

        var currentSiteUrl = URLUtils.home().toString();
        var currentDomainMatch = currentSiteUrl.match(/https?:\/\/([^/]+)/);
        var currentDomain = currentDomainMatch ? currentDomainMatch[1] : null;

        var targetDomainMatch = url.match(/https?:\/\/([^/]+)/);
        var targetDomain = targetDomainMatch ? targetDomainMatch[1] : null;

        // Domain validation
        if (!currentDomain || !targetDomain || currentDomain !== targetDomain) {
            Logger.warn('SpeedFlex external redirect domain: {0}', targetDomain);
            return null;
        }

        // Path extraction and validation
        var pathMatch = url.match(/https?:\/\/[^/]+([^?]*)/);
        if (!pathMatch) {
            Logger.warn('SpeedFlex invalid URL format: {0}', url);
            return null;
        }

        // Sanitize query parameters - remove potentially dangerous
        var baseUrl = url.split('?')[0];
        var queryString = url.indexOf('?') > -1 ? url.split('?')[1] : '';

        if (queryString) {
            var safeParams = [];
            var params = queryString.split('&');

            // Whitelist of safe query parameters
            var allowedParams = ['pid', 'lang', 'dwvar_', 'cgid', 'pmin', 'pmax', 'srule', 'sz'];

            params.forEach(function(param) {
                var keyValue = param.split('=');
                var key = keyValue[0];
                var value = keyValue[1] || '';

                var isAllowed = allowedParams.some(function(allowedParam) {
                    return key === allowedParam || key.indexOf(allowedParam) === 0;
                });

                if (isAllowed && isValidParameterValue(value)) {
                    safeParams.push(param);
                }
            });

            return baseUrl + (safeParams.length > 0 ? '?' + safeParams.join('&') : '');
        }

        return url;
    } catch (e) {
        Logger.error('Error validating redirect URL: {0}', e.message);
        return null;
    }
}

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
    var validatedUrl = validateRedirectUrl(target);

    // For non-logged-in users, require valid redirect URL
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
