module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
              useBuiltIns: "usage", // 用到什么填充什么，按需
              corejs: 3, // 默认是2版本
            },
          ]
    ],
    // 再接着为了满足 npm 组件开发的需要 出现了 @babel/plugin-transform-runtime 来做隔离，解决全局变量污染问题
    plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            helpers: true, // 对辅助函数的复用，解决代码冗余问题
            corejs: false, //防止 @babel/preset-env 转换函数冲突
            regenerator: false //代码中没用到 Generator/async 函数，则不引入，设置false,防止 @babel/preset-env regenerator 函数冲突
          } 
        ]
    ]
}
