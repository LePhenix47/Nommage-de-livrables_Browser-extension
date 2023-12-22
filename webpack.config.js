const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    background: "./scripts/background.ts", // Entry point for your TypeScript files
    content: "./scripts/content.ts", // Entry point for your TypeScript files
    popup: "./scripts/popup.ts", // Script output for the popup.html
    style: "./sass/main.scss", // Entry point for your SASS file
  },
  mode: "production",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [require("autoprefixer")],
              },
            },
          },
          "sass-loader",
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@css": path.resolve(__dirname, "css"),
      "@images": path.resolve(__dirname, "images"),
      "@scripts": path.resolve(__dirname, "scripts"),
      "@sass": path.resolve(__dirname, "sass"),
      "@utils": path.resolve(__dirname, "utils"),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "style.css", // Specify the output CSS filename
    }),
  ],
};
