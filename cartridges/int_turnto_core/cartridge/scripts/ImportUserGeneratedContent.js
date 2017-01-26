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
   		Logger.error('Error occurred:  ' + e.stack + '  Error: ' + e.message );
   		return PIPELET_ERROR;	
   	}
   	
	return PIPELET_NEXT;
}

function downloadUserGeneratedContent() {
	var Site = require('dw/system/Site');
	var File = require('dw/io/File');
	var FileWriter = require('dw/io/FileWriter');
	var Logger = require('dw/system/Logger');
	
	var turntoStaticUrl:String= Site.getCurrent().getCustomPreferenceValue('turntoStaticURL');
   	var siteKey:String= Site.getCurrent().getCustomPreferenceValue('turntoSiteKey');
	var authKey:String= Site.getCurrent().getCustomPreferenceValue('turntoAuthKey');  
	
	var url = "http://" + turntoStaticUrl + "/static/export/" + siteKey + "/" + authKey + "/turnto-ugc.xml";
	
	var HTTPService = require('dw/svc/HTTPService');
	var ServiceRegistry = require('dw/svc/ServiceRegistry');
	var svc = 'turnto.http.import.content.get';
	var service:HTTPService = ServiceRegistry.get(svc);
	service.URL = url;
	
	// Get the file path where the output will be stored
	var impexPath : String = File.getRootDirectory(File.IMPEX).getFullPath();
	// Create a TurnTo directory if one doesn't already exist
	var turntoDir : File = new File(impexPath + "/TurnTo");
	if (!turntoDir.exists()) {
		turntoDir.mkdir();
	}
	
	var file : File = new File(File.IMPEX + File.SEPARATOR + "TurnTo" + File.SEPARATOR + "turnto-ugc.xml");
	//If the file exists, replace it
	if (file.exists()) {
		file.remove();
	}
	service.setOutFile(file);
	
	var Result = require('dw/svc/Result');
	var result:Result = service.call();	
	if (!result.isOk()) {	
		throw new Error("FAILED receiving user generated content file from: " + url);
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
		throw new Error("Failed to import the user generated content feed from turnto.com. File not found.");
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
