const webpack = require('webpack');
const path = require('path');

const SRC_PATH = path.join(__dirname, '/src');
const DEST_PATH = path.join(__dirname, '/public');

module.exports = {
    mode: 'development',
    context: SRC_PATH,
    entry: ['@babel/polyfill', './index.jsx'],
    output: {
        filename: 'bundle.js',
        path: DEST_PATH
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                include: SRC_PATH,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/preset-react', '@babel/preset-env'],
                },
                resolve: {
                    extensions: ['*','.js','.jsx'],
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader',
            },
            {
                test:/\.(woff|woff2|eot|ttf|otf|png|jpe?g|gif)$/,
                loader: 'file-loader',
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                },
            },
        ],
    },
    watch: true,
};