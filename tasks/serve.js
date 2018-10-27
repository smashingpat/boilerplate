const app = require('connect')();
const server = require('http').createServer(app);
const rimraf = require('rimraf');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { createWebpackConfig } = require('./webpack/webpack.config');
const logger = require('./logger');
const options = require('./options');

const PORT = 3000;

Promise.resolve()
    .then(() => new Promise((resolve, reject) => {
        rimraf(options.destinationPath, e => e ? reject(e) : resolve());
    }))
    .then(() => new Promise((resolve) => {                
        const webpackConfig = createWebpackConfig({
            hmr: true,
            mode: 'development',
            useSourcemaps: true,
        });
        const compiler = webpack(webpackConfig);

        compiler.hooks.compile.tap('dev-server', () => logger.info('bundling'));
        compiler.hooks.done.tap('dev-server', () => logger.info('done bundling'));
        
        app.use(webpackDevMiddleware(compiler, {
            publicPath: webpackConfig.output.publicPath,
            stats: 'errors-only',
            logLevel: 'error',
            logger: {
                // setting all log functions to noop except
                // the error as that is all we mostly care about
                info: () => { /* noop */ },
                warn: () => { /* noop */ },
                error: logger.error,
            },
        }));
        app.use(webpackHotMiddleware(compiler, {
            log: false,
        }));
        
        server.listen(PORT, () => {
            logger.log(`listening at :${PORT}`);
            resolve();
        });
    }))
    .catch((err) => {
        logger.error(err);
        process.exit(1);
    });
