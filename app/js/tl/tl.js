//TL取得
function tl(type, data, acct_id, tlid) {
	scrollevent();
	localStorage.removeItem("morelock");
	localStorage.removeItem("pool");
	var domain = localStorage.getItem("domain_" + acct_id);
	//タグの場合はカラム追加して描画
	if (tlid == "add") {
		console.log("add");
		var newtab = $(".box").length;
		var add = {
			domain: acct_id,
			type: "tag",
			data: data
		};
		var multi = localStorage.getItem("column");
		var obj = JSON.parse(multi);
		obj.push(add);
		console.log(obj);
		var json = JSON.stringify(obj);
		localStorage.setItem("column", json);
		parseColumn();
		return;
	}
	if (!type) {
		var type = localStorage.getItem("now");
		if (!type) {
			//デフォルト
			var type = "local";
		}
	}
	if (type == "mix") {
		//Integratedなら飛ばす
			$("#notice_" + tlid).text("Integrated TL(" + localStorage.getItem(
			"user_" + acct_id) + "@" + domain + ")");
		mixtl(acct_id, tlid);
		return;
	} else if (type == "notf") {
		//通知なら飛ばす
		notf(acct_id, tlid, 'direct');
		$("#notice_" + tlid).text(cap(type, data) + " TL(" + localStorage.getItem(
			"user_" + acct_id) + "@" + domain + ")");
		return;
	}
	localStorage.setItem("now", type);
	todo(cap(type) + " TL Loading...");
	var at = localStorage.getItem(domain + "_at");
	$("#notice_" + tlid).text(cap(type, data) + " TL(" + localStorage.getItem(
		"user_" + acct_id) + "@" + domain + ")");
	var start = "https://" + domain + "/api/v1/timelines/" + com(type, data);
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
		var templete = parse(json, '', acct_id);
		$("#timeline_" + tlid).html(templete);
		additional(acct_id, tlid);
		jQuery("time.timeago").timeago();
		todc();
		reload(type, '', acct_id, tlid);
		$(window).scrollTop(0);
	});
}

//Streaming接続
function reload(type, cc, acct_id, tlid) {
	if (!type) {
		var type = localStorage.getItem("now");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	localStorage.setItem("now", type);
	if (type == "home") {
		var start = "wss://" + domain +
			"/api/v1/streaming/?stream=user&access_token=" + at;
	} else if (type == "pub") {
		var start = "wss://" + domain +
			"/api/v1/streaming/?stream=public&access_token=" + at;
	} else if (type == "local") {
		var start = "wss://" + domain +
			"/api/v1/streaming/?stream=public:local&access_token=" + at;
	}
	console.log(start);
	var wsid = websocket.length;
	websocket[wsid] = new WebSocket(start);
	websocket[wsid].onopen = function(mess) {
		console.log(tlid + ":Connect Streaming API:" + type);
		console.log(mess);
	}
	websocket[wsid].onmessage = function(mess) {
		console.log(tlid + ":Receive Streaming API:");
		console.log(websocket[wsid]);


		var typeA = JSON.parse(mess.data).event;
		if (typeA == "delete") {
			var obj = JSON.parse(mess.data).payload;
			$("[toot-id=" + obj + "]").hide();
		} else if (typeA == "update") {
			var obj = JSON.parse(JSON.parse(mess.data).payload);
			console.log(obj);
			var templete = parse([obj], '', acct_id);
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
		websocket[wsid].onclose = function(mess) {
			console.log("Close Streaming API:" + type);
		}
	}
	websocket[wsid].onerror = function(error) {
		console.error('WebSocket Error ' + error);
	};
}

//一定のスクロールで発火
function moreload(type, tlid) {
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	var acct_id = obj[tlid].domain;
	if (!type) {
		var type = obj[tlid].type;
	}else{
		var data;
	}
	if(type=="tag"){
		var data=obj[tlid].data;
	}
	var sid = $("#timeline_" + tlid + " .cvo").last().attr("toot-id");
	console.log(localStorage.getItem("morelock") + ":" + sid)
	if (localStorage.getItem("morelock") != sid) {
		localStorage.setItem("morelock", sid);
		if (type == "mix") {
			mixmore(tlid);
			return;
		}
		localStorage.setItem("now", type);
		todo(cap(type) + " TL MoreLoading");
		var domain = localStorage.getItem("domain_" + acct_id);
		var at = localStorage.getItem(domain + "_at");
		var start = "https://" + domain + "/api/v1/timelines/" + com(type,data) +
			"max_id=" + sid;
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
			$("#timeline_" + tlid).append(templete);
			additional(acct_id, tlid);
			jQuery("time.timeago").timeago();
			todc();
		});
	}
}

//WebSocket切断
function tlCloser() {
	Object.keys(websocket).forEach(function(tlid) {
		if (websocketOld[tlid]) {
			websocketOld[tlid].close();
			console.log("Close Streaming API: Old" + tlid);
		}
		if (websocket[0]) {
			console.log(websocket[0]);
			websocket[tlid].close();
			console.log("Close Streaming API:" + tlid);
		}

	});
	websocket = [];
	Object.keys(websocketHome).forEach(function(tlid) {
		if (websocketHome[tlid]) {
			websocketHome[tlid].close();
			console.log("Close Streaming API:MixHome" + tlid);
		}

	});
	websocketHome = [];
	Object.keys(websocketLocal).forEach(function(tlid) {
		if (websocketLocal[tlid]) {
			websocketLocal[tlid].close();
			console.log("Close Streaming API:MixLocal" + tlid);
		}

	});
	websocketLocal = [];
	Object.keys(websocketNotf).forEach(function(tlid) {
		if (websocketNotf[tlid]) {
			websocketNotf[tlid].close();
			console.log("Close Streaming API:Notf" + tlid);
		}

	});
	websocketLocal = [];
}

//TLのタイトル
function cap(type, data) {
	if (type == "home") {
		return "Home"
	} else if (type == "local") {
		return "Local"
	} else if (type == "pub") {
		return "Public"
	} else if (type == "tag") {
		return "#" + data
	} else if (type == "list") {
		return "List(id:" + data + ")"
	} else if (type == "notf") {
		return "Notification"
	}
}

//TLのURL
function com(type, data) {
	if (type == "home") {
		return "home?"
	} else if (type == "local") {
		return "public?local=true&"
	} else if (type == "pub") {
		return "public?"
	} else if (type == "tag") {
		return "tag/" + data + "?"
	}
	if (type == "list") {
		return "list/" + data + "?"
	}
}
