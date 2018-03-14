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
		var templete = parse(json, 'mix', acct_id, tlid);
		$("#timeline_" + tlid).html(templete[0]);

		jQuery("time.timeago").timeago();
		$(window).scrollTop(0);
		var locals = templete[1];
		var times = templete[2];
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
			if (!$("[toot-id=" + obj[0].id + "]").length) {
				$("#timeline_" + tlid + " .cvo").first().before(parse([obj[0]], 'home',
					acct_id));
					//delete obj[0];
			}
			//Localが遅すぎてHomeの全てより過去の場合
			var unixL=date(json[0].created_at,"unix");
			var unixH=date(obj[obj.length-1].created_at,"unix");
			//console.log(unixH+"vs"+unixL)
		if(unixH < unixL){
			Object.keys(obj).forEach(function(key) {
				var skey = obj.length - key - 1;
				var toot = obj[key];
				console.log(toot);
				var id = toot.id;
				if ($("#timeline_" + tlid + " [toot-id=" + toot.id + "]").length < 1) {
				//console.log(toot.id);
				var tarunix = date(toot.created_at, 'unix');
				var beforekey2;
				var key2;
				//console.log(locals)
				//ホームのオブジェクトに対してLocalのオブジェクトを時間走査
				Object.keys(times).forEach(function(key2) {
						if (times[key2] < tarunix) {
							var local = json[key2].id;
							//console.log($.strip_tags(toot.content));
							html = parse(
								[toot], 'home', acct_id, tlid);
							$("#timeline_" + tlid + " [toot-id=" + local + "]").before(html);
							//console.log("#timeline_" + tlid + " [toot-id=" + local + "]");
								tarunix = 0;
						}

				});
			}
			});
		}else{
			html = parse(
				obj, 'home', acct_id, tlid);
			$("#timeline_" + tlid).html(html);
		}
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
		$("#notice_icon_" + tlid).removeClass("red-text");
	}
	websocketLocal[wslid].onopen = function(mess) {
		console.log("Connect Streaming API(Local)");
		$("#notice_icon_" + tlid).removeClass("red-text");
	}
	websocketLocal[wslid].onmessage = function(mess) {
		console.log("Receive Streaming API:");

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "delete") {
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").hide();
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").remove();
		} else if (type == "update") {
			var templete = parse([obj], '', acct_id, tlid);
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
	websocketHome[wshid].onmessage = function(mess) {
		console.log("Receive Streaming API:(Home)");

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "delete") {
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").hide();
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").remove();
		} else if (type == "update") {
			var templete = parse([obj], '', acct_id, tlid);
				if (obj.visibility != "public" || obj.account.acct != obj.account.username) {
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
	var len = $("#timeline_" + tlid + " .cvo").length
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
		var templete = parse(json, 'mix', acct_id, tlid);
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
			if ($("[toot-id=" + obj[0].id + "]").length < 1) {
				$("#timeline_" + tlid + " .cvo").eq(len).before(parse([obj[0]], 'home',
					acct_id)+'<div class="divider"></div>');
					//delete obj[0];
			}
			Object.keys(obj).forEach(function(key) {
				var skey = obj.length - key - 1;
				var toot = obj[skey];
				var id = toot.id;
				var tarunix = date(toot.created_at, 'unix');
				var beforekey2;
				var key2;
				Object.keys(locals).forEach(function(key2) {
					if ($("[toot-id=" + toot.id + "]").length <1) {
						if (key2 > tarunix) {
							var local = locals[key2];
							$("#timeline_" + tlid + " [toot-id=" + local + "]").after(parse([toot], 'home',
								acct_id, tlid));
							tarunix = 2147483647;
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