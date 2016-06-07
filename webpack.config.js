/**
 * Created by soul on 2016/2/3.
 */
var path=require("path");
var webpack=require("webpack");
module.exports={
    //开发js都放置在/dev/js下 同时/dev/js下有个主目录用来做主文件
    entry:'./apppath/dev/start.js',
    externals: {
        "jquery" : "jQuery",
        'ipc':'ipc',
        'remote':'remote'
    },
    output:{
        //利用gulp调用webpack,webpack仅做依赖管理
        filename:'mcstart.js'
    },
/*    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),//这个可以使jquery变成全局变量，妮不用在自己文件require('jquery')了
    ],*/
    resolve: {
/*        alias:{
            jquery:__dirname+"/public/lib/jquery/dist/jquery.min.js"
        },
        extensions: ['', '.coffee', '.js']*/
    },
    module:{
        noParse:[],
       /* loaders: [{test: path.resolve(__dirname, 'public/lib/jquery/jquery.min.js'), loader: 'expose?jQuery'}]*/
    }
};