//アカウントマネージャ
//最初に読むやつ
function load() {
	$('#acct-list').html('')
	if (location.search) {
		var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/)
		var mode = m[1]
		var codex = m[2]
		if (mode == 'first' && codex == 'true') {
			$('body').addClass('first')
		} else {
		}
	}
	var prof = localStorage.getItem('prof')
	$('.my-prof').attr('src', prof)
	var name = localStorage.getItem('name')
	$('#now-name').text(name)
	var user = localStorage.getItem('user')
	$('#now-user').text(user)
	var domain = localStorage.getItem('domain')
	$('.now-domain').text(domain)
	var multi = localStorage.getItem('multi')
	if (!multi) {
		var obj = []
	} else {
		var obj = JSON.parse(multi)
	}
	if (obj[0]) {
		if (!obj[0].at) {
			obj = []
			localStorage.removeItem('multi')
		}
	}

	console.table(obj)
	var domains = []
	var templete
	$('#acct-list').html('')
	Object.keys(obj).forEach(function (key) {
		var acct = obj[key]
		var list = key * 1 + 1
		if (acct.background != 'def' && acct.text != 'def') {
			var style = 'style="background-color:#' + acct.background + '; color:' + acct.text + ';"'
		} else {
			var style = ''
		}
		if (acct.name) {
			var name = acct.name
		} else {
			var name = acct.user
		}
		domains.push(acct.domain)
		templete = `
		<div id="acct_${key}" class="card" ${style}>
			<div class="card-content ">
				<span class="lts">${list}.</span><img src="${acct.prof}" width="40" height="40" />
				<span class="card-title">${name}</span>${escapeHTML(acct.user)}@${acct.domain}
				<a onclick="login('${acct.domain}')" class="pointer white-text waves-effect" title="${lang.lang_manager_refreshAt}">
					<i class="material-icons text-line-icon">login</i>
				</a>
			</div>
			<div class="card-action">
				<button class="btn-flat waves-effect disTar pointer  white-text" onclick="refresh('${key}')">
					<i class="material-icons left">refresh</i>${lang.lang_manager_refresh}
				</button>
				<button class="btn-flat waves-effect disTar pointer red-text" onclick="multiDel('${key}')">
					<i class="material-icons left">delete</i>${lang.lang_manager_delete}
				</button><br />${lang.lang_manager_color}
				<div id="colorsel_${key}" class="colorsel"></div>
			</div>
		</div>
		`
		$('#acct-list').append(templete)
		colorpicker(key)
	})
	domains = _.uniq(domains)
	$('#domain-list').html('')
	Object.keys(domains).forEach(function (key2) {
		var domain = domains[key2]
		if (localStorage.getItem('letters_' + key2)) {
			var maxChars = localStorage.getItem('letters_' + key2)
		} else {
			var maxChars = 500
		}
		var templete = `
	<li class="collection-item transparent">
		<div>
			<p class="title">${domain}</p>
			${lang.lang_manager_maxChars}　<input style="width: 100px" value="${maxChars}" id="maxChars${key2}">
			<button class="btn-flat waves-effect" onclick="maxChars('${domain}', '${key2}')">
				<i class="material-icons">send</i>
			</button>
			<button class="btn-flat waves-effect secondary-content" onclick="data('${domain}', '${key2}')">
				<i class="material-icons left">info</i>${lang.lang_manager_info}
			</button>
		</div></li>
		`
		$('#domain-list').append(templete)
	})
	multisel()
	var acctN = localStorage.getItem('acct')
	if (!acctN) {
		localStorage.setItem('acct', 0)
		var acctN = 0
	}
	//全部チェックアリでいいと思うの
	$('#linux').prop('checked', true)
}
//最初に読む
load()
support()
function maxChars(domain, uid) {
	var value = $('#maxChars' + uid).val()
	if (value * 1 < 1 || !Number.isInteger(value * 1)) {
		Swal.fire({
			type: 'error',
			title: 'Error'
		})
		return false
	}
	var multi = localStorage.getItem('multi')
	if (!multi) {
		var obj = []
	} else {
		var obj = JSON.parse(multi)
	}
	if (obj[0]) {
		if (!obj[0].at) {
			obj = []
			localStorage.removeItem('multi')
		}
	}
	Object.keys(obj).forEach(function (key) {
		if (obj[key].domain == domain) localStorage.setItem('letters_' + key, value)
	})
	console.log('#maxChars' + uid, value)
	load()
}
//instances.social/instances API
async function data(domain, acct_id) {
	$('#ins-upd').text('Loading...')
	$('#ins-add').text('Loading...')
	$('#ins-connect').text('Loading...')
	$('#ins-toot').text('Loading...')
	$('#ins-sys').text('Loading...')
	$('#ins-per').text('Loading...')
	$('#ins-user').text('Loading...')
	$('#ins-ver').text('Loading...')
	$('#ins-name').text('Loading...')
	$('#ins-prof').attr('src', '../../img/loading.svg')
	var start = 'https://instances.social/api/1.0/instances/show?name=' + domain
	let promise = await fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization:
				'Bearer tC8F6xWGWBUwGScyNevYlx62iO6fdQ4oIK0ad68Oo7ZKB8GQdGpjW9TKxBnIh8grAhvd5rw3iyP9JPamoDpeLQdz62EToPJUW99hDx8rfuJfGdjQuimZPTbIOx0woA5M'
		}
	})
	var json = await promise.json()
	$('#ins-name').text(json.name)
	$('#ins-upd').text(date(json.checked_at, 'full'))
	$('#ins-add').text(date(json.added_at, 'full'))
	$('#ins-connect').text(json.connections)
	$('#ins-toot').text(json.statuses)
	$('#ins-sys').text(date(json.updated_at, 'full'))
	$('#ins-per').text(json.uptime * 100)
	$('#ins-user').text(json.users)
	$('#ins-ver').text(json.version)
	var start = 'https://' + domain + '/api/v1/instance'
	let promise2 = await fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	})
	var json = await promise2.json()
	$('#ins-title').text(json.title)
	$('#ins-desc').html(json.description)
	$('#ins-email').text(json.email)
	$('#ins-toot').text(json.stats.status_count)
	$('#ins-user').text(json.stats.user_count)
	$('#ins-ver').text(json.version)
	$('#ins-prof').attr('src', json.thumbnail)
	$('#ins-admin').text(
		escapeHTML(json.contact_account.display_name) + '(' + json.contact_account.acct + ')'
	)
	$('#ins-admin').attr(
		'href',
		'index.html?mode=user&code=' + json.contact_account.username + '@' + domain
	)
	if (json['max_toot_chars']) {
		localStorage.setItem('letters_' + acct_id, json['max_toot_chars'])
		load()
	}
}

//アカウントデータ　消す
function multiDel(target) {
	var multi = localStorage.getItem('multi')
	var obj = JSON.parse(multi)
	//削除確認ダイアログ
	Swal.fire({
		title: lang.lang_manager_logout,
		text: obj[target]['user'] + '@' + obj[target]['domain'] + lang.lang_manager_confirm,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no
	}).then(result => {
		if (result.value) {
			Object.keys(obj).forEach(function (key) {
				var nk = key - 1
				//公開範囲(差分のみ)
				if (key >= target) {
					var oldvis = localStorage.getItem('vis-memory-' + key)
					if (oldvis) {
						localStorage.setItem('vis-memory-' + nk, oldvis)
					}
				}
				//独自ロケール
				localStorage.removeItem('home_' + key)
				localStorage.removeItem('local_' + key)
				localStorage.removeItem('public_' + key)
				localStorage.removeItem('notification_' + key)
				//アクセストークンとドメイン、プロフ(差分)
				if (key > target) {
					var olddom = localStorage.getItem('domain_' + key)
					localStorage.setItem('domain_' + nk, olddom)
					var oldat = localStorage.getItem('acct_' + key + '_at')
					var oldrt = localStorage.getItem('acct_' + key + '_rt')
					localStorage.setItem('acct_' + nk + '_at', oldat)
					localStorage.setItem('acct_' + nk + '_rt', oldrt)
					localStorage.setItem('name_' + nk, localStorage.getItem('name_' + key))
					localStorage.setItem('user_' + target, localStorage.getItem('user_' + key))
					localStorage.setItem('user-id_' + target, localStorage.getItem('user-id_' + key))
					localStorage.setItem('prof_' + target, localStorage.getItem('prof_' + key))
				}
			})
			//とりあえず消す
			obj.splice(target, 1)
			var json = JSON.stringify(obj)
			localStorage.setItem('multi', json)
			load()
			//カラムデータコンフリクト
			var col = localStorage.getItem('column')
			var oldcols = JSON.parse(col)
			var newcols = []
			Object.keys(oldcols).forEach(function (key) {
				var nk = key - 1
				var oldcol = oldcols[key]
				if (target < oldcol.domain) {
					var newdom = oldcol.domain - 1
				} else {
					var newdom = oldcol.domain
				}
				var type = oldcol.type
				var data = null
				if (oldcol.data) {
					data = oldcol.data
				}
				var background = null
				if (oldcol.background) {
					background = oldcol.background
				}
				var text = null
				if (oldcol.text) {
					text = oldcol.text
				}
				var left_fold = false
				if (oldcol.left_fold) {
					left_fold = true
				}
				//消した垢のコラムじゃないときコピー
				if (target != oldcol.domain) {
					var add = {
						domain: newdom,
						type: type,
						data: data,
						background: background,
						text: text,
						left_fold: left_fold
					}
					newcols.push(add)
				}
			})
			var json = JSON.stringify(newcols)
			localStorage.setItem('column', json)
		}
	})
}
function multiDel2(target) {
	var multi = localStorage.getItem('multi')
	var obj = JSON.parse(multi)
	Swal.fire({
		title: lang.lang_manager_logout,
		text: obj[target]['user'] + '@' + obj[target]['domain'] + lang.lang_manager_confirm,
		type: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no
	}).then(result => {
		if (result.value) {
			obj.splice(target, 1)
			var json = JSON.stringify(obj)
			localStorage.setItem('multi', json)
			Object.keys(obj).forEach(function (key) {
				if (key >= target) {
					var oldvis = localStorage.getItem('vis-memory-' + key)
					if (oldvis) {
						var nk = key - 1
						localStorage.setItem('vis-memory-' + nk, oldvis)
					}
				}
				localStorage.removeItem('home_' + key)
				localStorage.removeItem('local_' + key)
				localStorage.removeItem('public_' + key)
				localStorage.removeItem('notification_' + key)
				refresh(key)
			})
			var col = localStorage.getItem('column')
			if (!col) {
				var obj = [
					{
						domain: 0,
						type: 'local'
					}
				]
				localStorage.setItem('card_0', 'true')
				var json = JSON.stringify(obj)
				localStorage.setItem('column', json)
			} else {
				var cobj = JSON.parse(col)
			}
			Object.keys(cobj).forEach(function (key) {
				var column = cobj[key]
				if (column.domain > target) {
					var nk = key - 1
					column.domain = nk
					cobj[key] = column
				} else if (column.domain == target) {
					localStorage.removeItem('card_' + tlid)
					cobj.splice(key, 1)
				}
			})
			var json = JSON.stringify(column)
			localStorage.setItem('column', json)
			load()
		}
	})
}

//サポートインスタンス
function support() {
	Object.keys(idata).forEach(function (key) {
		var instance = idata[key]
		if (instance == 'instance') {
			templete =
				'<a onclick="login(\'' +
				key +
				'\')" class="collection-item pointer transparent">' +
				idata[key + '_name'] +
				'(' +
				key +
				')</a>'
			$('#support').append(templete)
		}
	})
}

//URL指定してポップアップ
function login(url) {
	var multi = localStorage.getItem('multi')
	var obj = JSON.parse(multi)
	if ($('#misskey:checked').val() == 'on') {
		$('#misskey').prop('checked', true)
		misskeyLogin(url)
		return
	}
	$('#compt').hide()
	if ($('#linux:checked').val() == 'on') {
		var red = 'urn:ietf:wg:oauth:2.0:oob'
		if (~url.indexOf('pixelfed')) {
			red = 'https://thedesk.top/hello.html'
		}
	} else {
		var red = 'thedesk://manager'
	}
	localStorage.setItem('redirect', red)
	var start = 'https://' + url + '/api/v1/apps'
	var httpreq = new XMLHttpRequest()
	httpreq.open('POST', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.responseType = 'json'
	httpreq.send(
		JSON.stringify({
			scopes: 'read write follow',
			client_name: 'TheDesk(PC)',
			redirect_uris: red,
			website: 'https://thedesk.top'
		})
	)
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response
			if (this.status !== 200) {
				setLog(start, this.status, json)
			}
			localStorage.setItem('msky', 'false')
			var auth =
				'https://' +
				url +
				'/oauth/authorize?client_id=' +
				json['client_id'] +
				'&client_secret=' +
				json['client_secret'] +
				'&response_type=code&scope=read+write+follow&redirect_uri=' +
				encodeURIComponent(red)
			localStorage.setItem('domain_tmp', url)
			localStorage.setItem('client_id', json['client_id'])
			localStorage.setItem('client_secret', json['client_secret'])
			$('#auth').show()
			versionChecker(url)
			$('#add').hide()
			postMessage(['openUrl', auth], '*')
			if ($('#linux:checked').val() == 'on') {
			} else {
				postMessage(['sendSinmpleIpc', 'quit'], '*')
			}
		}
	}
}
function versionChecker(url) {
	var start = 'https://' + url + '/api/v1/instance'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function (json) {
			var version = json.version
			if (version) {
				var reg = version.match(/^([0-9])\.[0-9]\.[0-9]/u)
				if (reg) {
					versionCompat(reg[1], reg, json.title, reg[0])
				}
			}
		})
}
function versionCompat(prefix, ver, title, real) {
	$('#compt-instance').text(title)
	$('#compt-ver').text(real)
	if (~real.indexOf('compatible')) {
		$('#compt-warn').show()
	} else {
		$('#compt-warn').hide()
	}
	$('#compt-list').html('')
	var start = '../../source/version.json'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json'
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function (json) {
			var complete = false
			var ct = 0
			var jl = 0
			var jl2 = 0
			Object.keys(json).forEach(function (key) {
				var data = json[key]
				if (data) {
					jl++
					if (key != real && !complete) {
						for (var i = 0; i < data.length; i++) {
							var e = ''
							if (i == 0) {
								e = '(' + key + ')'
							}
							$('#compt-list').append('<li>' + data[i] + e + '</li>')
							ct++
							e = ''
						}
						jl2++
					} else if (!complete) {
						complete = true
					}
				}
			})
			if (lang.language == 'ja' && ct > 0) {
				if (jl2 != jl && prefix != '1') {
					$('#compt').show()
				}
			}
		})
}
//これが後のMisskeyである。
function misskeyLogin(url) {
	if (!url) {
		var url = $('#misskey-url').val()
	}
	var start = 'https://' + url + '/api/app/create'
	var httpreq = new XMLHttpRequest()
	httpreq.open('POST', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.responseType = 'json'
	localStorage.setItem('msky', 'true')
	httpreq.send(
		JSON.stringify({
			name: 'TheDesk(PC)',
			description: 'Mastodon and Misskey client for PC',
			permission: [
				'account-read',
				'account-write',
				'account/read',
				'account/write',
				'drive-read',
				'drive-write',
				'favorite-read',
				'favorite-write',
				'favorites-read',
				'following-read',
				'following-write',
				'messaging-read',
				'messaging-write',
				'note-read',
				'note-write',
				'notification-read',
				'notification-write',
				'reaction-read',
				'reaction-write',
				'vote-read',
				'vote-write',
				'read:account',
				'write:account',
				'read:drive',
				'write:drive',
				'read:blocks',
				'write:blocks',
				'read:favorites',
				'write:favorites',
				'read:following',
				'write:following',
				'read:messaging',
				'write:messaging',
				'read:mutes',
				'write:mutes',
				'write:notes',
				'read:notifications',
				'write:notifications',
				'read:reactions',
				'write:reactions',
				'write:votes'
			]
		})
	)
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response
			if (this.status !== 200) {
				setLog(start, this.status, json)
			}
			misskeyAuth(url, json.secret)
		}
	}
}
function misskeyAuth(url, mkc) {
	var start = 'https://' + url + '/api/auth/session/generate'
	var httpreq = new XMLHttpRequest()
	httpreq.open('POST', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.responseType = 'json'

	localStorage.setItem('mkc', mkc)
	localStorage.setItem('msky', 'true')
	httpreq.send(
		JSON.stringify({
			appSecret: mkc
		})
	)
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response
			if (this.status !== 200) {
				setLog(start, this.status, json)
			}
			var token = json.token
			$('#auth').show()
			$('#code').val(token)
			$('#add').hide()
			$('#misskey').prop('checked', false)
			localStorage.setItem('domain_tmp', url)
			postMessage(['openUrl', json.url], '*')
		}
	}
}

//テキストボックスにURL入れた
function instance() {
	var url = $('#url').val()
	if (url.indexOf('@') != -1 || url.indexOf('https') != -1) {
		alert('入力形式が違います。(Cutls@mstdn.jpにログインする場合、入力するのは"mstdn.jp"です。)')
		return false
	}
	login(url)	
}
//コード入れてAccessTokenゲット
function code(code) {
	localStorage.removeItem('redirect')
	if (!code) {
		var code = $('#code').val()
		$('#code').val('')
	}
	if (!code || code == '') {
		M.toast({ html: lang.lang_fatalerroroccured + 'Error: no code', displayLength: 5000 })
		return false
	}
	var url = localStorage.getItem('domain_tmp')
	localStorage.removeItem('domain_tmp')
	if (localStorage.getItem('msky') == 'true') {
		var start = 'https://' + url + '/api/auth/session/userkey'
		var httpreq = new XMLHttpRequest()
		httpreq.open('POST', start, true)
		httpreq.setRequestHeader('Content-Type', 'application/json')
		httpreq.responseType = 'json'
		httpreq.send(
			JSON.stringify({
				token: code,
				appSecret: localStorage.getItem('mkc')
			})
		)
		httpreq.onreadystatechange = function () {
			if (httpreq.readyState === 4) {
				var json = httpreq.response
				if (this.status !== 200) {
					setLog(start, this.status, json)
				}
				var i = sha256(json.accessToken + localStorage.getItem('mkc'))
				var avatar = json['user']['avatarUrl']
				var priv = 'public'
				var add = {
					at: i,
					name: json['user']['name'],
					domain: url,
					user: json['user']['username'],
					prof: avatar,
					id: json['user']['id'],
					vis: priv,
					mode: 'misskey'
				}
				localStorage.setItem('mode_' + url, 'misskey')
				var multi = localStorage.getItem('multi')
				var obj = JSON.parse(multi)
				var target = obj.length
				obj.push(add)
				localStorage.setItem('name_' + target, json['user']['name'])
				localStorage.setItem('user_' + target, json['user']['username'])
				localStorage.setItem('user-id_' + target, json['user']['id'])
				localStorage.setItem('prof_' + target, avatar)
				var json = JSON.stringify(obj)
				localStorage.setItem('multi', json)
				if ($('body').hasClass('first')) {
					location.href = 'index.html'
				}
				load()
				return
			}
		}
		return
	} else {
		var red = 'urn:ietf:wg:oauth:2.0:oob'
		if (~url.indexOf('pixelfed')) {
			red = 'https://thedesk.top/hello.html'
		}
		var start = 'https://' + url + '/oauth/token'
		var id = localStorage.getItem('client_id')
		var secret = localStorage.getItem('client_secret')
		var httpreq = new XMLHttpRequest()
		httpreq.open('POST', start, true)
		httpreq.setRequestHeader('Content-Type', 'application/json')
		httpreq.responseType = 'json'
		httpreq.send(
			JSON.stringify({
				grant_type: 'authorization_code',
				redirect_uri: red,
				client_id: id,
				client_secret: secret,
				code: code
			})
		)
		httpreq.onreadystatechange = function () {
			if (httpreq.readyState === 4) {
				var json = httpreq.response
				if (this.status !== 200) {
					setLog(start, this.status, json)
				}
				if (json['access_token']) {
					$('#auth').hide()
					$('#add').show()
					getdata(url, json)
				}
			}
		}
	}
}
//ユーザーデータ取得
function getdata(domain, json) {
	var at = json['access_token']
	var rt = `${json['refresh_token']} ${localStorage.getItem('client_id')} ${localStorage.getItem('client_secret')}`
	var start = 'https://' + domain + '/api/v1/accounts/verify_credentials'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function (json) {
			if (json.error) {
				console.error('Error:' + json.error)
				M.toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
				return
			}
			var avatar = json['avatar']
			//missingがmissingなやつ
			if (avatar == '/avatars/original/missing.png') {
				avatar = '../../img/missing.svg'
			}
			if (json['source']) {
				var priv = json['source']['privacy']
			} else {
				var priv = 'public'
			}
			var add = {
				at: at,
				rt: rt ? rt : null,
				name: json['display_name'],
				domain: domain,
				user: json['acct'],
				prof: avatar,
				id: json['id'],
				vis: priv,
				mode: 'mastodon'
			}
			var multi = localStorage.getItem('multi')
			var obj = JSON.parse(multi)
			let addTarget = -1
			let ct = 0
			for (let acct of obj) {
				if (acct.domain === domain && acct.user === json['acct']) {
					console.log('detected dupl addct')
					addTarget = ct
					break
				}
				ct++
			}
			if (addTarget == -1) {
				var target = obj.length
				obj.push(add)
			} else {
				console.log('dupl acct_' + addTarget)
				obj[addTarget] = add
				var target = addTarget
			}
			localStorage.setItem('name_' + target, json['display_name'])
			localStorage.setItem('user_' + target, json['acct'])
			localStorage.setItem('user-id_' + target, json['id'])
			localStorage.setItem('prof_' + target, avatar)
			var json = JSON.stringify(obj)
			localStorage.setItem('multi', json)
			if ($('body').hasClass('first')) {
				location.href = 'index.html'
			}
			load()
		})
}
//アクセストークン直接入力
function atSetup(type) {
	var url = localStorage.getItem('domain_tmp')
	localStorage.removeItem('domain_tmp')
	var multi = localStorage.getItem('multi')
	var avatar = '../../img/missing.svg'
	var priv = 'public'
	if (type == 'misskey') {
		var i = $('#misskey-key').val()
		var add = {
			at: i,
			rt: null,
			name: 'Pseudo Account',
			domain: url,
			user: 'user+pseudo',
			prof: avatar,
			id: 'id+pseudo',
			vis: priv,
			mode: 'misskey'
		}
		localStorage.setItem('mode_' + url, 'misskey')
	} else {
		var i = $('#code').val()
		var add = {
			at: i,
			rt: null,
			name: 'Pseudo Account',
			domain: url,
			user: 'user+pseudo',
			prof: avatar,
			id: 'id+pseudo',
			vis: priv,
			mode: ''
		}
	}
	if (!i || i == '') {
		M.toast({ html: lang.lang_fatalerroroccured + 'Error: access token', displayLength: 5000 })
		return false
	}
	var obj = JSON.parse(multi)
	var target = obj.length
	obj.push(add)
	localStorage.setItem('name_' + target, add['name'])
	localStorage.setItem('user_' + target, add['username'])
	localStorage.setItem('user-id_' + target, add['id'])
	localStorage.setItem('prof_' + target, avatar)
	var json = JSON.stringify(obj)
	localStorage.setItem('multi', json)
	refresh(target)
}

//ユーザーデータ更新
function refresh(target) {
	var multi = localStorage.getItem('multi')
	var obj = JSON.parse(multi)
	console.log(obj)
	if (obj[target].mode == 'misskey') {
		misskeyRefresh(obj, target, obj[target].domain)
		return
	}
	var start = 'https://' + obj[target].domain + '/api/v1/accounts/verify_credentials'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + obj[target].at
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function (json) {
			if (json.error) {
				console.error('Error:' + json.error)
				M.toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
				return
			}
			var avatar = json['avatar']
			//missingがmissingなやつ
			if (avatar == '/avatars/original/missing.png' || !avatar) {
				avatar = './img/missing.svg'
			}
			var ref = {
				at: obj[target].at,
				rt: obj[target].rt ? obj[target].rt : null,
				name: json['display_name'],
				domain: obj[target].domain,
				user: json['acct'],
				prof: avatar,
				id: json['id'],
				vis: json['source']['privacy']
			}
			if (obj[target].background) {
				ref.background = obj[target].background
			}
			if (obj[target].text) {
				ref.text = obj[target].text
			}
			localStorage.setItem('name_' + target, json['display_name'])
			localStorage.setItem('user_' + target, json['acct'])
			localStorage.setItem('user-id_' + target, json['id'])
			localStorage.setItem('prof_' + target, avatar)
			if (json['source']['sensitive']) {
				localStorage.setItem('nsfw_' + target, 'true')
			} else {
				localStorage.removeItem('nsfw_' + target)
			}
			obj[target] = ref
			var json = JSON.stringify(obj)
			localStorage.setItem('multi', json)

			load()
		})
}
function misskeyRefresh(obj, target, url) {
	var start = 'https://' + url + '/api/users/show'
	var httpreq = new XMLHttpRequest()
	httpreq.open('POST', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.responseType = 'json'
	httpreq.send(
		JSON.stringify({
			username: obj[target].user,
			i: obj[target].at
		})
	)
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			var json = httpreq.response
			if (this.status !== 200) {
				setLog(start, this.status, json)
			}
			var avatar = json['user']['avatarUrl']
			var priv = 'public'
			var add = {
				at: json.accessToken,
				rt: null,
				name: json['user']['name'],
				domain: url,
				user: json['user']['username'],
				prof: avatar,
				id: json['user']['id'],
				vis: priv
			}
			var multi = localStorage.getItem('multi')
			var obj = JSON.parse(multi)
			var target = obj.length
			obj.push(add)
			localStorage.setItem('name_' + target, json['user']['name'])
			localStorage.setItem('user_' + target, json['user']['username'])
			localStorage.setItem('user-id_' + target, json['user']['id'])
			localStorage.setItem('prof_' + target, avatar)
			var json = JSON.stringify(obj)
			localStorage.setItem('multi', json)
			load()
			return
		}
	}
}
//アカウントを選択…を実装
function multisel() {
	var multi = localStorage.getItem('multi')
	if (!multi) {
		var obj = []
		var json = JSON.stringify(obj)
		localStorage.setItem('multi', json)
	} else {
		var obj = JSON.parse(multi)
	}
	var templete
	var last = localStorage.getItem('main')
	var sel
	if (obj.length < 1) {
		$('#src-acct-sel').html('<option value="tootsearch">Tootsearch</option>')
		$('#add-acct-sel').html('<option value="noauth">' + lang.lang_login_noauth + '</option>')
	} else {
		Object.keys(obj).forEach(function (key) {
			var acct = obj[key]
			var list = key * 1 + 1
			if (key == last) {
				sel = 'selected'
				mainb = '(' + lang.lang_manager_def + ')'
				var domain = localStorage.getItem('domain_' + key)
				var profimg = localStorage.getItem('prof_' + key)
				var domain = localStorage.getItem('domain_' + key)
				if (!profimg) {
					profimg = '../../img/missing.svg'
				}
			} else {
				sel = ''
				mainb = ''
			}
			template = `
			<option value="${key}" data-icon="${acct.prof}" class="left circle" ${sel}>
				${acct.user}@${acct.domain}${mainb}
			</option>
			`
			$('.acct-sel').append(template)
		})
	}
	$('select').formSelect()
}
function mainacct() {
	var acct_id = $('#main-acct-sel').val()
	localStorage.setItem('main', acct_id)
	M.toast({ html: lang.lang_manager_mainAcct, displayLength: 3000 })
}
function colorpicker(key) {
	temp = `<div onclick="coloradd('${key}','def','def')" class="pointer exc">${lang.lang_manager_none}</div>
		<div onclick="coloradd('${key}','f44336','white')" class="red white-text pointer"></div>
		<div onclick="coloradd('${key}','e91e63','white')" class="pink white-text pointer"></div>
		<div onclick="coloradd('${key}','9c27b0','white')" class="purple white-text pointer"></div>
		<div onclick="coloradd('${key}','673ab7','white')" class="deep-purple white-text pointer"></div>
		<div onclick="coloradd('${key}','3f51b5','white')" class="indigo white-text pointer"></div>
		<div onclick="coloradd('${key}','2196f3','white')" class="blue white-text pointer"></div>
		<div onclick="coloradd('${key}','03a9f4','black')" class="light-blue black-text pointer"></div>
		<div onclick="coloradd('${key}','00bcd4','black')" class="cyan black-text pointer"></div>
		<div onclick="coloradd('${key}','009688','white')" class="teal white-text pointer"></div>
		<div onclick="coloradd('${key}','4caf50','black')" class="green black-text pointer"></div>
		<div onclick="coloradd('${key}','8bc34a','black')" class="light-green black-text pointer"></div>
		<div onclick="coloradd('${key}','cddc39','black')" class="lime black-text pointer"></div>
		<div onclick="coloradd('${key}','ffeb3b','black')" class="yellow black-text pointer"></div>
		<div onclick="coloradd('${key}','ffc107','black')" class="amber black-text pointer"></div>
		<div onclick="coloradd('${key}','ff9800','black')" class="orange black-text pointer"></div>
		<div onclick="coloradd('${key}','ff5722','white')" class="deep-orange white-text pointer"></div>
		<div onclick="coloradd('${key}','795548','white')" class="brown white-text pointer"></div>
		<div onclick="coloradd('${key}','9e9e9e','white')" class="grey white-text pointer"></div>
		<div onclick="coloradd('${key}','607d8b','white')" class="blue-grey white-text pointer"></div>
		<div onclick="coloradd('${key}','000000','white')" class="black white-text pointer"></div>
		<div onclick="coloradd('${key}','ffffff','black')" class="white black-text pointer"></div>`
	$('#colorsel_' + key).html(temp)
}
function coloradd(key, bg, txt) {
	var col = localStorage.getItem('multi')
	var o = JSON.parse(col)
	var obj = o[key]
	obj.background = bg
	obj.text = txt
	o[key] = obj
	var json = JSON.stringify(o)
	localStorage.setItem('multi', json)
	if (txt == 'def') {
		$('#acct_' + key).attr('style', '')
	} else {
		$('#acct_' + key).css('background-color', '#' + bg)
		if (txt == 'black') {
			var bghex = '000000'
			var ichex = '9e9e9e'
		} else if (txt == 'white') {
			var bghex = 'ffffff'
			var ichex = 'eeeeee'
		}
		$('#acct_' + key + ' .nex').css('color', '#' + ichex)
		$('#acct_' + key).css('color', '#' + bghex)
	}
}
//入力時にハッシュタグと@をサジェスト
var timer = null

var input = document.getElementById('url')

var prev_val = input.value
var oldSuggest
var suggest
input.addEventListener(
	'focus',
	function () {
		$('#ins-suggest').html('')
		window.clearInterval(timer)
		timer = window.setInterval(function () {
			var new_val = input.value
			if (prev_val != new_val) {
				if (new_val.length > 3) {
					var start = 'https://www.fediversesearch.com/search?keyword=' + new_val
					fetch(start, {
						method: 'GET',
						headers: {
							'content-type': 'application/json',
							}
					})
						.then(function (response) {
							if (!response.ok) {
								response.text().then(function (text) {
									setLog(response.url, response.status, text)
								})
							}
							return response.json()
						})
						.catch(function (error) {
							todo(error)
							setLog(start, 'JSON', error)
							console.error(error)
						})
						.then(function (json) {
							if (!json.error) {
								var urls = 'Suggest:'
								Object.keys(json.data).forEach(function (key) {
									var url = json.data[key]
									urls =
										urls +
										` <a onclick="login('${url.url}')" class="pointer" title="${url.uri}">${escapeHTML(url.title)}</a>`
								})
								$('#ins-suggest').html(urls)
							} else {
								console.error(json.error)
							}
						})
				}
				oldSuggest = suggest
				prev_value = new_val
			}
		}, 1000)
	},
	false
)

input.addEventListener(
	'blur',
	function () {
		window.clearInterval(timer)
	},
	false
)
//acctで未読マーカーは要らない
function asReadEnd() {
	postMessage(['asReadComp', ''], '*')
}
