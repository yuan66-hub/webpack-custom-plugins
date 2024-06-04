 function loader1 (source){
     console.log('source===',source);
     return `export default ${JSON.stringify(source)}`;
 
}

module.exports = loader1