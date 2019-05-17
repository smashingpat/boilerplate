const path = require('path');

module.exports = {
    rootDir: path.resolve(__dirname, '..'),
    // The entry file where it all begins
    entryFile: './source/main',
    // Output path of the build
    destinationPath: path.resolve(__dirname, '../_dist'),
    // Public folder that will eventually copy over to the destination
    publicFolderPath: path.resolve(__dirname, '../public'),
    // Public path where the site will reside, if the site is uploaded to
    // http://awesome.site/foo-bar then this should be set to '/foo-bar'
    publicPath: '/',
    // Where the static files should be placed in
    publicStaticPath: 'static',
    // Enable cssModules as the default
    cssModules: true,
    // default port the dev-server should run
    defaultPort: 3000,
    // what mode the server should run, either development or production
    devServerMode: 'development',
    // additionally middleware that will be placed ontop for the dev-server
    middleware: [
        (req, res, next) => {
            // example middleware, skipping it here
            next();
        },
    ],
};
