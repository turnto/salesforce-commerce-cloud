/**
 * ImportAverageRatings.js
 *
 * The script imports product average star ratings from a TurnTo feed
 */

/**
 * Main function of the script.
 */
function execute(args) {	
	var Logger = require('dw/system/Logger');
	try {
   		downloadAverageRatings();
		importAverageRatings();
   	}
   	catch(e) {
   		Logger.error('Error occurred:  ' + e.stack + '  Error: ' + e.message );
   		return PIPELET_ERROR;	
   	}
   	
	return PIPELET_NEXT;
}

function downloadAverageRatings() {
	var Site = require('dw/system/Site');
	var File = require('dw/io/File');
	var FileWriter = require('dw/io/FileWriter');
	var ProductMgr = require('dw/catalog/ProductMgr');
	var HTTPClient = require('dw/net/HTTPClient');
	var Logger = require('dw/system/Logger');
	
	var turntoStaticUrl:String= Site.getCurrent().getCustomPreferenceValue('turntoStaticURL');
   	var siteKey:String= Site.getCurrent().getCustomPreferenceValue('turntoSiteKey');
	var authKey:String= Site.getCurrent().getCustomPreferenceValue('turntoAuthKey');  
	
	var timeoutMs : Integer = Site.getCurrent().getCustomPreferenceValue('turntoTimeout');
	
	var url = "http://" + turntoStaticUrl + "/static/export/" + siteKey + "/" + authKey + "/turnto-skuaveragerating.xml";
	var httpClient : HTTPClient = new HTTPClient();
	httpClient.setTimeout(timeoutMs);
	httpClient.open('GET', url);
	
	var file : File = new File(File.IMPEX + File.SEPARATOR + "TurnTo" + File.SEPARATOR + "turnto-skuaveragerating.xml");
	//If the file exists, replace it
	if (file.exists()) {
		file.remove();
	}
	httpClient.sendAndReceiveToFile(file);
	
	if (httpClient.statusCode == 200) {
		Logger.debug("Successfully received average rating file from: " + url);
	} else {
		Logger.debug("FAILED receiving average rating file from: " + url);
		Logger.error("Failed to GET the average rating feed from turnto.com");
		throw exception;
		
	}
}

function importAverageRatings() {
	/* API Includes */
	var File = require('dw/io/File');
	var FileReader = require('dw/io/FileReader');
	var XMLStreamReader = require('dw/io/XMLStreamReader');
	var XMLStreamConstants = require('dw/io/XMLStreamConstants');
	var ProductMgr = require('dw/catalog/ProductMgr');
	var Logger = require('dw/system/Logger');
	
	var file : File = new File(File.IMPEX + File.SEPARATOR + "TurnTo" + File.SEPARATOR + "turnto-skuaveragerating.xml");
	if (!file.exists()) {
		Logger.error("Failed to import the average rating feed from turnto.com. File not found.");
		throw exception;
	}
	
	var fileReader : FileReader = new FileReader(file, "UTF-8");
	var xmlStreamReader : XMLStreamReader = new XMLStreamReader(fileReader);

	while (xmlStreamReader.hasNext()) {
		if (xmlStreamReader.next() == XMLStreamConstants.START_ELEMENT) {
			var localElementName : String = xmlStreamReader.getLocalName();
	     	if (localElementName == "product") {
	     		var productNode : XML = xmlStreamReader.getXMLObject();
	     		var product = ProductMgr.getProduct(productNode.attribute('sku'));
	     		if(product != null) {
	     			var reviewCount = parseInt(productNode.attribute("review_count"));
		     		var relatedReviewCount = parseInt(productNode.attribute("related_review_count"));
		     		var commentCount = parseInt(productNode.attribute("comment_count"));
		     		//Round the rating to the nearest 0.5
		     		var rating = Math.round((parseFloat(productNode.toString()) + 0.25) * 100.0) / 100.0;
		 			rating = rating.toString();
		 			var decimal = parseInt(rating.substring(2, 3))
		 			rating = rating.substring(0, 1) + "." + (decimal >= 5 ? '5' : '0')
	     			product.custom.turntoAverageRating = rating;
	     			product.custom.turntoReviewCount = reviewCount;
	     			product.custom.turntoRelatedReviewCount = reviewCount;
	     			product.custom.turntoCommentCount = commentCount;
	     		}
	     	}
		}
	}
	xmlStreamReader.close();
	fileReader.close();
}

module.exports = {
	    execute: execute,
	    downloadAverageRatings : downloadAverageRatings,
	    importAverageRatings: importAverageRatings
	};
