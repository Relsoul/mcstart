/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Created by soul on 2016/2/3.
	 */


	var $=__webpack_require__(1);
	var ipc=__webpack_require__(2);
	var remote=__webpack_require__(3);




	var init=__webpack_require__(4)($,ipc,remote);
	var setAnimate=__webpack_require__(6)($,ipc,remote);
	/*
	*
	*  username:"",
	    java_path:"",
	    memory_size:""
	 */


	$(function(){
	    init.init({
	        username:"#user_name",
	        java_path:"#java_path",
	        memory_size:"#memory_size",
	        search_java:"#search_java",
	        add_arg:"#add_arg",
	        start_game:"#start_game"
	    });
	    //$(".button-collapse").sideNav();
	    setAnimate.init()


	});






/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = jQuery;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = ipc;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = remote;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

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

	    var searchJava=__webpack_require__(5)($,ipc,remote);

	    var loadInfo=function(){
	        ipc.send("Info:get");
	        ipc.on("Info:result",function(event,data){
	            info=data;
	            info["username"]=""||info["username"];
	            initConfid();
	            console.log("INFO",info)
	        });
	        

	        $.ajax(
	            {
	                url: "http://www.ppsspp.cn/minecraft-rule/",
	                type: "GET",
	                dataType: "jsonp",
	                success: function (html) {
	                    console.log(html);
	                    $('.mc-ajax').html(html[0])
	                }
	            }
	        )
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

	        var dialog=remote.require("dialog");
	        $("#choose_java").on("click",function (e) {
	            dialog.showOpenDialog({ title:"选择java路径",properties: [ 'openFile'],filters:[{name:"javaw",extensions:['exe']}]},function(file){
	                if(!file.toString().match(/javaw.exe/)){
	                    return dialog.showErrorBox("错误","请选择javaw.exe文件")
	                }
	                info['java_path']= $.trim(file);
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
	                info["username"]=$(elem["username"]).val();
	                is_start=true;
	                setTimeout(function(){
	                    ipc.send("close-main-window");
	                },60000);
	                var end_time=60;
	                var timer=setInterval(function(){
	                    if(end_time<=0){
	                        clearInterval(timer)
	                    }else{
	                        end_time--;
	                        $("#end_time").html(end_time)
	                    }
	                },1000);
	                $('#modal1').openModal();
	                //开始游戏的时候才传递info
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










/***/ },
/* 5 */
/***/ function(module, exports) {

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
	                dialog.showOpenDialog({ title:"选择java路径",properties: [ 'openFile'],filters:[{name:"javaw",extensions:['exe']}]},function(file){
	                    if(!file.toString().match(/javaw.exe/)){
	                        return dialog.showErrorBox("错误","请选择javaw.exe文件")
	                    }
	                    if(typeof callback=='function' ){callback(file)}
	                })
	            }
	        });
	        return function(cb){
	            callback=cb;
	            ipc.send("searchJave:search");
	        }
	    }();
	    return{
	        init:function(cb){
	            getJavaPath(cb)
	        }
	    }
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	/**
	 * Created by soul on 2016/2/5.
	 */
	module.exports=function($,ipc,remote){

	    var setCardAnimate= function (elem) {
	        var elem_init={};
	        $(elem).on("mouseover",function(e){
	            console.log("is mouse");
	            elem_init["elem_class"]=$(elem).attr("class");
	            elem_init["elem_siblings_class"]=$(elem).siblings().attr("class");
	            $(elem).siblings().attr("class","col m4");
	            $(elem).attr("class","col m8");
	        });

	        $(elem).on("mouseout",function(e){
	            $(elem).siblings().attr("class",elem_init["elem_siblings_class"]);
	            $(elem).attr("class",elem_init["elem_class"]);
	        })

	    };

	    return{
	        init:function(){
	            setCardAnimate("#user_info_card")
	        }
	    }
	};

/***/ }
/******/ ]);