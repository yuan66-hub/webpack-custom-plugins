function loader3 (source){
    console.log("开始执行loader3 Normal Loader");
    return source + "[loader3->";
}

loader3.pitch = function (remainingRequest, precedingRequest, data) {
    console.log("开始执行loader3 Pitching Loader");
};

module.exports = loader3