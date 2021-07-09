'use strict';

/**
 * exportHistoricalOrdersByDate.js
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
var OrderMgr = require('dw/order/OrderMgr');
var Status = require('dw/system/Status');

/* Script Modules */
var TurnToHelper = require('*/cartridge/scripts/util/TurnToHelperUtil');
var OrderWriterHelper = require('*/cartridge/scripts/util/OrderWriterHelper');

/**
 * @function
 * @name run
 * @description The main function.
 * @returns {dw.system.Status} The exit status for the job step
 */
var run = function run() {
    var fileWriter = null;
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

        var historicalOrderDate = Site.getCurrent().getCustomPreferenceValue('turntoHistoricalOrderDate');

        if (empty(historicalOrderDate)) {
            return new Status(Status.ERROR, 'ERROR', 'Mandatory site preference "turntoHistoricalOrderDate" is missing. Export File Name = (' + exportFileName + ')');
        }

        // Get the file path where the output will be stored
        var impexPath = File.getRootDirectory(File.IMPEX).getFullPath();

        // loop through all allowed locales per site
        var allLocales = TurnToHelper.getAllowedLocales();

        Object.keys(allLocales).forEach(function (property) {
            var currentLocale = allLocales[property];

            try {
                // query orders by order system attribute "customerLocaleID" and specify creation date
                var query = 'creationDate >= {0} AND customerLocaleID = {1}';
                var orders = OrderMgr.searchOrders(query, 'creationDate asc', historicalOrderDate, currentLocale);

                if (orders.count !== 0) {
                    // Create a TurnTo directory if one doesn't already exist
                    var turntoDir = new File(impexPath + File.SEPARATOR + 'TurnTo' + File.SEPARATOR + currentLocale);
                    if (!turntoDir.exists()) {
                        turntoDir.mkdirs();
                    }

                    // Initialize a file writer for output
                    var orderExportFile = new File(turntoDir.getFullPath() + File.SEPARATOR + exportFileName + '_orderdate_' + historicalOrderDate.toDateString() + '_' + currentLocale + '_' + Site.getCurrent().ID + '.txt');

                    fileWriter = new FileWriter(orderExportFile);

                    fileWriter.writeLine('ORDERID\tORDERDATE\tEMAIL\tITEMTITLE\tITEMURL\tITEMLINEID\tZIP\tFIRSTNAME\tLASTNAME\tSKU\tPRICE\tITEMIMAGEURL\tTEASERSHOWN\tTEASERCLICKED\tDELIVERYDATE\tNICKNAME\tLOCALE');

                    // set the request to the current locale so localized attributes will be used
                    request.setLocale(currentLocale);

                    try {
                        while (orders.hasNext()) {
                            var order = orders.next();
                            // using the order writer helper, write the product data
                            OrderWriterHelper.writeOrderData(order, fileWriter, currentLocale);
                        }
                    } finally {
                        if (orders != null) {
                            orders.close();
                        }
                    }
                }
            } finally {
                if (fileWriter != null) {
                    fileWriter.close();
                }
            }
        });
    } catch (exception) {
        return new Status(Status.ERROR, 'ERROR', 'FAILED An exception occurred while attempting to export the orders by date. Error message: ' + exception.message);
    } finally {
        // check all readers are closed in case the catch block is hit
        if (!empty(fileWriter)) {
            fileWriter.close();
        }
    }
    return new Status(Status.OK, 'OK', 'Export Orders by Date was successful.');
};

exports.Run = run;
