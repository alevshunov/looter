const merge = require('webpack-merge');
const common = require('./webpack.common');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',

    output: {
        filename: '[name].bundle.js'
    },

    devServer: {
        compress: true,
        disableHostCheck: true,
        historyApiFallback: {
            index: common.output.publicPath + 'index.html'
        },
        host: '0.0.0.0',
        port: 11111,
        index: 'index.html',
        hot: true,
        proxy: {
            "/rest/": {
                "target": "http://localhost:9999/"
            }

        }
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin(
            {
                filename: '[name].bundle.css'
            }
        ),
    ],
});