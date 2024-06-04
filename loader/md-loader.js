const {marked} = require('marked')
// 代码高亮 highlight.js
module.exports = function(source) {

  // 转换
  const content = marked(source)

  // 返回的结果必须是模块化的内容
  const innerContent = "`" + content + "`"
  const moduleContent = `var code = ${innerContent};export default code;`
  return moduleContent
}
