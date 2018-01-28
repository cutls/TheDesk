//お気に入り登録やブースト等、フォローやブロック等
//お気に入り登録
function fav(id, acct_id) {
	if ($("#pub_" + id).hasClass("faved")) {
		var flag = "unfavourite";
	} else {
		var flag = "favourite";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/" + flag;
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		body: JSON.stringify({})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		$("#pub_" + id + " .fav_ct").text(json.favourites_count);
		if (!json.reblog) {
			$("#pub_" + id + " .rt_ct").text(json.reblogs_count - 1);
		} else {
			$("#pub_" + id + " .rt_ct").text(json.reblog.reblogs_count);
		}
		if ($("#pub_" + id).hasClass("faved")) {
			$("#pub_" + id).removeClass("faved");
			$("#fav_" + id).removeClass("yellow-text");
		} else {
			$("#pub_" + id).addClass("faved");
			$("#fav_" + id).addClass("yellow-text");
		}
	});
}

//ブースト
function rt(id, acct_id) {
	if ($("#pub_" + id).hasClass("rted")) {
		var flag = "unreblog";
	} else {
		var flag = "reblog";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/" + flag;
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		body: JSON.stringify({})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		$("#pub_" + id + " .fav_ct").text(json.favourites_count);
		if (!json.reblog) {
			$("#pub_" + id + " .rt_ct").text(json.reblogs_count - 1);
		} else {
			$("#pub_" + id + " .rt_ct").text(json.reblog.reblogs_count);
		}

		if ($("#pub_" + id).hasClass("rted")) {
			$("#pub_" + id).removeClass("rted");
			$("#rt_" + id).removeClass("teal-text");
		} else {
			$("#pub_" + id).addClass("rted");
			$("#rt_" + id).addClass("teal-text");
		}
	});
}

//フォロー
function follow(acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var id = $("#his-data").attr("user-id");
	if ($("#his-data").hasClass("following")) {
		var flag = "unfollow";
	} else {
		var flag = "follow";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/accounts/" + id + "/" + flag;
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		body: JSON.stringify({})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if ($("#his-data").hasClass("following")) {
			$("#his-data").removeClass("following");
			$("#his-follow-btn").text("フォロー");
		} else {
			$("#his-data").addClass("following");
			$("#his-follow-btn").text("フォロー解除");
		}
	});
}

//ブロック
function block(acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var id = $("#his-data").attr("user-id");
	if ($("#his-data").hasClass("blocking")) {
		var flag = "unblock";
	} else {
		var flag = "block";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/accounts/" + id + "/" + flag;
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		body: JSON.stringify({})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if ($("#his-data").hasClass("blocking")) {
			$("#his-data").removeClass("blocking");
			$("#his-block-btn").text("ブロック");
		} else {
			$("#his-data").addClass("blocking");
			$("#his-block-btn").text("ブロック解除");
		}
	});
}

//ミュート
function mute(acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var id = $("#his-data").attr("user-id");
	if ($("#his-data").hasClass("muting")) {
		var flag = "unmute";
	} else {
		var flag = "mute";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/accounts/" + id + "/" + flag;
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		body: JSON.stringify({})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if ($("#his-data").hasClass("muting")) {
			$("#his-data").removeClass("muting");
			$("#his-mute-btn").text("ミュート");
		} else {
			$("#his-data").addClass("muting");
			$("#his-mute-btn").text("ミュート解除");
		}
	});
}

//投稿削除
function del(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id;
	fetch(start, {
		method: 'DELETE',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		//ここで消さなくてもStreamingが消す
		//$("#pub_"+id).hide();
	});
}

//フォロリク
function request(id, flag, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/follow_requests/" + id + "/" + flag;
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		body: JSON.stringify({})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		showReq();
	});
}

//ドメインブロック(未実装)
function domainblock(add, flag, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/domain_blocks"
	fetch(start, {
		method: flag,
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		body: JSON.stringify({
			domain: add
		})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		showDom();
	});
}

function addDomainblock() {
	var domain = $("#domainblock").val();
	domainblock(domain, 'POST');
}
