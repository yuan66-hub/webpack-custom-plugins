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
  devtool: 'source-map', // 启用 sourcemap，选择适合你的构建的 sourcemap 类型
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    devtoolModuleFilenameTemplate: '../sourcemaps'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, "node_modules"),
      path.resolve(__dirname, "loader"),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // Pitching Loader 执行顺序 从左到右 myLoader1->myLoader2->myLoader3
        use: ['babel-loader'] // Normal loader 执行顺序 myLoader3->myLoader2->myLoader1
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
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
