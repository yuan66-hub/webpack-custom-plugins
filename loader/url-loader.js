const  loaderUtils = require("loader-utils");
const mime = require("mime");
const validate = require("schema-utils"); 
const schema = require('./schema/url-loader-option.json');

function shouldTransform(limit, size){
	if (typeof limit === 'boolean') {
	  return limit;
	}
  
	if (typeof limit === 'string') {
	  return size <= parseInt(limit, 10);
	}
  
	if (typeof limit === 'number') {
	  return size <= limit;
	}
  
	return true;
}
module.exports = function(content) {  
	// 1. 获取参数
	const query = loaderUtils.getOptions(this) || {};
	// 2. 验证参数 - 当出现错误的时候会自动抛出错误 
	validate(schema, query,{ name:'url-loader'} );
    console.log('this.options',this.options);
	// 3. 文件大小限制
	const limit = (this.options && this.options.url && this.options.url.dataUrlLimit) || 0;
	// 2.0+版本以后新增的esModuleApi
	const esModule = query.esModule 
	// 类型
	const mimetype = query.mimetype || query.minetype || mime.lookup(this.resourcePath);
	// 通过文件大小
	if(shouldTransform(query.limit,content.length)){
	// 如果比较文件小于limit 以base64的形式去展示 
		return `${esModule ? 'export default' : 'module.exports ='}` + JSON.stringify("data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64"));
	} else {
    // 这里引入我们自己的file-loader 
	// 如果比较文件大于limit，以url的形式展示
        const fileLoader = require("./file-loader.js");
		return fileLoader.call(this, content);
	}
}
module.exports.raw = true;
