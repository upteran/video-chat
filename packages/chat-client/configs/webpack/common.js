// shared config (dev and prod)
const webpack = require("webpack");
const { resolve } = require("path");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

require("dotenv").config({ path: "./.env" });

module.exports = {
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      components: resolve(__dirname, "../../src/components/"),
      entity: resolve(__dirname, "../../src/entity/"),
      features: resolve(__dirname, "../../src/features/"),
      services: resolve(__dirname, "../../src/services/"),
    },
  },
  context: resolve(__dirname, "../../src"),
  module: {
    rules: [
      {
        test: [/\.jsx?$/, /\.tsx?$/],
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          "file-loader?hash=sha512&digest=hex&name=img/[contenthash].[ext]",
          "image-webpack-loader?bypassOnDebug&optipng.optimizationLevel=7&gifsicle.interlaced=false",
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.WS_HOST": JSON.stringify(process.env.WS_HOST || "locahost"),
      "process.env.WS_PORT": JSON.stringify(process.env.WS_PORT),
    }),
    new HtmlWebpackPlugin({ template: "index.html.ejs" }),
    new TsconfigPathsPlugin({}),
  ],
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
  performance: {
    hints: false,
  },
};
