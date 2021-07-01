'use strict';

/**
 * importAverageRatings.js
 *
 * The script imports product average star ratings from a TurnTo feed
 *
 * Job Parameters:
 *   ImportFileName : String File name of the file to be imported from TurnTo
 *   IsDisabled : Boolean Mark the step as disabled. This will skip the step and returns a OK status
 */

/* API Includes */
var File = require('dw/io/File');
var FileReader = require('dw/io/FileReader');
var XMLStreamReader = require('dw/io/XMLStreamReader');
var XMLStreamConstants = require('dw/io/XMLStreamConstants');
var ProductMgr = require('dw/catalog/ProductMgr');
var Logger = require('dw/system/Logger');
var Transaction = require('dw/system/Transaction');
var Status = require('dw/system/Status');

/* Script Modules */
var TurnToHelper = require('*/cartridge/scripts/util/TurnToHelperUtil');

/**
 * @function
 * @name run
 * @description The main function.
 * @returns {dw.system.Status} The exit status for the job step
 */
var run = function run() {
    var xmlStreamReader = null;
    var fileReader = null;
    var error = false;

    try {
        var error = false;
        var args = arguments[0];

        if (args.IsDisabled) {
            return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
        }

        // Load input Parameters
        var importFileName = args.ImportFileName;
        var productNotFoundStatus = args.ProductNotFoundStatus;
        var logging = args.Logging;

        // Test mandatory parameters
        if (empty(importFileName)) {
            return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing. Import File Name = (' + importFileName + ')');
        }

        // Create archive directory if it does not exist
        var turntoDir = new File(File.IMPEX + File.SEPARATOR + "TurnTo");
        var archiveFile = new File(turntoDir.fullPath + File.SEPARATOR + 'Archive');

        if (!archiveFile.exists()) {
            archiveFile.mkdirs();
        }

        //loop through all allowed locales per site
        TurnToHelper.getAllowedLocales().forEach(function (currentLocale) {
            var importfile = null;
            try {
                var importfile = new File(File.IMPEX + File.SEPARATOR + "TurnTo" + File.SEPARATOR + currentLocale + File.SEPARATOR + importFileName);//"turnto-skuaveragerating.xml");
                
                if (importfile.exists()) {
                    // set the request to the current locale so localized attributes will be used
                    request.setLocale(currentLocale);
        
                    fileReader = new FileReader(importfile, 'UTF-8');
                    xmlStreamReader = new XMLStreamReader(fileReader);
    
                    while (xmlStreamReader.hasNext()) {
                        var element = xmlStreamReader.next();
                        if (element == XMLStreamConstants.START_ELEMENT) {
                            var localElementName = xmlStreamReader.getLocalName();
                            if (localElementName == "product") {
                                try {
                                    var productNode = xmlStreamReader.readXMLObject();
                                    var product = ProductMgr.getProduct(productNode.attribute('sku'));
                                    if(product != null) {
                                        if (logging) {
                                            dw.system.Logger.info('INFO product is found, product id = {0}', product.ID);
                                        }
                                        var reviewCount = parseInt(productNode.attribute('review_count'), 10);
                                        var relatedReviewCount = parseInt(productNode.attribute('related_review_count'), 10);
                                        var commentCount = parseInt(productNode.attribute('comment_count'), 10);
                                        //Round the rating to the nearest 0.5
                                        var rating = Math.round((parseFloat(productNode.toString()) + 0.25) * 100.0) / 100.0;
                                        rating = rating.toString();
                                        var decimal = parseInt(rating.substring(2, 3), 10);
                                        rating = rating.substring(0, 1) + "." + (decimal >= 5 ? '5' : '0');
                                    
                                        Transaction.wrap(function(){
                                            product.custom.turntoAverageRating = rating;
                                            product.custom.turntoReviewCount = reviewCount;
                                            product.custom.turntoRelatedReviewCount = relatedReviewCount;
                                            product.custom.turntoCommentCount = commentCount;
                                        });
    
                                    } else {
                                        if (productNotFoundStatus == 'ERROR') {
                                            if (logging) {
                                                dw.system.Logger.error('ERROR product is NULL, product id = {0}', productNode.attribute('sku'));
                                            }
                                        } else {
                                            if (logging) {
                                                dw.system.Logger.info('INFO product is NULL, product id = {0}', productNode.attribute('sku'));
                                            }
                                        }
                                    }
                                } catch ( e ) {
                                    error = true;
                                    if (logging) {
                                        Logger.error('Product SKU {0} failed to update due to {1}', product.ID, e.message);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    Logger.error('FAILED: File not found. File Name: {0} for Locale: {1}', importfile.fullPath, currentLocale);
                }
            } finally {
                if (xmlStreamReader != null) {
                    xmlStreamReader.close();
                }
                if (fileReader != null) {
                    fileReader.close();
                }
                // Archive file
                var theArchiveFile = new File(archiveFile.fullPath + File.SEPARATOR + importfile.getName());
                importfile.renameTo(theArchiveFile);
            }
        });
    } catch (exception) {
        return new Status(Status.ERROR, 'ERROR', 'FAILED An exception occurred while attempting to import average ratings. Error message: ' + exception.message);
    } finally {
        // check all readers are closed in case catch block is hit
        if (xmlStreamReader != null) {
            xmlStreamReader.close();
        }
        if (fileReader != null) {
            fileReader.close();
        }
    }

    return (error)
        ? new Status(Status.ERROR, 'ERROR', 'FAILED An exception occurred while attempting to import ONE or MORE average ratings, please see prior error messages for details of individual product update errors.')
        : new Status(Status.OK, 'OK', 'Import Average Ratings was successful.');
};

exports.Run = run;

