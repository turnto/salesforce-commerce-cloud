var ArrayList = require('dw/util/ArrayList');
var CatalogMgr = require('dw/catalog/CatalogMgr');
var ContentMgr = require('dw/content/ContentMgr');
var CouponMgr = require('dw/campaign/CouponMgr');
var CustomerMgr = require('dw/customer/CustomerMgr');
var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var File = require('dw/io/File');
var Logger = require('dw/system/Logger').getLogger('cs.job.StandardExport');
var OrderMgr = require('dw/order/OrderMgr');
var Pipeline = require('dw/system/Pipeline');
var PriceBookMgr = require('dw/catalog/PriceBookMgr');
var ProductInventoryMgr = require('dw/catalog/ProductInventoryMgr');
var ProductListMgr = require('dw/customer/ProductListMgr');
var ProductMgr = require('dw/catalog/ProductMgr');
var ShippingMgr = require('dw/order/ShippingMgr');
var Status = require('dw/system/Status');
var SystemObjectMgr = require('dw/object/SystemObjectMgr');

var FileHelper = require('~/cartridge/scripts/file/FileHelper');
var StepUtil = require('~/cartridge/scripts/util/StepUtil');

var EXPORT_ALL_QUERY = 'UUID != NULL';
var STATUS = {
    FILE_EXIST : 'FILE_ALREADY_EXISTS',
    NO_DATA    : 'NO_DATA_TO_EXPORT'
};

/**
 * Generic export function that is called by all export functions.
 *
 * Takes care of
 *  - Directory creation
 *  - File existence check (in case the Overwrite file arg is set to true)
 *  - Exit status
 *
 * Gets a callback function that does the actual export (Pipeline Call)
 *
 * @param {array} args Job argument list
 * @param {function} callback Callback function to trigger the export Pipeline
 *
 * @return {dw.system.Status} Exit status for a job run
 */
function genericExport(args, callback) {
    if (StepUtil.isDisabled(args)) {
        return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
    }

    var targetFolder = StepUtil.replacePathPlaceholders(File.IMPEX + File.SEPARATOR + args.TargetFolder);
    var filename = StepUtil.replacePathPlaceholders(args.Filename);

    // OverwriteExportFile option
    var OverwriteExportFile = args.OverwriteExportFile;
    if (OverwriteExportFile !== true && FileHelper.isFileExists(targetFolder, filename)) {
        return new Status(Status.OK, STATUS.FILE_EXIST, 'The file already exists and the OverwriteExportFile is not set to active. Abort...');
    }

    // Create target directory
    FileHelper.createDirectory(targetFolder);
    var filePath = targetFolder + File.SEPARATOR + filename;

    var status = new Status(Status.OK, 'OK', 'Export successful');

    // Call the callback function, this will trigger the actual export
    var result = callback(filePath.replace(File.IMPEX + File.SEPARATOR + 'src', ''), args);

    /*
     * {result} is expected to be returned by pipeline execution,
     * but in case of error in JS logic (eg. due validation),
     * we return an instance of dw.system.Status class.
     * Because of that, we need to explicitly check, if {result} from callback() has a property 'Status'
     */
    if (result.hasOwnProperty('Status') && result.Status.getStatus() !== Status.OK) {
        // No data to export, return the custom status NOTHING_TO_EXPORT
        if (result.ErrorCode === 156) {
            return new Status(Status.OK, STATUS.NO_DATA);
        }

        // Export failed: Update status, log message
        status = new Status(Status.ERROR, 'ERROR', result.ErrorCode + ': ' + result.ErrorMsg + '. See log file "' + result.LogFileName + '" for more details.');
        Logger.error('...Error: ' + result.ErrorMsg);
    } else if (result instanceof dw.system.Status && result !== Status.OK) {
        status = result;
    }

    return status;
}

/**
 * ABTest export
 *
 * @param {array} options
 */
var abTests = function abTests(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ExportWrapper-ABTests', {
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Catalog export
 *
 * @param {array} options
 */
var catalog = function catalog(options) {
    var callback = function callback(file, args) {
        var catalogToExport = !empty(args.Catalog) ? CatalogMgr.getCatalog(args.Catalog) : CatalogMgr.getSiteCatalog();

        if (empty(catalogToExport)) {
            return new Status(Status.ERROR, 'ERROR', 'Unknown catalog with ID ' + args.Catalog);
        }

        // Handle the Categories argument if provided
        var categoriesToExport = args.Categories;
        var categoriesIterator;
        if (!empty(categoriesToExport)) {
            categoriesToExport = categoriesToExport.split(',').map(function (categoryID) {
                return CatalogMgr.getCategory(categoryID);
            }).filter(function (category) {
                return !empty(category);
            });

            if (categoriesToExport.length > 0) {
                categoriesIterator = new ArrayList(categoriesToExport).iterator();
            }
        }

        // Handle the Products argument if provided
        var productsToExport = args.Products;
        var productsIterator;
        if (!empty(productsToExport)) {
            productsToExport = productsToExport.split(',').map(function (productID) {
                return ProductMgr.getProduct(productID);
            }).filter(function (product) {
                return !empty(product);
            });

            if (productsToExport.length > 0) {
                productsIterator = new ArrayList(productsToExport).iterator();
            }
        }

        return Pipeline.execute('ExportWrapper-Catalog', {
            Catalog                    : catalogToExport,
            Categories                 : categoriesIterator,
            ExportCategories           : !empty(args.ExportCategories) && args.ExportCategories === true,
            ExportCategoryAssignements : !empty(args.ExportCategoryAssignements) && args.ExportCategoryAssignements === true,
            ExportFile                 : file,
            ExportProductOptions       : !empty(args.ExportProductOptions) && args.ExportProductOptions === true,
            ExportProducts             : !empty(args.ExportProducts) && args.ExportProducts === true,
            ExportRecommendations      : !empty(args.ExportRecommendations) && args.ExportRecommendations === true,
            ExportVariationAttributes  : !empty(args.ExportVariationAttributes) && args.ExportVariationAttributes === true,
            OverwriteExportFile        : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true,
            Products                   : productsIterator
        });
    };

    return genericExport(options, callback);
};

/**
 * Content export
 *
 * @param {array} options
 */
var content = function content(options) {
    var callback = function callback(file, args) {
        var library = !empty(args.Library) ? ContentMgr.getLibrary(args.Library) : ContentMgr.getSiteLibrary();
        if (empty(library)) {
            return new Status(Status.ERROR, 'ERROR', 'Unknown library with ID ' + args.Library);
        }

        // Handle the Folders argument if provided
        var foldersToExport = args.Folders;
        var foldersIterator;
        if (!empty(foldersToExport)) {
            foldersToExport = foldersToExport.split(',').map(function (folderID) {
                return ContentMgr.getFolder(library.getID(), folderID);
            }).filter(function (folder) {
                return !empty(folder);
            });

            if (foldersToExport.length > 0) {
                foldersIterator = new ArrayList(foldersToExport).iterator();
            }
        }

        return Pipeline.execute('ExportWrapper-Content', {
            ExportContent       : !empty(args.ExportContent) && args.ExportContent === true,
            ExportFile          : file,
            ExportFolders       : !empty(args.ExportFolders) && args.ExportFolders === true,
            ExportSubFolders    : !empty(args.ExportSubFolders) && args.ExportSubFolders === true,
            Folders             : foldersIterator,
            Library             : library,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * CouponCodes export
 *
 * @param {array} options
 */
var couponCodes = function coupons(options) {
    var callback = function callback(file, args) {
        // Try getting the coupon by ID
        var coupon = CouponMgr.getCoupon(args.Coupon);
        // If the coupon is not found, try to get it by code
        if (empty(coupon)) {
            coupon = CouponMgr.getCouponByCode(args.Coupon);
        }

        if (empty(coupon)) {
            return new Status(Status.ERROR, 'ERROR', 'Unknown coupon ' + args.Coupon);
        }

        return Pipeline.execute('ExportWrapper-CouponCodes', {
            Coupon              : coupon,
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true,
            NumberOfCodes       : args.NumberOfCodes,
            StartFrom           : args.StartFrom
        });
    };

    return genericExport(options, callback);
};

/**
 * Coupons export
 *
 * @param {array} options
 */
var coupons = function coupons(options) {
    var callback = function callback(file, args) {
        // Handle the Coupons argument if provided
        var couponsToExport = args.Coupons;
        var couponsIterator;
        if (!empty(couponsToExport)) {
            couponsToExport = couponsToExport.split(',').map(function (couponIDOrCode) {
                var coupon = CouponMgr.getCoupon(couponIDOrCode);
                if (!empty(coupon)) {
                    return coupon;
                }

                return CouponMgr.getCouponByCode(couponIDOrCode);
            }).filter(function (coupon) {
                return !empty(coupon);
            });

            if (couponsToExport.length > 0) {
                couponsIterator = new ArrayList(couponsToExport).iterator();
            }
        }

        return Pipeline.execute('ExportWrapper-Coupons', {
            Coupons             : couponsIterator,
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Customer Groups export
 *
 * @param {array} options
 */
var customerGroups = function customerGroups(options) {
    var callback = function callback(file, args) {
        // Handle the CustomerGroups argument if provided
        var customerGroupsToExport = args.CustomerGroups;
        var customerGroupsIterator;
        if (!empty(customerGroupsToExport)) {
            customerGroupsToExport = customerGroupsToExport.split(',').map(function (customerGroupID) {
                return CustomerMgr.getCustomerGroup(customerGroupID);
            }).filter(function (customerGroup) {
                return !empty(customerGroup);
            });

            if (customerGroupsToExport.length > 0) {
                customerGroupsIterator = new ArrayList(customerGroupsToExport).iterator();
            } else {
                customerGroupsIterator = CustomerMgr.getCustomerGroups().iterator();
            }
        } else {
            customerGroupsIterator = CustomerMgr.getCustomerGroups().iterator();
        }

        if (empty(customerGroupsIterator)) {
            return new Status(Status.ERROR, 'ERROR', 'No valid customer groups have been found.');
        }

        return Pipeline.execute('ExportWrapper-CustomerGroups', {
            CustomerGroups      : customerGroupsIterator,
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Customer List export
 *
 * @param {array} options
 */
var customerList = function customerList(options) {
    var callback = function callback(file, args) {
        var customerListToExport = !empty(args.CustomerList) ? CustomerMgr.getCustomerList(args.CustomerList) : CustomerMgr.getSiteCustomerList();
        if (empty(customerListToExport)) {
            return new Status(Status.ERROR, 'ERROR', 'Unknown customer list with ID ' + args.CustomerList);
        }

        // Handle the Query argument if provided
        var query = args.Query;
        var profilesIterator;
        if (!empty(query)) {
            profilesIterator = CustomerMgr.searchProfiles(query, 'customerNo DESC');
        }

        return Pipeline.execute('ExportWrapper-CustomerList', {
            CustomerList        : customerListToExport,
            Customers           : profilesIterator,
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Customers export
 *
 * @param {array} options
 */
var customers = function customers(options) {
    var callback = function callback(file, args) {
        var query = args.Query;

        // If the query if empty, return all objects
        if (empty(query)) {
            query = EXPORT_ALL_QUERY;
        }

        var profilesIterator = CustomerMgr.searchProfiles(query, 'customerNo DESC');

        return Pipeline.execute('ExportWrapper-Customers', {
            Customers           : profilesIterator,
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Custom Objects export
 *
 * @param {array} options
 */
var customObjects = function customObjects(options) {
    var callback = function callback(file, args) {
        var type = args.Type;
        var query = args.Query;

        // If the query if empty, return all objects
        if (empty(query)) {
            query = EXPORT_ALL_QUERY;
        }

        var customObjectsIterator = CustomObjectMgr.queryCustomObjects(type, query, 'UUID DESC');

        return Pipeline.execute('ExportWrapper-CustomObjects', {
            CustomObjects       : customObjectsIterator,
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Gift Certificates export
 *
 * @param {array} options
 */
var giftCertificates = function giftCertificates(options) {
    var callback = function callback(file, args) {
        var query = args.Query;

        // If the query if empty, return all objects
        if (empty(query)) {
            query = EXPORT_ALL_QUERY;
        }

        var giftCertificatesIterator = SystemObjectMgr.querySystemObjects('GiftCertificate', query, 'UUID DESC');

        return Pipeline.execute('ExportWrapper-GiftCertificates', {
            ExportFile          : file,
            GiftCertificates    : giftCertificatesIterator,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Inventory Lists export
 *
 * @param {array} options
 */
var inventoryLists = function inventoryLists(options) {
    var callback = function callback(file, args) {
        // Handle the InventoryLists argument if provided
        var inventoryListsToExport = args.InventoryLists;
        var inventoryListsIterator;
        if (!empty(inventoryListsToExport)) {
            inventoryListsToExport = inventoryListsToExport.split(',').map(function (inventoryListID) {
                return ProductInventoryMgr.getInventoryList(inventoryListID);
            }).filter(function (inventoryList) {
                return !empty(inventoryList);
            });

            if (inventoryListsToExport.length > 0) {
                inventoryListsIterator = new ArrayList(inventoryListsToExport).iterator();
            } else {
                inventoryListsIterator = new ArrayList(ProductInventoryMgr.getInventoryList()).iterator();
            }
        } else {
            inventoryListsIterator = new ArrayList(ProductInventoryMgr.getInventoryList()).iterator();
        }

        return Pipeline.execute('ExportWrapper-InventoryLists', {
            ExportFile          : file,
            InventoryLists      : inventoryListsIterator,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * MetaData export
 *
 * @param {array} options
 */
var metaData = function metaData(options) {
    var callback = function callback(file, args) {
        // Handle the CustomTypes argument if provided
        var customTypesToExport = args.CustomTypes;
        var customTypesIterator;
        if (!empty(customTypesToExport)) {
            customTypesToExport = customTypesToExport.split(',').map(function (customType) {
                return CustomObjectMgr.describe(customType);
            }).filter(function (objectDefinition) {
                return !empty(objectDefinition);
            });

            if (customTypesToExport.length > 0) {
                customTypesIterator = new ArrayList(customTypesToExport).iterator();
            }
        }

        // Handle the SystemTypes argument if provided
        var systemTypesToExport = args.CustomTypes;
        var systemTypesIterator;
        if (!empty(systemTypesToExport)) {
            systemTypesToExport = systemTypesToExport.split(',').map(function (systemType) {
                return SystemObjectMgr.describe(systemType);
            }).filter(function (objectDefinition) {
                return !empty(objectDefinition);
            });

            if (systemTypesToExport.length > 0) {
                systemTypesIterator = new ArrayList(systemTypesToExport).iterator();
            }
        }

        return Pipeline.execute('ExportWrapper-MetaData', {
            CustomTypes             : customTypesIterator,
            ExportCustomPreferences : !empty(args.ExportCustomPreferences) && args.ExportCustomPreferences === true,
            ExportCustomTypes       : !empty(args.ExportCustomTypes) && args.ExportCustomTypes === true,
            ExportFile              : file,
            ExportSystemTypes       : !empty(args.ExportSystemTypes) && args.ExportSystemTypes === true,
            OverwriteExportFile     : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true,
            SystemTypes             : systemTypesIterator
        });
    };

    return genericExport(options, callback);
};

/**
 * Orders export
 *
 * @param {array} options
 */
var orders = function orders(options) {
    var callback = function callback(file, args) {
        var query = args.Query;

        // If the query if empty, return all objects
        if (empty(query)) {
            query = EXPORT_ALL_QUERY;
        }

        var ordersIterator = OrderMgr.searchOrders(query, 'orderNo DESC');

        return Pipeline.execute('ExportWrapper-Orders', {
            EncryptionAlgorithm : args.EncryptionAlgorithm,
            EncryptionKey       : args.EncryptionKey,
            ExportFile          : file,
            Orders              : ordersIterator,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true,
            UpdateExportStatus  : !empty(args.UpdateExportStatus) && args.UpdateExportStatus === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Price Adjustment Limits export
 *
 * @param {array} options
 */
var priceAdjustmentLimits = function priceAdjustmentLimits(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ExportWrapper-PriceAdjustmentLimits', {
            ExportFile          : file,
            OverwriteExportFile : args.OverwriteExportFile
        });
    };

    return genericExport(options, callback);
};

/**
 * Pricebooks export
 *
 * @param {array} options
 */
var pricebooks = function pricebooks(options) {
    var callback = function callback(file, args) {
        // Handle the PriceBooks argument if provided
        var pricebooksToExport = args.PriceBooks;
        var pricebooksIterator;
        if (!empty(pricebooksToExport)) {
            pricebooksToExport = pricebooksToExport.split(',').map(function (pricebookID) {
                return PriceBookMgr.getPriceBook(pricebookID);
            }).filter(function (pricebook) {
                return !empty(pricebook);
            });

            if (pricebooksToExport.length > 0) {
                pricebooksIterator = new ArrayList(pricebooksToExport).iterator();
            } else {
                pricebooksIterator = new ArrayList(PriceBookMgr.getAllPriceBooks()).iterator();
            }
        } else {
            pricebooksIterator = new ArrayList(PriceBookMgr.getAllPriceBooks()).iterator();
        }

        return Pipeline.execute('ExportWrapper-Pricebooks', {
            ExportFile          : file,
            PriceBooks          : pricebooksIterator,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Product Lists export
 *
 * @param {array} options
 */
var productLists = function productLists(options) {
    var callback = function callback(file, args) {
        var query = args.Query;

        // If the query if empty, return all objects
        if (empty(query)) {
            query = EXPORT_ALL_QUERY;
        }

        var productListsIterator = ProductListMgr.queryProductLists(query, 'UUID DESC');

        return Pipeline.execute('ExportWrapper-ProductLists', {
            ExportFile          : file,
            ProductLists        : productListsIterator,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Promotions export
 *
 * @param {array} options
 */
var promotions = function promotions(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ExportWrapper-Promotions', {
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * ShippingMethods export
 *
 * @param {array} options
 */
var shippingMethods = function shippingMethods(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ExportWrapper-ShippingMethods', {
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true,
            ShippingMethods     : ShippingMgr.getAllShippingMethods().iterator()
        });
    };

    return genericExport(options, callback);
};

/**
 * Slots export
 *
 * @param {array} options
 */
var slots = function slots(options) {
    var callback = function callback(file, args) {
        return Pipeline.execute('ExportWrapper-Slots', {
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true
        });
    };

    return genericExport(options, callback);
};

/**
 * Source Codes export
 *
 * @param {array} options
 */
var sourceCodes = function sourceCodes(options) {
    var callback = function callback(file, args) {
        var query = args.Query;

        // If the query if empty, return all objects
        if (empty(query)) {
            query = EXPORT_ALL_QUERY;
        }

        var sourceCodeGroupsIterator = SystemObjectMgr.querySystemObjects('SourceCodeGroup', query, 'UUID DESC');

        return Pipeline.execute('ExportWrapper-SourceCodes', {
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true,
            SourceCodeGroups    : sourceCodeGroupsIterator
        });
    };

    return genericExport(options, callback);
};

/**
 * Stores export
 *
 * @param {array} options
 */
var stores = function stores(options) {
    var callback = function callback(file, args) {
        var query = args.Query;

        // If the query if empty, return all objects
        if (empty(query)) {
            query = EXPORT_ALL_QUERY;
        }

        var storesIterator = SystemObjectMgr.querySystemObjects('Store', query, 'UUID DESC');

        return Pipeline.execute('ExportWrapper-Stores', {
            ExportFile          : file,
            OverwriteExportFile : !empty(args.OverwriteExportFile) && args.OverwriteExportFile === true,
            Stores              : storesIterator
        });
    };

    return genericExport(options, callback);
};

exports.abTests = abTests;
exports.catalog = catalog;
exports.content = content;
exports.couponCodes = couponCodes;
exports.coupons = coupons;
exports.customerGroups = customerGroups;
exports.customerList = customerList;
exports.customers = customers;
exports.customObjects = customObjects;
exports.giftCertificates = giftCertificates;
exports.inventoryLists = inventoryLists;
exports.metaData = metaData;
exports.orders = orders;
exports.priceAdjustmentLimits = priceAdjustmentLimits;
exports.pricebooks = pricebooks;
exports.productLists = productLists;
exports.promotions = promotions;
exports.shippingMethods = shippingMethods;
exports.slots = slots;
exports.sourceCodes = sourceCodes;
exports.stores = stores;
