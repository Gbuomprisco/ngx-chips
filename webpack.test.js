const path = require('path');
const ROOT = path.resolve(__dirname, '.');
const root = path.join.bind(path, ROOT);

module.exports = {
    devtool: 'cheap-module-source-map',

    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            'modules': root('modules'),
            'core': root('modules/core'),
            'components': root('modules/components'),
            'styles': root('modules/core/styles'),
            'pipes': root('modules/core/pipes'),
            'helpers': root('modules/core/helpers'),

            'tag-input': root('modules/components/tag-input'),
            'dropdown': root('modules/components/dropdown'),
            'icon': root('modules/components/icon'),
            'tag': root('modules/components/tag'),
            'tag-input-form': root('modules/components/tag-input-form'),
        }
    },

    module: {
        rules: [
            {
                enforce: 'post',
                test: /\.ts/,
                include: path.resolve(__dirname, 'modules'),
                exclude: [
                    /\.(e2e|spec)\.ts$/,
                    /tests/,
                    /node_modules/
                ],
                loader: 'istanbul-instrumenter-loader',
                query: {
                    esModules: true
                }
            },
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
                test: /\.css$/,
                loader: 'css-loader'
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            },
            {
                test: /\.scss$/,
                loaders: ['raw-loader', "sass-loader"]
            }
        ]
    }
};
