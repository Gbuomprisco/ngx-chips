const webpack = require('webpack');
const path = require('path');
const precss       = require('precss');
const autoprefixer = require('autoprefixer');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

// Webpack Config
const webpackConfig = {
    entry: {
        'polyfills': './demo/polyfills.ts',
        'app':       './demo/app.ts'
    },

    output: {
        path: './dist'
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: ['app', 'polyfills'], minChunks: Infinity }),
        new ForkCheckerPlugin()
    ],

    tslint: {
        emitErrors: false,
        failOnHint: false,
        resourcePath: 'demo'
    },

    module: {
        loaders: [
            // .ts files for TypeScript
            {
                test: /\.ts$/,
                loaders: ['angular2-template-loader', 'awesome-typescript-loader']
            },
            {
                test: /\.png/,
                loader: "url-loader",
                query: { mimetype: "image/png" }
            },
            {
                test: /\.html$/,
                loader: "html"
            },
            {
                test: /\.scss$/,
                loaders: ['raw', "postcss", "sass"]
            }
        ]
    },

    postcss: function () {
        return [precss, autoprefixer];
    }
};

// Our Webpack Defaults
var defaultConfig = {
    devtool: 'cheap-module-source-map',
    cache: true,
    debug: true,
    output: {
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },

    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                    // these packages have problems with their sourcemaps
                    path.join(__dirname, 'node_modules', 'rxjs'),
                    path.join(__dirname, 'node_modules', '@angular')
                ]
            }
        ],
        noParse: [
            path.join(__dirname, 'node_modules', 'zone.js', 'dist'),
            path.join(__dirname, 'node_modules', 'angular2', 'bundles')
        ]
    },

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    devServer: {
        clientLogLevel: "info",
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        stats: { colors: true }
    },

    node: {
        global: 1,
        crypto: 'empty',
        module: 0,
        Buffer: 0,
        clearImmediate: 0,
        setImmediate: 0
    }
};

var webpackMerge = require('webpack-merge');
module.exports = webpackMerge(defaultConfig, webpackConfig);
