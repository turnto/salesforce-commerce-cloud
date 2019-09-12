'use strict';

/**
 * Downloads files from a remote (S)FTP-Location
 *
 * Job Parameters:
 *
 *   ServiceID: String The service ID to use to connect to the remote server.
 *   FilePattern: String Input File pattern to search in remote folder (default is  "^[\\w\-]{1,}\\.xml$" (*.xml)).
 *   SourceFolder: String Remote folder of FTP Server.
 *   TargetFolder: String Local folder in which will placed files, relatively to IMPEX/.
 *   NoFileFoundStatus: String The status to fire when no files are found in the local directory.
 *   DeleteRemoteFiles: Boolean Flag to delete remote files after a successful download.
 */

var Status = require('dw/system/Status');

var ServiceMgr = require('~/cartridge/scripts/services/ServiceMgr');
var StepUtil = require('~/cartridge/scripts/util/StepUtil');

/**
 * The main function.
 *
 * @returns {dw.system.Status} The exit status for the job step
 */
var run = function run() {
    var args = arguments[0];

    if (StepUtil.isDisabled(args)) {
        return new Status(Status.OK, 'OK', 'Step disabled, skip it...');
    }

    // Load input Parameters
    var serviceID = args.ServiceID;
    var filePattern = args.FilePattern;
    var noFilesFoundStatus = args.NoFileFoundStatus;
    var deleteRemoteFiles = args.DeleteRemoteFiles;
    var sourceFolder = StepUtil.replacePathPlaceholders(args.SourceFolder);
    var targetFolder = StepUtil.replacePathPlaceholders(args.TargetFolder);

    // Test mandatory parameters
    if (empty(serviceID) || empty(sourceFolder) || empty(targetFolder)) {
        return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing.');
    }

    var serviceClient = ServiceMgr.getFTPService(serviceID);

    var filePaths = serviceClient.listRemoteFiles(sourceFolder, filePattern);
    if (filePaths.length === 0) {
        switch (noFilesFoundStatus) {
        case 'ERROR':
            return new Status(Status.ERROR, 'ERROR', 'No files to download.');
        default:
            return new Status(Status.OK, 'NO_FILE_FOUND', 'No files to download.');
        }
    }

    // Download (and remove) files
    serviceClient.downloadFiles(filePaths, targetFolder, deleteRemoteFiles);

    return new Status(Status.OK, 'OK', 'Download successful.');
};

exports.Run = run;
