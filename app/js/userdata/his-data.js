//ユーザーデータ表示
//タイムライン
function utl(user, more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if (user == "--now") {
		var user = $('#his-data').attr("user-id");
	}
	if (more) {
		var sid = $("#his-tl .cvo").last().attr("toot-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/accounts/" + user + "/statuses" +
		plus
	fetch(start, {
		method: 'GET',
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
		var templete = parse(json, '', acct_id);
		var height = $("#his-data-content").height() - 245;
		$(".tab-content").css('height', height);
		if (more) {
			$("#his-tl-contents").append(templete);
		} else {
			pinutl(templete,user, acct_id)
		}
		jQuery("time.timeago").timeago();
	});
}
//ピン留めTL
function pinutl(before,user, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if (user == "--now") {
		var user = $('#his-data').attr("user-id");
	}
		var plus = "?pinned=1";
	var start = "https://" + domain + "/api/v1/accounts/" + user + "/statuses" +
		plus
	fetch(start, {
		method: 'GET',
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
		var templete = parse(json, '', acct_id);
		var height = $("#his-data-content").height() - 245;
		$(".tab-content").css('height', height);
			$("#his-tl-contents").html(templete+before);
		jQuery("time.timeago").timeago();
	});
}

//フォローリスト
function flw(user, more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if (user == "--now") {
		var user = $('#his-data').attr("user-id");
	}
	if (more) {
		var sid = $("#his-follow-list .cvo").last().attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/accounts/" + user + "/following" +
		plus
	fetch(start, {
		method: 'GET',
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
		var templete = userparse(json,'',acct_id);
		if (more) {
			$("#his-follow-list-contents").append(templete);
		} else {
			$("#his-follow-list-contents").html(templete);
		}


	});
}

//フォロワーリスト
function fer(user, more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if (user == "--now") {
		var user = $('#his-data').attr("user-id");
	}
	if (more) {
		var sid = $("#his-follower-list .cvo").last().attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/accounts/" + user + "/followers" +
		plus;
	fetch(start, {
		method: 'GET',
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
		var templete = userparse(json,'',acct_id);
		if (more) {
			$("#his-follower-list-contents").append(templete);
		} else {
			$("#his-follower-list-contents").html(templete);
		}

	});
}

//以下自分のみ
//お気に入り一覧
function showFav(more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if (more) {
		var sid = $("#his-fav-list .cvo").last().attr("toot-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/favourites" + plus
	fetch(start, {
		method: 'GET',
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
		var templete = parse(json, '', acct_id);
		if (more) {
			$("#his-fav-list-contents").append(templete);
		} else {
			$("#his-fav-list-contents").html(templete);
		}
		jQuery("time.timeago").timeago();
	});
}

//ミュートリスト
function showMut(more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if (more) {
		var sid = $("#his-muting-list .cvo").last().attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/mutes" + plus
	fetch(start, {
		method: 'GET',
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
		var templete = userparse(json,'',acct_id);
		if (more) {
			$("#his-muting-list-contents").append(templete);
		} else {
			$("#his-muting-list-contents").html(templete);
		}

	});
}

//ブロックリスト
function showBlo(more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if (more) {
		var sid = $("#his-blocking-list .cvo").last().attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/blocks" + plus
	fetch(start, {
		method: 'GET',
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
		var templete = userparse(json,'',acct_id);
		if (more) {
			$("#his-blocking-list-contents").append(templete);
		} else {
			$("#his-blocking-list-contents").html(templete);
		}

	});
}

//フォロリクリスト
function showReq(more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if (more) {
		var sid = $("#his-request-list .cvo").last().attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/follow_requests" + plus
	fetch(start, {
		method: 'GET',
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
		var templete = userparse(json, 'true',acct_id);
		if (more) {
			$("#his-request-list-contents").append(templete);
		} else {
			$("#his-request-list-contents").html(templete);
		}

	});
}

//ドメインブロックリスト
function showDom(more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	if (more) {
		var sid = $("#his-domain-list .cvo").last().attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/domain_blocks" + plus
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
		//body: JSON.stringify({})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		var templete = "";
		Object.keys(json).forEach(function(key) {
			var domain = json[key];
			templete = templete + domain +
				'<i class="material-icons gray pointer" onclick="domainblock(\'' +
				domain + '\',\'DELETE\')">cancel</i>' +
				'<div class="divider"></div>';
		});
		if (more) {
			$("#his-domain-list-contents").append(templete);
		} else {
			$("#his-domain-list-contents").html(templete);
		}

	});
}

