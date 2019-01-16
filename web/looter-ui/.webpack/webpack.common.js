const path = require('path');
const webpack = require('webpack');
const package_json = require('../package.json');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;



const appPublicPath = (package_json.app && package_json.app.publicPath) || '/';
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(rootDir, 'build' + appPublicPath);

module.exports = {
    entry: {
        app: path.resolve(rootDir, 'src/index.tsx')
    },

    output: {
        publicPath: appPublicPath,
        path: outputDir
    },

    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js'
        ]
    },
    module: {
        rules: [
            {
                test: [
                    /\.bmp$/,
                    /\.gif$/,
                    /\.jpe?g$/,
                    /\.png$/,
                    /\.svg$/
                ],
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:5].[ext]',
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                        },
                    },
                ],
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader',
                        options: {
                            minimize: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'css-hot-loader'
                    },
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true,
                            sourceMap: true,
                            localIdentName: '[name]__[local]__[hash:base64:5]'
                            // localIdentName: '[local]'
                        },
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin([outputDir], {
            root: rootDir
        }),
        new ForkTsCheckerWebpackPlugin({
            silent: true,
            async: false,
            watch: path.resolve(rootDir, 'src'),
            tsconfig: path.resolve(rootDir, 'tsconfig.json'),
            tslint: path.resolve(rootDir, 'tslint.json')
        }),
        new HtmlWebPackPlugin(
            {
                filename: 'index.html',
                template: path.resolve(rootDir, 'public/index.html'),
                favicon: path.resolve(rootDir, 'public/favicon.ico')
            }
        ),
        new CopyWebpackPlugin([
            { from: 'public/img', to: 'img' },
            { from: 'public/manifest.json', to: '.' },
        ]),
        new webpack.ContextReplacementPlugin(
            /moment[\/\\]locale$/,
            /ru/
        ),
        // new BundleAnalyzerPlugin()
    ],

    optimization: {
        runtimeChunk: {
            name: 'runtime'
        },
        splitChunks: {
            // maxSize: 24000,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    }
};

