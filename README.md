# 此项目仅供学习使用！！！

# webpack三个辅助函数

1. __webpack_require__.d

```javaScript
    public static void main(String[] args) {
        System.out.println("HELLO WORLD,共饮一杯无");
    }
```

2. __webpack_require__.o
3. __webpack_require__.r

# `__webpack_require__` 加载流程 vs `nodejs`模块加载机制

1. 先定义一个变量`__webpack_module_cache__`作为加载了的模块的缓存
2. `__webpack_require__`其实就是用来加载模块的
3. 加载模块时，先检查缓存中有没有，如果有，就直接返回缓存
4. 如果缓存没有，就从`__webpack_modules__`将对应的模块取出来执行
5. `__webpack_modules__`就是上面第一块代码里的那个对象，取出的模块其实就是我们自己写的代码，取出执行的也是我们每个模块的代码
6. 每个模块执行除了执行我们的逻辑外，还会将export的内容添加到module.exports上，这就是前面说的`__webpack_require__.d`辅助方法的作用。添加到module.exports上其实就是添加到了`__webpack_module_cache__`缓存上，后面再引用这个模块就直接从缓存拿了。

# webpack 如何将`import`和`export`关键字进行转成浏览器识别的代码

1. 将import这种浏览器不认识的关键字替换成了__webpack_require__函数调用。
2. __webpack_require__在实现时采用了类似CommonJS的模块思想。
3. 一个文件就是一个模块，对应模块缓存上的一个对象。
4. 当模块代码执行时，会将export的内容添加到这个模块对象上。
5. 当再次引用一个以前引用过的模块时，会直接从缓存上读取模块。

# 思考

1. 优化`v8`垃圾回收优化策略，通过`webpack` 实现代码卸载，减少内存的占用


 