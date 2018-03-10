//オブジェクトパーサー(トゥート)
function parse(obj, mix, acct_id, tlid, popup) {
	var templete = '';
	var datetype = localStorage.getItem("datetype");
	var nsfwtype = localStorage.getItem("nsfw");
	var sent = localStorage.getItem("sentence");
	var ltr = localStorage.getItem("letters");
	var gif = localStorage.getItem("gif");
	var imh = localStorage.getItem("img-height");
	//クライアント強調
	var emp = localStorage.getItem("client_emp");
	if(emp){
		var emp = JSON.parse(emp);
	}
	//クライアントミュート
	var mute = localStorage.getItem("client_mute");
	if(mute){
		var mute = JSON.parse(mute);
	}
	//ユーザー強調
	var useremp = localStorage.getItem("user_emp");
	if(useremp){
		var useremp = JSON.parse(useremp);
	}
	//ワード強調
	var wordemp = localStorage.getItem("word_emp");
	if(wordemp){
		var wordemp = JSON.parse(wordemp);
	}
	//ワードミュート
	var wordmute = localStorage.getItem("word_mute");
	if(wordmute){
		var wordmute = JSON.parse(wordmute);
	}
	if (!sent) {
		var sent = 500;
	}
	if (!ltr) {
		var ltr = 500;
	}
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
	if (!gif) {
		var gif = "yes";
	}
	if (!imh) {
		var imh = "200";
	}
	if(!emp){
		var emp=[];
	}
	if(!mute){
		var mute=[];
	}
	if(!useremp){
		var useremp=[];
	}
	if(!wordemp){
		var wordemp=[];
	}
	if(!wordmute){
		var wordmute=[];
	}

	var local = [];
	var times=[];
	Object.keys(obj).forEach(function(key) {
		var toot = obj[key];
		if(popup){
			if (toot.type == "mention") {
				var what = "返信しました";
			} else if (toot.type == "reblog") {
				var what = "ブーストしました";
			} else if (toot.type == "favourite") {
				var what = "お気に入り登録しました";
			}
			var noticetext = '<span class="cbadge"title="' + date(toot.created_at,
				'absolute') + '(通知された時間)"><i class="fa fa-clock-o"></i>' + date(toot.created_at,
				datetype) +
			'</span><a onclick="udg(\'' + toot.account.id +
				'\',\'' + acct_id + '\')" class="pointer">' + toot.account.display_name +
				"(" + toot.account.acct +
				")</a>が" + what;
			var notice = noticetext;
			var memory = localStorage.getItem("notice-mem");
			if (popup >= 0 && obj.length < 5 && noticetext != memory) {
				Materialize.toast(toot.account.display_name+"が"+what, popup * 1000);
				$(".notf-icon_" + tlid).addClass("red-text");
				localStorage.setItem("notice-mem", noticetext);
				noticetext = "";
			}
			var toot = toot.status;
		}else{
			if (toot.reblog) {
				var notice = toot.account.display_name + "(" + toot.account.acct +
					")がブースト<br>";
					var boostback = "shared";
				var toot = toot.reblog;
			} else {
				var notice = "";
				var boostback = "";
				//ユーザー強調
				if(toot.account.username!=toot.account.acct){
					var fullname=toot.account.acct;
				}else{
					var domain = localStorage.getItem("domain_" + acct_id);
					var fullname=toot.account.acct+"@"+domain;
				}
				if(useremp){
					console.log(useremp);
					Object.keys(useremp).forEach(function(key10) {
					var user = useremp[key10];
					if(user==fullname){
						boostback = "emphasized";
					}
					});
				}
			}
		}
		var id = toot.id;
		//Integratedである場合はUnix時間をキーに配列を生成しておく
		if (mix == "mix") {
			local[date(obj[key].created_at, 'unix')] = toot.id;
			times.push(date(obj[key].created_at, 'unix'));
			var divider = '<div class="divider"></div>';
		}
		if (mix == "home") {
			var home = "Home TLより"
			var divider = '<div class="divider"></div>';
		} else {
			var home = "";
			var divider = '<div class="divider"></div>';
		}
		if (toot.account.locked) {
			var locked = ' <i class="fa fa-lock red-text"></i>';
		} else {
			var locked = "";
		}
		if (!toot.application) {
			var via = '<span style="font-style: italic;">Unknown</span>';
		} else {
			var via = toot.application.name;
			//強調チェック
			Object.keys(emp).forEach(function(key6) {
				var cli = emp[key6];
				if(cli == via){
					boostback = "emphasized";
				}
			});
			//ミュートチェック
			Object.keys(mute).forEach(function(key7) {
				var cli = mute[key7];
				if(cli == via){
					boostback = "hide";
				}
			});
		}
		if (toot.spoiler_text && cw) {
			var content = toot.content;
			var spoil = toot.spoiler_text;
			var spoiler = "cw cw_hide_" + toot.id;
			var api_spoil = "gray";
			var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
				'\')" class="nex parsed">見る</a><br>';
		} else {
			var ct = toot.content.split('</p>').length + toot.content.split('<br />').length -
				2;
			if ((sent < ct && $.mb_strlen($.strip_tags(toot.content)) > 5) || ($.strip_tags(toot.content).length > ltr && $.mb_strlen($.strip_tags(toot.content)) > 5)) {
				var content = '<span class="gray">以下全文</span><br>' + toot.content
				var spoil = '<span class="cw-long-' + toot.id + '">' + $.mb_substr($.strip_tags(
						toot.content), 0, 100) +
					'</span><span class="gray">自動折りたたみ</span>';
				var spoiler = "cw cw_hide_" + toot.id;
				var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
					'\')" class="nex parsed">続き…</a><br>';
			} else {
				var content = toot.content;
				var spoil = toot.spoiler_text;
				var spoiler = "";
				var spoiler_show = "";
			}
		}
		var urls = content.match(
			/https?:\/\/([-a-zA-Z0-9@.]+)\/?(?!.*((media|tags)|mentions)).*([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)?/
		);
		if (urls) {
			var analyze = '<a onclick="additionalIndv(\'' + tlid + '\',' + acct_id +
				',\'' + id + '\')" class="add-show pointer">URL解析</a><br>';
		} else {
			var analyze = '';
		}
		var viewer = "";
		var hasmedia = "";
		var youtube = "";
		var emojick = toot.emojis[0];
		//絵文字があれば
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
			hasmedia = "hasmedia";
			var cwdt = 100 / toot.media_attachments.length
			Object.keys(toot.media_attachments).forEach(function(key2) {
				var media = toot.media_attachments[key2];
				var purl = media.preview_url;
				var url = media.url;
				if (toot.sensitive && nsfw) {
					var sense = "sensitive"
				} else {
					var sense = ""
				}
				viewer = viewer + '<a onclick="imgv(\'' + id + '\',\'' + key2 + '\',' +
					acct_id + ')" id="' + id + '-image-' + key2 + '" data-url="' + url +
					'" data-type="' + media.type + '" class="img-parsed"><img src="' +
					purl + '" class="' + sense +
					' toot-img pointer" style="width:' + cwdt + '%; height:'+imh+'px;"></a></span>';
			});
		} else {
			viewer = "";
			hasmedia = "nomedia";
		}
		var menck = toot.mentions[0];
		var mentions = "";
		//メンションであれば
		if (menck) {
			mentions = "Links: ";
			Object.keys(toot.mentions).forEach(function(key3) {
				var mention = toot.mentions[key3];
				mentions = mentions + '<a onclick="udg(\'' + mention.id + '\',' +
					acct_id + ')" class="pointer">@' + mention.acct + '</a> ';
			});
			mentions = '<div style="float:right">' + mentions + '</div>';
		}
		var tagck = toot.tags[0];
		var tags = "";
		//タグであれば
		if (tagck) {
			if (!menck) {
				tags = "Links: ";
			}
			Object.keys(toot.tags).forEach(function(key4) {
				var tag = toot.tags[key4];
				tags = tags + '<a onclick="tagShow(\'' + tag.name + '\')" class="pointer">#' + tag.name + '</a><span class="hide" data-tag="' + tag.name + '">　<a onclick="tl(\'tag\',\'' + tag.name + '\',' + acct_id +
					',\'add\')" class="pointer" title="#' + tag.name + 'のタイムライン">TL</a>　<a onclick="brInsert(\'#' + tag.name + '\')" class="pointer" title="#' + tag.name + 'でトゥート">Toot</a>　'+
					'<a onclick="tagPin(\'' + tag.name + '\')" class="pointer" title="#' + tag.name + 'をよく使うタグへ">Pin</a></span> ';
			});
			tags = '<div style="float:right">' + tags + '</div>';
		}
		//公開範囲を取得
		var vis = "";
		var visen = toot.visibility;
		if (visen == "public") {
			var vis =
				'<i class="text-darken-3 material-icons gray sml" title="公開">public</i>';
			var can_rt = "";
		} else if (visen == "unlisted") {
			var vis =
				'<i class="text-darken-3 material-icons blue-text" title="未収載">lock_open</i>';
			var can_rt = "";
		} else if (visen == "plivate") {
			var vis =
				'<i class="text-darken-3 material-icons orange-text" title="非公開">lock</i>';
			var can_rt = "hide";
		} else if (visen == "direct") {
			var vis =
				'<i class="text-darken-3 material-icons red-text" title="ダイレクト">mail</i>';
			var can_rt = "hide";
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
		if (toot.pinned) {
			var if_pin = "blue-text";
			var pin_app = "pinned";
		} else {
			var if_pin = "";
			var pin_app = "";
		}
		//アニメ再生
		if (gif == "yes") {
			var avatar = toot.account.avatar;
		} else {
			var avatar = toot.account.avatar_static;
		}
		//ワードミュート
		if(wordmute){
			Object.keys(wordmute).forEach(function(key8) {
				var worde = wordmute[key8];
				if(worde){
					var word=worde.tag;
					var regExp = new RegExp( word, "g" ) ;
					if(content.match(regExp)){
						boostback = "hide";
					}
				}
			});
		}
		//ワード強調
		if(wordemp){
			Object.keys(wordemp).forEach(function(key9) {
				var word = wordemp[key9];
				if(word){
					var word=word.tag;
					var regExp = new RegExp( word, "g" ) ;
					content=content.replace(regExp,'<span class="emp">'+word+"</span>");
				}
			});
		}
		templete = templete + '<div id="pub_' + toot.id + '" class="cvo ' +
			boostback + ' ' + fav_app + ' ' + rt_app + ' ' + pin_app +
			' ' + hasmedia + '" toot-id="' + id + '" unixtime="' + date(obj[
				key].created_at, 'unix') + '">' +
			'<div class="area-notice"><span class="gray sharesta">' + notice + home +
			'</span></div>' +
			'<div class="area-icon"><a onclick="udg(\'' + toot.account.id +
			'\',' + acct_id + ');" user="' + toot.account.acct + '" class="udg">' +
			'<img src="' + avatar +
			'" width="40" class="prof-img" user="' + toot.account.acct +
			'"></a></div>' +
			'<div class="area-display_name"><span class="user">' +
			escapeHTML(toot.account.display_name) +
			'</span><span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis; cursor:text;"> @' +
			toot.account.acct + locked + '</span></div>' +
			'<div class="area-acct"><div><span class="cbadge pointer waves-effect" onclick="tootUriCopy(\'' +
			toot.url + '\');" title="' + date(toot.created_at, 'absolute') +
			'(クリックでトゥートURLをコピー)"><i class="fa fa-clock-o"></i>' +
			date(toot.created_at, datetype) + '</span></div></div>' +
			'<div class="area-toot"><span class="toot ' + spoiler + '">' + content +
			'</span><span class="' +
			api_spoil + ' cw_text_' + toot.id + '">' + spoil + spoiler_show +
			'</span>' +
			'' + viewer + '' +
			'</div><div class="area-additional"><span class="additional">' + analyze +
			'</span>' +
			'' + mentions + tags + '</div>' +
			'<div class="area-actions" style="padding:0; margin:0; top:-20px; display:flex; justify-content:space-around; max-width:100%; ">' +
			'<div class="action"><span style="padding:0">' +
			vis + '</span></div><div class="action"><a onclick="re(\'' + toot.id +
			'\',\'' + toot.account.acct + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="このトゥートに返信"><i class="fa fa-share"></i></a></div>' +
			'<div class="action '+can_rt+'"><a onclick="rt(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid +
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="このトゥートをブースト"><i class="text-darken-3 fa fa-retweet ' +
			if_rt + ' rt_' + toot.id + '"></i><span class="rt_ct">' + toot.reblogs_count +
			'</span></a></div>' +
			'<div class="action"><a onclick="fav(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid +
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="このトゥートをお気に入り登録"><i class="fa text-darken-3 fa-star' +
			if_fav + ' fav_' + toot.id + '"></i><span class="fav_ct">' + toot.favourites_count +
			'</a></span></div>' +
			'<div class="' + if_mine + ' action"><a onclick="del(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="このトゥートを削除"><i class="fa fa-trash-o"></i></a></div>' +
			'<div class="' + if_mine + ' action pin"><a onclick="pin(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="このトゥートをピン留め"><i class="fa fa-map-pin pin_' + toot.id + ' '+if_pin+'"></i></a></div>' +
			'<div class="action"><a onclick="details(\'' + toot.id + '\',' + acct_id +
			','+tlid+')" class="waves-effect waves-dark btn-flat details" style="padding:0"><i class="text-darken-3 material-icons">more_vert</i></a></div>' +
			'</div><div class="area-date_via">' +
			'<div><span class="cbadge waves-effect" onclick="client(\''+$.strip_tags(via)+'\')" title="via ' + $.strip_tags(via) + '">via ' +
			via +
			'</span></div></div></div>' +
			'</div>' + divider;
	});
	if (mix == "mix") {
		return [templete, local, times]
	} else {
		return templete;
	}
}

//オブジェクトパーサー(ユーザーデータ)
function userparse(obj, auth, acct_id, tlid, popup) {
	var templete = '';
	var datetype = localStorage.getItem("datetype");
	Object.keys(obj).forEach(function(key) {
		var toot = obj[key];
		if (toot.locked) {
			var locked = ' <i class="fa fa-lock red-text"></i>';
		} else {
			var locked = "";
		}
		if (auth) {
			var auth = '<i class="material-icons gray pointer" onclick="request(\'' +
				toot.id + '\',\'authorize\',' + acct_id + ')">person_add</i>';
		} else {
			var auth = "";
		}
		if(notf){
			var notftext='<span class="cbadge"title="' + date(toot.created_at,
				'absolute') + '(通知された時間)"><i class="fa fa-clock-o"></i>' + date(toot.created_at,
				datetype) +
			'</span>フォローされました。<br>';
		}else{
			var notftext="";
		}
		var memory = localStorage.getItem("notice-mem");
			if (popup >= 0 && obj.length < 5 && noticetext != memory) {
				Materialize.toast(toot.display_name+"にフォローされました", popup * 1000);
				$(".notf-icon_" + tlid).addClass("red-text");
				localStorage.setItem("notice-mem", noticetext);
				noticetext = "";
			}
		templete = templete +
			'<div class="" style="padding-top:5px;" user-id="' + toot.id + '">' +
			notftext +
			'<div style="padding:0; margin:0; width:400px; max-width:100%; display:flex; align-items:flex-end;">' +
			'<div style="flex-basis:40px;"><a onclick="udg(\'' + toot.id + '\',' +
			acct_id + ');" user="' + toot.acct + '" class="udg">' +
			'<img src="' + toot.avatar + '" width="40" class="prof-img" user="' + toot
			.acct + '"></a></div>' +
			'<div style="flex-grow:3; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;user-select:auto; cursor:text;"><big>' +
			toot.display_name + '</big></div>' +
			'<div class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;user-select:auto; cursor:text;"> @' +
			toot.acct + locked + '</div>' +
			'</div>' + auth +
			'<div style="justify-content:space-around"> <div class="cbadge" style="width:100px;">Follows:' +
			toot.following_count +
			'</div><div class="cbadge" style="width:100px;">Followers:' + toot.followers_count +
			'</div>' +
			'<div class="divider"></div>' +
			'</div>' +
			'</div>';

	});
	return templete;
}
//クライアントダイアログ
function client(name) {
	if(name!="Unknown"){
	//聞く
	localStorage.removeItem("client_mute");
	var electron = require("electron");
	var remote=electron.remote;
	var dialog=remote.dialog;
	const options = {
		type: 'info',
		title: 'クライアント処理',
		message: name+"に対する処理を選択してください。",
		buttons: ['何もしない','強調表示/解除', 'ミュート']
	  }
	  dialog.showMessageBox(options, function(arg) {
		if(arg==1){
			var cli = localStorage.getItem("client_emp");
			var obj = JSON.parse(cli);
			if(!obj){
				var obj=[];
				obj.push(name);
				Materialize.toast(name+"を強調表示します。", 2000);
			}else{
			var can;
			Object.keys(obj).forEach(function(key) {
				var cliT = obj[key];
				if(cliT!=name && !can){
					can=false;
				}else{
					can=true;
					obj.splice(key, 1);
					Materialize.toast(name+"の強調表示を解除しました。", 2000);
				}
			});
			if(!can){
				obj.push(name);
				Materialize.toast(name+"を強調表示します。", 2000);
			}else{
				
			}
		}
			var json = JSON.stringify(obj);
			localStorage.setItem("client_emp", json);
		}else if(arg==2){
			var cli = localStorage.getItem("client_mute");
			var obj = JSON.parse(cli);
			if(!obj){
				var obj=[];
			}
			obj.push(name);
			var json = JSON.stringify(obj);
			localStorage.setItem("client_mute", json);
			Materialize.toast(name+"をミュートします。設定から削除できます。", 2000);
		}else{
			return;
		}
		parseColumn();
	  })
	
}
}