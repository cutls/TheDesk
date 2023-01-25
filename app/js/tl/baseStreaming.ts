import { Notification, Toot } from '../../interfaces/MastodonApiReturns'
import { IColumnType } from '../../interfaces/Storage'
import { getColumn } from '../common/storage'
import timeUpdate from '../common/time'
import { statusModel } from '../platform/first'
import { parseColumn } from '../ui/layout'
import { scrollCk } from '../ui/scroll'
import { additional } from './card'
import { convertColumnToFilter, filterUpdate, getFilterTypeByAcct } from './filter'
import { notfCommon } from './notification'
import { parse } from './parse'
import { say } from './speech'
import { isTagData } from './tag'
import { announ } from './tl'
import { userParse } from './userParse'
import $ from 'jquery'
import Swal from 'sweetalert2'

//MastodonBaseStreaming
globalThis.mastodonBaseWs = {}
globalThis.mastodonBaseWsStatus = {}
type IWSStatus = 'undetected' | 'connecting' | 'available' | 'cannotuse'
interface TLMeta {
	id: number
	voice: boolean
	type: IColumnType
	acctId: number
}
export function mastodonBaseStreaming(acctId: string) {
	console.log('start to connect mastodonBaseStreaming of ' + acctId)
	notfCommon(acctId, '0', false)
	const domain = localStorage.getItem(`domain_${acctId}`) || ''
	const mastodonBaseWsStatus: { [key: string]: IWSStatus } = globalThis.mastodonBaseWsStatus
	const mastodonBaseWs: { [key: string]: WebSocket | null } = globalThis.mastodonBaseWs
	if (mastodonBaseWsStatus[domain]) return
	mastodonBaseWsStatus[domain] = 'undetected'
	const at = localStorage.getItem(`acct_${acctId}_at`)
	let wss = 'wss://' + domain
	if (localStorage.getItem('streaming_' + acctId)) {
		wss = localStorage.getItem('streaming_' + acctId)?.replace('https://', 'wss://') || wss
	}
	const start = `${wss}/api/v1/streaming/?access_token=${at}`
	mastodonBaseWs[domain] = new WebSocket(start)
	const ws = mastodonBaseWs[domain]
	if (!ws) return
	ws.onopen = function () {
		mastodonBaseWsStatus[domain] = 'connecting'
		setTimeout(function () {
			mastodonBaseWsStatus[domain] = 'available'
		}, 3000)
		ws.send(JSON.stringify({ type: 'subscribe', stream: 'user' }))
		$(`.notice_icon_acct_${acctId}`).removeClass('red-text')
	}
	ws.onmessage = function (mess) {
		$(`div[data-acct=${acctId}] .landing`).hide()
		const typeA = JSON.parse(mess.data).event
		if (typeA === 'delete') {
			$(`[unique-id=${JSON.parse(mess.data).payload}]`).hide()
			$(`[unique-id=${JSON.parse(mess.data).payload}]`).remove()
		} else if (typeA === 'update' || typeA === 'conversation') {
			//markers show中はダメ
			const tl = JSON.parse(mess.data).stream
			const obj: Toot = JSON.parse(JSON.parse(mess.data).payload)
			const tls = getTlMeta(tl[0], tl, acctId, obj)
			insertTl(obj, tls)
		} else if (typeA === 'filters_changed') {
			filterUpdate(acctId)
		} else if (~typeA.indexOf('announcement')) {
			announ(acctId)
		} else if (typeA === 'status.update') {
			const tl = JSON.parse(mess.data).stream
			const obj: Toot = JSON.parse(JSON.parse(mess.data).payload)
			const tls = getTlMeta(tl[0], tl, acctId, obj)
			const template = insertTl(obj, tls, true)
			if (!template) return
			$(`[unique-id=${obj.id}]`).html(template)
			$(`[unique-id=${obj.id}] [unique-id=${obj.id}]`).unwrap()
		} else if (typeA === 'notification') {
			const obj: Notification = JSON.parse(JSON.parse(mess.data).payload)
			let template = ''
			localStorage.setItem('lastnotf_' + acctId, obj.id)
			const popup = parseInt(localStorage.getItem('popup') || '0', 10)
			const { type } = obj
			const mute = getFilterTypeByAcct(acctId, 'notf')
			const nEvent = {
				event: type,
				eventBy: obj.account,
				id: obj.id,
				createdAt: obj.created_at,
				fromStreaming: true
			}
			if (type === 'mention') $(`.notf-reply_${acctId}`).removeClass('hide')
			if (type === 'favourite') $(`.notf-fav_${acctId}`).removeClass('hide')
			if (type === 'reblog') $(`.notf-bt_${acctId}`).removeClass('hide')
			$('.notf-icon_' + acctId).addClass('red-text')
			if (type === 'mention' || type === 'status' || type === 'reblog' || type === 'favourite' || type === 'poll' || type === 'update') {
				const status = obj.status || statusModel()
				template = parse([status], 'notf', acctId, 'notf', popup, mute, nEvent)
			} else if (type === 'follow_request' || type === 'follow' || type === 'moved' || type === 'admin.sign_up') {
				template = userParse([obj.account], acctId, type, 'notf', -1)
			} else {
				template = obj.status ? parse([obj.status], 'notf', acctId, 'notf', popup, mute, nEvent) : userParse([obj.account], acctId, type, 'notf', -1)
			}
			if (!$('div[data-notfIndv=' + acctId + '_' + obj.id + ']').length) {
				$('div[data-notf=' + acctId + ']').prepend(template)
				$('div[data-const=notf_' + acctId + ']').prepend(template)
			}
		} else {
			console.error('unknown type ' + typeA)
		}
		timeUpdate()
	}
	ws.onerror = function (error) {
		notfCommon(acctId, '0', true) //fallback
		console.error('Error closing ' + domain)
		console.error(error)
		if (mastodonBaseWsStatus[domain] === 'available') parseColumn()
		mastodonBaseWsStatus[domain] = 'cannotuse'
		setTimeout(function () {
			mastodonBaseWsStatus[domain] = 'cannotuse'
		}, 3000)
		mastodonBaseWs[domain] = null
		return false
	}
	ws.onclose = function () {
		notfCommon(acctId, '0', true) //fallback
		console.warn('Closing base streaming of ' + domain)
		if (mastodonBaseWsStatus[domain] === 'available') {
			/*toast({
				html:
					`${lang.lang_parse_disconnected}<button class="btn-flat toast-action" onclick="location.reload()">${lang.lang_layout_reconnect}</button>`,
				completeCallback: function () {
					parseColumn()

				},
				displayLength: 3000
			})*/
			mastodonBaseWsStatus[domain] = 'undetected'
			parseColumn()
		} else {
			mastodonBaseWs[domain] = null
			mastodonBaseWsStatus[domain] = 'cannotuse'
			setTimeout(function () {
				mastodonBaseWsStatus[domain] = 'cannotuse'
			}, 3000)

		}
		return false
	}
}
function insertTl(obj: Toot, tls: TLMeta[], dry?: boolean) {
	for (const timeline of tls) {
		const { id, voice, type, acctId } = timeline
		const mute = getFilterTypeByAcct(acctId.toString(), convertColumnToFilter(type))
		if ($(`#unread_${id} .material-icons`).hasClass('teal-text')) continue
		if (!$(`#timeline_${id} [toot-id=${obj.id}]`).length) {
			if (voice) say(obj.content)
			const templateRaw = parse([obj], type, acctId.toString(), id.toString(), 0, mute)
			const template = typeof templateRaw === 'string' ? templateRaw : templateRaw[0]
			if (dry) return template
			if ($(`#timeline_box_${id}_box .tl-box`).scrollTop() === 0) {
				$(`#timeline_${id}`).prepend(template)
			} else {
				let pool = localStorage.getItem('pool_' + id) || ''
				if (pool) {
					if (pool.match(`unique-id="${obj.id}"`)) continue
					pool = template + pool
				} else {
					pool = template
				}
				localStorage.setItem('pool_' + id, pool || '')
			}
			scrollCk()
			additional(acctId.toString(), id.toString())
			timeUpdate()
		} else if (dry) {
			//For status update
			const templateRaw = parse([obj], type, acctId.toString(), id.toString(), 0, mute)
			const template = typeof templateRaw === 'string' ? templateRaw : templateRaw[0]
			return template
		}
	}
}
function getTlMeta(type, data, num: string, status) {
	const acctId = parseInt(num, 10)
	const obj = getColumn()
	const ret: TLMeta[] = []
	let i = -1
	switch (type) {
		case 'user':
			for (const tl of obj) {
				i++
				if (tl.domain !== acctId) continue
				if (tl.type === 'mix' || tl.type === 'home') {
					let voice = false
					if (localStorage.getItem('voice_' + i)) voice = true
					ret.push({
						id: i,
						voice: voice,
						type: tl.type,
						acctId: tl.domain,
					})
				}
			}
			break
		case 'public:local':
			for (const tl of obj) {
				i++
				if (tl.domain !== acctId) continue
				if (tl.type === 'mix' || tl.type === 'local') {
					let voice = false
					if (localStorage.getItem('voice_' + i)) voice = true
					ret.push({
						id: i,
						voice: voice,
						type: tl.type,
						acctId: tl.domain,
					})
				}
			}
			break
		case 'public:local:media':
			for (const tl of obj) {
				i++
				if (tl.domain !== acctId) continue
				if (tl.type === 'local-media') {
					let voice = false
					if (localStorage.getItem('voice_' + i)) voice = true
					ret.push({
						id: i,
						voice: voice,
						type: tl.type,
						acctId: tl.domain,
					})
				}
			}
			break
		case 'public':
			for (const tl of obj) {
				i++
				if (tl.domain !== acctId) continue
				if (tl.type === 'pub') {
					let voice = false
					if (localStorage.getItem('voice_' + i)) voice = true
					ret.push({
						id: i,
						voice: voice,
						type: tl.type,
						acctId: tl.domain,
					})
				}
			}
			break
		case 'public:media':
			for (const tl of obj) {
				i++
				if (tl.domain !== acctId) continue
				if (tl.type === 'pub-media') {
					let voice = false
					if (localStorage.getItem('voice_' + i)) voice = true
					ret.push({
						id: i,
						voice: voice,
						type: tl.type,
						acctId: tl.domain,
					})
				}
			}
			break
		case 'list':
			for (const tl of obj) {
				i++
				if (tl.domain !== acctId) continue
				if (tl.type === 'list' && tl.data === data[1]) {
					let voice = false
					if (localStorage.getItem('voice_' + i)) voice = true
					ret.push({
						id: i,
						voice: voice,
						type: tl.type,
						acctId: tl.domain,
					})
				}
			}
			break
		case 'direct':
			for (const tl of obj) {
				i++
				if (tl.domain !== acctId) continue
				if (tl.type === 'dm') {
					let voice = false
					if (localStorage.getItem('voice_' + i)) voice = true
					ret.push({
						id: i,
						voice: voice,
						type: tl.type,
						acctId: tl.domain,
					})
				}
			}
			break
		case 'hashtag':
			for (const tl of obj) {
				i++
				if (tl.domain !== acctId) continue
				const columnDataRaw = tl.data
				if (!columnDataRaw || !isTagData(columnDataRaw)) continue
				const columnData = columnDataRaw
				if (tl.type === 'tag') {
					let voice = false
					let can = false
					if (columnData.name === data[1]) can = true
					//any
					if (columnData.any.includes(data[1])) can = true
					//all
					const { tags } = status
					if (columnData.all) can = true
					for (const { name } of tags) {
						if (!columnData.all.includes(name)) {
							can = false
							break
						}
					}
					//none
					if (columnData.none) can = true
					for (const { name } of tags) {
						if (columnData.none.includes(name)) {
							can = false
							break
						}
					}
					const t = !!can
					if (localStorage.getItem('voice_' + i)) voice = t
					ret.push({
						id: i,
						voice: voice,
						type: tl.type,
						acctId: tl.domain,
					})
				}
			}
			break
		default:
			console.error('Cannot catch')
	}
	return ret
}
