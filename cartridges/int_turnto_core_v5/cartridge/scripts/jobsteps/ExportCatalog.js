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

/* Constants */
var MAX_PRODUCTS_PER_FILE = 200000;

/**
 * @typedef {HashMap} JobParameters - job parameters
 * @property {boolean} IsDisabled - job disabled status
 * @property {string} ExportFileName - job export file name
 */

/**
 * Job State Object - Encapsulates all global state for safer management
 * @type {Object}
 */
var jobState = {
    /** @type {dw.util.SeekableIterator<Product>} products */
    products: null,
    /** @type {HashMap} hashMapOfFileWriters - Map of file writers by locale */
    hashMapOfFileWriters: null,
    /** @type {SiteKeysJson} validSiteKeys - Preprocessed site keys with only allowed locales */
    validSiteKeys: {},
    /** @type {Array} allowedLocales - SiteKeysJson locales allowed in store */
    allowedLocales: null,
    /** @type {number} fileNumber - Track current file number */
    fileNumber: 0,
    /** @type {boolean} createFiles - Flag to create new files or continue writing to current file */
    createFiles: true,
    /** @type {number} fileProductCount - Track number of products written to current file to compare to max number allowed */
    fileProductCount: 0,
    /** @type {Date} cutoffDate - Cutoff date for filtering products by last modified date */
    cutoffDate: null,

    /**
     * Reset all state variables to their initial values
     */
    reset: function() {
        this.products = null;
        this.hashMapOfFileWriters = null;
        this.validSiteKeys = {};
        this.allowedLocales = null;
        this.fileNumber = 0;
        this.createFiles = true;
        this.fileProductCount = 0;
        this.cutoffDate = null;
    },

    /**
     * Check if the job state has been properly initialized
     * @returns {boolean} true if state is initialized
     */
    isInitialized: function() {
        return this.allowedLocales !== null &&
           Object.keys(this.validSiteKeys).length > 0 &&
           this.products !== null;
    },

    /**
     * Check if files should be created (either first time or after file size limit reached)
     * @returns {boolean} true if new files should be created
     */
    shouldCreateFiles: function() {
        return this.createFiles;
    },

    /**
     * Increment file number and reset file product count for new files
     */
    startNewFiles: function() {
        this.fileNumber++;
        this.fileProductCount = 0;
        this.createFiles = false;
    },

    /**
     * Increment product count and check if file size limit is reached
     */
    incrementProductCount: function() {
        this.fileProductCount++;
        if (this.fileProductCount > MAX_PRODUCTS_PER_FILE) {
            this.createFiles = true;
        }
    }
};

/**
 * Parse locale string, handling comma-separated values
 * @param {string} localeString - Locale string (e.g., "en_CA,fr_CA") - whitespace already removed by getSiteKeys()
 * @returns {Array<string>} Array of locale codes
 */
function parseLocales(localeString) {
    if (!localeString) {
        return [];
    }

    return localeString.split(',');
}

/**
 * Get all locales for a site configuration, filtered by allowed locales
 * @param {Object} siteConfig - Site configuration object
 * @returns {Array<string>} - Array of allowed locale codes
 */
function allowedSiteLocales(siteConfig) {
    var parsedLocales =  parseLocales(siteConfig.locales);

    return parsedLocales.filter(function(locale) {
        return locale.length > 0 && jobState.allowedLocales.indexOf(locale) > -1;
    });
}

/**
 * Create a simple hash from a string for use in shortened identifiers
 * @param {string} str - String to hash
 * @returns {string} - Short hash string (base36)
 */
function hashString(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash * 31) + char) % 2147483647;
    }
    return Math.abs(hash).toString(36);
}

/**
 * Create locales ID with maximum of 6 locales before hashing
 * @param {Array<string>} localesArray - Array of locale codes
 * @returns {string} - Locales ID (up to 6 locales, then hash for more)
 */
function createLocalesId(localesArray) {
    var MAX_LOCALES = 6;

    // If 6 or fewer locales, use them all
    if (localesArray.length <= MAX_LOCALES) {
        return localesArray.join('_');
    }

    // More than 6 locales: use first 6 + hash of all
    var firstSixLocales = localesArray.slice(0, MAX_LOCALES).join('_');
    var fullHash = hashString(localesArray.join('_'));

    return firstSixLocales + '_' + fullHash;
}

/**
 * Job method - Get all products to be exported
 *
 * Function is executed only ONCE
 * @param {JobParameters} parameters - job parameters
 */
function beforeStep(parameters) {
    if (parameters.IsDisabled) {
        return;
    }

    // Reset state for clean job execution
    jobState.reset();

    var siteKeys = TurnToHelper.getSiteKeys();
    if (empty(siteKeys)) {
        return;
    }
    jobState.allowedLocales = TurnToHelper.getAllowedLocales();

    // Preprocess site keys to filter out invalid locales and create localesId
    Object.keys(siteKeys).forEach(function (siteKey) {
        var siteConfig = siteKeys[siteKey];
        var localesArray = allowedSiteLocales(siteConfig);

        // Only include sites that have at least one allowed locale
        if (empty(localesArray)) {
            Logger.warn('ExportCatalog.js: Site key {0} has no valid locales configured. Skipping.', siteKey);
            return;
        }

        // Create enhanced site config that mirrors original structure with added properties
        jobState.validSiteKeys[siteKey] = siteConfig;
        jobState.validSiteKeys[siteKey].localesArray = localesArray;
        jobState.validSiteKeys[siteKey].localesId = createLocalesId(localesArray);
    });

    // Calculate cutoff date for filtering products by last modified date
    // If catalog export days is set, "De-activate Missing Catalog Items" must be disabled in R&R account or skipped products will be disabled
    var exportDays = ServiceFactory.getCatalogExportDaysPreference();
    if (exportDays > 0) {
        var cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - exportDays);
        jobState.cutoffDate = cutoffDate;
        Logger.info('ExportCatalog.js: Filtering products modified since: {0} (Export Days: {1})', jobState.cutoffDate.toISOString(), exportDays);
    }
    jobState.products = catalog.ProductMgr.queryAllSiteProductsSorted();
}

/**
 * Job method - A function that returns the total number of items that are available,
 * this function is called by the framework exactly once before chunk processing begins.
 * A known total count allows better monitoring.
 * For example, to show that 50 of 100 items have already been processed.
 * @param {JobParameters} parameters - job parameters
 * @returns {number} - total number of products
 */
function getTotalCount(parameters) {
    if (parameters.IsDisabled || !jobState.isInitialized()) {
        return 0;
    }

    return jobState.products.count;
}

/**
 * Job method - Create new files for each locale for initial chunk and whenever the files have been close because the file product
 * count exceeds the max file product count
 * @param {JobParameters} parameters - job parameters
 */
function beforeChunk(parameters) {
    if (parameters.IsDisabled || !jobState.isInitialized()) {
        return;
    }
    try {
        if (jobState.shouldCreateFiles()) {
            var impexPath = File.getRootDirectory(File.IMPEX).getFullPath();
            var fileName = parameters.ExportFileName;
            // Create a new file per locale to export to Emplifi if no files are open
            Logger.info('ExportCatalog.js: beforeChunk() - create files');
            jobState.startNewFiles();
            // new map of file writers for each locale per chunk
            jobState.hashMapOfFileWriters = new HashMap();
            Object.keys(jobState.validSiteKeys).forEach(function (siteKey) {
                var siteConfig = jobState.validSiteKeys[siteKey];
                var localesArray = siteConfig.localesArray;
                var localesId = siteConfig.localesId;

                // create a folder with one or more locales
                var folderAndFilePatternName = localesId;
                var turntoDir = new File(impexPath + File.SEPARATOR + 'TurnTo' + File.SEPARATOR + localesArray[0]);

                if (!turntoDir.exists()) {
                    turntoDir.mkdirs();
                }

                // Initialize a file writer for output with the current key
                var catalogExportFileWrite = new File(turntoDir.getFullPath() + File.SEPARATOR + fileName + '_' +
                    folderAndFilePatternName + '_' + Site.getCurrent().ID + '_' + jobState.fileNumber + '.txt');
                catalogExportFileWrite.createNewFile();

                var currentFileWriter = new FileWriter(catalogExportFileWrite);

                // write header text
                currentFileWriter.writeLine('SKU\tIMAGEURL\tTITLE\tPRICE\tCURRENCY\tACTIVE\tITEMURL\tCATEGORY\tKEYWORDS\tINSTOCK\tVIRTUALPARENTCODE\tCATEGORYPATHJSON\tMEMBERS\tBRAND\tMPN\tISBN\tUPC\tEAN\tJAN\tASIN\tMOBILEITEMURL\tLOCALEDATA');
                jobState.hashMapOfFileWriters.put(localesId, currentFileWriter);
            });
        }
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the beforeChunk step with the following error: {0}', e.message);
    }
}

/**
 * Job method - Returns one item or null if there are no more items.
 * @param {JobParameters} parameters - job parameters
 * @returns {dw.catalog.Product|string|null} - product to process; empty string if skipping product; null if no more products
 */
function read(parameters) {
    if (parameters.IsDisabled || !jobState.isInitialized()) {
        return null;
    }
    try {
        var useVariants = ServiceFactory.getUseVariantsPreference();
        if (jobState.products.hasNext()) {
            var tempProduct = jobState.products.next();
            if (!useVariants && tempProduct.isVariant()) {
                return '';
            }
            if (jobState.cutoffDate && tempProduct.getLastModified() < jobState.cutoffDate) {
                return '';
            }
            return tempProduct;
        }
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the read step with the following error: {0}', e.message);
    }
    return null;
}

/**
 * Job method - The product param is the returned object from the read function. The logic will be skipped if the product is empty
 * but not null. This will be skipped and job will end after completing other methods if product is null.
 *
 * It receives the item returned by the read function, performs a process, and returns one item. If the process function
 * returns nothing, then the read function item is filtered and doesn't appear in the list of items to be written later.
 * @param {dw.catalog.Product} product - product
 * @param {JobParameters} parameters - job parameters
 * @returns {json} - completion status
 */
function process(product, parameters) {
    if (parameters.IsDisabled || !jobState.isInitialized() || empty(product)) {
        return null;
    }

    // Generate and return a simple mapping object with locale
    // and formatted output such as ```{ "en_us": "Row data for English US", ...}```
    var json = {};
    try {
        // Non-localized data
        // IMAGEURL - try image types in priority order
        var imageURL = '';
        var image;
        var imageTypes = ['hi-res', 'large', 'medium', 'small', 'swatch'];
        for (var imgIdx = 0; imgIdx < imageTypes.length; imgIdx++) {
            image = product.getImage(imageTypes[imgIdx], 0);
            if (image !== null) {
                imageURL = image.getAbsURL().toString();
                break;
            }
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
            // Collect GTINs from all variants using array methods
            var mpnValues = [];
            var upcValues = [];
            var eanValues = [];

            for (var i = 0; i < product.variants.length; i++) {
                var variant = product.variants[i];
                if (variant.getManufacturerSKU()) {
                    mpnValues.push(variant.getManufacturerSKU());
                }
                if (variant.getUPC()) {
                    upcValues.push(variant.getUPC());
                }
                if (variant.getEAN()) {
                    eanValues.push(variant.getEAN());
                }
            }
            mpn = mpnValues.join(',');
            upc = upcValues.join(',');
            ean = eanValues.join(',');
        } else {
            // Single product GTINs
            mpn = product.getManufacturerSKU() || '';
            upc = product.getUPC() || '';
            ean = product.getEAN() || '';
        }

        // Each site key gets its own product data entry with locale data for each locale for that key
        Object.keys(jobState.validSiteKeys).forEach(function (siteKey) {
            var siteConfig = jobState.validSiteKeys[siteKey];
            var localesArray = siteConfig.localesArray;
            var localesId = siteConfig.localesId;

            // KEYWORDS
            var keywords = '';
            if (product.getPageKeywords()) {
                keywords = product.getPageKeywords();
            }

            // add locales specific data for this site key's locales
            var localeData = {};
            localesArray.forEach(function (localeID) {
                request.setLocale(localeID);
                var url = URLUtils.http('Product-Show', 'pid', product.getID()).toString();
                localeData[localeID] = {
                    title: TurnToHelper.sanitizeStr(product.getName(), ' '),
                    itemUrl: url,
                    mobileItemUrl: url
                };
            });

            var defaultLocale = Site.getCurrent().getDefaultLocale();
            request.setLocale(defaultLocale);
            // build product data for this specific site key
            json[localesId] = {
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
    jobState.incrementProductCount();

    return json;
}

/**
 * Write a single product row to the TSV file for a specific locale
 * @param {dw.io.FileWriter} fileWriter - The file writer for the locale
 * @param {Object} productData - Product data for the specific locale
 */
function writeProductRow(fileWriter, productData) {
    if (!productData) {
        return;
    }

    var values = [];

    // Collect all field values in the correct order
    Object.keys(productData).forEach(function (fieldName) {
        if (Object.hasOwnProperty.call(productData, fieldName)) {
            values.push(TurnToHelper.escapeTsvValue(productData[fieldName]));
        }
    });

    // Write the complete row
    fileWriter.write(values.join('\t'));
    fileWriter.write('\n');
}

/**
 * Write all products for a specific site key to its designated file
 * @param {string} localesId - The locale code for the file
 * @param {Object} productsData - All products data from the chunk
 */
function writeProductsForLocale(localesId, productsData) {
    var fileWriter = jobState.hashMapOfFileWriters.get(localesId);
    if (!fileWriter) {
        Logger.warn('ExportCatalog.js: No file writer found for localesId: {0}', localesId);
        return;
    }
    // Process each product in the chunk
    Object.keys(productsData).forEach(function (productIndex) {
        var productJson = productsData[productIndex];
        if (!empty(productJson) && productJson[localesId]) {
            writeProductRow(fileWriter, productJson[localesId]);
        }
    });
}

/**
 * Job method - the write function receives a list of items.
 * The list size matches the chunk size or smaller, if the number of items in the last available chunk is smaller.
 * The write function returns nothing
 * @param {Object} json - save json object containing product data organized by locale
 * @param {JobParameters} parameters - job parameters
 */
function write(json, parameters) {
    if (parameters.IsDisabled || !jobState.isInitialized() || empty(json)) {
        return;
    }

    try {
        // Process each configured site key
        Object.keys(jobState.validSiteKeys).forEach(function (siteKey) {
            var localesId = jobState.validSiteKeys[siteKey].localesId;

            writeProductsForLocale(localesId, json);
        });
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the write step with the following error: {0}\n{1}', e.message, e.stack);
    }
}

/**
 * Close file writers
 */
function closeFileWriters() {
    if (!jobState.hashMapOfFileWriters) {
        return;
    }
    Object.keys(jobState.validSiteKeys).forEach(function (siteKey) {
        var localesId = jobState.validSiteKeys[siteKey].localesId;
        var fileWriter = jobState.hashMapOfFileWriters.get(localesId);
        if (fileWriter) {
            fileWriter.close();
        }
    });
}

/**
 * Job method - Close file after chunk of products
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
        // Check if we need to close files due to size limit (handled by jobState.incrementProductCount())
        if (jobState.shouldCreateFiles()) {
            closeFileWriters();
        }
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the afterChunk step with the following error: {0}\n{1}', e.message, e.stack);
    }
}

/**
 * Job method - Function is executed only ONCE
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
        if (jobState.products) {
            jobState.products.close();
        }
        // Clean up state after job completion
        jobState.reset();
    } catch (e) {
        Logger.error('exportCatalog.js has failed on the afterStep step with the following error: {0}\n{1}', e.message, e.stack);
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
