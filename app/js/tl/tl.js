//TL取得
function tl(type, data, acct_id, tlid, delc, voice) {
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
	if (type == "mix" && domain != "misskey.xyz") {
		//Integratedなら飛ばす
			$("#notice_" + tlid).text("Integrated TL(" + localStorage.getItem(
			"user_" + acct_id) + "@" + domain + ")");
			$("#notice_icon_" + tlid).text("merge_type");
		mixtl(acct_id, tlid, "integrated",delc,voice);
		return;
	}else if (type == "plus") {
		//Local+なら飛ばす
			$("#notice_" + tlid).text("Local+ TL(" + localStorage.getItem(
			"user_" + acct_id) + "@" + domain + ")");
			$("#notice_icon_" + tlid).text("people_outline");
		mixtl(acct_id, tlid, "plus",delc,voice);
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
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
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
		if(domain=="misskey.xyz"){
			var url=misskeycom(type, data);
			var start = "https://" + domain + "/api/notes/"+url;
			var method="POST";
			var req={};
			if(type!="noauth"){
				req.i=at;
			}
			if(type=="local-media"||type=="pub-media"){
				req.mediaOnly=true;
			}
			if(type=="tag"){
				req.tag=data;
			}
			if(type=="list"){
				req.listId=data;
			}
			req.limit=20;
			var i={
				method: method,
				headers: hdr,
				body: JSON.stringify(req),
			}
		}else{
			var url=com(type, data);
			if(type=="tag"){
				var tag = localStorage.getItem("tag-range");
				if(tag=="local"){
					url=url+"local=true";
				}
			}
			var start = "https://" + domain + "/api/v1/timelines/" + url;
			var method="GET";
			var i={
				method: method,
				headers: hdr
			};
		}
	
	console.log(start);
	fetch(start, i).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		if(localStorage.getItem("filter_"+ acct_id)!="undefined"){
			var mute=getFilterType(JSON.parse(localStorage.getItem("filter_"+ acct_id)),type);
		}else{
			var mute=[];
		}
		if(domain=="misskey.xyz"){
			var templete = misskeyParse(json, type, acct_id, tlid, "", mute);
		}else{
			var templete = parse(json, type, acct_id, tlid, "", mute);
		}
		$("#timeline_" + tlid).html(templete);
		additional(acct_id, tlid);
		jQuery("time.timeago").timeago();
		todc();
		reload(type, '', acct_id, tlid, data, mute, delc,voice);
		$(window).scrollTop(0);
	});
}

//Streaming接続
function reload(type, cc, acct_id, tlid, data, mute, delc, voice) {
	if (!type) {
		var type = localStorage.getItem("now");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	localStorage.setItem("now", type);
	if(domain=="misskey.xyz"){
		if (type == "home") {
			var start = "wss://" + domain +
				"/?i=" + at;
		} else if (type == "pub") {
			var start = "wss://" + domain +
				"/global-timeline?i=" + at;
		} else if (type == "pub-media") {
			var start = "wss://" + domain +
			"/global-timeline?i=" + at;
		} else if (type == "local") {
			var start = "wss://" + domain +
			"/local-timeline?i=" + at;
		} else if (type == "local-media") {
			var start = "wss://" + domain +
			"/local-timeline?i=" + at;
		} else if (type == "mix") {
			var start = "wss://" + domain +
			"/hybrid-timeline?i=" + at;
		} else if (type == "tag") {
			Materialize.toast(lang_misskeyparse_tagnostr[lang], 1000);
		} else if (type == "noauth") {
			var start = "wss://" + acct_id +
			"/local-timeline?i=" + at;
		} else if (type=="list"){
			Materialize.toast(lang_misskeyparse_listnostr[lang], 1000);
		}
	}else{
		if (type == "home") {
			var start = "wss://" + domain +
				"/api/v1/streaming/?stream=user&access_token=" + at;
		} else if (type == "pub") {
			var start = "wss://" + domain +
				"/api/v1/streaming/?stream=public&access_token=" + at;
		} else if (type == "pub-media") {
			var start = "wss://" + domain +
				"/api/v1/streaming/?stream=public:media&access_token=" + at;
		} else if (type == "local") {
			var start = "wss://" + domain +
				"/api/v1/streaming/?stream=public:local&access_token=" + at;
		} else if (type == "local-media") {
			var start = "wss://" + domain +
				"/api/v1/streaming/?stream=public:local:media&only_media=true&access_token=" + at;
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
		console.log(JSON.parse(mess.data));
		if(domain=="misskey.xyz"){
			if (JSON.parse(mess.data).type == "note") {
				var obj = JSON.parse(mess.data).body;
				if(voice){
					say(obj.text)
				}
				var templete = misskeyParse([obj], type, acct_id, tlid,"",mute);
				var pool = localStorage.getItem("pool_" + tlid);
				if (pool) {
					pool = templete + pool;
				} else {
					pool = templete
				}
				localStorage.setItem("pool_" + tlid, pool);
				scrollck();
				jQuery("time.timeago").timeago();
			}
		}else{
			var typeA = JSON.parse(mess.data).event;
			if (typeA == "delete") {
				var obj = JSON.parse(mess.data).payload;
				if(delc=="true"){
					$("#timeline_"+tlid+" [toot-id=" + JSON.parse(mess.data).payload + "]").addClass("emphasized");
					$("#timeline_"+tlid+" [toot-id=" + JSON.parse(mess.data).payload + "]").addClass("by_delcatch");
				}else{
					$("[toot-id=" + JSON.parse(mess.data).payload + "]").hide();
					$("[toot-id=" + JSON.parse(mess.data).payload + "]").remove();
				}
				
			} else if (typeA == "update") {
				var obj = JSON.parse(JSON.parse(mess.data).payload);
				console.log(obj);
				if($("#timeline_" + tlid +" [toot-id=" + obj.id + "]").length < 1){
					if(voice){
						say(obj.content)
					}	
					var templete = parse([obj], type, acct_id, tlid,"",mute);
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
			}else if(typeA=="filters_changed"){
				filterUpdate(acct_id);
			}
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
	var sid = $("#timeline_" + tlid + " .cvo").last().attr("unique-id");
	if (sid && localStorage.getItem("morelock") != sid) {
		localStorage.setItem("morelock", sid);
		if (type == "mix" && localStorage.getItem("domain_" + acct_id)!="misskey.xyz") {
			mixmore(tlid,"integrated");
			return;
		}else if (type == "plus" && localStorage.getItem("domain_" + acct_id)!="misskey.xyz") {
			mixmore(tlid,"plus");
			return;
		}else if (type == "notf") {
			notfmore(tlid);
			return;
		}
		localStorage.setItem("now", type);
		todo(cap(type) + " TL MoreLoading");
		if(type!="noauth"){
			var at = localStorage.getItem("acct_"+ acct_id + "_at");
			var hdr={
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + at
			};
				var domain = localStorage.getItem("domain_" + acct_id);
		}else{
			var hdr={
				'content-type': 'application/json'
			};
			domain=acct_id;
		}
		if(domain=="misskey.xyz"){
			hdr={
				'content-type': 'application/json'
			};
			var url=misskeycom(type, data);
			var start = "https://" + domain + "/api/notes/"+url;
			var method="POST";
			var req={};
			if(type!="noauth"){
				req.i=at;
			}
			if(type=="local-media"||type=="pub-media"){
				req.mediaOnly=true;
			}
			if(type=="tag"){
				req.tag=data;
			}
			if(type=="list"){
				req.listId=data;
			}
			req.untilId=sid;
			req.limit=20;
			var i={
				method: method,
				headers: hdr,
				body: JSON.stringify(req),
			}
		}else{
			var start = "https://" + domain + "/api/v1/timelines/" + com(type,data) +
			"max_id=" + sid;
			var method="GET";
			var i={
				method: method,
				headers: hdr
			};
		}
		
		
		fetch(start, i).then(function(response) {
			return response.json();
		}).catch(function(error) {
			todo(error);
			console.error(error);
		}).then(function(json) {
			if(domain=="misskey.xyz"){
				var templete = misskeyParse(json, '', acct_id, tlid,"",mute);
			}else{
				var templete = parse(json, '', acct_id, tlid,"",mute);
			}
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
	} else if (type == "local-media") {
		if(localStorage.getItem("local_" + acct_id) && !locale){
			var response=localStorage.getItem("local_" + acct_id)+"("+lang_tl_media[lang]+")";
		}else{
			var response="Local TL(Media)";
		}
	} else if (type == "pub") {
		if(localStorage.getItem("public_" + acct_id) && !locale){
			var response=localStorage.getItem("public_" + acct_id);
		}else{
			var response="Federated TL";
		}
	} else if (type == "pub-media") {
		if(localStorage.getItem("public_" + acct_id) && !locale){
			var response=localStorage.getItem("public_" + acct_id)+"("+lang_tl_media[lang]+")";
		}else{
			var response="Federated TL(Media)";
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
	} else if (type == "mix") {
		if(localStorage.getItem("domain_" + acct_id)=="misskey.xyz"){
			var response= "Social TL"
		}else{
			var response= "Integrated"
		}
	} else if (type == "plus") {
		var response= "Local+"
	}
	return response;
}

//TLのURL
function com(type, data) {
	if (type == "home") {
		return "home?"
	} else if (type == "local" || type == "noauth") {
		return "public?local=true&"
	} else if (type == "local-media") {
		return "public?local=true&only_media=true&"
	} else if (type == "pub") {
		return "public?"
	} else if (type == "pub-media") {
		return "public?only_media=true&"
	} else if (type == "tag") {
		return "tag/" + data + "?"
	}else if (type == "list") {
		return "list/" + data + "?"
	}else if (type="dm") {
		return "direct?"
	}
}
function misskeycom(type, data) {
	if (type == "home") {
		return "timeline"
	}else if (type == "mix") {
		return "hybrid-timeline"
	} else if (type == "local" || type == "noauth") {
		return "local-timeline"
	} else if (type == "local-media") {
		return "local-timeline"
	} else if (type == "pub") {
		return "global-timeline"
	} else if (type == "pub-media") {
		return "global-timeline"
	} else if (type == "tag") {
		return "search_by_tag"
	}else if (type == "list") {
		return "user-list-timeline"
	}
}

//TLのアイコン
function icon(type) {
	if (type == "home") {
		return "home"
	} else if (type == "local" || type == "noauth" || type == "local-media") {
		return "people_outline"
	} else if (type == "pub" || type == "pub-media") {
		return "language"
	} else if (type == "tag") {
		return "search"
	} else if (type == "list") {
		return "view_headline"
	}else if (type == "list") {
		return "subject"
	}else if (type == "dm") {
		return "mail"
	}else if (type == "mix") {
		return "share"
	}
}
