/*投稿系*/
//投稿
function post() {
	if($("#toot-post-btn").prop("disabled")){
		return
	}
	var str = $("#textarea").val();
	var acct_id = $("#post-acct-sel").val();
	localStorage.setItem("last-use", acct_id);
	var domain = localStorage.getItem("domain_" + acct_id);
	if(domain=="theboss.tech"){
		if(~str.indexOf("#")){
			if(str.indexOf("#theboss_tech")=="-1"){
				if(!confirm(lang_post_tagTL[lang])){
					return false;
				}
			}
		}
	}
	if(domain=="dtp-mstdn.jp"){
		if(~str.indexOf("#")){
			if(str.indexOf("#dtp")=="-1"){
				if(!confirm(lang_post_tagTL[lang])){
					return false;
				}
			}
		}
	}
	if(domain=="misskey.xyz"){
		misskeyPost();
		return;
	}
	$("#toot-post-btn").prop("disabled", true);
	todo("Posting");
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
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
			if(str.indexOf(localStorage.getItem("stable"))==-1){
				localStorage.removeItem("stable")
			}
			var json = httpreq.response;
			console.log(json);
			var box = localStorage.getItem("box");
			if (box == "yes" || !box) {
				$("#textarea").blur();
				hide();
			}
			$("#toot-post-btn").prop("disabled", false);
			todc();
			clear();
		}
	}
}
function misskeyPost(){
	var str = $("#textarea").val();
	var acct_id = $("#post-acct-sel").val();
	localStorage.setItem("last-use", acct_id);
	var domain = "misskey.xyz"
	$("#toot-post-btn").prop("disabled", true);
	todo("Posting");
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	var start = "https://" + domain + "/api/notes/create";
	var reply = $("#reply").val();
	var toot={
		text: str
	}
	if(reply){
		if(reply.indexOf("renote")!== -1){
			toot.renoteId=reply.replace("renote_","")
		}else{
			toot.replyId=reply
		}
	}
	
	var media = $("#media").val();
	if(media){
		toot.mediaIds=media.split(",");
	}
	if ($("#nsfw").hasClass("nsfw-avail")) {
		var nsfw = "true";
		toot.sensitive=nsfw;
	} else {
		var nsfw = "false";
	}
	var vis = $("#vis").text();
	if(vis=="unlisted"){
		vis=="home"
	}else if(vis=="direct"){
		vis=="specified";
		toot.visibleUserIds=str.match(/@([a-zA-Z0-9_@.-]+)(\s|$)/g).join('').split("@");
	}
	if(vis!="inherit"){
		toot.visibility=vis;
	}
	if ($("#cw").hasClass("cw-avail")) {
		var spo = $("#cw-text").val();
		cw();
		toot.cw=spo;
	} else {
		var spo = "";
	}
	toot.i=at;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.responseType = 'json';
	httpreq.send(JSON.stringify(toot));
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState == 4) {
			if(str.indexOf(localStorage.getItem("stable"))==-1){
				localStorage.removeItem("stable")
			}
			var json = httpreq.response;
			console.log(json);
			var box = localStorage.getItem("box");
			if (box == "yes") {
				hide();
			}else if (box == "hide"){
				$("body").addClass("mini-post");
				$(".mini-btn").text("expand_less");
			}
			$("#toot-post-btn").prop("disabled", false);
			todc();
			clear();
		}
	}
}

//クリア(Shift+C)
function clear() {
	$("#textarea").val("");
	if(localStorage.getItem("stable")){
		$("#textarea").val(localStorage.getItem("stable"));
	}
	$("#textarea").attr("placeholder", lang_toot[lang]);
	$("#reply").val("");
	$("#media").val("");
	var cwt = localStorage.getItem("cw-text");
	if (cwt) {
		$("#cw-text").val(cwt);
	} else {
		$("#cw-text").val("");
	}
	var acw = localStorage.getItem("always-cw");
	if (acw != "yes") {
		$("#cw").removeClass("yellow-text");
		$("#cw").removeClass("cw-avail");
		$("#cw-text").hide();
	}else{
		$("#cw").addClass("yellow-text");
		$("#cw").addClass("cw-avail");
		$("#cw-text").show();
	}
	$("#rec").text(lang_no[lang]);
	$("#mec").text(lang_nothing[lang]);
	loadVis();
	$("#nsfw").removeClass("yellow-text");
	$("#nsfw").html("visibility_off");
	$("#nsfw").removeClass("nsfw-avail");
	$("#nsc").text(lang_nothing[lang]);
	$("#drag").css("background-color", "#e0e0e0");
	$("#preview").html("");
	$("#toot-post-btn").prop("disabled", false);
	$("#post-acct-sel").prop("disabled", false);
	localStorage.removeItem("image");
	if(localStorage.getItem("mainuse")=="main"){
		$("#post-acct-sel").val(localStorage.getItem("main"));
	}
	$('select').material_select();
}