const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  return {
    entry: {
      app: "./src/index.js"
    },
    output: {
      filename: "bundle.js"
    },
    devServer: {
      //default dir is "/dist"
      writeToDisk: true,
      open: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: "babel-loader"
        },

        {
          test: /\.s(a|c)ss$/,
          loader: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                plugins() {
                  return [require("precss"), require("autoprefixer")];
                }
              }
            },
            {
              loader: "sass-loader"
            }
          ]
        },

        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "[name].[ext]"
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      }),
      new MiniCssExtractPlugin({
        filename: isProduction ? "[name].[hash].css" : "[name].css"
      }),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/index.html"
      }),
      new CopyPlugin([
        {
          from: "./src/sprite.svg",
          to: ""
        }
      ]),
      new Dotenv()
    ],
    resolve: {
      alias: {
        "jquery-ui": "jquery-ui/ui/effect.js"
      }
    }
  };
};
