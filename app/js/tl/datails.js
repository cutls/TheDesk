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
			var html = parse([json], '', acct_id);
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
		if(json.account.acct!=json.account.username){
			var dom=json.account.acct.replace(/.+@/g,'');
		}else{
			var dom=domain;
		}
		beforeToot(id, acct_id, dom);
		userToot(id, acct_id, json.account.id);
		faved(id, acct_id);
		rted(id, acct_id);
		if(!$("#activator").hasClass("active")){
			$('#det-col').collapsible('open', 1);
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
		var templete = parse([json], '', acct_id);
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
		var templete = parse(json.descendants, '', acct_id);
		$("#toot-after").html(templete);
		
		jQuery("time.timeago").timeago();
	});
}

//前のトゥート(Back TL)
function beforeToot(id, acct_id, domain) {
	//var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain +
		"/api/v1/timelines/public?local=true&max_id=" + id;
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
		},
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		var templete = parse(json, 'noauth', acct_id);
		$("#toot-before").html(templete);
		jQuery("time.timeago").timeago();
	});
}
//前のユーザーのトゥート
function userToot(id, acct_id, user) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem(domain + "_at");
	var start = "https://" + domain + "/api/v1/accounts/" + user + "/statuses?max_id=" + id;
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
		$("#user-before").html(templete);
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
		var templete = userparse(json, '', acct_id);
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
		var templete = userparse(json, '', acct_id);
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
	html = html.replace(/^<p>(.+)<\/p>$/,"$1");
	html = html.replace(/<br\s?\/?>/, "\n");
	html = html.replace(/<p>/, "\n");
	html = html.replace(/<\/p>/, "\n");
	console.log(html);
	html = html.replace(/<img[\s\S]*alt="(.+?)"[\s\S]*?>/g, "$1");
	html=$.strip_tags(html);
	if(execCopy(html)){
		Materialize.toast("トゥート本文をコピーしました", 1500);
	}
	
}
//魚拓
function shot(){
	var title=$("#tootmodal").attr("data-id");
	var off = $('#toot-this').offset();
	var w=$("#toot-this").width()+50;
	var h=$("#toot-this").height()+50;
	var electron = require("electron");
	const fs = require("fs");
	const os = require('os')
	const shell = electron.shell;
	const path = require('path')
	var ipc = electron.ipcRenderer;
	let options = {
        types: ['screen'],
        thumbnailSize: {
            width: window.parent.screen.width,
            height: window.parent.screen.height
          }
	}
	const desktopCapturer = electron.desktopCapturer;
	desktopCapturer.getSources(options, function(error, sources) {
		if (error) return console.log(error)

		sources.forEach(function(source) {
			if (source.name === 'Screen 1' || source.name === 'TheDesk') {
                var durl=source.thumbnail.toDataURL();
                var b64 = durl.match(
                    /data:image\/png;base64,(.+)/
                );
                const screenshotPath = path.join(os.tmpdir(), 'screenshot.png');
                const savePath = path.join(os.tmpdir(), 'screenshot.png');
                    var ipc = electron.ipcRenderer;
                    ipc.send('shot', ['file://' + screenshotPath,w,h,b64[1],title,off.top+50,off.left]);
                    if($("#toot-this .img-parsed").length>0){
                        for(i=0;i<$("#toot-this .img-parsed").length;i++){
                            var url=$("#toot-this .img-parsed").eq(i).attr("data-url");
                            ipc.send('shot-img-dl', [url,title+"_img"+i+".png"]);
                        }
                    }
                    return;
					const message = `Saved screenshot to: ${screenshotPath}`
					//screenshotMsg.textContent = message
			}
		})
	})
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
function detEx(url,acct_id){
	if(acct_id=="main"){
		acct_id=localStorage.getItem("main");
	}
	var domain = localStorage.getItem("domain_"+acct_id);
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
			$(".loadp").text($(".loadp").attr("href"));
			$(".loadp").removeClass("loadp");
			details(id, acct_id, 0)
		}
		
	});
	return;
}