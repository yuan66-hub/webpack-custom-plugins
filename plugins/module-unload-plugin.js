// plugins/ModuleUnloadPlugin.js

const { RuntimeModule, RuntimeGlobals, Template } = require('webpack')

class ModuleUnloadRuntimeModule extends RuntimeModule {
  constructor() {
    super('module-unload', RuntimeModule.STAGE_BASIC)
  }

  generate() {
    return Template.asString([
      '// ---- Module Unload Runtime ----',
      `var installedChunks = ${RuntimeGlobals.hmrRuntimeStatePrefix}_installedChunks || {};`,
      '',
      '// 模块级卸载：清除单个模块缓存',
      '__webpack_require__.unloadModule = function(moduleId) {',
      '  var cache = __webpack_module_cache__;',
      '  if (cache[moduleId]) {',
      '    var mod = cache[moduleId];',
      '    // 触发模块的 dispose 钩子（如果注册了）',
      '    if (mod.exports && typeof mod.exports.__dispose === "function") {',
      '      mod.exports.__dispose();',
      '    }',
      '    delete cache[moduleId];',
      '    return true;',
      '  }',
      '  return false;',
      '};',
      '',
      '// Chunk 级卸载：卸载整个 chunk 中的所有模块',
      '__webpack_require__.unloadChunk = function(chunkId) {',
      '  var chunkModuleIds = __webpack_require__.unloadChunk._chunkModules[chunkId];',
      '  if (!chunkModuleIds) return false;',
      '  var count = 0;',
      '  for (var i = 0; i < chunkModuleIds.length; i++) {',
      '    if (__webpack_require__.unloadModule(chunkModuleIds[i])) count++;',
      '  }',
      '  // 重置 chunk 安装状态，允许重新加载',
      '  if (typeof installedChunks !== "undefined") {',
      '    delete installedChunks[chunkId];',
      '  }',
      '  // 移除对应的 <script> 标签',
      '  var scripts = document.querySelectorAll("script[data-chunk=\\"" + chunkId + "\\"]");',
      '  for (var j = 0; j < scripts.length; j++) {',
      '    scripts[j].parentNode.removeChild(scripts[j]);',
      '  }',
      '  return count;',
      '};',
      '__webpack_require__.unloadChunk._chunkModules = {};',
      '',
      '// 获取当前缓存的模块数量',
      '__webpack_require__.getCacheSize = function() {',
      '  return Object.keys(__webpack_module_cache__).length;',
      '};',
      '',
      '// 获取内存快照',
      '__webpack_require__.getMemorySnapshot = function() {',
      '  return {',
      '    cachedModules: Object.keys(__webpack_module_cache__).length,',
      '    moduleIds: Object.keys(__webpack_module_cache__),',
      '    heapUsed: performance.memory ? performance.memory.usedJSHeapSize : null',
      '  };',
      '};'
    ])
  }
}

class ModuleUnloadPlugin {
  constructor(options = {}) {
    this.options = {
      enableAutoUnload: options.enableAutoUnload || false,
      maxCacheSize: options.maxCacheSize || Infinity,
      debug: options.debug || false,
      ...options
    }
  }

  apply(compiler) {
    const pluginName = 'ModuleUnloadPlugin'

    // 1. 注入运行时模块
    compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.runtimeRequirementInTree
        .for(RuntimeGlobals.ensureChunkHandlers)
        .tap(pluginName, chunk => {
          compilation.addRuntimeModule(chunk, new ModuleUnloadRuntimeModule())
        })

      // 2. 收集每个 chunk 包含的 moduleId 映射
      compilation.hooks.afterOptimizeChunkModules.tap(pluginName, chunks => {
        for (const chunk of chunks) {
          const moduleIds = []
          const chunkGraph = compilation.chunkGraph
          for (const module of chunkGraph.getChunkModulesIterable(chunk)) {
            const id = chunkGraph.getModuleId(module)
            if (id !== null) moduleIds.push(id)
          }
          // 存入 chunk 的运行时数据
          chunk.__unloadModuleIds = moduleIds
        }
      })

      // 3. 将 chunk-module 映射写入运行时
      compilation.hooks.additionalChunkRuntimeRequirements.tap(
        pluginName,
        (chunk, runtimeRequirements) => {
          runtimeRequirements.add(RuntimeGlobals.ensureChunkHandlers)
        }
      )
    })

    // 4. 为 script 标签添加 data-chunk 属性（用于卸载时移除）
    compiler.hooks.compilation.tap(pluginName, compilation => {
      compilation.hooks.afterProcessAssets.tap(pluginName, () => {
        // 生成 chunk -> moduleIds 的映射文件
        const chunkMap = {}
        for (const chunk of compilation.chunks) {
          if (chunk.__unloadModuleIds) {
            chunkMap[chunk.id] = chunk.__unloadModuleIds
          }
        }

        const source = `
          // Auto-generated chunk module map
          if (typeof __webpack_require__ !== 'undefined' && __webpack_require__.unloadChunk) {
            __webpack_require__.unloadChunk._chunkModules = ${JSON.stringify(
              chunkMap
            )};
          }
        `

        const { RawSource } = require('webpack-sources')
        compilation.emitAsset('chunk-module-map.js', new RawSource(source))
      })
    })
  }
}

module.exports = ModuleUnloadPlugin
