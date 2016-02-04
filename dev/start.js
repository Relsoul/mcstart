/**
 * Created by soul on 2016/2/3.
 */

var $=require("jquery");
var ipc=require("ipc");
var remote=require("remote");

var init=require("./client/js/init.js")($,ipc,remote);
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


