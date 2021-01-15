/* eslint-disable no-console */
var assert = require('chai').assert;
var request = require('request-promise');
var config = require('../it.config');

describe('TurnTo: *** controller:SpeedFlex ***', function () {
    this.timeout(5000);

    it('Endpoint:UserData - Get user data token', function () {
        var cookieJar = request.jar();
        var myRequest = {
            url: config.baseUrl + '/SpeedFlex-UserData',
            method: 'POST',
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            jar: cookieJar,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        return request(myRequest)
            .then(function (response) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');
                var jsonResponse = JSON.parse(response.body);
                assert.isObject(jsonResponse);
                return response;
            });
    });

    it('Endpoint:LoggedInData - Get LoggedIn token', function () {
        var cookieJar = request.jar();
        var myRequest = {
            url: config.baseUrl + '/SpeedFlex-LoggedInData',
            method: 'POST',
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            jar: cookieJar,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        return request(myRequest)
            .then(function (response) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');
                var jsonResponse = JSON.parse(response.body);
                assert.isObject(jsonResponse);
                return response;
            });
    });

    it('Endpoint:LoggedOut - LoggedOut user successful', function () {
        var cookieJar = request.jar();
        var myRequest = {
            url: config.baseUrl + '/SpeedFlex-LoggedOut',
            method: 'POST',
            rejectUnauthorized: false,
            resolveWithFullResponse: true,
            jar: cookieJar,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        return request(myRequest)
            .then(function (response) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');
                var jsonResponse = JSON.parse(response.body);
                assert.isObject(jsonResponse);
                assert.isNotTrue(response.body.isUserLoggedIn);
                return response;
            });
    });
});
