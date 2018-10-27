const path = require('path');

module.exports = {
    entryFile: './source/main',
    destinationPath: path.resolve(__dirname, '../_dist'),
    publicPath: '/',
    publicStaticPath: 'static',
    cssModules: false,
};
