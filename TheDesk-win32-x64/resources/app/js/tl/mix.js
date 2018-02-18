//Integrated TL
function mixtl(acct_id, tlid) {
	var type = "mix";
	localStorage.removeItem("morelock")
	localStorage.setItem("now", type);
	todo("Integrated TL Loading...(Local)");
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	//まずLocal
	var start = "https://" + domain + "/api/v1/timelines/public?local=true";
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
		//パースして描画
		var templete = parse(json, 'mix', acct_id);
		$("#timeline_" + tlid).html(templete[0]);

		jQuery("time.timeago").timeago();
		$(window).scrollTop(0);
		var locals = templete[1];
		todo("Integrated TL Loading...(Home)");
		//Home
		var start = "https://" + domain + "/api/v1/timelines/home";
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
		}).then(function(obj) {
			//ホームのオブジェクトをUnix時間で走査
			Object.keys(obj).forEach(function(key) {
				var skey = obj.length - key - 1;
				var toot = obj[skey];
				var id = toot.id;
				var tarunix = date(toot.created_at, 'unix');
				var beforekey2;
				var key2;
				//ホームのオブジェクトに対してLocalのオブジェクトを時間走査
				Object.keys(locals).forEach(function(key2) {
					if (!$("#timeline_" + tlid + " [toot-id=" + obj[0].id + "]").length &&
						key2 < date(obj[0].created_at, 'unix')) {
						$("#timeline_" + tlid + " .cvo").first().before(parse([obj[0]],
							'home', acct_id)+'<div class="divider"></div>');
					}
					if (!$("#timeline_" + tlid + " [toot-id=" + toot.id + "]").length) {
						if (key2 > tarunix) {
							var local = locals[key2];
							console.log("#timeline_" + tlid + " [toot-id=" + local + "]");
							$("#timeline_" + tlid + " [toot-id=" + local + "]").after('<div class="divider"></div>'+parse(
								[toot], 'home', acct_id));
							tarunix = 0;
						}

					}
				});
			});
			todc();
			mixre(acct_id, tlid);
			additional(acct_id, tlid);
			jQuery("time.timeago").timeago();
		});
	});
}

//Streamingに接続
function mixre(acct_id, tlid) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var type = "mix";
	localStorage.setItem("now", type);
	var startHome = "wss://" + domain +
		"/api/v1/streaming/?stream=user&access_token=" + at;

	var startLocal = "wss://" + domain +
		"/api/v1/streaming/?stream=public:local&access_token=" + at;
	var wshid = websocketHome.length;
	var wslid = websocketLocal.length;
	websocketHome[wshid] = new WebSocket(startHome);
	websocketLocal[wslid] = new WebSocket(startLocal);
	websocketHome[wshid].onopen = function(mess) {
		console.log("Connect Streaming API(Home)");
	}
	websocketLocal[wslid].onopen = function(mess) {
		console.log("Connect Streaming API(Local)");
	}
	websocketLocal[wslid].onmessage = function(mess) {
		console.log("Receive Streaming API:");

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "delete") {
			$("[toot-id=" + obj + "]").hide();
		} else if (type == "update") {
			var templete = parse([obj], '', acct_id);
			if (!$("#timeline_" + tlid + " [toot-id=" + obj.id + "]").length) {
				var pool = localStorage.getItem("pool_" + tlid);
				if (pool) {
					pool = templete + pool;
				} else {
					pool = templete
				}
				localStorage.setItem("pool_" + tlid, pool);
				scrollck();
				additional(acct_id, tlid);
				jQuery("time.timeago").timeago();
				todc();
			}
		}
	}
	websocketHome[wshid].onmessage = function(mess) {
		console.log("Receive Streaming API:(Home)");

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "delete") {
			$("[toot-id=" + obj + "]").hide();
		} else if (type == "update") {
			var templete = parse([obj], '', acct_id);
			if (!$("#timeline_" + tlid + " [toot-id=" + obj.id + "]").length) {
				if ($(window).scrollTop() > 0) {
					var pool = localStorage.getItem("pool");
					if (pool) {
						pool = templete + pool;
					} else {
						pool = templete
					}
					localStorage.setItem("pool", pool);
				} else {
					$("#timeline_" + tlid).prepend(templete);
				}
				additional(acct_id, tlid);
				jQuery("time.timeago").timeago();
			}
		}
	}
	websocketLocal[wslid].onerror = function(error) {
		console.error('WebSocket Error ' + error);
	};
	websocketHome[wshid].onerror = function(error) {
		console.error('WebSocket Error ' + error);
	};
}

//ある程度のスクロールで発火
function mixmore(tlid) {
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	var acct_id = obj[tlid].domain;
	todo("Integrated TL MoreLoading...(Local)");
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var sid = $("#timeline_" + tlid + " .cvo").last().attr("toot-id");
	var start = "https://" + domain +
		"/api/v1/timelines/public?local=true&max_id=" + sid;
		console.log(start);
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
		var templete = parse(json, 'mix', acct_id);
		$("#timeline_" + tlid).append(templete[0]);
		var locals = templete[1];
		todo("Integrated TL MoreLoading...(Home)");
		console.log(sid);
		var start = "https://" + domain + "/api/v1/timelines/home?max_id=" + sid;
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
		}).then(function(obj) {
			if (!$("[toot-id=" + obj[0].id + "]").length) {
				$("#timeline_" + tlid + " .cvo").first().prepend(parse([obj[0]], 'home',
					acct_id));
			}
			Object.keys(obj).forEach(function(key) {
				var skey = obj.length - key - 1;
				var toot = obj[skey];
				var id = toot.id;
				var tarunix = date(toot.created_at, 'unix');
				var beforekey2;
				var key2;
				Object.keys(locals).forEach(function(key2) {
					if (!$("[toot-id=" + toot.id + "]").length) {
						if (key2 > tarunix) {
							var local = locals[key2];
							$("[toot-id=" + local + "]").append(parse([toot], 'home',
								acct_id));
							tarunix = 0;
						}

					}
				});
			});
			additional(acct_id, tlid);
			jQuery("time.timeago").timeago();
			todc();
		});
	});

}
