'use strict';

var catalog = require('dw/catalog');
var FileWriter = require('dw/io/FileWriter');
var File = require('dw/io/File');
var URLUtils = require('dw/web/URLUtils');
var HashMap = require('dw/util/HashMap');
var Logger = require('dw/system/Logger');
var Site = require('dw/system/Site');

/* Script Modules */
var TurnToHelper = require('*/cartridge/scripts/util/TurnToHelperUtil');
var ServiceFactory = require('*/cartridge/scripts/util/ServiceFactory');

/**
 * @typedef {HashMap} JobParameters - job parameters
 * @property {boolean} IsDisabled - job disabled status
 * @property {string} ExportFileName - job export file name
 */
// Globally scoped variables
/** @type {dw.util.SeekableIterator<Product>} products */
var products;
/** @type {HashMap} hashMapOfFileWriters - Map of file writers by locale */
var hashMapOfFileWriters;
/** @type {SiteKeysJson} siteKeys */
var siteKeys;
/** @type {Array} allowedLocales - SiteKeysJson locales allowed in store */
var allowedLocales;
/** @type {number} fileNumber - Track current file number */
var fileNumber = 0;
/** @type {boolean} createFiles - Flag to create new files or continue writing to current file */
var createFiles = true;
/** @type {number} fileProductCount - Track number of products written to current file to compare to max number allowed */
var fileProductCount;

/**
 * Get all products to be exported
 *
 * Function is executed only ONCE
 * @param {JobParameters} parameters - job parameters
 */
function beforeStep(parameters) {
    if (parameters.IsDisabled) {
        return;
    }
    siteKeys = TurnToHelper.getSiteKeys();
    if (empty(siteKeys)) {
        return;
    }
    allowedLocales = TurnToHelper.getAllowedLocales();
    products = catalog.ProductMgr.queryAllSiteProductsSorted();
}

/**
 * A function that returns the total number of items that are available,
 * this function is called by the framework exactly once before chunk processing begins.
 * A known total count allows better monitoring.
 * For example, to show that 50 of 100 items have already been processed.
 * @param {JobParameters} parameters - job parameters
 * @returns {number} - total number of products
 */
function getTotalCount(parameters) {
    if (parameters.IsDisabled || empty(siteKeys) || empty(products)) {
        return 0;
    }

    return products.count;
}

/**
 * Create new files for each locale for initial chunk and whenever the files have been close because the file product
 * count exceeds the max file product count
 * @param {JobParameters} parameters - job parameters
 */
function beforeChunk(parameters) {
    if (parameters.IsDisabled || empty(siteKeys) || empty(products)) {
        return;
    }
    try {
        if (createFiles) {
            var impexPath = File.getRootDirectory(File.IMPEX).getFullPath();
            var fileName = parameters.ExportFileName;
            // Create a new file per locale to export to Emplifi if no files are open
            Logger.info('ExportCatalog.js: beforeChunk() - create files');
            fileNumber++;
            fileProductCount = 0;
            // new map of file writers for each locale per chunk
            hashMapOfFileWriters = new HashMap();
            Object.keys(siteKeys).forEach(function (key) {
                var siteKeyJson = siteKeys[key]
                // create an array of locales since some keys have multiple locales
                var locales = siteKeyJson.locales.split(',');
                var locale = null;
                var isAllowedLocale = locales.every(function (loc) {
                    locale = loc;
                    return allowedLocales.indexOf(loc) > -1;
                });

                // if there are no allowed locales for the site/auth key configuration then do not export a catalog and return an error
                if (isAllowedLocale) {
                    // create a folder with one or more locales
                    var folderAndFilePatternName = locales.join().replace(',', '_');
                    var turntoDir = new File(impexPath + File.SEPARATOR + 'TurnTo' + File.SEPARATOR + locale);

                    if (!turntoDir.exists()) {
                        turntoDir.mkdirs();
                    }

                    // Initialize a file writer for output with the current key
                    var catalogExportFileWrite = new File(turntoDir.getFullPath() + File.SEPARATOR + fileName + '_' +
                        folderAndFilePatternName + '_' + Site.getCurrent().ID + '_' + fileNumber + '.txt');
                    catalogExportFileWrite.createNewFile();

                    var currentFileWriter = new FileWriter(catalogExportFileWrite);

                    // write header text
                    currentFileWriter.writeLine('SKU\tIMAGEURL\tTITLE\tPRICE\tCURRENCY\tACTIVE\tITEMURL\tCATEGORY\tKEYWORDS\tINSTOCK\tVIRTUALPARENTCODE\tCATEGORYPATHJSON\tMEMBERS\tBRAND\tMPN\tISBN\tUPC\tEAN\tJAN\tASIN\tMOBILEITEMURL\tLOCALEDATA');
                    hashMapOfFileWriters.put(siteKeyJson.locales, currentFileWriter);
                }
            });
        }
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the beforeStep step with the following error: ' + e.message);
    }
}

/**
 * Returns one item or null if there are no more items.
 * @param {JobParameters} parameters - job parameters
 * @returns {dw.catalog.Product|string|null} - product to process; empty string if skipping product; null if no more products
 */
function read(parameters) {
    if (parameters.IsDisabled || empty(siteKeys) || empty(products)) {
        return null;
    }
    try {
        var useVariants = ServiceFactory.getUseVariantsPreference();
        if (products.hasNext()) {
            var tempProduct = products.next();
            if (!useVariants && tempProduct.isVariant()) {
                return '';
            }
            return tempProduct;
        }
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the read step with the following error: ' + e.message);
    }
    return null;
}

/**
 * The product param is the returned object from the read function. The logic will be skipped if the product is empty
 * but not null. This will be skipped and job will end after completing other methods if product is null.
 *
 * It receives the item returned by the read function, performs a process, and returns one item. If the process function
 * returns nothing, then the read function item is filtered and doesn't appear in the list of items to be written later.
 * @param {dw.catalog.Product} product - product
 * @param {JobParameters} parameters - job parameters
 * @returns {json} - completion status
 */
function process(product, parameters) {
    if (parameters.IsDisabled || empty(siteKeys) || empty(product)) {
        return null;
    }

    // Generate and return a simple mapping object with locale
    // and formatted output such as ```{ "en_us": "Row data for English US", ...}```
    var json = {};
    try {
        // Non-localized data
        // IMAGEURL
        var image = product.getImage('hi-res', 0);
        var imageURL = '';
        if (image == null) {
            image = product.getImage('large', 0);
        }
        if (image == null) {
            image = product.getImage('medium', 0);
        }
        if (image == null) {
            image = product.getImage('small', 0);
        }
        if (image == null) {
            image = product.getImage('swatch', 0);
        }
        if (image != null) {
            imageURL = image.getAbsURL().toString();
        }

        // PRICE
        var price = product.getPriceModel().getPrice();
        var priceStr = price.getValue().toString();

        // CATEGORYPATHJSON
        var categoryPathJSON = null;
        var currentCategory = product.getPrimaryCategory();
        if (currentCategory === null) {
            try {
                if (product.isVariant() && !product.isMaster()) {
                    currentCategory = product.masterProduct.getPrimaryCategory();
                }
            } catch (e) {
                Logger.warn(e.message);
            }
        }
        if (currentCategory !== null) {
            categoryPathJSON = [];
            var categoryArray = [];
            var categoryJson;
            while (currentCategory != null && !currentCategory.isRoot()) {
                categoryJson = {
                    id: currentCategory.getID(),
                    name: TurnToHelper.replaceNull(currentCategory.getDisplayName(), currentCategory.getPageTitle()),
                    url: URLUtils.http('Search-Show', 'cgid', currentCategory.getID()).toString()
                };
                categoryArray.push(JSON.stringify(categoryJson));
                currentCategory = currentCategory.getParent();
            }
            categoryArray.reverse();
            categoryPathJSON = '[' + TurnToHelper.replaceNull(categoryArray.toString(), '') + ']';
        }

        // MEMBERS
        var bundledProducts = product.getBundledProducts();
        var bundledProductsArray = [];

        for (var j = 0; j < bundledProducts.size(); j++) {
            var subProduct = bundledProducts[j];
            bundledProductsArray.push(subProduct.getID());
        }

        var mpn = '';
        var isbn = '';
        var upc = '';
        var ean = '';
        var jan = '';
        var asin = '';
        if (product.isMaster()) {
            // Comma-separated variants for GTINs
            for (var i = 0; i < product.variants.length; i++) {
                var variant = product.variants[i];
                // MPN
                if (variant.getManufacturerSKU()) {
                    mpn += variant.getManufacturerSKU();
                    if (i !== product.variants.length - 1) {
                        mpn += ',';
                    }
                }
                // UPC
                if (variant.getUPC()) {
                    upc += variant.getUPC();
                    if (i !== product.variants.length - 1) {
                        upc += ',';
                    }
                }
                // EAN
                if (variant.getEAN()) {
                    ean += variant.getEAN();
                    if (i !== product.variants.length - 1) {
                        ean += ',';
                    }
                }
            }
        } else {
            // MPN
            if (product.getManufacturerSKU()) {
                mpn = product.getManufacturerSKU();
            }
            // UPC
            if (product.getUPC()) {
                upc = product.getUPC();
            }
            // EAN
            if (product.getEAN()) {
                ean = product.getEAN();
            }
        }

        // Iterate all locales, generate and return a simple mapping object with locale
        // and formatted output such as ```{ "en_us": "Row data for English US", ...}```
        Object.keys(siteKeys).forEach(function (key) {
            var siteKeyJson = siteKeys[key];
            var locales = siteKeyJson.locales;
            // CATEGORY
            // Leaving blank because CATEGORYPATHJSON is populated

            // KEYWORDS
            var keywords = '';
            if (product.getPageKeywords()) {
                keywords = product.getPageKeywords();
            }

            // add locales specific data
            var localeData = {};
            var localesArray = [];
            if (locales.indexOf(',') !== -1) {
                localesArray = locales.split(',');
            } else {
                localesArray.push(locales);
            }

            localesArray.forEach(function (l) {
                request.setLocale(l);
                var url = URLUtils.http('Product-Show', 'pid', product.getID()).toString();
                localeData[l] = {
                    title: TurnToHelper.sanitizeStr(product.getName(), ' '),
                    itemUrl: url,
                    mobileItemUrl: url
                };
            });

            var defaultLocale = Site.getCurrent().getDefaultLocale();
            request.setLocale(defaultLocale);
            // build locale JSON
            json[locales] = {
                sku: TurnToHelper.replaceNull(product.getID(), ''),
                imageurl: imageURL,
                title: TurnToHelper.sanitizeStr(product.getName(), ' '),
                price: TurnToHelper.replaceNull(priceStr, ''),
                currency: TurnToHelper.replaceNull(price.getCurrencyCode(), ''),
                active: product.isOnline() ? 'Y' : 'N',
                itemurl: URLUtils.http('Product-Show', 'pid', product.getID()).toString(),
                category: '', // Leaving blank because CATEGORYPATHJSON is populated
                keywords: TurnToHelper.sanitizeStr(keywords, ' '),
                instock: product.getAvailabilityModel().isOrderable() ? 'Y' : 'N',
                virtualparentcode: product.isVariant() ? product.masterProduct.ID : product.ID,
                categorypathjson: categoryPathJSON || '',
                members: TurnToHelper.replaceNull(bundledProductsArray, ''),
                brand: product.getBrand() ? product.getBrand() : '',
                mpn: TurnToHelper.sanitizeStr(mpn, ' '),
                isbn: TurnToHelper.sanitizeStr(isbn, ' '),
                upc: TurnToHelper.sanitizeStr(upc, ' '),
                ean: TurnToHelper.sanitizeStr(ean, ' '),
                jan: TurnToHelper.sanitizeStr(jan, ' '),
                asin: TurnToHelper.sanitizeStr(asin, ' '),
                mobileitemurl: '',
                localedata: JSON.stringify(localeData)
            };
        });
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the process step with the following error: {0}\n{1}', e.message, e.stack);
    }
    fileProductCount++;

    return json;
}

/**
 * the write function receives a list of items.
 * The list size matches the chunk size or smaller, if the number of items in the last available chunk is smaller.
 * The write function returns nothing
 * @param {Object} json - save json object
 * @param {JobParameters} parameters - job parameters
 */
function write(json, parameters) {
    if (parameters.IsDisabled || empty(siteKeys) || empty(json)) {
        return;
    }
    try {
        // Iterate chunks, with each chunk being a mapping object from the process step.
        // Iterate mapped locales and write formatted data to applicable files.
        Object.keys(siteKeys).forEach(function (keyVal) {
            var currentLocale = siteKeys[keyVal].locales;
            // retrieve the current file writer
            var localeFileWriter = hashMapOfFileWriters.get(currentLocale);

            if (localeFileWriter) {
                // each JSON Object "jsonObj" is a reference to a product
                Object.keys(json).forEach(function (property) {
                    var jsonObj = json[property];
                    if (!empty(jsonObj)) {
                        // retrieve the locale specific product data from the JSON
                        var localeJSON = jsonObj[currentLocale];
                        // each key is a reference to a product attribute
                        Object.keys(localeJSON).forEach(function (key) {
                            if (Object.hasOwnProperty.call(localeJSON, key)) {
                                localeFileWriter.write(localeJSON[key]);
                                localeFileWriter.write('\t');
                            }
                        });
                        localeFileWriter.write('\n');
                    }
                });
            }
        });
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the write step with the following error: {0}\n{1}', e.message, e.stack);
    }
}

/**
 * Close file writers
 */
function closeFileWriters() {
    Object.keys(siteKeys).forEach(function (key) {
        var currentLocale = siteKeys[key].locales;
        // retrieve the current file writer
        var fileWriter = hashMapOfFileWriters.get(currentLocale);
        if (fileWriter) {
            fileWriter.close();
        }
    });
}

/**
 * Close file after chunk of products
 * @param {boolean} success - success status
 * @param {JobParameters} parameters - job parameters
 */
function afterChunk(success, parameters) {
    if (parameters.IsDisabled) {
        return;
    }
    if (!success) {
        Logger.error('ExportCatalog.js: Exporting catalog afterChunk failed');
    }
    try {
        // If the file product count is greater than the max file product count, close the file writers to open new files
        createFiles = fileProductCount > 200000;
        if (createFiles) {
            closeFileWriters();
        }
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the afterChunk step with the following error: {0}', e.message);
    }
}

/**
 * Function is executed only ONCE
 * @param {boolean} success - success status
 * @param {JobParameters} parameters - job parameters
 */
function afterStep(success, parameters) {
    if (parameters.IsDisabled) {
        return;
    }
    if (!success) {
        Logger.error('ExportCatalog.js: Exporting catalog afterStep failed');
    }
    try {
        closeFileWriters();
        products.close();
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the afterStep step with the following error: {0}', e.message);
    }
}

module.exports = {
    beforeStep: beforeStep,
    getTotalCount: getTotalCount,
    beforeChunk: beforeChunk,
    read: read,
    process: process,
    write: write,
    afterChunk: afterChunk,
    afterStep: afterStep
};
