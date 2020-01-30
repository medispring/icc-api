const path = require("path")

module.exports = {
  entry: "./icc-x-api/worker.ts",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "icc-api.worker.js",
    path: path.resolve(__dirname)
  },
  devtool: "inline-source-map",
  target: "webworker"
}
