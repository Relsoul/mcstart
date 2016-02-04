var electron = require('electron');  // 控制应用生命周期的模块。
var app=electron.app
var BrowserWindow = electron.BrowserWindow;  // 创建原生浏览器窗口的模块
var path=require("path");
var ipc=electron.ipcMain;
var fs=require("fs");
var user_config=JSON.parse(fs.readFileSync(path.join(__dirname,"../config.json"),'utf8'));
var process=require("process")
var child_process=require("child_process")

console.log(11,electron)

require("./initUser.js")(ipc)

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

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', function() {
    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({width: 1000, height: 600});


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
    event.sender.send("Info:result",user_config)
});

ipc.on("searchJave:search",function(event,arg){
    child_process.exec("java -XshowSettings:properties",function(error, stdout, stderr){
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
    })
})



