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
		var templete = parseNotf(json, -1, tlid, acct_id);
		if (sys == "direct") {
			$("#timeline_" + tlid).html(templete[0]);
		} else {
			$("#notifications_" + tlid).html(templete[0]);
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
			var templete = parseNotf([obj], popup, tlid, acct_id);
			var notices = templete[1];
			console.log(templete);
			if (sys == "direct") {
				$("#timeline_" + tlid).prepend(templete[0]);
			} else {
				$("#notifications_" + tlid).prepend(templete[0]);
			}
			jQuery("time.timeago").timeago();
		}

	}
	websocketNotf[wsid].onerror = function(error) {
		console.error('WebSocket Error ' + error);
	};
}

//通知トグルボタン
function notfToggle(acct, tlid) {
	$("#notf-box_" + tlid).toggleClass("hide");
	if (!$("#notf-box_" + tlid).hasClass("fetched")) {
		notf(acct, tlid);
	}
	$(".notf-icon_" + tlid).removeClass("red-text");
}

//通知オブジェクトパーサー
function parseNotf(obj, popup, tlid, acct_id) {
	var templete = '';
	var datetype = localStorage.getItem("datetype");
	var nsfwtype = localStorage.getItem("nsfw");
	if (!nsfwtype || nsfwtype == "yes") {
		var nsfw = "ok";
	} else {
		var nsfw;
	}
	var cwtype = localStorage.getItem("cw");
	if (!cwtype || cwtype == "yes") {
		var cw = "ok";
	} else {
		var cw;
	}
	if (!datetype) {
		datetype = "absolute";
	}
	Object.keys(obj).forEach(function(key) {
		var eachobj = obj[key];
		var toot = eachobj.status;
		//トゥートである
		if (toot) {
			if (!toot.application) {
				var via = '<span style="font-style: italic;">Unknown</span>';
			} else {
				var via = toot.application.name;
			}
			var sent = localStorage.getItem("sentence");
				if (!sent) {
					var sent = 500;
				}
			if (toot.spoiler_text && cw) {
				var content = toot.content;
				var spoil = toot.spoiler_text;
				var spoiler = "cw cw_hide_" + toot.id;
				var api_spoil = "gray";
				var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
					'\')" class="nex parsed">見る</a>';
			} else {
				var ct = toot.content.split('</p>').length + toot.content.split('<br />').length -
					2;
				if (sent < ct && $.mb_strlen(toot.content) > 5) {
					var content = '<span class="gray">以下全文</span><br>' + toot.content
					var spoil = '<span class="cw-long-'+toot.id+'">'+$.strip_tags($.mb_substr(toot.content, 0, 100)) +
						'</span><span class="gray">自動折りたたみ</span>';
					var spoiler = "cw cw_hide_" + toot.id;
					var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
						'\')" class="nex parsed">続き…</a>';
				} else {
					var content = toot.content;
					var spoil = toot.spoiler_text;
					var spoiler = "";
					var spoiler_show = "";
				}
			}
			if (toot.account.locked) {
				var locked = ' <i class="fa fa-lock red-text"></i>';
			} else {
				var locked = "";
			}
			var id = toot.id;
			if (eachobj.type == "mention") {
				var what = "返信しました";
			} else if (eachobj.type == "reblog") {
				var what = "ブーストしました";
			} else if (eachobj.type == "favourite") {
				var what = "ふぁぼしました";
			}
			var noticetext = '<a onclick="udg(\'' + eachobj.account.id +
				'\',\'' + acct_id + '\')" class="pointer">'+eachobj.account.display_name + "(" + eachobj.account.acct +
				")</a>が" + what;
			var memory = localStorage.getItem("notice-mem");
			if (popup >= 0 && obj.length < 5 && noticetext != memory) {
				Materialize.toast(noticetext, popup * 1000);
				$(".notf-icon_" + tlid).addClass("red-text");
				localStorage.setItem("notice-mem",noticetext);
				notftext="";
			}
			if (toot.spoiler_text && cw) {
				var spoiler = "cw cw_hide_" + toot.id;
				var spoiler_show = '<a onclick="cw_show(\'' + toot.id + '\')">見る</a>';
			} else {
				var spoiler = "";
				var spoiler_show = "";
			}
			var urls = content.match(
				/https?:\/\/([-a-zA-Z0-9@.]+)\/?([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)?/
			);
			if(urls){
				var analyze='<a onclick="additionalIndv(\'' + tlid + '\',' + acct_id +
				',\''+id+'\')" class="add-show pointer">URL解析</a>';
			}else{
				var analyze='';
			}
			var viewer = "";
			var youtube = "";
			var emojick = toot.emojis[0];
		//絵文字があれば
		var content=toot.content
		if (emojick) {
			Object.keys(toot.emojis).forEach(function(key5) {
				var emoji = toot.emojis[key5];
				var shortcode = emoji.shortcode;
				var emoji_url = '<img src="' + emoji.url +
					'" style="width:1em" class="emoji-img">';
				var regExp = new RegExp(":" + shortcode + ":", "g");
				content = content.replace(regExp, emoji_url);
			});
		}
			var mediack = toot.media_attachments[0];
			//メディアがあれば
		if (mediack) {
			var cwdt=100/toot.media_attachments.length
			Object.keys(toot.media_attachments).forEach(function(key2) {
				var media = toot.media_attachments[key2];
				var purl = media.preview_url;
				var url = media.url;
				if (toot.sensitive && nsfw) {
					var sense = "sensitive"
				} else {
					var sense = ""
				}
				viewer = viewer + '<a onclick="imgv(\''+id+'\',\''+key2+'\','+acct_id+')" id="'+id+'-image-'+key2+'" data-url="'+url+'" data-type="'+media.type+'" class="img-parsed"><img src="' + purl + '" class="' + sense +
					' toot-img pointer" style="width:'+cwdt+'%"></a></span>';
			});
		} else {
			viewer = "";
		}
		//公開範囲を取得
		var vis="";
		var visen=toot.visibility;
		if(visen=="public"){
			var vis = '<i class="text-darken-3 material-icons gray sml pointer" title="公開(クリックでトゥートURLをコピー)" onclick="tootUriCopy(\''+toot.url+'\');">public</i>';
		}else if(visen=="unlisted"){
			var vis = '<i class="text-darken-3 material-icons blue-text pointer" title="未収載(クリックでトゥートURLをコピー)" onclick="tootUriCopy(\''+toot.url+'\');">lock_open</i>';
		}else if(visen=="plivate"){
			var vis = '<i class="text-darken-3 material-icons orange-text pointer" title="非公開(クリックでトゥートURLをコピー)" onclick="tootUriCopy(\''+toot.url+'\');">lock</i>';
		}else if(visen=="direct"){
			var vis = '<i class="text-darken-3 material-icons red-text pointer" title="ダイレクト(クリックでトゥートURLをコピー)" onclick="tootUriCopy(\''+toot.url+'\');">mail</i>';
		}
			var menck = toot.mentions[0];
			var mentions = "";
			if (menck) {
				mentions = "Links: ";
				Object.keys(toot.mentions).forEach(function(key3) {
					var mention = toot.mentions[key3];
					mentions = mentions + '<a onclick="udg(\'' + mention.id +
						'\')" class="pointer">@' + mention.acct + '</a> ';
				});
			}
			var tagck = toot.tags[0];
			var tags = "";
			if (tagck) {
				if (!menck) {
					tags = "Links: ";
				}
				Object.keys(toot.tags).forEach(function(key4) {
					var tag = toot.tags[key4];
					tags = tags + '<a onclick="tl(\'tag\',\'' + tag.name +
						'\')" class="pointer">#' + tag.name + '</a> ';
				});
			}
			if (toot.favourited) {
				var if_fav = " yellow-text";
				var fav_app = "faved";
			} else {
				var if_fav = "";
				var fav_app = "";
			}
			if (toot.reblogged) {
				var if_rt = "teal-text";
				var rt_app = "rted";
			} else {
				var if_rt = "";
				var rt_app = "";
			}
			if (toot.account.acct == localStorage.getItem("user_" + acct_id)) {
				var if_mine = "";
			} else {
				var if_mine = "hide";
			}
			if (toot.favourited) {
				var if_fav = " yellow-text";
				var fav_app = "faved";
			} else {
				var if_fav = "";
				var fav_app = "";
			}
			if (toot.reblogged) {
				var if_rt = "teal-text";
				var rt_app = "rted";
			} else {
				var if_rt = "";
				var rt_app = "";
			}
			var boostback="";
			var hasmedia="";
			var home=""
			var notice = noticetext;
				templete = templete + '<div id="pub_' + toot.id + '" class="cvo ' +
				boostback + ' ' + fav_app + ' ' + rt_app +
				' '+ hasmedia + '" toot-id="' + id + '" unixtime="' + date(obj[
					key].created_at, 'unix') + '">'+
				'<div class="area-notice"><span class="gray sharesta">' + noticetext + home + '</span></div>'+
				'<div class="area-icon"><a onclick="udg(\'' + toot.account.id +
				'\',' + acct_id + ');" user="' + toot.account.acct + '" class="udg">' +
				'<img src="' + toot.account.avatar +
				'" width="40" class="prof-img" user="' + toot.account.acct +
				'"></a></div>'+
				'<div class="area-display_name"><span class="user">' +
				toot.account.display_name + '</span></div>'+
				'<div class="area-acct"><span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;"> @' +
				toot.account.acct + locked + '</span><span class="cbadge right"><i class="fa fa-clock-o"></i>' + date(eachobj.created_at,
					datetype) + '</span></div>'+
				'<div class="area-toot"><span class="toot ' + spoiler + '">' + content + '</span><span class="' +
				api_spoil + ' cw_text_' + toot.id + '">' + spoil + spoiler_show +
				'</span>' +
				'' + viewer + '' +
				'<span class="additional">' + analyze + '</span></div>'+
				'<div class="area-date_via">'+ mentions + tags +'</div>'+
				'<div class="area-actions" style="padding:0; margin:0; top:-20px; display:flex; justify-content:space-around; max-width:100%; ">' +
				'<div class="action">'+ vis +'</div><div class="action"><a onclick="re(\'' + toot.id + '\',\'' + toot.account.acct + '\',' +
				acct_id +
				')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="fa fa-share"></i></a></div>' +
				'<div class="action"><a onclick="rt(\'' + toot.id + '\',' + acct_id +
				',\''+tlid+'\')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="text-darken-3 fa fa-retweet ' +
				if_rt + ' rt_' + toot.id + '"></i><span class="rt_ct">' + toot.reblogs_count +
				'</span></a></div>' +
				'<div class="action"><a onclick="fav(\'' + toot.id + '\',' + acct_id +
				',\''+tlid+'\')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="fa text-darken-3 fa-star' +
				if_fav + ' fav_' + toot.id + '"></i><span class="fav_ct">' + toot.favourites_count +
				'</a></span></div>' +
				'<div class="' + if_mine + ' action"><a onclick="del(\'' + toot.id + '\',' +
				acct_id +
				')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="fa fa-trash-o"></i></a></div>' +
				'<div class="action"><a onclick="details(\'' + toot.id + '\',' + acct_id +
				')" class="waves-effect waves-dark btn-flat details" style="padding:0"><i class="text-darken-3 material-icons">more_vert</i></a></div>' +
				'<div><span class="cbadge"><i class="fa fa-clock-o"></i>' +
				date(toot.created_at, datetype) + '</span></div>' +
				'<div><span class="cbadge" title="via ' + $.strip_tags(via) + '">via ' + via +
				'</span></div></div></div>'+
			  '</div><div class="divider"></div>';
			var noticetext = eachobj.account.display_name + "(" + eachobj.account.acct +
				")がフォローしました";
			if (popup >= 0 && obj.length < 5) {
				Materialize.toast(noticetext, popup * 1000);
				$(".notf-icon").addClass("red-text");
			}
		}
	});
	if (!noticetext) {
		var noticetext = null;
	}
	return [templete, noticetext];
}
