//アカウントマネージャ

import _ from "lodash"
import Swal from "sweetalert2"
import { IColumn } from "../../interfaces/Storage"
import { toast } from "../common/declareM"
import api from "../common/fetch"
import lang from "../common/lang"
import { getColumn, getMulti, setColumn, setMulti } from "../common/storage"
import { escapeHTML, setLog } from "../platform/first"
import { idata } from "./instance"

//最初に読むやつ
export function loadAcctList() {
	$('#acct-list').html('')
	const m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/)
	if (m) {
		const mode = m[1]
		const codex = m[2]
		if (mode === 'first' && codex === 'true') $('body').addClass('first')
	}
	const prof = localStorage.getItem('prof')
	$('.my-prof').attr('src', prof)
	const name = localStorage.getItem('name') || ''
	$('#now-name').text(name)
	const user = localStorage.getItem('user') || ''
	$('#now-user').text(user)
	const domain = localStorage.getItem('domain') || ''
	$('.now-domain').text(domain)
	const obj = getMulti()
	if (!obj) setMulti([])

	console.table(obj)
	const domainsAll: string[] = []
	$('#acct-list').html('')
	let key = 0
	for (const acct of obj) {
		key++
		const list = key + 1
		const isHasStyle = acct.background !== 'def' && acct.text !== 'def'
		const style = isHasStyle ? `style="background-color:#${acct.background}; color:${acct.text};"` : ''
		const name = acct.name || acct.user
		domainsAll.push(acct.domain)
		const template = `
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
		$('#acct-list').append(template)
		colorPicker(key)
	}
	const domains = _.uniq(domainsAll)
	$('#domain-list').html('')
	let key2 = 0
	for (const domain of domains) {
		const maxChars = parseInt(localStorage.getItem('letters_' + key2) || '500', 10) || 500
		const templete = `
	<li class="collection-item transparent">
		<div>
			<p class="title">${domain}</p>
			${lang.lang_manager_maxChars}　<input style="width: 100px" value="${maxChars}" id="maxChars${key2}">
			<button class="btn-flat waves-effect" onclick="maxChars('${domain}', '${key2}')">
				<i class="material-icons">send</i>
			</button>
			<button class="btn-flat waves-effect secondary-content" onclick="getData('${domain}', '${key2}')">
				<i class="material-icons left">info</i>${lang.lang_manager_info}
			</button>
		</div></li>
		`
		$('#domain-list').append(templete)
		key2++
	}
	multisel()
	const acctN = localStorage.getItem('acct')
	if (!acctN) localStorage.setItem('acct', '0')
}
export function maxChars(domain: string, uid: string) {
	const value = parseInt($('#maxChars' + uid).val()?.toString() || '0', 10)
	if (value < 1) {
		Swal.fire({
			icon: 'error',
			title: 'Error'
		})
		return false
	}
	const obj = getMulti()
	let key = 0
	for (const acct of obj) {
		if (acct.domain === domain) localStorage.setItem('letters_' + key, value.toString())
		key++
	}
	console.log('#maxChars' + uid, value)
	loadAcctList()
}
//instances.social/instances API
export async function getData(domain: string, acctId: string) {
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
	const start1 = 'https://instances.social/api/1.0/instances/show?name=' + domain
	const json1 = await api(start1, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization:
				'Bearer tC8F6xWGWBUwGScyNevYlx62iO6fdQ4oIK0ad68Oo7ZKB8GQdGpjW9TKxBnIh8grAhvd5rw3iyP9JPamoDpeLQdz62EToPJUW99hDx8rfuJfGdjQuimZPTbIOx0woA5M'
		}
	})
	$('#ins-name').text(json1.name)
	$('#ins-upd').text(date(json1.checked_at, 'full'))
	$('#ins-add').text(date(json1.added_at, 'full'))
	$('#ins-connect').text(json1.connections)
	$('#ins-toot').text(json1.statuses)
	$('#ins-sys').text(date(json1.updated_at, 'full'))
	$('#ins-per').text(json1.uptime * 100)
	$('#ins-user').text(json1.users)
	$('#ins-ver').text(json1.version)
	const start = 'https://' + domain + '/api/v1/instance'
	const json = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json'
		}
	})
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
		localStorage.setItem('letters_' + acctId, json['max_toot_chars'])
		loadAcctList()
	}
}

//アカウントデータ　消す
export async function multiDel(target: number) {
	const obj = getMulti()
	//削除確認ダイアログ
	const result = await Swal.fire({
		title: lang.lang_manager_logout,
		text: obj[target]['user'] + '@' + obj[target]['domain'] + lang.lang_manager_confirm,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no
	})
	if (result.value) {
		for (let key = 0; key < obj.length; key++) {
			const nk = key - 1
			//公開範囲(差分のみ)
			if (key >= target) {
				const oldVis = localStorage.getItem(`vis-memory-${key}`)
				if (oldVis) localStorage.setItem(`vis-memory-${nk}`, oldVis)
			}
			//独自ロケール
			localStorage.removeItem('home_' + key)
			localStorage.removeItem('local_' + key)
			localStorage.removeItem('public_' + key)
			localStorage.removeItem('notification_' + key)
			//アクセストークンとドメイン、プロフ(差分)
			if (key > target) {
				const olddom = localStorage.getItem('domain_' + key) || ''
				localStorage.setItem('domain_' + nk, olddom)
				const oldat = localStorage.getItem('acct_' + key + '_at') || ''
				const oldrt = localStorage.getItem('acct_' + key + '_rt') || ''
				localStorage.setItem('acct_' + nk + '_at', oldat)
				localStorage.setItem('acct_' + nk + '_rt', oldrt)
				localStorage.setItem('name_' + nk, localStorage.getItem('name_' + key) || '')
				localStorage.setItem('user_' + target, localStorage.getItem('user_' + key) || '')
				localStorage.setItem('user-id_' + target, localStorage.getItem('user-id_' + key) || '')
				localStorage.setItem('prof_' + target, localStorage.getItem('prof_' + key) || '')
			}
		}
		//とりあえず消す
		obj.splice(target, 1)
		setMulti(obj)
		loadAcctList()
		//カラムデータコンフリクト
		const oldCols = getColumn()
		const newCols: IColumn[] = []
		for (const oldCol of oldCols) {
			const newdom = target < oldCol.domain ? oldCol.domain - 1 : oldCol.domain
			const type = oldCol.type
			const data = oldCol.data || null
			const background = oldCol.background || undefined
			const text = oldCol.text || undefined
			const left_fold = !!oldCol.left_fold
			//消した垢のコラムじゃないときコピー
			if (target !== oldCol.domain) {
				const add: IColumn = {
					domain: newdom,
					type: type,
					data: data,
					background: background,
					text: text,
					left_fold: left_fold
				}
				newCols.push(add)
			}
		}
		setColumn(newCols)
	}
}
//サポートインスタンス
export function support() {
	for (const [key, instance] of Object.entries(idata)) {
		if (instance !== 'instance') continue
		const template = `<a onclick="login('${key}')" class="collection-item pointer transparent">${idata[key + '_name']}(${key})</a>`
		$('#support').append(template)
	}
}
export function backToInit() {
	$('#auth').hide()
	$('#add').show()
}

//URL指定してポップアップ
async function login(url) {
	$('#compt').hide()
	const start = `https://${url}/api/v1/apps`
	$('#loginBtn').attr('disabled', 'true')
	const nextSetup = await versionChecker(url)
	$('#loginBtn').removeAttr('disabled')
	let red = 'thedesk://manager'
	if (!nextSetup) {
		red = 'urn:ietf:wg:oauth:2.0:oob'
		if (~url.indexOf('pixelfed')) red = 'https://thedesk.top/hello.html'
	}
	localStorage.setItem('redirect', red)
	try {
		const json = await api(start, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: {
				scopes: 'read write follow',
				client_name: 'TheDesk(PC)',
				redirect_uris: red,
				website: 'https://thedesk.top'
			}
		})
		const auth = `https://${url}/oauth/authorize?client_id=${json.client_id}&client_secret=${json.client_secret}&response_type=code&scope=read+write+follow&redirect_uri=${encodeURIComponent(red)}`
		localStorage.setItem('domain_tmp', url)
		localStorage.setItem('client_id', json['client_id'])
		localStorage.setItem('client_secret', json['client_secret'])
		$('#auth').show()
		$('#add').hide()
		postMessage(['openUrl', auth], '*')
	} catch (e: any) {
		setLog(start, e.toString(), 'null')
		return toast(`Error: Unknown Fatal Error`)
	}

}
async function versionChecker(url) {
	const start = `https://${url}/api/v1/instance`
	try {
		const json = await api(start, {
			method: 'get',
			headers: {
				'content-type': 'application/json'
			}
		})
		const version = json.version
		if (version) {
			const reg = version.match(/^([0-9])\.[0-9]\.[0-9]/u)
			if (reg) versionCompat(json.title, version)
			if (version.match('compatible')) {
				$('#compt-warn').show()
				return false
			} else {
				$('#compt-warn').hide()
				if (global.pwa) return false
				const codeSetupCheck = await Swal.fire({
					title: lang.lang_manager_codesetup_title,
					text: lang.lang_manager_codesetup,
					icon: 'info',
					showCancelButton: true
				})
				if (!codeSetupCheck.isConfirmed) return false
				return true
			}
		}
	} catch {
		return false
	}
}
async function versionCompat(title, version) {
	const [sem, a, b, c] = version.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)/)
	$('#compt-instance').text(title)
	$('#compt-ver').text(version)
	$('#compt-list').html('')
	const start = '../../source/version.json'
	const response = await fetch(start)
	const json = await response.json()
	const keys = Object.keys(json)
	let i = 0
	let onceAdd = false
	for (const targetVersion of keys) {
		const data = json[targetVersion]
		const [tsem, ta, tb, tc] = targetVersion.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)/) || []
		let add = false
		if (ta === a) {
			if (tb === b) {
				if (tc > c) add = true
			} else if (tb > b) {
				add = true
			}
		} else if (ta > a) {
			add = true
		}
		if (!add) break
		if (add) onceAdd = true
		for (const note of data) $('#compt-list').append(`<li>${note}(${targetVersion})</li>`)
		i++
	}
	if (lang.language === 'ja' && onceAdd) $('#compt').show()
}

//テキストボックスにURL入れた
function instance() {
	const url = $('#autocomplete-input').val()?.toString() || ''
	if (url.indexOf('@') !== -1 || url.indexOf('https') !== -1) {
		alert('入力形式が違います。(Cutls@mstdn.jpにログインする場合、入力するのは"mstdn.jp"です。)')
		return false
	}
	login(url)
}
//コード入れてAccessTokenゲット
async function code(code) {
	let red = localStorage.getItem('redirect')
	localStorage.removeItem('redirect')
	if (!code) {
		const code = $('#code').val()
		$('#code').val('')
	}
	if (!code || code === '') {
		toast({ html: lang.lang_fatalerroroccured + 'Error: no code', displayLength: 5000 })
		return false
	}
	const url = localStorage.getItem('domain_tmp')
	localStorage.removeItem('domain_tmp')
	if (!red) red = 'urn:ietf:wg:oauth:2.0:oob'
	if (~url.indexOf('pixelfed')) {
		red = 'https://thedesk.top/hello.html'
	}
	const start = 'https://' + url + '/oauth/token'
	const id = localStorage.getItem('client_id')
	const secret = localStorage.getItem('client_secret')
	const body = {
		grant_type: 'authorization_code',
		redirect_uri: red,
		client_id: id,
		client_secret: secret,
		code: code
	}
	const json = await api(start, { method: 'post', headers: { 'Content-Type': 'application/json' }, body })
	if (json['access_token']) {
		$('#auth').hide()
		$('#add').show()
		getdata(url, json)
	}
}
//ユーザーデータ取得
function getdata(domain, json) {
	const at = json['access_token']
	const rt = `${json['refresh_token']} ${localStorage.getItem('client_id')} ${localStorage.getItem('client_secret')}`
	const start = 'https://' + domain + '/api/v1/accounts/verify_credentials'
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
				toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
				return
			}
			const avatar = json['avatar']
			//missingがmissingなやつ
			if (avatar === '/avatars/original/missing.png') {
				avatar = '../../img/missing.svg'
			}
			if (json['source']) {
				const priv = json['source']['privacy']
			} else {
				const priv = 'public'
			}
			const add = {
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
			const obj = getMulti()
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
			if (addTarget === -1) {
				const target = obj.length
				obj.push(add)
			} else {
				console.log('dupl acct_' + addTarget)
				obj[addTarget] = add
				const target = addTarget
			}
			localStorage.setItem('name_' + target, json['display_name'])
			localStorage.setItem('user_' + target, json['acct'])
			localStorage.setItem('user-id_' + target, json['id'])
			localStorage.setItem('prof_' + target, avatar)
			const json = JSON.stringify(obj)
			localStorage.setItem('multi', json)
			if ($('body').hasClass('first')) {
				location.href = 'index.html'
			}
			load()
		})
}
//アクセストークン直接入力
function atSetup(type) {
	const url = localStorage.getItem('domain_tmp')
	localStorage.removeItem('domain_tmp')
	const obj = getMulti()
	const avatar = '../../img/missing.svg'
	const priv = 'public'
	if (type === 'misskey') {
		const i = $('#misskey-key').val()
		const add = {
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
		const i = $('#code').val()
		const add = {
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
	if (!i || i === '') {
		toast({ html: lang.lang_fatalerroroccured + 'Error: access token', displayLength: 5000 })
		return false
	}
	const target = obj.length
	obj.push(add)
	localStorage.setItem('name_' + target, add['name'])
	localStorage.setItem('user_' + target, add['username'])
	localStorage.setItem('user-id_' + target, add['id'])
	localStorage.setItem('prof_' + target, avatar)
	const json = JSON.stringify(obj)
	localStorage.setItem('multi', json)
	refresh(target)
}

//ユーザーデータ更新
function refresh(target) {
	const obj = getMulti()
	console.log(obj)
	const start = 'https://' + obj[target].domain + '/api/v1/accounts/verify_credentials'
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
				toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
				return
			}
			const avatar = json['avatar']
			//missingがmissingなやつ
			if (avatar === '/avatars/original/missing.png' || !avatar) {
				avatar = './img/missing.svg'
			}
			const ref = {
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
			const json = JSON.stringify(obj)
			localStorage.setItem('multi', json)

			load()
		})
}
//アカウントを選択…を実装
function multisel() {
	const obj = getMulti()
	const templete
	const last = localStorage.getItem('main')
	const sel
	if (obj.length < 1) {
		$('#src-acct-sel').html('<option value="tootsearch">Tootsearch</option>')
		$('#add-acct-sel').html('<option value="noauth">' + lang.lang_login_noauth + '</option>')
	} else {
		Object.keys(obj).forEach(function (key) {
			const acct = obj[key]
			const list = key * 1 + 1
			if (key === last) {
				sel = 'selected'
				mainb = '(' + lang.lang_manager_def + ')'
				const domain = localStorage.getItem('domain_' + key)
				const profimg = localStorage.getItem('prof_' + key)
				const domain = localStorage.getItem('domain_' + key)
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
	const acct_id = $('#main-acct-sel').val()
	localStorage.setItem('main', acct_id)
	toast({ html: lang.lang_manager_mainAcct, displayLength: 3000 })
}
function colorPicker(key) {
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
	const o = getMulti()
	const obj = o[key]
	obj.background = bg
	obj.text = txt
	o[key] = obj
	const json = JSON.stringify(o)
	localStorage.setItem('multi', json)
	if (txt === 'def') {
		$('#acct_' + key).attr('style', '')
	} else {
		$('#acct_' + key).css('background-color', '#' + bg)
		if (txt === 'black') {
			const bghex = '000000'
			const ichex = '9e9e9e'
		} else if (txt === 'white') {
			const bghex = 'ffffff'
			const ichex = 'eeeeee'
		}
		$('#acct_' + key + ' .nex').css('color', '#' + ichex)
		$('#acct_' + key).css('color', '#' + bghex)
	}
}
//入力時にハッシュタグと@をサジェスト
const timer = null

const input = document.getElementById('autocomplete-input')
const prev_val = input.value
const oldSuggest
const suggest
input.addEventListener(
	'focus',
	function () {
		const instance = M.Autocomplete.getInstance(input)
		window.clearInterval(timer)
		timer = window.setInterval(function () {
			const new_val = input.value
			if (prev_val !== new_val) {
				if (new_val.length > 3) {
					const start = 'https://www.fediversesearch.com/search/?keyword=' + new_val
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
								let data = {}
								Object.keys(json.data).forEach(function (key) {
									const url = json.data[key]
									data[url.uri] = escapeHTML(url.title ? url.title : url.uri)
								})
								instance.updateData(data)
								instance.open()
							} else {
								console.error(json.error)
							}
						})
				}
				oldSuggest = suggest
				prev_val = new_val
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

// Or with jQuery

$(document).ready(function () {
	$('input.autocomplete').autocomplete({
		data: {},
	});
});
