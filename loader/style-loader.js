// 内联样式到html文件
function styleLoader(source) {
    source = JSON.stringify(source);
    const root = process.cwd();
    const resourcePath = this.resource;
    const origin = resourcePath.replace(root, '');
    let style = `
        let style = document.createElement('style');
        style.innerHTML = ${source};
        style.setAttribute('data-origin', '${origin}');
        document.head.appendChild(style);
   `;
    return style
}

module.exports = styleLoader
