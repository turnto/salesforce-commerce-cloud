'use strict';

/**
 * Feed Download Service
 *
 * This file acts as a wrapper for the TurnTo Feed Download Service calls
 */
/* API Modules */
var dwsvc = require('dw/svc');

/* Script Modules */
var ServiceFactory = require('~/cartridge/scripts/util/ServiceFactory');

/* Constants */
var serviceName = ServiceFactory.SERVICES.IMPORT;

/**
 *
 * HTTP Services
 *
 */
var serviceConfig = {
    createRequest: function (service, requestDataContainer) {
        var request;

        service.URL = requestDataContainer.path;
        service.setOutFile(requestDataContainer.outfile);
        service.requestMethod = requestDataContainer.requestMethod;

        return request;
    },
    parseResponse: function (service, response) {
        return response.text;
    },
    mockCall: function (service, request) {
        return {};
    },
    filterLogMessage: function (msg) {
        return msg;
    }
};

module.exports = dwsvc.LocalServiceRegistry.createService(serviceName, serviceConfig);
