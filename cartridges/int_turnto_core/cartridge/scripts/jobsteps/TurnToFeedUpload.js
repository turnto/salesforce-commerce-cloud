'use strict';

/**
 * Copies files to a remote (S)FTP-Location
 *
 * Job Parameters:
 *
 *   ServiceID: String The service ID to use to connect to the remote server.
 *   PostFileLocation : String location to post file on the SFTP
 *   ExportFileName : String name of the file stored locally
 *   NoFileFoundStatus: String The status to fire when no files are found in the local directory.
 *   IsDisabled : Boolean Mark the step as disabled. This will skip the step and returns a OK status
 */

var Site = require('dw/system/Site');
var File = require('dw/io/File');
var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');

/*Script Modules*/
var TurnToHelper = require('int_turnto_core/cartridge/scripts/util/HelperUtil');
var StepUtil = require('bc_job_components/cartridge/scripts/util/StepUtil');
var FeedUploadService = require('~/cartridge/scripts/service/FeedUploadService');
var ServiceFactory = require('~/cartridge/scripts/util/ServiceFactory');

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

		// Load input Parameters
		var serviceID = args.ServiceID;
		var postFileLocation = args.PostFileLocation;
		var exportFileName = args.ExportFileName;
		var noFilesFoundStatus = args.NoFileFoundStatus;

		// Test mandatory parameters
		if (empty(serviceID) || empty(postFileLocation) || empty(exportFileName)) {
			return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing. Service ID = (' + serviceID + ') Post File Location = (' + postFileLocation + ') Export File Name = (' + exportFileName + ')');
		}

		var turntoUrl = TurnToHelper.getURLSitePreference();

		// Get the file path where the output will be stored
		var impexPath : String = File.getRootDirectory(File.IMPEX).getFullPath();
		// Create a TurnTo directory if one doesn't already exist
		var turntoDir : File = new File(impexPath + "/TurnTo");

		if (!turntoDir.exists()) {
			turntoDir.mkdir();
		}

		//Loop through all allowed locales per site
		for each(var currentLocale in TurnToHelper.getAllowedLocales()) {

			// Initialize a export file
			var exportFile : File = new File(turntoDir.getFullPath() + "/" + currentLocale + '/' + exportFileName + '_' + currentLocale + '_' + Site.getCurrent().ID +'.txt');

			if (!exportFile.exists()) {
				switch (noFilesFoundStatus) {
				case 'ERROR':
					return new Status(Status.ERROR, 'ERROR', 'FAILED No file existed with name: ' + exportFile.name);
				default:
					return new Status(Status.OK, 'NO_FILE_FOUND', 'OK No file existed with name: ' + exportFile.name);
				}
			}

			//Localized siteKey and authKey, need to download per locale, added to the content body of the service request
			var siteKey : String = TurnToHelper.getLocalizedTurnToPreferenceValue('turntoSiteKey', currentLocale);
			var authKey : String = TurnToHelper.getLocalizedTurnToPreferenceValue('turntoAuthKey', currentLocale);

			//If turntoAuthKey and turntoSiteKey values are not defined for a particular locale the job should skip the locale.
			if(empty(siteKey) || empty(authKey)) {
				continue;
			}
			
			//FeedUploadService
			var requestDataContainer = ServiceFactory.buildFeedUploadRequestContainer(postFileLocation, currentLocale, exportFile);
			
			//false is returned if a site or auth key is missing for the current locale
			if(!requestDataContainer) {
				continue;
			}
			
			//call service, returns success or error
			var feedUploadResult = FeedUploadService.call(requestDataContainer);
		
			if (!feedUploadResult.isOk()) {
				return new Status(Status.ERROR, 'ERROR', 'FAILED receiving file with XML file name : ' + xmlName);
			}
		}
	} catch (exception) {
		return new Status(Status.ERROR, 'ERROR', 'FAILED Upload failed with catch block. Error message: ' + exception.message);
	}
	return new Status(Status.OK, 'OK', 'Upload successful.');
};

exports.Run = run;
