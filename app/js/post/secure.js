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
	$("#vis-icon").removeClass("red");
	$("#vis-icon").removeClass("orange");
	$("#vis-icon").removeClass("blue");
	$("#vis-icon").removeClass("purple");
	if(set=="public"){
		$("#vis-icon i").text("public");
		$("#vis-icon").addClass("purple");
	}else if(set=="unlisted"){
		$("#vis-icon i").text("lock_open");
		$("#vis-icon").addClass("blue");
	}else  if(set=="private"){
		$("#vis-icon i").text("lock");
		$("#vis-icon").addClass("orange");
	}else  if(set=="direct"){
		$("#vis-icon i").text("mail");
		$("#vis-icon").addClass("red");
	}else  if(set=="limited"){
		$("#vis-icon i").text("group");
		$("#vis-icon").addClass("teal");
	}
	var vis=localStorage.getItem("vis");
		if(vis=="memory"){
			localStorage.setItem("vis-memory",set);
		}
}
function loadVis(){
		var vist = localStorage.getItem("vis");
		if (!vist) {
			vis("public");
		} else {
			if (vist == "memory") {
				var memory = localStorage.getItem("vis-memory");
				if (!memory) {
					memory = "public";
				}
				vis(memory);
			} else {
				vis(vist);
			}
	}
}
loadVis();

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
	$(".cw-long-"+id).toggleClass("hide");
}