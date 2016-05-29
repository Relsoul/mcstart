/**
 * Created by soul on 2016/2/4.
 */
module.exports=function(event,arg,app_path){
    var fs=require("fs");
    var path=require("path");

    var getMcInfo=function(){
        var mc_path=__dirname;
        var getStart=function(){
            var getGameVersion=function(){
                var _path_file=fs.readdirSync(path.join(user_config["dir_name"],"/assets/indexes"));
                if(_path_file.length>0||_path_file){
                    return _path_file[0].match(/[0-9]+/gi).join(".")
                }
            };

            var getOsVersion=function(cb){
                var child_process=require("child_process");
                //系统版本
                child_process.exec("wmic os get osarchitecture",function(error, stdout, stderr){
                    if(stdout.indexOf("64")!=-1){
                       cb("64")
                    }else{
                        cb("32")
                    }
                })
            };

            return {
                getGameVersion:getGameVersion,
                getOsVersion:getOsVersion
            }
        }();

        return{
            init:function(user_config){
                user_config["dir_name"]=path.join(app_path,".minecraft");
                user_config["version"]=getStart.getGameVersion();
                getStart.getOsVersion(function(data){
                    user_config["os_version"]=data;
                    event.sender.send("Info:result",user_config)
                })
            }
        }
    }();
    var user_config=JSON.parse(fs.readFileSync(path.join(__dirname,"../config.json"),'utf8'));

    getMcInfo.init(user_config);

    console.log(8,__dirname)


};
