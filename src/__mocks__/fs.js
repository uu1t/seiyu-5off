const fs = jest.genMockFromModule('fs');

let dataFiles = {};

fs.__reset = function() {
  dataFiles = {};
};

/**
 * @param {string} filepath
 */
fs.existsSync = function(filepath) {
  return dataFiles.hasOwnProperty(filepath);
};

/**
 * @param {string} filepath
 * @param {any} data
 */
fs.writeFileSync = function(filepath, data) {
  dataFiles[filepath] = data;
};

/**
 * @param {string} filepath
 */
fs.readFileSync = function(filepath) {
  return dataFiles[filepath];
};

module.exports = fs;
