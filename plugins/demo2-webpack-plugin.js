function No2WebpackPlugin(options) {
    this.options = options
}
No2WebpackPlugin.prototype.apply = function (compiler) {
    // compiler 读取webpack 文件和命令行参数进行合并，加载插件，执行run方法
    compiler.hooks.compile.tap('No2', () => {
        console.log('compile')
    })
    // compilation是更具文件数据去重复执行--模块资源对象 --插件的扩展
    compiler.hooks.compilation.tap('No2', (compilation) => {
        console.log('compilation')
        // 同步钩子 --chunkAsset
        compilation.hooks.chunkAsset.tap('No2',(chunk,filename)=>{
            // 获取chunk模块信息
            console.log('chunk',chunk.id)
            // 获取打包后的文件名
            console.log('filename',filename)
        })
       
       
    })
}
module.exports = No2WebpackPlugin;
