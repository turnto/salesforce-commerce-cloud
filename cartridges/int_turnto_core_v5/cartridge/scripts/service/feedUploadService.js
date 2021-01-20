'use strict';

/**
 * Feed Download Service
 *
 * This file acts as a wrapper for the TurnTo Feed Download Service calls
 */
/* API Modules */
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

/* Script Modules */
var ServiceFactory = require('*/cartridge/scripts/util/serviceFactory');

/* Constants */
var serviceName = ServiceFactory.SERVICES.UPLOAD;

/**
 *
 * HTTP Services
 *
 */
var serviceConfig = {
    executeOverride: true,
    createRequest: function (svc, params) {
        svc.setURL(params.path);
        svc.setRequestMethod(params.requestMethod);
        return params;
    },
    execute: function (svc, requestObject) {
        var client = svc.getClient();
        client.open(requestObject.requestMethod, requestObject.path);
        var result = client.sendMultiPart(requestObject.args);
        return result;
    },
    parseResponse: function (svc, client) {
        return client;
    },
    filterLogMessage: function (msg) {
        return msg;
    }
};

module.exports = LocalServiceRegistry.createService(serviceName, serviceConfig);
