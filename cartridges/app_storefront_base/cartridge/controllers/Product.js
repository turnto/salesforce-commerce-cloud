'use strict';

var server = require('server');

var cache = require('*/cartridge/scripts/middleware/cache');
var consentTracking = require('*/cartridge/scripts/middleware/consentTracking');
var pageMetaData = require('*/cartridge/scripts/middleware/pageMetaData');

/**
 * @typedef ProductDetailPageResourceMap
 * @type Object
 * @property {String} global_availability - Localized string for "Availability"
 * @property {String} label_instock - Localized string for "In Stock"
 * @property {String} global_availability - Localized string for "This item is currently not
 *     available"
 * @property {String} info_selectforstock - Localized string for "Select Styles for Availability"
 */

server.get('Show', cache.applyPromotionSensitiveCache, consentTracking.consent, function (req, res, next) {
    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
    var showProductPageHelperResult = productHelper.showProductPage(req.querystring, req.pageMetaData);
    var productType = showProductPageHelperResult.product.productType;
    if (!showProductPageHelperResult.product.online && productType !== 'set' && productType !== 'bundle') {
        res.setStatusCode(404);
        res.render('error/notFound');
    } else {
        res.render(showProductPageHelperResult.template, {
            product: showProductPageHelperResult.product,
            addToCartUrl: showProductPageHelperResult.addToCartUrl,
            resources: showProductPageHelperResult.resources,
            breadcrumbs: showProductPageHelperResult.breadcrumbs
        });
    }
    next();
}, pageMetaData.computedPageMetaData);

server.get('ShowInCategory', cache.applyPromotionSensitiveCache, function (req, res, next) {
    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
    var showProductPageHelperResult = productHelper.showProductPage(req.querystring, req.pageMetaData);
    if (!showProductPageHelperResult.product.online) {
        res.setStatusCode(404);
        res.render('error/notFound');
    } else {
        res.render(showProductPageHelperResult.template, {
            product: showProductPageHelperResult.product,
            addToCartUrl: showProductPageHelperResult.addToCartUrl,
            resources: showProductPageHelperResult.resources,
            breadcrumbs: showProductPageHelperResult.breadcrumbs
        });
    }
    next();
});

server.get('Variation', function (req, res, next) {
    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
    var priceHelper = require('*/cartridge/scripts/helpers/pricing');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');

    var params = req.querystring;
    var product = ProductFactory.get(params);

    product.price.html = priceHelper.renderHtml(priceHelper.getHtmlContext(product.price));

    var attributeContext = { product: { attributes: product.attributes } };
    var attributeTemplate = 'product/components/attributesPre';
    product.attributesHtml = renderTemplateHelper.getRenderedHtml(
        attributeContext,
        attributeTemplate
    );

    res.json({
        product: product,
        resources: productHelper.getResources()
    });

    next();
});

server.get('ShowQuickView', cache.applyPromotionSensitiveCache, function (req, res, next) {
    var URLUtils = require('dw/web/URLUtils');
    var productHelper = require('*/cartridge/scripts/helpers/productHelpers');
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var renderTemplateHelper = require('*/cartridge/scripts/renderTemplateHelper');

    var params = req.querystring;
    var product = ProductFactory.get(params);
    var addToCartUrl = URLUtils.url('Cart-AddProduct');
    var template = product.productType === 'set'
        ? 'product/setQuickView.isml'
        : 'product/quickView.isml';

    var context = {
        product: product,
        addToCartUrl: addToCartUrl,
        resources: productHelper.getResources()
    };

    var renderedTemplate = renderTemplateHelper.getRenderedHtml(context, template);

    res.json({
        renderedTemplate: renderedTemplate,
        productUrl: URLUtils.url('Product-Show', 'pid', product.id).relative().toString()
    });

    next();
});

server.get('SizeChart', function (req, res, next) {
    var ContentMgr = require('dw/content/ContentMgr');

    var apiContent = ContentMgr.getContent(req.querystring.cid);

    if (apiContent) {
        res.json({
            success: true,
            content: apiContent.custom.body.markup
        });
    } else {
        res.json({});
    }
    next();
});

server.get('ShowBonusProducts', function (req, res, next) {
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var moreUrl = null;
    var pagingModel;
    var products = [];
    var product;
    var duuid = req.querystring.DUUID;
    var collections = require('*/cartridge/scripts/util/collections');
    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentOrNewBasket();
    var showMoreButton;
    var selectedBonusProducts;

    if (duuid) {
        var bonusDiscountLineItem = collections.find(currentBasket.getBonusDiscountLineItems(), function (item) {
            return item.UUID === duuid;
        });

        if (bonusDiscountLineItem && bonusDiscountLineItem.bonusProductLineItems.length) {
            selectedBonusProducts = collections.map(bonusDiscountLineItem.bonusProductLineItems, function (bonusProductLineItem) {
                var option = {
                    optionid: '',
                    selectedvalue: ''
                };
                if (!bonusProductLineItem.optionProductLineItems.empty) {
                    option.optionid = bonusProductLineItem.optionProductLineItems[0].optionID;
                    option.optionid = bonusProductLineItem.optionProductLineItems[0].optionValueID;
                }
                return {
                    pid: bonusProductLineItem.productID,
                    name: bonusProductLineItem.productName,
                    submittedQty: (bonusProductLineItem.quantityValue),
                    option: option
                };
            });
        } else {
            selectedBonusProducts = [];
        }

        if (req.querystring.pids) {
            var params = req.querystring.pids.split(',');
            products = params.map(function (param) {
                product = ProductFactory.get({
                    pid: param,
                    pview: 'bonus',
                    duuid: duuid });
                return product;
            });
        } else {
            var URLUtils = require('dw/web/URLUtils');
            var PagingModel = require('dw/web/PagingModel');
            var pageStart = parseInt(req.querystring.pagestart, 10);
            var pageSize = parseInt(req.querystring.pagesize, 10);
            showMoreButton = true;

            var ProductSearchModel = require('dw/catalog/ProductSearchModel');
            var apiProductSearch = new ProductSearchModel();
            var productSearchHit;
            apiProductSearch.setPromotionID(bonusDiscountLineItem.promotionID);
            apiProductSearch.setPromotionProductType('bonus');
            apiProductSearch.search();
            pagingModel = new PagingModel(apiProductSearch.getProductSearchHits(), apiProductSearch.count);
            pagingModel.setStart(pageStart);
            pagingModel.setPageSize(pageSize);

            var totalProductCount = pagingModel.count;

            if (pageStart + pageSize > totalProductCount) {
                showMoreButton = false;
            }

            moreUrl = URLUtils.url('Product-ShowBonusProducts', 'DUUID', duuid, 'pagesize', pageSize, 'pagestart', pageStart + pageSize).toString();

            var iter = pagingModel.pageElements;
            while (iter !== null && iter.hasNext()) {
                productSearchHit = iter.next();
                product = ProductFactory.get({ pid: productSearchHit.getProduct().ID, pview: 'bonus', duuid: duuid });
                products.push(product);
            }
        }
    }

    var template = 'product/components/choiceOfBonusProducts/bonusProducts.isml';

    res.render(template, {
        products: products,
        selectedBonusProducts: selectedBonusProducts,
        maxPids: req.querystring.maxpids,
        moreUrl: moreUrl,
        showMoreButton: showMoreButton
    });

    next();
});

module.exports = server.exports();
