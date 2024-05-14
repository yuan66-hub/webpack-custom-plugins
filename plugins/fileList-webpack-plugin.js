function FileListPlugin (options) {
    this.options = options || {};
    this.filename = this.options.filename || 'fileList.md'
  }
  
  FileListPlugin.prototype.apply = function (compiler) {
    // 1.通过compiler.hooks.emit.tapAsync()来触发生成资源到output目录之前的钩子，且回调函数会有两个参数，一个是compilation，一个是cb回调函数
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
      // 2.要生成的markdown文件的名称
      const fileListName = this.filename;
      // 3.通过compilation.assets获取到所有待生成的文件，这里是获取它的长度
      let len = Object.keys(compilation.assets).length;
      // 4.定义markdown文件的内容，也就是先定义一个一级标题，\n表示的是换行符
      let content = `# 一共有${len}个文件\n\n`;
      // 5.将每一项文件的名称写入markdown文件内
      for (let filename in compilation.assets) {
        content += `- ${filename}\n`
      }
      // 6.给我们即将生成的dist文件夹里添加一个新的资源，资源的名称就是fileListName变量
      compilation.assets[fileListName] = {
        // 7.写入资源的内容
        source: function () {
          return content;
        },
        // 8.指定新资源的大小，用于webpack展示
        size: function () {
          return content.length;
        }
      }
      // 9.由于我们使用的是tapAsync异步调用，所以必须执行一个回调函数cb，否则打包后就只会创建一个空的dist文件夹。
      cb();
    })
  }
  module.exports = FileListPlugin;
  