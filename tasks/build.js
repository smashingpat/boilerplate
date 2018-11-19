const yargs = require('yargs');
const rimraf = require('rimraf');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { createWebpackConfig } = require('./webpack/webpack.config');
const options = require('./options');

// set enviroment keys
process.env.NODE_ENV = 'production';

Promise.resolve()
    .then(() => new Promise((resolve, reject) => {
        rimraf(options.destinationPath, (err) => {
            if (err) reject(err);
            resolve();
        })
    }))
    .then(() => new Promise(((resolve) => {
        const webpackConfig = createWebpackConfig({
            mode: 'production',
            useSourcemaps: true,
        });

        const compiler = webpack(webpackConfig);

        // if `--analyze` is set, start analyzing the bundle for sizes
        if (yargs.argv.analyze) {
            new BundleAnalyzerPlugin().apply(compiler);
        }

        compiler.run((err, stats) => {
            if (err) throw err;
            console.log(stats.toString({
                colors: true,
                chunks: false,
            }));
            resolve();
        })
    })))
    .catch((err) => {
        logger.error(err);
        process.exit(1);
    });
