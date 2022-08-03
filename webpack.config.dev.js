const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode:'development',
    //watch: true,
    entry: './src/index.js',
    output:{
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[contenthash].js', 
        //assetModuleFilename:'assets/img/[hash][ext][query]'
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
            filename: 'index.html'
        }),
        //Css
        new MiniCssExtractPlugin({
            filename:'assets/[name].[contenthash].css'
        }),
    ],

    devServer: {
		static: 
        {
            directory: path.join(__dirname, "dist"),
            watch: true,
        },
        watchFiles: path.join(__dirname, "./**"), //observa los cambios en todos nuestros archivos y actualiza el navegador
        compress: true,
        historyApiFallback: true,
        port: 3006,
        open: true, //Hace que se abra en el navegador automaticamente
	}
}