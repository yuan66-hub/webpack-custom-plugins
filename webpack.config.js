const path = require('path');
const CleanWebpackPlugin = require('./plugins/clean-webpack-plugin');
const Demo1WebpackPlugin = require('./plugins/demo1-webpack-plugin');
const Demo2WebpackPlugin = require('./plugins/demo2-webpack-plugin');
const FileListWebpackPlugin = require('./plugins/fileList-webpack-plugin');
const WatchWebpackPlugin = require('./plugins/watch-webpack-plugin')
const DecideWebpackPlugin = require('./plugins/decide-html-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin') // 引用

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          path.resolve(__dirname, './loader/babel-loader.js')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: path.resolve(__dirname, './loader/url-loader.js'),
            options: {
              limit: 10000,
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: path.resolve(__dirname,'./loader/style-loader.js'),
          },
          {
            loader: path.resolve(__dirname,'./loader/less-loader.js'),
          }
        ]
      },
      {
        test: /\.md$/,
        use: [
          path.resolve(__dirname, './loader/md-loader.js')
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new CleanWebpackPlugin(),
    new Demo1WebpackPlugin({
      msg: 'hello world'
    }),
    new Demo2WebpackPlugin(),
    new FileListWebpackPlugin(),
    new WatchWebpackPlugin(),
    new DecideWebpackPlugin()
  ]
}
