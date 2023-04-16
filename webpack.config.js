const path = require('path')

module.exports = {
  mode: "production",
  entry: {
    main: "./inpage/index.js",
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: "provider.js"
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
}
