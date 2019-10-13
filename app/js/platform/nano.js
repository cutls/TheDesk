
//TL取得
var websocket;
function tl(data) {
	var tlid = 0;
	if(websocket){
		websocket.close()
	}
	var acct_id = $("#post-acct-sel").val();
	var type = $("#type-sel").val();
	var domain = localStorage.getItem("domain_" + acct_id);
	//タグの場合はカラム追加して描画
	if (!type) {
		//デフォルト
		var type = "local";
	}
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	$("#notice_nano").text(cap(type, data) + " TL(" + localStorage.getItem(
		"user_" + acct_id) + "@" + domain + ")");
	var start = "https://" + domain + "/api/v1/timelines/" + com(type, data);
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function (response) {
		return response.json();
	}).catch(function (error) {
		console.error(error);
	}).then(function (json) {
		var templete = parse([json[0]], '', acct_id, tlid);
		$("#timeline_nano").html(templete);
		jQuery("time.timeago").timeago();
		$("#menu").addClass("hide");
	});
	//Streaming接続
	var tlid = 0;
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
			"/api/v1/streaming/?stream=hashtag&tag=" + data + "&access_token=" + at;
	}
	websocket = new WebSocket(start);
	websocket.onopen = function (mess) {
		$("#notice_icon_" + tlid).removeClass("red-text");
	}
	websocket.onmessage = function (mess) {
		var typeA = JSON.parse(mess.data).event;
		if (typeA == "update") {
			var obj = JSON.parse(JSON.parse(mess.data).payload);
			var templete = parse([obj], '', acct_id, tlid);
			jQuery("time.timeago").timeago();
			$("#timeline_nano").html(templete);
		}
		
	}
	websocket.onerror = function (error) {
		console.error('WebSocket Error ' + error);
	};
	websocket.onclose = function (mess) {
		console.error("Close Streaming API:" + type);
	}
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
function todo() { }
function todc() { }
function hide() { }
$(function ($) {
	//キーボードショートカット
	$(window).keydown(function (e) {
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
function set() {
	$("#menu").toggleClass("hide");
	if($("#menu").hasClass("hide")){
		$("#setting").text("Setting")
	}else{
		$("#setting").text("Close")
	}
}

var multi = localStorage.getItem("multi");
if (!multi) {
	var obj = [
		{
			at: localStorage.getItem(localStorage.getItem("domain_" + acct_id) + "_at"),
			name: localStorage.getItem("name_" + acct_id),
			domain: localStorage.getItem("domain_" + acct_id),
			user: localStorage.getItem("user_" + acct_id),
			prof: localStorage.getItem("prof_" + acct_id)
		}
	];
	var json = JSON.stringify(obj);
	localStorage.setItem("multi", json);
} else {
	var obj = JSON.parse(multi);
}
var templete;
var last = localStorage.getItem("last-use");
var sel;
Object.keys(obj).forEach(function(key) {
	var acct = obj[key];
	var list = key * 1 + 1;
	if (key == last) {
		sel = "selected";
	} else {
		sel = "";
	}
	templete = '<option value="' + key + '" ' + sel + ">" + acct.user + "@" + acct.domain + "</option>";
	$("#post-acct-sel").append(templete);
});
function mov() {
	return false;
}
function resetmv() {
	return false;
}
function post() {
	var acct_id = $("#post-acct-sel").val();
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/statuses";
	var str = $("#textarea").val();
	var toot = {
		status: str
	};
	var vis = loadVis(acct_id);
	toot.visibility = vis;
	var httpreq = new XMLHttpRequest();
	httpreq.open("POST", start, true);
	httpreq.setRequestHeader("Content-Type", "application/json");
	httpreq.setRequestHeader("Authorization", "Bearer " + at);
	httpreq.responseType = "json";
	httpreq.send(JSON.stringify(toot));
	httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			$("#textarea").val("");
		}
	};
}
function loadVis(acct_id) {
	var vist = localStorage.getItem("vis");
	if (!vist) {
		return "public";
	} else {
		if (vist == "memory") {
			var memory = localStorage.getItem("vis-memory-" + acct_id);
			if (!memory) {
				memory = "public";
			}
			return memory;
		} else if (vist == "server" || vist == "useapi") {
			var multi = localStorage.getItem("multi");
			var obj = JSON.parse(multi);
			var memory = obj[acct_id]["vis"];
			if (!memory) {
				memory = "public";
			}
			return memory;
		} else {
			return vist;
		}
	}
}
function loader(){
	var acct_id = $("#post-acct-sel").val()
	console.log(loadVis(acct_id))
	$("#vis-sel").val(loadVis(acct_id));
}
loader()
$("textarea").height(15); //init
$("textarea").css("lineHeight", "1rem"); //init

$("textarea").on("input", function(evt) {
	if (evt.target.scrollHeight > evt.target.offsetHeight) {
		$(evt.target).height(evt.target.scrollHeight);
	} else {
		var lineHeight = Number(
			$(evt.target)
				.css("lineHeight")
				.split("px")[0]
		);
		while (true) {
			$(evt.target).height($(evt.target).height() - lineHeight);
			if (evt.target.scrollHeight > evt.target.offsetHeight) {
				$(evt.target).height(evt.target.scrollHeight);
				break;
			}
		}
	}
});