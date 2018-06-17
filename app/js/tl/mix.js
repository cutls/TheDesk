//Integrated TL
function mixtl(acct_id, tlid, type) {
	console.log(type);
	localStorage.removeItem("morelock")
	localStorage.setItem("now", type);
	todo("Integrated TL Loading...(Local)");
    //まずLocal
    var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
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
	}).then(function(jsonL) {
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
        }).then(function(jsonH) {
            var homearr=[];
            var timeline = jsonL.concat(jsonH);
            timeline.sort(function(a,b){
                if(date(a.created_at,"unix")>=date(b.created_at,"unix")) return -1;
                if(date(a.created_at,"unix")<date(b.created_at,"unix")) return 1;
                return 0;
			});
			if(type=="integrated"){
				timeline.splice(20);
			}
            var templete="";
            Object.keys(timeline).forEach(function(key) {
                var pkey=key*1+1;
                if(pkey<timeline.length){
                    if(date(timeline[key].created_at,"unix")!=date(timeline[pkey].created_at,"unix")){
						if(type=="integrated"){
							templete = templete+parse([timeline[key]], '', acct_id, tlid);
						}else if(type=="plus"){
							if(timeline[key].account.acct==timeline[key].account.username){
								templete = templete+parse([timeline[key]], '', acct_id, tlid);
							}
						}
                        
                    }
                }

            });
            
             $("#timeline_" + tlid).html(templete);
            mixre(acct_id, tlid, type);
			additional(acct_id, tlid);
			jQuery("time.timeago").timeago();
			todc();
        });
    });
}


//Streamingに接続
function mixre(acct_id, tlid, TLtype) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var startHome = "wss://" + domain +
		"/api/v1/streaming/?stream=user&access_token=" + at;

	var startLocal = "wss://" + domain +
		"/api/v1/streaming/?stream=public:local&access_token=" + at;
	var wshid = websocketHome.length;
	var wslid = websocketLocal.length;
	websocketHome[wshid] = new WebSocket(startHome);
	websocketLocal[wslid] = new WebSocket(startLocal);
	websocketHome[wshid].onopen = function(mess) {
		console.log("Connect Streaming API(Integrated:Home)");
		$("#notice_icon_" + tlid).removeClass("red-text");
	}
	websocketLocal[wslid].onopen = function(mess) {
		console.log("Connect Streaming API(Integrated:Local)");
		$("#notice_icon_" + tlid).removeClass("red-text");
	}
	websocketLocal[wslid].onmessage = function(mess) {
		console.log("Receive Streaming API:(Integrated:Local)");

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "delete") {
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").hide();
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").remove();
		} else if (type == "update") {
			var templete = parse([obj], '', acct_id, tlid);
			if (!$("#timeline_"+tlid+" [toot-id="+obj.id+"]").length) {
				var pool = localStorage.getItem("pool_" + tlid);
				if (pool && templete) {
					pool = templete + pool;
				} else if (templete) {
					pool = templete
				}else{
					pool="";
				}
				localStorage.setItem("pool_" + tlid, pool);
				scrollck();
				additional(acct_id, tlid);
				jQuery("time.timeago").timeago();
				todc();
		}}
	}
	websocketHome[wshid].onmessage = function(mess) {
		console.log("Receive Streaming API:(Integrated:Home)");

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "delete") {
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").hide();
			$("[toot-id=" + JSON.parse(mess.data).payload + "]").remove();
		} else if (type == "update") {
			if(TLtype=="integrated"){
				var templete = parse([obj], '', acct_id, tlid);
			}else if(TLtype=="plus"){
				if(obj.account.acct==obj.account.username){
					var templete = parse([obj], '', acct_id, tlid);
				}else{
					var templete="";
				}
			}
		if (!$("#timeline_"+tlid+" [toot-id="+obj.id+"]").length) {
				var pool = localStorage.getItem("pool_" + tlid);
				if (pool && templete) {
					pool = templete + pool;
				} else if (templete) {
					pool = templete
				}else{
					pool="";
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
function mixmore(tlid,type) {
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	var acct_id = obj[tlid].domain;
	todo("Integrated TL MoreLoading...(Local)");
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var sid = $("#timeline_" + tlid + " .cvo").last().attr("toot-id");


	var start = "https://" + domain + "/api/v1/timelines/public?local=true&max_id="+sid;
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
	}).then(function(jsonL) {
        var start = "https://" + domain + "/api/v1/timelines/home?max_id="+sid;
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
        }).then(function(jsonH) {
            var homearr=[];
            var timeline = jsonL.concat(jsonH);
            timeline.sort(function(a,b){
                if(date(a.created_at,"unix")>date(b.created_at,"unix")) return -1;
                if(date(a.created_at,"unix")<date(b.created_at,"unix")) return 1;
                return 0;
            });
            timeline.splice(20);
            var templete="";
            Object.keys(timeline).forEach(function(key) {
                var pkey=key*1+1;
                if(pkey<20){
                    if(date(timeline[key].created_at,"unix")!=date(timeline[pkey].created_at,"unix")){
                        if(type=="integrated"){
							templete = templete+parse([timeline[key]], '', acct_id, tlid);
						}else if(type=="plus"){
							if(timeline[key].account.acct==timeline[key].account.username){
								templete = templete+parse([timeline[key]], '', acct_id, tlid);
							}
						}
                    }
                }

            });
            
             $("#timeline_" + tlid).append(templete);
            mixre(acct_id, tlid);
			additional(acct_id, tlid);
			jQuery("time.timeago").timeago();
			todc();
        });
	});
	

}
