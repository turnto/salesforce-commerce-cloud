'use strict';

/**
 * Downloads files to a local location
 *
 * Job Parameters:
 *
 *   ServiceID: String The service ID to use to connect to the remote server.
 *   XMLName: String name of the XML file to download
 *   NoFileFoundStatus: String The status to fire when no files are found in the local directory.
 *   IsDisabled : Boolean Mark the step as disabled. This will skip the step and returns a OK status
 */

var Site = require('dw/system/Site');
var File = require('dw/io/File');
var Status = require('dw/system/Status');

/*Script Modules*/
var TurnToHelper = require('*/cartridge/scripts/util/HelperUtil');
var StepUtil = require('bc_job_components/cartridge/scripts/util/StepUtil');
var ServiceFactory = require('~/cartridge/scripts/util/ServiceFactory');
var FeedDownloadService = require('~/cartridge/scripts/service/FeedDownloadService');

/**
 * @function
 * @name run
 * @description The main function.
 * @returns {dw.system.Status} The exit status for the job step
 */
var run = function run() {

	try {
		var args = arguments[0];

		if (StepUtil.isDisabled(args)) {
			return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
		}

		//Load input Parameter
		var xmlName = args.XMLName;

		// Test mandatory parameter
		if (empty(xmlName)) {
			return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing. XML Name = (' + xmlName + ')');
		}

		// Get the file path where the output will be stored
		var impexPath : String = File.getRootDirectory(File.IMPEX).getFullPath();
		// Create a TurnTo directory if one doesn't already exist
		var turntoDir : File = new File(impexPath + "/TurnTo");
		if (!turntoDir.exists()) {
			turntoDir.mkdir();
		}

		//Loop through all allowed locales per site
		for each(var currentLocale in TurnToHelper.getAllowedLocales()) {

			//"turnto-skuaveragerating.xml" OR "turnto-ugc.xml"
			var file : File = new File(File.IMPEX + File.SEPARATOR + "TurnTo" + File.SEPARATOR + currentLocale + File.SEPARATOR + xmlName);

			//If the file exists, replace it
			if (file.exists()) {
				file.remove();
			}

			var requestDataContainer = ServiceFactory.buildFeedDownloadRequestContainer(xmlName, currentLocale, file);
			
			//false is returned if a site or auth key is missing for the current locale
			if(!requestDataContainer) {
				continue;
			}
			var feedDownloadResult = FeedDownloadService.call(requestDataContainer);
		
			if (!feedDownloadResult.isOk()) {
				return new Status(Status.ERROR, 'ERROR', 'FAILED receiving file with XML file name : ' + xmlName);
			}
		}
	} catch(exception) {
		var error = exception.message;
		return new Status(Status.ERROR, 'ERROR', 'FAILED Download failed with catch block. Error message: ' + exception.message);
	}
	return new Status(Status.OK, 'OK', 'Download successful.');
};

exports.Run = run;
