"use strict";
const webpack = require("webpack");
let base = require("./widget.js");

let updates = {
  mode: "development",
  plugins: [
    new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
    CDN_HOST: 'localhost:8080',
    DEBUG: true
    })
  ]
};

module.exports = Object.assign(base, updates);
