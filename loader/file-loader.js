const LoaderUtils = require('loader-utils')
module.exports = function(content,map,mate){
   //   1. 获取参数
   var options = loaderUtils.getOptions(this) || {};    
   //   2. 是否使用ESM导出 
   const esModule = typeof options.esModule !== 'undefined' ? options.esModule : true; 
   //   3. 根据文件生成带hash值文件名
   const publicPath = LoaderUtils.interpolateName(this,"[hash].[ext][query]",content);
   //   4. 将文件输出出去
   this.emitFile(publicPath,content)
   //   5. export 文件名
   return `${esModule ? 'export default' : 'module.exports ='}${publicPath}`;  
}
// 需要处理 文件 ，图片等文件格式都是 buffer格式的 需要使用rawloader才能处理
module.exports.raw = true;
