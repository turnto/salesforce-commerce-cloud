/**
 * This utility provides a standard implementation of URL friendly base64 encoding.
 * https://brockallen.com/2014/10/17/base64url-encoding/
 */
'use strict';

var StringUtils = require('dw/util/StringUtils');

/**
 * Base64 encodes strings for use on the url
 * @param {string} input - string to encode
 * @returns {string} Base64 encoding and scrubbed for URLs
 */
function encode(input) {
    var output = StringUtils.encodeBase64(input);

    output = output.split('=')[0]; // Remove any trailing '='s
    output = output.replace('+', '-'); // 62nd char of encoding
    output = output.replace('/', '_'); // 63rd char of encoding

    return output;
}

/**
 * Base64 decodes strings
 * @param {string} input - string to decode
 * @returns {string} decoded base64 string
 */
function decode(input) {
    var output = input;

    output = output.replace('-', '+'); // 62nd char of encoding
    output = output.replace('_', '/'); // 63rd char of encoding

    // Pad with trailing '='s
    switch (output.length % 4) {
        case 0:
            break; // No pad chars in this case
        case 2:
            output += '==';
            break; // Two pad chars
        case 3:
            output += '=';
            break; // One pad char
        default:
            throw new Error('Illegal base64url input!');
    }

    var converted = StringUtils.decodeBase64(output); // Standard base64 decoder

    return converted;
}

module.exports = {
    encode: encode,
    decode: decode
};
