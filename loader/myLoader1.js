
function loader1 (source){
     console.log("开始执行loader1 Normal Loader");
     source += "loader1]";
     return `module.exports = '${source}'`;
}

loader1.pitch = function (remainingRequest, precedingRequest, data) {
     console.log("开始执行loader1 Pitching Loader");
     console.log(remainingRequest, precedingRequest, data)
};

module.exports = loader1