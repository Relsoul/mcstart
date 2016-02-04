/**
 * Created by soul on 2016/2/3.
 */

module.exports=function($,ipc,remote){
    var info={
        username:'',
        java_path:'',
        memory_size:'',
    };
    var elem={
        username:"",
        java_path:"",
        memory_size:""
    };
    var searchJava=require("./searchJava.js")($,ipc,remote)
    var loadInfo=function(){
        ipc.send("Info:get");
        ipc.on("Info:result",function(event,data){
            info=data;
            initConfid();

        })
    };
    var initConfid=function(){
        $(elem["username"]).val(info["username"])
        $(elem["java_path"]).val(info['java_path'])
        $(elem['memory_size']).val(info['memory_size'])
        $("#search_java").on("click",function(e){
            e.stopImmediatePropagation()
            searchJava.init(function(java_path){
                info['java_path']=java_path;
                $(elem["java_path"]).val(info['java_path'])
            })
        })
    }

    var save=function(){
        ipc.send("Info:save");
    }


    return{
        get:function(id){
            return info[id]
        },
        set:function(id,value){
            info[id]=value
        },
        init:function(e){
            elem=e
            loadInfo()
        },
    }
}








