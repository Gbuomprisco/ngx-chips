const webpack = require('webpack');
const path = require('path');
const precss = require('precss');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ROOT = path.resolve(__dirname, '.');
const root = path.join.bind(path, ROOT);
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

const webpackConfig = {
    entry: {
        'ngx-chips': './modules/index.ts'
    },

    output: {
        path: path.resolve('./dist'),
        libraryTarget: "umd",
        library: 'ngx-chips'
    },

    externals: [
      /^@angular\/.*/,
      /^rxjs.*/,
      '@mattlewis92/ng2-material-dropdown'
    ],

    module: {
        rules: [
            // .ts files for TypeScript
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader']
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
        extensions: ['.ts', '.js', '.scss'],
        alias: {
            'styles': root('modules/core/styles'),
            'pipes': root('modules/core/pipes'),
            'helpers': root('modules/core/helpers'),
            'core': root('modules/core'),
            'components': root('modules/components'),
            'tag-input': root('modules/components/tag-input'),
            'dropdown': root('modules/components/dropdown'),
            'icon': root('modules/components/icon'),
            'tag': root('modules/components/tag'),
            'tag-input-form': root('modules/components/tag-input-form'),
        },
        modules: [root('modules'), root('factories'), root('node_modules')],
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

        new ExtractTextPlugin("styles.css"),
        new TsConfigPathsPlugin(),

        new CommonsChunkPlugin({
            name: 'ngx-chips'
        })
    ]
};

const webpackMerge = require('webpack-merge');
module.exports = webpackMerge(defaultConfig, webpackConfig);
