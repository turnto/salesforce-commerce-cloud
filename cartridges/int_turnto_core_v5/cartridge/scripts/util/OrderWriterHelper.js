/*
 * Order Helper to write order and product data
 * 
 */
 
var Site = require('dw/system/Site');
var FileWriter = require('dw/io/FileWriter');
var URLUtils = require('dw/web/URLUtils');
var Order = require('dw/order/Order');
var Product = require('dw/catalog/Product');
var Calendar = require('dw/util/Calendar');

/*Script Modules*/
var TurnToHelper = require('*/cartridge/scripts/util/TurnToHelperUtil');

var OrderWriterHelper = {
		
	/**
	 * @function
	 * @name getLocalizedTurnToPreferenceValue
	 * @param preferenceName The name of the localized TurnTo SitePreference to retrieve
	 * @param locale The locale in which to retrieve a value. If not matching locale is returned, the default is used
	 * @return {String} The localized value of the Site Preference specified by the preferenceName parameter
	 */
	writeOrderData: function( order, fileWriter, currentLocale) {

		// Get all of the product line items for the order
		var products : Collection = order.getAllProductLineItems();
		
		var useVariants : Boolean = Site.getCurrent().getCustomPreferenceValue('turntoUseVariants') == true;
		
		// boolean for whether all items in the order have shipped yet - constant ORDER_STATUS_COMPLETED equals 5
		// https://documentation.b2c.commercecloud.salesforce.com/DOC3/index.jsp?topic=%2Fcom.demandware.dochelp%2FDWAPI%2Fscriptapi%2Fhtml%2Fapi%2Fclass_dw_order_Order.html
		var allItemsShipped : Boolean = (order.getStatus() == 5)
		
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
			// Only write DELIVERYDATE if the item has a shipment, and the whole order has shipped
			if (shipment && allItemsShipped) {
				var deliveryDate : Date = shipment.getCreationDate();
				var deliveryDateString = dw.util.StringUtils.formatCalendar(new Calendar(deliveryDate), "yyyy-MM-dd hh:mm:ss");
				fileWriter.write(deliveryDateString);
			} else {
			// TurnTo v4.3 default behavior is to set DELIVERY_DATE value equal to the value for PURCHASE_DATE if no DELIVERY_DATE
			// value is present. As such, if the order has not been shipped, we actually want to set DELIVERY_DATE super far out
			// so the client doesn't receive an RSE for an order that hasn't shipped yet
				fileWriter.write("2200-01-01 00:00:00"); // Set ~80 years out
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

