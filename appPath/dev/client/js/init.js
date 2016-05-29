/**
 * Created by soul on 2016/2/3.
 */


module.exports=function($,ipc,remote){
    var info={};
    var elem={
        username:"",
        java_path:"",
        memory_size:""
    };

    var searchJava=require("./searchJava.js")($,ipc,remote);

    var loadInfo=function(){
        ipc.send("Info:get");
        ipc.on("Info:result",function(event,data){
            info=data;
            initConfid();
            console.log("INFO",info)
        })
    };


    var checkForm=function(){
        if($.trim($(elem["username"]).val())==""){
            Materialize.toast('请填写用户名', 4000);
            return false
        }
        if($.trim($(elem["java_path"]).val())==""){
            Materialize.toast('请填点击寻找java路径', 4000);
            return false
        }
        return true
    };
    var setMemory_size=function(){
        var set=function(elem,max,val){
            $(elem["memory_size"]).attr("max",max||4080);
            $(elem["memory_size"]).val(val||2048)
        };

        return{
            "64":function(elem){
                set(elem,4080,2048)
            },
            "32": function (elem) {
                set(elem,1024,756)
            }
        }
    }();



    var initConfid=function(){
        $(elem["username"]).val(info["username"]);
        $(elem["java_path"]).val(info['java_path']);
        $(elem['memory_size']).val(info['memory_size']);
        $(elem['search_java']).on("click",function(e){
            e.stopImmediatePropagation();
            searchJava.init(function(java_path){
                info['java_path']= $.trim(java_path);
                $(elem["java_path"]).val(info['java_path'])
            })
        });
        $(elem['search_java']).click();

        //设置最佳内存
        setMemory_size[info["os_version"]](elem);

        var is_start=false;
        $(elem["start_game"]).on("click",function(e){
            e.stopImmediatePropagation();
            if(checkForm()){
                if(is_start){
                    $('#modal1').openModal();
                    return false
                }
                info["memory_size"]= $(elem["memory_size"]).val();
                info["add_arg"]=$(elem["add_arg"]).val()||" ";
                is_start=true;
                setTimeout(function(){
                    ipc.send("close-main-window");
                },30000);
                var end_time=30;
                var timer=setInterval(function(){
                    if(end_time<=0){
                        clearInterval(timer)
                    }else{
                        end_time--;
                        $("#end_time").html(end_time)
                    }
                },1000);
                $('#modal1').openModal();
                ipc.send("startGame",info);
            }
        });




/*        setInterval(function(){
            console.log($(elem['memory_size']).val())
        },500)*/

    };


    return{
        get:function(id){
            return info[id]
        },
        set:function(id,value){
            info[id]=value
        },
        init:function(e){
            elem=e;
            loadInfo()
        },
    }
};








