/**
 * Created by soul on 2016/2/3.
 */


var $=require("jquery");
var ipc=require("ipc");
var remote=require("remote");




var init=require("./client/js/init.js")($,ipc,remote);
var setAnimate=require("./client/js/setAnimate.js")($,ipc,remote);
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




