const rimraf = require('rimraf');
const options = require('../options');

/**
 * cleans the dist folder
 */
function cleanDist() {
    return new Promise((resolve, reject) => {
        rimraf(options.destinationPath, err => {
            if (err) reject(err);
            resolve();
        });
    });
}

module.exports = cleanDist;
