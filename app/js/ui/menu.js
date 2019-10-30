function menu() {
  localStorage.setItem("menu-done", true);
  $("#fukidashi").addClass("hide")
  if (!$("#menu").hasClass("appear")) {
    $("#menu").addClass("appear")
    var left = localStorage.getItem("menu-left");
    if (left > $('body').width() - $('#menu').width()) {
      left = $('body').width() - $('#menu').width();
    } else if (left < 0) {
      left = 0;
    }
    var top = localStorage.getItem("menu-top");
    if (top > $('body').height() - $('#menu').height()) {
      top = $('body').height() - $('#menu').height();
    } else if (top < 0) {
      top = 0;
    }
    $('#menu').css("left", left + "px")
    $('#menu').css("top", top + "px")
    var height = localStorage.getItem("menu-height");
    var width = localStorage.getItem("menu-width");
    if(height){
      $('#menu').css("height", height + "px")
    }else{
      $('#menu').css("height", "460px")
    }
    if(width){
      $('#menu').css("width", width + "px")
    }
    $('#menu').fadeIn();
    $("#menu-bar").html("TheDesk " + localStorage.getItem("ver"));
    $(".menu-content").addClass("hide");
    $("#add-box").removeClass("hide");
    $("#left-menu div").removeClass("active");
    $("#addColumnMenu").addClass("active");
  } else {
    $('#menu').fadeOut()
    $("#menu").removeClass("appear")
  }

}
$(function () {
  $("#menu").draggable({
    handle: "#menu-bar",
    stop: function () {
      var left = $('#menu').offset().left;
      if (left > $('body').width() - $('#menu').width()) {
        left = $('body').width() - $('#menu').width();
      } else if (left < 0) {
        left = 0;
      }
      var top = $('#menu').offset().top;
      if (top > $('body').height() - $('#menu').height()) {
        top = $('body').height() - $('#menu').height();
      } else if (top < 0) {
        top = 0;
      }
      localStorage.setItem("menu-left", left);
      localStorage.setItem("menu-top", top);
    }
  });
  $("#menu").resizable({
    minHeight: 150,
    minWidth: 200,
    stop: function (event, ui) {
      localStorage.setItem("menu-height", ui.size.height);
      localStorage.setItem("menu-width", ui.size.width);
    }
  });
});
function help() {
  $("#left-menu div").removeClass("active");
	$("#helpMenu").addClass("active");
	$(".menu-content").addClass("hide");
	$("#help-box").removeClass("hide");
  postMessage(["sendSinmpleIpc", "getLogs"], "*")
}