"use strict";
const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
let base = require("./widget.js");

let updates = {
  mode: "development",
  devServer: {
    port: 8888
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      CDN_HOST: process.env.CDN_HOST,
      KHALTI_SERVER: process.env.KHALTI_SERVER,
      DEBUG: true
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ]
};

module.exports = Object.assign(base, updates);
