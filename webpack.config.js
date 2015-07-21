var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        app: [
            "./client.js"
        ]
    },
    output: {
        path: __dirname + '/public/build/js/',
        filename: 'main.js'
    },
    module: {
        loaders: [
            { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader"},
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            //{ test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') }
        ]
    },
    plugins: [
        new ExtractTextPlugin("../css/main.css", { allChunks: true }),
    ],

    // dev server
    devServer: {
        filename: 'main.js',
        publicPath: "/public/build/js/",
        inline: true,
        hot: true
    }
};