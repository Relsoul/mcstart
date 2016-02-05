var electron = require('electron');  // 控制应用生命周期的模块。
var app=electron.app
var BrowserWindow = electron.BrowserWindow;  // 创建原生浏览器窗口的模块
var path=require("path");
var ipc=electron.ipcMain;
var fs=require("fs");
var process=require("process");


var app_path=app.getAppPath();


console.log("app_path",app_path)
// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
    // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
    // 应用会保持活动状态
    if (process.platform != 'darwin') {
        app.quit();
    }
});

ipc.on('close-main-window', function () {
    app.quit();
});

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function() {
    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({width: 1200, height: 800});


    // 加载应用的 index.html
    var template_index=path.join(__dirname,"../template/index.html")
    mainWindow.loadURL('file://' + template_index);

    // 打开开发工具
    mainWindow.openDevTools();


    // 当 window 被关闭，这个事件会被发出
    mainWindow.on('closed', function() {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 但这次不是。
        mainWindow = null;
    });
});

ipc.on('Info:get',function(event,arg){
    require("./getInfo.js")(event,arg,app_path)

});

ipc.on("searchJave:search",function(event,arg){
    require("./searchJava.js")(event,arg)
})


ipc.on("startGame",function(event,arg){
    require("./startGame.js")(event,arg,app_path)
})




