const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
//const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode:'production',
    entry: './src/index.js',
    output:{
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[contenthash].js', 
    },
    
    resolve: {
        extensions:['.js']
    },

    module: {
        rules:[
            //Babel
            {
                test:/\.m?js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader'
                }
            },
            //CSS
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader"
                ],
            },
        ]
    },

    plugins:[
        //HTML
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/index.html',
            filename: './index.html'
        }),
        //Css
        new MiniCssExtractPlugin({
            filename:'assets/[name].[contenthash].css'
        }),
        //Limpieza de archivos en production
        new CleanWebpackPlugin(),
    ],

    optimization: {
        minimize: true,
        minimizer: [
          new CssMinimizerPlugin(),
          new TerserPlugin()
        ]
    }

}
