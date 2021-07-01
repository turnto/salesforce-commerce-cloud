'use strict';

/* API Includes */
var Mac = require('dw/crypto/Mac');
var Encoding = require('dw/crypto/Encoding');
var Bytes = require('dw/util/Bytes');

/* Script Includes*/
var turnToHelper = require('*/cartridge/scripts/util/TurnToHelperUtil');

/**
 * @description Encodes a string into URL Base64 safe
 * @param {string | dw.util.Bytes} input - data to Encode
 * @returns {string} - encoded Base64 URL safe string
 */
function urlsafeB64Encode(input) {
    var bt = typeof input === 'string' ? new Bytes(input) : input;
    return Encoding.toBase64(bt).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * @description Computes the signature for the TurnTo Request
 * @param {Object} payload - payload of JWT token
 * @param {string} secretKey - key for compute signature
 * @returns {string} - JWT token
 */
function computeJwtToken(payload, secretKey) {
    var header = {
        alg: 'HS256',
        typ: 'JWT'
    };

    var headerStr = JSON.stringify(header);
    var objStr = JSON.stringify(payload);
    var unsignedToken = urlsafeB64Encode(headerStr) + '.' + urlsafeB64Encode(objStr);

    var mac = new Mac(Mac.HMAC_SHA_256);
    var signature = urlsafeB64Encode(mac.digest(unsignedToken, secretKey));
    var jwt = unsignedToken + '.' + signature;
    return jwt;
}

/**
 * Get TornTo UserData JWT token
 * @description Create TornTo JWT token
 * @param {dw.customer.Customer} currentCustomer - customer object
 * @param {string} userAuthToken - user authorization token
 * @returns {string} - JWT token
 */
function getUserDataToken(currentCustomer, userAuthToken) {
    var turnToKeys = turnToHelper.getLocalizedSitePreferenceFromRequestLocale();
    var turntoAuthKey = turnToKeys && Object.hasOwnProperty.call(turnToKeys, 'turntoAuthKey') ? turnToKeys.turntoAuthKey : null;
    var jwt = null;
    if (currentCustomer.authenticated && currentCustomer.registered && turntoAuthKey) {
        var data = {
            fn: currentCustomer.profile.firstName,
            ln: currentCustomer.profile.lastName,
            nn: currentCustomer.profile.firstName + currentCustomer.profile.lastName,
            e: currentCustomer.profile.email,
            ua: userAuthToken,
            iss: 'TurnTo',
            exp: Math.floor((Date.now() / 1000) + 86400)
        };
        jwt = computeJwtToken(data, turntoAuthKey);
    }
    return jwt;
}

/**
 * @description Create TornTo LoggedInData JWT token
 * @param {dw.customer.Customer} currentCustomer - customer object
 * @param {string} userAuthToken - user authorization token
 * @returns {string} - JWT token
 */
function getLoggedInDataToken(currentCustomer, userAuthToken) {
    var turnToKeys = turnToHelper.getLocalizedSitePreferenceFromRequestLocale();
    var turntoAuthKey = turnToKeys && Object.hasOwnProperty.call(turnToKeys, 'turntoAuthKey') ? turnToKeys.turntoAuthKey : null;
    var jwt = null;
    if (currentCustomer.authenticated && currentCustomer.registered && turntoAuthKey) {
        var data = {
            iss: 'TurnTo',
            exp: Math.floor((Date.now() / 1000) + 86400),
            ua: userAuthToken,
            e: currentCustomer.profile.email
        };
        jwt = computeJwtToken(data, turntoAuthKey);
    }
    return jwt;
}

module.exports = {
    getUserDataToken: getUserDataToken,
    getLoggedInDataToken: getLoggedInDataToken
};
