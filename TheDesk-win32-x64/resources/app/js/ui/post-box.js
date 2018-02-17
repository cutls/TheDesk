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
