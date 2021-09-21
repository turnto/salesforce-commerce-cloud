'use strict';

/**
 * Copies files to a remote (S)FTP-Location
 *
 * Job Parameters:
 *
 *   ServiceID: String The service ID to use to connect to the remote server.
 *   PostFileLocation : String location to post file on the SFTP
 *   FilePattern : String regular Expression of Files to Upload
 *   NoFileFoundStatus: String The status to fire when no files are found in the local directory.
 *   IsDisabled : Boolean Mark the step as disabled. This will skip the step and returns a OK status
 */

var File = require('dw/io/File');
var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');

/* Script Modules */
var TurnToHelper = require('*/cartridge/scripts/util/turnToHelperUtil');
var FeedUploadService = require('*/cartridge/scripts/service/feedUploadService');
var ServiceFactory = require('*/cartridge/scripts/util/serviceFactory');

/**
 * @function
 * @name run
 * @description The main function.
 * @returns {dw.system.Status} The exit status for the job step
 */
var run = function run() {
    try {
        var args = arguments[0];

        if (args.IsDisabled) {
            return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
        }

        // Load input Parameters
        var serviceID = args.ServiceID;
        var postFileLocation = args.PostFileLocation;
        var filePattern = args.FilePattern;
        var noFilesFoundStatus = args.NoFileFoundStatus;
        var logging = args.isLoggingEnable;

        // Test mandatory parameters
        if (empty(serviceID) || empty(postFileLocation) || empty(filePattern)) {
            return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing. Service ID = (' + serviceID + ') Post File Location = (' + postFileLocation + ') FilePattern = (' + filePattern + ')');
        }

        // Get the file path where the output will be stored
        var impexPath = File.getRootDirectory(File.IMPEX).getFullPath();
        // Create a TurnTo directory if one doesn't already exist
        var turntoDir = new File(impexPath + File.SEPARATOR + 'TurnTo');

        if (!turntoDir.exists()) {
            turntoDir.mkdirs();
        }

        // Retrieve HashMap of Keys which contain auth and site keys
        var siteAndAuthKeys = TurnToHelper.getHashMapOfKeys();

        // Loop through all allowed locales per site
        var allowedLocales = TurnToHelper.getAllowedLocales();
        for (var i = 0; i < allowedLocales.length; i++) {
            var locale = allowedLocales[i];
            // List all files in the specific locale folder
            var exportFiles = new File(turntoDir.getFullPath() + File.SEPARATOR + locale);
            exportFiles = exportFiles.listFiles();

            // If no files are found, go to the next locale
            if (exportFiles) {
                // filter out files which match the file pattern
                var filteredExportFiles = exportFiles.clone();
                for (var k = 0; k < exportFiles.size(); k++) {
                    var file = exportFiles[k];
                    if (file.getName().match(filePattern) == null) {
                        filteredExportFiles.remove(file);
                    } else {
                        // Localized siteKey and authKey, need to download per locale, added to the content body of the service request
                        var ttSiteSet = siteAndAuthKeys.entrySet();
                        var siteKey = null;
                        var authKey = null;
                        var domain = null;
                        for (var ls = 0; ls < ttSiteSet.size(); ls++) {
                            if (ttSiteSet[ls].value.locales.indexOf(locale) > -1) {
                                siteKey = JSON.parse(ttSiteSet[ls].key);
                                authKey = ttSiteSet[ls].value.authKey;
                                domain = 'www.' + ttSiteSet[ls].value.domain;
                                break;
                            }
                        }

                        // If turntoAuthKey and turntoSiteKey values are not defined for a particular locale the job should skip the locale.
                        if (empty(siteKey) || empty(authKey) || empty(domain)) {
                            Logger.error('FAILED Site and/or Auth key or domain is missing: Site Key -> ' + siteKey + ' Auth Key -> ' + authKey + ' Export File Name -> ' + file.name + ' domain -> ' + domain);
                        } else {
                            // feedUploadService
                            var requestDataContainer = ServiceFactory.buildFeedUploadRequestContainer(postFileLocation, file, siteKey, authKey, domain);
                            if (logging) {
                                Logger.info('Post file location: ' + postFileLocation);
                                Logger.info('Export file: ' + file);
                            }

                            // call service, returns success or error
                            var feedUploadResult = FeedUploadService.call(requestDataContainer);

                            if (feedUploadResult.error) {
                                Logger.error('Feed upload service error: ' + feedUploadResult.error + ' ' + feedUploadResult.errorMessage);
                            }

                            if (feedUploadResult.isOk()) {
                                // Archive file
                                var archiveFile = new File(turntoDir.fullPath + File.SEPARATOR + 'Archive');

                                if (!archiveFile.exists()) {
                                    archiveFile.mkdirs();
                                }
                                var theArchiveFile = new File(archiveFile.fullPath + File.SEPARATOR + file.getName());
                                file.renameTo(theArchiveFile);
                            } else {
                                return new Status(Status.ERROR, 'ERROR', 'FAILED uploading file with XML file name : ' + file.fullPath + '\nerror:' + feedUploadResult.errorMessage);
                            }
                        }
                    }
                }

                if (filteredExportFiles.size() === 0) {
                    if (noFilesFoundStatus === 'ERROR') {
                        return new Status(Status.ERROR, 'ERROR', 'FAILED No files existed with file pattern: ' + filePattern);
                    }
                }
            }
        }
    } catch (exception) {
        return new Status(Status.ERROR, 'ERROR', 'FAILED Upload failed with catch block. Error message: ' + exception.message);
    }
    return new Status(Status.OK, 'OK', 'Upload successful.');
};

exports.Run = run;
