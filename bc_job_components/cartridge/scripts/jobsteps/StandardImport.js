var Logger = require('dw/system/Logger').getLogger('cs.job.StandardImport');
var File = require('dw/io/File');
var Status = require('dw/system/Status');
var Pipeline = require('dw/system/Pipeline');

var FileHelper = require('~/cartridge/scripts/file/FileHelper');
var StepUtil = require('~/cartridge/scripts/util/StepUtil');

var OBJECT_TYPE_TO_SCHEMA_MAPPING = {
    abtest                : 'abtest.xsd',
    content               : 'library.xsd',
    coupon                : 'coupon.xsd',
    customergroup         : 'customergroup.xsd',
    customerlist          : 'customerlist.xsd',
    customer              : 'customer.xsd',
    customobject          : 'customobject.xsd',
    giftcertificate       : 'giftcertificate.xsd',
    inventory             : 'inventory.xsd',
    priceadjustmentlimits : 'priceadjustmentlimits.xsd',
    productlist           : 'productlist.xsd',
    promotion             : 'promotion.xsd',
    shipping              : 'shipping.xsd',
    slot                  : 'slot.xsd',
    sourcecode            : 'sourcecode.xsd',
    store                 : 'store.xsd',
    tax                   : 'tax.xsd'
};

/**
 * @method fileAction
 *
 * @description Performs file action : Archive or Remove the file
 *
 * @param {dw.io.File} action     - Action to perform (REMOVE,KEEP,ARCHIVE)
 * @param {dw.io.File} filePath     - path of source file
 * @param {String} archivePath     - path to archive folder
 * */
var fileAction = function (action, filePath, archivePath) {
    try {
        var file = new File(filePath);
        if (action === 'ARCHIVE') {
            // create archive folder if it doesn't exist
            new File([File.IMPEX, archivePath].join(File.SEPARATOR)).mkdirs();

            var fileToMoveTo = new File([File.IMPEX, archivePath, file.name].join(File.SEPARATOR));
            file.renameTo(fileToMoveTo);
        } else if (action === 'REMOVE') { // remove source file
            file.remove();
        }
    } catch (e) {
        Logger.error('[StandardImport.js] fileAction() method crashed on line:{0}. ERROR: {1}', e.lineNumber, e.message);
    }
};

/**
 * Generate proper status message in case no files were found
 *
 * @param {String} status
 *
 * @return {dw.system.Status} Exit status for a job run
 */
function noFileFound(status) {
    var msg = 'No files found for import.';

    switch (status) {
    case 'ERROR':
        return new Status(Status.ERROR, 'ERROR', msg);
    default:
        return new Status(Status.OK, 'NO_FILE_FOUND', msg);
    }
}


/**
 * Calls the 'ValidateXMLFile' pipelet to validate an import file.
 *
 * @param {String} objectType The object type to validate
 * @param {String} filePath The file path of the file to validate. It should be relative to '/IMPEX/src'.
 *
 * @return {Object}
 */
function validateXMLFile(objectType, filePath) {
    if (empty(objectType) || empty(filePath)) {
        return;
    }

    var schemaFile = OBJECT_TYPE_TO_SCHEMA_MAPPING[objectType];

    // If the schema is not registered as known schema, skip this step
    if (empty(schemaFile)) {
        return;
    }

    return Pipeline.execute('ImportWrapper-ValidateXMLFile', {
        File   : filePath,
        Schema : schemaFile
    });
}

/**
 * Calls the 'ValidateActiveDataFile' pipelet to validate an import file.
 *
 * @param {String} filePath The file path of the file to validate. It should be relative to '/IMPEX/src'.
 *
 * @return {Object}
 */
function validateActiveDataFile(filePath) {
    if (empty(filePath)) {
        return;
    }

    return Pipeline.execute('ImportWrapper-ValidateActiveDataFile', {
        File: filePath
    });
}

/**
 * Generic import function that is called by all import functions.
 *
 * Takes care of
 *  - Directory check and file loading (using RegEx)
 *  - Logging
 *  - Exit status
 *  - Archiving (@TODO!)
 *
 * Gets a callback function that does the actual import (Pipeline Call)
 *
 * @param {array} args Job argument list
 * @param {function} callback Callback function to trigger the import Pipeline
 *
 * @return {dw.system.Status} Exit status for a job run
 */
function genericImport(args, callback) {
    if (StepUtil.isDisabled(args)) {
        return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
    }

    var filesToImport;

    try {
        // Check source directory
        filesToImport = FileHelper.getFiles('IMPEX' + File.SEPARATOR + args.SourceFolder, args.FilePattern);
    } catch (e) {
        return new Status(Status.ERROR, 'ERROR', 'Error loading files: ' + e + (e.stack ? e.stack : ''));
    }

    // No files found
    if (!filesToImport || filesToImport.length == 0) {
        return noFileFound(args.NoFileFoundStatus);
    }

    // Overall status to be updated on errors
    var overallStatus = new Status(Status.OK, 'OK', 'Import successful');
    var warnMsg = [];
    var archivePath = StepUtil.replacePathPlaceholders(args.ArchivePath);

    // Iterate over import files
    filesToImport.forEach(function (filePath) {
        if (args.OnError == 'ABORT' && overallStatus.getCode() == 'WARNING') {
            // Skip all files if configured an previous errors occurred
            Logger.info('Skipping ' + filePath);
            return;
        }

        Logger.info('Importing ' + filePath + '...');

        var relativePath = filePath.substring(9);

        // Call the validation function before importing the file
        if (!empty(args.objectType)) {
            var validationResult;

            // As the active data files have a particular structure (.csv instead of .xml), use a different validation method
            if (args.objectType === 'activedata') {
                validationResult = validateActiveDataFile(relativePath);
            } else {
                validationResult = validateXMLFile(args.objectType, relativePath);
            }

            if (!empty(validationResult) && validationResult.Status.getStatus() !== Status.OK) {
                // Validation fails: Update overall status, log message
                overallStatus = new Status(Status.ERROR, 'ERROR');
                warnMsg.push(filePath);
                Logger.error('...Error while validating file: ' + filePath + '. See log file "' + validationResult.LogFileName + '" for more details.');
                return;
            }
        }

        // Call the callback function, this will trigger the actual import
        var result = callback(relativePath, args);

        if (result.Status.getStatus() != Status.OK) {
            // Import failed: Update overall status, log message
            overallStatus = new Status(Status.ERROR, 'ERROR');
            warnMsg.push(filePath);
            Logger.error('...Error: ' + result.ErrorMsg);
        } else {
            // Import OK
            Logger.info('...' + result.ErrorMsg);

            // Perform File action - ARCHIVE or REMOVE
            fileAction(args.FileAction, filePath, archivePath);
        }
    });

    Logger.info('Done importing ' + filesToImport.length + ' file(s).');

    // In case of errors, concatenate all error messages and print them
    if (overallStatus.getStatus() == Status.ERROR) {
        Logger.error('Import failed for ' + warnMsg.length + ' file(s): ' + warnMsg.join(', '));
        overallStatus = new Status(Status.ERROR, 'ERROR');
    }

    return overallStatus;
}

/**
 * ABTest import
 *
 * @param {array} options
 */
var abTests = function abTests(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-ABTests', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'abtest';

    return genericImport(options, callback);
};

/**
 * ActiveDate import
 *
 * @param {array} options
 */
var activeData = function activeData(options) {
    var callback = function callback(file) {
        return Pipeline.execute('ImportWrapper-ActiveData', {
            ImportFile: file
        });
    };
    options.objectType = 'activedata';

    return genericImport(options, callback);
};

/**
 * Content import
 *
 * @param {array} options
 */
var content = function content(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-Content', {
            ImportFile : file,
            ImportMode : args.ImportMode,
            Library    : args.Library
        });
    };
    options.objectType = 'content';

    return genericImport(options, callback);
};

/**
 * Coupons import
 *
 * @param {array} options
 */
var coupons = function coupons(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-Coupons', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'coupon';

    return genericImport(options, callback);
};

/**
 * Customer Groups import
 *
 * @param {array} options
 */
var customerGroups = function customerGroups(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-CustomerGroups', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'customergroup';

    return genericImport(options, callback);
};

/**
 * Customer List import
 *
 * @param {array} options
 */
var customerList = function customerList(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-CustomerList', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'customerlist';

    return genericImport(options, callback);
};

/**
 * Customers import
 *
 * @param {array} options
 */
var customers = function customers(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-Customers', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'customer';

    return genericImport(options, callback);
};

/**
 * Custom Objects import
 *
 * @param {array} options
 */
var customObjects = function customObjects(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-CustomObjects', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'customobject';

    return genericImport(options, callback);
};

/**
 * Gift Certificates import
 *
 * @param {array} options
 */
var giftCertificates = function giftCertificates(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-GiftCertificates', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'giftcertificate';

    return genericImport(options, callback);
};

/**
 * Inventory Lists import
 *
 * @param {array} options
 */
var inventoryLists = function inventoryLists(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-InventoryLists', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'inventory';

    return genericImport(options, callback);
};

/**
 * Key Value Mapping import
 *
 * @param {array} options
 */
var keyValueMapping = function keyValueMapping(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-KeyValueMapping', {
            ImportFile  : file,
            ImportMode  : args.ImportMode,
            KeyCount    : args.KeyCount,
            MappingName : args.MappingName
        });
    };

    return genericImport(options, callback);
};

/**
 * Price Adjustment Limits import
 *
 * @param {array} options
 */
var priceAdjustmentLimits = function priceAdjustmentLimits(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-PriceAdjustmentLimits', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'priceadjustmentlimits';

    return genericImport(options, callback);
};

/**
 * Product Lists import
 *
 * @param {array} options
 */
var productLists = function productLists(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-ProductLists', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'productlist';

    return genericImport(options, callback);
};

/**
 * Promotions import
 *
 * @param {array} options
 */
var promotions = function promotions(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-Promotions', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'promotion';

    return genericImport(options, callback);
};

/**
 * ShippingMethods import
 *
 * @param {array} options
 */
var shippingMethods = function shippingMethods(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-ShippingMethods', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'shipping';

    return genericImport(options, callback);
};

/**
 * Slots import
 *
 * @param {array} options
 */
var slots = function slots(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-Slots', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'slot';

    return genericImport(options, callback);
};

/**
 * Source Codes import
 *
 * @param {array} options
 */
var sourceCodes = function sourceCodes(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-SourceCodes', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'sourcecode';

    return genericImport(options, callback);
};

/**
 * Stores import
 *
 * @param {array} options
 */
var stores = function stores(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-Stores', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'store';

    return genericImport(options, callback);
};

/**
 * Tax Table import
 *
 * @param {array} options
 */
var taxTable = function taxTable(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ImportWrapper-TaxTable', {
            ImportFile : file,
            ImportMode : args.ImportMode
        });
    };
    options.objectType = 'tax';

    return genericImport(options, callback);
};

exports.abTests = abTests;
exports.activeData = activeData;
exports.content = content;
exports.coupons = coupons;
exports.customerGroups = customerGroups;
exports.customerList = customerList;
exports.customers = customers;
exports.customObjects = customObjects;
exports.giftCertificates = giftCertificates;
exports.inventoryLists = inventoryLists;
exports.keyValueMapping = keyValueMapping;
exports.priceAdjustmentLimits = priceAdjustmentLimits;
exports.productLists = productLists;
exports.promotions = promotions;
exports.shippingMethods = shippingMethods;
exports.slots = slots;
exports.sourceCodes = sourceCodes;
exports.stores = stores;
exports.taxTable = taxTable;
