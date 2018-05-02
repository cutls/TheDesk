/*投稿系*/
//投稿
function post() {
	var str = $("#textarea").val();
	var acct_id = $("#post-acct-sel").val();
	localStorage.setItem("last-use", acct_id);
	todo("Posting");
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses";
	var reply = $("#reply").val();
	var toot={
		status: str
	}
	if(reply){
		toot.in_reply_to_id=reply
	}
	var media = $("#media").val();
	if(media){
		toot.media_ids=media.split(",");
	}
	if ($("#nsfw").hasClass("nsfw-avail")) {
		var nsfw = "true";
		toot.sensitive=nsfw;
	} else {
		var nsfw = "false";
	}
	var vis = $("#vis").text();
	if(vis!="inherit"){
		toot.visibility=vis;
	}
	if ($("#cw").hasClass("cw-avail")) {
		var spo = $("#cw-text").val();
		cw();
		toot.spoiler_text=spo;
	} else {
		var spo = "";
	}
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = 'json';
	httpreq.send(JSON.stringify(toot));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			var json = httpreq.response;
			console.log(json);
			var box = localStorage.getItem("box");
			if (box == "yes") {
				hide();
			}else if (box == "hide"){
				$("body").addClass("mini-post");
				$(".mini-btn").text("expand_less");
			}
			todc();
			clear();
		}
	}
}

//クリア(Shift+C)
function clear() {
	$("#textarea").val("");
	$("#textarea").attr("placeholder", "");
	$("#reply").val("");
	$("#media").val("");
	var cwt = localStorage.getItem("cw-text");
	if (cwt) {
		$("#cw-text").val(cwt);
	} else {
		$("#cw-text").val("");
	}
	$("#cw").removeClass("yellow-text");
	$("#cw").removeClass("cw-avail");
	$("#rec").text("いいえ");
	$("#mec").text("なし");
	var vist = localStorage.getItem("vis");
	if (!vist) {
		vis("public");
	} else {
		if (vist == "memory") {
			localStorage.setItem("vis-memory", $("#vis").text());
		} else {
			vis(vist);
		}
	}
	$("#nsfw").removeClass("yellow-text");
	$("#nsfw").html("visibility_off");
	$("#nsfw").removeClass("nsfw-avail");
	$("#nsc").text("なし");
	$("#drag").css("background-color", "#e0e0e0");
	$("#preview").html("");
	$("#toot-post-btn").prop("disabled", false);
	$("#post-acct-sel").prop("disabled", false);
	$('select').material_select();
	localStorage.removeItem("image");
}