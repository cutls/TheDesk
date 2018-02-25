//通知
//取得+Streaming接続
function notf(acct_id, tlid, sys) {
	todo("Notifications Loading...");
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
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
		var templete="";
		Object.keys(json).forEach(function(key) {
			var obj = json[key];
			if(obj.type!="follow"){
				templete = templete+parse([obj], '', acct_id, tlid, -1);
			}else{
				templete = templete+userparse([obj.account], '', acct_id, tlid, -1);
			}
			
		});
		if (sys == "direct") {
			$("#timeline_" + tlid).html(templete);
		} else {
			$("#notifications_" + tlid).html(templete);
		}

		jQuery("time.timeago").timeago();
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
		console.log("Connect Streaming API:");
		console.log(mess);
	}
	websocketNotf[wsid].onmessage = function(mess) {
		console.log("Receive Streaming API:");

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "notification") {
			var popup = localStorage.getItem("popup");
			if (!popup) {
				popup = 0;
			}
			if(json.type!="follow"){
				templete = templete+parse([json], '', acct_id, tlid, popup);
			}else{
				templete = templete+userparse([json], '', acct_id, tlid, popup);
			}
			var notices = templete[1];
			console.log(templete);
			if (sys == "direct") {
				$("#timeline_" + tlid).prepend(templete[0]);
			} else {
				$("#notifications_" + tlid).prepend(templete[0]);
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

//通知トグルボタン
function notfToggle(acct, tlid) {
	$("#notf-box_" + tlid).toggleClass("hide");
	$("#notf-box_" + tlid).toggleClass("show");
	if (!$("#notf-box_" + tlid).hasClass("fetched")) {
		notf(acct, tlid);
	}
	$(".notf-icon_" + tlid).removeClass("red-text");
}
