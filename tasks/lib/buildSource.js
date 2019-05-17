const { ncp } = require('ncp');
const { argv } = require('yargs');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { createWebpackConfig } = require('./webpack/webpack.config');
const options = require('../options');

module.exports = async function buildSource() {
    await new Promise(resolve => {
        const webpackConfig = createWebpackConfig({
            mode: 'production',
        });

        const compiler = webpack(webpackConfig);

        if (argv.analyze) {
            new BundleAnalyzerPlugin().apply(compiler);
        }

        compiler.run((err, stats) => {
            if (err) throw err;
            // eslint-disable-next-line no-console
            console.log(stats.toString('minimal'));
            resolve();
        });
    });
    await new Promise((resolve, reject) => {
        ncp(options.publicFolderPath, options.destinationPath, err => {
            if (err) reject(err);
            resolve();
        });
    });
};
