'use strict';

/**
 * Feed Download Service
 *
 * This file acts as a wrapper for the TurnTo Feed Download Service calls
 */
/* API Modules */
var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');

/* Script Modules */
var ServiceFactory = require('*/cartridge/scripts/util/ServiceFactory');

/* Constants */
var serviceName = ServiceFactory.SERVICES.IMPORT;

/**
 *
 * HTTP Services
 *
 */
var serviceConfig = {
    createRequest: function (svc, params) {
        svc.setURL(params.path);
        svc.setOutFile(params.outfile);
        svc.setRequestMethod(params.requestMethod);
        return params;
    },
    parseResponse: function (svc, client) {
        return client.text;
    },
    filterLogMessage: function (msg) {
        return msg;
    }
};

module.exports = LocalServiceRegistry.createService(serviceName, serviceConfig);
