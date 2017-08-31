"use strict"

const webpack = require("webpack");
const path  = require("path");
const WebpackNotifierPlugin = require('webpack-notifier');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const WIDGET_URL = process.env.WIDGET_URL;
const BUILD_ENV = process.env.BUILD_ENV;
const projectRoot = path.dirname(__dirname);

module.exports = {
	resolve: {
		modules: [path.join(projectRoot, "src"), path.join(projectRoot, "node_modules")]
	},
  entry: path.join(projectRoot, 'src/index.js'),
  module: {
    loaders: [
      {test: /\.js/, loader: "babel-loader"}
    ]
  },
  plugins: [
		new webpack.DefinePlugin({
      __WIDGET_URL__: JSON.stringify(WIDGET_URL),
			__BUILD_ENV__: JSON.stringify(BUILD_ENV)
		}),
		new WebpackNotifierPlugin({alwaysNotify: true}),
		new UglifyJSPlugin()
  ]
};
