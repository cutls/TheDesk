//DM(Conv) TL
function dm(acct_id, tlid, type, delc, voice) {

	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/conversations";
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function (response) {
		if (!response.ok) {
			response.text().then(function(text) {
				setLog(response.url, response.status, text);
			});
		}
		return response.json();
	}).catch(function (error) {
		todo(error);
		console.error(error);
	}).then(function (json) {
		var templete = '<div id="convList' + tlid + '">' + dmListParse(json, type, acct_id, tlid, "", mute) + '</div>';
		localStorage.setItem("lastobj_" + tlid, json[0].id)
		$("#timeline_" + tlid).html(templete);
		additional(acct_id, tlid);
		jQuery("time.timeago").timeago();
		todc();
		//reload(type, '', acct_id, tlid, data, mute, delc,voice);
		$(window).scrollTop(0);
	});

}
function dmmore(tlid) {
	var multi = localStorage.getItem("column");
	var obj = JSON.parse(multi);
	var acct_id = obj[tlid].domain;
	var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var sid = $("#timeline_" + tlid + " .cvo").last().attr("unique-id");
	var start = "https://" + domain + "/api/v1/conversations?max_id=" + sid;
	var type = "dm";
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function (response) {
		if (!response.ok) {
			response.text().then(function(text) {
				setLog(response.url, response.status, text);
			});
		}
		return response.json();
	}).catch(function (error) {
		todo(error);
		console.error(error);
	}).then(function (json) {
		var templete = '<div id="convList' + tlid + '">' + dmListParse(json, type, acct_id, tlid, "", mute) + '</div>';
		$("#timeline_" + tlid).append(templete);
		additional(acct_id, tlid);
		jQuery("time.timeago").timeago();
		moreloading = false;
	})
}
//DMオブジェクトパーサー(トゥート)
function dmListParse(obj, mix, acct_id, tlid, popup, mutefilter) {
	var templete = '';
	if (obj[0]) {
		localStorage.setItem("lastunix_" + tlid, date(obj[0].created_at, 'unix'));
	}

	var actb = localStorage.getItem("action_btns");
	var actb = 're,rt,fav,qt,del,pin,red';
	if (actb) {
		var actb = actb.split(',');
		var disp = {};
		for (var k = 0; k < actb.length; k++) {
			if (k < 4) {
				var tp = "type-a";
			} else {
				var tp = "type-b";
			}
			disp[actb[k]] = tp;
		}
	}
	var datetype = localStorage.getItem("datetype");
	var nsfwtype = localStorage.getItem("nsfw");
	var sent = localStorage.getItem("sentence");
	var ltr = localStorage.getItem("letters");
	var gif = localStorage.getItem("gif");
	var imh = localStorage.getItem("img-height");
	//独自ロケール
	var locale = localStorage.getItem("locale");
	if (locale == "yes") {
		var locale = false;
	}
	//ネイティブ通知
	var native = localStorage.getItem("nativenotf");
	if (!native) {
		native = "yes";
	}
	//クライアント強調
	var emp = localStorage.getItem("client_emp");
	if (emp) {
		var emp = JSON.parse(emp);
	}
	//クライアントミュート
	var mute = localStorage.getItem("client_mute");
	if (mute) {
		var mute = JSON.parse(mute);
	}
	//ユーザー強調
	var useremp = localStorage.getItem("user_emp");
	if (useremp) {
		var useremp = JSON.parse(useremp);
	}
	//ワード強調
	var wordemp = localStorage.getItem("word_emp");
	if (wordemp) {
		var wordemp = JSON.parse(wordemp);
	}
	//ワードミュート
	var wordmute = localStorage.getItem("word_mute");
	if (wordmute) {
		var wordmute = JSON.parse(wordmute);
		wordmute = wordmute.concat(mutefilter);
	} else {
		wordmute = mutefilter;
	}
	//Ticker
	var tickerck = localStorage.getItem("ticker_ok");
	if (tickerck) {
		var ticker = true;
	} else {
		var ticker = false;
	}
	//Cards
	var card = localStorage.getItem("card_" + tlid);

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
	if (!emp) {
		var emp = [];
	}
	if (!mute) {
		var mute = [];
	}
	if (!useremp) {
		var useremp = [];
	}
	if (!wordemp) {
		var wordemp = [];
	}
	if (!wordmute) {
		var wordmute = [];
	}
	//via通知
	var viashow = localStorage.getItem("viashow");
	if (!viashow) {
		viashow = "via-hide";
	}
	if (viashow == "hide") {
		viashow = "via-hide";
	}
	//認証なしTL
	if (mix == "noauth") {
		var noauth = "hide";
		var antinoauth = "";
	} else {
		var noauth = "";
		var antinoauth = "hide";
	}
	//マウスオーバーのみ
	var mouseover = localStorage.getItem("mouseover");
	if (!mouseover) {
		mouseover = "";
	} else if (mouseover == "yes" || mouseover == "click") {
		mouseover = "hide";
	} else if (mouseover == "no") {
		mouseover = "";
	}
	var local = [];
	var times = [];
	Object.keys(obj).forEach(function (key) {
		var conv_id = obj[key].id;
		var toot = obj[key].last_status;
		var dis_name = escapeHTML(toot.account.display_name);
		if (toot.account.emojis) {
			var actemojick = toot.account.emojis[0];
		} else {
			var actemojick = false;
		}
		//絵文字があれば
		if (actemojick) {
			Object.keys(toot.account.emojis).forEach(function (key5) {
				var emoji = toot.account.emojis[key5];
				var shortcode = emoji.shortcode;
				var emoji_url = '<img src="' + emoji.url +
					'" class="emoji-img" data-emoji="' + shortcode + '" alt=" :' + shortcode + ': ">';
				var regExp = new RegExp(":" + shortcode + ":", "g");
				dis_name = dis_name.replace(regExp, emoji_url);

			});
		}
		var noticeavatar = "";
		var if_notf = "";
		var uniqueid = toot.id;
		var notice = "";
		var boostback = "";
		//ユーザー強調
		if (toot.account.username != toot.account.acct) {
			var fullname = toot.account.acct;
		} else {
			var domain = localStorage.getItem("domain_" + acct_id);
			var fullname = toot.account.acct + "@" + domain;
		}
		if (useremp) {
			Object.keys(useremp).forEach(function (key10) {
				var user = useremp[key10];
				if (user == fullname) {
					boostback = "emphasized";
				}
			});
		}
		var id = toot.id;
		var home = "";
		if (toot.account.locked) {
			var locked = ' <i class="fas fa-lock red-text"></i>';
		} else {
			var locked = "";
		}
		if (!toot.application) {
			var via = '';
			viashow = "hide";
		} else {
			var via = escapeHTML(toot.application.name);
			//強調チェック
			Object.keys(emp).forEach(function (key6) {
				var cli = emp[key6];
				if (cli == via) {
					boostback = "emphasized";
				}
			});
			//ミュートチェック
			Object.keys(mute).forEach(function (key7) {
				var cli = mute[key7];
				if (cli == via) {
					boostback = "hide";
				}
			});
		}
		if (mix == "pinned") {
			boostback = "emphasized";
		}
		if (toot.spoiler_text && cw) {
			var content = toot.content;
			var spoil = escapeHTML(toot.spoiler_text);
			var spoiler = "cw cw_hide_" + toot.id;
			var api_spoil = "gray";
			var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
				'\')" class="nex parsed">' + lang.lang_parse_cwshow + '</a><br>';
		} else {
			var ct1 = toot.content.split('</p>').length + toot.content.split('<br />').length - 2;
			var ct2 = toot.content.split('</p>').length + toot.content.split('<br>').length - 2;
			if (ct1 > ct2) { var ct = ct1; } else { var ct = ct2; }
			if ((sent < ct && $.mb_strlen($.strip_tags(toot.content)) > 5) || ($.strip_tags(toot.content).length > ltr && $.mb_strlen($.strip_tags(toot.content)) > 5)) {
				var content = '<span class="gray">' + lang.lang_parse_fulltext + '</span><br>' + toot.content
				var spoil = '<span class="cw-long-' + toot.id + '">' + $.mb_substr($.strip_tags(
					toot.content), 0, 100) +
					'</span><span class="gray">' + lang.lang_parse_autofold + '</span>';
				var spoiler = "cw cw_hide_" + toot.id;
				var spoiler_show = '<a href="#" onclick="cw_show(\'' + toot.id +
					'\')" class="nex parsed">' + lang.lang_parse_more + '</a><br>';
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
				',\'' + id + '\')" class="add-show pointer">' + lang.lang_parse_url + '</a><br>';
		} else {
			var analyze = '';
		}
		var viewer = "";
		var hasmedia = "";
		var youtube = "";
		if (toot.emojis) {
			var emojick = toot.emojis[0];
		} else {
			var emojick = false;
		}
		//絵文字があれば
		if (emojick) {
			Object.keys(toot.emojis).forEach(function (key5) {
				var emoji = toot.emojis[key5];
				var shortcode = emoji.shortcode;
				var emoji_url = '<img src="' + emoji.url +
					'" class="emoji-img" data-emoji="' + shortcode + '" alt=" :' + shortcode + ': ">';
				var regExp = new RegExp(":" + shortcode + ":", "g");
				content = content.replace(regExp, emoji_url);
				spoil = spoil.replace(regExp, emoji_url);
			});
		}
		//ニコフレ絵文字
		if (toot.profile_emojis) {
			var nicoemojick = toot.profile_emojis[0];
		} else {
			var nicoemojick = false;
		}
		//絵文字があれば
		if (nicoemojick) {
			Object.keys(toot.profile_emojis).forEach(function (keynico) {
				var emoji = toot.profile_emojis[keynico];
				var shortcode = emoji.shortcode;
				var emoji_url = '<img src="' + emoji.url +
					'" class="emoji-img" data-emoji="' + shortcode + '" alt=" :' + shortcode + ': ">';
				var regExp = new RegExp(":" + shortcode + ":", "g");
				content = content.replace(regExp, emoji_url);
				spoil = spoil.replace(regExp, emoji_url);
			});
		}
		//デフォ絵文字
		content = twemoji.parse(content);
		if (dis_name) {
			dis_name = twemoji.parse(dis_name);
		}
		if (spoil) {
			spoil = twemoji.parse(spoil);
		}
		var mediack = toot.media_attachments[0];
		//メディアがあれば
		var media_ids = "";
		if (mediack) {
			hasmedia = "hasmedia";
			var cwdt = 100 / toot.media_attachments.length;
			Object.keys(toot.media_attachments).forEach(function (key2) {
				var media = toot.media_attachments[key2];
				var purl = media.preview_url;
				media_ids = media_ids + media.id + ",";
				var url = media.url;
				if (toot.sensitive && nsfw) {
					var sense = "sensitive"
				} else {
					var sense = ""
				}
				viewer = viewer + '<a onclick="imgv(\'' + id + '\',\'' + key2 + '\',\'' +
					acct_id + '\')" id="' + id + '-image-' + key2 + '" data-url="' + url +
					'" data-type="' + media.type + '" class="img-parsed"><img src="' +
					purl + '" class="' + sense +
					' toot-img pointer" style="width:' + cwdt + '%; height:' + imh + 'px;"></a></span>';
			});
			media_ids = media_ids.slice(0, -1);
		} else {
			viewer = "";
			hasmedia = "nomedia";
		}
		var menck = toot.mentions[0];
		var mentions = "";
		//メンションであれば
		if (menck) {
			mentions = "";
			Object.keys(toot.mentions).forEach(function (key3) {
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
			Object.keys(toot.tags).forEach(function (key4) {
				var tag = toot.tags[key4];
				tags = tags + '<span class="hide" data-tag="' + tag.name + '">#' + tag.name + ':<a onclick="tl(\'tag\',\'' + tag.name + '\',' + acct_id +
					',\'add\')" class="pointer" title="' + lang.lang_parse_tagTL.replace("{{tag}}", '#' + tag.name) + '">TL</a>　<a onclick="brInsert(\'#' + tag.name + '\')" class="pointer" title="' + lang.lang_parse_tagtoot.replace("{{tag}}", '#' + tag.name) + '">Toot</a>　' +
					'<a onclick="tagPin(\'' + tag.name + '\')" class="pointer" title="' + lang.lang_parse_tagpin.replace("{{tag}}", '#' + tag.name) + '">Pin</a></span> ';
			});
			tags = '<div style="float:right">' + tags + '</div>';
		}
		//アニメ再生
		if (gif == "yes") {
			var avatar = toot.account.avatar;
		} else {
			var avatar = toot.account.avatar_static;
		}
		//ワードミュート
		if (wordmute) {
			Object.keys(wordmute).forEach(function (key8) {
				var worde = wordmute[key8];
				if (worde) {
					if (worde.tag) {
						var word = worde.tag;
					} else {
						var word = worde
					}
					var regExp = new RegExp(word, "g");
					if ($.strip_tags(content).match(regExp)) {
						boostback = "hide by_filter";
					}
				}
			});
		}
		//ワード強調
		if (wordemp) {
			Object.keys(wordemp).forEach(function (key9) {
				var word = wordemp[key9];
				if (word) {
					var word = word.tag;
					var regExp = new RegExp(word, "g");
					content = content.replace(regExp, '<span class="emp">' + escapeHTML(word) + "</span>");
				}
			});
		}
		//日本語じゃない
		if (toot.language != "ja") {
			var trans = '<div class="action pin"><a onclick="trans(\'' + toot.language + '\')" class="waves-effect waves-dark btn-flat" style="padding:0" title="' + lang.lang_parse_trans + '"><i class="material-icons">g_translate</i></a></div>';
		} else {
			var trans = "";
		}
		if (toot.favourited) {
			var if_fav = " yellow-text";
			var fav_app = "faved";
		} else {
			var if_fav = "";
			var fav_app = "";
		}
		//Cards
		if (!card && toot.card) {
			var cards = toot.card;
			if (cards.provider_name == "Twitter") {
				if (cards.image) {
					var twiImg = '<br><img src="' + cards.image + '">';
				} else {
					var twiImg = '';
				}
				analyze = '<blockquote class="twitter-tweet"><b>' + escapeHTML(cards.author_name) + '</b><br>' + escapeHTML(cards.description) + twiImg + '</blockquote>';
			}
			if (cards.title) {
				analyze = "<span class=\"gray\">URL" + lang.lang_cards_check + ":<br>Title:" + escapeHTML(cards.title) + "<br>" +
					escapeHTML(cards.description) + "</span>";
			}
			if (cards.html) {
				analyze = cards.html + '<i class="material-icons" onclick="pip(' + id + ')" title="' + lang.lang_cards_pip + '">picture_in_picture_alt</i>';
			}

		}
		//Ticker
		var tickerdom = "";
		if (ticker) {
			var tickerdata = localStorage.getItem("ticker")
			if (tickerdata) {
				var tickerdata = JSON.parse(tickerdata);

				var thisdomain = toot.account.acct.split("@");
				if (thisdomain.length > 1) {
					thisdomain = thisdomain[1];
				}
				for (var i = 0; i < tickerdata.length; i++) {
					var value = tickerdata[i];
					if (value.domain == thisdomain) {
						var tickerdom = '<div style="background:linear-gradient(to left,transparent, ' + value.bg + ' 96%) !important; color:' + value.text + ';width:100%; height:0.9rem; font-size:0.8rem;"><img src="' + value.image + '" style="height:100%;"><span style="position:relative; top:-0.2rem;"> ' + escapeHTML(value.name) + '</span></div>';
						break;
					}
				}
			}
		}
		templete = templete + '<div id="pub_' + toot.id + '" class="cvo ' +
			boostback + ' ' + fav_app +
			' ' + hasmedia + '" toot-id="' + id + '" unique-id="' + uniqueid + '" data-medias="' + media_ids + ' " unixtime="' + date(obj[
				key].created_at, 'unix') + '" ' + if_notf + ' onclick="dmStatus()">' +
			'<div class="area-notice"><span class="gray sharesta">' + notice + home +
			'</span></div>' +
			'<div class="area-icon"><a onclick="udg(\'' + toot.account.id +
			'\',' + acct_id + ');" user="' + toot.account.acct + '" class="udg">' +
			'<img src="' + avatar +
			'" width="40" class="prof-img" user="' + toot.account.acct +
			'"></a>' + noticeavatar + '</div>' +
			'<div class="area-display_name"><div class="flex-name"><span class="user">' +
			dis_name +
			'</span><span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis; cursor:text;"> @' +
			toot.account.acct + locked + '</span></div>' +
			'<div class="flex-time"><span class="cbadge cbadge-hover pointer waves-effect" onclick="tootUriCopy(\'' +
			toot.url + '\');" title="' + date(toot.created_at, 'absolute') +
			'(' + lang.lang_parse_clickcopyurl + ')"><i class="far fa-clock-o"></i>' +
			date(toot.created_at, datetype) + '</span>' +
			'</div></div>' +
			'<div class="area-toot">' + tickerdom + '<span class="' +
			api_spoil + ' cw_text_' + toot.id + '"><span class="cw_text">' + spoil + "</span>" + spoiler_show +
			'</span><span class="toot ' + spoiler + '">' + content +
			'</span>' +
			'' + viewer + '' +
			'<br><a onclick="details(\'' + toot.id + '\',' + acct_id +
			',\'' + tlid + '\',\'dm\')" class="pointer waves-effect">' + lang.lang_parse_thread + '</a></div>' +
			'<div class="area-vis"></div>' +
			'</div></div>';
	});
	return templete;
}
