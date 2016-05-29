/**
 * Created by soul on 2016/2/4.
 */
module.exports=function(arg,cb){
    var fs=require("fs");
    var path=require("path");
    console.log(7,JSON.stringify(arg));
    fs.writeFileSync(path.join(__dirname,"../config.json"),JSON.stringify(arg))


};
