var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    app: [
      "./public/js/main.js"
    ]
  },
  output: {
    path: __dirname + '/public/build/js/',
    filename: 'main.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: [ 'es2015', 'react' ]
        }
      },
      { test: /\.css$/, loader: ExtractTextPlugin.extract("css-loader") },
      { test: /\.scss$/, loader: ExtractTextPlugin.extract('css!sass') }
    ]
  },
  plugins: [
    new ExtractTextPlugin("../css/main.css", { allChunks: true })
  ],

  // dev server
  devServer: {
    filename: 'main.js',
    publicPath: "/public/build/js/",
    inline: true,
    hot: true
  }
};
