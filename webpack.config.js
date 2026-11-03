import path from 'path';
import { merge } from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const baseConfig = {
    entry: path.resolve(import.meta.dirname, './src/index.js'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|ico|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name][ext]'
                }
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.json'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(import.meta.dirname, './dist'),
        assetModuleFilename: 'assets/[name][ext]',
    },
    plugins: [
        new DotenvWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(import.meta.dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'src/assets',
                    to: 'assets',
                },
                {
                    from: 'src/assets/favicon.ico',
                    to: 'favicon.ico',
                },
            ],
        }),
    ],
};

export default async ({ mode }) => {
    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode
        ? (await import('./webpack.prod.config.js')).default
        : (await import('./webpack.dev.config.js')).default;

    return merge(baseConfig, envConfig);
};
