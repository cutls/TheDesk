//お気に入り登録やブースト等、フォローやブロック等
//お気に入り登録
function fav(id, acct_id, remote) {
	if ($("#pub_" + id).hasClass("faved")) {
		var flag = "unfavourite";
	} else {
		var flag = "favourite";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send();
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			if (remote != "remote") {
				//APIのふぁぼカウントがおかしい
				if ($("[toot-id=" + id + "] .fav_ct").text() == json.favourites_count) {
					if (flag == "unfavourite") {
						var fav = json.favourites_count - 1;
					} else {
						var fav = json.favourites_count + 1;
						//var fav = json.favourites_count;
					}
				} else {
					var fav = json.favourites_count;
				}
				$("[toot-id=" + id + "] .fav_ct").text(fav);
				if (!json.reblog) {
				} else {
					$("[toot-id=" + id + "] .rt_ct").text(fav);
				}
				if ($("[toot-id=" + id + "]").hasClass("faved")) {
					$("[toot-id=" + id + "]").removeClass("faved");
					$(".fav_" + id).removeClass("yellow-text");
				} else {
					$("[toot-id=" + id + "]").addClass("faved");
					$(".fav_" + id).addClass("yellow-text");
				}
			} else {
				M.toast({ html: lang.lang_status_favWarn, displayLength: 1000 })
			}
		}
	}
}

//ブースト
function rt(id, acct_id, remote, vis) {
	if ($("#pub_" + id).hasClass("rted")) {
		var flag = "unreblog";
	} else {
		var flag = "reblog";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	if(vis){
		httpreq.send(JSON.stringify({visibility: vis}));
	}else{
		httpreq.send();
	}
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			console.log(["Success: boost", json]);
			if (remote != "remote") {
				$("[toot-id=" + id + "] .fav_ct").text(json.favourites_count);
				if (!json.reblog) {
					if (flag == "unreblog") {
						var rt = json.reblogs_count - 1;
					} else {
						var rt = json.reblogs_count + 1;
					}
					$("[toot-id=" + id + "] .rt_ct").text(rt);
				} else {
					$("[toot-id=" + id + "] .rt_ct").text(json.reblog.reblogs_count);
				}

				if ($("[toot-id=" + id + "]").hasClass("rted")) {
					$("[toot-id=" + id + "]").removeClass("rted");
					$(".rt_" + id).removeClass("light-blue-text");
				} else {
					$("[toot-id=" + id + "]").addClass("rted");
					$(".rt_" + id).addClass("light-blue-text");
				}
			} else {
				M.toast({ html: lang.lang_status_btWarn, displayLength: 1000 })
			}
		}
	}
}
function boostWith(vis){
	var id = $("#tootmodal").attr("data-id");
	var acct_id = $("#tootmodal").attr("data-acct");
	rt(id, acct_id, false, vis)
}

//フォロー
function follow(acct_id, remote) {
	if (!acct_id && acct_id != "selector") {
		var acct_id = $('#his-data').attr("use-acct");
	} else if (acct_id == "selector") {
		var acct_id = $("#user-acct-sel").val();
	}
	if (!remote && $("#his-data").hasClass("following")) {
		var flag = "unfollow";
		var flagm = "delete";
	} else {
		var flag = "follow";
		var flagm = "create";
	}
	var id = $("#his-data").attr("user-id");
	if (!remote) {
		var remote = $("#his-data").attr("remote");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var user = $("#his-acct").text();
	var start = "https://" + domain + "/api/v1/accounts/" + id + "/" + flag;
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		var start = "https://" + domain + "/api/following/" + flagm;
		var ent = { "i": at, "userId": id }
	} else if (remote == "true" && flag == "follow") {
		var ent = {}
	}
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send(JSON.stringify(ent));
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			console.log(["Success: folllow", json]);
			if ($("#his-data").hasClass("following")) {
				$("#his-data").removeClass("following");
				$("#his-follow-btn").text(lang.lang_status_follow);
			} else {
				$("#his-data").addClass("following");
				$("#his-follow-btn").text(lang.lang_status_unfollow);
			}
		}
	}
}

//ブロック
function block(acct_id) {
	if ($("#his-data").hasClass("blocking")) {
		var flag = "unblock";
		var txt = lang.lang_status_unmute
	} else {
		var flag = "block";
		var txt = lang.lang_status_block
	}
	Swal.fire({
		title: txt,
		text: "",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no
	}).then((result) => {
		if (result.value) {
			if (!acct_id) {
				var acct_id = $('#his-data').attr("use-acct");
			}
			var id = $("#his-data").attr("user-id");
			var domain = localStorage.getItem("domain_" + acct_id);
			var at = localStorage.getItem("acct_" + acct_id + "_at");
			var start = "https://" + domain + "/api/v1/accounts/" + id + "/" + flag;
			var httpreq = new XMLHttpRequest();
			httpreq.open('POST', start, true);
			httpreq.setRequestHeader('Content-Type', 'application/json');
			httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
			httpreq.responseType = "json";
			httpreq.send();
			httpreq.onreadystatechange = function () {
				if (httpreq.readyState === 4) {
					if ($("#his-data").hasClass("blocking")) {
						$("#his-data").removeClass("blocking");
						$("#his-block-btn").text(lang.lang_status_block);
					} else {
						$("#his-data").addClass("blocking");
						$("#his-block-btn").text(lang.lang_status_unblock);
					}
				}
			}
		}
	});
	
}

//ミュート
function muteDo(acct_id) {
	if ($("#his-data").hasClass("muting")) {
		var flag = "unmute";
		var flagm = "delete";
		var txt = lang.lang_status_unmute
	} else {
		var flag = "mute";
		var flagm = "create";
		var txt = lang.lang_status_mute
	}
	Swal.fire({
		title: txt,
		text: "",
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no
	}).then((result) => {
		if (result.value) {
			if (!acct_id) {
				var acct_id = $('#his-data').attr("use-acct");
			}
			var id = $("#his-data").attr("user-id");
			var domain = localStorage.getItem("domain_" + acct_id);
			var at = localStorage.getItem("acct_" + acct_id + "_at");
			if (localStorage.getItem("mode_" + domain) == "misskey") {
				var start = "https://" + domain + "/api/mute/" + flagm;
				var ent = { "i": at, "userId": id }
				var rq = JSON.stringify(ent);
			} else {
				var start = "https://" + domain + "/api/v1/accounts/" + id + "/" + flag;
				var rq = "";
			}
			var httpreq = new XMLHttpRequest();
			httpreq.open('POST', start, true);
			httpreq.setRequestHeader('Content-Type', 'application/json');
			httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
			httpreq.responseType = "json";
			httpreq.send(rq);
			httpreq.onreadystatechange = function () {
				if (httpreq.readyState === 4) {
					if ($("#his-data").hasClass("muting")) {
						$("#his-data").removeClass("muting");
						$("#his-mute-btn").text(lang.lang_status_mute);
					} else {
						$("#his-data").addClass("muting");
						$("#his-mute-btn").text(lang.lang_status_unmute);
					}
				}
			}
		}
	});
	
}

//投稿削除
function del(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		var start = "https://" + domain + "/api/notes/delete";
		var httpreq = new XMLHttpRequest();
		httpreq.open('POST', start, true);
		httpreq.setRequestHeader('Content-Type', 'application/json');
		httpreq.responseType = "json";
		httpreq.send(JSON.stringify({ i: at, noteId: id }));
		$("[toot-id=" + id + "]").hide();
		$("[toot-id=" + id + "]").remove();
	} else {
		var start = "https://" + domain + "/api/v1/statuses/" + id;
		var httpreq = new XMLHttpRequest();
		httpreq.open('DELETE', start, true);
		httpreq.setRequestHeader('Content-Type', 'application/json');
		httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
		httpreq.responseType = "json";
		httpreq.send();
	}
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
		}
	}
}
//redraft
function redraft(id, acct_id) {
	Swal.fire({
		title: lang.lang_status_redraftTitle,
		text: lang.lang_status_redraft,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no
	}).then((result) => {
		if (result.value) {
			show();
			del(id, acct_id);
			$("#post-acct-sel").prop("disabled", true);
			$("#post-acct-sel").val(acct_id);
			$('select').formSelect();
			mdCheck()
			var medias = $("[toot-id=" + id + "]").attr("data-medias");
			var vismode = $("[toot-id=" + id + "] .vis-data").attr("data-vis");
			vis(vismode);
			$("#media").val(medias);
			var ct = medias.split(",").length;
			$("[toot-id=" + id + "] img.toot-img").each(function (i, elem) {
				if (i < ct) {
					var url = $(elem).attr("src");
					console.log("Play back image data:" + url);
					$('#preview').append('<img src="' + url + '" style="width:50px; max-height:100px;">');
				}
			});
			var html = $("[toot-id=" + id + "] .toot").html();
			html = html.replace(/^<p>(.+)<\/p>$/, "$1");
			html = html.replace(/<br\s?\/?>/, "\n");
			html = html.replace(/<p>/, "\n");
			html = html.replace(/<\/p>/, "\n");
			html = html.replace(/<img[\s\S]*alt="(.+?)"[\s\S]*?>/g, "$1");
			html = $.strip_tags(html);
			localStorage.setItem("nohide", true);
			show();
			$("#textarea").val(html);
			var cwtxt = $("[toot-id=" + id + "] .cw_text").html();
			if (cwtxt != "") {
				cwtxt = $.strip_tags(cwtxt);
				cw();
				$("#cw-text").val(cwtxt);
			}
		}
	})
}
//ピン留め
function pin(id, acct_id) {
	if ($("#pub_" + id).hasClass("pined")) {
		var flag = "unpin";
	} else {
		var flag = "pin";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send();
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			console.log(["Success: pinned", json]);
			if ($("[toot-id=" + id + "]").hasClass("pined")) {
				$("[toot-id=" + id + "]").removeClass("pined");
				$(".pin_" + id).removeClass("blue-text");
			} else {
				$("[toot-id=" + id + "]").addClass("pined");
				$(".pin_" + id).addClass("blue-text");
			}
		}
	}
}

//フォロリク
function request(id, flag, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/follow_requests/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send();
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			console.log(["Success: request", "type:" + flag, json]);
			showReq();
		}
	}
}

//ドメインブロック(未実装)
function domainblock(add, flag, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/domain_blocks"
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send();
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			console.log(["Success: domain block", json]);
			showDom();
		}
	}
}

function addDomainblock() {
	var domain = $("#domainblock").val();
	domainblock(domain, 'POST');
}
//ユーザー強調
function empUser() {
	var usr = localStorage.getItem("user_emp");
	var obj = JSON.parse(usr);
	var id = $("#his-acct").attr("fullname");
	if (!obj) {
		var obj = [];
		obj.push(id);
		M.toast({ html: id + lang.lang_status_emphas, displayLength: 4000 })
	} else {
		var can;
		Object.keys(obj).forEach(function (key) {
			var usT = obj[key];
			if (usT != id && !can) {
				can = false;
			} else {
				can = true;
				obj.splice(key, 1);
				M.toast({ html: id + lang.lang_status_unemphas, displayLength: 4000 })
			}
		});
	}
	var json = JSON.stringify(obj);
	localStorage.setItem("user_emp", json);
}
//Endorse
function pinUser() {
	var id = $("#his-data").attr("user-id");
	var acct_id = $("#his-data").attr("use-acct");
	if ($("#his-end-btn").hasClass("endorsed")) {
		var flag = "unpin";
	} else {
		var flag = "pin";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/accounts/" + id + "/" + flag;
	var httpreq = new XMLHttpRequest();
	httpreq.open('POST', start, true);
	httpreq.setRequestHeader('Content-Type', 'application/json');
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
	httpreq.responseType = "json";
	httpreq.send();
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			if ($("#his-end-btn").hasClass("endorsed")) {
				$("#his-end-btn").removeClass("endorsed")
				$("#his-end-btn").text(lang.lang_status_endorse)
			} else {
				$("#his-end-btn").addClass("endorsed")
				$("#his-end-btn").text(lang.lang_status_unendorse)

			}
		}
	}
}
//URLコピー
function tootUriCopy(url) {
	execCopy(url);
	M.toast({ html: lang.lang_details_url, displayLength: 1500 })
}

//他のアカウントで…
function staEx(mode) {
	var url = $("#tootmodal").attr("data-url");
	var acct_id = $("#status-acct-sel").val();
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v2/search?resolve=true&q=" + url
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		}
	}).then(function (response) {
		return response.json();
	}).catch(function (error) {
		todo(error);
		console.error(error);
	}).then(function (json) {
		var id = json.statuses[0].id;
		if (mode == "rt") {
			rt(id, acct_id, 'remote')
		} else if (mode == "fav") {
			fav(id, acct_id, 'remote')
		} else if (mode == "reply") {
			reEx(id)
		}
	});
	return;
}
function toggleAction(id, tlid, acct_id) {
	if (tlid == "notf") {
		var tlide = "[data-acct=" + acct_id + "] .notf-timeline";
	} else if (tlid == "user") {
		var tlide = "#his-tl-contents";
	} else {
		var tlide = "[tlid=" + tlid + "]";
	}
	if (!$(tlide + " [toot-id=" + id + "]").hasClass("ext-mode")) {
		$(tlide + " [toot-id=" + id + "] .type-a").hide();
		$(tlide + " [toot-id=" + id + "] .type-b").show();
		$(tlide + " [toot-id=" + id + "]").addClass("ext-mode")
		$(tlide + " [toot-id=" + id + "] .act-icon").text("expand_less");
	} else {
		$(tlide + " [toot-id=" + id + "] .type-b").hide();
		$(tlide + " [toot-id=" + id + "] .type-a").show();
		$(tlide + " [toot-id=" + id + "]").removeClass("ext-mode")
		$(tlide + " [toot-id=" + id + "] .act-icon").text("expand_more");
	}

}