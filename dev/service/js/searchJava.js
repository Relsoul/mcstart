/**
 * Created by soul on 2016/2/4.
 */
module.exports=function(event,arg){
    var child_process=require("child_process");
    var path=require("path");
    var fs=require("fs")

    var SearchJavaStrate={
        findCil:function(cb){
            child_process.exec("java -XshowSettings:properties",function(error, stdout, stderr){
                var java_env=stderr.toString().match(/sun.boot.library.path.+/)[0];
                if(java_env){
                    java_env=path.join(java_env.match(/=.+/)[0].substr(1),"/javaw.exe")
                    console.log(15,java_env)
                    cb(false,java_env)
                }else{
                    cb(true)
                }
            })


        },
        find32Dir:function(cb){
            if(fs.existsSync("c:/Program Files/java/")){
                var java_env='c:/Program Files/java/'
                var java_dir=fs.readdirSync(java_env)[0]
                if(java_dir.length>0||java_dir){
                    var java_env=path.join(java_env,java_dir,"/bin/javaw.exe")
                    cb(false,java_env)
                }else{
                    cb(true)
                }
            }

        },
        find64Dir:function(cb){
            if(fs.existsSync("c:/Program Files (x86)/java/")){
                var java_env='c:/Program Files (x86)/java/'
                var java_dir=fs.readdirSync(java_env)[0]
                if(java_dir.length>0||java_dir){
                    var java_env=path.join(java_env,java_dir,"/bin/javaw.exe")
                    cb(false,java_env)
                }else{
                    cb(true)

                }
            }
        }
    }




    var SearchJavaContext=function(){
        var cache=[];
        var add=function(strate){
            strate.forEach(function(e,i){
                cache.push(function(cb){
                    SearchJavaStrate[e](cb)
                })
            })
        }




        return {
            init:function(strate,cb){
                if(strate&&strate.length>1){
                    add(strate)
                    console.log(cache)
                    var len=cache.length;
                    var i=0;
                    function funcFor(fn){
                        console.log(fn.toString())
                        fn(function(next,data){
                            if(next){
                                i++;
                                if(i>len){
                                    cb(null)
                                }
                                arguments.callee(cache[i])
                            }else{
                                cb(data)
                            }
                        })
                    }
                    funcFor(cache[i])
                }
            }
        }
    }()



    SearchJavaContext.init(["findCil","find64Dir","find32Dir"],function(data){
        console.log("89",data)
        if(data){
            event.sender.send("searchJave:result",data)
        }

    })





/*    child_process.exec("java -XshowSettings:properties",function(error, stdout, stderr){
        console.log('stdout: ' + stdout);
        var java_env=stderr.toString().match(/sun.boot.library.path.+/)[0];
        //return event.sender.send("searchJave:result",undefined)
        if(java_env){
            console.log(68,java_env.match(/=.+/)[0].substr(1))
            java_env=path.join(java_env.match(/=.+/)[0].substr(1),"/javaw.exe")
            return  event.sender.send("searchJave:result",java_env)
        }else{
            if(fs.existsSync("c:/Program Files/java/")){
                java_env='c:/Program Files/java/'
            }else if(fs.existsSync("c:/Program Files (x86)/java/")){
                java_env='c:/Program Files (x86)/java/'
            }
            if(java_env){
                var java_dir=fs.readdirSync(java_env)[0]
                java_env=path.join(java_env,java_dir,"/bin/javaw.exe")
                return  event.sender.send("searchJave:result",java_env)
            }else{
                return event.sender.send("searchJave:result",undefined)
            }
        }
    })*/
}
