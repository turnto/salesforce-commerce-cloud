'use strict';

var server = require('server');
var Logger = require('dw/system/Logger');

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

        var URLUtils = require('dw/web/URLUtils');
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
        var pathname = pathMatch[1];

        var allowedPathPatterns = [
            /^\/s\/[^/]+\/.*$/, // SEO product pages: /s/{siteID}/{category}/{slug}/{pid}.html
            /^\/product\/[^/]+\/[^/]+\.html$/, // Standard product pages: /product/{slug}/{pid}.html
            /^\/on\/demandware\.store\/Sites-[^/]+-Site\/[^/]+\/Product-Show$/ // Product-Show controller: /on/demandware.store/Sites-{site}-Site/{locale}/Product-Show
        ];

        var isAllowedPath = allowedPathPatterns.some(function(pattern) {
            return pattern.test(pathname);
        });

        if (!isAllowedPath) {
            Logger.warn('SpeedFlex path not in whitelist: {0}', pathname);
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
    var URLUtils = require('dw/web/URLUtils');
    var authHelper = require('*/cartridge/scripts/util/AuthHelper');

    var target = request.getHttpReferer();
    var validatedUrl = validateRedirectUrl(target);
    var rurlEndpoint = 1; // Default fallback to Account-Show

    if (validatedUrl) {
        // Store the validated URL for post-login redirect
        req.session.privacyCache.set('turntoRedirectUrl', validatedUrl);

        var endpoints = require('*/cartridge/config/oAuthRenentryRedirectEndpoints');
        Object.keys(endpoints).forEach(function(key) {
            if (endpoints[key] === 'SpeedFlex-LoginRedirect') {
                rurlEndpoint = parseInt(key, 10);
            }
        });
    }
    var redirectUrl = URLUtils.url('Login-Show', 'rurl', rurlEndpoint).toString();

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

server.get('LoginRedirect', function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var redirectUrl = req.session.privacyCache.get('turntoRedirectUrl');
    if (redirectUrl) {
        req.session.privacyCache.set('turntoRedirectUrl', null);
        res.redirect(redirectUrl);
    } else {
        res.redirect(URLUtils.url('Account-Show'));
    }

    return next();
});

module.exports = server.exports();
