/*ささやきボックス(Cr民並感)*/
//✕隠す
function hide() {
	$('#post-box').removeClass("appear")
	$('#post-box').animate({
		'bottom': "-500px"
	});
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
	$("#textarea").focus();
	$('#post-box').addClass("appear")
	$('#post-box').css("left",$('#posttgl').position().left+"px");
	$('#post-box').animate({
		'bottom': 0
	});
}



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
$('#posttgl').focusin(function(e) {
	if(!$('#post-box').hasClass("appear")){
		show();
	}
});

$("#timeline-container,#group").click(function(e) {
	if($('#post-box').hasClass("appear") && !localStorage.getItem("nohide")){
		hide();
	}
	localStorage.removeItem("nohide")
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
