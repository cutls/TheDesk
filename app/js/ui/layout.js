//レイアウトの設定

var websocketOld = []
var websocket = []
var wsHome = []
var wsLocal = []
var websocketNotf = []

//カラム追加ボックストグル
function addColumnMenu() {
	$('#left-menu a').removeClass('active')
	$('#addColumnMenu').addClass('active')
	$('.menu-content').addClass('hide')
	$('#add-box').removeClass('hide')
	addselCk()
}
$('.type').click(function () {
	$('.type').removeClass('active')
	$(this).addClass('active')
	$('#type-sel').val($(this).attr('data-type'))
})
//最初、カラム変更時に発火
function parseColumn(target, dontclose) {
	if (target === 0) {
		//this is kuso
		target = 'zero'
	}
	console.log('%c Parse column', 'color:red;font-size:125%')
	if (localStorage.getItem('menu-done')) {
		$('#fukidashi').addClass('hide')
	}
	if (!dontclose && !target) {
		tlCloser()
	}

	var multi = localStorage.getItem('multi')
	if (multi) {
		var obj = JSON.parse(multi)
		var templete
		Object.keys(obj).forEach(function (key) {
			var acct = obj[key]
			localStorage.setItem('name_' + key, acct.name)
			localStorage.setItem('user_' + key, acct.user)
			localStorage.setItem('user-id_' + key, acct.id)
			localStorage.setItem('prof_' + key, acct.prof)
			localStorage.setItem('domain_' + key, acct.domain)
			localStorage.setItem('acct_' + key + '_at', acct.at)
			localStorage.setItem('acct_' + key + '_rt', acct.rt ? acct.rt : null)
			if (!target) mastodonBaseStreaming(key)
			ckdb(key)
			//フィルターデータ読もう
			getFilter(key)
			var domain = localStorage.getItem('domain_' + key)
			if (localStorage.getItem('mode_' + domain) == 'misskey') {
				localStorage.removeItem('misskey_wss_' + key)
				connectMisskey(key, false)
			}
			localStorage.removeItem('emoji_' + key) //カスタム絵文字カテゴリ分け用旧データ削除
		})
	}
	var acctlist = obj
	console.table(obj)
	/*var xed=localStorage.getItem("xed");
	if(xed){
		xpand();
	}*/
	var col = localStorage.getItem('column')
	if (!col) {
		var obj = [
			{
				domain: 0,
				type: 'home',
			},
			{
				domain: 0,
				type: 'local',
			}
		]
		var json = JSON.stringify(obj)
		localStorage.setItem('column', json)
	} else {
		var obj = JSON.parse(col)
	}
	var numtarget = false
	if (target == 'add') {
		var tlidtar = obj.length - 1
		obj = [obj[tlidtar]]
	} else if (target) {
		var tlidtar = target
		if (target == 'zero') {
			target = 0
		}
		obj = [obj[target]]
		numtarget = true
	} else {
		var tlidtar = null
		if ($('#timeline-container').length) {
			$('#timeline-container').html('')
			$('.box, .boxIn').resizable('destroy')
		}
	}
	var basekey = 0
	for (var key = 0; key < obj.length; key++) {
		var next = key + 1
		//acctって言いながらタイムライン
		var acct = obj[key]
		if (tlidtar) {
			if (tlidtar == 'zero') {
				key = 0
			} else {
				key = tlidtar
			}
		}
		if (acct.type == 'notf') {
			var notf_attr = ' data-notf=' + acct.domain
			var if_notf = 'hide'
		} else {
			var notf_attr = ''
			var if_notf = ''
		}
		if (localStorage.getItem('notification_' + acct.domain)) {
			var unique_notf = lang.lang_layout_thisacct.replace('{{notf}}', localStorage.getItem('notification_' + acct.domain))
		} else {
			if (lang.language == 'ja') {
				var notflocale = '通知'
			} else if (lang.language == 'en') {
				var notflocale = 'Notification'
			}
			var unique_notf = lang.lang_layout_thisacct.replace('{{notf}}', notflocale)
		}
		var insert = ''
		var icnsert = ''
		if (acct.background) {
			if (acct.text == 'def') {
			} else {
				if (acct.text == 'black') {
					var txhex = '000000'
					var ichex = '9e9e9e'
				} else if (acct.text == 'white') {
					var txhex = 'ffffff'
					var ichex = 'eeeeee'
				}
				insert = 'background-color:#' + acct.background + '; color: #' + txhex + '; '
				icnsert = ' style="color: #' + ichex + '" '
			}
		}
		if (acctlist[acct.domain]) {
			if (acctlist[acct.domain].background != 'def') {
				insert = insert + ' border-bottom:medium solid #' + acctlist[acct.domain].background + ';'
			}
		}
		if (acct.type == 'notf' && localStorage.getItem('setasread') == 'no') {
			localStorage.setItem('hasNotfC_' + acct.domain, 'true')
		} else {
			localStorage.removeItem('hasNotfC_' + acct.domain)
		}
		var css = ''
		var width = localStorage.getItem('width')
		if (width) {
			css = ' min-width:' + width + 'px;'
		}
		var maxWidth = localStorage.getItem('max-width')
		if (maxWidth) {
			css = css + 'max-width:' + maxWidth + 'px;'
		}
		var margin = localStorage.getItem('margin')
		if (margin) {
			css = css + 'margin-right:' + margin + 'px;'
		}
		if (acct.width) {
			css = css + ' min-width:' + acct.width + 'px !important;max-width:' + acct.width + 'px !important;'
		}
		if (acct.type == 'webview') {
			if (localStorage.getItem('fixwidth')) {
				var fixwidth = localStorage.getItem('fixwidth')
				var css = ' min-width:' + fixwidth + 'px;'
			} else {
				var css = ''
			}
			var html = webviewParse('https://tweetdeck.twitter.com', key, insert, icnsert, css)
			$('#timeline-container').append(html)
			initWebviewEvent()
		} else if (acct.type == 'tootsearch') {
			if (!acct.left_fold) {
				basekey = key
			}

			var anime = localStorage.getItem('animation')
			if (anime == 'yes' || !anime) {
				var animecss = 'box-anime'
			} else {
				var animecss = ''
			}
			unstreamingTL(acct.type, key, basekey, insert, icnsert, acct.left_fold, css, animecss, acct.data)
		} else if (acct.type == 'bookmark' || acct.type == 'fav') {
			if (!acct.left_fold) {
				basekey = key
			}

			var anime = localStorage.getItem('animation')
			if (anime == 'yes' || !anime) {
				var animecss = 'box-anime'
			} else {
				var animecss = ''
			}
			unstreamingTL(acct.type, key, basekey, insert, icnsert, acct.left_fold, css, animecss, acct.domain)
		} else if (acct.type == 'utl') {
			if (!acct.left_fold) {
				basekey = key
			}

			var anime = localStorage.getItem('animation')
			if (anime == 'yes' || !anime) {
				var animecss = 'box-anime'
			} else {
				var animecss = ''
			}
			unstreamingTL(acct.type, key, basekey, insert, icnsert, acct.left_fold, css, animecss, { acct: acct.domain, data: acct.data })
		} else {
			var anime = localStorage.getItem('animation')
			if (anime == 'yes' || !anime) {
				var animecss = 'box-anime'
			} else {
				var animecss = ''
			}
			var unread = `<a id="unread_${key}" onclick="showUnread('${key}','${acct.type}','${acct.domain}')"
					 class="setting nex waves-effect" title="${lang.lang_layout_unread}">
					<i class="material-icons waves-effect nex">more</i><span>${lang.lang_layout_unread}</span>
				</a>`
			var notfDomain = acct.domain
			var notfKey = key
			var if_tag = ''
			var if_tag_btn = ''
			if (acct.type == 'notf') {
				var excludeNotf =
					`<div style="border: 1px solid; padding: 5px; margin-top: 5px; margin-bottom: 5px;">${lang.lang_layout_excluded}:<br>
					<label>
						<input type="checkbox" class="filled-in" id="exc-reply-${key}" ${excludeCk(key, 'mention')} />
						<span>
							${lang.lang_layout_mention}
						</span>
					</label>
					<label>
						<input type="checkbox" class="filled-in" id="exc-fav-${key}" ${excludeCk(key, 'favourite')} />
						<span>
						${lang.lang_layout_fav}
						</span>
					</label> 
					<label>
						<input type="checkbox" class="filled-in" id="exc-bt-${key}" ${excludeCk(key, 'reblog')} />
						<span>
						${lang.lang_layout_bt}
						</span>
					</label>
					<label>
						<input type="checkbox" class="filled-in" id="exc-follow-${key}" ${excludeCk(key, 'follow')} />
						<span>
						${lang.lang_status_follow}
						</span>
					</label> 
					<label>
						<input type="checkbox" class="filled-in" id="exc-poll-${key}" ${excludeCk(key, 'poll')} />
						<span>
						${lang.lang_layout_poll}
						</span>
					</label>
					<label>
						<input type="checkbox" class="filled-in" id="exc-status-${key}" ${excludeCk(key, 'status')} />
						<span>
						${lang.lang_layout_status}
						</span>
					</label>
					<label>
						<input type="checkbox" class="filled-in" id="exc-update-${key}" ${excludeCk(key, 'update')} />
						<span>
						${lang.lang_layout_update}
						</span>
					</label>
					<label>
						<input type="checkbox" class="filled-in" id="exc-follow_request-${key}" ${excludeCk(key, 'follow_request')} />
						<span>
						${lang.lang_layout_follow_request}
						</span>
					</label>
					 <br />
					<button class="btn btn-flat waves-effect notf-exclude-btn waves-light" style="width:calc(50% - 11px); padding:0;" onclick="exclude('${key}')">Filter</button>`
				if (checkNotfFilter(key)) {
					excludeNotf =
						excludeNotf +
						`<button class="btn btn-flat red-text waves-effect notf-exclude-btn waves-light" style="width:calc(50% - 11px); padding:0;" onclick="resetNotfFilter('${key}')">
							Clear all
						</button>`
				}
				excludeNotf = excludeNotf + '</div>'
				notfDomain = 'dummy'
				notfKey = 'dummy'
				var excludeHome = ''
			} else if (acct.type == 'home') {
				var excludeNotf = ''
				var excludeHome = `<a onclick="ebtToggle('${key}')" class="setting nex waves-effect">
						<i class="fas fa-retweet nex" title="${lang.lang_layout_excludingbt}" style="font-size: 24px"></i>
						<span>${lang.lang_layout_excludingbt}</span><span id="sta-bt-${key}">Off</span>
					</a>`
			} else if (acct.type == 'tag') {
				if (acct.data.name) {
					var name = acct.data.name
					var all = acct.data.all
					var any = acct.data.any
					var none = acct.data.none
				} else {
					var name = acct.data
					var all = ''
					var any = ''
					var none = ''
				}
				if_tag = `<div class="column-hide notf-indv-box" id="tag-box_${key}" style="padding:5px;">
					Base: ${name}<br>
					<div id="tagManager-${key}">
						all: <input type="text" id="all_tm-${key}"" value="${all}">
						any: <input type="text" id="any_tm-${key}" value="${any}">
						none: <input type="text" id="none_tm-${key}"" value="${none}">
					</div>
					<button onclick="addTag('${key}')" class="btn waves-effect" style="width: 100%">Refresh</button>
				</div>`
				if_tag_btn = `<a onclick="setToggleTag('${key}')" class="setting nex" 
				title="${lang.lang_layout_tagManager}" style="width:30px">
				<i class="material-icons waves-effect nex">note_add</i>
				</a>`
				unread = ''
				var excludeNotf = ''
				var excludeHome = ''
				var if_notf = 'hide'
			} else {
				var excludeNotf = ''
				var excludeHome = ''
				unread = ''
			}

			var markers = localStorage.getItem('markers')
			if (markers == 'yes') {
				markers = true
			} else {
				markers = false
			}
			const smallHeader = localStorage.getItem('smallHeader') === 'yes'
			if (!markers) {
				unread = ''
			}
			if (!acct.left_fold) {
				basekey = key
				if (!numtarget) {
					var basehtml = `<div style="${css}" class="box ${animecss}" id="timeline_box_${basekey}_parentBox"></div>`
					$('#timeline-container').append(basehtml)
				}
				var left_hold = `<a onclick="leftFoldSet('${key}')" class="setting nex waves-effect">
						<i class="material-icons waves-effect nex" title="${lang.lang_layout_leftFold}">view_agenda</i>
					<span>${lang.lang_layout_leftFold}</span></a>`
			} else {
				var left_hold = `<a onclick="leftFoldRemove('${key}')" class="setting nex waves-effect">
						<i class="material-icons waves-effect nex" title="${lang.lang_layout_leftUnfold}">view_column</i>
					<span>${lang.lang_layout_leftUnfold}</span></a>`
			}
			if (key === 0) {
				left_hold = ''
			}
			if (localStorage.getItem('mode_' + localStorage.getItem('domain_' + acct.domain)) == 'misskey') {
				var isMisRed = ''
				exclude = ''
				var if_misskey_hide = 'hide'
			} else {
				var isMisRed = 'red-text'
				var if_misskey_hide = ''
			}
			if (acct.height) {
				var addHeight = ' min-height:' + acct.height + 'px;max-height:' + acct.height + 'px;'
			} else {
				var addHeight = ''
			}
			if (acct.type != 'pub' && acct.type != 'pub-media') {
				var mediaFil = `<a onclick="mediaToggle('${key}')" class="setting nex waves-effect">
					<i class="material-icons nex" title="${lang.lang_layout_mediafil}">perm_media</i>
				<span>${lang.lang_layout_mediafil}</span/><span id="sta-media-${key}">On</span></a>`
			} else {
				var mediaFil = `<a onclick="remoteOnly('${key}','${acct.type}')" class="setting nex waves-effect">
					<i class="material-icons nex" title="${lang.lang_layout_remoteOnly}">perm_media</i><br />
					<span id="sta-remote-${key}">Off</span>
				${lang.lang_layout_remoteOnly}</a>`
			}
			var html = `
				<div class="boxIn" id="timeline_box_${key}_box" tlid="${key}" data-acct="${acct.domain}" style="${addHeight}">
					<div class="notice-box ${smallHeader ? 'small-header' : ''} z-depth-2" id="menu_${key}" style="${insert}">
						<div class="area-notice">
							<i class="material-icons waves-effect ${isMisRed} notice_icon_acct_${acct.domain} top-icon" id="notice_icon_${key}" ${notf_attr} 
								 onclick="checkStr('${acct.type}','${data}','${acct.domain}', '${key}', '${delc}','${voice}',null)"
							 	 title="${lang.lang_layout_gotop}" aria-hidden="true">
							</i>
						</div>
					<div class="area-notice_name">
						<span id="notice_${key}" class="tl-title"></span>
					</div>
					<div class="area-a1">
						<a onclick="notfToggle('${acct.domain}','${key}')" class="setting nex ${if_notf}" 
							title="${unique_notf}" ${icnsert}>
							<i class="material-icons waves-effect nex notf-icon_${acct.domain}" aria-hidden="true">notifications</i>
							<span class="voice">${unique_notf}</span>
						</a>
						<span class="cbadge hide notf-announ_${acct.domain}" style="margin-right:0" 
							onclick="notfToggle('${acct.domain}','${key}')" title="${lang.lang_layout_announ}">
							<i class="fas fa-bullhorn"></i>
							<span class="notf-announ_${acct.domain}_ct"></span>
							<span class="voice">${lang.lang_layout_announ}</span>
						</span>
						${if_tag_btn}
					</div>
					<div class="area-sta">
						<span class="new badge teal notf-reply_${acct.domain} hide" data-badge-caption="Rp" aria-hidden="true">0</span>
						<span class="new badge yellow black-text notf-fav_${acct.domain} hide" data-badge-caption="Fv" aria-hidden="true">0</span>
						<span class="new badge blue notf-bt_${acct.domain} hide" data-badge-caption="BT" aria-hidden="true">0</span>
						<span class="new badge orange notf-follow_${acct.domain} hide" data-badge-caption="Fw" aria-hidden="true">0</span>
					</div>
					<div class="area-a2">
						<a onclick="removeColumn('${key}')" class="setting nex">
							<i class="material-icons waves-effect nex" title="${lang.lang_layout_delthis}" ${icnsert} aria-hidden="true">cancel</i>
							<span class="voice">${lang.lang_layout_delthis}</span>
						</a>
					</div>
					<div class="area-a3">
						<a onclick="setToggle('${key}')" class="setting nex" title="${lang.lang_layout_setthis}" ${icnsert}>
							<i class="material-icons waves-effect nex" aria-hidden="true">settings</i>
							<span class="voice">${lang.lang_layout_setthis}</span>
						</a>
					</div>
				</div>
				<div class="column-hide notf-indv-box z-depth-4" id="notf-box_${notfKey}">
					<div class="announce_${acct.domain}" style="border: 1px solid"></div>
					<div id="notifications_${notfKey}" data-notf="${notfDomain}" data-type="notf" class="notf-timeline">
					</div>
				</div>
				<div class="column-hide notf-indv-box" id="util-box_${key}" style="padding:5px;">
					${excludeNotf}
					<div class="columnSettings">
					${excludeHome}
					${unread}
					${left_hold}
					${mediaFil}
					<a onclick="cardToggle('${key}')" class="setting nex waves-effect">
						<i class="material-icons nex" title="${lang.lang_layout_linkanades}">link</i>
					<span>${lang.lang_layout_linkana}</span><span id="sta-card-${key}">On</span>
					</a>
					<a onclick="voiceToggle('${key}')" class="setting nex waves-effect">
						<i class="material-icons nex" title="${lang.lang_layout_tts}">hearing</i>
					<span>${lang.lang_layout_tts}TL</span/><span id="sta-voice-${key}">On</span>
					</a>
					<a onclick="columnReload('${key}','${acct.type}')" class="setting nex ${if_misskey_hide} waves-effect">
						<i class="material-icons nex" title="${lang.lang_layout_reconnect}">refresh</i>
						<span>${lang.lang_layout_reconnect}</span>
					</a>
					<a onclick="resetWidth('${key}')" class="setting nex waves-effect">
						<i class="material-icons nex rotate-90" title="${lang.lang_layout_resetWidth}">height</i>
						<span>${lang.lang_layout_resetWidth}</span>
					</a></div>
					<p>${lang.lang_layout_headercolor}</p>
					<div id="picker_${key}" class="color-picker"></div>
				</div>${if_tag}
				<div class="tl-box" tlid="${key}">
					<div id="timeline_${key}" class="tl ${acct.type}-timeline " tlid="${key}" 
						data-type="${acct.type}" data-acct="${acct.domain}" data-const="${acct.type}_${acct.domain}">
						<div id="landing_${key}" class="landing">
						<div class="preloader-wrapper small active " style="margin-top: calc(50vh - 15px)">
							<div class="spinner-layer spinner-blue-only">
								<div class="circle-clipper left">
									<div class="circle"></div>
								</div>
								<div class="gap-patch">
									<div class="circle"></div>
								</div>
								<div class="circle-clipper right">
									<div class="circle"></div>
								</div>
							</div>
					  </div>
					</div>
				</div>
			</div>`
			if (numtarget) {
				$('timeline_box_' + key + '_box').html(html)
			} else {
				$('#timeline_box_' + basekey + '_parentBox').append(html)
			}
			localStorage.removeItem('pool_' + key)
			if (acct.data) {
				var data = acct.data
			} else {
				var data = ''
			}
			if (localStorage.getItem('catch_' + key)) {
				var delc = 'true'
			} else {
				var delc = 'false'
			}

			if (localStorage.getItem('voice_' + key)) {
				var voice = true
			} else {
				var voice = false
			}
			tl(acct.type, data, acct.domain, key, delc, voice, '')
			cardCheck(key)
			ebtCheck(key)
			mediaCheck(key)
			catchCheck(key)
			voiceCheck(key)
			var css = ''
		}
	}
	var box = localStorage.getItem('box')
	if (box == 'absolute') {
		setTimeout(show, 1000)
	}
	if (localStorage.getItem('reverse')) {
		$('#bottom').removeClass('reverse')
		$('.leftside').removeClass('reverse')
	}
	$('#bottom').removeClass('hide')
	if (localStorage.getItem('sec') && localStorage.getItem('sec') != 'nothing') {
		secvis(localStorage.getItem('sec'))
	}
	favTag()
	var cw = localStorage.getItem('always-cw')
	if (cw == 'yes') {
		if (!$('#cw').hasClass('cw-avail')) {
			$('#cw-text').show()
			$('#cw').addClass('yellow-text')
			$('#cw').addClass('cw-avail')
			var cwt = localStorage.getItem('cw-text')
			if (cwt) {
				$('#cw-text').val(cwt)
			}
		}
	}
	$('.box, .boxIn').resizable({
		minHeight: 50,
		minWidth: 50,
		grid: 50,
		resize: function (event, ui) {
			$(this).css('min-width', ui.size.width + 'px')
			$(this).css('max-width', ui.size.width + 'px')
			$(this).css('min-height', ui.size.height + 'px')
			$(this).css('max-height', ui.size.height + 'px')
		},
		stop: function (event, ui) {
			var col = localStorage.getItem('column')
			var o = JSON.parse(col)
			var width = ui.size.width
			var height = ui.size.height
			if ($(this).hasClass('boxIn')) {
				//縦幅。その縦幅を持つカラムのidは
				console.log('tate')
				var key = $(this).attr('tlid')
				var obj = o[key]
				obj.height = height
				o[key] = obj
			} else {
				//横幅。その縦幅を持つカラムのidは
				console.log('yoko')
				var key = $(this).find('.boxIn').attr('tlid')
				var obj = o[key]
				obj.width = width
				o[key] = obj
			}
			var json = JSON.stringify(o)
			localStorage.setItem('column', json)
		},
	})
}
function checkStr(type, data, acct_id, key, delc, voice) {
	if ($('#notice_icon_' + key).hasClass('red-text') && type != 'notf' && type != 'mix') {
		goTop(key)
		tlDiff(type, data, acct_id, key, delc, voice, '')
	} else {
		goTop(key)
	}
}
//セカンダリートゥートボタン
function secvis(set) {
	if (set == 'public') {
		$('#toot-sec-icon').text('public')
		$('#toot-sec-btn').addClass('purple')
	} else if (set == 'unlisted') {
		$('#toot-sec-icon').text('lock_open')
		$('#toot-sec-btn').addClass('blue')
	} else if (set == 'private') {
		$('#toot-sec-icon').text('lock')
		$('#toot-sec-btn').addClass('orange')
	} else if (set == 'direct') {
		$('#toot-sec-icon').text('mail')
		$('#toot-sec-btn').addClass('red')
	} else if (set == 'limited') {
		$('#toot-sec-icon').text('group')
		$('#toot-sec-btn').addClass('teal')
	} else if (set == 'local') {
		$('#toot-sec-icon').text('visibility')
		$('#toot-sec-btn').addClass('light-blue')
	}
	$('#toot-sec-btn').removeClass('hide')
}
//カラム追加
function addColumn() {
	var acct = $('#add-acct-sel').val()
	if (acct != 'webview' && acct != 'noauth') {
		localStorage.setItem('last-use', acct)
	}
	var type = $('#type-sel').val()
	if (acct == 'noauth') {
		acct = $('#noauth-url').val()
		type = 'noauth'
	} else if (acct == 'webview') {
		acct = ''
		type = 'webview'
	}
	var add = {
		domain: acct,
		type: type,
	}
	var multi = localStorage.getItem('column')
	var obj = JSON.parse(multi)
	if (!obj) {
		var leng = 0
		var json = JSON.stringify([add])
		localStorage.setItem('column', json)
	} else {
		var leng = obj.length
		obj.push(add)
		var json = JSON.stringify(obj)
		localStorage.setItem('column', json)
	}

	parseColumn('add')
}
function addselCk() {
	var acct = $('#add-acct-sel').val()
	var domain = localStorage.getItem('domain_' + acct)
	if (acct == 'webview') {
		$('#auth').addClass('hide')
		$('#noauth').addClass('hide')
		$('#webview-add').removeClass('hide')
	} else if (acct == 'noauth') {
		$('#auth').addClass('hide')
		$('#noauth').removeClass('hide')
		$('#webview-add').addClass('hide')
	} else {
		$('#auth').removeClass('hide')
		$('#noauth').addClass('hide')
		$('#webview-add').addClass('hide')
	}
	if (domain == 'knzk.me' || domain == 'mstdn.y-zu.org') {
		$('#type-sel').append('<option value="dm" data-trans="dm" id="direct-add">' + lang.layout_dm + '</option>')
	} else {
		$('#direct-add').remove()
	}
}
//カラム削除
function removeColumn(tlid) {
	Swal.fire({
		title: lang.lang_layout_deleteColumn,
		text: lang.lang_layout_deleteColumnDesc,
		type: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
	}).then((result) => {
		if (result.value) {
			var multi = localStorage.getItem('column')
			var obj = JSON.parse(multi)
			var data = obj[tlid]
			obj.splice(tlid, 1)
			var json = JSON.stringify(obj)
			localStorage.setItem('column', json)
			sortLoad()
			$('#timeline_box_' + tlid + '_box').remove()
			if (!data.left_fold) {
				$('#timeline_box_' + tlid + '_parentBox').remove()
			}
		}
	})
}

//設定トグル
function setToggle(tlid) {
	colorpicker(tlid)
	if ($('#util-box_' + tlid).hasClass('column-hide')) {
		$('#util-box_' + tlid).css('display', 'block')
		$('#util-box_' + tlid).animate(
			{
				height: '200px',
			},
			{
				duration: 300,
				complete: function () {
					$('#util-box_' + tlid).css('overflow-y', 'scroll')
					$('#util-box_' + tlid).removeClass('column-hide')
				},
			}
		)
	} else {
		$('#util-box_' + tlid).css('overflow-y', 'hidden')
		$('#util-box_' + tlid).animate(
			{
				height: '0',
			},
			{
				duration: 300,
				complete: function () {
					$('#util-box_' + tlid).addClass('column-hide')
					$('#util-box_' + tlid).css('display', 'none')
				},
			}
		)
	}
}
//タグトグル
//設定トグル
function setToggleTag(tlid) {
	if ($('#tag-box_' + tlid).hasClass('column-hide')) {
		$('#tag-box_' + tlid).css('display', 'block')
		$('#tag-box_' + tlid).animate(
			{
				height: '200px',
			},
			{
				duration: 300,
				complete: function () {
					$('#tag-box_' + tlid).css('overflow-y', 'scroll')
					$('#tag-box_' + tlid).removeClass('column-hide')
				},
			}
		)
	} else {
		$('#tag-box_' + tlid).css('overflow-y', 'hidden')
		$('#tag-box_' + tlid).animate(
			{
				height: '0',
			},
			{
				duration: 300,
				complete: function () {
					$('#tag-box_' + tlid).addClass('column-hide')
					$('#tag-box_' + tlid).css('display', 'none')
				},
			}
		)
	}
}
function colorpicker(key) {
	temp = `<div onclick="coloradd('${key}','def','def')" class="pointer">Default</div>
		<div onclick="coloradd('${key}','f44336','white')" class="red white-text pointer">Red</div>
		<div onclick="coloradd('${key}','e91e63','white')" class="pink white-text pointer">Pink</div>
		<div onclick="coloradd('${key}','9c27b0','white')" class="purple white-text pointer">Purple</div>
		<div onclick="coloradd('${key}','673ab7','white')" class="deep-purple white-text pointer">Deep-purple</div>
		<div onclick="coloradd('${key}','3f51b5','white')" class="indigo white-text pointer">Indigo</div>
		<div onclick="coloradd('${key}','2196f3','white')" class="blue white-text pointer">Blue</div>
		<div onclick="coloradd('${key}','03a9f4','black')" class="light-blue black-text pointer">Light-blue</div>
		<div onclick="coloradd('${key}','00bcd4','black')" class="cyan black-text pointer">Cyan</div>
		<div onclick="coloradd('${key}','009688','white')" class="teal white-text pointer">Teal</div>
		<div onclick="coloradd('${key}','4caf50','black')" class="green black-text pointer">Green</div>
		<div onclick="coloradd('${key}','8bc34a','black')" class="light-green black-text pointer">Light-green</div>
		<div onclick="coloradd('${key}','cddc39','black')" class="lime black-text pointer">Lime</div>
		<div onclick="coloradd('${key}','ffeb3b','black')" class="yellow black-text pointer">Yellow</div>
		<div onclick="coloradd('${key}','ffc107','black')" class="amber black-text pointer">Amber</div>
		<div onclick="coloradd('${key}','ff9800','black')" class="orange black-text pointer">Orange</div>
		<div onclick="coloradd('${key}','ff5722','white')" class="deep-orange white-text pointer">Deep-orange</div>
		<div onclick="coloradd('${key}','795548','white')" class="brown white-text pointer">Brown</div>
		<div onclick="coloradd('${key}','9e9e9e','white')" class="grey white-text pointer">Grey</div>
		<div onclick="coloradd('${key}','607d8b','white')" class="blue-grey white-text pointer">Blue-grey</div>
		<div onclick="coloradd('${key}','000000','white')" class="black white-text pointer">Black</div>
		<div onclick="coloradd('${key}','ffffff','black')" class="white black-text pointer">White</div>`
	$('#picker_' + key).html(temp)
}
function coloradd(key, bg, txt) {
	var col = localStorage.getItem('column')
	var o = JSON.parse(col)
	var obj = o[key]
	obj.background = bg
	obj.text = txt
	o[key] = obj
	var json = JSON.stringify(o)
	localStorage.setItem('column', json)
	if (txt == 'def') {
		$('#menu_' + key).css('background-color', '')
		$('#menu_' + key).css('color', '')
		$('#menu_' + key + ' .nex').css('color', '')
	} else {
		$('#menu_' + key).css('background-color', '#' + bg)
		if (txt == 'black') {
			var bghex = '000000'
			var ichex = '9e9e9e'
		} else if (txt == 'white') {
			var bghex = 'ffffff'
			var ichex = 'eeeeee'
		}
		$('#menu_' + key + ' .nex').css('color', '#' + ichex)
		$('#menu_' + key).css('color', '#' + bghex)
	}
}
//禁断のTwitter
function webviewParse(url, key, insert, icnsert, css) {
	var html = `<div class="box" id="timeline_box_${key}_box" tlid="${key}" style="${css}">
			<div class="notice-box z-depth-2" id="menu_${key}" style="${insert}">
				<div class="area-notice">
					<i class="fab fa-twitter waves-effect" id="notice_icon_${key}" style="font-size:40px; padding-top:25%;"></i>
				</div>
				<div class="area-notice_name tl-title">WebView('${url}')</div>
				<div class="area-sta">
				</div>
				<div class="area-a2">
					<a onclick="removeColumn('${key}')" class="setting nex">
						<i class="material-icons waves-effect nex" title="${lang.lang_layout_delthis}" ${icnsert}>cancel</i>
					</a>
				</div>
				<div class="area-a3">
					<a onclick="setToggle('${key}')" class="setting nex" title="${lang.lang_layout_setthis}" ${icnsert}>
						<i class="material-icons waves-effect nex">settings</i>
					</a>
				</div>
			</div>
			<div class="column-hide notf-indv-box z-depth-4" id="notf-box_${key}"></div>
			<div class="column-hide notf-indv-box" id="util-box_${key}" style="padding:5px;">
				${lang.lang_layout_headercolor}
				<br>
				<div id="picker_${key}" class="color-picker"></div>
			</div>
			<div class="tl-box" tlid="${key}" style="width:100%;height:100%;">
				<div id="timeline_${key}" class="tl" tlid="${key}" data-type="webview" style="width:100%;height:100%;">
					<webview src="${url}" style="width:100%;height:100%;" id="webview" preload="./js/platform/twitter.js"></webview>
				</div>
			</div>
		</div>`
	return html
}
function unstreamingTL(type, key, basekey, insert, icnsert, left_fold, css, animecss, data) {
	//type名が関数名
	if (!left_fold) {
		var basehtml = `<div style="${css}" class="box ${animecss}" id="timeline_box_${basekey}_parentBox"></div>`
		$('#timeline-container').append(basehtml)
		var left_hold = `<a onclick="leftFoldSet('${key}')" class="setting nex">
				<i class="material-icons waves-effect nex" title="${lang.lang_layout_leftFold}">view_agenda</i>
			</a>
			${lang.lang_layout_leftFold}
			</span><br>`
	} else {
		var left_hold = `<a onclick="leftFoldRemove('${key}')" class="setting nex">
				<i class="material-icons waves-effect nex" title="${lang.lang_layout_leftUnfold}">view_column</i>
			</a>
			${lang.lang_layout_leftUnfold}
			</span><br>`
	}
	if (type == 'utl') {
		var dataHtml = false
	} else {
		var dataHtml = data
	}
	let typeFunc = type
	if (type === 'fav') typeFunc = 'favTl'
	var html = `<div class="boxIn" id="timeline_box_${key}_box" tlid="${key}">
			<div class="notice-box z-depth-2" id="menu_${key}" style="${insert} ">
				<div class="area-notice">
					<i class="material-icons waves-effect" id="notice_icon_${key}" style="font-size:40px; padding-top:25%;" 
						onclick="goTop(${key}); ${typeFunc}('${key}','${dataHtml}');" title="${lang.lang_layout_gotop}"></i>
				</div>
				<div class="area-notice_name">
					<span id="notice_${key}" class="tl-title"></span>
				</div>
				<div class="area-a1"></div>
				<div class="area-sta"></div>
				<div class="area-a2">
					<a onclick="removeColumn('${key}')" class="setting nex">
						<i class="material-icons waves-effect nex" title="${lang.lang_layout_delthis}"${icnsert}>cancel</i>
					</a>
				</div>
				<div class="area-a3">
					<a onclick="setToggle('${key}')" class="setting nex" title="${lang.lang_layout_setthis}" ${icnsert}>
						<i class="material-icons waves-effect nex">settings</i>
					</a>
				</div>
			</div>
		<div class="column-hide notf-indv-box" id="util-box_${key}" style="padding:5px;">
			${left_hold}
			<a onclick="mediaToggle('${key}')" class="setting nex">
				<i class="material-icons waves-effect nex" title="${lang.lang_layout_mediafil}">perm_media</i>
				<span id="sta-media-${key}">On</span>
			</a>
			${lang.lang_layout_mediafil}<br>
			${lang.lang_layout_headercolor}<br>
			<div id="picker_${key}" class="color-picker"></div>
		</div>
		<div class="tl-box" tlid="${key}">
			<div id="timeline_${key}" class="tl ${type}-timeline" tlid="${key}" data-type="${type}" data-acct="${data}">
				<div id="landing_${key}" style="text-align:center">
					${lang.lang_layout_nodata}
				</div>
			</div>
		</div>`
	$('#timeline_box_' + basekey + '_parentBox').append(html)
	if (type == 'tootsearch') {
		tootsearch(key, data)
	} else if (type == 'bookmark') {
		bookmark(key, data)
	} else if (type == 'fav') {
		console.log(key, data)
		favTl(key, data)
	} else if (type == 'utl') {
		utl(key, data.acct, data.data)
	}
	cardCheck(key)
	ebtCheck(key)
	mediaCheck(key)
	catchCheck(key)
	voiceCheck(key)
	return true
}
function bookmark(key, data) {
	console.log(key, data)
	if (localStorage.getItem('voice_' + key)) {
		var voice = true
	} else {
		var voice = false
	}
	tl('bookmark', '', data, key, 'false', voice, '')
}
function favTl(key, data) {
	console.log(key, data)
	if (localStorage.getItem('voice_' + key)) {
		var voice = true
	} else {
		var voice = false
	}
	tl('fav', '', data, key, 'false', voice, '')
}
function utl(key, acct_id, data) {
	if (!data) {
		var multi = localStorage.getItem('column')
		var obj = JSON.parse(multi)
		data = obj[key].data
		acct_id = obj[key].domain
	}

	console.log(key, data)
	if (localStorage.getItem('voice_' + key)) {
		var voice = true
	} else {
		var voice = false
	}
	tl('utl', data, acct_id, key, 'false', voice, '')
}
function leftFoldSet(key) {
	var multi = localStorage.getItem('column')
	var obj = JSON.parse(multi)
	obj[key].left_fold = true
	var json = JSON.stringify(obj)
	localStorage.setItem('column', json)
	parseColumn()
}
function leftFoldRemove(key) {
	var multi = localStorage.getItem('column')
	var obj = JSON.parse(multi)
	obj[key].left_fold = false
	var json = JSON.stringify(obj)
	localStorage.setItem('column', json)
	parseColumn()
}
function resetWidth(key) {
	var multi = localStorage.getItem('column')
	var obj = JSON.parse(multi)
	obj[key].width = null
	var json = JSON.stringify(obj)
	localStorage.setItem('column', json)
	$(`#timeline_box_${key}_parentBox`).attr('style', '')
}