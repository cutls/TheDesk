//Integrated TL
function mixtl(acct_id, tlid, type,delc,voice) {
	console.log(delc);
	localStorage.removeItem("morelock")
	localStorage.setItem("now", type);
	todo("Integrated TL Loading...(Local)");
    //まずLocal
    var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
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
						if(localStorage.getItem("filter_"+ acct_id)!="undefined"){
							var mute=getFilterType(JSON.parse(localStorage.getItem("filter_"+ acct_id)),"mix");
						}else{
							var mute=[];
						}
						if(type=="integrated"){
							templete = templete+parse([timeline[key]], '', acct_id, tlid, "", mute, "mix");
						}else if(type=="plus"){
							if(timeline[key].account.acct==timeline[key].account.username){
								templete = templete+parse([timeline[key]], '', acct_id, tlid, "", mute, "plus");
							}
						}
                    }
                }

            });
            $("#landing_" + tlid).hide();
             $("#timeline_" + tlid).html(templete);
            mixre(acct_id, tlid, type, mute,delc,voice);
			additional(acct_id, tlid);
			jQuery("time.timeago").timeago();
			todc();
        });
    });
}


//Streamingに接続
function mixre(acct_id, tlid, TLtype, mute,delc,voice,mode) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(localStorage.getItem("streaming_" + acct_id)){
		var wss=localStorage.getItem("streaming_" + acct_id)
	}else{
		var wss="wss://"+domain
	}
	var startHome = wss+
		"/api/v1/streaming/?stream=user&access_token=" + at;
	var startLocal = wss+
		"/api/v1/streaming/?stream=public:local&access_token=" + at;
	var wshid = websocketHome.length;
	var wslid = websocketLocal.length;
	websocketHome[wshid] = new WebSocket(startHome);
	websocketLocal[wslid] = new WebSocket(startLocal);
	websocketHome[wshid].onopen = function(mess) {
		localStorage.setItem("wssH_" + tlid, wshid);
		console.log("Connect Streaming API(Integrated:Home)");
		$("#notice_icon_" + tlid).removeClass("red-text");
	}
	websocketLocal[wslid].onopen = function(mess) {
		localStorage.setItem("wssL_" + tlid, wslid);
		console.log("Connect Streaming API(Integrated:Local)");
		$("#notice_icon_" + tlid).removeClass("red-text");
	}
	websocketLocal[wslid].onmessage = function(mess) {
		console.log("Receive Streaming API:(Integrated:Local)");

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "delete") {
			if(delc=="true"){
				$("#timeline_"+tlid+" [toot-id=" + JSON.parse(mess.data).payload + "]").addClass("emphasized");
				$("#timeline_"+tlid+" [toot-id=" + JSON.parse(mess.data).payload + "]").addClass("by_delcatch");
			}else{
				$("[toot-id=" + JSON.parse(mess.data).payload + "]").hide();
				$("[toot-id=" + JSON.parse(mess.data).payload + "]").remove();
			}

		} else if (type == "update") {
			var templete = parse([obj], '', acct_id, tlid,"",mute);
			if($("#timeline_" + tlid +" [toot-id=" + obj.id + "]").length < 1){
				if(voice){
					say(obj.content)
				}	
				var templete = parse([obj], type, acct_id, tlid,"",mute, "mix");
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

			}
	}
	websocketHome[wshid].onmessage = function(mess) {
		console.log("Receive Streaming API:(Integrated:Home)");

		var obj = JSON.parse(JSON.parse(mess.data).payload);
		console.log(obj);
		var type = JSON.parse(mess.data).event;
		if (type == "delete") {
			if(del>10){
				reconnector(tlid,type,acct_id,data)
			}else{
				localStorage.setItem("delete",del*1+1)
			}
			if(delc=="true"){
				$("[toot-id=" + JSON.parse(mess.data).payload + "]").addClass("emphasized");
				$("[toot-id=" + JSON.parse(mess.data).payload + "]").addClass("by_delcatch");
			}else{
				$("[toot-id=" + JSON.parse(mess.data).payload + "]").hide();
				$("[toot-id=" + JSON.parse(mess.data).payload + "]").remove();
			}
		} else if (type == "update") {
			localStorage.removeItem("delete");
			if(TLtype=="integrated"){
				var templete = parse([obj], '', acct_id, tlid);
			}else if(TLtype=="plus"){
				if(obj.account.acct==obj.account.username){
					var templete = parse([obj], '', acct_id, tlid,"",mute, "mix");
				}else{
					var templete="";
				}
			}
			if($("#timeline_" + tlid +" [toot-id=" + obj.id + "]").length < 1){
				if(voice){
					say(obj.content)
				}	
				var templete = parse([obj], type, acct_id, tlid,"",mute,"mix");
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
		}
	}
	websocketLocal[wslid].onerror = function(error) {
		console.error('WebSocket Error ' + error);
		if(mode=="error"){
			$("#notice_icon_" + tlid).addClass("red-text");
			todo('WebSocket Error ' + error);
		}else{
			var errorct=localStorage.getItem("wserror_" + tlid)*1+1;
			localStorage.setItem("wserror_" + tlid,errorct);
			if(errorct<3){
				reconnector(tlid,TLtype,acct_id,"","error");
			}
		}
	};
	websocketLocal[wslid].onclose = function() {
		console.error('WebSocketLocal Closing by error:' + tlid);
		if(mode=="error"){
			$("#notice_icon_" + tlid).addClass("red-text");
			todo('WebSocket Closed');
		}else{
			var errorct=localStorage.getItem("wserror_" + tlid)*1+1;
			localStorage.setItem("wserror_" + tlid,errorct);
			if(errorct<3){
				reconnector(tlid,TLtype,acct_id,"","error");
			}
		}
	};
	websocketHome[wshid].onerror = function(error) {
		console.error('WebSocket Error ' + error);
		if(mode=="error"){
			$("#notice_icon_" + tlid).addClass("red-text");
			todo('WebSocket Error ' + error);
		}else{
			var errorct=localStorage.getItem("wserror_" + tlid)*1+1;
			localStorage.setItem("wserror_" + tlid,errorct);
			if(errorct<3){
				reconnector(tlid,TLtype,acct_id,"","error");
			}
		}
	};
	websocketHome[wshid].onclose = function() {
		console.error('WebSocketHome Closing by error:' + tlid);
		if(mode=="error"){
			$("#notice_icon_" + tlid).addClass("red-text");
			todo('WebSocket Closed');
		}else{
			var errorct=localStorage.getItem("wserror_" + tlid)*1+1;
			localStorage.setItem("wserror_" + tlid,errorct);
			if(errorct<3){
				reconnector(tlid,TLtype,acct_id,"","error");
			}
		}
		
	};

}

//ある程度のスクロールで発火
function mixmore(tlid,type) {
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	var acct_id = obj[tlid].domain;
	moreloading=true;
	todo("Integrated TL MoreLoading...(Local)");
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	var sid = $("#timeline_" + tlid + " .cvo").last().attr("unique-id");


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
						if(localStorage.getItem("filter_"+ acct_id)!="undefined"){
							var mute=getFilterType(JSON.parse(localStorage.getItem("filter_"+ acct_id)),"mix");
						}else{
							var mute=[];
						}
                        if(type=="integrated"){
							templete = templete+parse([timeline[key]], '', acct_id, tlid,"",mute,"mix");
						}else if(type=="plus"){
							if(timeline[key].account.acct==timeline[key].account.username){
								templete = templete+parse([timeline[key]], '', acct_id, tlid,"",mute,"mix");
							}
						}
                    }
                }

            });
            
             $("#timeline_" + tlid).append(templete);
			additional(acct_id, tlid);
			jQuery("time.timeago").timeago();
			moreloading=false;
			todc();
        });
	});
	

}
