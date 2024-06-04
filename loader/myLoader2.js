function loader2 (source){
    console.log("开始执行loader2 Normal Loader");
    return source + "loader2->";
}
//  返回值为非（undefine）时 ,实现熔断效果 下一个执行是 Normal loader1，而不是 Pitch loader3
loader2.pitch = function (remainingRequest, precedingRequest, data) {
    console.log("开始执行loader2 Pitching Loader");
    return "loader2 Pitching Loader->";
};

module.exports = loader2