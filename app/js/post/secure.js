/*保護系*/
//画像保護
function nsfw(){
	if($("#nsfw").hasClass("nsfw-avail")){
		$("#nsfw").removeClass("yellow-text");
		$("#nsfw").html("visibility_off");
		$("#nsfw").removeClass("nsfw-avail");
	}else{
		$("#nsfw").addClass("yellow-text");
		$("#nsfw").html("visibility");
		$("#nsfw").addClass("nsfw-avail");
	}
}

//投稿公開範囲
function vis(set){
	$("#vis").text(set);
	$("#vis-icon").removeClass("red-text");
	$("#vis-icon").removeClass("orange-text");
	$("#vis-icon").removeClass("blue-text");
	$("#vis-icon").removeClass("purple-text");
	if(set=="public"){
		$("#vis-icon").text("public");
		$("#vis-icon").addClass("purple-text");
	}else if(set=="unlisted"){
		$("#vis-icon").text("lock_open");
		$("#vis-icon").addClass("blue-text");
	}else  if(set=="private"){
		$("#vis-icon").text("lock");
		$("#vis-icon").addClass("orange-text");
	}else  if(set=="direct"){
		$("#vis-icon").text("mail");
		$("#vis-icon").addClass("red-text");
	}else  if(set=="limited"){
		$("#vis-icon").text("group");
		$("#vis-icon").addClass("teal-text");
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
		$("#cw").removeClass("yellow-text");
		$("#cw").removeClass("cw-avail");
	}else{
		$("#cw-text").show();
		$("#cw").addClass("yellow-text");
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