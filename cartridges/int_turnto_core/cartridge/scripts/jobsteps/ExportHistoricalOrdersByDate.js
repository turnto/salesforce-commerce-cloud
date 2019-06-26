/**
 * ExportHistoricalOrdersByDate.js
 *
 * The script exports order data from a specific date to the Import/Export folder (impex) 
 * 
 * Job Parameters:
 *   ExportFileName : String File name of the file to be exported to TurnTo
 *   IsDisabled : Boolean Mark the step as disabled. This will skip the step and returns a OK status
 */

var Site = require('dw/system/Site');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var URLUtils = require('dw/web/URLUtils');
var Collection = require('dw/util/Collection');
var SeekableIterator = require('dw/util/SeekableIterator');
var OrderMgr = require('dw/order/OrderMgr');
var Order = require('dw/order/Order');
var Calendar = require('dw/util/Calendar');
var Product = require('dw/catalog/Product');
var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');

/*Script Modules*/
var TurnToHelper = require('*/cartridge/scripts/util/HelperUtil');
var OrderWriterHelper = require('*/cartridge/scripts/util/OrderWriterHelper');

/**
 * @function
 * @name run
 * @description The main function.
 * @returns {dw.system.Status} The exit status for the job step
 */
var run = function run() {

	try {
		var args = arguments[0];

		if (args.IsDisabled) {
			return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
		}

		// Load input Parameters
		var exportFileName = args.ExportFileName;

		// Test mandatory parameters
		if (empty(exportFileName)) {
			return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing. Export File Name = (' + exportFileName + ')');
		}

		var historicalOrderDate : Date = Site.getCurrent().getCustomPreferenceValue('turntoHistoricalOrderDate');
		
		if (empty(historicalOrderDate)) {
			return new Status(Status.ERROR, 'ERROR', 'Mandatory site preference "turntoHistoricalOrderDate" is missing. Export File Name = (' + exportFileName + ')');
		}

		// Get the file path where the output will be stored
		var impexPath : String = File.getRootDirectory(File.IMPEX).getFullPath();
		
		//loop through all allowed locales per site
		for each(var currentLocale in TurnToHelper.getAllowedLocales()) {

			try {
				// Create a TurnTo directory if one doesn't already exist
				var turntoDir : File = new File(impexPath + "/TurnTo" + "/" + currentLocale);
				if (!turntoDir.exists()) {
					turntoDir.mkdir();
				}

				//Initialize a file writer for output
				var orderExportFile : File = new File(turntoDir.getFullPath() + '/' + exportFileName + '_' + currentLocale + '_' + Site.getCurrent().ID +'.txt');

				var fileWriter : FileWriter = new FileWriter(orderExportFile);

				fileWriter.writeLine("ORDERID\tORDERDATE\tEMAIL\tITEMTITLE\tITEMURL\tITEMLINEID\tZIP\tFIRSTNAME\tLASTNAME\tSKU\tPRICE\tITEMIMAGEURL\tTEASERSHOWN\tTEASERCLICKED\tDELIVERYDATE\tNICKNAME\tLOCALE");		

				//query orders by order system attribute "customerLocaleID" and specify creation date
				var query : String = "creationDate >= {0} AND creationDate <= {1}";
				var endOfDay : Calendar = new Calendar(historicalOrderDate);
				endOfDay.add(Calendar.DAY_OF_YEAR, 1);

				var orders : SeekableIterator =  OrderMgr.searchOrders(query, "creationDate asc", historicalOrderDate, endOfDay.getTime());

				//set the request to the current locale so localized attributes will be used
				request.setLocale(currentLocale);

				try {
					while (orders.hasNext()) {
						var order : Order = orders.next();
						//using the order writer helper, write the product data
						OrderWriterHelper.writeOrderData(order, fileWriter, currentLocale);
					}
				} finally {
					if (orders != null) {
						orders.close();
					}
				}
			} finally {
				if (fileWriter != null) {
					fileWriter.close();
				}
			}
		}
	} catch(exception) {
		return new Status(Status.ERROR, 'ERROR', 'FAILED An exception occurred while attempting to export the orders by date. Error message: ' + exception.message);
	} finally {
		//check all readers are closed in case the catch block is hit
		if (fileWriter != null) {
			fileWriter.close();
		}
	}
	return new Status(Status.OK, 'OK', 'Export Orders by Date was successful.');
}

exports.Run = run;
