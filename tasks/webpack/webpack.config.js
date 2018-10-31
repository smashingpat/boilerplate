const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const options = require('../options');

const tests = {
    javascript: /\.js$/,
    typescript: /\.tsx?$/,
    css: /\.css$/,
    sass: /\.scss$/,
    json: /\.json$/,
};

const filterArray = (arr) => arr.filter(v => !!v);

const addStaticPath = (filename) => filterArray([options.publicStaticPath, filename]).join('/');

exports.createWebpackConfig = function createWebpackConfig({
    mode = 'production',
    hmr = false,
    useSourcemaps = false,
}) {
    return {
        devtool: useSourcemaps
            ? mode === 'production'
                ? 'source-map'
                : 'cheap-module-source-map'
            : false,
        performance: {
            hints: false
        },
        optimization: {
            // Always have a name, otherwise we get numbers
            namedChunks: true,
            // Extract the runtime into a separate chunk
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                automaticNameDelimiter: '-'
            },
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    terserOptions: {
                        ecma: 8,
                        mangle: { safari10: true, toplevel: true },
                        compress: { warnings: false, passes: 3, toplevel: true },
                        output: { safari10: true },
                    },
                    sourceMap: true,
                }),
            ],
        },
        entry: filterArray([
            options.entryFile,
            hmr && 'webpack-hot-middleware/client?reload=true',
        ].filter(e => !!e)),
        output: {
            path: options.destinationPath,
            // add hashing to the filename for caching
            // disabled if HMR is enabled
            filename: (!hmr && mode === 'production')
                ? addStaticPath('[name].bundle.[hash].js')
                : addStaticPath('[name].bundle.js'),
            publicPath: options.publicPath,
        },
        mode,
        resolve: {
            plugins: [new TsconfigPathsPlugin()],
            extensions: ['.tsx', '.ts', '.js', '.json'],
        },
        module: {
            rules: [
                {
                    test: tests.typescript,
                    use: {
                        loader: require.resolve('babel-loader'),
                        options: {
                            plugins: filterArray([ hmr && 'react-hot-loader/babel' ]),
                            sourceMap: useSourcemaps,
                        }
                    },
                },
                {
                    test: [tests.css, tests.sass],
                    use: filterArray([
                        hmr && require.resolve('css-hot-loader'),
                        MiniCssExtractPlugin.loader,
                        {
                            loader: require.resolve('css-loader'),
                            options: {
                                sourceMap: useSourcemaps,
                                importLoaders: 2,
                                modules: options.cssModules,
                                camelCase: 'only',
                            },
                        },
                        {
                            loader: require.resolve('postcss-loader'),
                            options: { sourceMap: useSourcemaps },
                        },
                    ]),
                },
                {
                    test: tests.sass,
                    use: {
                        loader: require.resolve('sass-loader'),
                        options: { sourceMap: useSourcemaps },
                    },
                },
                {
                    test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                    loader: require.resolve('url-loader'),
                    options: {
                        limit: 100000
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
                filename: (!hmr && mode === 'production')
                    ? addStaticPath('[name].bundle.[hash].css')
                    : addStaticPath('[name].bundle.css'),
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(mode),
            }),
            new ForkTsCheckerWebpackPlugin({
                tslint: true,
            }),
            hmr && new webpack.HotModuleReplacementPlugin(),
        ]),
    }
}
