/**
 * Created by soul on 2016/2/3.
 */
module.exports=function($,ipc,remote){
    var dialog=remote.require("dialog");
    var getJavaPath=function(){
        var callback=null;
        ipc.on("searchJave:result",function(e,d){
            console.log("1");
            if(d){
                if(typeof callback=='function' ){callback(d)}
            }else{
                dialog.showOpenDialog({ title:"选择java路径",properties: [ 'openFile'],filters:[{name:"java",extensions:['exe']}]},function(file){
                    if(!file.toString().match(/javaw.exe/)){
                        return dialog.showErrorBox("错误","请选择javaw.exe文件")
                    }
                    if(typeof callback=='function' ){callback(file)}
                })
            }
        })
        return function(cb){
            callback=cb
            ipc.send("searchJave:search");
        }
    }()
    return{
        init:function(cb){
            getJavaPath(cb)
        }
    }
}