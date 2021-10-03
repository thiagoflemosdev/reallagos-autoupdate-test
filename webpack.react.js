const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals')

module.exports = {
    mode: 'development',
    entry: './src/renderer.tsx',
    // target: 'electron-renderer',
    target: 'web',
    // devtool: 'source-map',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: /src/,
                use: [{ loader: 'ts-loader' }]
            },
            {
                test: /\.s[ac]ss$/i,
                include: /src/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            }
        ]
    },
    output: {
        path: __dirname + '/dist',
        filename: 'renderer.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ],
    // externals : [
    //     nodeExternals()
    // ]
};