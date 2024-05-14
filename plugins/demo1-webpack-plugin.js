function No1WebpackPlugin(options) {
    this.options = options
}
No1WebpackPlugin.prototype.apply = function (compiler) {
    compiler.hooks.done.tap('No1', () => {
        console.log(this.options.msg)
    })
}
module.exports = No1WebpackPlugin;
