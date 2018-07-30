//ユーザーデータ表示
//タイムライン
function utl(user, more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if (user == "--now") {
		var user = $('#his-data').attr("user-id");
	}
	if(domain!="misskey.xyz"){
		if (more) {
			var sid = $("#his-tl .cvo").last().attr("toot-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/accounts/" + user + "/statuses" +
			plus;
		var i={
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + at
			}
		}
	}else{
		var req={i:at}
		if (more) {
			var sid = $("#his-tl .cvo").last().attr("toot-id");
			req.maxId=sid;
		}
		req.userId=user;
		var start = "https://" + domain + "/api/users/notes"
		var i={
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify(req)
		}
	}
	fetch(start, i).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if(domain=="misskey.xyz"){
			var templete = misskeyParse(json, '', acct_id);
		}else{
			var templete = parse(json, '', acct_id);
		}
		if(!json[0]){
			templete=lang_details_nodata[lang]+"<br>";
		}
		var height = $("#his-data-content").height() - 245;
		$(".tab-content").css('height', height);
		if (more) {
			$("#his-tl-contents").append(templete);
		} else {
			if(domain!="misskey.xyz"){
				pinutl(templete,user, acct_id)
			}else{
				$("#his-tl-contents").html(templete);
			}
		}
		jQuery("time.timeago").timeago();
	});
}
//ピン留めTL
function pinutl(before,user, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if (user == "--now") {
		var user = $('#his-data').attr("user-id");
	}
		var plus = "?pinned=1";
	var start = "https://" + domain + "/api/v1/accounts/" + user + "/statuses" +
		plus
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
		if(!json[0]){
			templete="";
		}
		var height = $("#his-data-content").height() - 245;
		$(".tab-content").css('height', height);
			$("#his-tl-contents").html(templete+before);
		jQuery("time.timeago").timeago();
	});
}

//フォローリスト
function flw(user, more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if (user == "--now") {
		var user = $('#his-data').attr("user-id");
	}
	if(domain=="misskey.xyz"){
		var req={i:at}
		if (more) {
			var sid = $("#his-follow-list .cvo").last().attr("user-id");
			req.maxId=sid;
		}
		req.userId=user;
		var start = "https://" + domain + "/api/users/following"
		var i={
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify(req)
		}
	}else{
		if (more) {
			var sid = $("#his-follow-list .cvo").last().attr("user-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/accounts/" + user + "/following" +
			plus
		var i={
			method: 'GET',
			headers: {
				'content-type': 'application/json',
			}
		}
	}
	fetch(start,i).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if(domain=="misskey.xyz"){
			var templete = misskeyUserparse(json,'',acct_id);
		}else{
			var templete = userparse(json,'',acct_id);
		}
		if(templete==""){
			templete=lang_details_nodata[lang]+"<br>";
		}
		if (more) {
			$("#his-follow-list-contents").append(templete);
		} else {
			$("#his-follow-list-contents").html(templete);
		}


	});
}

//フォロワーリスト
function fer(user, more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if (user == "--now") {
		var user = $('#his-data').attr("user-id");
	}
	if(domain=="misskey.xyz"){
		var req={i:at}
		if (more) {
			var sid = $("#his-follower-list .cvo").last().attr("user-id");
			req.maxId=sid;
		}
		req.userId=user;
		var start = "https://" + domain + "/api/users/followers"
		var i={
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify(req)
		}
	}else{
		if (more) {
			var sid = $("#his-follower-list .cvo").last().attr("user-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/accounts/" + user + "/followers" +
			plus
		var i={
			method: 'GET',
			headers: {
				'content-type': 'application/json',
			}
		}
	}
	fetch(start, i).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if(domain=="misskey.xyz"){
			var templete = misskeyUserparse(json,'',acct_id);
		}else{
			var templete = userparse(json,'',acct_id);
		}
		if(templete==""){
			templete=lang_details_nodata[lang]+"<br>";
		}
		if (more) {
			$("#his-follower-list-contents").append(templete);
		} else {
			$("#his-follower-list-contents").html(templete);
		}

	});
}

//以下自分のみ
//お気に入り一覧
function showFav(more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(domain!="misskey.xyz"){
		if (more) {
			var sid = $("#his-fav-list .cvo").last().attr("toot-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/favourites" + plus
		var i={
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + at
			}
		}
	}else{
		var req={i:at}
		if (more) {
			var sid = $("#his-fav-list .cvo").last().attr("toot-id");
			req.maxId=sid;
		}
		var start = "https://" + domain + "/api/i/favorites"
		var i={
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify(req)
			}
	}
	
	fetch(start, i).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if(domain!="misskey.xyz"){
			var templete = parse(json, '', acct_id);
		}else{
			var templete = misskeyParse(json, '', acct_id);
		}
		if(!json[0]){
			templete=lang_details_nodata[lang]+"<br>";
		}
		if (more) {
			$("#his-fav-list-contents").append(templete);
		} else {
			$("#his-fav-list-contents").html(templete);
		}
		jQuery("time.timeago").timeago();
	});
}

//ミュートリスト
function showMut(more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(domain=="misskey.xyz"){
		var req={i:at}
		if (more) {
			var sid = $("#his-muting-list .cvo").last().attr("user-id");
			req.maxId=sid;
		}
		var start = "https://" + domain + "/api/mute/list"
		var i={
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify(req)
		}
	}else{
		if (more) {
			var sid = $("#his-muting-list .cvo").last().attr("user-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/mutes" + plus
		var i={
			method: 'GET',
			headers: {
				'content-type': 'application/json',
			}
		}
	}
	
	fetch(start,i).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if(!json[0]){
			templete=lang_details_nodata[lang]+"<br>";
		}
		var templete = userparse(json,'',acct_id);
		if (more) {
			$("#his-muting-list-contents").append(templete);
		} else {
			$("#his-muting-list-contents").html(templete);
		}

	});
}

//ブロックリスト
function showBlo(more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	if(domain=="misskey.xyz"){
		$("#his-blocking-list-contents").html(lang_hisdata_notonmisskey[lang]+"<br>");
		return false;
	}
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if (more) {
		var sid = $("#his-blocking-list .cvo").last().attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/blocks" + plus
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
		if(!json[0]){
			templete=lang_details_nodata[lang]+"<br>";
		}
		var templete = userparse(json,'',acct_id);
		if (more) {
			$("#his-blocking-list-contents").append(templete);
		} else {
			$("#his-blocking-list-contents").html(templete);
		}

	});
}

//フォロリクリスト
function showReq(more, acct_id) {
	
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(domain=="misskey.xyz"){
		var req={i:at}
		if (more) {
			var sid = $("#his-request-list .cvo").last().attr("user-id");
			req.maxId=sid;
		}
		var start = "https://" + domain + "/following/requests/list"
		var i={
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify(req)
		}
	}else{
		if (more) {
			var sid = $("#his-request-list .cvo").last().attr("user-id");
			var plus = "?max_id=" + sid;
		} else {
			var plus = "";
		}
		var start = "https://" + domain + "/api/v1/follow_requests" + plus
		var i={
			method: 'GET',
			headers: {
				'content-type': 'application/json',
			}
		}
	}
	fetch(start,i).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if(domain="misskey.xyz"){
			var templete = userparse(json, 'true',acct_id);
		}else{
			var templete = misskeyUserparse(json, 'true',acct_id);
		}
		
		if(!json[0]){
			templete=lang_details_nodata[lang]+"<br>";
		}
		if (more) {
			$("#his-request-list-contents").append(templete);
		} else {
			$("#his-request-list-contents").html(templete);
		}

	});
}

//ドメインブロックリスト
function showDom(more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	if(domain=="misskey.xyz"){
		$("#his-domain-list-contents").html(lang_hisdata_notonmisskey[lang]+"<br>");
		return false;
	}
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if (more) {
		var sid = $("#his-domain-list .cvo").last().attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/domain_blocks" + plus
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
		var templete = "";
		if(!json[0]){
			templete=lang_details_nodata[lang]+"<br>";
		}
		Object.keys(json).forEach(function(key) {
			var domain = json[key];
			templete = templete + domain +
				'<i class="material-icons gray pointer" onclick="domainblock(\'' +
				domain + '\',\'DELETE\')">cancel</i>' +
				'<div class="divider"></div>';
		});
		if (more) {
			$("#his-domain-list-contents").append(templete);
		} else {
			$("#his-domain-list-contents").html(templete);
		}

	});
}

//フォローレコメンデーションリスト
function showFrl(more, acct_id) {
	if (!acct_id) {
		var acct_id = $('#his-data').attr("use-acct");
	}
	var domain = localStorage.getItem("domain_" + acct_id);
	if(domain=="misskey.xyz"){
		$("#his-follow-recom-contents").html(lang_hisdata_notonmisskey[lang]+"<br>");
		return false;
	}
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if (more) {
		var sid = $("#his-follow-recom-list .cvo").last().attr("user-id");
		var plus = "?max_id=" + sid;
	} else {
		var plus = "";
	}
	var start = "https://" + domain + "/api/v1/suggestions" + plus
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		$("#his-follow-recom-contents").html(lang_details_nodata[lang]+"("+lang_hisdata_frcreq[lang]+")<br>");
		console.error(error);
	}).then(function(json) {
		console.log(json);
		if(!json[0]){
			console.log("No data");
			templete=lang_details_nodata[lang]+"("+lang_hisdata_frcwarn[lang]+")<br>";
		}else{
			var templete = userparse(json,'',acct_id);
		}
		
		if (more) {
			$("#his-follow-recom-contents").append(templete);
		} else {
			$("#his-follow-recom-contents").html(templete);
		}

	});
}

//ユーザーマッチングリスト
function showMat() {
	
	$("#his-matching-list-contents").html(lang_hisdata_taketime[lang]);
	var full=$("#his-acct").attr("fullname");
	var acct_id=$("#his-data").attr("use-acct");
	full=full.split("@");
	var start = "https://vinayaka.distsn.org/cgi-bin/vinayaka-user-match-filtered-api.cgi?"+full[1]+"+" + full[0];
	console.log(start);
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		},
		//body: JSON.stringify({})
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		var templete="";
		Object.keys(json).forEach(function(key) {
			var user = json[key];
			templete = templete +
			'<div class="" style="padding-top:5px;">' +
			'<div style="padding:0; margin:0; width:400px; max-width:100%; display:flex; align-items:flex-end;">' +
			'<div style="flex-basis:40px;"><a onclick="udgEx(\'' + user.user + '\',' +
			acct_id + ');" user="' + user.user + '" class="udg">' +
			'<img src="' + user.avatar + '" width="40" class="prof-img" user="' + user.user + '"></a></div>' +
			'<div style="flex-grow:3; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;user-select:auto; cursor:text;"><big>' +
			escapeHTML(user.screen_name) + '</big></div>' +
			'<div class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;user-select:auto; cursor:text;"> @' +
			user.user + '@'+user.host+'</div>' +
			'</div>' + 
			'<div class="divider"></div>' +
			'</div>' +
			'</div>';
		});
		$("#his-matching-list-contents").html(templete);
	});
}
