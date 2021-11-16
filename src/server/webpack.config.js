const webpack = require('webpack');
const path = require('path');
const resolve = require('path').resolve;

const config = {
  mode: 'development',
  target: "node",
  devtool: 'eval-source-map',
  output:{
    path: resolve('./dist/'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js','.jsx']
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
};

module.exports = config;
