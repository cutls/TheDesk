
//オブジェクトパーサー(ユーザーデータ)
function userParse(obj, auth, acct_id, tlid, popup) {
	//独自ロケール
	var locale = localStorage.getItem('locale')
	if (locale === 'yes') {
		var locale = false
	}
	var gif = localStorage.getItem('gif')
	if (!gif) {
		gif = 'yes'
	}
	var templete = ''
	var datetype = localStorage.getItem('datetype')
	Object.keys(obj).forEach(function (key) {
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
				if (auth === 'request') {
					var authhtml = `<i class="material-icons gray pointer" onclick="request('${toot.id}','authorize','${acct_id}')" title="Accept" aria-hidden="true">
							person_add
						</i>
						<i class="material-icons gray pointer" onclick="request('${toot.id}','reject','${acct_id}')" title="Reject" aria-hidden="true">
							person_add_disabled
						</i>`
				} else {
					var authhtml = ''
				}
				if (auth === 'follow') {
					var ftxt = lang.lang_parse_followed
					if (!locale && localStorage.getItem('followlocale_' + acct_id)) {
						ftxt = localStorage.getItem('followlocale_' + acct_id)
					}
				} else if (auth === 'moved') {
					var ftxt = lang.lang_parse_moved
				} else if (auth === 'request') {
					var ftxt = lang.lang_parse_request
				} else if (auth === 'admin.sign_up') {
					var ftxt = lang.lang_parse_signup
				}
				if (popup > 0 || popup === -1 || notf) {
					var notftext = ftxt + '<br>'
				} else {
					var notftext = ''
				}
				var memory = localStorage.getItem('notice-mem')
				if (popup >= 0 && obj.length < 5 && notftext !== memory) {
					toast({ html: escapeHTML(toot.display_name) + ':' + ftxt, displayLength: popup * 1000 })
					$('.notf-icon_' + tlid).addClass('red-text')
					localStorage.setItem('notice-mem', notftext)
					notftext = ''
					var native = localStorage.getItem('nativenotf')
					if (!native) {
						native = 'yes'
					}
					if (native === 'yes') {
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
					Object.keys(toot.emojis).forEach(function (key5) {
						var emoji = toot.emojis[key5]
						var shortcode = emoji.shortcode
						if (gif === 'yes') {
							var emoSource = emoji.url
						} else {
							var emoSource = emoji.static_url
						}
						var emoji_url = `
							<img draggable="false" src="${emoSource}" class="emoji-img" data-emoji="${shortcode}" 
								alt=" :${shortcode}: " title="${shortcode}" onclick="this.classList.toggle('bigemoji');" loading="lazy">
						`
						var regExp = new RegExp(':' + shortcode + ':', 'g')
						dis_name = dis_name.replace(regExp, emoji_url)
					})
				}
				if (dis_name) {
					dis_name = twemojiParse(dis_name)
				}
				if (toot.avatar) {
					if (gif === 'yes') {
						var avatar = toot.avatar
					} else {
						var avatar = toot.avatar_static
					}
				} else {
					var avatar = '../../img/missing.svg'
				}
				if (tlid === 'dir' && acct_id === 'noauth') {
					var udg = `<a onclick="udgEx('${toot.url}','main');" user="${toot.acct}" class="udg">`
				} else {
					var udg = `<a onclick="udg('${toot.id}','${acct_id}');" user="${toot.acct}" class="udg">`
				}
				var latest = date(toot.last_status_at, 'relative', true)
				if (toot.last_status_at) {
					var latesthtml = `<div class="cbadge" style="width:100px;">Last <span class="voice">toot</span>: ${latest}</div>`
				} else {
					var latesthtml = ''
				}
				templete =
					templete +
					`<div class="cusr" style="padding-top:5px;" user-id="${toot.id}">
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
							alt=""
							loading="lazy"
						/>
					</a></div>
					<div class="area-display_name">
						<div class="flex-name">
							<span class="user">${dis_name} </span>
							<span
								class="sml gray"
								style="overflow: hidden;white-space: nowrap;text-overflow: ellipsis;user-select:auto; cursor:text;"
							>
								@${toot.acct}${locked}</span>
						</div>
					</div>
					<div class="area-status">
						<div class="cbadge" style="width:100px;">
							${lang.lang_status_follow}:${toot.following_count}
						</div>
						<div class="cbadge" style="width:100px;">
							${lang.lang_status_followers}:${toot.followers_count}
						</div>
						${latesthtml}
					</div>
					<div class="area-actions" style="justify-content: flex-end;">
						${authhtml}
					</div>
				</div>
				`
			}
		}
	})
	return templete
}