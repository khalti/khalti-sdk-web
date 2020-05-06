const path = require("path");
const projectRoot = path.dirname(__dirname);

module.exports = {
  entry: path.join(projectRoot, 'src/widget/index.js'),
  output: {
    filename: "widget.js",
    path: path.join(projectRoot, "dist"),
    libraryTarget: "umd",
    library: "widget"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(less)$/,
            use: [{
              loader: 'style-loader' // creates style nodes from JS strings
            }, {
              loader: 'css-loader' // translates CSS into CommonJS
            }, {
              loader: 'less-loader' // compiles Less to CSS
            }]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: true,
            }
          }
        ]
      },
      {
				test: /\.(png|svg|jpg|gif|eot|ttf|woff|woff2)$/,
				loader: "file-loader"
			},
    ]
  }
};
