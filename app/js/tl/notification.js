//通知
//取得+Streaming接続
function notf(acct_id, tlid, sys){
	if (sys == "direct") {
		notfColumn(acct_id, tlid, sys)
	} else {
		notfCommon(acct_id, tlid, sys)
	}
}
function notfColumn(acct_id, tlid, sys){
	todo("Notifications Loading...");
	var native=localStorage.getItem("nativenotf");
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(!native){
		native="yes";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	console.log(start)
	var httpreq = new XMLHttpRequest();
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var misskey=true;
		var start = "https://" + domain + "/api/i/notifications";
		httpreq.open(POST, start, true);
		httpreq.setRequestHeader('Content-Type', 'application/json');
		var body=JSON.stringify({
			i:at
		});
	}else{
		var misskey=false;
		if(localStorage.getItem("exclude-"+tlid)){
			var exc=localStorage.getItem("exclude-"+tlid);
		}else{
			var exc="";
		}
		var start = "https://" + domain + "/api/v1/notifications"+exc;
		httpreq.open("GET", start, true);
		httpreq.setRequestHeader('Content-Type', 'application/json');
		httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
		var body="";
	}
	
	httpreq.responseType = "json";
	httpreq.send(body);
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			var max_id = httpreq.getResponseHeader("link").match(/[?&]{1}max_id=([0-9]+)/)[1];
			if(json[0]){
				var templete="";
				var lastnotf=localStorage.getItem("lastnotf_" + acct_id);
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
						if(misskey){
							templete = templete+misskeyParse([obj], 'notf', acct_id, 'notf', -1, mute);
						}else{
							templete = templete+parse([obj], 'notf', acct_id, 'notf', -1, mute);
						}
					}else{
						if(misskey){
							templete = templete+misskeyUserparse([obj], 'notf', acct_id, 'notf', -1, mute);
						}else{
							templete = templete+userparse([obj.account], 'notf', acct_id, 'notf', -1);
						}
						
					}
				});
				templete=templete+'<div class="hide notif-marker" data-maxid="'+max_id+'"></div>';
				$("#timeline_" + tlid).html(templete);
				$("#landing_" + tlid).hide();
				jQuery("time.timeago").timeago();
				}
				$("#notf-box").addClass("fetched");
				todc();
		}
	}
	if(!misskey){
		if(localStorage.getItem("streaming_" + acct_id)){
			var wss=localStorage.getItem("streaming_" + acct_id)
		}else{
			var wss="wss://"+domain
		}
		var start = wss + "/api/v1/streaming/?stream=user&access_token=" +
		at;
	}else{
		var start = "wss://" + domain + "/?i=" +
		at;
	}

	console.log(start);
	var wsid = websocketNotf.length;
	websocketNotf[acct_id] = new WebSocket(start);
	console.log(websocketNotf);
	websocketNotf[acct_id].onopen = function(mess) {
		console.log("Connect Streaming API(Notf):");
		console.log(mess);
		$("i[data-notf=" + acct_id +"]").removeClass("red-text");

	}
	websocketNotf[acct_id].onmessage = function(mess) {
		console.log("Receive Streaming API(Notf):"+acct_id);
		var popup = localStorage.getItem("popup");
			if (!popup) {
				popup = 0;
			}
			console.log(domain)
		if(misskey){
			console.log("misskey")
			console.log(JSON.parse(mess.data));
			if (JSON.parse(mess.data).type == "notification") {
				var obj = JSON.parse(mess.data).body;
				console.log(obj);
				if(obj.type!="follow"){
					
					templete = misskeyParse([obj], 'notf', acct_id, 'notf', popup);
				}else{
					templete = misskeyUserparse([obj], 'notf', acct_id, 'notf', popup);
				}
				if(obj.type=="reaction"){
					console.log("refresh")
					reactRefresh(acct_id,obj.note.id)
				}
				if(!$("div[data-notfIndv=" + acct_id +"_"+obj.id+"]").length){
					$("div[data-notf=" + acct_id +"]").prepend(templete);
				}
				jQuery("time.timeago").timeago();
			}else if(JSON.parse(mess.data).type == "note-updated"){
				var obj = JSON.parse(mess.data).body.note;
				reactRefreshCore(obj)
			}
		}else{
		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "notification") {
			var templete="";
			localStorage.setItem("lastnotf_" + acct_id,obj.id);
			if(obj.type!="follow"){
				templete = parse([obj], 'notf', acct_id, 'notf', popup);
			}else{
				templete = userparse([obj], 'notf', acct_id, 'notf', popup);
			}
			if(!$("div[data-notfIndv=" + acct_id +"_"+obj.id+"]").length){
				$(".tl[data-notf=" + acct_id +"]").prepend(templete);
			}
			$(".notf-timeline[data-acct=" + acct_id +"]").prepend(templete);
			jQuery("time.timeago").timeago();
		} else if (type == "delete") {
			$("[toot-id=" + obj + "]").hide();
			$("[toot-id=" + obj + "]").remove();
		}
		}
	}
	websocketNotf[acct_id].onerror = function(error) {
		console.error('WebSocket Error ' + error);
	};
}
function notfCommon(acct_id, tlid, sys) {
	todo("Notifications Loading...");
	var native=localStorage.getItem("nativenotf");
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(!native){
		native="yes";
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var misskey=true;
		var start = "https://" + domain + "/api/i/notifications";
		var i={
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify({
				i:at
			})
		}
	}else{
		var misskey=false;
		var start = "https://" + domain + "/api/v1/notifications";
		var i={
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + at
			},
		}
	}
	fetch(start, i).then(function(response) {
		console.log(response.headers.get('link'));
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if(json[0]){
		var templete="";
		var lastnotf=localStorage.getItem("lastnotf_" + acct_id);
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
						body: ct+lang.lang_notf_new[lang],
						icon: localStorage.getItem("prof_"+acct_id)
					  };
					if(os=="darwin"){
						var n = new Notification('TheDesk:'+domain, options);
					}else{
						ipc.send('native-notf', ['TheDesk:'+domain,ct+lang.lang_notf_new[lang],localStorage.getItem("prof_"+acct_id)]);
					}
				
			}
			if(localStorage.getItem("filter_"+ acct_id)!="undefined"){
				var mute=getFilterType(JSON.parse(localStorage.getItem("filter_"+ acct_id)),"notif");
			}else{
				var mute=[];
			}
			if(obj.type!="follow"){
				if(misskey){
					templete = templete+misskeyParse([obj], 'notf', acct_id, 'notf', -1, mute);
				}else{
					templete = templete+parse([obj], 'notf', acct_id, 'notf', -1, mute);
				}
			}else{
				if(misskey){
					templete = templete+misskeyUserparse([obj], 'notf', acct_id, 'notf', -1, mute);
				}else{
					templete = templete+userparse([obj.account], 'notf', acct_id, 'notf', -1);
				}
				
			}
		});
		$("div[data-notf=" + acct_id +"]").html(templete);
		$("#landing_" + tlid).hide();
		jQuery("time.timeago").timeago();
		}
		$("#notf-box").addClass("fetched");
		todc();
	});
	if(!misskey){
		if(localStorage.getItem("streaming_" + acct_id)){
			var wss=localStorage.getItem("streaming_" + acct_id)
		}else{
			var wss="wss://"+domain
		}
		var start = wss + "/api/v1/streaming/?stream=user&access_token=" +
		at;
	}else{
		var start = "wss://" + domain + "/?i=" +
		at;
	}

	console.log(start);
	var wsid = websocketNotf.length;
	websocketNotf[acct_id] = new WebSocket(start);
	console.log(websocketNotf);
	websocketNotf[acct_id].onopen = function(mess) {
		console.log("Connect Streaming API(Notf):");
		console.log(mess);
		$("i[data-notf=" + acct_id +"]").removeClass("red-text");

	}
	websocketNotf[acct_id].onmessage = function(mess) {
		console.log("Receive Streaming API(Notf):"+acct_id);
		var popup = localStorage.getItem("popup");
			if (!popup) {
				popup = 0;
			}
			console.log(domain)
		if(misskey){
			console.log("misskey")
			console.log(JSON.parse(mess.data));
			if (JSON.parse(mess.data).type == "notification") {
				var obj = JSON.parse(mess.data).body;
				console.log(obj);
				if(obj.type!="follow"){
					
					templete = misskeyParse([obj], 'notf', acct_id, 'notf', popup);
				}else{
					templete = misskeyUserparse([obj], 'notf', acct_id, 'notf', popup);
				}
				if(obj.type=="reaction"){
					console.log("refresh")
					reactRefresh(acct_id,obj.note.id)
				}
				if(!$("div[data-notfIndv=" + acct_id +"_"+obj.id+"]").length){
					$("div[data-notf=" + acct_id +"]").prepend(templete);
				}
				jQuery("time.timeago").timeago();
			}else if(JSON.parse(mess.data).type == "note-updated"){
				var obj = JSON.parse(mess.data).body.note;
				reactRefreshCore(obj)
			}
		}else{
		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "notification") {
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
	}
	websocketNotf[acct_id].onerror = function(error) {
		console.error('WebSocket Error ' + error);
	};
}
//一定のスクロールで発火
function notfmore(tlid) {
	console.log(moreloading);
	console.log("kicked");
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	var acct_id = obj[tlid].domain;
	if (!type) {
		var type = obj[tlid].type;
	}else{
		var data;
	}
	var sid = $("#timeline_" + tlid + " .notif-marker").last().attr("data-maxid");
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	var domain = localStorage.getItem("domain_" + acct_id);
	if (sid && !moreloading) {
		moreloading=true;
	var httpreq = new XMLHttpRequest();
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var misskey=true;
		var start = "https://" + domain + "/api/i/notifications";
		httpreq.open(POST, start, true);
		httpreq.setRequestHeader('Content-Type', 'application/json');
		var body=JSON.stringify({
			i:at,
			untilID:sid
		});
	}else{
		var misskey=false;
		if(localStorage.getItem("exclude-"+tlid)){
			var exc=localStorage.getItem("exclude-"+tlid)+"&max_id="+sid;
		}else{
			var exc="?max_id="+sid;
		}
		var start = "https://" + domain + "/api/v1/notifications"+exc;
		httpreq.open("GET", start, true);
		httpreq.setRequestHeader('Content-Type', 'application/json');
		httpreq.setRequestHeader('Authorization', 'Bearer ' + at);
		var body="";
	}
	
	httpreq.responseType = "json";
	httpreq.send(body);
    httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response;
			console.log(json);
			var max_id = httpreq.getResponseHeader("link").match(/[?&]{1}max_id=([0-9]+)/)[1];
			if(json[0]){
				var templete="";
				var lastnotf=localStorage.getItem("lastnotf_" + acct_id);
				localStorage.setItem("lastnotf_" + acct_id,json[0].id);
				Object.keys(json).forEach(function(key) {
					var obj = json[key];
					if(localStorage.getItem("filter_"+ acct_id)!="undefined"){
						var mute=getFilterType(JSON.parse(localStorage.getItem("filter_"+ acct_id)),"notif");
					}else{
						var mute=[];
					}
					if(obj.type!="follow"){
						if(misskey){
							templete = templete+misskeyParse([obj], 'notf', acct_id, 'notf', -1, mute);
						}else{
							templete = templete+parse([obj], 'notf', acct_id, 'notf', -1, mute);
						}
					}else{
						if(misskey){
							templete = templete+misskeyUserparse([obj], 'notf', acct_id, 'notf', -1, mute);
						}else{
							templete = templete+userparse([obj.account], 'notf', acct_id, 'notf', -1);
						}
						
					}
				});
				moreloading=false;
				templete=templete+'<div class="hide notif-marker" data-maxid="'+max_id+'"></div>';
				$("#timeline_" + tlid).append(templete);
				$("#landing_" + tlid).hide();
				jQuery("time.timeago").timeago();
				}
				$("#notf-box").addClass("fetched");
				todc();
		}
	}
}
}

//通知トグルボタン
function notfToggle(acct, tlid) {
	if($("#notf-box_" + tlid).hasClass("column-hide")){
		$("#notf-box_" + tlid).css("display","block")
		$("#notf-box_" + tlid).animate({
			'height': '400px'
		},{
			'duration': 300,
			'complete': function(){
				$("#notf-box_" + tlid).css("overflow-y","scroll")
				$("#notf-box_" + tlid).removeClass("column-hide")
			}
		});
	}else{
		$("#notf-box_" + tlid).css("overflow-y","hidden")
		$("#notf-box_" + tlid).animate({
			'height': '0'
		},{
			'duration': 300,
			'complete': function(){
				$("#notf-box_" + tlid).addClass("column-hide")
				$("#notf-box_" + tlid).css("display","none")
			}
		});
	}
	notfCanceler(acct)
}
function notfCanceler(acct){
	$(".notf-reply_" + acct).text(0);
	localStorage.removeItem("notf-reply_" + acct)
	$(".notf-reply_" + acct).addClass("hide");
	$(".notf-fav_" + acct).text(0);
	localStorage.removeItem("notf-fav_" + acct)
	$(".notf-fav_" + acct).addClass("hide");
	$(".notf-bt_" + acct).text(0);
	localStorage.removeItem("notf-bt_" + acct)
	$(".notf-bt_" + acct).addClass("hide");
	$(".notf-follow_" + acct).text(0);
	localStorage.removeItem("notf-follow_" + acct)
	$(".notf-follow_" + acct).addClass("hide");
	$(".notf-icon_" + acct).removeClass("red-text");
}
function allNotfRead(){
	console.log(localStorage.getItem("notf-fav_2"));
	var multi = localStorage.getItem("multi");
	if (multi) {
		var obj = JSON.parse(multi);
	Object.keys(obj).forEach(function(key) {
		console.log(key);
		notfCanceler(key)
	});
}
}
allNotfRead()