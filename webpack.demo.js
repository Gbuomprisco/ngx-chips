var webpack = require('webpack');
var path = require('path');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');

// Webpack Config
var webpackConfig = {
    entry: {
        'polyfills': './demo/polyfills.ts',
        'vendor':    './demo/vendor.ts',
        'app':       './demo/app.ts'
    },

    output: {
        path: './dist'
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: ['app', 'vendor', 'polyfills'], minChunks: Infinity })
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
                loader: 'awesome-typescript-loader'
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
                loaders: ["style", "css", "postcss", "sass"]
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
        root: [ path.join(__dirname, 'demo') ],
        extensions: ['', '.ts', '.js'],
        alias: {
            'angular2/testing': path.join(__dirname, 'node_modules', '@angular', 'core', 'testing.js'),
            '@angular/testing': path.join(__dirname, 'node_modules', '@angular', 'core', 'testing.js'),
            'angular2/core': path.join(__dirname, 'node_modules', '@angular', 'core', 'index.js'),
            'angular2/platform/browser': path.join(__dirname, 'node_modules', '@angular', 'platform-browser', 'index.js'),
            'angular2/testing': path.join(__dirname, 'node_modules', '@angular', 'testing', 'index.js'),
            'angular2/router': path.join(__dirname, 'node_modules', '@angular', 'router', 'index.js'),
            'angular2/http': path.join(__dirname, 'node_modules', '@angular', 'http', 'index.js'),
            'angular2/http/testing': path.join(__dirname, 'node_modules', '@angular', 'http', 'testing.js')
        },
    },

    devServer: {
        historyApiFallback: true,
        watchOptions: { aggregateTimeout: 300, poll: 1000 }
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
