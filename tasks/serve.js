const app = require('connect')();
const server = require('http').createServer(app);
const rimraf = require('rimraf');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { createWebpackConfig } = require('./webpack/webpack.config');
const { OUT_PATH } = require('./constants');

Promise.resolve()
    .then(() => new Promise((resolve, reject) => {
        rimraf(OUT_PATH, e => e ? reject(e) : resolve());
    }))
    .then(() => new Promise((resolve) => {        
        const PORT = 3000;
        
        const webpackConfig = createWebpackConfig({
            hmr: true,
            mode: 'development',
        });
        const compiler = webpack(webpackConfig);
        
        app.use(webpackDevMiddleware(compiler, {
            publicPath: webpackConfig.output.publicPath,
            stats: 'errors-only',
            logLevel: 'error',
        }));
        app.use(webpackHotMiddleware(compiler, { log: false }));
        
        server.listen(PORT, () => {
            console.log(`listening at :${PORT}`);
            resolve();
        });
    }));
