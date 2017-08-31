"use strict"

const path = require("path");

const projectRoot = path.dirname(__dirname);

let baseConfig = require("./base.js");
const updates = {
  output: {
    path: path.join(projectRoot, 'dist/'),
    filename: 'khalti-checkout.js',
    library: 'KhaltiCheckout',
    libraryTarget: 'var'
  }
}

module.exports = Object.assign(baseConfig, updates);
