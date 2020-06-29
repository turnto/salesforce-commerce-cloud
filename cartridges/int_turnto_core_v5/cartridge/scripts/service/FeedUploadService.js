'use strict';

var Logger = require('dw/system/Logger');

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
var serviceName = ServiceFactory.SERVICES.UPLOAD;

/**
 *
 * HTTP Services
 *
 */
var serviceConfig = {
	executeOverride: true,
    createRequest: function (service, requestDataContainer) {
    	
        var request = {};
        request.URL = requestDataContainer.path;
        request.requestMethod = requestDataContainer.requestMethod;
        request.args = requestDataContainer.args;

        return request;
    },
    execute: function (service, requestObject) {   	
        var client = service.getClient();
        client.open(requestObject.requestMethod, requestObject.URL);
        result = client.sendMultiPart( requestObject.args);

        return result;
    },
    parseResponse: function (service, response) {
        return response;
    },
    mockCall: function (service, request) {
        return {};
    },
    filterLogMessage: function (msg) {
        return msg;
    }
};

module.exports = dwsvc.LocalServiceRegistry.createService(serviceName, serviceConfig);
