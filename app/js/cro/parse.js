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
			if (toot.reblog) {
				var notice = toot.account.display_name + "(" + toot.account.acct +
					")がブースト<br>";
					var boostback = "shared";
				var toot = toot.reblog;
			}else{
				var notice="";
			}
		var id = toot.id;
			var divider = '<div class="divider"></div>';
		if (toot.account.locked) {
			var locked = ' <i class="fa fa-lock red-text"></i>';
		} else {
			var locked = "";
		}
		if (!toot.application) {
			var via = 'Unknown';
		} else {
			var via = toot.application.name;
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
			var spoil = escapeHTML(toot.spoiler_text);
			var spoiler = "cw cw_hide_" + toot.id;
			var api_spoil = "gray";
			var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
				'\')" class="nex parsed">見る</a><br>';
		} else {
			var ct1 = toot.content.split('</p>').length + toot.content.split('<br />').length -2;
			var ct2 = toot.content.split('</p>').length + toot.content.split('<br>').length -2;
			if(ct1>ct2){ var ct= ct1; }else{ var ct= ct2;  }
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
				var spoil = escapeHTML(toot.spoiler_text);
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
		if(toot.emojis){
			var emojick = toot.emojis[0];
		}else{
			var emojick=false;
		}
		//絵文字があれば
		if (emojick) {
			Object.keys(toot.emojis).forEach(function(key5) {
				var emoji = toot.emojis[key5];
				var shortcode = emoji.shortcode;
				var emoji_url = '<img src="' + emoji.url +
					'" class="emoji-img">';
				var regExp = new RegExp(":" + shortcode + ":", "g");
				content = content.replace(regExp, emoji_url);
				spoil = spoil.replace(regExp, emoji_url);
			});
		}
		//デフォ絵文字
		var defemo=content.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g);
		
		if(defemo && defemo[0]){
			defemo = defemo.filter(function (x, i, self) {
				return self.indexOf(x) === i;
			});
			Object.keys(defemo).forEach(function(key12) {
				var demo=defemo[key12];
				var regExp = new RegExp(demo, "g");
				for(var i=0;i<map.length;i++){
					var imap=map[i];
					//console.log(regExp);
					if (imap.emoji.match(regExp)) {
						for(var l=0;l<defaultemojiList.length;l++){
							var catlist=defaultemoji[defaultemojiList[l]];
							for(var m=0;m<catlist.length;m++){
								var imoji=catlist[m];
								if(imoji.shortcode==imap.name){
									content=content.replace(regExp,'<span style="width: 20px; height: 20px; display: inline-block; background-image: url(\'./img/sheet.png\'); background-size: 4900%; background-position: '+imoji["css"]+';"></span>');
									break;
								}
							}
							
						}
						
						break;
					}
				}
				
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
				viewer = viewer + '<img src="' +
					purl + '" class="' + sense +
					' toot-img pointer" style="width:' + cwdt + '%; height:'+imh+'px;">';
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
			'<div class="area-notice"><span class="gray sharesta">' + notice  +
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
			'</div><div class="area-additional"><span style="color:green;"><span class="rt_ct">' + toot.reblogs_count +
			'</span>シェア</span><br><span style="color:orange;"><i class="fa  fa-star"></i><span class="fav_ct">' + toot.favourites_count +
			'</a></span></span><br><a onclick="details(\'' + toot.id + '\',' + acct_id +
			','+tlid+')" class="waves-effect waves-dark btn-flat details" style="padding:0; color:#0275d8; font-size:80%;">詳細</a></div>' +
			'<div class="area-actions" style="padding:0; margin:0; top:-20px; display:flex; justify-content:space-around; max-width:100%; ">' +
			'<div class="action"><span style="padding:0">' +
			vis + '</span></div><div class="action"><a onclick="re(\'' + toot.id +
			'\',\'' + toot.account.acct + '\',' +
			acct_id + ',\''+visen+
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="このトゥートに返信"><i class="fa fa-share"></i></a></div>' +
			'<div class="action '+can_rt+'"><a onclick="rt(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid +
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="このトゥートをブースト"><i class="text-darken-3 fa fa-retweet ' +
			if_rt + ' rt_' + toot.id + '"></i></a></div>' +
			'<div class="action"><a onclick="fav(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid +
			'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="このトゥートをお気に入り登録"><i class="fa text-darken-3 fa-star' +
			if_fav + ' fav_' + toot.id + '"></i></div>' +
			'<div class="' + if_mine + ' action"></div>' +
			'<div class="action"></div>' +
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
		if(popup > 0){
			var notftext='<span class="cbadge"title="' + date(toot.created_at,
				'absolute') + '(通知された時間)"><i class="fa fa-clock-o"></i>' + date(toot.created_at,
				datetype) +
			'</span>フォローされました。<br>';
		}else{
			var notftext="";
		}
		var memory = localStorage.getItem("notice-mem");
			if (popup >= 0 && obj.length < 5 && noticetext != memory) {
				Materialize.toast(escapeHTML(toot.display_name)+"にフォローされました", popup * 1000);
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
			escapeHTML(toot.display_name) + '</big></div>' +
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
function scrollevent(){}
function todo(){}
function todc(){}
function vis(){ $('#myModal').modal('hide') }
function additional(){}
function re(){ alert("設計中") }