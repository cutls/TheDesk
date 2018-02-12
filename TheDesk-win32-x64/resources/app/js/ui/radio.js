var r = document.getElementById("radio");
function Rtoggle(){
    if($("#radio").hasClass("play")){
        Rstop();
    }else{
        $("#radio-view").toggleClass("hide");
        $("#radio-input").addClass("hide");
    }
}
function Rplay(url,name){
    $("#radio").attr('src',url);
    r.load();
    r.play();
    $("#radio").addClass("play");
    $("#radio-btn").addClass("teal-text");
    $("#radio-sta").html("<br>Now Playing:"+name);
}
function Rstop(){
    $("#radio").attr("src","");
    r.pause();
    $("#radio").removeClass("play");
    $("#radio-btn").removeClass("teal-text");
    $("#radio-sta").html("");
}
function Ryourself(){
    $("#radio-input").removeClass("hide");
    $("#radio-view").addClass("hide");
}
function Rselect(){
    $("#radio-input").addClass("hide");
    $("#radio-view").removeClass("hide");
}
function Rinput(){
    var url=$("#radio-url").val();
    Rplay(url,url)
}