function DecideHtmlPlugin () {}

DecideHtmlPlugin.prototype.apply = function (compiler) {
  //设置完初始插件之后，执行插件。
  compiler.hooks.afterPlugins.tap('DecideHtmlPlugin', compiler => {
    const plugins = compiler.options.plugins;
    const hasHtmlPlugin = plugins.some(plugin => {
      return plugin.__proto__.constructor.name === 'HtmlWebpackPlugin'
    })
    if (hasHtmlPlugin) {
      console.log('使用了html-webpack-plugin')
    }else {
      console.log('没有使用了html-webpack-plugin')
    }
  })
}

module.exports = DecideHtmlPlugin
