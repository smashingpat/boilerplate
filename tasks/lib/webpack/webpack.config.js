const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const logger = require('../logger');
const options = require('../../options');

const tests = {
    javascript: /\.js$/,
    typescript: /\.tsx?$/,
    css: /\.css$/,
    sass: /\.scss$/,
    json: /\.json$/,
};

const filterArray = arr => arr.filter(v => !!v);

const addStaticPath = filename =>
    filterArray([options.publicStaticPath, filename]).join('/');

exports.createWebpackConfig = function createWebpackConfig({
    mode = 'production',
    hmr = false,
    publicPath = options.publicPath,
}) {
    const isProduction = mode === 'production';
    const hmrEnabled = !isProduction && hmr;
    return {
        context: options.rootDir,
        devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
        performance: {
            hints: false,
        },
        optimization: {
            // Always have a name, otherwise we get numbers
            namedChunks: true,
            // Extract the runtime into a separate chunk
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                automaticNameDelimiter: '-',
            },
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    terserOptions: {
                        ecma: 8,
                        mangle: { safari10: true, toplevel: true },
                        compress: {
                            warnings: false,
                            passes: 3,
                            toplevel: true,
                        },
                        output: { safari10: true },
                    },
                    sourceMap: true,
                }),
            ],
        },
        entry: filterArray(
            [
                options.entryFile,
                hmrEnabled &&
                    `./${path.relative(
                        options.rootDir,
                        path.resolve(__dirname, './client-hmr.js')
                    )}`,
            ].filter(e => !!e)
        ),
        output: {
            path: options.destinationPath,
            // add hashing to the filename for caching
            // disabled if HMR is enabled
            filename:
                !hmrEnabled && isProduction
                    ? addStaticPath('[name].bundle.[hash].js')
                    : addStaticPath('[name].bundle.js'),
            publicPath,
        },
        mode,
        resolve: {
            plugins: [new TsconfigPathsPlugin()],
            extensions: ['.tsx', '.ts', '.js', '.json'],
            alias: {
                'react-dom': hmrEnabled ? '@hot-loader/react-dom' : 'react-dom',
            },
        },
        module: {
            rules: [
                {
                    test: [tests.typescript, tests.javascript],
                    exclude: /node_modules/,
                    use: {
                        loader: require.resolve('babel-loader'),
                        options: {
                            plugins: filterArray([
                                hmrEnabled && 'react-hot-loader/babel',
                            ]),
                            sourceMap: true,
                        },
                    },
                },
                {
                    test: [tests.css, tests.sass],
                    use: filterArray([
                        hmrEnabled && require.resolve('css-hot-loader'),
                        MiniCssExtractPlugin.loader,
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                sourceMap: true,
                                importLoaders: 2,
                                modules: options.cssModules || undefined,
                                camelCase: 'only',
                                localIdentName: isProduction
                                    ? '[hash:base64:5]'
                                    : '[path][name]__[local]',
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: { sourceMap: true },
                        },
                    ]),
                },
                {
                    test: tests.sass,
                    use: {
                        loader: require.resolve('sass-loader'),
                        options: { sourceMap: true },
                    },
                },
                {
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 100000,
                    },
                },
            ],
        },
        plugins: filterArray([
            new HtmlWebpackPlugin({
                template: './source/shell.html',
            }),
            new MiniCssExtractPlugin({
                // add hashing to the filename for caching
                // disabled if HMR is enabled
                filename:
                    !hmr && isProduction
                        ? addStaticPath('[name].bundle.[hash].css')
                        : addStaticPath('[name].bundle.css'),
            }),
            isProduction && new OptimizeCssAssetsPlugin({}),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode),
            }),
            new ForkTsCheckerWebpackPlugin({
                tslint: false,
                logger: {
                    info() {
                        /* noop */
                    },
                    warn: logger.warn,
                    error: logger.error,
                },
            }),
            hmrEnabled && new webpack.HotModuleReplacementPlugin(),
        ]),
    };
};
