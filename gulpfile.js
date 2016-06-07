/**
 * Created by soul on 2016/2/3.
 */
var gulp=require("gulp");
var p=require("gulp-load-plugins")();
var webpackConfig = require('./webpack.config');

gulp.task("default",["sass:watch","webpack:watch",'reload']);

//sass编译
gulp.task("sass:watch",function(){
    gulp.watch('./appPath/dev/client/css/**.scss',["reload"])
});
gulp.task("sass:compile",function(){
    gulp.src(['./appPath/dev/client/css/**.scss'])
        .pipe(p.sass.sync().on('error', p.sass.logError))
        .pipe(gulp.dest('./appPath/public/css'))
});

//webpack依赖编译
gulp.task('webpack:watch',function(){
    //任何js变动
    gulp.watch('./appPath/dev/client/js/**.js',["reload"]);
    gulp.watch('./appPath/dev/*.js',["reload"]);
    gulp.watch("./appPath/dev/service/js/**.js",["reload"])
});

gulp.task('webpack:compile',function(){
     gulp.src("./")
        .pipe(p.webpack(webpackConfig))
        //设置输出路径
        .pipe(gulp.dest('./appPath/public/js'))
});

gulp.task("reload",["sass:compile",'webpack:compile'], p.shell.task(["asar pack appPath app.asar",'electron .']));
