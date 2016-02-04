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
	/*
	*
	*  username:"",
	    java_path:"",
	    memory_size:""
	 */
	init.init({
	    username:"#username",
	    java_path:"#java_path",
	    memory_size:"#memory_size"
	})




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
	    var searchJava=__webpack_require__(5)($,ipc,remote)
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

/***/ }
/******/ ]);