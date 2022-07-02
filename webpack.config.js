const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'production',
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
    },
    entry: {
        index: './src/index.ts',
        background: './src/plugins/background.ts',
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: '[name].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            chunks: ['index'],
            inject: 'body',
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    },
                },
            },
        ],
    },
};
