/**
 * ExportHistoricalOrders.js
 *
 * The script exports order data to the Import/Export folder (impex) 
 */

/**
 * Main function of the script.
 */
function execute(args) {	
	try {
   		exportHistoricalOrders();
   	}
   	catch(e) {
   		var ex = e;
   		return PIPELET_ERROR;	
   	}
   	
	return PIPELET_NEXT;
}

function exportHistoricalOrders() {
	var Site = require('dw/system/Site');
	var File = require('dw/io/File');
	var FileWriter = require('dw/io/FileWriter');
	var URLUtils = require('dw/web/URLUtils');
	var Collection = require('dw/util/Collection');
	var SeekableIterator = require('dw/util/SeekableIterator');
	var OrderMgr = require('dw/order/OrderMgr');
	var Order = require('dw/order/Order');
	var Calendar = require('dw/util/Calendar');
	var Product = require('dw/catalog/Product');
	var HTTPClient = require('dw/net/HTTPClient');
	var HTTPRequestPart = require('dw/net/HTTPRequestPart');
	var Logger = require('dw/system/Logger');
	
	
	var turntoUrl:String= Site.getCurrent().getCustomPreferenceValue('turntoURL');
   	var siteKey:String= Site.getCurrent().getCustomPreferenceValue('turntoSiteKey');
   	var authKey:String = Site.getCurrent().getCustomPreferenceValue('turntoAuthKey');
	
	var timeoutMs : Integer = Site.getCurrent().getCustomPreferenceValue('turntoTimeout');
	var historicalOrderDays : Integer = Site.getCurrent().getCustomPreferenceValue('turntoHistoricalOrderDays');
	
	// Get the file path where the output will be stored
	var impexPath : String = File.getRootDirectory(File.IMPEX).getFullPath();
	// Create a TurnTo directory if one doesn't already exist
	var turntoDir : File = new File(impexPath + "/TurnTo");
	if (!turntoDir.exists()) {
		turntoDir.mkdir();
	}
	
	 // Initialize a file writer for output
    var orderExport : File = new File(turntoDir.getFullPath() + "/exportOrders.txt")
	var fileWriter : FileWriter = new FileWriter(orderExport);
    try {
    	fileWriter.writeLine("ORDERID\tORDERDATE\tEMAIL\tITEMTITLE\tITEMURL\tITEMLINEID\tZIP\tFIRSTNAME\tLASTNAME\tSKU\tPRICE\tITEMIMAGEURL\tTEASERSHOWN\tTEASERCLICKED\tDELIVERYDATE\tNICKNAME\tLOCALE");	    	
		var dateLimit = new Calendar();
		dateLimit.add(Calendar.DAY_OF_YEAR, historicalOrderDays*-1);
		var orders : SeekableIterator =  OrderMgr.queryOrders("UUID like '*' AND creationDate >= " + dw.util.StringUtils.formatCalendar(dateLimit, "yyyy-MM-dd"), "creationDate");
		//var orders : SeekableIterator =  OrderMgr.queryOrders("UUID like '*'", "creationDate");					
		
		try {				
			while (orders.hasNext()) {	
				var order : Order = orders.next();
				
				// Get all of the product line items for the order
				var products : Collection = order.getAllProductLineItems();		
				
				for (var i : Number = 0; i < products.size(); i++) {
					var productLineItem : ProductLineItem = products[i];
					var product : Product = productLineItem.getProduct();
					if (product == null){
						continue;
					}
					
					if (product.isVariant()) {
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
					fileWriter.write(replaceNull(product.getName(), ""));
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
					fileWriter.write(replaceNull(billingAddress.getFirstName(), ""));
					fileWriter.write("\t");
					
					//LASTNAME
					fileWriter.write(replaceNull(billingAddress.getLastName(), ""));
					fileWriter.write("\t");
					
					//SKU
					fileWriter.write(replaceNull(product.getID(), ""));
					fileWriter.write("\t");				
					
					//PRICE
					fileWriter.write(productLineItem.getAdjustedNetPrice().getValue().toString());
					fileWriter.write("\t");
					
					//ITEMIMAGEURL				
					var image : MediaFile = product.getImage("large");
					if (image == null){
						image = product.getImage("medium");
					}
					if (image == null){
						image = product.getImage("small");
					}
					if (image == null){
						image = product.getImage("swatch");	
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
					fileWriter.write("\t");
					
					//NICKNAME
					fileWriter.write("\t");
					
					//LOCALE
					if(Site.getCurrent().getDefaultLocale()) {
						fileWriter.write(Site.getCurrent().getDefaultLocale());
					}
					fileWriter.write("\n");
				}
			}	
			fileWriter.close();	
			
			Logger.debug("About to push file to " + turntoUrl + '/feedUpload/postfile');
			
			// Push the new file to turnto.com			
			var file : HTTPRequestPart = new HTTPRequestPart('file', orderExport);		
			var siteKeyPart : HTTPRequestPart = new HTTPRequestPart('siteKey', siteKey);
			var authKeyPart : HTTPRequestPart = new HTTPRequestPart('authKey', authKey);		
			var feedStylePart : HTTPRequestPart = new HTTPRequestPart('feedStyle', 'tab-style.1');
									
			var Service = require('dw/svc/Service');
			var ServiceRegistry = require('dw/svc/ServiceRegistry');
			var svc = 'turnto.http.export.orders.post';
			var service:Service = ServiceRegistry.get(svc);
			service.URL = turntoUrl + '/feedUpload/postfile';
					
			var Result = require('dw/svc/Result');
			var result:Result = service.call([siteKeyPart, authKeyPart, feedStylePart, file]);	
			if (!result.isOk()) {	
				throw new Error("FAILED uploading the orders file to: " + turntoUrl + '/feedUpload/postfile');
			}
		} finally {
			if (orders != null) {
				orders.close();
			}
		}
    } catch(exception) {    	
    	trace("An exception occurred while attempting to export the historical orders.");    	
		throw exception;		    
    } finally {
    	if (fileWriter != null) {
    		fileWriter.close();
    	}
    }
}

/**
 * Replaces null with the specified replacement string.
 * 
 * @param {String} The string to replace if null
 * @param {String} The string to use as a replacement
 *
 * @returns String - replace if str is null, otherwise str
 */
function replaceNull(str, replace){
	return (str != null) ? str : replace;	
}

module.exports = {
	    execute: execute,
	    exportHistoricalOrders: exportHistoricalOrders,
	    replaceNull: replaceNull
	};
