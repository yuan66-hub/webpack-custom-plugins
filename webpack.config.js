const path = require('path');
const { CleanWebpackPlugin } = require('./plugins/clean-webpack-plugin');
const Demo1WebpackPlugin = require('./plugins/demo1-webpack-plugin');
const Demo2WebpackPlugin = require('./plugins/demo2-webpack-plugin');
const FileListWebpackPlugin = require('./plugins/fileList-webpack-plugin');
const WatchWebpackPlugin = require('./plugins/watch-webpack-plugin')
const DecideWebpackPlugin =  require('./plugins/decide-html-webpack-plugin')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Demo1WebpackPlugin({
        msg:'hello world'
    }),
    new Demo2WebpackPlugin(),
    new FileListWebpackPlugin(),
    new WatchWebpackPlugin(),
    new DecideWebpackPlugin()
  ]
}
