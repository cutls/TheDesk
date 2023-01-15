/*ログイン処理・認証までのJS*/
//最初に読むやつ
//アスタルテ判定初期化

import { Credential } from "../../interfaces/MastodonApiReturns"
import { IMulti } from "../../interfaces/Storage"
import { formSelectInit, toast } from "../common/declareM"
import api from "../common/fetch"
import lang from "../common/lang"
import { getMulti, setMulti } from "../common/storage"
import { verck } from "../common/version"
import { setLog } from "../platform/first"
import { parseColumn } from "../ui/layout"
import { load } from "../ui/settings"
import { isITips, tips, todo } from "../ui/tips"
import { idata } from "./instance"
import $ from 'jquery'

localStorage.removeItem('quoters')
localStorage.removeItem('image')
localStorage.removeItem('stable')
localStorage.setItem('mode_misskey.xyz', 'misskey')
export function ck() {
	const main = localStorage.getItem('main')
	if (!main) localStorage.setItem('main', '0')
	const multi = getMulti()
	if (!multi.length) {
		const date = new Date()
		localStorage.setItem('showSupportMe', (date.getMonth() + 2).toString())
		location.href = 'acct.html?mode=first&code=true'
	} else {
		let key = 0
		for (const acct of multi) {
			if (acct.domain) refresh(key.toString(), true)
			key++
		}
		if (!multi[0].domain) return false
		$('#tl').show()
		ticker()
		multiSelector(false)
		verck(globalThis.ver)
		$('.stw').show()
		const tipsName = localStorage.getItem('tips') || ''
		const matchCID = /custom:([abcdef0-9]{8}-[abcdef0-9]{4}-4[abcdef0-9]{3}-[abcdef0-9]{4}-[abcdef0-9]{12})/
		if (tipsName) {
			const m = tipsName.match(matchCID)
			if (m) {
				const id = m[1]
				tips('custom', id)
			} else {
				if (!isITips(tipsName)) return
				tips(tipsName)
			}
		}
		$('#something-wrong img').attr('src', '../../img/thinking.svg')
	}
}

//ユーザーデータ更新
export async function refresh(targetStr: string, loadskip: boolean) {
	const target = parseInt(targetStr, 10)
	const obj = getMulti() || '[]'
	let at = obj[target].at
	if (obj[target].rt) {
		console.log('refresh access token')
		const atk = await refreshPleromaAt(obj[target])
		if (atk) {
			at = atk
			localStorage.setItem(`acct_${target}_at`, at)
			obj[target].at = at
			localStorage.setItem('multi', JSON.stringify(obj))
		}
	}
	const start = `https://${obj[target].domain}/api/v1/accounts/verify_credentials`
	try {
		const json = await api<Credential>(start, {
			method: 'get',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at
			}
		})
		let avatar = json['avatar']
		//missingがmissingなやつ
		if (avatar === '/avatars/original/missing.png' || !avatar) avatar = './img/missing.svg'
		const ref: IMulti = {
			at: obj[target].at,
			name: json['display_name'] || '',
			domain: obj[target].domain,
			user: json['acct'],
			prof: avatar,
			id: json['id'],
			vis: json['source']['privacy']
		}
		if (obj[target].background) ref.background = obj[target].background
		if (obj[target].text) ref.text = obj[target].text
		localStorage.setItem('name_' + target, json['display_name'] || '')
		localStorage.setItem('user_' + target, json['acct'])
		localStorage.setItem('user-id_' + target, json['id'])
		localStorage.setItem('prof_' + target, avatar)
		localStorage.setItem('follow_' + target, json['following_count'].toString() || '0')
		if (json['source']['sensitive']) {
			localStorage.setItem('nsfw_' + target, 'true')
		} else {
			localStorage.removeItem('nsfw_' + target)
		}
		obj[target] = ref
		const newJson = JSON.stringify(obj)
		localStorage.setItem('multi', newJson)
		if (!loadskip) load()
	} catch (error: any) {
		todo(error)
		setLog(start, 'JSON', error)
		console.error(error)
	}

}
async function refreshPleromaAt(obj: IMulti) {
	const start = 'https://' + obj.domain + '/oauth/token'
	const rt = obj.rt?.split(' ')
	if (!rt) return
	const json = await api(start, {
		method: 'post',
		headers: {
			'content-type': 'application/json'
		},
		body: {
			grant_type: 'refresh_token',
			refresh_token: rt[0],
			client_id: rt[1],
			client_secret: rt[2]
		}
	})
	if (json.access_token) {
		return json.access_token
	} else {
		return false
	}
}
//MarkdownやBBCodeの対応、文字数制限をチェック
//絶対ストリーミングを閉じさせないマン
export async function ckdb(acct_id: string) {
	const domain = localStorage.getItem(`domain_${acct_id}`)
	localStorage.removeItem('home_' + acct_id)
	localStorage.removeItem('bb_' + acct_id)
	localStorage.removeItem('md_' + acct_id)
	localStorage.removeItem('local_' + acct_id)
	localStorage.removeItem('public_' + acct_id)
	localStorage.removeItem('notification_' + acct_id)
	localStorage.removeItem('post_' + acct_id)
	localStorage.removeItem('fav_' + acct_id)
	localStorage.removeItem('bt_' + acct_id)
	localStorage.removeItem('followlocale_' + acct_id)
	const bbcode = domain + '_bbcode'
	const quoteMarker = domain + '_quote'
	if (localStorage.getItem('instance')) {
		const json = JSON.parse(localStorage.getItem('instance') || '{}')
		if (json[quoteMarker] === 'enabled') {
			localStorage.setItem('quoters', 'true')
			localStorage.setItem('quote_' + acct_id, 'true')
		}
		if (json[bbcode]) {
			if (json[bbcode] === 'enabled') {
				localStorage.setItem('bb_' + acct_id, 'true')
			} else {
				localStorage.removeItem('bb_' + acct_id)
				$("[data-activates='bbcode']").addClass('disabled')
				$("[data-activates='bbcode']").prop('disabled', true)
			}
		} else {
			localStorage.removeItem('bb_' + acct_id)
			$("[data-activates='bbcode']").addClass('disabled')
		}

		if (json[domain + '_markdown'] === 'enabled') {
			localStorage.setItem('md_' + acct_id, 'true')
			$('.markdown').show()
		} else {
			$('.anti-markdown').hide()
			$('.markdown').hide()
			localStorage.removeItem('bb_' + acct_id)
		}
		if (json[domain + '_home']) {
			localStorage.setItem('home_' + acct_id, json[domain + '_home'])
		}
		if (json[domain + '_local']) {
			localStorage.setItem('local_' + acct_id, json[domain + '_local'])
		}
		if (json[domain + '_public']) {
			localStorage.setItem('public_' + acct_id, json[domain + '_public'])
		}
		if (json[domain + '_notification']) {
			localStorage.setItem('notification_' + acct_id, json[domain + '_notification'])
		}
		if (json[domain + '_post']) {
			localStorage.setItem('post_' + acct_id, json[domain + '_post'])
		}
		if (json[domain + '_fav']) {
			localStorage.setItem('fav_' + acct_id, json[domain + '_fav'])
		}
		if (json[domain + '_bt']) {
			localStorage.setItem('bt_' + acct_id, json[domain + '_bt'])
		}
		if (json[domain + '_follow']) {
			localStorage.setItem('followlocale_' + acct_id, json[domain + '_follow'])
		}
	}
	const start = 'https://' + domain + '/api/v1/instance'
	try {
		const json = await api(start, {
			method: 'get',
			headers: {
				'content-type': 'application/json'
			}
		})
		if (json) {
			if (json['max_toot_chars']) localStorage.setItem('letters_' + acct_id, json['max_toot_chars'])
			if (json['urls'] && json['urls']['streaming_api']) {
				localStorage.setItem('streaming_' + acct_id, json['urls']['streaming_api'])
			} else {
				localStorage.removeItem('streaming_' + acct_id)
			}
		}
	} catch (error: any) {
		console.error(error)
	}

}

//アカウントを選択…を実装
export function multiSelector(parseC?: boolean) {
	const obj = getMulti()
	if (!obj) setMulti([])
	let last = '0'
	if (localStorage.getItem('mainuse') === 'main') {
		last = localStorage.getItem('main') || '0'
	} else if (localStorage.getItem('last-use')) {
		last = localStorage.getItem('last-use') || '0'
		if (last === 'webview' || last === 'noauth') last = '0'
	}
	let isSelected = false
	const webview = localStorage.getItem('webview_setting') === 'true'
	if (obj.length < 1) {
		$('#src-acct-sel').html('<option value="tootsearch">Tootsearch</option>')
		$('#add-acct-sel').html('<option value="noauth">' + lang.lang_login_noauth + `</option>${webview ? `<option value="webview">TweetDeck</option>` : ''}`)
	} else {
		let key = 0
		for (const acct of obj) {
			isSelected = false
			if (key.toString() === last) {
				isSelected = true
				const domain = acct.domain
				localStorage.setItem('domain_' + key, domain)
				if (idata[domain + '_letters']) {
					$('#textarea').attr('data-length', idata[domain + '_letters'])
				} else {
					const maxLetters = parseInt(localStorage.getItem('letters_' + key) || '0', 10)
					if (maxLetters > 0) {
						$('#textarea').attr('data-length', maxLetters)
					} else {
						$('#textarea').attr('data-length', 500)
					}
				}
				if (idata[domain + '_glitch']) $('#local-button').removeClass('hide')
				const profImg = acct.prof || '../../img/missing.svg'
				$('#acct-sel-prof').attr('src', profImg)
				const cc = domain ? `(${domain})` : ''
				$('#toot-post-btn').text(lang.lang_toot + cc)
				if (acct.background && acct.background !== 'def' && acct.text && acct.text !== 'def') {
					$('#toot-post-btn').removeClass('indigo')
					$('#toot-post-btn').css('background-color', '#' + acct.background)
					$('#toot-post-btn').css('color', acct.text)
				}
			}
			const template = `<option value="${key}" data-icon="${acct.prof}" class="left circle" ${isSelected ? 'selected="true"' : ''}>${acct.user}@${acct.domain}</option>`
			$('.acct-sel').append(template)
			key++
		}
		$('#src-acct-sel').append('<option value="tootsearch">Tootsearch</option>')
		$('#add-acct-sel').append(`<option value="noauth">${lang.lang_login_noauth}</option><option value="webview">TweetDeck</option>`)
		if (!webview) $('#webview-add').append(`<br /><span style="font-size: 0.7rem">${lang.lang_setting_webview_warn}</span>`)
		$('#dir-acct-sel').append(`<option value="noauth">${lang.lang_login_noauth}</option>`)
	}
	formSelectInit($('select'))
	if (!parseC) parseColumn(undefined, true)
}

//インスタンスティッカー
export async function ticker() {
	const start = 'https://s.0px.io/json'
	try {
		const json = await api(start, {
			method: 'get',
			headers: {
				'content-type': 'application/json'
			}
		})
		if (json.data) {
			localStorage.removeItem('ticker')
			localStorage.setItem('sticker', JSON.stringify(json))
		}
	} catch (e: any) {
		console.error(e)
	}
}
