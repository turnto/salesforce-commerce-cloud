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
	var Logger = require('dw/system/Logger');
	
	var turntoStaticUrl:String= Site.getCurrent().getCustomPreferenceValue('turntoStaticURL');
   	var siteKey:String= Site.getCurrent().getCustomPreferenceValue('turntoSiteKey');
	var authKey:String= Site.getCurrent().getCustomPreferenceValue('turntoAuthKey');  
	
	var url = "http://" + turntoStaticUrl + "/static/export/" + siteKey + "/" + authKey + "/turnto-skuaveragerating.xml";
	
	var HTTPService = require('dw/svc/HTTPService');
	var ServiceRegistry = require('dw/svc/ServiceRegistry');
	var svc = 'turnto.http.import.ratings.get';
	var service:HTTPService = ServiceRegistry.get(svc);
	service.URL = url;
	
	// Get the file path where the output will be stored
	var impexPath : String = File.getRootDirectory(File.IMPEX).getFullPath();
	// Create a TurnTo directory if one doesn't already exist
	var turntoDir : File = new File(impexPath + "/TurnTo");
	if (!turntoDir.exists()) {
		turntoDir.mkdir();
	}
	
	var file : File = new File(File.IMPEX + File.SEPARATOR + "TurnTo" + File.SEPARATOR + "turnto-skuaveragerating.xml");
	//If the file exists, replace it
	if (file.exists()) {
		file.remove();
	}
	service.setOutFile(file);
	
	var Result = require('dw/svc/Result');
	var result:Result = service.call();	
	if (!result.isOk()) {	
		throw new Error("FAILED receiving average rating file from: " + url);
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
		throw new Error('Failed to import the average rating feed from turnto.com. File not found.');
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
