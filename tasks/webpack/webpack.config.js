const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ENTRY_PATH, OUT_PATH, PUBLIC_PATH, PUBLIC_STATIC_PATH } = require('../constants');

const tests = {
    javascript: /\.js$/,
    typescript: /\.tsx?$/,
    css: /\.css$/,
    sass: /\.scss$/,
    json: /\.json$/,
};

const filterArray = (arr) => arr.filter(v => !!v);

const addStaticPath = (filename) => filterArray([PUBLIC_STATIC_PATH, filename]).join('/');

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
        entry: filterArray([
            ENTRY_PATH,
            'webpack-hot-middleware/client?reload=true',
        ]),
        output: {
            path: OUT_PATH,
            // add hashing to the filename for caching
            // disabled if HMR is enabled
            filename: (!hmr && mode === 'production')
                ? addStaticPath('[name].bundle.[hash].js')
                : addStaticPath('[name].bundle.js'),
            publicPath: PUBLIC_PATH,
        },
        mode,
        resolve: {
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
                                importLoaders: 1,
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
            hmr && new webpack.HotModuleReplacementPlugin(),
        ]),
    }
}
