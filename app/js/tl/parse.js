//オブジェクトパーサー(トゥート)
function parse(obj, mix, acct_id, tlid, popup, mutefilter, type) {
	var splitter = new GraphemeSplitter()
	var templete = ''
	if (obj[0]) {
		if (tlid === 1) {
		}
		localStorage.setItem('lastunix_' + tlid, date(obj[0].created_at, 'unix'))
	}

	var actb = 're,rt,fav,qt,bkm'
	if (actb) {
		var actb = actb.split(',')
		var disp = {}
		for (var k = 0; k < actb.length; k++) {
			if (k < 5) {
				var tp = 'type-a'
			} else {
				var tp = 'type-b'
			}
			disp[actb[k]] = tp
		}
	}
	var qt = localStorage.getItem('quote')
	if (qt == 'nothing' || !qt) {
		var qtClass = 'hide'
	} else {
		if (qt == 'apiQuote') {
			if (localStorage.getItem('quote_' + acct_id)) {
				var qtClass = ''
			} else {
				var qtClass = 'hide'
			}
		} else {
			var qtClass = ''
		}
	}
	var bkm = localStorage.getItem('bookmark')
	if (bkm == 'no' || !bkm) {
		var bkmClass = 'hide'
	} else {
		var bkmClass = ''
	}
	var datetype = localStorage.getItem('datetype')
	var nsfwtype = localStorage.getItem('nsfw')
	var sent = localStorage.getItem('sentence')
	var ltr = localStorage.getItem('letters')
	var gif = localStorage.getItem('gif')
	var imh = localStorage.getItem('img-height')
	if (!imh) {
		imh = 200
	}
	if (imh == 'full') {
		imh = 'auto'
	} else {
		imh = imh + 'px'
	}
	//独自ロケール
	var locale = localStorage.getItem('locale')
	if (locale == 'yes') {
		var locale = false
	}
	//ネイティブ通知
	var native = localStorage.getItem('nativenotf')
	if (!native) {
		native = 'yes'
	}
	//クライアント強調
	var empCli = localStorage.getItem('client_emp')
	if (empCli) {
		var empCli = JSON.parse(empCli)
	}
	//クライアントミュート
	var muteCli = localStorage.getItem('client_mute')
	if (muteCli) {
		var muteCli = JSON.parse(muteCli)
	}
	//ユーザー強調
	var useremp = localStorage.getItem('user_emp')
	if (useremp) {
		var useremp = JSON.parse(useremp)
	}
	//ワード強調
	var wordempList = localStorage.getItem('word_emp')
	if (wordempList) {
		var wordempList = JSON.parse(wordempList)
	}
	//ワードミュート
	var wordmuteList = localStorage.getItem('word_mute')
	if (wordmuteList) {
		var wordmuteList = JSON.parse(wordmuteList)
		if (wordmuteList) {
			wordmuteList = wordmuteList.concat(mutefilter)
		}
	} else {
		wordmuteList = mutefilter
	}
	//Ticker
	var tickerck = localStorage.getItem('ticker_ok')
	if (tickerck == 'yes') {
		var ticker = true
	} else if (!ticker || ticker == 'no') {
		var ticker = false
	}
	//Animation
	var anime = localStorage.getItem('animation')
	if (anime == 'yes' || !anime) {
		var animecss = 'cvo-anime'
	} else {
		var animecss = ''
	}
	//Cards
	var card = localStorage.getItem('card_' + tlid)

	if (!sent) {
		sent = 500
	}
	if (!ltr) {
		var ltr = 500
	}
	if (!nsfwtype || nsfwtype == 'yes') {
		var nsfw = 'ok'
	} else {
		var nsfw
	}
	var cwtype = localStorage.getItem('cw')
	if (!cwtype || cwtype == 'yes') {
		var cw = 'ok'
	} else {
		var cw
	}
	if (!datetype) {
		datetype = 'absolute'
	}
	if (!gif) {
		var gif = 'yes'
	}
	if (!imh) {
		var imh = '200'
	}
	if (!emp) {
		var emp = []
	}
	if (!mute) {
		var mute = []
	}
	if (!useremp) {
		var useremp = []
	}
	if (!wordemp) {
		var wordemp = []
	}
	if (!wordmute) {
		var wordmute = []
	}
	//via通知
	var viashowVal = localStorage.getItem('viashow')
	if (viashowVal == 'yes') {
		var viashowSet = true
	} else {
		var viashowSet = false
	}
	var viashow = ''
	//認証なしTL
	if (mix == 'noauth') {
		var noauth = 'hide'
		var antinoauth = ''
	} else {
		var noauth = ''
		var antinoauth = 'hide'
	}
	//DMTL
	if (type == 'dm') {
		var dmHide = 'hide'
		var antidmHide = ''
	} else {
		var dmHide = ''
		var antidmHide = 'hide'
	}

	//マウスオーバーのみ
	var mouseover = localStorage.getItem('mouseover')
	if (!mouseover) {
		mouseover = ''
	} else if (mouseover == 'yes' || mouseover == 'click') {
		mouseover = 'hide-actions'
	} else if (mouseover == 'no') {
		mouseover = ''
	}
	//リプカウント
	var replyct_view = localStorage.getItem('replyct')
	if (!replyct_view) {
		replyct_view = 'hidden'
	}
	var local = []
	var times = []
	Object.keys(obj).forEach(function(key) {
		var domain = localStorage.getItem('domain_' + acct_id)
		var toot = obj[key]
		if (type == 'dm') {
			var dmid = toot.id
			toot = toot.last_status
		}
		if (toot.account.display_name) {
			var dis_name = escapeHTML(toot.account.display_name)
		} else {
			var dis_name = toot.account.acct
		}

		if (toot.account.emojis) {
			var actemojick = toot.account.emojis[0]
		} else {
			var actemojick = false
		}
		//絵文字があれば
		if (actemojick) {
			Object.keys(toot.account.emojis).forEach(function(key5) {
				var emoji = toot.account.emojis[key5]
				var shortcode = emoji.shortcode
				var emoji_url = `
					<img draggable="false" src="${emoji.url}" class="emoji-img" data-emoji="${shortcode}" 
						alt=" :${shortcode}: " title="${shortcode}" onclick="this.classList.toggle('bigemoji');">
				`
				var regExp = new RegExp(':' + shortcode + ':', 'g')
				dis_name = dis_name.replace(regExp, emoji_url)
			})
		}
		var noticeavatar = ''
		if (mix == 'notf') {
			if (gif == 'yes') {
				noticeavatar = toot.account.avatar
			} else {
				noticeavatar = toot.account.avatar_static
			}
			noticeavatar = `<a onclick="udg('${toot.account.id}','${acct_id}');" user="${toot.account.acct}" class="udg">
					<img draggable="false" src="${noticeavatar}" width="20" class="notf-icon prof-img" user="${toot.account.acct}">
				</a>`
			if (toot.type == 'mention') {
				var what = lang.lang_parse_mentioned
				var icon = 'fa-share teal-text'
				noticeavatar = ''
			} else if (toot.type == 'reblog') {
				var what = lang.lang_parse_bted
				var icon = 'fa-retweet light-blue-text'
				if (!locale && localStorage.getItem('bt_' + acct_id)) {
					what = localStorage.getItem('bt_' + acct_id)
				}
			} else if (toot.type == 'favourite') {
				var what = lang.lang_parse_faved
				var icon = 'fa-star  yellow-text'
				if (!locale && localStorage.getItem('fav_' + acct_id)) {
					what = localStorage.getItem('fav_' + acct_id)
				}
			} else if (toot.type == 'poll') {
				var what = lang.lang_parse_polled
				var icon = 'fa-tasks  purple-text'
			}
			if (tlid == 'notf') {
				var notfFilHide = 'hide'
			} else {
				var notfFilHide = ''
			}
			var noticetext = `<i class="fas fa-filter pointer big-text ${notfFilHide}" 
					onclick="notfFilter('${toot.account.id}','${tlid}');" title="${lang.lang_parse_notffilter}">
				</i>
				<span class="cbadge cbadge-hover" title="${date(toot.created_at, 'absolute')}(${
				lang.lang_parse_notftime
			})">
					<i class="far fa-clock"></i>
					${date(toot.created_at, datetype)}
				</span>
				<i class="big-text fas ${icon}"></i>
				<a onclick="udg('${toot.account.id}','${acct_id}')" class="pointer grey-text">
					${dis_name}(@${toot.account.acct})
				</a>`
			var notice = noticetext
			var memory = localStorage.getItem('notice-mem')
			if (popup >= 0 && obj.length < 5 && noticetext != memory) {
				if (localStorage.getItem('hasNotfC_' + acct_id) != 'true') {
					if (toot.type == 'mention') {
						var replyct = localStorage.getItem('notf-reply_' + acct_id)
						$('.notf-reply_' + acct_id).text(replyct * 1 - -1)
						localStorage.setItem('notf-reply_' + acct_id, replyct * 1 - -1)
						$('.notf-reply_' + acct_id).removeClass('hide')
						var sound = localStorage.getItem('replySound')
						if (sound == 'default') {
							var file = '../../source/notif3.wav'
						}
					} else if (toot.type == 'reblog') {
						var btct = localStorage.getItem('notf-bt_' + acct_id)
						$('.notf-bt_' + acct_id).text(btct * 1 - -1)
						localStorage.setItem('notf-bt_' + acct_id, btct * 1 - -1)
						$('.notf-bt_' + acct_id).removeClass('hide')
						var sound = localStorage.getItem('btSound')
						if (sound == 'default') {
							var file = '../../source/notif2.wav'
						}
					} else if (toot.type == 'favourite') {
						var favct = localStorage.getItem('notf-fav_' + acct_id)
						$('.notf-fav_' + acct_id).text(favct * 1 - -1)
						localStorage.setItem('notf-fav_' + acct_id, favct * 1 - -1)
						$('.notf-fav_' + acct_id).removeClass('hide')
						var sound = localStorage.getItem('favSound')
						if (sound == 'default') {
							var file = '../../source/notif.wav'
						}
					}
				}
				if (popup > 0) {
					M.toast({
						html: '[' + domain + ']' + escapeHTML(toot.account.display_name) + what,
						displayLength: popup * 1000
					})
				}
				//通知音
				if (sound == 'c1') {
					var file = localStorage.getItem('custom1')
				} else if (sound == 'c2') {
					var file = localStorage.getItem('custom2')
				} else if (sound == 'c3') {
					var file = localStorage.getItem('custom3')
				} else if (sound == 'c4') {
					var file = localStorage.getItem('custom4')
				}
				if (file) {
					request = new XMLHttpRequest()
					request.open('GET', file, true)
					request.responseType = 'arraybuffer'
					request.onload = playSound
					request.send()
				}
				if (native == 'yes') {
					var os = localStorage.getItem('platform')
					var options = {
						body:
							toot.account.display_name +
							'(' +
							toot.account.acct +
							')' +
							what +
							'\n\n' +
							$.strip_tags(toot.status.content),
						icon: toot.account.avatar
					}
					var n = new Notification('TheDesk:' + domain, options)
				}
				if (localStorage.getItem('hasNotfC_' + acct_id) != 'true') {
					$('.notf-icon_' + acct_id).addClass('red-text')
				}
				localStorage.setItem('notice-mem', noticetext)
				noticetext = ''
			}
			var if_notf = 'data-notfIndv="' + acct_id + '_' + toot.id + '" data-notf="' + toot.id + '"'
			var toot = toot.status
			var uniqueid = toot.id
			var dis_name = escapeHTML(toot.account.display_name)
			if (toot.account.emojis) {
				var actemojick = toot.account.emojis[0]
			} else {
				var actemojick = false
			}
			//絵文字があれば
			if (actemojick) {
				Object.keys(toot.account.emojis).forEach(function(key5) {
					var emoji = toot.account.emojis[key5]
					var shortcode = emoji.shortcode
					var emoji_url = `
						<img draggable="false" src="${emoji.url}" class="emoji-img" data-emoji="${shortcode}" 
							alt=" :${shortcode}: " title="${shortcode}" onclick="this.classList.toggle(\'bigemoji\');">`
					var regExp = new RegExp(':' + shortcode + ':', 'g')
					dis_name = dis_name.replace(regExp, emoji_url)
				})
			}
		} else {
			var if_notf = ''
			if (toot.reblog) {
				if (gif == 'yes') {
					noticeavatar = toot.account.avatar
				} else {
					noticeavatar = toot.account.avatar_static
				}
				noticeavatar = `<a onclick="udg('${toot.account.id}','${acct_id}');" user="${toot.account.acct}" class="notf-icon udg">
						<img draggable="false" src="${noticeavatar}" width="20" class="prof-img" 
							user="${toot.account.acct}" onerror="this.src=\'../../img/loading.svg\'">
					</a>`
				var rebtxt = lang.lang_parse_btedsimple
				var rticon = 'fa-retweet light-blue-text'
				if (localStorage.getItem('domain_' + acct_id) == 'imastodon.net' && !locale) {
					rebtxt = ':「わかるわ」'
				} else if (localStorage.getItem('domain_' + acct_id) == 'mstdn.osaka' && !locale) {
					rebtxt = 'がしばいた'
				}
				var notice =
					'<i class="big-text fas ' +
					rticon +
					'"></i>' +
					dis_name +
					'(@' +
					toot.account.acct +
					')<br>'
				var boostback = 'shared'
				var uniqueid = toot.id
				var toot = toot.reblog
				var dis_name = escapeHTML(toot.account.display_name)
				if (!dis_name) {
					dis_name = toot.account.acct
				}
				if (toot.account.emojis) {
					var actemojick = toot.account.emojis[0]
				} else {
					var actemojick = false
				}
				//絵文字があれば
				if (actemojick) {
					Object.keys(toot.account.emojis).forEach(function(key5) {
						var emoji = toot.account.emojis[key5]
						var shortcode = emoji.shortcode
						var emoji_url = `
						<img draggable="false" src="${emoji.url}" class="emoji-img" data-emoji="${shortcode}" 
							alt=" :${shortcode}: " title="${shortcode}" onclick="this.classList.toggle(\'bigemoji\');">`
						var regExp = new RegExp(':' + shortcode + ':', 'g')
						dis_name = dis_name.replace(regExp, emoji_url)
					})
				}
			} else {
				var uniqueid = toot.id
				var notice = ''
				var boostback = 'unshared'
				//ユーザー強調
				if (toot.account.username != toot.account.acct) {
					var fullname = toot.account.acct
				} else {
					var domain = localStorage.getItem('domain_' + acct_id)
					var fullname = toot.account.acct + '@' + domain
				}
				if (useremp) {
					Object.keys(useremp).forEach(function(key10) {
						var user = useremp[key10]
						if (user == fullname) {
							boostback = 'emphasized'
						}
					})
				}
			}
		}
		if (toot.content == '') {
			var content = '　'
		} else {
			var content = toot.content
		}
		if (content) {
			var id = toot.id
			if (mix == 'home') {
				var home = ''
				var divider = '<div class="divider"></div>'
			} else {
				var home = ''
				var divider = '<div class="divider"></div>'
			}
			if (toot.account.locked) {
				var locked = ' <i class="fas fa-lock red-text"></i>'
			} else {
				var locked = ''
			}
			if (!toot.application) {
				var via = ''
				viashow = 'hide'
			} else {
				if (viashowSet) {
					viashow = ''
				} else {
					viashow = 'hide'
				}
				var via = escapeHTML(toot.application.name)
				if (empCli) {
					//強調チェック
					Object.keys(empCli).forEach(function(key6) {
						var empCliList = empCli[key6]
						if (empCliList == via) {
							boostback = 'emphasized'
						}
					})
				}
				if (muteCli) {
					//ミュートチェック
					Object.keys(muteCli).forEach(function(key7) {
						var muteCliList = muteCli[key7]
						if (muteCliList == via) {
							boostback = 'hide'
						}
					})
				}
			}
			if (mix == 'pinned') {
				boostback = 'emphasized'
			}
			if (toot.spoiler_text && cw) {
				var spoil = escapeHTML(toot.spoiler_text)
				var spoiler = 'cw cw_hide_' + toot.id
				var api_spoil = 'gray'
				var spoiler_show = `<a href="#" onclick="cw_show('${toot.id}')" class="nex parsed cw_btn">${lang.lang_parse_cwshow}</a><br>`
			} else {
				if (content) {
					var ct1 = content.split('</p>').length + content.split('<br />').length - 2
					var ct2 = content.split('</p>').length + content.split('<br>').length - 2
				} else {
					var ct1 = 100
					var ct2 = 100
				}
				if (ct1 > ct2) {
					var ct = ct1
				} else {
					var ct = ct2
				}

				if (
					(sent < ct && $.mb_strlen($.strip_tags(content)) > 5) ||
					($.mb_strlen($.strip_tags(content)) > ltr && $.mb_strlen($.strip_tags(content)) > 5)
				) {
					var content = `<span class="gray">${lang.lang_parse_fulltext}</span><br>` + content
					var spoil = `<span class="cw-long-${toot.id}">${$.mb_substr(
						$.strip_tags(content),
						0,
						100
					)}</span>
						<span class="gray">${lang.lang_parse_autofold}</span>`
					var spoiler = 'cw cw_hide_' + toot.id
					var spoiler_show = `<a href="#" onclick="cw_show('${toot.id}')" class="nex parsed cw_btn">
							${lang.lang_parse_more}
						</a><br>`
				} else {
					var spoil = escapeHTML(toot.spoiler_text)
					var spoiler = ''
					var spoiler_show = ''
				}
			}
			var urls = $.strip_tags(content)
				.replace(/\n/g, ' ')
				.match(
					/https?:\/\/([^+_]+)\/?(?!.*((media|tags)|mentions)).*([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)?/
				)
			urlsck = content.match(/(https?):\/\/([^<>]*?)\/([^"]*)/g)
			if (urlsck) {
				for (var urlct = 0; urlct < urlsck.length; urlct++) {
					var urlindv = urlsck[urlct]
					urlCont = urlindv.match(/(https?):\/\/([^a-zA-Z0-9.-]*?)\.(.+?)\/([^"]*)/)
					if (urlCont) {
						urlindv = urlindv.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&')
						var encoded = encodeURI(urlCont[4])
						var punycoded = 'xn--' + punycode.encode(urlCont[2])
						var eUrl = urlCont[1] + '://' + punycoded + '.' + urlCont[3] + '/' + encoded
						var regExp = new RegExp('href="' + urlindv + '"', 'g')
						content = content.replace(regExp, 'href="' + eUrl + '"')
					}
				}
			}

			if (urls) {
				var analyze = `<a onclick="additionalIndv('${tlid}','${acct_id}','${id}')" class="add-show pointer">
						${lang.lang_parse_url}
					</a><br>`
			} else {
				var analyze = ''
			}
			var viewer = ''
			var hasmedia = ''
			var youtube = ''
			//Poll
			var poll = ''
			if (toot.poll) {
				var poll = pollParse(toot.poll, acct_id)
			}

			var mediack = toot.media_attachments[0]
			//メディアがあれば
			var media_ids = ''
			if (mediack) {
				hasmedia = 'hasmedia'
				var cwdt = 100 / toot.media_attachments.length
				Object.keys(toot.media_attachments).forEach(function(key2) {
					var media = toot.media_attachments[key2]
					var purl = media.preview_url
					media_ids = media_ids + media.id + ','
					var url = media.url
					var remote_url = media.remote_url
					var nsfwmes = ''
					if (toot.sensitive && nsfw) {
						var sense = 'sensitive'
						var blur = media.blurhash
						nsfwmes = '<div class="nsfw-media">' + lang.lang_parse_nsfw + '</div>'
						if (blur) {
							purl = parseBlur(blur)
							var sense = ''
						}
					} else {
						var sense = ''
						var blur = null
					}
					if (media.pleroma && media.pleroma.mime_type.indexOf('video') !== -1) {
						viewer =
							viewer +
							`<a onclick="imgv('${id}','${key2}','${acct_id}')" id="${id}'-image-${key2}" 
								data-url="${url}" data-type="video" class="img-parsed">
									<video src="${purl}" class="${sense} toot-img pointer" style="max-width:100%;" loop="true">
							</a></span>`
					} else {
						if (media.type == 'unknown') {
							var mty = media.remote_url.match(/.+(\..+)$/)[1]
							viewer =
								viewer +
								`<a href="${media.remote_url}" title="${media.remote_url}">[${lang.lang_parse_unknown}(${mty})]</a> `
						} else if (media.type == 'audio') {
							viewer =
								viewer +
								'<audio src="' +
								url +
								'" class="pointer" style="width:100%;" controls></span>'
						} else {
							if (media.description) {
								var desc = media.description
							} else {
								var desc = ''
							}
							console.log('https://' + domain + '/storage/no-preview.png')
							if (media.preview_url == 'https://' + domain + '/storage/no-preview.png') {
								purl = url
								nsfwmes = '<div class="nsfw-media">Unavailable preview</div>'
							}
							viewer =
								viewer +
								`<a onclick="imgv('${id}','${key2}','${acct_id}')" 
										id="${id}-image-${key2}" data-url="${url}" data-original="${remote_url}" data-type="${media.type}" 
										class="img-parsed img-link" style="width:calc(${cwdt}% - 1px); height:${imh};">
									<img draggable="false" src="${purl}" class="${sense} toot-img pointer" 
										onerror="this.src=\'../../img/loading.svg\'" title="${desc}">
									${nsfwmes}
								</a>`
						}
					}
				})
				media_ids = media_ids.slice(0, -1)
			} else {
				viewer = ''
				hasmedia = 'nomedia'
			}
			var menck = toot.mentions[0]
			var mentions = ''
			//メンションであれば
			if (menck) {
				mentions = ''
				var to_mention = []
				Object.keys(toot.mentions).forEach(function(key3) {
					var mention = toot.mentions[key3]
					//自分は除外
					//自インスタンスかどうかを確認し、IDの一致
					if (
						mention.acct == mention.username &&
						mention.id == localStorage.getItem('user-id_' + acct_id)
					) {
						//自分
					} else {
						//そのトゥの人NG
						if (toot.account.acct != mention.acct) {
							mentions =
								mentions +
								`<a onclick="udg('${mention.id}',' ${acct_id}')" class="pointer">@${mention.acct}</a> `
							to_mention.push(mention.acct)
						}
					}
				})
				to_mention.push(toot.account.acct)
				mentions = '<div style="float:right">' + mentions + '</div>'
			} else {
				var to_mention = [toot.account.acct]
			}
			//メンションじゃなくてもlang_parse_thread
			if (toot.in_reply_to_id) {
				mentions = `<div style="float:right">
						<a onclick="details('${toot.id}','${acct_id}','${tlid}')" class="pointer waves-effect">
							${lang.lang_parse_thread}
						</a></div>`
			}
			var tagck = toot.tags[0]
			var tags = ''
			//タグであれば
			if (tagck) {
				Object.keys(toot.tags).forEach(function(key4) {
					var tag = toot.tags[key4]
					var featured = `　<a onclick="tagFeature('${tag.name}','${acct_id}')" class="pointer" title="add it to Featured tags">Feature</a>　`
					tags =
						tags +
						`<span class="hide" data-tag="${tag.name}" data-regTag="${tag.name.toLowerCase()}">#${
							tag.name
						}:
							<a onclick="tl('tag','${tag.name}','${acct_id}','add')" class="pointer"
							 title="${lang.lang_parse_tagTL.replace(
									'{{tag}}',
									'#' + tag.name
								)}">TL</a>　<a onclick="brInsert('#${tag.name}')" 
							 class="pointer" title="${lang.lang_parse_tagtoot.replace('{{tag}}', '#' + tag.name)}">Toot</a>　
						<a onclick="tagPin('${tag.name}')" class="pointer" title="${lang.lang_parse_tagpin.replace(
							'{{tag}}',
							'#' + tag.name
						)}
						">Pin</a>${featured}</span> `
				})
				tags = '<div style="float:right">' + tags + '</div>'
			}
			//リプ数
			if (toot.replies_count || toot.replies_count === 0) {
				var replyct = toot.replies_count
				if (replyct_view == 'hidden' && replyct > 1) {
					replyct = '1+'
				}
			} else {
				var replyct = ''
			}
			//公開範囲を取得
			var vis = ''
			var visen = toot.visibility
			if (visen == 'public') {
				var vis = `<i class="text-darken-3 material-icons gray sml vis-data pointer" 
						title="${lang.lang_parse_public}(${lang.lang_parse_clickcopy})" data-vis="public" onclick="staCopy('${id}')">
						public
					</i>`
				var can_rt = ''
			} else if (visen == 'unlisted') {
				var vis = `<i class="text-darken-3 material-icons blue-text sml vis-data pointer" 
						title="${lang.lang_parse_unlisted}(${lang.lang_parse_clickcopy})" data-vis="public" onclick="staCopy('${id}')">
						lock_open
					</i>`
				var can_rt = ''
			} else if (visen == 'private') {
				var vis = `<i class="text-darken-3 material-icons orange-text sml vis-data pointer" 
						title="${lang.lang_parse_private}(${lang.lang_parse_clickcopy})" data-vis="public" onclick="staCopy('${id}')">
						lock
					</i>`

				var can_rt = 'unvisible'
			} else if (visen == 'direct') {
				var vis = `<i class="text-darken-3 material-icons red-text sml vis-data pointer" 
						title="${lang.lang_parse_direct}(${lang.lang_parse_clickcopy})" data-vis="public" onclick="staCopy('${id}')">
						mail
					</i>`
				var can_rt = 'unvisible'
			}
			if (toot.account.acct == localStorage.getItem('user_' + acct_id)) {
				var if_mine = ''
				var mine_via = ''
				var can_rt = ''
			} else {
				var if_mine = 'hide'
				var mine_via = ''
			}
			if (toot.favourited) {
				var if_fav = ' yellow-text'
				var fav_app = 'faved'
			} else {
				var if_fav = ''
				var fav_app = ''
			}
			if (toot.reblogged) {
				var if_rt = 'light-blue-text'
				var rt_app = 'rted'
			} else {
				var if_rt = ''
				var rt_app = ''
			}
			if (toot.pinned) {
				var if_pin = 'blue-text'
				var pin_app = 'pinnedToot'
				var pinStr = lang.lang_parse_unpin
			} else {
				var if_pin = ''
				var pin_app = ''
				var pinStr = lang.lang_parse_pin
			}
			if (toot.bookmarked) {
				var if_bkm = 'red-text'
				var bkm_app = 'bkmed'
				var bkmStr = lang.lang_parse_unbookmark
			} else {
				var if_bkm = ''
				var bkm_app = ''
				var bkmStr = lang.lang_parse_bookmark
			}
			//アニメ再生
			if (gif == 'yes') {
				var avatar = toot.account.avatar
			} else {
				var avatar = toot.account.avatar_static
			}
			//ワードミュート
			if (wordmuteList) {
				Object.keys(wordmuteList).forEach(function(key8) {
					var worde = wordmuteList[key8]
					if (worde) {
						if (worde.tag) {
							var wordList = worde.tag
						} else {
							var wordList = worde
						}
						var regExp = new RegExp(wordList.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&'), 'g')
						if ($.strip_tags(content).match(regExp)) {
							boostback = 'hide by_filter'
						}
					}
				})
			}
			//ワード強調
			if (wordempList) {
				Object.keys(wordempList).forEach(function(key9) {
					var wordList = wordempList[key9]
					if (wordList) {
						var wordList = wordList.tag
						var regExp = new RegExp(wordList.replace(/[.*+?^=!:${}()|[\]\/\\]/g, '\\$&'), 'g')
						content = content.replace(regExp, '<span class="emp">' + wordList + '</span>')
					}
				})
			}
			if (toot.emojis) {
				var emojick = toot.emojis[0]
			} else {
				var emojick = false
			}
			//絵文字があれば
			if (emojick) {
				Object.keys(toot.emojis).forEach(function(key5) {
					var emoji = toot.emojis[key5]
					var shortcode = emoji.shortcode
					var emoji_url = `
						<img draggable="false" src="${emoji.url}" class="emoji-img" data-emoji="${shortcode}" 
							alt=" :${shortcode}: " title="${shortcode}" onclick="this.classList.toggle(\'bigemoji\');">`
					var regExp = new RegExp(':' + shortcode + ':', 'g')
					content = content.replace(regExp, emoji_url)
					spoil = spoil.replace(regExp, emoji_url)
					poll = poll.replace(regExp, emoji_url)
				})
			}
			//ニコフレ絵文字
			if (toot.profile_emojis) {
				var nicoemojick = toot.profile_emojis[0]
			} else {
				var nicoemojick = false
			}
			//絵文字があれば(nico)
			if (nicoemojick) {
				Object.keys(toot.profile_emojis).forEach(function(keynico) {
					var emoji = toot.profile_emojis[keynico]
					var shortcode = emoji.shortcode
					var emoji_url = `<img draggable="false" src="${emoji.url}" class="emoji-img" data-emoji="${shortcode}" alt=" :${shortcode}: "
							 title="${shortcode}" onclick="this.classList.toggle(\'bigemoji\');">`
					var regExp = new RegExp(':' + shortcode + ':', 'g')
					content = content.replace(regExp, emoji_url)
					spoil = spoil.replace(regExp, emoji_url)
					poll = poll.replace(regExp, emoji_url)
				})
			}
			//デフォ絵文字
			content = twemoji.parse(content)
			if (dis_name) {
				dis_name = twemoji.parse(dis_name)
			}
			if (spoil) {
				spoil = twemoji.parse(spoil)
			}
			if (noticetext) {
				noticetext = twemoji.parse(noticetext)
			}
			if (notice) {
				notice = twemoji.parse(notice)
			}
			if (poll) {
				poll = twemoji.parse(poll)
			}
			//日本語じゃない
			if (toot.language != lang.language && toot.language) {
				var trans = `<div class="">
						<a onclick="trans('${toot.language}','${lang.language}', $(this))" 
							class="waves-effect waves-dark btn-flat actct" style="padding:0">
								<i class="material-icons">g_translate</i>${lang.lang_parse_trans}
						</a>
					</div>`
			} else {
				var trans = ''
			}
			//Cards
			if (!card && toot.card) {
				var cards = toot.card
				analyze = cardHtml(cards, acct_id, id)
			}
			//Ticker
			var tickerdom = ''
			if (ticker) {
				var tickerdata = localStorage.getItem('ticker')
				if (tickerdata) {
					var tickerdata = JSON.parse(tickerdata)

					var thisdomain = toot.account.acct.split('@')
					if (thisdomain.length > 1) {
						thisdomain = thisdomain[1]
					}
					for (var i = 0; i < tickerdata.length; i++) {
						var value = tickerdata[i]
						if (value.domain == thisdomain) {
							var tickerdom = `<div style="user-select:none;cursor:default;background:linear-gradient(90deg, ${
								value.bg
							}, transparent 96%) !important; color:${
								value.text
							};width:100%; height:0.9rem; font-size:0.8rem;" class="tickers">
									<img draggable="false" src="${
										value.image
									}" style="height:100%;" onerror="this.src=\'../../img/loading.svg\'">
									<span style="position:relative; top:-0.2rem;">${escapeHTML(value.name)}</span>
								</div>`
							break
						}
					}
				}
			}
			//Quote
			if (toot.quote) {
				var quoteUser = toot.quote.account.display_name
				if (!quoteUser) {
					quoteUser = toot.quote.account.acct
				}
				poll =
					poll +
					`<div class="quote-renote">
						<div class="renote-icon">
							<a onclick="udg('${toot.quote.account.id}','${acct_id}');" user="${
						toot.quote.account.acct
					}" class="udg">
								<img draggable="false" src="${toot.quote.account.avatar}">
							</a>
						</div>
						<div class="renote-user">
							${escapeHTML(quoteUser)}
						</div>
						<div class="renote-text">
							${toot.quote.content}
						</div>
						<div class="renote-details">
							<a onclick="details('${
								toot.quote.id
							}','${acct_id}','${tlid}','normal')" class="waves-effect waves-dark btn-flat details" style="padding:0">
								<i class="text-darken-3 material-icons">more_vert</i>
							</a>
						</div>
					</div>`
			}
			//menuは何個？
			var menuct = 2
			if (viashow != 'hide') {
				menuct++
			}
			if (if_mine != 'hide') {
				menuct = menuct + 3
			}
			if (noauth == 'hide') {
				menuct = 0
			}
			if (trans != '') {
				menuct++
			}
			templete =
				templete +
				`<div
					id="pub_${toot.id}"
					class="cvo ${mouseover} ${boostback} ${fav_app} ${rt_app} ${pin_app} ${bkm_app} ${hasmedia} ${animecss}"
					toot-id="${id}" unique-id="${uniqueid}" data-medias="${media_ids}" unixtime="${date(
					obj[key].created_at,
					'unix'
				)}"
					${if_notf}
					onmouseover="mov('${toot.id}','${tlid}','mv')"
					onclick="mov('${toot.id}','${tlid}','cl')"
					onmouseout="resetmv('mv')"
				>
				<div class="area-notice grid"><span class="gray sharesta">${notice}${home}</span></div>
				<div class="area-icon grid">
					<a onclick="udg('${toot.account.id}','${acct_id}');" user="${toot.account.acct}" class="udg">
						<img draggable="false" src="${avatar}" width="40" class="prof-img"
							user="${toot.account.acct}" onerror="this.src='../../img/loading.svg'"/>
					</a>
					${noticeavatar}
				</div>
				<div class="area-display_name grid">
					<div class="flex-name">
						<span class="user">${dis_name}</span>
						<span class="sml gray" style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis; cursor:text;">
							@${toot.account.acct}${locked}
						</span>
					</div>
					<div class="flex-time">
						<span class="cbadge cbadge-hover pointer waves-effect" onclick="tootUriCopy('${toot.url}');"
							title="${date(toot.created_at, 'absolute')}(${lang.lang_parse_clickcopyurl})">
							<i class="far fa-clock"></i>${date(toot.created_at, datetype)}
						</span>
					</div>
				</div>
				<div class="area-toot grid">
					${tickerdom}
					<span class="${api_spoil} cw_text_${toot.id}">
						<span class="cw_text">${spoil}</span>
						${spoiler_show}
					</span>
					<div class="toot ${spoiler}">${content}</div>
					${poll}${viewer}
				</div>
				<div class="area-additional grid">
					<span class="additional">${analyze}</span>
					${mentions}${tags}
				</div>
				<div class="area-vis grid">${vis}</div>
				<div class="area-actions grid">
					<div class="action ${antinoauth}">
						<a onclick="detEx('${toot.url}','main')" class="waves-effect waves-dark details" style="padding:0">
							${lang.lang_parse_det}
						</a>
					</div>
					<div class="action ${antidmHide}">
						<a onclick="details('${toot.id}','${acct_id}','${tlid}','normal')" 
							class="waves-effect waves-dark details" style="padding:0">
							${lang.lang_parse_thread}
						</a>
					</div>
					<div class="action ${disp['re']} ${noauth}">
						<a onclick="re('${toot.id}','${to_mention}','${acct_id}','${visen}')" 
							class="waves-effect waves-dark btn-flat actct rep-btn"
							data-men="${to_mention}" data-visen="${visen}" style="padding:0" title="${lang.lang_parse_replyto}">
								<i class="fas fa-share"></i>
								<span class="rep_ct">${replyct}</span>
						</a>
					</div>
					<div class="action ${can_rt} ${disp['rt']} ${noauth}">
						<a onclick="rt('${uniqueid}','${acct_id}','${tlid}')" class="waves-effect waves-dark btn-flat actct bt-btn"
							style="padding:0" title="${lang.lang_parse_bt}">
							<i class="fas fa-retweet ${if_rt} rt_${uniqueid}"></i>
							<span class="rt_ct">${toot.reblogs_count}</span>
						</a>
					</div>
					<div class="action ${can_rt} ${disp['qt']} ${noauth} ${qtClass}">
						<a onclick="qt('${toot.id}','${acct_id}','${toot.account.acct}','${toot.url}')" 
							class="waves-effect waves-dark btn-flat actct" style="padding:0" title="${lang.lang_parse_quote}">
							<i class="text-darken-3 fas fa-quote-right"></i>
						</a>
					</div>
					<div class="action ${disp['bkm']} ${noauth} ${bkmClass}">
						<a onclick="bkm('${toot.id}','${acct_id}','${tlid}')"
							class="waves-effect waves-dark btn-flat actct bkm-btn" style="padding:0"
							title="${lang.lang_parse_bookmark}">
							<i class="fas text-darken-3 fa-bookmark bkm_${toot.id} ${if_bkm}"></i>
					</a>
					</div>
					<div class="action ${disp['fav']} ${noauth}">
						<a onclick="fav('${uniqueid}','${acct_id}','${tlid}')"
							class="waves-effect waves-dark btn-flat actct fav-btn" style="padding:0"
							title="${lang.lang_parse_fav}">
							<i class="fas text-darken-3 fa-star${if_fav} fav_${uniqueid}"></i>
							<span class="fav_ct">${toot.favourites_count}</span>
						</a>
					</div>
				</div>
				<div class="area-side">
					<div class="action ${noauth}">
						<a onclick="toggleAction($(this), ${menuct * 39 + 6})" 
							class="ctxMenu waves-effect waves-dark btn-flat" style="padding:0">
							<i class="text-darken-3 material-icons act-icon">expand_more</i>
						</a>
					</div>
					<div class="action ${noauth}">
						<a onclick="details('${toot.id}','${acct_id}','${tlid}','normal')"
							class="waves-effect waves-dark btn-flat details ${dmHide}" style="padding:0"
							title="${lang.lang_parse_detail}">
						<i class="text-darken-3 material-icons">menu_open</i></a>
					</div>
				</div>
				<div class="contextMenu hide z-depth-4">
					<div class="${viashow}">
						via ${escapeHTML(via)}<br>
						<a onclick="client('${$.strip_tags(via)}')" class="pointer">${lang.lang_parse_clientop}</a>
					</div>
					<div>
					<button onclick="bkm('${toot.id}','${acct_id}','${tlid}')"
						class="waves-effect waves-dark btn-flat actct bkm-btn" style="padding:0">
						<i class="fas text-darken-3 fa-bookmark bkm_${toot.id} ${if_bkm}"></i>
						<span class="bkmStr_${toot.id}">${bkmStr}</span>
					</button>
					</div>
					<div class="${if_mine}">
						<button onclick="del('${toot.id}','${acct_id}')" class="waves-effect waves-dark btn-flat actct"
							style="padding:0">
							<i class="fas fa-trash"></i>${lang.lang_parse_del}
						</button>
					</div>
					<div class="${if_mine}">
						<button onclick="pin('${
							toot.id
						}','${acct_id}')" class="waves-effect waves-dark btn-flat actct" style="padding:0">
							<i class="fas fa-map-pin pin_${toot.id} ${if_pin}"></i>
							<span class="pinStr_${toot.id}">${pinStr}</span>
						</button>
					</div>
					<div class="${if_mine}">
						<button onclick="redraft('${toot.id}','${acct_id}')" class="waves-effect waves-dark btn-flat actct"
							style="padding:0">
							<i class="material-icons">redo</i>${lang.lang_parse_redraft}
						</button>
					</div>
					${trans}
					<div>
					<button onclick="postMessage(['openUrl', '${toot.url}'], '*')"
						class="waves-effect waves-dark btn-flat actct" style="padding:0">
						<i class="fas text-darken-3 fa-globe"></i>
						${lang.lang_parse_link}
					</button>
					</div>
				</div>
			</div>
			`
		}
	})
	if (mix == 'mix') {
		return [templete, local, times]
	} else {
		return templete
	}
}

//オブジェクトパーサー(ユーザーデータ)
function userparse(obj, auth, acct_id, tlid, popup) {
	//独自ロケール
	var locale = localStorage.getItem('locale')
	if (locale == 'yes') {
		var locale = false
	}
	var templete = ''
	var datetype = localStorage.getItem('datetype')
	Object.keys(obj).forEach(function(key) {
		var toot = obj[key]
		if (toot) {
			if (!toot.username) {
				var raw = toot
				toot = toot.account
				var notf = true
			} else {
				var notf = false
			}
			//Instance Actorって…
			if (toot.username.indexOf('.') < 0) {
				if (toot.locked) {
					var locked = ' <i class="fas fa-lock red-text"></i>'
				} else {
					var locked = ''
				}
				if (auth == 'request') {
					var authhtml = `<i class="material-icons gray pointer" onclick="request('${toot.id}','authorize','${acct_id}')" title="Accept">
							person_add
						</i>　
						<i class="material-icons gray pointer" onclick="request('${toot.id}','reject','${acct_id}')" title="Reject">
							person_add_disabled
						</i>`
				} else {
					var authhtml = ''
				}
				var ftxt = lang.lang_parse_followed
				if (!locale && localStorage.getItem('followlocale_' + acct_id)) {
					ftxt = localStorage.getItem('followlocale_' + acct_id)
				}
				if (popup > 0 || popup == -1 || notf) {
					var notftext = ftxt + '<br>'
				} else {
					var notftext = ''
				}
				var memory = localStorage.getItem('notice-mem')
				if (popup >= 0 && obj.length < 5 && notftext != memory) {
					M.toast({ html: escapeHTML(toot.display_name) + ':' + ftxt, displayLength: popup * 1000 })
					$('.notf-icon_' + tlid).addClass('red-text')
					localStorage.setItem('notice-mem', notftext)
					notftext = ''
					var native = localStorage.getItem('nativenotf')
					if (!native) {
						native = 'yes'
					}
					if (native == 'yes') {
						var os = localStorage.getItem('platform')
						var options = {
							body: toot.display_name + '(' + toot.acct + ')' + ftxt,
							icon: toot.avatar
						}
						var domain = localStorage.getItem('domain_' + acct_id)
						var n = new Notification('TheDesk:' + domain, options)
					}
				}
				if (toot.display_name) {
					var dis_name = escapeHTML(toot.display_name)
				} else {
					var dis_name = toot.username
				}
				//ネイティブ通知

				if (toot.emojis) {
					var actemojick = toot.emojis[0]
				} else {
					var actemojick = false
				}
				//絵文字があれば
				if (actemojick) {
					Object.keys(toot.emojis).forEach(function(key5) {
						var emoji = toot.emojis[key5]
						var shortcode = emoji.shortcode
						var emoji_url = `
						<img draggable="false" src="${emoji.url}" class="emoji-img" data-emoji="${shortcode}" 
							alt=" :${shortcode}: " title="${shortcode}" onclick="this.classList.toggle(\'bigemoji\');">`
						var regExp = new RegExp(':' + shortcode + ':', 'g')
						dis_name = dis_name.replace(regExp, emoji_url)
					})
				}
				if (dis_name) {
					dis_name = twemoji.parse(dis_name)
				}
				if (toot.avatar) {
					var avatar = toot.avatar
				} else {
					var avatar = '../../img/missing.svg'
				}
				if (tlid == 'dir' && acct_id == 'noauth') {
					var udg = `<a onclick="udgEx('${toot.url}','main');" user="${toot.acct}" class="udg">`
				} else {
					var udg = `<a onclick="udg('${toot.id}','${acct_id}');" user="${toot.acct}" class="udg">`
				}
				var latest = date(toot.last_status_at, 'relative')
				if (toot.last_status_at) {
					var latesthtml = `<div class="cbadge" style="width:100px;">Last:${latest}</div>`
				} else {
					var latesthtml = ''
				}
				templete =
					templete +
					`<div class="cvo" style="padding-top:5px;" user-id="${toot.id}">
					<div class="area-notice">${notftext}</div>
					<div class="area-icon">
						${udg}
						<img
							draggable="false"
							src="${avatar}"
							width="40"
							class="prof-img"
							user="${toot.acct}"
							onerror="this.src='../../img/loading.svg'"
						/>
					</a></div>
					<div class="area-display_name">
						<div class="flex-name">
							<span class="user">${dis_name} </span>
							<span
								class="sml gray"
								style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;user-select:auto; cursor:text;"
							>
								@ ${toot.acct}${locked}</span
							>
						</div>
					</div>
					<div class="area-toot acct-note">
						${toot.note.replace(/<br\s?\/?>.+/g, '<span class="gray">...</span>')}
					</div>
					<div style="justify-content:space-around;top:5px" class="area-actions">
						<div class="cbadge" style="width:100px;">
							${lang.lang_status_follow}:${toot.following_count}
						</div>
						<div class="cbadge" style="width:100px;">
							${lang.lang_status_followers}:${toot.followers_count}
						</div>
						${latesthtml}${authhtml}
					</div>
				</div>
				`
			}
		}
	})
	return templete
}
//クライアントダイアログ
function client(name) {
	$('#contextWrap').addClass('hide')
	if (name != 'Unknown') {
		//聞く
		Swal.fire({
			title: lang.lang_parse_clientop,
			text: name + lang.lang_parse_clienttxt,
			type: 'info',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#3085d6',
			confirmButtonText: lang.lang_parse_clientmute,
			cancelButtonText: lang.lang_parse_clientemp,
			showCloseButton: true,
			focusConfirm: false
		}).then(result => {
			if (result.dismiss == 'cancel') {
				//Emp
				var cli = localStorage.getItem('client_emp')
				var obj = JSON.parse(cli)
				if (!obj) {
					var obj = []
					obj.push(name)
					M.toast({ html: escapeHTML(name) + lang.lang_status_emphas, displayLength: 2000 })
				} else {
					var can
					Object.keys(obj).forEach(function(key) {
						var cliT = obj[key]
						if (cliT != name && !can) {
							can = false
						} else {
							can = true
							obj.splice(key, 1)
							M.toast({ html: escapeHTML(name) + lang.lang_status_unemphas, displayLength: 2000 })
						}
					})
					if (!can) {
						obj.push(name)
						M.toast({ html: escapeHTML(name) + lang.lang_status_emphas, displayLength: 2000 })
					} else {
					}
					var json = JSON.stringify(obj)
					localStorage.setItem('client_emp', json)
					parseColumn()
				}
			} else if (result.value) {
				//Mute
				var cli = localStorage.getItem('client_mute')
				var obj = JSON.parse(cli)
				if (!obj) {
					obj = []
				}
				obj.push(name)
				var json = JSON.stringify(obj)
				localStorage.setItem('client_mute', json)
				M.toast({ html: escapeHTML(name) + lang.lang_parse_mute, displayLength: 2000 })
				parseColumn()
			}
		})
	}
}
//Poll Parser
function pollParse(poll, acct_id) {
	var datetype = localStorage.getItem('datetype')
	var anime = localStorage.getItem('animation')
	if (anime == 'yes' || !anime) {
		var lpAnime = 'lpAnime'
	} else {
		var lpAnime = ''
	}
	var choices = poll.options
	if (poll.own_votes) {
		var minechoice = poll.own_votes
	} else {
		var minechoice = []
	}
	var refresh = `<a onclick="voteMastodonrefresh('${acct_id}','${poll.id}')" class="pointer">
		${lang.lang_manager_refresh}
	</a>`
	if (poll.voted && poll.own_votes.length) {
		var myvote = lang.lang_parse_voted
		if (poll.expired) myvote = myvote + '/' + lang.lang_parse_endedvote
		var result_hide = ''
	} else if (poll.voted && !poll.own_votes.length) {
		var myvote = lang.lang_parse_myvote
		if (poll.expired) myvote = myvote + '/' + lang.lang_parse_endedvote
		var result_hide = ''
	} else if (poll.expired) {
		var myvote = lang.lang_parse_endedvote
		var result_hide = ''
	} else {
		var myvote = `<a onclick="voteMastodon('${acct_id}','${poll.id}')" class="votebtn">${lang.lang_parse_vote}</a><br>`
		if (choices[0].votes_count === 0 || choices[0].votes_count > 0) {
			myvote =
				myvote +
				`<a onclick="showResult('${acct_id}','${poll.id}')" class="pointer">
				${lang.lang_parse_unvoted}
				</a>　`
		}
		var result_hide = 'hide'
	}
	var ended = date(poll.expires_at, datetype)
	var pollHtml = ''
	if (choices[0].votes_count === 0 || choices[0].votes_count >0) {
		var max = _.maxBy(choices, 'votes_count').votes_count
	} else {
		var max = 0
	}

	Object.keys(choices).forEach(function(keyc) {
		var choice = choices[keyc]
		var voteit = ''
		for (var i = 0; i < minechoice.length; i++) {
			var me = minechoice[i]
			if (me == keyc) {
				var voteit = '<span class="ownMark"><img class="emoji" draggable="false" src="https://twemoji.maxcdn.com/v/12.1.4/72x72/2705.png"></span>'
				break
			}
		}
		if (!poll.voted && !poll.expired) {
			var votesel =
				"voteSelMastodon('" + acct_id + "','" + poll.id + "'," + keyc + ',' + poll.multiple + ')'
			var voteclass = 'pointer'
		} else {
			var votesel = ''
			var voteclass = ''
		}
		var per = Math.ceil((choice.votes_count / poll.votes_count) * 100)
		if(!per) per = 0
		if (max == choice.votes_count) {
			var addPoll = 'maxVoter'
		} else {
			var addPoll = ''
		}
		var openData = ''
		if (choice.votes_count !== null) {
			openData = `<span style="float: right">${choice.votes_count}<span class="sml">(${per}%)</span></span>`
		} else {
			openData = `<span style="float: right">?<span class="sml">(-%)</span></span>`
		}
		pollHtml =
			pollHtml +
			`<div class="${voteclass} vote vote_${acct_id}_${poll.id}_${keyc}" onclick="${votesel}">
				<span class="vote_${acct_id}_${poll.id}_result leadPoll ${result_hide} ${addPoll} ${lpAnime}" style="width: ${per}%"></span>
				<span class="onPoll">${escapeHTML(choice.title)}${voteit}</span>
				<span class="vote_${acct_id}_${poll.id}_result ${result_hide} onPoll">
					${openData}
				</span>
			</div>`
	})
	if (poll.expired) {
		refresh = ''
	}
	pollHtml = `<div class="vote_${acct_id}_${poll.id}">
			${pollHtml}${myvote}
			${refresh}
			<span class="cbadge cbadge-hover" title="${date(poll.expires_at, 'absolute')}">
				<i class="far fa-calendar-times"></i>
				${ended}
			</span>${poll.voters_count} ${lang.lang_parse_people}
		</div>`
	return pollHtml
}
