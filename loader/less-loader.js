let less = require('less');
function lessLoader(source) {
    console.log('less===',source);
    const callback = this.async();
    less.render(source)
        .then((output)=>{
            callback(null, output.css);
        }, (err)=>{
            // handler err  
        })
}
module.exports = lessLoader;
