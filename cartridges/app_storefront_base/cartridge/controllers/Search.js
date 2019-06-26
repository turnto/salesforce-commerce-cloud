'use strict';

var server = require('server');

var CatalogMgr = require('dw/catalog/CatalogMgr');
var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

server.get('UpdateGrid', cache.applyPromotionSensitiveCache, function (req, res, next) {
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var searchHelper = require('*/cartridge/scripts/helpers/searchHelpers');
    var ProductSearch = require('*/cartridge/models/search/productSearch');

    var apiProductSearch = new ProductSearchModel();
    apiProductSearch = searchHelper.setupSearch(apiProductSearch, req.querystring);
    apiProductSearch.search();
    var productSearch = new ProductSearch(
        apiProductSearch,
        req.querystring,
        req.querystring.srule,
        CatalogMgr.getSortingOptions(),
        CatalogMgr.getSiteCatalog().getRoot()
    );

    res.render('/search/productGrid', {
        productSearch: productSearch
    });

    next();
});

server.get('Refinebar', cache.applyDefaultCache, function (req, res, next) {
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var ProductSearch = require('*/cartridge/models/search/productSearch');
    var searchHelper = require('*/cartridge/scripts/helpers/searchHelpers');

    var apiProductSearch = new ProductSearchModel();
    apiProductSearch = searchHelper.setupSearch(apiProductSearch, req.querystring);
    apiProductSearch.search();
    var productSearch = new ProductSearch(
        apiProductSearch,
        req.querystring,
        req.querystring.srule,
        CatalogMgr.getSortingOptions(),
        CatalogMgr.getSiteCatalog().getRoot()
    );
    res.render('/search/searchRefineBar', {
        productSearch: productSearch,
        querystring: req.querystring
    });

    next();
});


server.get('Show', cache.applyShortPromotionSensitiveCache, consentTracking.consent, function (req, res, next) {
    var ProductSearchModel = require('dw/catalog/ProductSearchModel');
    var URLUtils = require('dw/web/URLUtils');
    var ProductSearch = require('*/cartridge/models/search/productSearch');
    var reportingUrlsHelper = require('*/cartridge/scripts/reportingUrls');
    var searchHelper = require('*/cartridge/scripts/helpers/searchHelpers');
    var pageMetaHelper = require('*/cartridge/scripts/helpers/pageMetaHelper');

    var categoryTemplate = '';
    var productSearch;
    var isAjax = Object.hasOwnProperty.call(req.httpHeaders, 'x-requested-with')
        && req.httpHeaders['x-requested-with'] === 'XMLHttpRequest';
    var resultsTemplate = isAjax ? 'search/searchResultsNoDecorator' : 'search/searchResults';
    var apiProductSearch = new ProductSearchModel();
    var maxSlots = 4;
    var reportingURLs;
    var searchRedirect = req.querystring.q
        ? apiProductSearch.getSearchRedirect(req.querystring.q)
        : null;

    if (searchRedirect) {
        res.redirect(searchRedirect.getLocation());
        return next();
    }

    apiProductSearch = searchHelper.setupSearch(apiProductSearch, req.querystring);
    apiProductSearch.search();

    categoryTemplate = searchHelper.getCategoryTemplate(apiProductSearch);
    productSearch = new ProductSearch(
        apiProductSearch,
        req.querystring,
        req.querystring.srule,
        CatalogMgr.getSortingOptions(),
        CatalogMgr.getSiteCatalog().getRoot()
    );

    pageMetaHelper.setPageMetaTags(req.pageMetaData, productSearch);

    var refineurl = URLUtils.url('Search-Refinebar');
    var whitelistedParams = ['q', 'cgid', 'pmin', 'pmax', 'srule'];
    var isRefinedSearch = false;
    Object.keys(req.querystring).forEach(function (element) {
        if (whitelistedParams.indexOf(element) > -1) {
            refineurl.append(element, req.querystring[element]);
        }

        if (['pmin', 'pmax'].indexOf(element) > -1) {
            isRefinedSearch = true;
        }

        if (element === 'preferences') {
            var i = 1;
            isRefinedSearch = true;
            Object.keys(req.querystring[element]).forEach(function (preference) {
                refineurl.append('prefn' + i, preference);
                refineurl.append('prefv' + i, req.querystring[element][preference]);
                i++;
            });
        }
    });

    if (productSearch.searchKeywords !== null && !isRefinedSearch) {
        reportingURLs = reportingUrlsHelper.getProductSearchReportingURLs(productSearch);
    }

    if (
        productSearch.isCategorySearch
        && !productSearch.isRefinedCategorySearch
        && categoryTemplate
        && apiProductSearch.category.parent.ID === 'root'
    ) {
        pageMetaHelper.setPageMetaData(req.pageMetaData, productSearch.category);

        if (isAjax) {
            res.render(resultsTemplate, {
                productSearch: productSearch,
                maxSlots: maxSlots,
                reportingURLs: reportingURLs,
                refineurl: refineurl
            });
        } else {
            res.render(categoryTemplate, {
                productSearch: productSearch,
                maxSlots: maxSlots,
                category: apiProductSearch.category,
                reportingURLs: reportingURLs,
                refineurl: refineurl
            });
        }
    } else {
        res.render(resultsTemplate, {
            productSearch: productSearch,
            maxSlots: maxSlots,
            reportingURLs: reportingURLs,
            refineurl: refineurl
        });
    }

    return next();
}, pageMetaData.computedPageMetaData);

server.get('Content', cache.applyDefaultCache, consentTracking.consent, function (req, res, next) {
    var searchHelper = require('*/cartridge/scripts/helpers/searchHelpers');

    var contentSearch = searchHelper.setupContentSearch(req.querystring);
    res.render('/search/contentGrid', {
        contentSearch: contentSearch
    });
    next();
});

module.exports = server.exports();
