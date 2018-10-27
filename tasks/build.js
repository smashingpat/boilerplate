const rimraf = require('rimraf');
const webpack = require('webpack');
const { createWebpackConfig } = require('./webpack/webpack.config');
const options = require('./options');

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

        webpack(webpackConfig, (err, stats) => {
            if (err) throw err;
            console.log(stats.toString({
                colors: true,
                chunks: false,
            }));
            resolve();
        });
    })))
    .catch((err) => {
        logger.error(err);
        process.exit(1);
    });
