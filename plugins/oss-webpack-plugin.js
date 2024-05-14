const assert = require("assert");
const fs = require("fs");
const glob = require("util").promisify(require("glob"));

// 1. 它是一个具名的函数或者JS类
class AssetUploadPlugin {
    constructor(options) {
        // 这里可以校验传入的参数是否合法等初始化操作
        assert(
            options,
            "check options ..."
        );
    }
    // 2. 在原型链上指定`apply`方法
    // apply方法接收 webpack compiler 对象入参
    apply(compiler) {
        // 3. 指定一个明确的事件钩子并注册回调
        compiler.hooks.afterEmit.tapAsync(  // 因为afterEmit是AsyncSeriesHook类型的钩子，需要使用tapAsync或tapPromise钩入回调
            "AssetUploadPlugin",
            (compilation, callback) => {
                const {
                    outputOptions: { path: outputPath }
                } = compilation;  // 4. 处理 webpack 内部实例的特定数据
                uploadDir(
                    outputPath,
                    this.options.ignore ? { ignore: this.options.ignore } : null
                )
                .then(() => {
                    callback();  // 5. 完成功能后调用webpack传入的回调等；
                })
                .catch(err => {
                    callback(err);
                });
            });
    }
};
// uploadDir就是这个插件的功能性描述
function uploadDir(dir, options) {
    if (!dir) {
        throw new Error("dir is required for uploadDir");
    }
    if (!fs.existsSync(dir)) {
        throw new Error(`dir ${dir} is not exist`);
    }
    return fs
        .statAsync(dir)
        .then(stat => {
            if (!stat.isDirectory()) {
                throw new Error(`dir ${dir} is not directory`);
            }
        })
        .then(() => {
            return glob(
                "**/*",
                Object.assign(
                    {
                        cwd: dir,
                        dot: false,
                        nodir: true
                    },
                    options
                )
            );
        })
        .then(files => {
            if (!files || !files.length) {
                return "未找到需要上传的文件";
            }
            // TODO: 这里将资源上传至你的静态云服务器中，如京东云、腾讯云等
            // ...
        });
}

module.exports = AssetUploadPlugin
