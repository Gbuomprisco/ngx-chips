var webpack = require('webpack');
var path = require('path');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');

// Webpack Config
var webpackConfig = {
    entry: {
        'vendor': ['@angular/core', '@angular/common', "@angular/forms", "rxjs/add/operator/debounceTime"],
        'ng2-tag-input': './modules/ng2-tag-input.module.ts'
    },

    output: {
        path: './dist',
        libraryTarget: "umd",
        library: 'ng2-tag-input',
        umdNamedRequire: true
    },

    externals: {
        "@angular/core": true,
        "@angular/common": true,
        "@angular/forms": true,
        "rxjs/add/operator/debounceTime": true
    },

    plugins: [
        //new webpack.optimize.CommonsChunkPlugin({ name: [], minChunks: Infinity })
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
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
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
        chunkFilename: '[name].chunk.js'
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
        extensions: ['', '.ts', '.js', '.scss']
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
