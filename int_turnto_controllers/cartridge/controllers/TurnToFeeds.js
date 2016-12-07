'use strict';

/**
 * Controller that contains the logic for the TurnTo feeds
 * 
 * @module controllers/TurnTo
 */

/* Script Modules */
var app = require('app_storefront_controllers/cartridge/scripts/app');
var guard = require('app_storefront_controllers/cartridge/scripts/guard');

function ExportHistoricalOrders () {
	
}

function ExportCatalog () {
	try {
		var exportCatalog = require('int_turnto_core/cartridge/scripts/ExportCatalog');
		exportCatalog.exportCatalog();
	}
	catch (e) {
		var ex = e;
		return false;
	}
}

function ExportHistoricalOrdersByDate () {
	
}

function ImportAverageRatings () {
	
}

function ImportUserGeneratedContent () {
	
}



/* Web exposed methods */

exports.ExportHistoricalOrders=ExportHistoricalOrders;
exports.ExportCatalog=ExportCatalog;
exports.ExportHistoricalOrdersByDate=ExportHistoricalOrdersByDate;
exports.ImportAverageRatings=ImportAverageRatings;
exports.ImportUserGeneratedContent=ImportUserGeneratedContent;