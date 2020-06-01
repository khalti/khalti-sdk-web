"use strict";

const path = require("path");
const webpack = require("webpack");
const projectRoot = path.dirname(__dirname);
const CDN_URL = process.env.CDN_URL
const CDN_HOST = CDN_URL || "https://cdn.jsdelivr.net/npm/khalti-checkout-web@latest/public"

console.log(CDN_HOST);

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
          // publicPath: path.join(projectRoot, "dist"),
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      CDN_HOST: CDN_HOST
    })
  ]
};
