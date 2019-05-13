'use strict';

/**
 * Product QA Service
 *
 * This file acts as a wrapper for the TurnTo Product QA Service calls
 */
/* API Modules */
var dwsvc = require('dw/svc');

/* Script Modules */
var ServiceFactory = require('~/cartridge/scripts/util/ServiceFactory');

/* Constants */
var serviceName = ServiceFactory.SERVICES.PRODUCTQA;

/**
 *
 * HTTP Services
 *
 */
var serviceConfig = {
    transactionVars: {},
    createRequest: function (service, requestDataContainer) {
        var request;

        service.URL = service.configuration.credential.URL + (requestDataContainer.path || '');
        service.requestMethod = requestDataContainer.requestMethod || 'GET';

        return request;
    },
    parseResponse: function (service, response) {
        return response.text;
    },
    mockCall: function (service, request) {
        return {
        	text: ServiceFactory.CONSTANTS.QAHTML
        };
    },
    filterLogMessage: function (msg) {
        return msg;
    }
};

module.exports = dwsvc.LocalServiceRegistry.createService(serviceName, serviceConfig);
