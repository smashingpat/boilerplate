const app = require('connect')();
const server = require('http').createServer(app);
const serveStatic = require('serve-static');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const { createWebpackConfig } = require('../webpack/webpack.config');
const findPort = require('../findPort');
const logger = require('../logger');
const options = require('../../options');

module.exports = function createServer() {
    return new Promise(async resolve => {
        const portPromise = findPort(options.defaultPort);
        const webpackConfig = createWebpackConfig({
            hmr: true,
            mode: options.devServerMode,
            useSourcemaps: true,
            publicPath: '/',
        });
        const compiler = webpack(webpackConfig);

        compiler.hooks.compile.tap('dev-server', () =>
            logger.taskPending('webpack-bundle')
        );
        compiler.hooks.done.tap('dev-server', () =>
            logger.taskResolved('webpack-bundle')
        );

        app.use(...options.middleware);
        app.use(serveStatic(options.publicFolderPath));
        app.use(
            webpackDevMiddleware(compiler, {
                publicPath: webpackConfig.output.publicPath,
                stats: 'errors-only',
                logLevel: 'error',
                logger: {
                    // setting all log functions to noop except
                    // the error as that is all we mostly care about
                    info: () => {
                        /* noop */
                    },
                    warn: () => {
                        /* noop */
                    },
                    error: logger.error,
                },
            })
        );
        app.use(
            webpackHotMiddleware(compiler, {
                log: false,
            })
        );

        const port = await portPromise;

        server.listen(port, () => {
            logger.log(`listening at :${port}`);
            resolve();
        });
    });
};
