var File = require('dw/io/File');

/**
 * Loads files from a given directory that match the given pattern
 * Non recursive.
 * Throws Exception if directory does not exist.
 *
 * @param {String} directoryPath (Absolute) Directory path to load from
 * @param {String} filePattern RegEx pattern that the filenames must match
 *
 * @returns {Array}
 */
var getFiles = function (directoryPath, filePattern) {
    var directory = new File(directoryPath);

    // We only want existing directories
    if (!directory.isDirectory()) {
        throw new Error('Source folder does not exist.');
    }

    var files = directory.list();

    return files.filter(function (filePath) {
        return empty(filePattern) || (!empty(filePattern) && filePath.match(filePattern) !== null);
    }).map(function (filePath) {
        return directoryPath + File.SEPARATOR + filePath;
    });
};

/**
 * Check if a file with the given {filename} in the given {directoryPath} exists or not
 *
 * @param {String} directoryPath
 * @param {String} filename
 *
 * @returns {Boolean}
 */
var isFileExists = function (directoryPath, filename) {
    var file = new File(directoryPath + File.SEPARATOR + filename);
    return file.exists();
};

/**
 * Create the given {directoryPath} recursively if it does not exists
 *
 * @param {String} directoryPath
 */
var createDirectory = function (directoryPath) {
    var directory = new File(directoryPath);

    if (!directory.exists()) {
        directory.mkdirs();
    }
};

/**
 * Returns the file name of the file from the file path.
 *
 * @param {String} filePath A file path to extract the file name from, e.g. '/directory/file.xml'.
 *
 * @returns {String} The file name e.g. 'file.xml'.
 */
var getFileName = function (filePath) {
    var filePathParts = filePath.split(File.SEPARATOR);
    var fileName = filePathParts[filePathParts.length - 1];
    return fileName;
};

module.exports.createDirectory = createDirectory;
module.exports.getFileName = getFileName;
module.exports.getFiles = getFiles;
module.exports.isFileExists = isFileExists;
