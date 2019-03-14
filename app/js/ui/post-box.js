/*ささやきボックス(Cr民並感)*/
//✕隠す
function hide() {
	$("#right-side").hide()
	$('#post-box').fadeOut()
	$("#post-box").removeClass("appear")
	$("#emoji").addClass("hide")
}
//最小化
function mini() {
	$("body").toggleClass("mini-post");
	if($("body").hasClass("mini-post")){
		$(".mini-btn").text("expand_less");
	}else{
		$(".mini-btn").text("expand_more");
	}
}
//最小化時に展開
function show() {
	$("#post-box").addClass("appear")
	$("#textarea").focus();
	console.log("show"+localStorage.getItem("postbox-left"));
	var left=localStorage.getItem("postbox-left");
	if(left>$('body').width()-$('#post-box').width()){
	  left=$('body').width()-$('#post-box').width();
	}else if(left<0){
		left=0;
	}
	var top=localStorage.getItem("postbox-top");
	if(top>$('body').height()-$('#post-box').height()){
		top=$('body').height()-$('#post-box').height();
	}else if(top<0){
		top=0;
	}
	$('#post-box').css("left",left+"px")
	$('#post-box').css("top",top+"px")
	$('#post-box').fadeIn();
}

$(function() {
  $( "#post-box" ).draggable({handle: "#post-bar",
	stop: function() {
	var left=$('#post-box').offset().left;
	if(left>$('body').width()-$('#post-box').width()){
	  left=$('body').width()-$('#post-box').width();
	}else if(left<0){
		left=0;
	}
	var top=$('#post-box').offset().top;
	if(top>$('body').height()-$('#post-box').height()){
		top=$('body').height()-$('#post-box').height();
	}else if(top<0){
		top=0;
	}
	  localStorage.setItem("postbox-left",left);
	  localStorage.setItem("postbox-top",top);
	}
  });
});

//コード受信
if(location.search){
	var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/);
	var mode=m[1];
	var codex=m[2];
	if(mode=="share"){
		console.log(codex);
		$('textarea').focus();
		$("#textarea").val(decodeURI(codex));
		show();
		$("body").removeClass("mini-post");
		$(".mini-btn").text("expand_less");
	}
}
$('#posttgl').click(function(e) {
	if(!$('#post-box').hasClass("appear")){
		show();
	}else{
		hide();
	}
});

$("#timeline-container,#group").click(function(e) {

	if(localStorage.getItem("box")!="absolute"){
		if($('#post-box').hasClass("appear") && !localStorage.getItem("nohide")){
			hide();
		}
	}
	localStorage.removeItem("nohide")
});
$('#textarea,#cw-text').focusout(function(e) {
	localStorage.setItem("nohide",true)
	var countup = function(){
		localStorage.removeItem("nohide")
	} 
	//setTimeout(remove, 100);
});