var webpack = require("webpack");
var path  = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackNotifierPlugin = require('webpack-notifier');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const socketProtocol = process.env.SOCKET_PROTOCOL;
const socketPort = process.env.SOCKET_PORT;
const socketAddress = process.env.SOCKET_ADDRESS;
const http_host = process.env.HTTP_HOST;

const projectRoot = path.dirname(__dirname)

module.exports = {
  devtool: "source-map",
  target: 'web',
	resolve: {
		modules: [path.join(projectRoot, "client"), path.join(projectRoot, "node_modules")]
	},
  entry: path.join(projectRoot, 'client/widget/widgetLoader.js'),
  output: {
    path: path.join(projectRoot, 'assets/'),
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
			__host__: JSON.stringify(
										`${socketProtocol}://${socketAddress}:${socketPort}`),
			__HTTP_HOST__: JSON.stringify(`${http_host}`),
			__NODE_ENV__: JSON.stringify("development")
		}),
		new WebpackNotifierPlugin({alwaysNotify: true}),
		new UglifyJSPlugin()
  ]
};
