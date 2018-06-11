/*ささやきボックス(Cr民並感)*/
//もっとボタン
function more() {
	$(".more-show").show();
	$(".more-hide").hide();
	$("#post-box").addClass("post-more");
}
//閉じるボタン
function less() {
	$(".more-show").hide();
	$(".more-hide").show();
	$("#post-box").removeClass("post-more");
}
//✕隠す
function hide() {
	$("#post-box").addClass("hidenbox");
	$("#post-box").fadeOut();
	$("#menu-btn").fadeIn();
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
	$("#post-box").removeClass("hidenbox");
	$("#post-box").fadeIn();
	$("#menu-btn").fadeOut();
}
//横幅
function zoomBox() {
	if ($("#post-box").hasClass("bigbox")) {
		$("#post-box").css('width', '350px');
		$("#post-box").removeClass("bigbox")
	} else {
		$("#post-box").css('width', '50vw');
		$("#post-box").addClass("bigbox")
	}
}
//サイドバー開閉
function xpand() {
	if ($("#sidebar").hasClass("xed")) {
		$(".side-label").show();
		$("#sidebar").css('width', '75px');
		$("#post-box").css('right', '78px');
		$("#sidebar").css('min-width', '75px');
		$("#sidebar .big-menu i").addClass('big-icon');
		$("#sidebar").removeClass("xed");
		$("#x-btn").text("keyboard_arrow_right");
		localStorage.removeItem("xed");
	} else {
		$("#sidebar").css('width', '29px');
		$("#sidebar").css('min-width', '29px');
		$("#post-box").css('right', '27px');
		$("#sidebar").addClass("xed");
		$("#sidebar .big-menu i").removeClass('big-icon');
		$(".side-label").hide();
		$("#x-btn").text("keyboard_arrow_left");
		localStorage.setItem("xed","true");
	}
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