'use strict';

/**
 * Set search configuration values
 *
 * @param {dw.catalog.ProductSearchModel} apiProductSearch - API search instance
 * @param {Object} params - Provided HTTP query parameters
 * @return {dw.catalog.ProductSearchModel} - API search instance
 */
function setupSearch(apiProductSearch, params) {
    var CatalogMgr = require('dw/catalog/CatalogMgr');
    var search = require('*/cartridge/scripts/search/search');

    var sortingRule = params.srule ? CatalogMgr.getSortingRule(params.srule) : null;
    var selectedCategory = CatalogMgr.getCategory(params.cgid);
    selectedCategory = selectedCategory && selectedCategory.online ? selectedCategory : null;

    search.setProductProperties(apiProductSearch, params, selectedCategory, sortingRule);

    if (params.preferences) {
        search.addRefinementValues(apiProductSearch, params.preferences);
    }

    return apiProductSearch;
}

/**
 * Retrieve a category's template filepath if available
 *
 * @param {dw.catalog.ProductSearchModel} apiProductSearch - API search instance
 * @return {string} - Category's template filepath
 */
function getCategoryTemplate(apiProductSearch) {
    return apiProductSearch.category ? apiProductSearch.category.template : '';
}

/**
 * Set content search configuration values
 *
 * @param {Object} params - Provided HTTP query parameters
 * @return {Object} - content search instance
 */
function setupContentSearch(params) {
    var ContentSearchModel = require('dw/content/ContentSearchModel');
    var ContentSearch = require('*/cartridge/models/search/contentSearch');
    var apiContentSearchModel = new ContentSearchModel();

    apiContentSearchModel.setRecursiveFolderSearch(true);
    apiContentSearchModel.setSearchPhrase(params.q);
    apiContentSearchModel.search();
    var contentSearchResult = apiContentSearchModel.getContent();
    var count = Number(apiContentSearchModel.getCount());
    var contentSearch = new ContentSearch(contentSearchResult, count, params.q, params.startingPage, null);

    return contentSearch;
}

exports.setupSearch = setupSearch;
exports.getCategoryTemplate = getCategoryTemplate;
exports.setupContentSearch = setupContentSearch;
