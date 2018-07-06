
//TL取得
function tl(data) {
    var tlid=0;
    var acct_id = $("#post-acct-sel").val();
    var type = $("#type-sel").val();
	var domain = localStorage.getItem("domain_" + acct_id);
	//タグの場合はカラム追加して描画
		if (!type) {
			//デフォルト
			var type = "local";
		}
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	$("#notice_nano").text(cap(type, data) + " TL(" + localStorage.getItem(
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
		console.error(error);
	}).then(function(json) {
		var templete = parse([json[0]], '', acct_id, tlid);
		$("#timeline_nano").html(templete);
		jQuery("time.timeago").timeago();
		reload(type, '', acct_id, data);
	});
}

//Streaming接続
var websocket=[];
function reload(type, cc, acct_id, data) {
    var tlid=0;
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
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
		var start = "wss://" + domain +
			"/api/v1/streaming/?stream=hashtag&tag=" + data +"&access_token=" + at;
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
		console.log(websocket[wsid]);
		var typeA = JSON.parse(mess.data).event;
		if (typeA == "delete") {
			var obj = JSON.parse(mess.data).payload;
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").hide();
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").remove();
		} else if (typeA == "update") {
			var obj = JSON.parse(JSON.parse(mess.data).payload);
			console.log(obj);
            var templete = parse([obj], '', acct_id, tlid);
            $("#timeline_nano").html(templete);
		}
		websocket[wsid].onclose = function(mess) {
			console.log("Close Streaming API:" + type);
		}
	}
	websocket[wsid].onerror = function(error) {
		console.error('WebSocket Error ' + error);
	};
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

//TLのアイコン
function icon(type) {
	if (type == "home") {
		return "home"
	} else if (type == "local") {
		return "people_outline"
	} else if (type == "pub") {
		return "language"
	} else if (type == "tag") {
		return "search"
	}
	if (type == "list") {
		return "subject"
	}
}
function todo(){}
function todc(){}
$(function($) {
	//キーボードショートカット
	$(window).keydown(function(e) {
		var hasFocus = $('input').is(':focus');
		var hasFocus2 = $('textarea').is(':focus');
		//Ctrl+Enter:投稿
		if (event.ctrlKey) {
			if (e.keyCode === 13) {
				post();
				return false;
			}
		}
	});
});
