/**
 * ImportUserGeneratedContent.js
 *
 * The script imports user generated content for products from a TurnTo feed
 */

/**
 * Main function of the script.
 */
function execute(args) {	
	var Logger = require('dw/system/Logger');
	try {
   		downloadUserGeneratedContent();
		importUserGeneratedContent();
   	}
   	catch(e) {
   		var ex = e;
   		Logger.error('Error occurred:  ' + e.stack + '  Error: ' + e.message );
   		return PIPELET_ERROR;	
   	}
   	
	return PIPELET_NEXT;
}

function downloadUserGeneratedContent() {
	var Site = require('dw/system/Site');
	var File = require('dw/io/File');
	var FileWriter = require('dw/io/FileWriter');
	var HTTPClient = require('dw/net/HTTPClient');
	var Logger = require('dw/system/Logger');
	
	var turntoStaticUrl:String= Site.getCurrent().getCustomPreferenceValue('turntoStaticURL');
   	var siteKey:String= Site.getCurrent().getCustomPreferenceValue('turntoSiteKey');
	var authKey:String= Site.getCurrent().getCustomPreferenceValue('turntoAuthKey');  
	
	var timeoutMs : Integer = Site.getCurrent().getCustomPreferenceValue('turntoTimeout');
	
	var url = "http://" + turntoStaticUrl + "/static/export/" + siteKey + "/" + authKey + "/turnto-ugc.xml";
	var httpClient : HTTPClient = new HTTPClient();
	httpClient.setTimeout(timeoutMs);
	httpClient.open('GET', url);
	
	var file : File = new File(File.IMPEX + File.SEPARATOR + "TurnTo" + File.SEPARATOR + "turnto-ugc.xml");
	//If the file exists, replace it
	if (file.exists()) {
		file.remove();
	}
	httpClient.sendAndReceiveToFile(file);
	
	if (httpClient.statusCode == 200) {
		Logger.debug("Successfully received user generated content file from: " + url);
	} else {
		Logger.debug("FAILED receiving user generated content file from: " + url);
		Logger.error("Failed to GET the user generated content feed from turnto.com");
		throw exception;
		
	}
}

function importUserGeneratedContent() {
	/* API Includes */
	var File = require('dw/io/File');
	var FileReader = require('dw/io/FileReader');
	var XMLStreamReader = require('dw/io/XMLStreamReader');
	var XMLStreamConstants = require('dw/io/XMLStreamConstants');
	var ProductMgr = require('dw/catalog/ProductMgr');
	var Logger = require('dw/system/Logger');
	var HashMap = require('dw/util/HashMap');
	var ArrayList = require('dw/util/ArrayList');
	
	var file : File = new File(File.IMPEX + File.SEPARATOR + "TurnTo" + File.SEPARATOR + "turnto-ugc.xml");
	if (!file.exists()) {
		Logger.error("Failed to import the user generated content feed from turnto.com. File not found.");
		throw exception;
	}
	
	var fileReader : FileReader = new FileReader(file, "UTF-8");
	var xmlStreamReader : XMLStreamReader = new XMLStreamReader(fileReader);

	var contentMap = new HashMap();
	
	while (xmlStreamReader.hasNext()) {
		if (xmlStreamReader.next() == XMLStreamConstants.START_ELEMENT) {
			var localElementName : String = xmlStreamReader.getLocalName();
	     	if (localElementName == "question" || localElementName == "comment" || localElementName == "review") {
		     	var sku = "";
		     	var text = "";
	     		for each(var child : Object in xmlStreamReader.getXMLObject().children()) {
		     		var localName = child.localName().toString();
		     		if(localName == 'item'){
		     			for each(var child2 : Object in child.children()) {
		     				var localName2 = child2.localName().toString();
		     				if(localName2 == 'sku') {
		     					sku = child2.toString();
		     				}
		     			}
		     		} else if (localName == 'text') {
		     			text = child.toString();
		     			if(contentMap.containsKey(sku)) {
		 					var contentValue = contentMap.get(sku) + "\n" + text;
		 					contentMap.put(sku, contentValue);
		 				} else {
		 					contentMap.put(sku, text);
		 				}
		     		}
		     	}
	     	}
		}
	}
	
	var contentIter = contentMap.keySet().iterator();
	while (contentIter.hasNext()) {
		var prodsku = contentIter.next();
		var product = ProductMgr.getProduct(prodsku);
		if(product != null) {
			product.custom.turntoUserGeneratedContent = contentMap.get(prodsku);
		}
	}
		
	xmlStreamReader.close();
	fileReader.close();
}

module.exports = {
	    execute: execute,
	    downloadUserGeneratedContent : downloadUserGeneratedContent,
	    importUserGeneratedContent: importUserGeneratedContent
	};
