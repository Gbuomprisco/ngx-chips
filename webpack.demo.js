const webpack = require('webpack');
const path = require('path');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const webpackConfig = {
    entry: {
        'polyfills': './demo/polyfills.ts',
        'app': './demo/app.ts'
    },

    output: {
        path: path.resolve('./dist')
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name: ['app', 'polyfills'], minChunks: Infinity}),
        new ExtractTextPlugin("styles.css"),
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: true,
                    failOnHint: false,
                    resourcePath: './'
                },

                postcss: () => [precss, autoprefixer]
            }
        }),
    ],

    module: {
        rules: [
            // .ts files for TypeScript
            {
                test: /\.ts$/,
                loaders: ['angular2-template-loader', 'awesome-typescript-loader']
            },
            {
                test: /\.png/,
                loader: "url-loader",
                query: {mimetype: "image/png"}
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.(css|scss)$/,
                loaders: ['to-string-loader', 'css-loader', 'sass-loader']
            }
        ]
    }
};

// Our Webpack Defaults
const defaultConfig = {
    devtool: 'cheap-module-source-map',
    cache: true,
    output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },

    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    // these packages have problems with their sourcemaps
                    path.join(__dirname, 'node_modules', 'rxjs'),
                    path.join(__dirname, 'node_modules', '@angular')
                ]
            }
        ]
    },

    resolve: {
        extensions: ['.ts', '.js', '.scss']
    },

    devServer: {
        clientLogLevel: "info",
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        stats: {colors: true}
    }
};

const webpackMerge = require('webpack-merge');
module.exports = webpackMerge(defaultConfig, webpackConfig);
