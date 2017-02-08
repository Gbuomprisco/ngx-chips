const path = require('path');

module.exports = {
    devtool: 'cheap-module-source-map',

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        postLoaders: [{
            enforce: 'post',
            test: /\.ts/,
            include: path.resolve(__dirname, 'modules'),
            exclude: [
                /\.(e2e|spec)\.ts$/,
                /tests/,
                /node_modules/
            ],
            loader: 'istanbul-instrumenter',
            query: {
                esModules: true
            }
        }],
        loaders: [
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
                loader: 'css'
            },
            {
                test: /\.html$/,
                loader: "html"
            },
            {
                test: /\.scss$/,
                loaders: ['raw', "sass"]
            }
        ]
    }
};
