import { initPlugin } from './plugin'
import $ from 'jquery'
import { v4 as uuid } from 'uuid'
import GraphemeSplitter from 'grapheme-splitter'
import { ck } from '../login/login'
import { autoCompleteInitTrigger, loadAcctList } from '../login/manager'
import { connection } from './end'
import twemoji from 'twemoji'
import { tl } from '../tl/tl'
import { Account, Card, Emoji, Poll, Toot } from '../../interfaces/MastodonApiReturns'
import { IVis, loadVis } from '../post/secure'
import { initPostbox } from '../ui/postBox'
import { modalDropdownInit } from '../common/modal'
import { initKeyboard } from '../common/keyshortcut'
import { altImage, imgPasteInit } from '../post/img'
import { suggestInit } from '../post/suggest'
import { voiceSettingLoad } from '../tl/speech'
import { configLoad, climute, ctLoad, oksload, pluginLoad, wordemp, wordmute } from '../ui/settings'
import { checkSpotify } from '../ui/spotify'
import { migrate } from './migrate'
// Migrator: tagのnameだけから、any/none等対応の形にするのと、any, noneがstringになってるのをarrayにする
// 独自ロケールを削除
// wordmuteListにtagとかいう要素がある
// noauth TLのtype
// Glance TLのデータ構造変更, ポップアップ通知の削除、コンテクストツールデフォルトオン

// ニコフレ絵文字とアイマストドントレンド、独自ロケール、Misskeyサポートの削除、Tootsearch削除、MD/BBCode削除、altImage interval, nano廃止
window.onload = init
async function init() {
	if (globalThis.pwa && localStorage.getItem('v24Accepted') === 'true') localStorage.removeItem('v24Accepted')
	if (!globalThis.pwa && localStorage.getItem('v24Accepted') === 'true') await migrate(true)
	if (globalThis.pwa) $('.hideOnlyPwa').removeClass('hide')
	if (!localStorage.getItem('v24Accepted') && !localStorage.getItem('ver')) localStorage.setItem('v24Accepted', 'true')
	if (!localStorage.getItem('v24Accepted') && localStorage.getItem('ver')) return $('#v24Note').removeClass('hide')
	if (globalThis.useLang === 'ja' || globalThis.useLang === 'ja-KS') $('.onlyJa').removeClass('hide')
	initPostbox()
	connection()
	initPlugin()
	modalDropdownInit()
	if (localStorage.getItem('control-center-np')) $('#ccnp').removeClass('hide')
	const onManager = document.getElementById('acct-list')
	const onHome = document.getElementById('textarea')
	if (onHome) ck()
	if (onHome) initKeyboard()
	if (onManager) loadAcctList()
	autoCompleteInitTrigger()
	if (onHome) imgPasteInit()
	if (onHome) loadVis()
	if (onHome) suggestInit()
	//タグ表示
	if (location.search) {
		const m = location.search.match(/\?mode=([a-zA-Z-0-9]+)&code=(.+)/)
		if (m) {
			const mode = m[1]
			const codex = m[2]
			if (mode === 'tag') {
				const acctId = localStorage.getItem('main') || '0'
				tl('tag', decodeURI(codex), acctId, 'add')
			}
		}
	}
	if (onHome) {
		setInterval(() => {
			$('#preview .unknown').each(function (i, elem) {
				altImage($(elem).attr('data-acct') || '', $(elem).attr('data-media') || '')
			})
		}, 2000)
	}
	const onSetting = !!document.getElementById('envView')
	if (!onSetting) return
	//最初に読む
	configLoad()
	climute()
	wordmute()
	wordemp()
	checkSpotify()
	voiceSettingLoad()
	oksload()
	ctLoad()
	pluginLoad()
	$('body').addClass(localStorage.getItem('platform') || 'win')
}

const size = localStorage.getItem('size')
if (size) $('html,body').css('font-size', `${size}px`)
const clickActionValue = localStorage.getItem('mouseover')
const clickAction = clickActionValue === 'yes' || clickActionValue === 'click'
if (clickAction) $('body').addClass('mouseover')
export const stripTags = function (str: string, allowed?: string) {
	if (!str) {
		return ''
	}
	allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('')
	const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>?/gi,
		commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi
	return str.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
		if (!allowed) return ''
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''
	})
}

export function escapeHTML(str: string) {
	if (!str) {
		return ''
	}
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;')
}
//PHPのnl2brと同様
export function nl2br(str: string) {
	if (!str) {
		return ''
	}
	str = str.replace(/\r\n/g, '<br />')
	str = str.replace(/(\n|\r)/g, '<br />')
	return str
}

export function br2nl(str: string) {
	if (!str) {
		return ''
	}
	str = str.replace(/<br \/>/g, '\r\n')
	return str
}

export function formatTime(date: Date) {
	let str = date.getFullYear() + '-'
	if (date.getMonth() + 1 < 10) {
		str = str + '0' + (date.getMonth() + 1) + '-'
	} else {
		str = str + (date.getMonth() + 1) + '-'
	}
	if (date.getDate() < 10) {
		str = str + '0' + date.getDate()
	} else {
		str = str + date.getDate()
	}
	str = str + 'T'
	if (date.getHours() < 10) {
		str = str + '0' + date.getHours() + ':'
	} else {
		str = str + date.getHours() + ':'
	}
	if (date.getMinutes() < 10) {
		str = str + '0' + date.getMinutes()
	} else {
		str = str + date.getMinutes()
	}
	return escapeHTML(str)
}

export function formatTimeUtc(date: Date) {
	let str = date.getUTCFullYear() + '-'
	if (date.getUTCMonth() + 1 < 10) {
		str = str + '0' + (date.getUTCMonth() + 1) + '-'
	} else {
		str = str + (date.getUTCMonth() + 1) + '-'
	}
	if (date.getUTCDate() < 10) {
		str = str + '0' + date.getUTCDate()
	} else {
		str = str + date.getUTCDate()
	}
	str = str + 'T'
	if (date.getUTCHours() < 10) {
		str = str + '0' + date.getUTCHours() + ':'
	} else {
		str = str + date.getUTCHours() + ':'
	}
	if (date.getUTCMinutes() < 10) {
		str = str + '0' + date.getUTCMinutes()
	} else {
		str = str + date.getUTCMinutes()
	}
	return escapeHTML(str)
}
postMessage(['sendSinmpleIpc', 'custom-css-request'], '*')

export function makeCID() {
	return uuid()
}

export function rgbToHex(color: string) {
	// HEXに変換したものを代入する変数
	let hex = ''

	// 第1引数がHEXのとき変換処理は必要ないのでそのままreturn
	// IE8の場合はjQueryのcss()関数でHEXを返すので除外
	if (color.match(/^#[a-f\d]{3}$|^#[a-f\d]{6}$/i)) {
		return color
	}

	// 正規表現
	const regex = color.match(/^rgb\(([0-9.]+),\s*([0-9.]+),\s*([0-9.]+)\)$/)

	// 正規表現でマッチしたとき
	if (regex) {
		const rgb = [
			// RGBからHEXへ変換
			parseInt(regex[1], 10).toString(16),
			parseInt(regex[2], 10).toString(16),
			parseInt(regex[3], 10).toString(16),
		]

		for (let i = 0; i < rgb.length; ++i) {
			// rgb(1,1,1)のようなときHEXに変換すると1桁になる
			// 1桁のときは前に0を足す
			if (rgb[i].length === 1) {
				rgb[i] = '0' + rgb[i]
			}
			hex += rgb[i]
		}

		return hex
	}

	console.error(color + ':第1引数はRGB形式で入力')
}
/*マルチバイト用切り出し*/
export const strlenMultibyte = function (str: string) {
	const splitter = new GraphemeSplitter()
	const arr = splitter.splitGraphemes(str)
	return arr.length
}
export const substrMultibyte = function (str: string, begin: number, end: number) {
	//配列にする
	const splitter = new GraphemeSplitter()
	const arr = splitter.splitGraphemes(str)
	const newarr: string[] = []
	for (let i = 0; i < arr.length; i++) {
		if (i >= begin && i <= end) {
			newarr.push(arr[i])
		}
	}
	return newarr.join('')
}
export function setLog(txt1: string, txt2: number | string, txt3: string) {
	//url,statuscode,responsetext
	let text = new Date().toUTCString()
	text = text + ',' + txt1 + ',' + txt2 + ',' + escapeCsv(txt3)
	console.error(text)
	postMessage(['log', text], '*')
}

export function escapeCsv(str: string) {
	if (!str) return str
	let result: string
	result = str.toString().replace(/"/g, '""')
	if (result.indexOf(',') >= 0) {
		result = '"' + result + '"'
	}
	return result
}

export function statusModel(nowRaw?: string) {
	const now = nowRaw || new Date().toString()
	return {
		id: '',
		created_at: now,
		in_reply_to_id: null,
		in_reply_to_account_id: null,
		sensitive: false,
		spoiler_text: '',
		visibility: 'public' as IVis,
		language: 'en',
		uri: '',
		url: '',
		replies_count: 0,
		reblogs_count: 0,
		favourites_count: 0,
		favourited: false,
		reblogged: false,
		muted: false,
		bookmarked: false,
		pinned: false,
		content: '<p><i>No status here</i></p>',
		reblog: null,
		application: {
			name: null,
			website: null,
		},
		account: {
			id: '',
			username: '',
			acct: '',
			display_name: '',
			locked: false,
			bot: false,
			created_at: now,
			note: '',
			url: '',
			avatar: '',
			avatar_static: '',
			header: '',
			header_static: '',
			followers_count: 0,
			following_count: 0,
			statuses_count: 0,
			last_status_at: now,
			emojis: [] as Emoji[],
			fields: [] as Account['fileds'],
		},
		media_attachments: [] as Toot['media_attachments'],
		mentions: [] as Toot['mentions'],
		tags: [] as Toot['tags'],
		card: null as Card | null,
		poll: undefined as Poll | undefined,
		emojis: [] as Emoji[],
	} as Toot
}

function webviewFinder() {
	const webview: any = document.querySelector('webview')
	webview.addEventListener('did-navigate', () => {
		const url = webview.getURL()
		// 今はログインにiframe禁止措置がなされていないので
		if (url.match('https://mobile.twitter.com/login')) {
			//postMessage(['twitterLogin', null], '*')
		} else if (url.match('https://mobile.twitter.com/logout')) {
			//postMessage(['twitterLogin', true], '*')
		}
	})
}

export function initWebviewEvent() {
	if (document.querySelector('webview')) {
		webviewFinder()
	} else {
		const timerWV = setInterval(function () {
			document.querySelector('webview') ? (webviewFinder(), clearInterval(timerWV)) : console.log('まだロード中')
		}, 500)
	}
}
export function twemojiParse<T extends string | HTMLElement>(target: T): T {
	return twemoji.parse(target, { base: `../../${globalThis.pwa ? 'dependencies' : 'node_modules'}/twemoji-asset/assets/` })
}
