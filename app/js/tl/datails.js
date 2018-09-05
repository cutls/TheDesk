//トゥートの詳細
function details(id, acct_id, tlid) {
	$(".toot-reset").html(lang_details_nodata[lang]);
	var html = $("#timeline_"+tlid+" #pub_" + id).html();
	$("#toot-this").html(html);
	$('#tootmodal').modal('open');
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var start = "https://" + domain + "/api/notes/show";
		var i={
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify({
				i:at,
				noteId:id
			})
		}
	}else{
		var start = "https://" + domain + "/api/v1/statuses/" + id;
		var i={
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + at
			},
		}
	}
	
	fetch(start, i).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		console.log(json);
		if(!$("#timeline_"+tlid+" #pub_" + id).length){
			var html = parse([json], '', acct_id);
			$("#toot-this").html(html);
			jQuery("time.timeago").timeago();
		}
		if(localStorage.getItem("mode_" + domain)=="misskey"){
			var url="https://"+domain+"/notes/"+json.id;
			var scn=json.user.username;
			if(!json.user.host){
				var local=true;
			}else{
				var local=false;
				scn=scn+"@"+host;
			}
			var rep="";
			var uid=json.user.id;
			if(json._replyIds){
				replyTL(json._replyIds[0], acct_id);
			}
		}else{
			var url=json.url
			if(json.account.acct==json.account.username){
				var local=true;
			}else{
				var local=false;
			}
			var scn=json.account.acct;
			var uid=json.account.id;
			if (json["in_reply_to_id"]) {
				replyTL(json["in_reply_to_id"], acct_id);
			}
		}
		$("#toot-this .fav_ct").text(json.favourites_count);
		$("#toot-this .rt_ct").text(json.reblogs_count);
		$("#tootmodal").attr("data-url",url);
		$("#tootmodal").attr("data-id",json.id);
		if(local){
			$("#tootmodal").attr("data-user",scn+"@"+domain);
		}else{
			$("#tootmodal").attr("data-user",scn);
		}
		context(id, acct_id);
		if(!local){
			var dom=scn.replace(/.+@/g,'');
		}else{
			var dom=domain;
		}
		beforeToot(id, acct_id, dom);
		userToot(id, acct_id, uid);
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
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var start = "https://" + domain + "/api/notes/show";
		var i={
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify({
				i:at,
				noteId:id
			})
		}
	}else{
		var start = "https://" + domain + "/api/v1/statuses/" + id;
		var i={
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + at
			},
		}
	}
	fetch(start, i).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if(localStorage.getItem("filter_"+ acct_id)!="undefined"){
			var mute=getFilterType(JSON.parse(localStorage.getItem("filter_"+ acct_id)),"thread");
		}else{
			var mute=[];
		}
		if(localStorage.getItem("mode_" + domain)=="misskey"){
			var templete = misskeyParse([json], '', acct_id,"","",mute);
			$("#toot-after").prepend(templete);
			$("#toot-after .hide").html(lang_details_filtered[lang]);
			$("#toot-after .by_filter").css("display","block");
			$("#toot-after .by_filter").removeClass("hide");
			var rep="_replyIds";
			if (json[rep]) {
				replyTL(json[rep][0], acct_id);
			}
		}else{
			var templete = parse([json], '', acct_id,"","",mute);
			$("#toot-reply").prepend(templete);
			$("#toot-reply .hide").html(lang_details_filtered[lang]);
			$("#toot-reply .by_filter").css("display","block");
			$("#toot-reply .by_filter").removeClass("hide");
		jQuery("time.timeago").timeago();
			var rep="in_reply_to_id";
			if (json[rep]) {
				replyTL(json[rep], acct_id);
			}
		}
		
	});
}

//コンテクストってなんですか
function context(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var start = "https://" + domain + "/api/notes/conversation";
		var i={
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify({
				i:at,
				noteId:id
			})
		}
	}else{
		var start = "https://" + domain + "/api/v1/statuses/" + id + "/context";
		var i={
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				'Authorization': 'Bearer ' + at
			},
		}
	}
	fetch(start, i).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(json) {
		if(localStorage.getItem("mode_" + domain)=="misskey"){
			json.reverse();
			console.log(json);
			var templete = misskeyParse(json, '', acct_id,"","",[]);
			$("#toot-reply").html(templete);
			$("#toot-reply .hide").html(lang_details_filtered[lang]);
			$("#toot-reply .by_filter").css("display","block");
			$("#toot-reply .by_filter").removeClass("hide");
			jQuery("time.timeago").timeago();
		}else{
			if(localStorage.getItem("filter_"+ acct_id)!="undefined"){
				var mute=getFilterType(JSON.parse(localStorage.getItem("filter_"+ acct_id)),"thread");
			}else{
				var mute=[];
			}
			var templete = parse(json.descendants, '', acct_id,"","",mute);
			$("#toot-after").html(templete);
			$("#toot-after .hide").html(lang_details_filtered[lang]);
			$("#toot-after .by_filter").css("display","block");
			$("#toot-after .by_filter").removeClass("hide");
			jQuery("time.timeago").timeago();
		}
		
	});
}

//前のトゥート(Back TL)
function beforeToot(id, acct_id, domain) {
	//var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var start = "https://" + domain +
		"/api/notes/local-timeline"
		fetch(start, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify({
				i:at,
				untilID:id
			})
			}).then(function(response) {
				return response.json();
			}).catch(function(error) {
				todo(error);
				console.error(error);
			}).then(function(json) {
				var templete = misskeyParse(json, 'noauth', acct_id);
				$("#toot-before").html(templete);
				jQuery("time.timeago").timeago();
			});
	}else{
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
}
//前のユーザーのトゥート
function userToot(id, acct_id, user) {
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
	if(localStorage.getItem("mode_" + domain)=="misskey"){
		var start = "https://" + domain +
		"/api/users/notes"
		fetch(start, {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body:JSON.stringify({
				i:at,
				untilID:id,
				userId:user
			})
			}).then(function(response) {
				return response.json();
			}).catch(function(error) {
				todo(error);
				console.error(error);
			}).then(function(json) {
				var templete = misskeyParse(json, 'noauth', acct_id);
				$("#user-before").html(templete);
				jQuery("time.timeago").timeago();
			});
	}else{
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
	
}

//ふぁぼ一覧
function faved(id, acct_id) {
	var domain = localStorage.getItem("domain_" + acct_id);
	if(localStorage.getItem("mode_" + domain)=="misskey"){ return false; }
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
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
	if(localStorage.getItem("mode_" + domain)=="misskey"){ return false; }
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
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
		Materialize.toast(lang_details_embed[lang], 1500);
	}else{
		if(execCopy(url)){
			Materialize.toast(lang_details_url[lang], 1500);
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
		Materialize.toast(lang_details_txt[lang], 1500);
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
					if(localStorage.getItem("savefolder")){
						var save=localStorage.getItem("savefolder");
					}else{
						var save="";
					}
                    ipc.send('shot', ['file://' + screenshotPath,w,h,b64[1],title,off.top+50,off.left,save]);
                    if($("#toot-this .img-parsed").length>0){
                        for(i=0;i<$("#toot-this .img-parsed").length;i++){
							var url=$("#toot-this .img-parsed").eq(i).attr("data-url");
							if(localStorage.getItem("savefolder")){
								var save=localStorage.getItem("savefolder");
							}else{
								var save="";
							}
                            ipc.send('shot-img-dl', [url,title+"_img"+i+".png",save]);
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
	var at = localStorage.getItem("acct_"+ acct_id + "_at");
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