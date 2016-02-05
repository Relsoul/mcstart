/**
 * Created by soul on 2016/2/5.
 */
module.exports=function($,ipc,remote){

    var setCardAnimate= function (elem) {
        var elem_init={}
        $(elem).on("mouseover",function(e){
            console.log("is mouse")
            elem_init["elem_class"]=$(elem).attr("class");
            elem_init["elem_siblings_class"]=$(elem).siblings().attr("class");
            $(elem).siblings().attr("class","col m4");
            $(elem).attr("class","col m8");
        })

        $(elem).on("mouseout",function(e){
            $(elem).siblings().attr("class",elem_init["elem_siblings_class"]);
            $(elem).attr("class",elem_init["elem_class"]);
        })

    }

    return{
        init:function(){
            setCardAnimate("#user_info_card")
        }
    }
}