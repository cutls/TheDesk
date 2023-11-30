import { escapeHTML } from '../platform/first'
import lang from './lang'
import { todo } from '../ui/tips'
import { toast } from './declareM'
import { getMulti } from './storage'
import api from './fetch'
import $ from 'jquery'

//バージョンチェッカー
export async function verck(ver: string) {
	if (globalThis.store) return false
	if (globalThis.pwa) return localStorage.setItem('ver', `PWA`)
	console.log('%c Welcome😊 ' + ver, 'color: red;font-size:200%;')
	$('body').addClass(localStorage.getItem('platform') || '')
	const date = new Date()
	if (localStorage.getItem('ver') !== ver && !localStorage.getItem('winstore')) {
		console.log('%c Thank you for your update🎉', 'color: red;font-size:200%;')
		localStorage.setItem('ver', ver)
	}
	let nextmonth: number
	if (!localStorage.getItem('showSupportMe')) {
		if (date.getMonth() === 11) {
			const yrs = date.getFullYear() + 1
			nextmonth = yrs * 100 + 1
		} else {
			const yrs = date.getFullYear()
			nextmonth = yrs * 100 + date.getMonth() + 2
		}
		localStorage.setItem('showSupportMe', nextmonth.toString())
	} else {
		const isSupportMe = date.getFullYear() * 100 + date.getMonth() + 1 >= parseInt(localStorage.getItem('showSupportMe') || '', 10)
		if (isSupportMe) {
			if (date.getMonth() === 11) {
				const yrs = date.getFullYear() + 1
				nextmonth = yrs * 100 + 1
			} else {
				const yrs = date.getFullYear()
				nextmonth = yrs * 100 + date.getMonth() + 2
			}
			localStorage.setItem('showSupportMe', nextmonth.toString())
			if (lang.language !== 'ja') {
				$('#support-btm-ja').addClass('hide')
				$('#support-btm-en').removeClass('hide')
			}
			$('#support-btm').removeClass('hide')
			$('#support-btm').animate(
				{
					bottom: '0',
				},
				{
					duration: 300,
				}
			)
		}
	}
	const platform = localStorage.getItem('platform')
	const winstore = localStorage.getItem('winstore') === 'brewcask' || localStorage.getItem('winstore') === 'snapcraft' || localStorage.getItem('winstore') === 'winstore'
	const l = 5
	// 生成する文字列に含める文字セット
	const c = 'abcdefghijklmnopqrstuvwxyz0123456789'
	const cl = c.length
	let r = ''
	for (let i = 0; i < l; i++) {
		r = r + c[Math.floor(Math.random() * cl)]
	}
	const start1 = 'https://thedesk.top/ver.v2.json'
	const mess = await api(start1, { method: 'get' })
	if (!mess) return
	const newest = mess.version
	if (newest === ver) {
		todo(lang.lang_version_usever.replace('{{ver}}', newest))
		//betaかWinstoreならアプデチェックしない
	} else if (ver.indexOf('beta') === -1 && !winstore && !globalThis.isDev) {
		localStorage.removeItem('instance')
		if (localStorage.getItem('new-ver-skip')) {
			if (localStorage.getItem('next-ver') !== newest) {
				postMessage(['sendSinmpleIpc', 'update'], '*')
			} else {
				console.warn(lang.lang_version_skipver)
				todo(lang.lang_version_skipver)
			}
		} else {
			postMessage(['sendSinmpleIpc', 'update'], '*')
		}
	}
	if (!localStorage.getItem('last-notice-id')) localStorage.setItem('last-notice-id', `0`)
}
let infoStreaming = false
function infoWebSocket() {
	const infoWs = new WebSocket('wss://thedesk.top/ws/')
	infoWs.onopen = function (mess) {
		infoStreaming = true
	}
	infoWs.onmessage = function (mess) {
		const obj = JSON.parse(mess.data)

		if (obj.type === 'counter') return $('#persons').text(obj.text)
		if (obj.type !== 'textv2') return
		if (~obj.languages.indexOf(lang.language)) {
			const toot = obj.toot ? `<button class="btn-flat toast-action" onclick="detEx('${obj.toot}', 'main')">Show</button>` : ''
			let showVer = obj.ver ? obj.ver === globalThis.ver : true
			if (obj.domain !== '') {
				const accts = getMulti() || '[]'
				showVer = false
				for (const acct of accts) {
					if (showVer) break
					showVer = acct.domain === obj.domain
				}
			}
			if (showVer) {
				toast({
					html: `${escapeHTML(obj.text)}${toot}<span class="sml grey-text">(スライドして消去)</span>`,
					displayLength: 86400,
				})
			}
		}
	}
	infoWs.onerror = function (error) {
		infoStreaming = false
		console.error('Error closing:info')
		console.error(error)
		return false
	}
	infoWs.onclose = function () {
		infoStreaming = false
	}
}
/*
setInterval(function () {
	if (!infoStreaming) {
		infoWebSocket()
	}
}, 10000)
*/
export function closeStart() {
	$('#start').css('display', 'none')
}
export function closeSupport() {
	$('#support-btm').addClass('hide')
}