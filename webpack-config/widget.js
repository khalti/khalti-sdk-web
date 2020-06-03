"use strict";

const path = require("path");
const webpack = require("webpack");
const projectRoot = path.dirname(__dirname);

const CDN_HOST = process.env.CDN_HOST;
const KHALTI_SERVER = process.env.KHALTI_SERVER;
if (!CDN_HOST) {
  console.error('No CDN_HOST PROVIDED');
}

module.exports = {
  mode: 'production',
  entry: path.join(projectRoot, "src/widget/index.js"),
  output: {
    filename: "widget.js",
    path: path.join(projectRoot, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(less)$/,
        use: [
          {
            loader: "style-loader", // creates style nodes from JS strings
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "less-loader", // compiles Less to CSS
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif|eot|ttf|woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: '[name].[ext]',
          publicPath: CDN_HOST,
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      CDN_HOST: CDN_HOST,
      KHALTI_SERVER: KHALTI_SERVER
    })
  ]
};
