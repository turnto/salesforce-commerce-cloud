/**
 * ImportAverageRatings.js
 *
 * The script imports product average star ratings from a TurnTo feed
 * 
 * Job Parameters:
 *   ImportFileName : String File name of the file to be imported from TurnTo
 *   IsDisabled : Boolean Mark the step as disabled. This will skip the step and returns a OK status
 */

/* API Includes */
var File = require('dw/io/File');
var FileReader = require('dw/io/FileReader');
var XMLStreamReader = require('dw/io/XMLStreamReader');
var XMLStreamConstants = require('dw/io/XMLStreamConstants');
var ProductMgr = require('dw/catalog/ProductMgr');
var Logger = require('dw/system/Logger');
var txn = require('dw/system/Transaction');
var Status = require('dw/system/Status');

/*Script Modules*/
var TurnToHelper = require('*/cartridge/scripts/util/HelperUtil');

/**
 * @function
 * @name run
 * @description The main function.
 * @returns {dw.system.Status} The exit status for the job step
 */
var run = function run() {

	try {
		var args = arguments[0];
		var error = false;
		if (args.IsDisabled) {
			return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
		}

		// Load input Parameters
		var importFileName = args.ImportFileName;

		// Test mandatory parameters
		if (empty(importFileName)) {
			return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing. Import File Name = (' + importFileName + ')');
		}

		//loop through all allowed locales per site
		for each(var currentLocale in TurnToHelper.getAllowedLocales()) {

			try {
				var importfile : File = new File(File.IMPEX + File.SEPARATOR + "TurnTo" + File.SEPARATOR + currentLocale + File.SEPARATOR + importFileName);//"turnto-skuaveragerating.xml");
				
				if (!importfile.exists()) {
					throw new Error('FAILED: File not found. File Name: ' + importfile.fullPath);
				}
	
				//set the request to the current locale so localized attributes will be used
				request.setLocale(currentLocale);
	
				var fileReader : FileReader = new FileReader(importfile, "UTF-8");
				var xmlStreamReader : XMLStreamReader = new XMLStreamReader(fileReader);
	
				while (xmlStreamReader.hasNext()) {
					if (xmlStreamReader.next() == XMLStreamConstants.START_ELEMENT) {
						var localElementName : String = xmlStreamReader.getLocalName();
						if (localElementName == "product") {
							try {
								var productNode : XML = xmlStreamReader.readXMLObject();
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
								
									txn.begin();
	
									product.custom.turntoAverageRating = rating;
									product.custom.turntoReviewCount = reviewCount;
									product.custom.turntoRelatedReviewCount = reviewCount;
									product.custom.turntoCommentCount = commentCount;
	
									txn.commit();
								} catch ( e ) {
									error = true;
									Logger.error('Product SKU {0} failed to update due to {1}', product.ID, e.message);
								}
	
							}
						}
					}
				}
			} finally {
				if (xmlStreamReader != null) {
					xmlStreamReader.close();
				}
				if (fileReader != null) {
					fileReader.close();
				}
			}
		}
	} catch(exception) {
		return new Status(Status.ERROR, 'ERROR', 'FAILED An exception occurred while attempting to import average ratings. Error message: ' + exception.message);
	} finally {
		//check all readers are closed in case catch block is hit
		if (xmlStreamReader != null) {
			xmlStreamReader.close();
		}
		if (fileReader != null) {
			fileReader.close();
		}
	}
	if (error) {
		return new Status(Status.ERROR, 'ERROR', 'FAILED An exception occurred while attempting to import ONE or MORE average ratings, please see prior error messages for details of individual product update errors.');
	} else {
		return new Status(Status.OK, 'OK', 'Import Average Ratings was successful.');
	}
}

exports.Run = run;
