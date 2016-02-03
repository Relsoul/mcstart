/**
 * Created by soul on 2016/2/3.
 */
module.exports={
    //开发js都放置在/dev/js下 同时/dev/js下有个主目录用来做主文件
    entry:'./dev/start.js',
    output:{
        //利用gulp调用webpack,webpack仅做依赖管理
        filename:'mcstart.js'
    },
    module:{}
}