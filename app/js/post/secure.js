/*保護系*/
//画像保護
function nsfw() {
	if ($("#nsfw").hasClass("nsfw-avail")) {
		$("#nsfw").removeClass("yellow-text");
		$("#nsfw").html("visibility_off");
		$("#nsfw").removeClass("nsfw-avail");
	} else {
		$("#nsfw").addClass("yellow-text");
		$("#nsfw").html("visibility");
		$("#nsfw").addClass("nsfw-avail");
	}
}

//投稿公開範囲
function vis(set) {
	$("#vis").text(set);
	$("#vis-icon").removeClass("red-text");
	$("#vis-icon").removeClass("orange-text");
	$("#vis-icon").removeClass("blue-text");
	$("#vis-icon").removeClass("purple-text");
	$("#vis-icon").removeClass("light-blue-text");
	$("#vis-icon").removeClass("teal-text");
	if (set == "public") {
		$("#vis-icon").text("public");
		$("#vis-icon").addClass("purple-text");
	} else if (set == "unlisted") {
		$("#vis-icon").text("lock_open");
		$("#vis-icon").addClass("blue-text");
	} else if (set == "private") {
		$("#vis-icon").text("lock");
		$("#vis-icon").addClass("orange-text");
	} else if (set == "direct") {
		$("#vis-icon").text("mail");
		$("#vis-icon").addClass("red-text");
	} else if (set == "limited") {
		$("#vis-icon").text("group");
		$("#vis-icon").addClass("teal-text");
	} else if (set == "local") {
		$("#vis-icon").text("visibility");
		$("#vis-icon").addClass("light-blue-text");
	}
	var vis = localStorage.getItem("vis");
	if (vis == "memory") {
		var acct_id = $("#post-acct-sel").val();
		localStorage.setItem("vis-memory-" + acct_id, set);
	}
	$('.dropdown-button').dropdown('close');
}
function loadVis() {
	var vist = localStorage.getItem("vis");
	if (!vist) {
		vis("public");
	} else {
		if (vist == "memory") {
			var acct_id = $("#post-acct-sel").val();
			var memory = localStorage.getItem("vis-memory-" + acct_id);
			if (!memory) {
				memory = "public";
			}
			vis(memory);
		} else if (vist == "useapi") {
			var acct_id = $("#post-acct-sel").val();
			var multi = localStorage.getItem("multi");
			var obj = JSON.parse(multi);
			var memory = obj[acct_id]["vis"];
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

//コンテントワーニング
function cw() {
	if ($("#cw").hasClass("cw-avail")) {
		$("#cw-text").val();
		$("#cw-text").hide();
		$("#cw").removeClass("yellow-text");
		$("#cw").removeClass("cw-avail");
	} else {
		$("#cw-text").show();
		$("#cw").addClass("yellow-text");
		$("#cw").addClass("cw-avail");
		var cwt = localStorage.getItem("cw-text");
		if (cwt) {
			$("#cw-text").val(cwt);
		}
	}
}
//TLでコンテントワーニングを表示トグル
function cw_show(id) {
	$(".cw_hide_" + id).toggleClass("cw");
	$(".cw-long-" + id).toggleClass("hide");
}
$(function () {
	$('#cw-text').on('change', function (event) {
		var acct_id = $("#post-acct-sel").val();
		var domain = localStorage.getItem("domain_" + acct_id);
		var cwlen = $('#cw-text').val().length;

		if (idata[domain + "_letters"]) {
			$("#textarea").attr("data-length", idata[domain + "_letters"] - cwlen)
		} else {
			$("#textarea").attr("data-length", 500 - cwlen)
		}


	});
});
//スケジュール
function schedule() {
	if ($("#sch-box").hasClass("sch-avail")) {
		$("#sch-box").hide();
		$("#sch-box").removeClass("sch-avail");
	} else {
		var date = new Date();

		$("#sch-box").show();
		$("#sch-date").val(formattime(date));
		$("#sch-box").addClass("sch-avail");
	}
}
