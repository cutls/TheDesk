//トゥートの詳細
function details(id, acct_id) {
	$(".toot-reset").html("トゥートはありません");
	var html = $("#pub_" + id).html();
	$("#toot-this").html(html);
	$('#tootmodal').modal('open');
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id;
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
		$("#toot-this .fav_ct").text(json.favourites_count);
		$("#toot-this .rt_ct").text(json.reblogs_count);
		if (json.in_reply_to_id) {
			replyTL(json.in_reply_to_id, acct_id);
		}
		context(id, acct_id);
		faved(id, acct_id);
		rted(id, acct_id);
	});
}

//返信タイムライン
function replyTL(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id;
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
		var templete = parse([json]);
		$("#toot-reply").prepend(templete);
		jQuery("time.timeago").timeago();
		if (json.in_reply_to_id) {
			replyTL(json.in_reply_to_id, acct_id);
		}
	});
}

//コンテクストってなんですか
function context(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/context";
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
		var templete = parse(json.descendants);
		$("#toot-after").html(templete);
		beforeToot(id, acct_id);
		jQuery("time.timeago").timeago();
	});
}

//前のトゥート(Back TL)
function beforeToot(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain +
		"/api/v1/timelines/public?local=true&max_id=" + id;
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
		var templete = parse(json);
		$("#toot-before").html(templete);
		jQuery("time.timeago").timeago();
	});
}

//ふぁぼ一覧
function faved(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/favourited_by";
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
		var templete = userparse(json);
		$("#toot-fav").html(templete);
	});
}

//ブースト一覧
function rted(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/statuses/" + id + "/reblogged_by";
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
		var templete = userparse(json);
		$("#toot-rt").html(templete);
	});
}
