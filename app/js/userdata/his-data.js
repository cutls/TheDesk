//ユーザーデータ表示
//タイムライン
function utlShow(user, more, acct_id) {
	if (!acct_id) {
		var acct_id = $("#his-data").attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (user == "--now") {
		var user = $("#his-data").attr("user-id");
	}
	if (localStorage.getItem("mode_" + domain) != "misskey") {
		if (more) {
			var sid = $("#his-tl .cvo")
				.last()
				.attr("toot-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/accounts/" + user + "/statuses" + plus;
		var i = {
			method: "GET",
			headers: {
				"content-type": "application/json",
				Authorization: "Bearer " + at
			}
		};
	} else {
		var req = { i: at };
		if (more) {
			var sid = $("#his-tl .cvo")
				.last()
				.attr("toot-id");
			req.maxId = sid;
		}
		req.userId = user;
		var start = "https://" + domain + "/api/users/notes";
		var i = {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(req)
		};
	}
	fetch(start, i)
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			if (localStorage.getItem("mode_" + domain) == "misskey") {
				var templete = misskeyParse(json, "", acct_id, "user");
			} else {
				var templete = parse(json, "", acct_id, "user");
			}
			if (!json[0]) {
				templete = lang.lang_details_nodata + "<br>";
			}
			if (more) {
				$("#his-tl-contents").append(templete);
			} else {
				if (localStorage.getItem("mode_" + domain) != "misskey") {
					pinutl(templete, user, acct_id);
				} else {
					$("#his-tl-contents").html(templete);
				}
			}
			jQuery("time.timeago").timeago();
		});
}
function utlAdd() {
	var acct_id = $("#his-data").attr("use-acct");
	var user = $("#his-data").attr("user-id");
	var add = {
		domain: acct_id,
		type: 'utl',
		data: {
			id: user,
			acct: $("#his-acct").attr('fullname')
		}
	}
	var multi = localStorage.getItem('column')
	var obj = JSON.parse(multi)
	localStorage.setItem('card_' + obj.length, 'true')
	obj.push(add)
	var json = JSON.stringify(obj)
	localStorage.setItem('column', json)
	parseColumn('add')
	hisclose()
}
//ピン留めTL
function pinutl(before, user, acct_id) {
	if (!acct_id) {
		var acct_id = $("#his-data").attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (user == "--now") {
		var user = $("#his-data").attr("user-id");
	}
	var plus = "?pinned=1";
	var start = "https://" + domain + "/api/v1/accounts/" + user + "/statuses" + plus;
	fetch(start, {
		method: "GET",
		headers: {
			"content-type": "application/json",
			Authorization: "Bearer " + at
		}
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			var templete = parse(json, "pinned", acct_id, "user");
			if (!json[0]) {
				templete = "";
			}
			$("#his-tl-contents").html(templete + before);
			jQuery("time.timeago").timeago();
		});
}

//フォローリスト
function flw(user, more, acct_id) {
	if (!acct_id) {
		var acct_id = $("#his-data").attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (user == "--now") {
		var user = $("#his-data").attr("user-id");
	}
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		var req = { i: at };
		if (more) {
			var sid = $("#his-follow-list .cvo")
				.last()
				.attr("user-id");
			req.maxId = sid;
		}
		req.userId = user;
		var start = "https://" + domain + "/api/users/following";
		var i = {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(req)
		};
	} else {
		if (more) {
			var sid = $("#his-follow-list .cvo")
				.last()
				.attr("user-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/accounts/" + user + "/following" + plus;
		var i = {
			method: "GET",
			headers: {
				"content-type": "application/json",
				Authorization: "Bearer " + at
			}
		};
	}
	fetch(start, i)
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			if (localStorage.getItem("mode_" + domain) == "misskey") {
				var templete = misskeyUserparse(json, "", acct_id);
			} else {
				var templete = userparse(json, "", acct_id);
			}
			if (templete == "") {
				templete = lang.lang_details_nodata + "<br>";
			}
			if (more) {
				$("#his-follow-list-contents").append(templete);
			} else {
				$("#his-follow-list-contents").html(templete);
			}
			jQuery("time.timeago").timeago();
		});
}

//フォロワーリスト
function fer(user, more, acct_id) {
	if (!acct_id) {
		var acct_id = $("#his-data").attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (user == "--now") {
		var user = $("#his-data").attr("user-id");
	}
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		var req = { i: at };
		if (more) {
			var sid = $("#his-follower-list .cvo")
				.last()
				.attr("user-id");
			req.maxId = sid;
		}
		req.userId = user;
		var start = "https://" + domain + "/api/users/followers";
		var i = {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(req)
		};
	} else {
		if (more) {
			var sid = $("#his-follower-list .cvo")
				.last()
				.attr("user-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/accounts/" + user + "/followers" + plus;
		var i = {
			method: "GET",
			headers: {
				"content-type": "application/json",
				Authorization: "Bearer " + at
			}
		};
	}
	fetch(start, i)
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			if (localStorage.getItem("mode_" + domain) == "misskey") {
				var templete = misskeyUserparse(json, "", acct_id);
			} else {
				var templete = userparse(json, "", acct_id);
			}
			if (templete == "") {
				templete = lang.lang_details_nodata + "<br>";
			}
			if (more) {
				$("#his-follower-list-contents").append(templete);
			} else {
				$("#his-follower-list-contents").html(templete);
			}
			jQuery("time.timeago").timeago();
		});
}

//以下自分のみ
//お気に入り一覧
function showFav(more, acct_id) {
	if (!acct_id) {
		var acct_id = $("#his-data").attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (localStorage.getItem("mode_" + domain) != "misskey") {
		if (more) {
			var sid = $("#his-fav-list .cvo")
				.last()
				.attr("toot-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/favourites" + plus;
		var i = {
			method: "GET",
			headers: {
				"content-type": "application/json",
				Authorization: "Bearer " + at
			}
		};
	} else {
		var req = { i: at };
		if (more) {
			var sid = $("#his-fav-list .cvo")
				.last()
				.attr("toot-id");
			req.maxId = sid;
		}
		var start = "https://" + domain + "/api/i/favorites";
		var i = {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(req)
		};
	}

	fetch(start, i)
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			if (localStorage.getItem("mode_" + domain) != "misskey") {
				var templete = parse(json, "", acct_id, "user");
			} else {
				var templete = misskeyParse(json, "", acct_id, "user");
			}
			if (!json[0]) {
				templete = lang.lang_details_nodata + "<br>";
			}
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
		var acct_id = $("#his-data").attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		var req = { i: at };
		if (more) {
			var sid = $("#his-muting-list .cvo")
				.last()
				.attr("user-id");
			req.maxId = sid;
		}
		var start = "https://" + domain + "/api/mute/list";
		var i = {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(req)
		};
	} else {
		if (more) {
			var sid = $("#his-muting-list .cvo")
				.last()
				.attr("user-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/mutes" + plus;
		var i = {
			method: "GET",
			headers: {
				"content-type": "application/json",
				Authorization: "Bearer " + at
			}
		};
	}

	fetch(start, i)
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			if (!json[0]) {
				templete = lang.lang_details_nodata + "<br>";
			}
			var templete = userparse(json, "", acct_id);
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
		var acct_id = $("#his-data").attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		$("#his-blocking-list-contents").html(lang.lang_hisdata_notonmisskey + "<br>");
		return false;
	}
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (more) {
		var sid = $("#his-blocking-list .cvo")
			.last()
			.attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/blocks" + plus;
	fetch(start, {
		method: "GET",
		headers: {
			"content-type": "application/json",
			Authorization: "Bearer " + at
		}
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			if (!json[0]) {
				templete = lang.lang_details_nodata + "<br>";
			}
			var templete = userparse(json, "", acct_id);
			if (more) {
				$("#his-blocking-list-contents").append(templete);
			} else {
				$("#his-blocking-list-contents").html(templete);
			}
			jQuery("time.timeago").timeago();
		});
}

//フォロリクリスト
function showReq(more, acct_id) {
	if (!acct_id) {
		var acct_id = $("#his-data").attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		var req = { i: at };
		if (more) {
			var sid = $("#his-request-list .cvo")
				.last()
				.attr("user-id");
			req.maxId = sid;
		}
		var start = "https://" + domain + "/following/requests/list";
		var i = {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify(req)
		};
	} else {
		if (more) {
			var sid = $("#his-request-list .cvo")
				.last()
				.attr("user-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/follow_requests" + plus;
		var i = {
			method: "GET",
			headers: {
				"content-type": "application/json",
				Authorization: "Bearer " + at
			}
		};
	}
	fetch(start, i)
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			if (localStorage.getItem("mode_" + domain) != "misskey") {
				var templete = userparse(json, "request", acct_id);
			} else {
				var templete = misskeyUserparse(json, true, acct_id);
			}

			if (!json[0]) {
				templete = lang.lang_details_nodata + "<br>";
			}
			if (more) {
				$("#his-request-list-contents").append(templete);
			} else {
				$("#his-request-list-contents").html(templete);
			}
			jQuery("time.timeago").timeago();
		});
}

//ドメインブロックリスト
function showDom(more, acct_id) {
	if (!acct_id) {
		var acct_id = $("#his-data").attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		$("#his-domain-list-contents").html(lang.lang_hisdata_notonmisskey + "<br>");
		return false;
	}
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (more) {
		var sid = $("#his-domain-list .cvo")
			.last()
			.attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/domain_blocks" + plus;
	fetch(start, {
		method: "GET",
		headers: {
			"content-type": "application/json",
			Authorization: "Bearer " + at
		}
		//body: JSON.stringify({})
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			var templete = "";
			if (!json[0]) {
				templete = lang.lang_details_nodata + "<br>";
			}
			Object.keys(json).forEach(function(key) {
				var domain = json[key];
				templete = templete + domain + '<i class="material-icons gray pointer" onclick="domainblock(\'' + domain + "','DELETE')\">cancel</i>" + '<div class="divider"></div>';
			});
			if (more) {
				$("#his-domain-list-contents").append(templete);
			} else {
				$("#his-domain-list-contents").html(templete);
			}
		});
}

//フォローレコメンデーションリスト
function showFrl(more, acct_id) {
	if (!acct_id) {
		var acct_id = $("#his-data").attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	if (localStorage.getItem("mode_" + domain) == "misskey") {
		$("#his-follow-recom-contents").html(lang.lang_hisdata_notonmisskey + "<br>");
		return false;
	}
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	if (more) {
		var sid = $("#his-follow-recom-list .cvo")
			.last()
			.attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/suggestions" + plus;
	fetch(start, {
		method: "GET",
		headers: {
			"content-type": "application/json",
			Authorization: "Bearer " + at
		}
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			$("#his-follow-recom-contents").html(lang.lang_details_nodata + "(" + lang.lang_hisdata_frcreq + ")<br>");
			console.error(error);
		})
		.then(function(json) {
			if (!json[0]) {
				console.warn("No suggestions(recommend) data");
				templete = lang.lang_details_nodata + "(" + lang.lang_hisdata_frcwarn + ")<br>";
			} else {
				var templete = userparse(json, "", acct_id);
			}

			if (more) {
				$("#his-follow-recom-contents").append(templete);
			} else {
				$("#his-follow-recom-contents").html(templete);
			}
			jQuery("time.timeago").timeago();
		});
}
//Keybase
function udAdd(acct_id, id, start) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var proof = "https://" + domain + "/api/v1/accounts/" + id + "/identity_proofs";
	fetch(proof, {
		method: "GET",
		headers: {
			"content-type": "application/json",
			Authorization: "Bearer " + at
		}
		//body: JSON.stringify({})
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			var fields = json;
			for (var i = 0; i < fields.length; i++) {
				var html = '<a href="' + fields[i].proof_url + '" target="_blank" class="cbadge teal waves-effect" style="max-width:15.4rem;" title="' + lang.lang_hisdata_key.replace("{{set}}", escapeHTML(fields[i].provider)) + '"><i class="fas fa-key" aria-hidden="true"></i>' + escapeHTML(fields[i].provider) + ":" + escapeHTML(fields[i].provider_username) + "</a>";
				$("#his-proof-prof").append(html);
			}
		});
	fetch("https://notestock.osa-p.net/api/v1/isstock.json?id=" + start.replace("@", "users/"), {
		method: "GET",
		headers: {
			Accept: "application/json"
		}
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text);
				});
			}
			return response.json();
		})
		.catch(function(error) {
			todo(error);
			setLog(start, "JSON", error);
			console.error(error);
		})
		.then(function(json) {
			if (json.user.public_view) {
				var html = '<a href="' + json.user.url + '" target="_blank" class="cbadge purple waves-effect" style="max-width:15.4rem;" title="Notestock">Notestock</a>';
				$("#his-proof-prof").append(html);
			}
		});
}
