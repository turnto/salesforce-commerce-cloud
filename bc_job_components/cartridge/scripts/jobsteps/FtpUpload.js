'use strict';

/**
 * Copies files to a remote (S)FTP-Location
 *
 * Job Parameters:
 *
 *   ServiceID: String The service ID to use to connect to the remote server.
 *   FilePattern: String Input File pattern to search in local folder (default is  "^[\\w\-]{1,}\\.xml$" (*.xml)).
 *   SourceFolder: String Local folder in which will placed files, relatively to IMPEX/.
 *   TargetFolder: String Remote folder of FTP Server.
 *   ArchiveFolder: String Path to the archive folder. If empty, nothing will be done for uploaded files (keep files as is).
 *   NoFileFoundStatus: String The status to fire when no files are found in the local directory.
 */

var File = require('dw/io/File');
var Status = require('dw/system/Status');

var FileHelper = require('~/cartridge/scripts/file/FileHelper');
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
    var sourceFolder = StepUtil.replacePathPlaceholders(args.SourceFolder);
    var targetFolder = StepUtil.replacePathPlaceholders(args.TargetFolder);
    var archiveFolder = StepUtil.replacePathPlaceholders(args.ArchiveFolder);

    // Test mandatory parameters
    if (empty(serviceID) || empty(sourceFolder) || empty(targetFolder)) {
        return new Status(Status.ERROR, 'ERROR', 'One or more mandatory parameters are missing.');
    }

    var serviceClient = ServiceMgr.getFTPService(serviceID);

    var sourceDirStr = File.IMPEX + (sourceFolder.charAt(0).equals(File.SEPARATOR) ? sourceFolder + File.SEPARATOR : File.SEPARATOR + sourceFolder);
    var fileList = FileHelper.getFiles(sourceDirStr, filePattern);
    if (fileList.length === 0) {
        switch (noFilesFoundStatus) {
        case 'ERROR':
            return new Status(Status.ERROR, 'ERROR', 'No files to upload.');
        default:
            return new Status(Status.OK, 'NO_FILE_FOUND', 'No files to upload.');
        }
    }

    // Upload (and archive) files
    serviceClient.uploadFiles(fileList, targetFolder, archiveFolder);

    return new Status(Status.OK, 'OK', 'Upload successful.');
};

exports.Run = run;
