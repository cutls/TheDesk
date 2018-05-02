function pip(id){
    $("#pip-content").html($("[toot-id=" + id + "] .additional").html());
    $("#pip").removeClass("hide");
}
function endPip(){
    $("#pip-content").html("");
    $("#pip").addClass("hide");
}

function pipHoriz(){
    if($("#pip").hasClass("pip-left")){
        $("#pip").removeClass("pip-left");
        $(".pip-horiz").text("chevron_left");
        $("#pip").addClass("pip-right");
    }else{
        $("#pip").addClass("pip-left");
        $("#pip").removeClass("pip-right");
        $(".pip-horiz").text("chevron_right");
    }
}

function pipVert(){
    if($("#pip").hasClass("pip-top")){
        $("#pip").removeClass("pip-top");
        $("#pip").addClass("pip-bottom");
        $(".pip-vert").text("expand_less");
    }else{
        $("#pip").addClass("pip-top");
        $("#pip").removeClass("pip-bottom");
        $(".pip-vert").text("expand_more");
    }
}