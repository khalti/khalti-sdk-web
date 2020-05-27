"use strict";
const webpack = require("webpack");
let base = require("./widget.js");

let updates = {
  mode: "development",
  plugins: [
    new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
    DEBUG: true
    })
  ]
};

module.exports = Object.assign(base, updates);
