//アカウントマネージャ

import _ from 'lodash'
import $ from 'jquery'
import Swal from 'sweetalert2'
import { Credential } from '../../interfaces/MastodonApiReturns'
import { IColumn, IMulti } from '../../interfaces/Storage'
import { autoCompleteGetInstance, autoCompleteInit, formSelectInit, toast } from '../common/declareM'
import api from '../common/fetch'
import lang from '../common/lang'
import { getColumn, getMulti, setColumn, setMulti } from '../common/storage'
import { escapeHTML, setLog } from '../platform/first'
import { IVis } from '../post/secure'
import { idata } from './instance'
import { date } from '../tl/date'

//最初に読むやつ
export function loadAcctList() {
	$('#acct-list').html('')
	const m = location.search.match(/\?mode=([a-zA-Z-0-9]+)&code=(.+)/)
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
	const domainsAll: string[] = []
	$('#acct-list').html('')
	let key = 0
	for (const acct of obj) {
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
				<button class="btn-flat waves-effect disTar pointer  white-text" onclick="refreshManager('${key}')">
					<i class="material-icons left">refresh</i>${lang.lang_manager_refresh}
				</button>
				<button class="btn-flat waves-effect disTar pointer red-text" onclick="multiDel(${key})">
					<i class="material-icons left">delete</i>${lang.lang_manager_delete}
				</button><br />${lang.lang_manager_color}
				<div id="colorsel_${key}" class="colorsel"></div>
			</div>
		</div>
		`
		$('#acct-list').append(template)
		colorPicker(key)
		key++
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
			${lang.lang_manager_maxChars}&nbsp;<input style="width: 100px" value="${maxChars}" id="maxChars${key2}">
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
	multiSel()
	const acctN = localStorage.getItem('acct')
	if (!acctN) localStorage.setItem('acct', '0')
}
export function maxChars(domain: string, uid: string) {
	const value = parseInt(
		$('#maxChars' + uid)
			.val()
			?.toString() || '0',
		10
	)
	if (value < 1) {
		Swal.fire({
			icon: 'error',
			title: 'Error',
		})
		return false
	}
	const obj = getMulti()
	let key = 0
	for (const acct of obj) {
		if (acct.domain === domain) localStorage.setItem('letters_' + key, value.toString())
		key++
	}
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
			Authorization: 'Bearer tC8F6xWGWBUwGScyNevYlx62iO6fdQ4oIK0ad68Oo7ZKB8GQdGpjW9TKxBnIh8grAhvd5rw3iyP9JPamoDpeLQdz62EToPJUW99hDx8rfuJfGdjQuimZPTbIOx0woA5M',
		},
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
			'content-type': 'application/json',
		},
	})
	$('#ins-title').text(json.title)
	$('#ins-desc').html(json.description)
	$('#ins-email').text(json.email)
	$('#ins-toot').text(json.stats.status_count)
	$('#ins-user').text(json.stats.user_count)
	$('#ins-ver').text(json.version)
	$('#ins-prof').attr('src', json.thumbnail)
	$('#ins-admin').text(escapeHTML(json.contact_account.display_name) + '(' + json.contact_account.acct + ')')
	$('#ins-admin').attr('href', 'index.html?mode=user&code=' + json.contact_account.username + '@' + domain)
	if (json.max_toot_chars) {
		localStorage.setItem('letters_' + acctId, json.max_toot_chars)
		loadAcctList()
	}
}

//アカウントデータ 消す
export async function multiDel(target: number) {
	const obj = getMulti()
	//削除確認ダイアログ
	const result = await Swal.fire({
		title: lang.lang_manager_logout,
		text: obj[target].user + '@' + obj[target].domain + lang.lang_manager_confirm,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
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
			const data = oldCol.data || undefined
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
					left_fold: left_fold,
				}
				newCols.push(add)
			}
		}
		setColumn(newCols)
	}
}
export function backToInit() {
	$('#auth').hide()
	$('#add').show()
}

//URL指定してポップアップ
async function login(url: string) {
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
				'content-type': 'application/json',
			},
			body: {
				scopes: 'read write follow',
				client_name: 'TheDesk(PC)',
				redirect_uris: red,
				website: 'https://thedesk.top',
			},
		})
		const auth = `https://${url}/oauth/authorize?client_id=${json.client_id}&client_secret=${json.client_secret}&response_type=code&scope=read+write+follow&redirect_uri=${encodeURIComponent(red)}&state=thedesk`
		localStorage.setItem('domain_tmp', url)
		localStorage.setItem('client_id', json.client_id)
		localStorage.setItem('client_secret', json.client_secret)
		$('#auth').show()
		$('#add').hide()
		postMessage(['openUrl', auth], '*')
	} catch (e: any) {
		setLog(start, e.toString(), 'null')
		return toast({ html: `Error: Unknown Fatal Error` })
	}
}
async function versionChecker(url: string) {
	const start = `https://${url}/api/v1/instance`
	try {
		const json = await api(start, {
			method: 'get',
			headers: {
				'content-type': 'application/json',
			},
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
				if (globalThis.pwa) return false
				const codeSetupCheck = await Swal.fire({
					title: lang.lang_manager_codesetup_title,
					text: lang.lang_manager_codesetup,
					icon: 'info',
					showCancelButton: true,
					confirmButtonText: lang.lang_manager_use,
					cancelButtonText: lang.lang_manager_notUse,
				})
				if (!codeSetupCheck.isConfirmed) return false
				return true
			}
		}
	} catch {
		return false
	}
}
async function versionCompat(title: string, version: string) {
	const mt = version.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)/)
	if (!mt) return
	const [sem, a, b, c] = mt
	if (!sem) true
	$('#compt-instance').text(title)
	$('#compt-ver').text(version)
	$('#compt-list').html('')
	const start = '../../source/version.json'
	const response = await fetch(start)
	const json = await response.json()
	const keys = Object.keys(json)
	let onceAdd = false
	for (const targetVersion of keys) {
		const data = json[targetVersion]
		const [tsem, ta, tb, tc] = targetVersion.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)/) || []
		if (!tsem && !ta) console.log(null)
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
	}
	if (lang.language === 'ja' && onceAdd) $('#compt').show()
}

//テキストボックスにURL入れた
export function instance() {
	const url = $('#autocomplete-input').val()?.toString() || ''
	if (!url || url.indexOf('@') !== -1 || url.indexOf('https') !== -1) {
		Swal.fire(lang.lang_manager_invalidInstance, lang.lang_manager_invalidInstanceDesc)
		return false
	}
	login(url)
}
//コード入れてAccessTokenゲット
export async function code(code: string) {
	let red = localStorage.getItem('redirect')
	localStorage.removeItem('redirect')
	if (!code) {
		code = $('#code').val()?.toString() || ''
		$('#code').val('')
	}
	if (!code || code === '') {
		toast({ html: lang.lang_fatalerroroccured + 'Error: no code', displayLength: 5000 })
		return false
	}
	const url = localStorage.getItem('domain_tmp') || ''
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
		code: code,
	}
	const json = await api(start, { method: 'post', headers: { 'Content-Type': 'application/json' }, body })
	if (json.access_token) {
		$('#auth').hide()
		$('#add').show()
		getMyData(url, json)
	}
}
//ユーザーデータ取得
async function getMyData(domain: string, credential: any) {
	const at = credential.access_token
	const rt = `${credential.refresh_token} ${localStorage.getItem('client_id')} ${localStorage.getItem('client_secret')}`
	const start = `https://${domain}/api/v1/accounts/verify_credentials`
	const json = await api<Credential>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})

	let avatar = json.avatar
	//missingがmissingなやつ
	if (avatar === '/avatars/original/missing.png') {
		avatar = '../../img/missing.svg'
	}
	let priv: IVis = 'public'
	if (json.source && json.source.privacy) {
		priv = json.source.privacy
	}
	const add: IMulti = {
		at: at,
		rt: rt || undefined,
		name: json.display_name || json.acct,
		domain: domain,
		user: json.acct,
		prof: avatar,
		id: json.id,
		vis: priv,
	}
	const obj = getMulti()
	let addTarget = -1
	let ct = 0
	for (const acct of obj) {
		if (acct.domain === domain && acct.user === json.acct) {
			addTarget = ct
			break
		}
		ct++
	}
	let target = addTarget
	if (addTarget === -1) {
		target = obj.length
		obj.push(add)
	} else {
		obj[addTarget] = add
	}
	localStorage.setItem('name_' + target, json.display_name || '')
	localStorage.setItem('user_' + target, json.acct)
	localStorage.setItem('user-id_' + target, json.id)
	localStorage.setItem('prof_' + target, avatar)
	setMulti(obj)
	if ($('body').hasClass('first')) location.href = 'index.html'
	loadAcctList()
}
//アクセストークン直接入力
export function atSetup() {
	const url = localStorage.getItem('domain_tmp')
	if (!url) return
	localStorage.removeItem('domain_tmp')
	const obj = getMulti()
	const avatar = '../../img/missing.svg'
	const priv = 'public'
	const i = $('#code').val()?.toString()
	if (!i) return Swal.fire(`No access token`)
	const add: IMulti = {
		at: i,
		rt: undefined,
		name: 'Pseudo Account',
		domain: url,
		user: 'user+pseudo',
		prof: avatar,
		id: 'id+pseudo',
		vis: priv,
	}
	const target = obj.length
	obj.push(add)
	localStorage.setItem('name_' + target, add.name)
	localStorage.setItem('user_' + target, add.user)
	localStorage.setItem('user-id_' + target, add.id)
	localStorage.setItem('prof_' + target, avatar)
	setMulti(obj)
	refreshManager(target)
}

//ユーザーデータ更新
export async function refreshManager(target: number) {
	const obj = getMulti()
	const start = `https://${obj[target].domain}/api/v1/accounts/verify_credentials`
	const json = await api<Credential>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + obj[target].at,
		},
	})

	let avatar = json.avatar
	//missingがmissingなやつ
	if (avatar === '/avatars/original/missing.png' || !avatar) {
		avatar = './img/missing.svg'
	}
	const ref: IMulti = {
		at: obj[target].at,
		rt: obj[target].rt || undefined,
		name: json.display_name || json.acct,
		domain: obj[target].domain,
		user: json.acct,
		prof: avatar,
		id: json.id,
		vis: json.source.privacy,
	}
	if (obj[target].background) ref.background = obj[target].background
	if (obj[target].text) ref.text = obj[target].text
	localStorage.setItem('name_' + target, json.display_name || json.acct)
	localStorage.setItem('user_' + target, json.acct)
	localStorage.setItem('user-id_' + target, json.id)
	localStorage.setItem('prof_' + target, avatar)
	if (json.source.sensitive) {
		localStorage.setItem('nsfw_' + target, 'true')
	} else {
		localStorage.removeItem('nsfw_' + target)
	}
	obj[target] = ref
	setMulti(obj)
	loadAcctList()
}
//アカウントを選択…を実装
function multiSel() {
	const obj = getMulti()
	const last = localStorage.getItem('main')
	let isSelected = false
	if (obj.length < 1) {
		$('#src-acct-sel').html('<option value="tootsearch">Tootsearch</option>')
		$('#add-acct-sel').html('<option value="noauth">' + lang.lang_login_noauth + '</option>')
	} else {
		let key = 0
		for (const acct of obj) {
			isSelected = false
			let mainb = ''
			if (key.toString() === last) {
				isSelected = true
				mainb = `(${lang.lang_manager_def})`
			}
			const template = `
			<option value="${key}" data-icon="${acct.prof}" class="left circle" ${isSelected ? 'selected' : ''}>
				${acct.user}@${acct.domain}${mainb}
			</option>
			`
			$('.acct-sel').append(template)
			key++
		}
	}
	formSelectInit($('select'))
}
export function mainAcct() {
	const acctId = $('#main-acct-sel').val()?.toString() || '0'
	localStorage.setItem('main', acctId)
	toast({ html: lang.lang_manager_mainAcct, displayLength: 3000 })
}
function colorPicker(key: number) {
	const temp = `<div onclick="colorAddMulti('${key}','def','def')" class="pointer exc">${lang.lang_manager_none}</div>
		<div onclick="colorAddMulti('${key}','f44336','white')" class="red white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','e91e63','white')" class="pink white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','9c27b0','white')" class="purple white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','673ab7','white')" class="deep-purple white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','3f51b5','white')" class="indigo white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','2196f3','white')" class="blue white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','03a9f4','black')" class="light-blue black-text pointer"></div>
		<div onclick="colorAddMulti('${key}','00bcd4','black')" class="cyan black-text pointer"></div>
		<div onclick="colorAddMulti('${key}','009688','white')" class="teal white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','4caf50','black')" class="green black-text pointer"></div>
		<div onclick="colorAddMulti('${key}','8bc34a','black')" class="light-green black-text pointer"></div>
		<div onclick="colorAddMulti('${key}','cddc39','black')" class="lime black-text pointer"></div>
		<div onclick="colorAddMulti('${key}','ffeb3b','black')" class="yellow black-text pointer"></div>
		<div onclick="colorAddMulti('${key}','ffc107','black')" class="amber black-text pointer"></div>
		<div onclick="colorAddMulti('${key}','ff9800','black')" class="orange black-text pointer"></div>
		<div onclick="colorAddMulti('${key}','ff5722','white')" class="deep-orange white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','795548','white')" class="brown white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','9e9e9e','white')" class="grey white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','607d8b','white')" class="blue-grey white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','000000','white')" class="black white-text pointer"></div>
		<div onclick="colorAddMulti('${key}','ffffff','black')" class="white black-text pointer"></div>`
	$('#colorsel_' + key).html(temp)
}
//入力時にインスタンスをサジェスト
let timer = 0

const input = <HTMLInputElement>document.getElementById('autocomplete-input')
let prevVal = input?.value
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let oldSuggest
let suggest
input &&
	input.addEventListener(
		'focus',
		function () {
			const instance = autoCompleteGetInstance(input)
			if (timer) window.clearInterval(timer)
			timer = window.setInterval(async function () {
				const newVal = input.value
				if (prevVal !== newVal) {
					if (newVal.length > 3) {
						const start = `https://www.fediversesearch.com/search/?keyword=${newVal}`
						const json = await api(start, {
							method: 'get',
							headers: {
								'content-type': 'application/json',
							},
						})
						const data = {}
						const jsonData = json.data
						for (const url of jsonData) {
							data[url.uri] = escapeHTML(url.title ? url.title : url.uri)
						}
						instance.updateData(data)
						instance.open()
					}
					oldSuggest = suggest
					prevVal = newVal
				}
			}, 1000)
		},
		false
	)

input &&
	input.addEventListener(
		'blur',
		function () {
			window.clearInterval(timer)
		},
		false
	)
//acctで未読マーカーは要らない
export function asReadEnd() {
	postMessage(['asReadComp', ''], '*')
}

// Or with jQuery

export function autoCompleteInitTrigger() {
	autoCompleteInit($('input.autocomplete'), { data: {} })
}
