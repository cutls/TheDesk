/*ささやきボックス(Cr民並感)*/
//✕隠す
function hide() {
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
	$('#post-box').css("left",localStorage.getItem("postbox-left")+"px")
	$('#post-box').css("top",localStorage.getItem("postbox-top")+"px")
	$('#post-box').fadeIn();
}

$(function() {
  $( "#post-box" ).draggable({handle: "#post-bar",
	stop: function() {
		console.log("stopped");
	  localStorage.setItem("postbox-left",$('#post-box').offset().left);
	  localStorage.setItem("postbox-top",$('#post-box').offset().top);
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

$("#timeline-container").click(function(e) {
	if(!$('#list-box').hasClass("hide")){
		$("#list-box").removeClass("show");
		$("#list-box").addClass("hide")
	}
	if(!$('#src-box').hasClass("hide")){
		$("#src-box").removeClass("show");
		$("#src-box").addClass("hide")
	}
	if(!$('#filter-box').hasClass("hide")){
		$("#filter-box").removeClass("show");
		$("#filter-box").addClass("hide")
	}
	if(!$('#add-box').hasClass("hide")){
		$("#add-box").removeClass("show");
		$("#add-box").addClass("hide")
	}
});
