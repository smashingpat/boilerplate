const rimraf = require('rimraf');
const webpack = require('webpack');
const { createWebpackConfig } = require('./webpack/webpack.config');
const { OUT_PATH } = require('./constants');

Promise.resolve()
    .then(() => new Promise((resolve, reject) => {
        rimraf(OUT_PATH, (err) => {
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
