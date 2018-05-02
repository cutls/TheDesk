//TL取得
function tl(type, data, acct_id, tlid) {
	scrollevent();
	localStorage.removeItem("morelock");
	localStorage.removeItem("pool");
	var domain = localStorage.getItem("domain_" + acct_id);
	//タグとかの場合はカラム追加して描画
	if (tlid == "add") {
		console.log("add");
		var newtab = $(".box").length;
		var add = {
			domain: acct_id,
			type: type,
			data: data
		};
		var multi = localStorage.getItem("column");
		var obj = JSON.parse(multi);
		localStorage.setItem("card_" + obj.length,"true");
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
			$("#notice_icon_" + tlid).text("merge_type");
		mixtl(acct_id, tlid, "integrated");
		return;
	}else if (type == "plus") {
		//Local+なら飛ばす
			$("#notice_" + tlid).text("Local+ TL(" + localStorage.getItem(
			"user_" + acct_id) + "@" + domain + ")");
			$("#notice_icon_" + tlid).text("people_outline");
		mixtl(acct_id, tlid, "plus");
		return;
	}else if (type == "notf") {
		//通知なら飛ばす
		//notf(acct_id, tlid, 'direct');
		$("#notice_" + tlid).text(cap(type, data, acct_id) + "(" + localStorage.getItem(
			"user_" + acct_id) + "@" + domain + ")");
			$("#notice_icon_" + tlid).text("notifications");
		return;
	}
	localStorage.setItem("now", type);
	todo(cap(type) + " TL Loading...");
	var at = localStorage.getItem(domain + "_at");
	if(type!="noauth"){
		var hdr={
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		};
		$("#notice_" + tlid).text(cap(type, data, acct_id) + "(" + localStorage.getItem(
			"user_" + acct_id) + "@" + domain + ")");
	}else{
		var hdr={
			'content-type': 'application/json'
		};
		domain=acct_id;
		$("#notice_" + tlid).text("Glance TL(" + domain + ")");
	}
		$("#notice_icon_" + tlid).text(icon(type));
	var url=com(type, data);
		if(type=="tag"){
			var tag = localStorage.getItem("tag-range");
			if(tag=="local"){
				url=url+"local=true";
			}
		}
	var start = "https://" + domain + "/api/v1/timelines/" + url;
	console.log(start);
	fetch(start, {
		method: 'GET',
		headers: hdr,
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		var templete = parse(json, type, acct_id, tlid);
		$("#timeline_" + tlid).html(templete);
		additional(acct_id, tlid);
		jQuery("time.timeago").timeago();
		todc();
		reload(type, '', acct_id, tlid, data);
		$(window).scrollTop(0);
	});
}

//Streaming接続
function reload(type, cc, acct_id, tlid, data) {
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
	} else if (type == "tag") {
		if(type=="tag"){
			var tag = localStorage.getItem("tag-range");
			if(tag=="local"){
				data=data+"&local=true";
			}
		}
		var start = "wss://" + domain +
			"/api/v1/streaming/?stream=hashtag&tag=" + data +"&access_token=" + at;
	} else if (type == "noauth") {
		var start = "wss://" + acct_id +
			"/api/v1/streaming/?stream=public:local";
	} else if (type=="list"){
		var start = "wss://" + domain +
			"/api/v1/streaming/?stream=list&list=" + data +"&access_token=" + at;
	} else if (type=="dm"){
		var start = "wss://" + domain +
			"/api/v1/streaming/?stream=direct&access_token=" + at;
	}
	console.log(start);
	var wsid = websocket.length;
	websocket[wsid] = new WebSocket(start);
	websocket[wsid].onopen = function(mess) {
		console.log(tlid + ":Connect Streaming API:" + type);
		console.log(mess);
		$("#notice_icon_" + tlid).removeClass("red-text");
	}
	websocket[wsid].onmessage = function(mess) {
		console.log(tlid + ":Receive Streaming API:");
		console.log(mess);


		var typeA = JSON.parse(mess.data).event;
		if (typeA == "delete") {
			var obj = JSON.parse(mess.data).payload;
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").hide();
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").remove();
		} else if (typeA == "update") {
			var obj = JSON.parse(JSON.parse(mess.data).payload);
			console.log(obj);
			if($("#timeline_" + tlid +" [toot-id=" + obj.id + "]").length < 1){
				var templete = parse([obj], type, acct_id, tlid);
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
			}else{
				todo("二重取得発生中");
			}
			
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
		var tag = localStorage.getItem("tag-range");
		if(tag=="local"){
			data=data+"&local=true";
		}
	}else if(type=="list"){
		var data=obj[tlid].data;
	}
	var sid = $("#timeline_" + tlid + " .cvo").last().attr("toot-id");
	if (localStorage.getItem("morelock") != sid) {
		localStorage.setItem("morelock", sid);
		if (type == "mix") {
			mixmore(tlid,"integrated");
			return;
		}else if (type == "plus") {
			mixmore(tlid,"plus");
			return;
		}else if (type == "notf") {
			notfmore(tlid);
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
			var templete = parse(json, '', acct_id, tlid);
			$("#timeline_" + tlid).append(templete);
			additional(acct_id, tlid);
			jQuery("time.timeago").timeago();
			localStorage.removeItem("morelock")
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
function cap(type, data, acct_id) {
	//独自ロケール
	var locale = localStorage.getItem("locale");
	if(locale=="yes"){
		var locale=false;
	}
	if (type == "home") {
		if(localStorage.getItem("home_" + acct_id) && !locale){
			var response=localStorage.getItem("home_" + acct_id);
		}else{
			var response="Home TL";
		}
	} else if (type == "local") {
		if(localStorage.getItem("local_" + acct_id) && !locale){
			var response=localStorage.getItem("local_" + acct_id);
		}else{
			var response="Local TL";
		}
	} else if (type == "pub") {
		if(localStorage.getItem("public_" + acct_id) && !locale){
			var response=localStorage.getItem("public_" + acct_id);
		}else{
			var response="Federated TL";
		}
	} else if (type == "tag") {
		var response= "#" + data
	} else if (type == "list") {
		var ltitle=localStorage.getItem("list_"+data+"_"+acct_id);
		var response= "List(" + ltitle + ")"
	} else if (type == "notf") {
		if(localStorage.getItem("notification_" + acct_id) && !locale){
			var response=localStorage.getItem("notification_" + acct_id);
		}else{
			var response="Notification TL";
		}
	} else if (type == "noauth") {
		var response= "Glance TL"
	} else if (type == "dm") {
		var response= "DM"
	}
	return response;
}

//TLのURL
function com(type, data) {
	if (type == "home") {
		return "home?"
	} else if (type == "local" || type == "noauth") {
		return "public?local=true&"
	} else if (type == "pub") {
		return "public?"
	} else if (type == "tag") {
		return "tag/" + data + "?"
	}else if (type == "list") {
		return "list/" + data + "?"
	}else if (type="dm") {
		return "direct?"
	}
}

//TLのアイコン
function icon(type) {
	if (type == "home") {
		return "home"
	} else if (type == "local" || type == "noauth") {
		return "people_outline"
	} else if (type == "pub") {
		return "language"
	} else if (type == "tag") {
		return "search"
	} else if (type == "list") {
		return "view_headline"
	}else if (type == "list") {
		return "subject"
	}else if (type == "dm") {
		return "mail"
	}
}