"use strict"

const webpack = require("webpack");
const path  = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackNotifierPlugin = require('webpack-notifier');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const http_host = process.env.HTTP_HOST;
const projectRoot = __dirname

module.exports = {
  devtool: "source-map",
  target: 'web',
	resolve: {
		modules: [path.join(projectRoot, "src"), path.join(projectRoot, "node_modules")]
	},
  entry: path.join(projectRoot, 'src/index.js'),
  output: {
    path: path.join(projectRoot, 'dist/'),
    filename: 'khalti-checkout.js',
    // library: 'KhaltiWidget',
    libraryTarget: 'var'
  },
  module: {
    loaders: [
      {test: /\.js/, loader: "babel-loader"}
    ]
  },
  plugins: [
		new webpack.DefinePlugin({
			__HTTP_HOST__: JSON.stringify(`${http_host}`),
			__NODE_ENV__: JSON.stringify("development")
		}),
		new WebpackNotifierPlugin({alwaysNotify: true}),
		new UglifyJSPlugin()
  ]
};
