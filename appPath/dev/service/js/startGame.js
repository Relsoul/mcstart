/**
 * Created by soul on 2016/2/4.
 */
module.exports=function(event,arg,app_path){
    var fs=require("fs");
    var path=require("path");
    //保存传递参数
    require("./save.js")(arg);
    var child_process=require("child_process");


    var start=function(user_config){
        var start_arg={};

        var getFilePath=function(text){

            var _text_arr=text.match(/:[a-z0-9A-Z\.\-\_]+/gi);
            var _last_dir=text.substr(text.lastIndexOf(":"));
            var _head_dir=text.slice(0,text.lastIndexOf(":"));
            //处理前面中还存在:
            _head_dir=_head_dir.replace(/\:/gi,".");
            _head_dir=_head_dir.replace(/\./gi,"/");

            _last_dir=_last_dir.replace(/\:/gi,"/");
            var dir_path=_head_dir+_last_dir;
            var file_path=_text_arr.map(function(n){
                    return n=n.substr(1)
                }).join("-")+".jar";
            file_path=dir_path+"/"+file_path;
            file_path=path.join(app_path,".minecraft/libraries",file_path);

            return file_path
        };

        var getGameStartArg=function(user_config){
            var game_json=JSON.parse(fs.readFileSync(path.join(user_config["dir_name"],"/versions/",user_config["version"],user_config["version"]+".json"),'utf8'));
            var id=game_json.id;
            var assets=game_json.assets;
            var mainClass=game_json.mainClass;
            var minecraftArguments=game_json.minecraftArguments;
            var uuid="{}";
            var token="{}";
            var twitch="{}";
            var libs=game_json.libraries;
            libs=libs.map(function(n){
                if("natives" in n){
                    var _os= n.natives["windows"];
                    if(_os.indexOf("${arch}")>-1){
                        /*var os_file_path=n["name"]+":natives:windows:"+user_config["os"];
                        n["name"]=getFilePath(os_file_path)*/

                    }else{
                      /*  var os_file_path=n["name"]+":natives:windows";
                        n["name"]=getFilePath(os_file_path)*/


                    }
                }else{
                    return n["name"]=getFilePath(n["name"])
                }

            });
            return {
                minecraftArguments:minecraftArguments,
                mainClass:mainClass,
                assets:assets,
                id:id,
                game_json:game_json,
                uuid:uuid,
                token:token,
                twitch:twitch,
                libs:libs,
                type:"Legacy"
            }
        }(user_config);


        var replaceGameStartArg=function(text,_r){
            _r.forEach(function(e,i){
                text=text.replace(e[0],e[1])
            });
            return text
        };



        var startGame=function(startarg,user_config){
            var mainClass=startarg["mainClass"];
            var start=startarg['start'];
            var libs=startarg['libs'];


            var start_text="\""+path.join(user_config['java_path'])+"\""+" -Xincgc -Xmx"+user_config["memory_size"]+"M "+user_config["add_arg"]+" -Djava.library.path="+""+path.join(app_path,".minecraft\\versions\\1.7.10\\1.7.10-natives")+""
            +" -cp "+""+libs.join(";")+path.join(app_path,".minecraft/versions/",user_config["version"],user_config["version"]+".jar")+""
            +" "+mainClass+" "+start;
            //console.log(90,path.join(user_config["java_path"])+start_text)
            fs.writeFileSync(path.join(__dirname,"test.bat"),start_text);

            /*child_process.execFile("1.bat",null,{cwd:__dirname},function(error,stdout,stderr){
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            })*/


/*            console.log("启动dirname",__dirname);
            console.log("正确路径,truePath",);*/
            console.log("启动命令",start_text);
            child_process.exec(start_text,{cwd:path.join(__dirname,"../../../../.minecraft")},function(error, stdout, stderr){
                console.log("stdout",stdout);
                console.log("stderr",stderr);
                if(stdout){
                    const dialog = require('electron').dialog;
                    dialog.showErrorBox("运行错误", stdout)
                }
                console.log("err",error)
            });

            //console.log(86,start_text)
        };


        var libToPath=function(libs,app_path){

        };

        return function(){
            start_arg["id"]=getGameStartArg.id;
            start_arg["assets"]=getGameStartArg.assets;
            start_arg["mainClass"]=getGameStartArg.mainClass;
            start_arg["minecraftArguments"]=getGameStartArg.minecraftArguments;
            start_arg["uuid"]=getGameStartArg.uuid;
            start_arg["token"]=getGameStartArg.token;
            start_arg["twitch"]=getGameStartArg.twitch;
            start_arg["libs"]=getGameStartArg.libs;
            start_arg["type"]=getGameStartArg.type;
            var _r=[
                ["${auth_player_name}",user_config['username']],
                ["${version_name}",start_arg['id']],
                ["${game_directory}",path.join(app_path,".minecraft")],
                ["${game_assets}","\""+path.join(app_path,"/.minecraft/assets")+"\""],
                ["${assets_root}","\""+path.join(app_path,"/.minecraft/assets")+"\""],
                ["${assets_index_name}",start_arg['assets']],
                ["${auth_uuid}",start_arg['uuid']],
                ["${auth_session}",start_arg['token']],
                ["${auth_access_token}",start_arg['token']],
                ["${user_properties}",start_arg['twitch']],
                ["${user_type}",start_arg['type']],
            ];
            start_arg["start"]=replaceGameStartArg(start_arg["minecraftArguments"],_r);
            startGame(start_arg,user_config);
            //console.log(115,start_arg)
        }

    }(arg);

    start()



};