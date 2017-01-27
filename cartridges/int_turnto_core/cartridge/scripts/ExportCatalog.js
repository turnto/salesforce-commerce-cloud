/**
 * ExportCatalog.js
 *
 * The script exports catalog data to the Import/Export folder (impex) 
 */

/**
 * Main function of the script.
 */
function execute(args) {	
	try {
   		exportCatalog();
   	}
   	catch(e) {
   		var ex = e;
   		return PIPELET_ERROR;	
   	}
   	
	return PIPELET_NEXT;
}

function exportCatalog() {
	var Site = require('dw/system/Site');
	var File = require('dw/io/File');
	var FileWriter = require('dw/io/FileWriter');
	var Money = require('dw/value/Money');
	var Collection = require('dw/util/Collection');
	var ArrayList = require('dw/util/ArrayList');
	var Set = require('dw/util/Set');
	var HashSet = require('dw/util/HashSet');
	var SeekableIterator = require('dw/util/SeekableIterator');
	var ProductMgr = require('dw/catalog/ProductMgr');
	var URLUtils = require('dw/web/URLUtils');
	var Category = require('dw/catalog/Category');
	var Product = require('dw/catalog/Product');
	var MediaFile = require('dw/content/MediaFile');
	var HTTPClient = require('dw/net/HTTPClient');
	var HTTPRequestPart = require('dw/net/HTTPRequestPart');
	var Logger = require('dw/system/Logger');
	
	var turntoUrl:String= Site.getCurrent().getCustomPreferenceValue('turntoURL');
   	var siteKey:String= Site.getCurrent().getCustomPreferenceValue('turntoSiteKey');
   	var authKey:String = Site.getCurrent().getCustomPreferenceValue('turntoAuthKey');
	
	var timeoutMs : Integer = Site.getCurrent().getCustomPreferenceValue('turntoTimeout');
	
	// Get the file path where the output will be stored
	var impexPath : String = File.getRootDirectory(File.IMPEX).getFullPath();
	// Create a TurnTo directory if one doesn't already exist
	var turntoDir : File = new File(impexPath + "/TurnTo");
	if (!turntoDir.exists()) {
		turntoDir.mkdir();
	}	
	
    // Initialize a file writer for output
    var catalogExport : File = new File(turntoDir.getFullPath() + "/exportCatalog.txt");
    var fileWriter : FileWriter = new FileWriter(catalogExport);
    try {
    	// Write the file header	
    	fileWriter.writeLine("SKU\tIMAGEURL\tTITLE\tPRICE\tCURRENCY\tACTIVE\tITEMURL\tCATEGORY\tKEYWORDS\tINSTOCK\tVIRTUALPARENTCODE\tCATEGORYPATHJSON\tMEMBERS\tBRAND\tMPN\tISBN\tUPC\tEAN\tJAN\tASIN\tMOBILEITEMURL\tLOCALEDATA");	    	
		var products : SeekableIterator =  ProductMgr.queryAllSiteProducts();		
		try {
			while (products.hasNext()) {			 
				var product : Product = products.next();
				
				if (product.isVariant()) {
					continue;
				}
				
				// SKU
				fileWriter.write(replaceNull(product.getID(), ""));
				fileWriter.write("\t");
				
				// IMAGEURL			
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
				
				// TITLE
				fileWriter.write(replaceNull(product.getName(), ""));			
				fileWriter.write("\t");
				
				// PRICE
				var price : Money = product.getPriceModel().getPrice();
				var priceStr : String = price.getValue().toString();
				if (!priceStr.equalsIgnoreCase("N/A")) {
					fileWriter.write(priceStr);
				}
				fileWriter.write("\t");
				
				// CURRENCY
				fileWriter.write(price.getCurrencyCode());
				fileWriter.write("\t");
				
				// ACTIVE
				fileWriter.write("Y");
				fileWriter.write("\t");
				
				// ITEMURL
				fileWriter.write(URLUtils.http('Product-Show', 'pid', product.getID()).toString());			
				fileWriter.write("\t");
				
				// CATEGORY											
				// Leaving blank because CATEGORYPATHJSON is populated								
				fileWriter.write("\t");
				
				// KEYWORDS			
				if (product.getPageKeywords()) {
					fileWriter.write(product.getPageKeywords());
				}
				fileWriter.write("\t");
				
				// INSTOCK			
				if (product.getOnlineFlag()) {
					fileWriter.write("Y");
				} else {
					fileWriter.write("N");
				}
				fileWriter.write("\t");
				
				// VIRTUALPARENTCODE								
				if (product.isMaster()) {
					fileWriter.write(replaceNull(product.getID(), ""));
				}
				fileWriter.write("\t");
				
				// CATEGORYPATHJSON
				if (product.getPrimaryCategory() != null) {
					var primaryCategoryID = product.getPrimaryCategory().getID();
					var currentCategory = product.getPrimaryCategory();
					var categoryArray = new Array();
					while (currentCategory != null && !currentCategory.isRoot()) 
					{
						var categoryjson = {
								id : currentCategory.getID(),
								name : replaceNull(currentCategory.getDisplayName()),
								url : URLUtils.http('Search-Show', 'cgid', currentCategory.getID()).toString()
						}
						categoryArray.push(JSON.stringify(categoryjson));
						currentCategory = currentCategory.getParent();
					}
					categoryArray.reverse();
					fileWriter.write("[" + categoryArray.toString() + "]");
				}
				fileWriter.write("\t");
				
				// MEMBERS			
				var bundledProducts : Collection = product.getBundledProducts();
				for (var i : Number = 0; i < bundledProducts.size(); i++) {
					var subProduct : Product = bundledProducts[i];
					fileWriter.write(subProduct.getID());
					
					if (i+1 < bundledProducts.size()) {
						fileWriter.write(",");
					}	
				}
				fileWriter.write("\t");			
							
				// BRAND
				if (product.getBrand()) {
					fileWriter.write(product.getBrand());
				}
				fileWriter.write("\t");
				
				
				if (product.isMaster()) {
					
					//Comma-separated variants for GTINs
					var mpn = "";
					var isbn = "";
					var upc = "";
					var ean = "";
					var jan = "";
					var asin = "";
					for (var i=0; i<product.variants.length;i++) {
						var variant = product.variants[i];
						// MPN
						if (variant.getManufacturerSKU()) {
							mpn+=variant.getManufacturerSKU();
							if(i != product.variants.length-1) {
								mpn+=",";
							}
						}
						// UPC
						if (variant.getUPC()) {
							upc+=variant.getUPC();
							if(i != product.variants.length-1) {
								upc+=",";
							}
						}
						// EAN
						if (variant.getEAN()) {
							ean+=variant.getEAN();
							if(i != product.variants.length-1) {
								ean+=",";
							}
						}
					}
					
					// MPN
					fileWriter.write(mpn + "\t");
					
					// ISBN
					fileWriter.write(isbn + "\t");
					
					// UPC
					fileWriter.write(upc + "\t");
					
					// EAN
					fileWriter.write(ean + "\t");
					
					// JAN
					fileWriter.write(jan + "\t");
					
					// ASIN
					fileWriter.write(asin + "\t");
				
				} else {
					
					// MPN
					if (product.getManufacturerSKU()) {
						fileWriter.write(product.getManufacturerSKU());
					}
					fileWriter.write("\t");
					
					// ISBN
					fileWriter.write("\t");
					
					// UPC
					if (product.getUPC()) {
						fileWriter.write(product.getUPC());
					}
					fileWriter.write("\t");
					
					// EAN
					if (product.getEAN()) {
						fileWriter.write(product.getEAN());
					}
					fileWriter.write("\t");
					
					// JAN
					fileWriter.write("\t");
					
					//ASIN
					fileWriter.write("\t");
				}
				
				//MOBILEITEMURL
				fileWriter.write(URLUtils.http('Product-Show', 'pid', product.getID()).toString());			
				fileWriter.write("\t");
				
				//LOCALEDATA
				if (Site.getCurrent().getDefaultLocale()) {
					var json = {};
					var localejson = {
						title : replaceNull(product.getName(), ""),
						itemUrl : URLUtils.http('Product-Show', 'pid', product.getID()).toString(),
						mobileItemUrl : URLUtils.http('Product-Show', 'pid', product.getID()).toString()
					};
					json[Site.getCurrent().getDefaultLocale()] = localejson;
					fileWriter.write(JSON.stringify(json));
				}
				fileWriter.write("\n");																				
			}
		} finally {
			if (products != null) {
				products.close();
			}
		}
		
		fileWriter.close();	
		
		Logger.debug("About to push file to " + turntoUrl + '/feedUpload/postfile');
		
		// Push the new file to turnto.com			
		var file : HTTPRequestPart = new HTTPRequestPart('file', catalogExport);		
		var siteKeyPart : HTTPRequestPart = new HTTPRequestPart('siteKey', siteKey);
		var authKeyPart : HTTPRequestPart = new HTTPRequestPart('authKey', authKey);		
		var feedStylePart : HTTPRequestPart = new HTTPRequestPart('feedStyle', 'tab-style.1');
								
		var Service = require('dw/svc/Service');
		var ServiceRegistry = require('dw/svc/ServiceRegistry');
		var svc = 'turnto.http.export.catalog.post';
		var service:Service = ServiceRegistry.get(svc);
		service.URL = turntoUrl + '/feedUpload/postfile';
		
		var Result = require('dw/svc/Result');
		var result:Result = service.call([siteKeyPart, authKeyPart, feedStylePart, file]);	
		if (!result.isOk()) {	
			throw new Error("FAILED uploading the catalog file to: " + turntoUrl + '/feedUpload/postfile');
		}							
    } catch(exception) {    	
    	var ex = exception;
    	trace("An exception occurred while attempting to export the catalog.");
    	throw exception;
		//return PIPELET_ERROR;
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
	    exportCatalog: exportCatalog,
	    replaceNull: replaceNull
	};