//トゥートの詳細
function details(id, acct_id, tlid) {
	$(".toot-reset").html("データなし");
	var html = $("#timeline_"+tlid+" #pub_" + id).html();
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
		if(!$("#timeline_"+tlid+" #pub_" + id).length){
			var html = parse([json]);
			$("#toot-this").html(html);
			jQuery("time.timeago").timeago();
		}
		$("#toot-this .fav_ct").text(json.favourites_count);
		$("#toot-this .rt_ct").text(json.reblogs_count);
		$("#tootmodal").attr("data-url",json.url);
		$("#tootmodal").attr("data-id",json.id);
		if(json.account.acct==json.account.username){
			$("#tootmodal").attr("data-user",json.account.acct+"@"+domain);
		}else{
			$("#tootmodal").attr("data-user",json.account.acct);
		}
		if (json.in_reply_to_id) {
			replyTL(json.in_reply_to_id, acct_id);
		}
		context(id, acct_id);
		faved(id, acct_id);
		rted(id, acct_id);
		if(!$("#activator").hasClass("active")){
			$('#det-col').collapsible('open', 2);
		}
		
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
//URL等のコピー
function cbCopy(mode){
	var url=$("#tootmodal").attr("data-url");
	var urls = url.match(/https?:\/\/([-.a-zA-Z0-9]+)/);
	var domain=urls[1];
	if(mode=="emb"){
		var emb='<iframe src="'+url+'/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400"></iframe><script src="https://'+domain+'/embed.js" async="async"></script>';
		execCopy(emb)
		Materialize.toast("埋め込みHTMLをコピーしました", 1500);
	}else{
		if(execCopy(url)){
			Materialize.toast("トゥートURLをコピーしました", 1500);
		}
		
	}
}
//本文のコピー
function staCopy(id){
	var html=$("[toot-id="+id+"] .toot").html();
	html = html.match(/^<p>(.+)<\/p>$/)[1];
	html = html.replace(/<br\s?\/?>/, "\n");
	html = html.replace(/<p>/, "\n");
	html = html.replace(/<\/p>/, "\n");
	html=$.strip_tags(html);
	if(execCopy(html)){
		Materialize.toast("トゥート本文をコピーしました", 1500);
	}
	
}
//魚拓
function shot(){
	var id=$("#tootmodal").attr("data-id");
	var w=$("#toot-this").width();
	var h=$("#toot-this").height()+150;
	var text=$("#toot-this").html();
	localStorage.setItem("sc-text",text)
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('screen', [w,h,id]);
}
//翻訳
function trans(tar){
	var html=$("#toot-this .toot").html();
	if(html.match(/^<p>(.+)<\/p>$/)){
		html = html.match(/^<p>(.+)<\/p>$/)[1];
	}
	html = html.replace(/<br\s?\/?>/g, "\n");
	html = html.replace(/<p>/g, "\n");
	html = html.replace(/<\/p>/g, "\n");
	html=$.strip_tags(html);
	$("#toot-this .additional").text("Loading...(Powered by Google Translate)");
	var exec='https://script.google.com/macros/s/AKfycbz0ETqcUxwNlw961GjErNb7vr_X18N2s1AS5Xu5nFTbYXcdcRM/exec?text='+encodeURIComponent(html)+'&source='+tar+'&target=ja'
	console.log(exec);
	fetch(exec, {
		method: 'GET',
	}).then(function(response) {
		return response.text();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(text) {
		$("#toot-this .additional").html('<span class="gray">'+text+'</span>');
	});
}
//ブラウザで開く
function brws(){
	var url=$("#tootmodal").attr("data-url");
	const {
		shell
	} = require('electron');

	shell.openExternal(url);
}
//外部からトゥート開く
function detEx(url){
	var domain = localStorage.getItem("domain_0");
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/search?resolve=true&q="+url
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		}
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if(!json.statuses){
			const {
				shell
			} = require('electron');
  
			shell.openExternal(url);
		}else{
			var id=json.statuses[0].id;
			details(id, 0, 0)
		}
		
	});
	return;
}