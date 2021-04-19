'use strict';

/**
 * importUserGeneratedContent.js
 *
 * The script imports user generated content for products from a TurnTo feed
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
var HashMap = require('dw/util/HashMap');
var Status = require('dw/system/Status');
var Transaction = require('dw/system/Transaction');

/* Script Modules*/
var TurnToHelper = require('*/cartridge/scripts/util/turnToHelperUtil');

/**
 * @function
 * @name run
 * @description The main function.
 * @returns {dw.system.Status} The exit status for the job step
 */
var run = function run() {
    var fileReader = null;
    var xmlStreamReader = null;
    var error = false;

    try {
        var args = arguments[0];
        if (args.IsDisabled) {
            return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
        }

        // Load input Parameters
        var importFileName = args.ImportFileName;
        var logging = args.Logging;

        // Test mandatory parameters
        if (empty(importFileName)) {
            return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing. Import File Name = (' + importFileName + ')');
        }

        // loop through all allowed locales per site
        TurnToHelper.getAllowedLocales().forEach(function (currentLocale) {
            try {
                var importfile = new File(File.IMPEX + File.SEPARATOR + 'TurnTo' + File.SEPARATOR + currentLocale + File.SEPARATOR + importFileName);

                if (!importfile.exists()) {
                    throw new Error('FAILED: File not found. File Name: ' + importfile.fullPath);
                }

                // set the request to the current locale so localized attributes will be used
                request.setLocale(currentLocale);

                fileReader = new FileReader(importfile, 'UTF-8');
                xmlStreamReader = new XMLStreamReader(fileReader);
                var contentMap = new HashMap();

                while (xmlStreamReader.hasNext()) {
                    if (xmlStreamReader.next() === XMLStreamConstants.START_ELEMENT) {
                        var localElementName = xmlStreamReader.getLocalName();
                        if (localElementName === 'question' || localElementName === 'comment' || localElementName === 'review') {
                            var sku = '';
                            var text = '';
                            var obj = xmlStreamReader.readXMLObject().elements();
                            for (var i = 0; i < obj.length(); i++) {
                                var child = obj[i];
                                var localName = child.localName().toString();
                                if (localName === 'item') {
                                    var obj2 = child.elements();
                                    for (var k = 0; k < obj2.length(); k++) {
                                        var child2 = obj2[k];
                                        var localName2 = child2.localName().toString();
                                        if (localName2 === 'sku') {
                                            sku = child2.toString();
                                        }
                                    }
                                } else if (localName === 'text') {
                                    text = child.toString();
                                    if (contentMap.containsKey(sku)) {
                                        var contentValue = contentMap.get(sku) + '\n' + text;
                                        contentMap.put(sku, contentValue);
                                    } else {
                                        contentMap.put(sku, text);
                                    }
                                }
                            }
                        }
                    }
                }

                var contentIter = contentMap.keySet().iterator();
                while (contentIter.hasNext()) {
                    var prodsku = contentIter.next();
                    var product = ProductMgr.getProduct(prodsku);
                    if (product != null) {
                        try {
                            Transaction.begin();
                            product.custom.turntoUserGeneratedContent = contentMap.get(prodsku);
                            Transaction.commit();
                        } catch (e) {
                            Transaction.rollback();
                            error = true;
                            if (logging) {
                                Logger.error('Product SKU {0} failed to update due to {1}', product.ID, e.message);
                            }
                        }
                    }
                }
            } finally {
                if (xmlStreamReader != null) {
                    xmlStreamReader.close();
                }
                if (fileReader != null) {
                    fileReader.close();
                }
            }
        });
    } catch (exception) {
        return new Status(Status.ERROR, 'ERROR', 'FAILED An exception occurred while attempting to import user generated content. Error message: ' + exception.message);
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
        ? new Status(Status.ERROR, 'ERROR', 'FAILED An exception occurred while attempting to import ONE or MORE user generated content, please see prior error messages for details of individual product update errors.')
        : new Status(Status.OK, 'OK', 'Import User Generated Content was successful.');
};

exports.Run = run;
