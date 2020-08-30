//アカウントマネージャ
//最初に読むやつ
function load() {
	document.querySelector('#acct-list').innerHTML = ''
	if (location.search) {
		const m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/)
		const mode = m[1]
		const codex = m[2]
		if (mode == 'first' && codex == 'true') {
			setAllClasses('body', 'first', 'add')
		}
	}
	const obj = acctList
	let domains = []
	let template = ''
	document.querySelector('#acct-list').innerHTML = ''
	for (let i = 0; i < obj.length; i++) {
		const acct = obj[i]
		const list = (parseInt(i) + 1).toString()
		let style = ''
		if (acct.background != 'def' && acct.text != 'def') style = `style="background-color:#${acct.background}; color:${acct.text};"`
		let name = acct.user
		if (acct.name) name = acct.name
		domains.push(acct.domain)
		template = template + `
		<div id="acct_${key}" class="card" ${style}>
			<div class="card-content ">
				<span class="lts">${list}.</span><img src="${acct.prof}" width="40" height="40" />
				<span class="card-title">${name}</span>${escapeHTML(acct.user)}@${acct.domain}
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
		colorpicker(i)
	}
	document.querySelector('#acct-list').innerHTML = template
	//lodash dependent
	domains = _.uniq(domains)
	document.querySelector('#domain-list').innerHTML = ''
	const keymap = Object.keys(domains)
	let templateDomainList = ''
	for (let j = 0; j < domains.length; j++) {
		const key = keymap[j]
		const domain = domains[key]
		let maxChars = 500
		const thisLtrs = localStorage.getItem(`${domain}_letters`)
		if (thisLtrs) maxChars = thisLtrs
		templateDomainList = templateDomainList + `
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
			</div>
		</li>
		`
	}
	document.querySelector('#domain-list').innnerHTML = templateDomainList
	multisel()
	let acctN = localStorage.getItem('acct')
	if (!acctN) {
		localStorage.setItem('acct', 0)
		acctN = 0
	}
}
//最初に読む
load()
support()
function maxChars(domain, uid) {
	const value = document.querySelector(`#maxChars${uid}`).value
	if (parseInt(value) < 1 || !Number.isInteger(parseInt(value))) {
		Swal.fire({
			type: 'error',
			title: 'Error'
		})
		return false
	}
	const multi = localStorage.getItem('multi')
	if (!multi) return false
	const obj = JSON.parse(multi)
	for (let k = 0; k < obj.length; k++) {
		if (obj[k].domain == domain) localStorage.setItem(`${domain}_letters`, value)
	}
	load()
}
//instances.social/instances API
async function data(domain, acct_id) {
	document.querySelector('#ins-upd').innerText = 'Loading...'
	document.querySelector('#ins-add').innerText = 'Loading...'
	document.querySelector('#ins-connect').innerText = 'Loading...'
	document.querySelector('#ins-toot').innerText = 'Loading...'
	document.querySelector('#ins-sys').innerText = 'Loading...'
	document.querySelector('#ins-per').innerText = 'Loading...'
	document.querySelector('#ins-user').innerText = 'Loading...'
	document.querySelector('#ins-var').innerText = 'Loading...'
	document.querySelector('#ins-name').innerText = 'Loading...'
	document.querySelector('#ins-prof').setAttribute('src', '../../img/loading.svg')
	const start = 'https://instances.social/api/1.0/instances/show?name=' + domain
	const json = await getApi(start, 'tC8F6xWGWBUwGScyNevYlx62iO6fdQ4oIK0ad68Oo7ZKB8GQdGpjW9TKxBnIh8grAhvd5rw3iyP9JPamoDpeLQdz62EToPJUW99hDx8rfuJfGdjQuimZPTbIOx0woA5M')
	document.querySelector('#ins-name').innerText = json.name
	document.querySelector('#ins-upd').innerText = date(json.checked_at, 'full')
	document.querySelector('#ins-add').innerText = date(json.added_at, 'full')
	document.querySelector('#ins-connect').innerText = json.connections
	document.querySelector('#ins-toot').innerText = json.statuses
	document.querySelector('#ins-sys').innerText = date(json.updated_at, 'full')
	document.querySelector('#ins-per').innerText = json.uptime * 100
	document.querySelector('#ins-user').innerText = json.users
	document.querySelector('#ins-ver').innerText = json.version
	const start2 = 'https://' + domain + '/api/v1/instance'
	const json2 = await getApi(start2, null)
	document.querySelector('#ins-title').innerText = json2.title
	document.querySelector('#ins-desc').innerText = json2.description
	document.querySelector('#ins-email').innerText = json2.email
	document.querySelector('#ins-toot').innerText = json2.stats.status_count
	document.querySelector('#ins-user').innerText = json2.user_count
	document.querySelector('#ins-ver').innerText = json2.version
	document.querySelector('#ins-prof').innerText = json2.version
	document.querySelector('#ins-prof').setAttribute('src', json2.thumbnail)
	document.querySelector('#ins-admin').innerText = `${escapeHTML(json2.contact_account.display_name)}(${json2.contact_account.acct})`
	document.querySelector('#ins-admin').setAttribute('href', `index.html?mode=user&code=${json2.contact_account.username}@${domain}`)
	if (json2['max_toot_chars']) {
		localStorage.setItem('letters_' + acct_id, json['max_toot_chars'])
		load()
	}
}

//アカウントデータ　消す
function multiDel(target) {
	const obj = acctList
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
			for (let i = 0; i < obj.length; i++) {
				const nk = i - 1
				if (key >= target) {
					const oldvis = localStorage.getItem(`vis-memory-${i}`)
					if (oldvis) localStorage.setItem(`vis-memory-${nk}`, oldvis)
				}
			}
			//とりあえず消す
			obj.splice(target, 1)
			const json = JSON.stringify(obj)
			localStorage.setItem('multi', json)
			load()
			//カラムデータコンフリクト
			const col = localStorage.getItem('column')
			const oldcols = JSON.parse(col)
			const newcols = []
			for (let i = 0; i < oldcols.length; i++) {
				const nk = i - 1
				const oldcol = oldcols[i]
				let newdom = oldcol.domain
				if (target < oldcol.domain) newdom = oldcol.domain - 1
				const type = oldcol.type
				let data = null
				if (oldcol.data) data = oldcol.data
				let background = null
				if (oldcol.background) background = oldcol.background
				let text = null
				if (oldcol.text) text = oldcol.text
				let left_fold = false
				if (oldcol.left_fold) left_fold = true
				//消した垢のコラムじゃないときコピー
				if (target != oldcol.domain) {
					const add = {
						domain: newdom,
						type: type,
						data: data,
						background: background,
						text: text,
						left_fold: left_fold
					}
					newcols.push(add)
				}
			}
			const newjson = JSON.stringify(newcols)
			localStorage.setItem('column', newjson)
			location.reload()
		}
	})
}

//サポートインスタンス
function support() {
	let i = 0
	let template = ''
	const keys = Object.keys(idata)
	for (const instance of idata) {
		if (instance == 'instance') {
			template = template + `<a onclick="login('${key}') class="collection-item pointer transparent">
				${idata[`${keys[i]}_name`]}
			</a>`
		}
		i++
	}
	document.querySelector('#support').innerHTML = template
}

//URL指定してポップアップ
async function login(url) {
	if (document.querySelector('#misskey').checked) {
		misskeyLogin(url)
		return
	}
	document.querySelector('#compt').style.display = 'none'
	let red = 'thedesk://manager'
	if (document.querySelector('#linux').checked) {
		red = 'urn:ietf:wg:oauth:2.0:oob'
		if (~url.indexOf('pixelfed')) red = 'https://thedesk.top/hello.html'
	}
	localStorage.setItem('redirect', red)
	const start = 'https://' + url + '/api/v1/apps'
	let json
	const body = JSON.stringify({
		scopes: 'read write follow',
		client_name: 'TheDesk(PC)',
		redirect_uris: red,
		website: 'https://thedesk.top'
	})
	const json = await postApi(start, body, null, null)
	const auth = `https://${url}/oauth/authorize?client_id=${json.client_id}&client_secret=${json.client_secret}&response_type=code&scope=read+write+follow&redirect_uri=${encodeURIComponent(red)}`
	localStorage.setItem('domain_tmp', url)
	localStorage.setItem('client_id', json['client_id'])
	localStorage.setItem('client_secret', json['client_secret'])
	document.querySelector('#auth').style.display = 'block'
	versionChecker(url)
	document.querySelector('#add').style.display = 'none'
	postMessage(['openUrl', auth], '*')
	if (!document.querySelector('#linux').checked) postMessage(['sendSinmpleIpc', 'quit'], '*')
}
async function versionChecker(url) {
	const start = `https://${url}/api/v1/instance`
	const json = await getApi(start, null)
	const version = json.version
	if (version) {
		const reg = version.match(/^([0-9])\.[0-9]\.[0-9]/u)
		if (reg) {
			versionCompat(reg[1], reg, json.title, reg[0])
		}
	}
}

async function versionCompat(prefix, ver, title, real) {
	document.querySelector('#compt-instance').innerText = title
	document.querySelector('#compt-ver').innerText = real
	if (~real.indexOf('compatible')) {
		document.querySelector('#compt-warn').style.display = 'block'
	} else {
		document.querySelector('#compt-warn').style.display = 'none'
	}
	document.querySelector('#compt-list').innnerHTML = ''
	const json = await getApi('../../source/version.json', null)
	let complete = false
	let ct = 0
	let jl = 0
	let jl2 = 0
	let template = ''
	for (const key in json) {
		if (complete) break
		const data = json[key]
		if (data) {
			jl++
			if (key != real && !complete) {
				for (let i = 0; i < data.length; i++) {
					let e = ''
					if (i == 0) {
						e = `(${key})`
					}
					template = `<li>${data[i]}${e}</li>`
					ct++
					e = ''
				}
				jl2++
			} else if (!complete) {
				complete = true
			}
		}
	}
	document.querySelector('#compt-list').innnerHTML = template
	if (lang.language == 'ja' && ct > 0) {
		if (jl2 != jl && prefix != '1') {
			document.querySelector('#compt').style.display = 'block'
		}
	}
}

async function misskeyLogin(url) {
	if (!url) {
		url = document.querySelector('#misskey-url').value
	}
	const start = `https://${url}/api/app/create`
	const httpreq = new XMLHttpRequest()
	const body = JSON.stringify({
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
	const json = await postApi(start, body, null, null)
	misskeyAuth(url, json.secret)
}
async function misskeyAuth(url, mkc) {
	const start = 'https://' + url + '/api/auth/session/generate'
	const body = JSON.stringify({
		appSecret: mkc
	})
	const json = await postApi(start, body, null, null)
	const token = json.token
	localStorage.setItem('mkc', mkc)
	document.querySelector('#auth').style.display = 'block'
	document.querySelector('#code').value = token
	document.querySelector('#add').style.display = 'none'
	localStorage.setItem('domain_tmp', url)
	postMessage(['openUrl', json.url], '*')
}

//テキストボックスにURL入れた
function instance() {
	const url = document.querySelector('#url').value
	if (url.indexOf('@') != -1 || url.indexOf('https') != -1) {
		Swal.fire({
			type: 'error',
			title: '入力形式が違います。(Cutls@mstdn.jpにログインする場合、入力するのは"mstdn.jp"です。)'
		})
		return false
	}
	login(url)
}

//コード入れてAccessTokenゲット
async function code(code) {
	localStorage.removeItem('redirect')
	if (!code) {
		code = document.querySelector('#code').value
		document.querySelector('#code').value = ''
	}
	if (!code || code == '') {
		M.toast({ html: lang.lang_fatalerroroccured + 'Error: no code', displayLength: 5000 })
		return false
	}
	const url = localStorage.getItem('domain_tmp')
	localStorage.removeItem('domain_tmp')
	if (document.querySelector('#misskey').checked) {
		document.querySelector('#misskey').checked = false
		const mkc = localStorage.getItem('mkc')
		localStorage.removeItem('mkc')
		const start = `https://${url}/api/auth/session/userkey`
		const body = JSON.stringify({
			token: code,
			appSecret: mkc
		})
		const json = await postApi(start, body, null, null)
		const i = sha256(json.accessToken + mkc)
		const { avatarUrl, name, username, id } = json.user
		const add = {
			at: i,
			name: name,
			domain: url,
			user: username,
			prof: avatarUrl,
			id: id,
			vis: 'public',
			mode: 'misskey'
		}
		const multi = localStorage.getItem('multi')
		let obj = JSON.parse(multi)
		obj.push(add)
		const write = JSON.stringify(obj)
		localStorage.setItem('multi', write)
		if (document.getElementsByTagName('body').classList.contains('first')) {
			location.href = 'index.html'
		}
		load()
		return
	}
	let red = 'urn:ietf:wg:oauth:2.0:oob'
	if (~url.indexOf('pixelfed')) {
		red = 'https://thedesk.top/hello.html'
	}
	const start = `https://${url}/oauth/token`
	const id = localStorage.getItem('client_id')
	localStorage.removeItem('client_id')
	const secret = localStorage.getItem('client_secret')
	localStorage.removeItem('client_secret')
	const body = JSON.stringify({
		grant_type: 'authorization_code',
		redirect_uri: red,
		client_id: id,
		client_secret: secret,
		code: code
	})
	const json = await postApi(start, body, null, null)
	if (json.access_token) {
		document.querySelector('#add').style.display = 'block'
		document.querySelector('#auth').style.display = 'none'
		getdata(url, json.access_token)
	}
}
//ユーザーデータ取得
async function getdata(domain, at) {
	const start = `https://${domain}/api/v1/accounts/verify_credentials`
	const json = await getApi(start, at)
	if (json.error) {
		console.error('Error:' + json.error)
		M.toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
		return
	}
	const {avatar: avatarRaw, display_name: displayName, acct, id, source} = json
	let avatar = avatarRaw
	if (avatar == '/avatars/original/missing.png') {
		avatar = '../../img/missing.svg'
	}
	let priv = 'public'
	if(source) priv = source.privacy
	const add = {
		at: at,
		name: displayName,
		domain: domain,
		user: acct,
		prof: avatar,
		id: id,
		vis: priv,
		mode: 'mastodon'
	}
	const multi = localStorage.getItem('multi')
	let obj = JSON.parse(multi)
	obj.push(add)
	const json = JSON.stringify(obj)
	localStorage.setItem('multi', json)
	if (document.getElementsByTagName('body').classList.contains('first')) {
		location.href = 'index.html'
	}
	load()
}
//アクセストークン直接入力
function atSetup(type) {
	const url = localStorage.getItem('domain_tmp')
	localStorage.removeItem('domain_tmp')
	const multi = localStorage.getItem('multi')
	const avatar = '../../img/missing.svg'
	const priv = 'public'
	let add
	if (type == 'misskey') {
		const i = document.querySelector('#misskey-key').value
		add = {
			at: i,
			name: 'Pseudo Account',
			domain: url,
			user: 'user+pseudo',
			prof: avatar,
			id: 'id+pseudo',
			vis: priv,
			mode: 'misskey'
		}
	} else {
		const i = document.querySelector('#code').value
		add = {
			at: i,
			name: 'Pseudo Account',
			domain: url,
			user: 'user+pseudo',
			prof: avatar,
			id: 'id+pseudo',
			vis: priv,
			mode: 'mastodon'
		}
	}
	if (!i || i == '') {
		M.toast({ html: lang.lang_fatalerroroccured + 'Error: access token', displayLength: 5000 })
		return false
	}
	let obj = JSON.parse(multi)
	obj.push(add)
	const json = JSON.stringify(obj)
	localStorage.setItem('multi', json)
	refresh(target)
}

//ユーザーデータ更新
async function refresh(i) {
	const multi = localStorage.getItem('multi')
	const obj = JSON.parse(multi)
	const target = obj[i]
	if (target.mode == 'misskey') {
		misskeyRefresh(obj, target, target.domain)
		return
	}
	const start = `https://${target.domain}/api/v1/accounts/verify_credentials`
	const json = await getApi(start, target.at)
	if (json.error) {
		console.error('Error:' + json.error)
		M.toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
		return
	}
	const {avatar: avatarRaw, display_name: displayName, acct, id, source} = json
	let avatar = avatarRaw
	//missingがmissingなやつ
	if (avatar == '/avatars/original/missing.png' || !avatar) {
		avatar = './img/missing.svg'
	}
	let priv = 'public'
	if(source) priv = source.privacy
	const ref = {
		at: target.at,
		name: displayName,
		domain: target.domain,
		user: acct,
		prof: avatar,
		id: id,
		vis: priv
	}
	if (target.background) {
		ref.background = target.background
	}
	if (target.text) {
		ref.text = target.text
	}
	if (source.sensitive) {
		localStorage.setItem('nsfw_' + i, 'true')
	} else {
		localStorage.removeItem('nsfw_' + i)
	}
	obj[i] = ref
	const json = JSON.stringify(obj)
	localStorage.setItem('multi', json)

	load()
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
					var start = 'https://instances.social/api/1.0/instances/search?q=' + new_val
					fetch(start, {
						method: 'GET',
						headers: {
							'content-type': 'application/json',
							Authorization:
								'Bearer tC8F6xWGWBUwGScyNevYlx62iO6fdQ4oIK0ad68Oo7ZKB8GQdGpjW9TKxBnIh8grAhvd5rw3iyP9JPamoDpeLQdz62EToPJUW99hDx8rfuJfGdjQuimZPTbIOx0woA5M'
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
								Object.keys(json.instances).forEach(function (key) {
									var url = json.instances[key]
									urls =
										urls +
										` <a onclick="login('${url.name}')" class="pointer">${escapeHTML(url.name)}</a>`
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
