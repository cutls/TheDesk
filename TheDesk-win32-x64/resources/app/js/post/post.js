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
	var media = $("#media").val();
	if ($("#nsfw").hasClass("nsfw-avail")) {
		var nsfw = "true";
	} else {
		var nsfw = "false";
	}
	var vis = $("#vis").text();
	if ($("#cw").hasClass("cw-avail")) {
		var spo = $("#cw-text").val();
	} else {
		var spo = "";
	}
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		body: JSON.stringify({
			status: str,
			in_reply_to_id: reply,
			media_ids: media.split(","),
			sensitive: nsfw,
			spoiler_text: spo,
			visibility: vis
		})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		var box = localStorage.getItem("box");
		if (box == "yes") {
			hide();
		}
		todc();
		clear();
	});
}

//クリア(Shift+C)
function clear() {
	$("#textarea").val("");
	$("#textarea").attr("placeholder", "象");
	$("#reply").val("");
	$("#media").val("");
	var cwt = localStorage.getItem("cw-text");
	if (cwt) {
		$("#cw-text").val(cwt);
	} else {
		$("#cw-text").val("");
	}
	$("#cw").addClass("blue");
	$("#cw").removeClass("yellow");
	$("#cw").removeClass("cw-avail");
	$("#rec").text("いいえ");
	$("#mec").text("なし");
	$("#post-acct-sel").prop("disabled", false);
	var vis = localStorage.getItem("vis");
	if (!vis) {
		$("#vis").text("public");
	} else {
		if (vis == "memory") {
			localStorage.setItem("vis-memory", $("#vis").text());
		} else {
			$("#vis").text(vis);
		}
	}
	$("#nsfw").addClass("blue");
	$("#nsfw").removeClass("yellow");
	$("#nsi").html("lock_open");
	$("#nsfw").removeClass("nsfw-avail");
	$("#nsc").text("なし");
	$("#drag").css("background-color", "#e0e0e0");
	$("#preview").html("");
	$("#toot-post-btn").prop("disabled", false);
	localStorage.removeItem("image");
	if ($("#post-box").hasClass("post-more")) {
		$("#file-wrap").html(
			'<input class="more-show" style="display:inline-block;" type="file" name="pic" id="upfile" onchange="pimg(document.getElementById(\'upfile\').files);" multiple>'
		);
	} else {
		$("#file-wrap").html(
			'<input class="more-show" type="file" name="pic" id="upfile" onchange="pimg(document.getElementById(\'upfile\').files);" multiple>'
		);
	}
}
