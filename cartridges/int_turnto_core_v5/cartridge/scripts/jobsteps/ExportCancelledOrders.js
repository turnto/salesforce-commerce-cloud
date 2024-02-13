'use strict';

/**
 * exportCancelledOrders.js
 *
 * The script exports cancelled order data to the Import/Export folder (impex)
 *
 * Job Parameters:
 *   ExportFileName : String File name of the file to be exported to TurnTo
 *   IsDisabled : Boolean Mark the step as disabled. This will skip the step and returns an OK status
 */

var Site = require('dw/system/Site');
var File = require('dw/io/File');
var FileWriter = require('dw/io/FileWriter');
var Order = require('dw/order/Order');
var OrderMgr = require('dw/order/OrderMgr');
var Calendar = require('dw/util/Calendar');
var Status = require('dw/system/Status');

/* Script Modules*/
var TurnToHelper = require('*/cartridge/scripts/util/TurnToHelperUtil');
var OrderWriterHelper = require('*/cartridge/scripts/util/OrderWriterHelper');

/**
 * @function
 * @name run
 * @description The main function.
 * @returns {dw.system.Status} The exit status for the job step
 */
exports.Run = function () {
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

        var cancelledOrderDays = Site.getCurrent().getCustomPreferenceValue('turntoCancelledOrderDays');

        if (empty(cancelledOrderDays)) {
            return new Status(Status.ERROR, 'ERROR', 'Mandatory site preference "turntoHistoricalOrderDays" is missing. Export File Name = (' + exportFileName + ')');
        }

        // Get the file path where the output will be stored
        var impexPath = File.getRootDirectory(File.IMPEX).getFullPath();

        // loop through all allowed locales per site
        TurnToHelper.getAllowedLocales().forEach(function (currentLocale) {
            try {
                var dateLimit = new Calendar();
                dateLimit.add(Calendar.DAY_OF_YEAR, cancelledOrderDays * -1);

                var query = 'lastModified >= {0} AND customerLocaleID = {1} AND (status = {2} OR status = {3})';
                var orders = OrderMgr.searchOrders(query, 'creationDate asc', dateLimit.getTime(), currentLocale, Order.ORDER_STATUS_CANCELLED, Order.ORDER_STATUS_FAILED);

                if (orders.count) {
                    // Create a TurnTo directory if one doesn't already exist
                    var turntoDir = new File(impexPath + File.SEPARATOR + 'TurnTo' + File.SEPARATOR + currentLocale);
                    if (!turntoDir.exists()) {
                        turntoDir.mkdirs();
                    }

                    // Initialize a file writer for output
                    var orderExportFile = new File(turntoDir.getFullPath() + File.SEPARATOR + exportFileName + '_' + currentLocale + '_' + Site.getCurrent().ID + '.txt');

                    fileWriter = new FileWriter(orderExportFile);

                    fileWriter.writeLine('ORDERID\tSKU');

                    // set the request to the current locale so localized attributes will be used
                    request.setLocale(currentLocale);

                    try {
                        while (orders.hasNext()) {
                            var order = orders.next();
                            // using the order writer helper, write the product data
                            OrderWriterHelper.writeCancelledOrderData(order, fileWriter);
                        }
                    } finally {
                        if (orders != null) {
                            orders.close();
                        }
                    }
                }
            } catch (e) {
                throw new Error('FAILED: Error message: ' + e.message);
            } finally {
                if (fileWriter != null) {
                    fileWriter.close();
                }
            }
        });
    } catch (exception) {
        return new Status(Status.ERROR, 'ERROR', 'FAILED An exception occurred while attempting to export cancelled orders. Error message: ' + exception.message);
    }
    return new Status(Status.OK, 'OK', 'Export Cancelled Orders was successful.');
};
