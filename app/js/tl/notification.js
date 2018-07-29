//通知
//取得+Streaming接続
function notf(acct_id, tlid, sys) {
	todo("Notifications Loading...");
	var native=localStorage.getItem("nativenotf");
	if(!native){
		native="yes";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	var start = "https://" + domain + "/api/v1/notifications";
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
		if(json[0]){
		var templete="";
		var lastnotf=localStorage.getItem("lastnotf_" + acct_id);
		console.log(domain);
		localStorage.setItem("lastnotf_" + acct_id,json[0].id);
		Object.keys(json).forEach(function(key) {
			var obj = json[key];
			if(lastnotf==obj.id && key>0 && native=="yes"){
				var ct=key;
				if(key>14){
					ct="15+";
				}
				var electron = require("electron");
				var ipc = electron.ipcRenderer;
				var os = electron.remote.process.platform;
					var options = {
						body: ct+lang_notf_new[lang],
						icon: localStorage.getItem("prof_"+acct_id)
					  };
					if(os=="darwin"){
						var n = new Notification('TheDesk:'+domain, options);
					}else{
						ipc.send('native-notf', ['TheDesk:'+domain,ct+lang_notf_new[lang],localStorage.getItem("prof_"+acct_id)]);
					}
				
			}
			if(localStorage.getItem("filter_"+ acct_id)!="undefined"){
				var mute=getFilterType(JSON.parse(localStorage.getItem("filter_"+ acct_id)),"notif");
			}else{
				var mute=[];
			}
			if(obj.type!="follow"){
				templete = templete+parse([obj], 'notf', acct_id, 'notf', -1, mute);
			}else{
				templete = templete+userparse([obj.account], 'notf', acct_id, 'notf', -1);
			}
		});
		
		if (sys == "direct") {
			$("#timeline_" + tlid).html(templete);
		} else {
			$("div[data-notf=" + acct_id +"]").html(templete);
		}

		jQuery("time.timeago").timeago();
		}
		$("#notf-box").addClass("fetched");
		todc();
	});
	var start = "wss://" + domain + "/api/v1/streaming/?stream=user&access_token=" +
		at;

	console.log(start);
	var wsid = websocketNotf.length;
	websocketNotf[wsid] = new WebSocket(start);
	console.log(websocketNotf);
	websocketNotf[wsid].onopen = function(mess) {
		console.log("Connect Streaming API(Notf):");
		console.log(mess);
		$("i[data-notf=" + acct_id +"]").removeClass("red-text");
	}
	websocketNotf[wsid].onmessage = function(mess) {
		console.log("Receive Streaming API(Notf):"+acct_id);

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "notification") {
			var popup = localStorage.getItem("popup");
			if (!popup) {
				popup = 0;
			}
			var templete="";
			localStorage.setItem("lastnotf_" + acct_id,obj.id);
			if(obj.type!="follow"){
				templete = parse([obj], 'notf', acct_id, 'notf', popup);
			}else{
				templete = userparse([obj], 'notf', acct_id, 'notf', popup);
			}
			if(!$("div[data-notfIndv=" + acct_id +"_"+obj.id+"]").length){
				$("div[data-notf=" + acct_id +"]").prepend(templete);
			}
			jQuery("time.timeago").timeago();
		} else if (type == "delete") {
			$("[toot-id=" + obj + "]").hide();
			$("[toot-id=" + obj + "]").remove();
		}

	}
	websocketNotf[wsid].onerror = function(error) {
		console.error('WebSocket Error ' + error);
	};
}
//一定のスクロールで発火
function notfmore(tlid) {
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	var acct_id = obj[tlid].domain;
	if (!type) {
		var type = obj[tlid].type;
	}else{
		var data;
	}
	var sid = $("#timeline_" + tlid + " .cvo").last().attr("toot-id");
	console.log(sid);
	if (localStorage.getItem("morelock") != sid) {
		localStorage.setItem("morelock", sid);
		localStorage.setItem("now", type);
		todo("Notfication TL MoreLoading");
		var domain = localStorage.getItem("domain_" + acct_id);
		var at = localStorage.getItem("acct_"+ acct_id + "_at");
		var start = "https://" + domain + "/api/v1/notifications"+
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
			var templete="";
			Object.keys(json).forEach(function(key) {
				var obj = json[key];
				if(obj.type!="follow"){
					templete = templete+parse([obj], '', acct_id, tlid, -1);
				}else{
					templete = templete+userparse([obj.account], '', acct_id, tlid, -1);
				}
				
			});
			$("#timeline_" + tlid).append(templete);
			additional(acct_id, tlid);
			jQuery("time.timeago").timeago();
			localStorage.removeItem("morelock")
			todc();
		});
	}
}

//通知トグルボタン
function notfToggle(acct, tlid) {
	$("#notf-box_" + tlid).toggleClass("hide");
	$("#notf-box_" + tlid).toggleClass("show");
	notfCanceler(acct)
}
function notfCanceler(acct){
	$(".notf-reply_" + acct_id).text(0);
	$(".notf-reply_" + acct_id).addClass("hide");
	$(".notf-fav_" + acct_id).text(0);
	$(".notf-fav_" + acct_id).addClass("hide");
	$(".notf-bt_" + acct_id).text(0);
	$(".notf-bt_" + acct_id).addClass("hide");
	$(".notf-follow_" + acct_id).text(0);
	$(".notf-follow_" + acct_id).addClass("hide");
	$(".notf-icon_" + acct).removeClass("red-text");
}
function allNotfRead(){
	var multi = localStorage.getItem("multi");
	if (!multi) {
		var obj = [{
			at: localStorage.getItem("acct_0_at"),
			name: localStorage.getItem("name_0"),
			domain: localStorage.getItem("domain_0"),
			user: localStorage.getItem("user_0"),
			prof: localStorage.getItem("prof_0"),
			id: localStorage.getItem("user-id_0")
		}];
		var json = JSON.stringify(obj);
		localStorage.setItem("multi", json);
	} else {
		var obj = JSON.parse(multi);
	}
	console.log(obj);
	var templete;
	Object.keys(obj).forEach(function(key) {
		notfCanceler(key)
	});
}
