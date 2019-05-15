//オブジェクトパーサー(トゥート)
function parse(obj, mix, acct_id, tlid, popup, mutefilter, type) {
	var templete = '';
	if(obj[0]){
		if(tlid===1){
			console.log("testalive:"+"lastunix_"+ tlid+":"+date(obj[0].created_at, 'unix'))
		}
		localStorage.setItem("lastunix_"+ tlid,date(obj[0].created_at, 'unix'));
	}
	
	var actb='re,rt,fav,qt,del,pin,red';
	if(actb){
		var actb = actb.split(',');
		var disp={};
		for(var k=0;k<actb.length;k++){
			if(k<4){
				var tp="type-a";
			}else{
				var tp="type-b";
			}
			disp[actb[k]]=tp;
		}
	}
	var qt = localStorage.getItem("quote");
	if(qt=="nothing" || !qt){
		var qtClass="hide";
	}else{
		var qtClass="";
	}
	var datetype = localStorage.getItem("datetype");
	var nsfwtype = localStorage.getItem("nsfw");
	var sent = localStorage.getItem("sentence");
	var ltr = localStorage.getItem("letters");
	var gif = localStorage.getItem("gif");
	var imh = localStorage.getItem("img-height");
	if(!imh){
		imh=200;
	}
	if(imh=="full"){
		imh="auto";
	}else{
		imh=imh+"px";
	}
	//独自ロケール
	var locale = localStorage.getItem("locale");
	if(locale=="yes"){
		var locale=false;
	}
	//ネイティブ通知
	var native=localStorage.getItem("nativenotf");
	if(!native){
		native="yes";
	}
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
		wordmute = wordmute.concat(mutefilter);
	}else{
		wordmute = mutefilter;
	}
	//Ticker
	var tickerck = localStorage.getItem("ticker_ok");
	if(tickerck){
		var ticker=true;
	}else{
		var ticker=false;
	}
	//Animation
	var anime = localStorage.getItem("animation");
	if (anime=="yes" || !anime) {
			var animecss="cvo-anime";
	}else{
			var animecss="";
	}
	//Cards
	var card = localStorage.getItem("card_" + tlid);
	
	if (!sent) {
		sent = 500;
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
	//via通知
	var viashow=localStorage.getItem("viashow");
	if(!viashow){
		viashow="via-hide";
	}
	if(viashow=="hide"){
		viashow="via-hide";
	}
	//認証なしTL
	if(mix=="noauth"){
		var noauth="hide";
		var antinoauth="";
	}else{
		var noauth="";
		var antinoauth="hide";
	}
	//DMTL
	if(type=="dm"){
		var dmHide="hide";
		var antidmHide="";
	}else{
		var dmHide="";
		var antidmHide="hide";
	}


	//マウスオーバーのみ
	var mouseover=localStorage.getItem("mouseover");
	if(!mouseover){
		mouseover="";
	}else if(mouseover=="yes" || mouseover=="click"){
		mouseover="hide";
	}else if(mouseover=="no"){
		mouseover="";
	}
	//リプカウント
	var replyct_view=localStorage.getItem("replyct");
	if(!replyct_view){
		replyct_view="hidden";
	}
	var local = [];
	var times=[];
	Object.keys(obj).forEach(function(key) {
		var toot = obj[key];
		if(type=="dm"){
			var dmid=toot.id;
			toot=toot.last_status;
		}
		var dis_name=escapeHTML(toot.account.display_name);
		if(toot.account.emojis){
			var actemojick = toot.account.emojis[0];
		}else{
			var actemojick=false;
		}
		//絵文字があれば
		if (actemojick) {
			Object.keys(toot.account.emojis).forEach(function(key5) {
				var emoji = toot.account.emojis[key5];
				var shortcode = emoji.shortcode;
				var emoji_url = '<img draggable="false" src="' + emoji.url +
					'" class="emoji-img" data-emoji="'+shortcode+'" alt=" :'+shortcode+': ">';
				var regExp = new RegExp(":" + shortcode + ":", "g");
				dis_name = dis_name.replace(regExp, emoji_url);
				
			});
		}
		var noticeavatar="";
		if (mix == "notf") {
			if (gif == "yes") {
				noticeavatar = toot.account.avatar;
			} else {
				noticeavatar = toot.account.avatar_static;
			}
			noticeavatar='<a onclick="udg(\'' + toot.account.id +
			'\',' + acct_id + ');" user="' + toot.account.acct + '" class="udg">' +
			'<img draggable="false" src="' + noticeavatar +
			'" width="20" class="notf-icon prof-img" user="' + toot.account.acct +
			'"></a>';
			if (toot.type == "mention") {
				var what = lang.lang_parse_mentioned;
				var icon = "fa-share teal-text";
				noticeavatar="";
			} else if (toot.type == "reblog") {
				var what = lang.lang_parse_bted;
				var icon = "fa-retweet light-blue-text";
				if(!locale && localStorage.getItem("bt_" + acct_id)){
					what = localStorage.getItem("bt_" + acct_id);
				}
			} else if (toot.type == "favourite") {
				var what = lang.lang_parse_faved;
				var icon = "fa-star  yellow-text";
				if(!locale && localStorage.getItem("fav_" + acct_id)){
					what = localStorage.getItem("fav_" + acct_id);
				}
			} else if (toot.type == "poll") {
				var what = lang.lang_parse_polled;
				var icon = "fa-tasks  purple-text";
			}
			var noticetext = '<span class="cbadge cbadge-hover"title="' + date(toot.created_at,
				'absolute') + '('+lang.lang_parse_notftime+')"><i class="far fa-clock"></i>' + date(toot.created_at,
				datetype) +
			'</span><i class="big-text fas '+icon+'"></i><a onclick="udg(\'' + toot.account.id +
				'\',\'' + acct_id + '\')" class="pointer grey-text">' + dis_name +
				"(@" + toot.account.acct +
				")</a>";
			var notice = noticetext;
			var memory = localStorage.getItem("notice-mem");
			if (popup >= 0 && obj.length < 5 && noticetext != memory) {
				if(localStorage.getItem("hasNotfC_" + acct_id)!="true"){
					if (toot.type == "mention") {
						var replyct=localStorage.getItem("notf-reply_" + acct_id)
						$(".notf-reply_" + acct_id).text(replyct*1-(-1));
						localStorage.setItem("notf-reply_" + acct_id,replyct*1-(-1))
						$(".notf-reply_" + acct_id).removeClass("hide")
						var sound=localStorage.getItem("replySound");
						if(sound=="default"){
							var file="../../source/notif3.wav"
						}
					}else if (toot.type == "reblog") {
						var btct=localStorage.getItem("notf-bt_" + acct_id)
						$(".notf-bt_" + acct_id).text(btct*1-(-1));
						localStorage.setItem("notf-bt_" + acct_id,btct*1-(-1))
						$(".notf-bt_" + acct_id).removeClass("hide")
						var sound=localStorage.getItem("btSound");
						if(sound=="default"){
							var file="../../source/notif2.wav"
						}
					}else if (toot.type == "favourite") {
						var favct=localStorage.getItem("notf-fav_" + acct_id)
						$(".notf-fav_" + acct_id).text(favct*1-(-1));
						localStorage.setItem("notf-fav_" + acct_id,favct*1-(-1))
						$(".notf-fav_" + acct_id).removeClass("hide")
						var sound=localStorage.getItem("favSound");
						if(sound=="default"){
							var file="../../source/notif.wav"
						}
					}
				}
				
				var domain = localStorage.getItem("domain_" + acct_id);
				if(popup>0){
					Materialize.toast("["+domain+"]"+escapeHTML(toot.account.display_name)+what, popup * 1000);
				}
				//通知音
				if(sound=="c1"){
					var file=localStorage.getItem("custom1");
				}else if(sound=="c2"){
					var file=localStorage.getItem("custom2");
				}else if(sound=="c3"){
					var file=localStorage.getItem("custom3");
				}else if(sound=="c4"){
					var file=localStorage.getItem("custom4");
				}
				if(file){
					request = new XMLHttpRequest();
      				request.open("GET", file, true);
      				request.responseType = "arraybuffer";
      				request.onload = playSound;
      				request.send();
				}
				if(native=="yes"){
					var electron = require("electron");
					var ipc = electron.ipcRenderer;
					var os = electron.remote.process.platform;
					var options = {
						body: toot.account.display_name+"(" + toot.account.acct +")"+what+"\n\n"+$.strip_tags(toot.status.content),
						icon: toot.account.avatar
					  };
					if(os=="darwin"){
						var n = new Notification('TheDesk:'+domain, options);
					}else{
						ipc.send('native-notf', [
							'TheDesk:'+domain,
							toot.account.display_name+"(" + toot.account.acct +")"+what+"\n\n"+$.strip_tags(toot.status.content),
							toot.account.avatar,
							"toot",
							acct_id,
							toot.status.id
						]);
					}
				}
				if(localStorage.getItem("hasNotfC_" + acct_id)!="true"){
					$(".notf-icon_" + acct_id).addClass("red-text");
				}
				localStorage.setItem("notice-mem", noticetext);
				noticetext = "";
			}
			var if_notf='data-notfIndv="'+acct_id+"_"+toot.id+'"';
			var toot = toot.status;
			var dis_name=escapeHTML(toot.account.display_name);
			if(toot.account.emojis){
				var actemojick = toot.account.emojis[0];
			}else{
				var actemojick=false;
			}
		//絵文字があれば
		if (actemojick) {
			Object.keys(toot.account.emojis).forEach(function(key5) {
				var emoji = toot.account.emojis[key5];
				var shortcode = emoji.shortcode;
				var emoji_url = '<img src="' + emoji.url +
					'" class="emoji-img" data-emoji="'+shortcode+'" alt=" :'+shortcode+': ">';
				var regExp = new RegExp(":" + shortcode + ":", "g");
				dis_name = dis_name.replace(regExp, emoji_url);
			});
		}
		}else{
			var if_notf="";
			if (toot.reblog) {
				if (gif == "yes") {
					noticeavatar = toot.account.avatar;
				} else {
					noticeavatar = toot.account.avatar_static;
				}
				noticeavatar='<a onclick="udg(\'' + toot.account.id +
				'\',' + acct_id + ');" user="' + toot.account.acct + '" class="udg">' +
				'<img draggable="false" src="' + noticeavatar +
				'" width="20" class="notf-icon prof-img" user="' + toot.account.acct +
				'"></a>';
				var rebtxt = lang.lang_parse_btedsimple;
				var rticon = "fa-retweet light-blue-text";
				if(localStorage.getItem("domain_" + acct_id)=="imastodon.net" && !locale){
					rebtxt = ":「わかるわ」";
				}else if(localStorage.getItem("domain_" + acct_id)=="mstdn.osaka" && !locale){
					rebtxt = "がしばいた";
				}
				var notice = '<i class="big-text fas '+rticon+'"></i>'+ dis_name + "(@" + toot.account.acct +
					")<br>";
					var boostback = "shared";
				var uniqueid=toot.id;
				var toot = toot.reblog;
				var dis_name=escapeHTML(toot.account.display_name);
				if(toot.account.emojis){
					var actemojick = toot.account.emojis[0];
				}else{
					var uniqueid=toot.id;
					var actemojick=false;
				}
			//絵文字があれば
			if (actemojick) {
				Object.keys(toot.account.emojis).forEach(function(key5) {
					var emoji = toot.account.emojis[key5];
					var shortcode = emoji.shortcode;
					var emoji_url = '<img draggable="false" src="' + emoji.url +
						'" class="emoji-img" data-emoji="'+shortcode+'" alt=" :'+shortcode+': ">';
					var regExp = new RegExp(":" + shortcode + ":", "g");
					dis_name = dis_name.replace(regExp, emoji_url);
				});
			}
			} else {
				var uniqueid=toot.id;
				var notice = "";
				var boostback = "unshared";
				//ユーザー強調
				if(toot.account.username!=toot.account.acct){
					var fullname=toot.account.acct;
				}else{
					var domain = localStorage.getItem("domain_" + acct_id);
					var fullname=toot.account.acct+"@"+domain;
				}
				if(useremp){
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
		if (mix == "home") {
			var home = ""
			var divider = '<div class="divider"></div>';
		} else {
			var home = "";
			var divider = '<div class="divider"></div>';
		}
		if (toot.account.locked) {
			var locked = ' <i class="fas fa-lock red-text"></i>';
		} else {
			var locked = "";
		}
		if (!toot.application) {
			var via = '';
			viashow="hide";
		} else {
			var via = escapeHTML(toot.application.name);
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
		if(mix=="pinned"){
			boostback = "emphasized";
		}
		if (toot.spoiler_text && cw) {
			var content = toot.content;
			var spoil = escapeHTML(toot.spoiler_text);
			var spoiler = "cw cw_hide_" + toot.id;
			var api_spoil = "gray";
			var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
				'\')" class="nex parsed">'+lang.lang_parse_cwshow+'</a><br>';
		} else {
			var ct1 = toot.content.split('</p>').length + toot.content.split('<br />').length -2;
			var ct2 = toot.content.split('</p>').length + toot.content.split('<br>').length -2;
			if(ct1>ct2){ var ct= ct1; }else{ var ct= ct2;  }
			if ((sent < ct && $.mb_strlen($.strip_tags(toot.content)) > 5) || ($.strip_tags(toot.content).length > ltr && $.mb_strlen($.strip_tags(toot.content)) > 5)) {
				var content = '<span class="gray">'+lang.lang_parse_fulltext+'</span><br>' + toot.content
				var spoil = '<span class="cw-long-' + toot.id + '">' + $.mb_substr($.strip_tags(
						toot.content), 0, 100) +
					'</span><span class="gray">'+lang.lang_parse_autofold+'</span>';
				var spoiler = "cw cw_hide_" + toot.id;
				var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
					'\')" class="nex parsed">'+lang.lang_parse_more+'</a><br>';
			} else {
				var content = toot.content;
				var spoil = escapeHTML(toot.spoiler_text);
				var spoiler = "";
				var spoiler_show = "";
			}
		}
		var urls = $.strip_tags(content).replace(/\n/g, " ").match(
			/https?:\/\/([-a-zA-Z0-9@.]+)\/?(?!.*((media|tags)|mentions)).*([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)?/
		);
		if (urls) {
			var analyze = '<a onclick="additionalIndv(\'' + tlid + '\',' + acct_id +
				',\'' + id + '\')" class="add-show pointer">'+lang.lang_parse_url+'</a><br>';
		} else {
			var analyze = '';
		}
		var viewer = "";
		var hasmedia = "";
		var youtube = "";
		//Poll
		var poll="";
		if(toot.poll){
			var choices=toot.poll.options;
			if(toot.poll.voted){
				var myvote=lang.lang_parse_voted;
				var result_hide="";
			}else{
				var myvote='<a onclick="voteMastodon(\''+acct_id+'\',\''+toot.poll.id+'\')" class="votebtn">'+lang.lang_parse_vote+'</a><br>';
				if(choices[0].votes_count===0 || choices[0].votes_count>0){
					myvote=myvote+'<a onclick="showResult(\''+acct_id+'\',\''+toot.poll.id+'\')" class="pointer">'+lang.lang_parse_unvoted+"</a>";
				}
				var result_hide="hide";
			}
			if(toot.poll.expired){
				var ended=lang.lang_parse_endedvote;
			}else{
				var ended=date(toot.poll.expires_at, datetype);
			}
			Object.keys(choices).forEach(function(keyc) {
				var choice = choices[keyc];
				if(!toot.poll.voted && !toot.poll.expired){
					var votesel='voteSelMastodon(\''+acct_id+'\',\''+toot.poll.id+'\','+keyc+','+toot.poll.multiple+')';
					var voteclass="pointer waves-effect waves-light";
				}else{
					var votesel="";
					var voteclass="";
				}
				poll=poll+'<div class="'+voteclass+' vote vote_'+acct_id+'_'+toot.poll.id+'_'+keyc+'" onclick="'+votesel+'">'+escapeHTML(choice.title)+'<span class="vote_'+acct_id+'_'+toot.poll.id+'_result '+result_hide+'">('+choice.votes_count+')</span></div>';
			});
			poll='<div class="vote_'+acct_id+'_'+toot.poll.id+'">'+poll+myvote+'<span class="cbadge cbadge-hover" title="' + date(toot.poll.expires_at, 'absolute') +
			'"><i class="far fa-calendar-times"></i>' +
			 ended+ '</span></div>';
		}
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
				var emoji_url = '<img draggable="false" src="' + emoji.url +
					'" class="emoji-img" data-emoji="'+shortcode+'" alt=" :'+shortcode+': ">';
				var regExp = new RegExp(":" + shortcode + ":", "g");
				content = content.replace(regExp, emoji_url);
				spoil = spoil.replace(regExp, emoji_url);
				poll = poll.replace(regExp, emoji_url);
			});
		}
		//ニコフレ絵文字
		if(toot.profile_emojis){
			var nicoemojick = toot.profile_emojis[0];
		}else{
			var nicoemojick=false;
		}
		//絵文字があれば(nico)
		if (nicoemojick) {
			Object.keys(toot.profile_emojis).forEach(function(keynico) {
				var emoji = toot.profile_emojis[keynico];
				var shortcode = emoji.shortcode;
				var emoji_url = '<img draggable="false" src="' + emoji.url +
					'" class="emoji-img" data-emoji="'+shortcode+'" alt=" :'+shortcode+': ">';
				var regExp = new RegExp(":" + shortcode + ":", "g");
				content = content.replace(regExp, emoji_url);
				spoil = spoil.replace(regExp, emoji_url);
				poll = poll.replace(regExp, emoji_url);
			});
		}
		//デフォ絵文字
		content=twemoji.parse(content);
		if(dis_name){
			dis_name=twemoji.parse(dis_name);
		}
		if(spoil){
			spoil=twemoji.parse(spoil);
		}
		if(noticetext){
			noticetext=twemoji.parse(noticetext);
		}
		if(notice){
			notice=twemoji.parse(notice);
		}
		if(poll){
			poll=twemoji.parse(poll);
		}
		var mediack = toot.media_attachments[0];
		//メディアがあれば
		var media_ids="";
		if (mediack) {
			hasmedia = "hasmedia";
			var cwdt = 100 / toot.media_attachments.length;
			Object.keys(toot.media_attachments).forEach(function(key2) {
				var media = toot.media_attachments[key2];
				var purl = media.preview_url;
				media_ids=media_ids+media.id+",";
				var url = media.url;
				var nsfwmes=""
				if (toot.sensitive && nsfw) {
					var sense = "sensitive"
					var blur=media.blurhash
					if(blur){
						nsfwmes='<div class="nsfw-media">NSFW media</div>'
						purl=parseBlur(blur)
						var sense=""
					}
				} else {
					var sense = ""
					var blur=null
				}
					viewer = viewer + '<a onclick="imgv(\'' + id + '\',\'' + key2 + '\',\'' +
					acct_id + '\')" id="' + id + '-image-' + key2 + '" data-url="' + url +
					'" data-type="' + media.type + '" class="img-parsed img-link" style="width:calc(' + cwdt + '% - 1px); height:'+imh+';"><img draggable="false" src="' +
					purl + '" class="' + sense +
					' toot-img pointer">'+nsfwmes+'</a>';
				
			});
			media_ids = media_ids.slice(0, -1) ;
		} else {
			viewer = "";
			hasmedia = "nomedia";
		}
		var menck = toot.mentions[0];
		var mentions = "";
		//メンションであれば
		if (menck) {
			mentions = "";
			var to_mention=[];
			Object.keys(toot.mentions).forEach(function(key3) {
				var mention = toot.mentions[key3];
				mentions = mentions + '<a onclick="udg(\'' + mention.id + '\',' +
					acct_id + ')" class="pointer">@' + mention.acct + '</a> ';
					//自分は除外
					//自インスタンスかどうかを確認し、IDの一致
				if(mention.acct==mention.username && mention.id==localStorage.getItem("user-id_" + acct_id)){
					//自分
				}else{
					//そのトゥの人NG
					if(toot.account.acct!=mention.acct){
						to_mention.push(mention.acct);
					}
				}
				
			});
			to_mention.push(toot.account.acct);
			mentions = '<div style="float:right">' + mentions + '</div>';
		}else{
			var to_mention=[toot.account.acct];
		}
		var tagck = toot.tags[0];
		var tags = "";
		//タグであれば
		if (tagck) {
			Object.keys(toot.tags).forEach(function(key4) {
				var tag = toot.tags[key4];
				tags = tags + '<span class="hide" data-tag="' + tag.name + '">#' + tag.name + ':<a onclick="tl(\'tag\',\'' + tag.name + '\',' + acct_id +
					',\'add\')" class="pointer" title="' +lang.lang_parse_tagTL.replace("{{tag}}" ,'#'+tag.name)+ '">TL</a>　<a onclick="brInsert(\'#' + tag.name + '\')" class="pointer" title="' + lang.lang_parse_tagtoot.replace("{{tag}}" ,'#'+tag.name) + '">Toot</a>　'+
					'<a onclick="tagPin(\'' + tag.name + '\')" class="pointer" title="' +lang.lang_parse_tagpin.replace("{{tag}}" ,'#'+tag.name)+ '">Pin</a></span> ';
			});
			tags = '<div style="float:right">' + tags + '</div>';
		}
		//リプ数
		if(toot.replies_count || toot.replies_count===0){
			var replyct=toot.replies_count;
			if(replyct_view=="hidden" && replyct>1){
				replyct="1+";
			}
		}else{
			var replyct="";
		}
		//公開範囲を取得
		var vis = "";
		var visen = toot.visibility;
		if (visen == "public") {
			var vis =
				'<i class="text-darken-3 material-icons gray sml vis-data pointer" title="'+lang.lang_parse_public+'('+lang.lang_parse_clickcopy+')" data-vis="public" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">public</i>';
			var can_rt = "";
		} else if (visen == "unlisted") {
			var vis =
				'<i class="text-darken-3 material-icons blue-text vis-data pointer" title="'+lang.lang_parse_unlisted+'('+lang.lang_parse_clickcopy+')" data-vis="unlisted" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">lock_open</i>';
			var can_rt = "";
		} else if (visen == "private") {
			var vis =
				'<i class="text-darken-3 material-icons orange-text vis-data pointer" title="'+lang.lang_parse_private+'('+lang.lang_parse_clickcopy+')" data-vis="private" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">lock</i>';
			var can_rt = "hide";
		} else if (visen == "direct") {
			var vis =
				'<i class="text-darken-3 material-icons red-text vis-data pointer" title="'+lang.lang_parse_direct+'('+lang.lang_parse_clickcopy+')" data-vis="direct" onclick="staCopy(\''+id+'\')" style="font-size:1rem;">mail</i>';
			var can_rt = "hide";
		}
		if (toot.account.acct == localStorage.getItem("user_" + acct_id)) {
			var if_mine = "";
			var mine_via="type-b";
		} else {
			var if_mine = "hide";
			var mine_via="";
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
					if(worde.tag){
						var word=worde.tag;
					}else{
						var word=worde
					}
					var regExp = new RegExp( word, "g" ) ;
					if($.strip_tags(content).match(regExp)){
						boostback = "hide by_filter";
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
		//日本語じゃない
		if(toot.language!=lang.language && toot.language){
			var trans='<div class="action pin"><a onclick="trans(\''+toot.language+'\',\''+lang.language+'\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_parse_trans+'"><i class="material-icons">g_translate</i></a></div>';
		}else{
			var trans="";
		}
		//Cards
		if (!card && toot.card) {
			var cards=toot.card;
				if (cards.provider_name=="Twitter"){
					if(cards.image){
						var twiImg='<br><img draggable="false" src="'+cards.image+'">';
					}else{
						var twiImg='';
					}
					analyze='<blockquote class="twitter-tweet"><b>'+escapeHTML(cards.author_name)+'</b><br>'+escapeHTML(cards.description)+twiImg+'</blockquote>';
				}
				if (cards.title) {
					analyze="<span class=\"gray\">URL"+lang.lang_cards_check+":<br>Title:" + escapeHTML(cards.title) + "<br>" +
						escapeHTML(cards.description) + "</span>";
				}
				if (cards.html) {
					analyze=cards.html+'<i class="material-icons" onclick="pip('+id+')" title="'+lang.lang_cards_pip+'">picture_in_picture_alt</i>';
				}
			
		}
		//Ticker
		var tickerdom="";
		if(ticker){
			var tickerdata=localStorage.getItem("ticker")
			if(tickerdata){
			var tickerdata=JSON.parse(tickerdata);
			
			var thisdomain=toot.account.acct.split("@");
			if(thisdomain.length>1){
				thisdomain=thisdomain[1];
			}
			for( var i=0; i<tickerdata.length; i++) {
				var value=tickerdata[i];
				if(value.domain==thisdomain){
					var tickerdom='<div style="background:linear-gradient(to left,transparent, '+value.bg+' 96%) !important; color:'+value.text+';width:100%; height:0.9rem; font-size:0.8rem;"><img draggable="false" src="'+value.image+'" style="height:100%;"><span style="position:relative; top:-0.2rem;"> '+escapeHTML(value.name)+'</span></div>';
					break;
				}
		   }
		}
		}
		//Quote
		if(toot.quote){
			poll=poll+'<div class="quote-renote"><div class="renote-icon"><img src="'+toot.quote.account.avatar+'"></div><div class="renote-user">'+escapeHTML(toot.quote.account.display_name)+'</div><div class="renote-text">'+toot.quote.content+'</div></div>'
		}
		templete = templete + '<div id="pub_' + toot.id + '" class="cvo ' +
			boostback + ' ' + fav_app + ' ' + rt_app + ' ' + pin_app +
			' ' + hasmedia + ' '+animecss+'" toot-id="' + id + '" unique-id="' + uniqueid + '" data-medias="'+media_ids+' " unixtime="' + date(obj[
				key].created_at, 'unix') + '" '+if_notf+' onmouseover="mov(\'' + toot.id + '\',\''+tlid+'\',\'mv\')" onclick="mov(\'' + toot.id + '\',\''+tlid+'\',\'cl\')" onmouseout="resetmv(\'mv\')">' +
			'<div class="area-notice"><span class="gray sharesta">' + notice + home +
			'</span></div>' +
			'<div class="area-icon"><a onclick="udg(\'' + toot.account.id +
			'\',' + acct_id + ');" user="' + toot.account.acct + '" class="udg">' +
			'<img draggable="false" src="' + avatar +
			'" width="40" class="prof-img" user="' + toot.account.acct +
			'"></a>'+noticeavatar+'</div>' +
			'<div class="area-display_name"><div class="flex-name"><span class="user">' +
			dis_name +
			'</span><span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis; cursor:text;"> @' +
			toot.account.acct + locked + '</span></div>' +
			'<div class="flex-time"><span class="cbadge cbadge-hover pointer waves-effect" onclick="tootUriCopy(\'' +
			toot.url + '\');" title="' + date(toot.created_at, 'absolute') +
			'('+lang.lang_parse_clickcopyurl+')"><i class="far fa-clock"></i>' +
			date(toot.created_at, datetype) + '</span>' +
			'</div></div>' +
			'<div class="area-toot">'+tickerdom+'<span class="' +
			api_spoil + ' cw_text_' + toot.id + '"><span class="cw_text">' + spoil + "</span>" + spoiler_show +
			'</span><span class="toot ' + spoiler + '">' + content +
			'</span>' + poll +
			'' + viewer + '' +
			'</div><div class="area-additional"><span class="additional">' + analyze +
			'</span>' +
			'' + mentions + tags + '</div>' +
			'<div class="area-vis"></div>'+
			'<div class="area-actions '+mouseover+'">' +
			'<div class="action">'+vis+'</div>'+
			'<div class="action '+antinoauth+'"><a onclick="detEx(\''+toot.url+'\',\'main\')" class="waves-effect waves-dark details" style="padding:0">'+lang.lang_parse_det+'</a></div>' +
			'<div class="action '+antidmHide+'"><a onclick="details(\'' + toot.id + '\',' + acct_id +',\''+tlid+'\',\'normal\')" class="waves-effect waves-dark details" style="padding:0">'+lang.lang_parse_thread+'</a></div>' +
			'<div class="action '+disp["re"]+' '+noauth+'"><a onclick="re(\'' + toot.id +
			'\',\'' + to_mention + '\',' +
			acct_id + ',\''+visen+
			'\')" class="waves-effect waves-dark btn-flat actct" style="padding:0" title="'+lang.lang_parse_replyto+'"><i class="fas fa-share"></i><span class="rep_ct">' + replyct +
			'</a></span></a></div>' +
			'<div class="action '+can_rt+' '+disp["rt"]+' '+noauth+'"><a onclick="rt(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid +
			'\')" class="waves-effect waves-dark btn-flat actct" style="padding:0" title="'+lang.lang_parse_bt+'"><i class="fas fa-retweet ' +
			if_rt + ' rt_' + toot.id + '"></i><span class="rt_ct">' + toot.reblogs_count +
			'</span></a></div>' +
			'<div class="action '+can_rt+' '+disp["qt"]+' '+noauth+' '+qtClass+'"><a onclick="qt(\'' + toot.id + '\',' + acct_id +
			',\'' + toot.account.acct +'\',\''+toot.url+
			'\')" class="waves-effect waves-dark btn-flat actct" style="padding:0" title="'+lang.lang_parse_quote+'"><i class="text-darken-3 fas fa-quote-right"></i></a></div>' +
			'<div class="action '+disp["fav"]+' '+noauth+'"><a onclick="fav(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid +
			'\')" class="waves-effect waves-dark btn-flat actct" style="padding:0" title="'+lang.lang_parse_fav+'"><i class="fas text-darken-3 fa-star' +
			if_fav + ' fav_' + toot.id + '"></i><span class="fav_ct">' + toot.favourites_count +
			'</a></span></div>' +
			'<div class="' + if_mine + ' action '+disp["del"]+' '+noauth+'"><a onclick="del(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_parse_del+'"><i class="fas fa-trash"></i></a></div>' +
			'<div class="' + if_mine + ' action pin '+disp["pin"]+' '+noauth+'"><a onclick="pin(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_parse_pin+'"><i class="fas fa-map-pin pin_' + toot.id + ' '+if_pin+'"></i></a></div>' 
			+'<div class="' + if_mine + ' action '+disp["red"]+' '+noauth+'"><a onclick="redraft(\'' + toot.id + '\',' +
			acct_id +
			')" class="waves-effect waves-dark btn-flat" style="padding:0" title="'+lang.lang_parse_redraft+'"><i class="material-icons">redo</i></a></div>'+trans+
			'<span class="cbadge viabadge waves-effect '+viashow+' '+mine_via+'" onclick="client(\''+$.strip_tags(via)+'\')" title="via ' + $.strip_tags(via) + '">via ' +
			via +
			'</span>'+
			'</div><div class="area-side '+mouseover+'"><div class="action ' + if_mine + ' '+noauth+'"><a onclick="toggleAction(\'' + toot.id + '\',\''+tlid+'\',\''+acct_id+'\')" class="waves-effect waves-dark btn-flat" style="padding:0"><i class="text-darken-3 material-icons act-icon">expand_more</i></a></div>' +
			'<div class="action '+noauth+'"><a onclick="details(\'' + toot.id + '\',' + acct_id +
			',\''+tlid+'\',\'normal\')" class="waves-effect waves-dark btn-flat details '+dmHide+'" style="padding:0"><i class="text-darken-3 material-icons">more_vert</i></a></div>' +
			'</div></div>' +
			'</div></div>';
	});
	if (mix == "mix") {
		return [templete, local, times]
	} else {
		return templete;
	}
}

//オブジェクトパーサー(ユーザーデータ)
function userparse(obj, auth, acct_id, tlid, popup) {
	//独自ロケール
	var locale = localStorage.getItem("locale");
	if(locale=="yes"){
		var locale=false;
	}
	var templete = '';
	var datetype = localStorage.getItem("datetype");
	Object.keys(obj).forEach(function(key) {
		var toot = obj[key];
		console.log(toot)
		if(!toot.username){
			var raw=toot;
			toot=toot.account;
			var notf=true;
		}else{
			var notf=false;
		}
		if (toot.locked) {
			var locked = ' <i class="fas fa-lock red-text"></i>';
		} else {
			var locked = "";
		}
		if (auth=="request") {
			var authhtml = '<i class="material-icons gray pointer" onclick="request(\'' +
				toot.id + '\',\'authorize\',' + acct_id + ')" title="Accept">person_add</i>　<i class="material-icons gray pointer" onclick="request(\'' +
				toot.id + '\',\'reject\',' + acct_id + ')" title="Reject">person_add_disabled</i>';
		} else {
			var authhtml = "";
		}
		var ftxt=lang.lang_parse_followed;
		if(!locale && localStorage.getItem("followlocale_" + acct_id)){
			ftxt = localStorage.getItem("followlocale_" + acct_id);
		}
		if(popup > 0 || popup==-1 || notf){
			var notftext=ftxt+'<br>';
		}else{
			var notftext="";
		}
		var memory = localStorage.getItem("notice-mem");
			if (popup >= 0 && obj.length < 5 && notftext != memory) {
				Materialize.toast(escapeHTML(toot.display_name)+":"+ftxt, popup * 1000);
				$(".notf-icon_" + tlid).addClass("red-text");
				localStorage.setItem("notice-mem", notftext);
				notftext = "";
				var native=localStorage.getItem("nativenotf");
			if(!native){
				native="yes";
			}
			if(native=="yes"){
				var electron = require("electron");
				var ipc = electron.ipcRenderer;
				var os = electron.remote.process.platform;
				var options = {
					body: toot.display_name+"(" + toot.acct +")"+ftxt,
					icon: toot.avatar
				  };
				  var domain = localStorage.getItem("domain_" + acct_id);
				if(os=="darwin"){
					var n = new Notification('TheDesk:'+domain, options);
				}else{
					ipc.send('native-notf', [
						'TheDesk:'+domain,
						toot.display_name+"(" + toot.acct +")"+ftxt,
						toot.avatar,
						"userdata",
						acct_id,
						toot.id
					]);
				}
			}
			}
			if(toot.display_name){
				var dis_name=escapeHTML(toot.display_name);
			}else{
				var dis_name=toot.username;
			}
			//ネイティブ通知
			
		if(toot.emojis){
			var actemojick = toot.emojis[0];
		}else{
			var actemojick=false;
		}
	//絵文字があれば
	if (actemojick) {
		Object.keys(toot.emojis).forEach(function(key5) {
			var emoji = toot.emojis[key5];
			var shortcode = emoji.shortcode;
			var emoji_url = '<img draggable="false" src="' + emoji.url +
				'" class="emoji-img" data-emoji="'+shortcode+'" alt=" :'+shortcode+': ">';
			var regExp = new RegExp(":" + shortcode + ":", "g");
			dis_name = dis_name.replace(regExp, emoji_url);
		});
	}
	if(dis_name){
		dis_name=twemoji.parse(dis_name);
	}
	if(toot.avatar){
		var avatar=toot.avatar;
	}else{
		var avatar="../../img/missing.svg";
	}
	
		templete = templete +
			'<div class="cvo" style="padding-top:5px;" user-id="' + toot.id + '"><div class="area-notice">' +
			notftext +
			'</div><div class="area-icon"><a onclick="udg(\'' + toot.id + '\',' +
			acct_id + ');" user="' + toot.acct + '" class="udg">' +
			'<img draggable="false" src="' + avatar + '" width="40" class="prof-img" user="' + toot
			.acct + '"></a></div>' +
			'<div class="area-display_name"><div class="flex-name"><span class="user">' +
			dis_name + '</span>' +
			'<span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;user-select:auto; cursor:text;"> @' +
			toot.acct + locked  +'</span>' +
			'</div>' +
			'</div>' +
			'<div style="justify-content:space-around" class="area-toot"> <div class="cbadge" style="width:100px;">Follows:' +
			toot.following_count +
			'</div><div class="cbadge" style="width:100px;">Followers:' + toot.followers_count +
			'</div>' + authhtml+
			'</div>' +
			'</div>' +
			'</div>';

	});
	return templete;
}
//クライアントダイアログ
function client(name) {
	if(name!="Unknown"){
	//聞く
	var electron = require("electron");
	var remote=electron.remote;
	var dialog=remote.dialog;
	const options = {
		type: 'info',
		title: lang.lang_parse_clientop,
		message: name+lang.lang_parse_clienttxt,
		buttons: [lang.lang_parse_clientno,lang.lang_parse_clientemp, lang.lang_parse_clientmute]
	  }
	  dialog.showMessageBox(options, function(arg) {
		if(arg===1){
			var cli = localStorage.getItem("client_emp");
			var obj = JSON.parse(cli);
			if(!obj){
				var obj=[];
				obj.push(name);
				Materialize.toast(escapeHTML(name)+lang.lang_status_emphas, 2000);
			}else{
			var can;
			Object.keys(obj).forEach(function(key) {
				var cliT = obj[key];
				if(cliT!=name && !can){
					can=false;
				}else{
					can=true;
					obj.splice(key, 1);
					Materialize.toast(escapeHTML(name)+lang.lang_status_unemphas, 2000);
				}
			});
			if(!can){
				obj.push(name);
				Materialize.toast(escapeHTML(name)+lang.lang_status_emphas, 2000);
			}else{
				
			}
		}
			var json = JSON.stringify(obj);
			localStorage.setItem("client_emp", json);
		}else if(arg===2){
			var cli = localStorage.getItem("client_mute");
			var obj = JSON.parse(cli);
			if(!obj){
				obj=[];
			}
			obj.push(name);
			var json = JSON.stringify(obj);
			localStorage.setItem("client_mute", json);
			Materialize.toast(escapeHTML(name)+lang.lang_parse_mute, 2000);
		}else{
			return;
		}
		parseColumn();
	  })
	
}
}