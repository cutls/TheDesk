/*保護系*/
//画像保護
function nsfw(){
	if($("#nsfw").hasClass("nsfw-avail")){
		$("#nsfw").addClass("blue");
		$("#nsfw").removeClass("yellow");
		$("#nsi").html("lock_open");
		$("#nsfw").removeClass("nsfw-avail");
		$("#nsc").text("なし");
	}else{
		$("#nsfw").removeClass("blue");
		$("#nsfw").addClass("yellow");
		$("#nsi").html("lock_outline");
		$("#nsfw").addClass("nsfw-avail");
		$("#nsc").text("あり");
	}
}

//投稿公開範囲
function vis(set){
	$("#vis").text(set);
	var vis=localStorage.getItem("vis");
		if(vis=="memory"){
			localStorage.setItem("vis-memory",set);
		}
}

//コンテンツワーニング
function cw(){
	if($("#cw").hasClass("cw-avail")){
		$("#cw-text").val();
		$("#cw-text").hide();
		$("#cw").addClass("blue");
		$("#cw").removeClass("yellow");
		$("#cw").removeClass("cw-avail");
	}else{
		$("#cw-text").show();
		$("#cw").removeClass("blue");
		$("#cw").addClass("yellow");
		$("#cw").addClass("cw-avail");
		var cwt=localStorage.getItem("cw-text");
		if(cwt){
			$("#cw-text").val(cwt);
		}
	}
}
//TLでコンテンツワーニングを表示トグル
function cw_show(id){
	$(".cw_hide_"+id).toggleClass("cw");
}