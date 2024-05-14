function WatcherPlugin(options) {
    this.options = options || {};
}

WatcherPlugin.prototype.apply = function (compiler) {
    compiler.hooks.watchRun.tapAsync('WatcherPlugin', (compiler, cb) => {
        console.log('我可是时刻监听着的 🚀🚀🚀')
        const fileWatchers = compiler.watchFileSystem.watcher.fileWatchers;
        const paths =[]
        for (const [key,value] of fileWatchers) {
            if(!/(node_modules)/.test(value)){
                paths.push(value)
            }
            
        }
        if (paths.length > 0) {
          console.log(`本次一共改动了${paths.length}个文件,目录为:`)
          console.log(paths)
          console.log('------------分割线-------------')
        }
        cb()
    })
    compiler.hooks.watchClose.tap('WatcherPlugin', () => {
        console.log('本次监听停止了哟～👋👋👋')
    })
}
module.exports = WatcherPlugin;
