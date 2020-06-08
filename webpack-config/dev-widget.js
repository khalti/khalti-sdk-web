"use strict";
const webpack = require("webpack");
let base = require("./widget.js");

let updates = {
  mode: "development",
  plugins: [
    new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
    CDN_HOST: process.env.CDN_HOST,
    KHALTI_SERVER: process.env.KHALTI_SERVER,
    DEBUG: true
    })
  ]
};

module.exports = Object.assign(base, updates);
