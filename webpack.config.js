const webpack = require('webpack');
const path = require('path');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Webpack Config
const webpackConfig = {
    entry: {
        'vendor': [
            '@angular/core',
            '@angular/common',
            "@angular/forms",
            "rxjs/add/operator/debounceTime",
            "rxjs/add/operator/map",
            "rxjs/add/operator/filter"
        ],
        'ng2-tag-input': './modules/ng2-tag-input.module.ts'
    },

    output: {
        path: './dist',
        libraryTarget: "umd",
        library: 'ng2-tag-input'
    },

    externals: {
        "@angular/core": true,
        "@angular/common": true,
        "@angular/forms": true,
        "rxjs/add/operator/debounceTime": true,
        "rxjs/add/operator/map": true,
        "rxjs/add/operator/filter": true
    },

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
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    loaders: ['raw-loader', 'sass-loader']
                })
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
        chunkFilename: '[name].chunk.js'
    },

    module: {
        loaders: [
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
        historyApiFallback: true,
        watchOptions: {aggregateTimeout: 300, poll: 1000}
    },

    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: true,
                    failOnHint: true,
                    resourcePath: 'modules'
                },

                postcss: () => [precss, autoprefixer]
            }
        }),

        new ExtractTextPlugin("styles.css")
    ]
};

const webpackMerge = require('webpack-merge');
module.exports = webpackMerge(defaultConfig, webpackConfig);
