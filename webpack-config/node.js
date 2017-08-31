"use strict"

const path = require("path");

const projectRoot = path.dirname(__dirname);

let baseConfig = require("./base.js");
const updates = {
  output: {
    path: path.join(projectRoot, 'lib/'),
    filename: 'index.js',
  }
}

module.exports = Object.assign(baseConfig, updates);
