'use strict';

/*
 * Order Helper to write order and product data
 *
 */

var Site = require('dw/system/Site');
var URLUtils = require('dw/web/URLUtils');
var Calendar = require('dw/util/Calendar');
var StringUtils = require('dw/util/StringUtils');

/* Script Modules */
var TurnToHelper = require('*/cartridge/scripts/util/turnToHelperUtil');

var OrderWriterHelper = {
	/**
	 * @function
	 * @name getLocalizedTurnToPreferenceValue
	 * @param {dw.order.Order} order - order
	 * @param {dw.io.FileWriter} fileWriter - file writer
	 * @param {string} currentLocale - The name of the localized
	 */
    writeOrderData: function (order, fileWriter, currentLocale) {
		// Get all of the product line items for the order
		var products : Collection = order.getAllProductLineItems();
		
		var useVariants : Boolean = Site.getCurrent().getCustomPreferenceValue('turntoUseVariants') == true;
		
		for (var i : Number = 0; i < products.size(); i++) {
			var productLineItem : ProductLineItem = products[i];
			var product : Product = productLineItem.getProduct();
			if (product == null){
				continue;
			}
		
			if (product.isVariant() && !useVariants) {
				product = product.getVariationModel().getMaster();
			}
		
			// ORDERID
			fileWriter.write(order.getOrderNo());
			fileWriter.write("\t");
		
			// ORDERDATE
			// Format: 2011-08-25 20:50:15
			var creationDate : Date = order.getCreationDate();
			var creationStr = dw.util.StringUtils.formatCalendar(new Calendar(creationDate), "yyyy-MM-dd hh:mm:ss");
			fileWriter.write(creationStr);
			fileWriter.write("\t");
		
			//EMAIL
			fileWriter.write(order.getCustomerEmail());
			fileWriter.write("\t");
		
			//ITEMTITLE
			fileWriter.write(TurnToHelper.replaceNull(product.getName(), ""));
			fileWriter.write("\t");
		
			//ITEMURL
			fileWriter.write(URLUtils.http('Product-Show', 'pid', product.getID()).toString());
			fileWriter.write("\t");
		
			//ITEMLINEID
			fileWriter.write("\t");
		
			//ZIP
			var billingAddress : OrderAddress = order.getBillingAddress();
			fileWriter.write(billingAddress.getPostalCode());
			fileWriter.write("\t");
		
			//FIRSTNAME
			fileWriter.write(TurnToHelper.replaceNull(billingAddress.getFirstName(), ""));
			fileWriter.write("\t");
		
			//LASTNAME
			fileWriter.write(TurnToHelper.replaceNull(billingAddress.getLastName(), ""));
			fileWriter.write("\t");
		
			//SKU
			fileWriter.write(TurnToHelper.replaceNull(product.getID(), ""));
			fileWriter.write("\t");
		
			//PRICE
			fileWriter.write(productLineItem.getAdjustedNetPrice().getValue().toString());
			fileWriter.write("\t");
		
			//ITEMIMAGEURL
			var image : MediaFile = product.getImage("large", 0);
			if (image == null){
				image = product.getImage("medium", 0);
			}
			if (image == null){
				image = product.getImage("small", 0);
			}
			if (image == null){
				image = product.getImage("swatch", 0);
			}
		
			if (image != null) {
				fileWriter.write(image.getAbsURL().toString());
			}
			fileWriter.write("\t");
		
			//TEASERSHOWN
			fileWriter.write("\t");
		
			//TEASERCLICKED
			fileWriter.write("\t");
		
			//DELIVERYDATE
			var shipment = productLineItem.getShipment();
			if (shipment) {
				var deliveryDate : Date = shipment.getCreationDate();
				var deliveryDateString = dw.util.StringUtils.formatCalendar(new Calendar(deliveryDate), "yyyy-MM-dd hh:mm:ss");
				fileWriter.write(deliveryDateString);
			}
			fileWriter.write("\t");
		
			//NICKNAME
			fileWriter.write("\t");
		
			//LOCALE
			fileWriter.write(currentLocale);
		
			fileWriter.write("\n");
		}
		return;
	}
}

module.exports = OrderWriterHelper;
