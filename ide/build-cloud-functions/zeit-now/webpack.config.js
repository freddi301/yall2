const path = require("path");

module.exports = {
  entry: "./src/cloud/zeit-now/index.ts",
  target: "node",
  mode: "production",
  output: {
    path: path.resolve("./src/cloud/zeit-now"),
    libraryTarget: "commonjs",
    filename: "run.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
              compilerOptions: { module: "commonjs" }
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  }
};
