import { getColumn, setColumn } from '../common/storage'
import $ from 'jquery'
import { mixMore, mixre, mixTl } from './mix'
import { tips, todc, todo } from '../ui/tips'
import { IColumnData, IColumnType, IColumnUTL } from '../../interfaces/Storage'
import api from '../common/fetch'
import { Conversation, Toot } from '../../interfaces/MastodonApiReturns'
import { escapeHTML, stripTags } from '../platform/first'
import { convertColumnToFilter, filterUpdate, getFilterTypeByAcct, remoteOnlyCk } from './filter'
import { additional } from './card'
import lang from '../common/lang'
import { toast } from '../common/declareM'
import Swal from 'sweetalert2'
import { announParse } from './announParse'
import { notf, notfColumn, notfMore } from './notification'
import timeUpdate from '../common/time'
import { isTagData } from './tag'
import { parse } from './parse'
import { say } from './speech'
import { goTop, scrollCk, scrollEvent } from '../ui/scroll'
import { parseColumn } from '../ui/layout'
import { parseRemain, parseRemainXmlHttpRequest } from '../common/apiRemain'

//TL取得
globalThis.moreLoading = false
globalThis.websocketOld = []
globalThis.mastodonBaseWs = []
let errorCt = 0
export const tlTypes = ['home', 'local', 'local-media', 'pub', 'pub-media', 'tag', 'list', 'notf', 'noauth', 'dm', 'mix', 'plus', 'webview', 'tootsearch', 'bookmark', 'utl', 'fav']
export const isColumnType = (item: string): item is IColumnType => tlTypes.includes(item)
export const isConv = (item: Toot | Conversation): item is Conversation => !!item['last_status']
export const isConvArr = (item: Toot[] | Conversation[]): item is Conversation[] => !!item[0]['last_status']
export async function tl(type: IColumnType, data: IColumnData | undefined, acctId: string, tlid: string | 'add', voice?: boolean) {
	scrollEvent()
	$(`#unread_${tlid} .material-icons`).removeClass('teal-text')
	localStorage.removeItem('pool')
	let domain = localStorage.getItem('domain_' + acctId) || acctId
	//タグとかの場合はカラム追加して描画
	if (tlid === 'add') {
		if (type === 'tag' && data) {
			data = {
				name: data.toString(),
				any: [],
				all: [],
				none: [],
			}
		}
		const add = {
			domain: parseInt(acctId, 10),
			type: type,
			data: data,
		}
		const obj = getColumn()
		localStorage.setItem(`card_${obj.length}`, 'true')
		obj.push(add)
		setColumn(obj)
		parseColumn('add')
		return
	}
	const now = localStorage.getItem('now') || 'local'
	if (!isColumnType(now)) return
	if (!type) type = now || 'local'
	if (type === 'mix') {
		//Integratedなら飛ばす
		$('#notice_' + tlid).text(`Integrated TL(${localStorage.getItem('user_' + acctId) || '?'}@${domain})`)
		$('#notice_icon_' + tlid).text('merge_type')
		mixTl(acctId, tlid, 'mix', voice)
		return
	} else if (type === 'plus') {
		//Local+なら飛ばす
		$('#notice_' + tlid).text(`Local+ TL(${localStorage.getItem('user_' + acctId) || '?'}@${domain})`)
		$('#notice_icon_' + tlid).text('people_outline')
		mixTl(acctId, tlid, 'plus', voice)
		return
	} else if (type === 'notf') {
		//通知なら飛ばす
		notf(acctId, tlid, 'direct')
		$('#notice_' + tlid).text(`${cap(type, data, acctId)}(${localStorage.getItem('user_' + acctId) || '?'}@${domain})`)
		$('#notice_icon_' + tlid).text('notifications')
		return
	} else if (type === 'bookmark') {
		//ブックマークなら飛ばす
		getBookmark(acctId, tlid)
		$('#notice_' + tlid).text(`${cap(type, data, acctId)}(${localStorage.getItem('user_' + acctId) || '?'}@${domain})`)
		$('#notice_icon_' + tlid).text('bookmark')
		return
	} else if (type === 'fav') {
		//お気に入りなら飛ばす
		getFav(acctId, tlid)
		$('#notice_' + tlid).text(`${cap(type, data, acctId)}(${localStorage.getItem('user_' + acctId)}@${domain})`)
		$('#notice_icon_' + tlid).text('star')
		return
	} else if (type === 'utl' && data) {
		//UTLなら飛ばす
		getUtl(acctId, tlid, data, false)
		$('#notice_' + tlid).text(`${cap(type, data, acctId)}(${localStorage.getItem('user_' + acctId) || '?'}@'${domain})`)
		$('#notice_icon_' + tlid).text('person')
		return
	} else if (type === 'home') {
		//ホームならお知らせ「も」取りに行く
		announ(acctId)
	}
	localStorage.setItem('now', type)
	todo(cap(type) + ' TL Loading...')
	const at = localStorage.getItem('acct_' + acctId + '_at')
	const hdr: any = {
		'content-type': 'application/json',
		Authorization: 'Bearer ' + at,
	}
	if (type !== 'noauth') {
		$('#notice_' + tlid).text(`${cap(type, data, acctId)}(${localStorage.getItem('user_' + acctId) || '?'}@${domain})`)
	} else {
		domain = data?.toString() || domain
		delete hdr.Authorization
		$('#notice_' + tlid).text(`Glance TL(${data})`)
	}
	$('#notice_icon_' + tlid).text(icon(type))
	let url = com(type, data, tlid)
	if (type === 'tag') {
		const tag = localStorage.getItem('tag-range')
		if (tag === 'local') {
			url = url + 'local=true'
		}
	}
	let start = `https://${domain}/api/v1/timelines/${url}`
	if (type === 'dm') start = `https://${domain}/api/v1/conversations`
	try {
		let json = await api<Toot[] | Conversation[]>(start, {
			method: 'get',
			headers: hdr,
		})
		if (isConvArr(json)) {
			json = json.map((j) => j.last_status as Toot)
		}
		if (!json) return true
		$('#landing_' + tlid).hide()
		const mute = getFilterTypeByAcct(acctId, convertColumnToFilter(type))
		const template = parse<string>(json, type, acctId, tlid, 0, mute)
		$('#timeline_' + tlid).html(template)
		additional(acctId, tlid)
		timeUpdate()
		todc()
		reload(type, acctId, tlid, data, mute, voice || false)
		if (type === 'home') {
			//Markers
			const markers = localStorage.getItem('markers') === 'yes'
			if (markers) getMarker(tlid, type, acctId)
		}
		$(window).scrollTop(0)
	} catch (e: any) {
		$('#landing_' + tlid).append(`<div>${stripTags(e)}</div>`)
	}
}

//Streaming接続
function reload(type: IColumnType, acctId: string, tlid: string, data: IColumnData | undefined, mute: string[], voice: boolean) {
	const domain = type !== 'noauth' ? localStorage.getItem(`domain_${acctId}`) || '' : ''
	localStorage.setItem('now', type)
	const mastodonBaseWsStatus = globalThis.mastodonBaseWsStatus
	if (!domain) {
		oldStreaming(type, acctId, tlid, data, mute, voice)
	} else if (mastodonBaseWsStatus[domain] === 'cannotuse') {
		oldStreaming(type, acctId, tlid, data, mute, voice)
	} else if (mastodonBaseWsStatus[domain] === 'undetected' || mastodonBaseWsStatus[domain] === 'connecting') {
		const mbws = setInterval(function () {
			if (mastodonBaseWsStatus[domain] === 'cannotuse') {
				oldStreaming(type, acctId, tlid, data, mute, voice)
				clearInterval(mbws)
			} else if (mastodonBaseWsStatus[domain] === 'available') {
				$('#notice_icon_' + tlid).removeClass('red-text')
				stremaingSubscribe(type, acctId, data)
				clearInterval(mbws)
			}
		}, 1000)
	} else if (mastodonBaseWsStatus[domain] === 'available') {
		$('#notice_icon_' + tlid).removeClass('red-text')
		stremaingSubscribe(type, acctId, data)
	}
}

function stremaingSubscribe(type: IColumnType, acctId: string, data?: IColumnData, unsubscribe?: boolean) {
	let command = 'subscribe'
	if (unsubscribe) command = 'unsubscribe'
	let stream
	const domain = localStorage.getItem(`domain_${acctId}`) || ''
	const targetStreaming = globalThis.mastodonBaseWs[domain]
	if (type === 'home') return false
	if (type === 'local' || type === 'mix') {
		stream = 'public:local'
	} else if (type === 'local-media') {
		stream = 'public:local:media'
	} else if (type === 'pub') {
		stream = 'public'
	} else if (type === 'pub-media') {
		stream = 'public:media'
	} else if (type === 'list') {
		targetStreaming.send(JSON.stringify({ type: command, stream: 'list', list: data }))
		return true
	} else if (type === 'tag') {
		if (!data || !isTagData(data)) return Swal.fire('Error migration to v24')
		let arr: any[] = []
		const name = data.name
		arr.push(name)
		if (data.any) arr = arr.concat(data.any)
		if (data.all) arr = arr.concat(data.all)
		for (const tag of arr) {
			targetStreaming.send(JSON.stringify({ type: command, stream: 'hashtag', tag: tag }))
		}
		return true
	}
	if (targetStreaming.readyState > 2) return console.error('already closed this streaming')
	targetStreaming.send(JSON.stringify({ type: command, stream: stream }))
}

function oldStreaming(type: IColumnType, acctId: string, tlid: string, data: IColumnData | undefined, mute: string[], voice: boolean, mode?: 'error') {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const strApi = localStorage.getItem('streaming_' + acctId) || ''
	const wss = strApi ? strApi.replace('https://', 'wss://') : `wss://${domain}`
	let start = `${wss}/api/v1/streaming/?stream=user&access_token=${at}`
	if (type === 'pub') {
		const add = remoteOnlyCk(tlid) ? `&remote=true` : ''
		start = `${wss}/api/v1/streaming/?stream=public&access_token=${at}${add}`
	} else if (type === 'pub-media') {
		const add = remoteOnlyCk(tlid) ? `&remote=true` : ''
		start = `${wss}/api/v1/streaming/?stream=public:media&access_token=${at}${add}`
	} else if (type === 'local') {
		start = `${wss}/api/v1/streaming/?stream=public:local&access_token=${at}`
	} else if (type === 'local-media') {
		start = `${wss}/api/v1/streaming/?stream=public:local:media&only_media=true&access_token=${at}`
	} else if (type === 'tag') {
		const tag = localStorage.getItem('tag-range')
		if (tag === 'local') data = data + '&local=true'
		if (!data || !isTagData(data)) return Swal.fire('Migtation Error to v24')
		if (data.name) data = data.name
		start = `${wss}/api/v1/streaming/?stream=hashtag&tag=${data}&access_token=${at}`
	} else if (type === 'noauth') {
		start = `wss://${data}/api/v1/streaming/?stream=public:local`
	} else if (type === 'list') {
		start = `${wss}/api/v1/streaming/?stream=list&list=${data}&accrss_token=${at}`
	} else if (type === 'dm') {
		start = wss + '/api/v1/streaming/?stream=direct&access_token=' + at
	}
	const websocket = globalThis.websocketOld
	const wsid = websocket.length
	localStorage.setItem('wss_' + tlid, wsid)
	websocket[wsid] = new WebSocket(start)
	websocket[wsid].onopen = function (mess) {
		errorCt = 0
		$('#notice_icon_' + tlid).removeClass('red-text')
	}
	websocket[wsid].onmessage = function (mess) {
		const typeA = JSON.parse(mess.data).event
		if (typeA === 'delete') {
			$(`[unique-id=${JSON.parse(mess.data).payload}]`).hide()
			$(`[unique-id=${JSON.parse(mess.data).payload}]`).remove()
		} else if (typeA === 'update' || typeA === 'conversation') {
			if (!$(`#unread_${tlid} .material-icons`).hasClass('teal-text')) {
				//markers show中はダメ
				const obj: Toot = JSON.parse(JSON.parse(mess.data).payload)
				if ($(`#timeline_${tlid} [toot-id=${obj.id}]`).length < 1) {
					if (voice) say(obj.content)
					const template = parse<string>([obj], type, acctId, tlid, 0, mute)
					if ($(`#timeline_box_${tlid}_box .tl-box`).scrollTop() === 0) {
						$('#timeline_' + tlid).prepend(template)
					} else {
						let pool = localStorage.getItem('pool_' + tlid) || ''
						if (pool) {
							pool = template + pool
						} else {
							pool = template
						}
						localStorage.setItem('pool_' + tlid, pool)
					}
					scrollCk()
					additional(acctId, tlid)
					timeUpdate()
				} else {
					todo('二重取得発生中')
				}

				todc()
			}
		} else if (typeA === 'filters_changed') {
			filterUpdate(acctId)
		} else if (~typeA.indexOf('announcement')) {
			announ(acctId)
		}
	}
	websocket[wsid].onerror = function (error) {
		console.error('Error closing')
		console.error(error)
		if (mode === 'error') {
			$('#notice_icon_' + tlid).addClass('red-text')
			todo('WebSocket Error ' + error)
		} else {
			errorCt++
			if (errorCt < 3) reconnector(tlid, type, acctId, data, 'error')
		}
		return false
	}
	websocket[wsid].onclose = function () {
		console.warn('Closing ' + tlid)
		if (mode === 'error') {
			$('#notice_icon_' + tlid).addClass('red-text')
			todo('WebSocket Closed')
		} else {
			errorCt++
			if (errorCt < 3) reconnector(tlid, type, acctId, data, 'error')
		}
		return false
	}
}
//一定のスクロールで発火
export async function moreLoad(tlid: string) {
	const obj = getColumn()
	const tlIdNum = parseInt(tlid, 10)
	const acctId = obj[tlIdNum].domain
	const type = obj[tlIdNum].type
	let data = obj[tlIdNum].data
	if (type === 'tag') {
		const tag = localStorage.getItem('tag-range')
		if (tag === 'local') {
			data = data + '&local=true'
		}
	} else if (type === 'list') {
		data = obj[tlIdNum].data
	}
	const sid = $(`#timeline_${tlid} .cvo`).last().attr('unique-id')
	if (sid && !globalThis.moreLoading) {
		if (type === 'mix') {
			mixMore(tlid, 'mix')
			return
		} else if (type === 'plus') {
			mixMore(tlid, 'plus')
			return
		} else if (type === 'notf') {
			notfMore(tlid)
			return
		} else if (type === 'bookmark') {
			getBookmark(acctId.toString(), tlid, true)
			return
		} else if (type === 'fav') {
			getFav(acctId.toString(), tlid, true)
			return
		} else if (type === 'utl') {
			const data = obj[tlid].data
			getUtl(acctId.toString(), tlid, data, true)
			return
		}
		globalThis.moreLoading = true
		localStorage.setItem('now', type)
		todo(cap(type) + ' TL MoreLoading')
		const domain = localStorage.getItem(`domain_${acctId}`) || acctId
		const at = localStorage.getItem(`acct_${acctId}_at`)
		const hdr: any = {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		}
		if (type === 'noauth') delete hdr.Authorization
		let start = `https://${domain}/api/v1/timelines/${com(type, data, tlid)}max_id=${sid}`
		if (type === 'dm') start = `https://${domain}/api/v1/conversations?max_id=${sid}`
		let json = await api<Toot[] | Conversation[]>(start, {
			method: 'get',
			headers: hdr,
		})
		const mute = getFilterTypeByAcct(acctId.toString(), convertColumnToFilter(type))
		if (isConvArr(json)) {
			json = json.map((j) => j.last_status as Toot)
		}
		const template = parse<string>(json, type, acctId.toString(), tlid, 0, mute)
		$('#timeline_' + tlid).append(template)
		additional(acctId.toString(), tlid)
		timeUpdate()
		globalThis.moreLoading = false
		todc()
	}
}
//TL差分取得
export async function tlDiff(type: IColumnType, data: IColumnData | undefined, acctId: string, tlid: string) {
	const obj = getColumn()
	const tlidNum = parseInt(tlid, 10)
	acctId = acctId || obj[tlidNum].domain.toString()
	if (type === 'tag') {
		const d = obj[tlidNum].data
		if (!d) return
		data = d
		const tag = localStorage.getItem('tag-range')
		if (tag === 'local') data = data + '&local=true'
	} else if (type === 'list') {
		const d = obj[tlidNum].data
		if (!d) return
		data = d
	}
	const sid = $(`#timeline_${tlid} .cvo`).first().attr('unique-id')
	if (sid && !globalThis.moreLoading) {
		if (type === 'mix') {
			return
		} else if (type === 'plus') {
			return
		} else if (type === 'notf') {
			return
		}
		globalThis.moreLoading = true
		localStorage.setItem('now', type)
		todo(cap(type) + ' TL MoreLoading')
		const domain = localStorage.getItem(`domain_${acctId}`) || acctId
		const at = localStorage.getItem(`acct_${acctId}_at`)
		const hdr: any = {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		}
		if (type === 'noauth') delete hdr.Authorization
		let start = `https://${domain}/api/v1/timelines/${com(type, data, tlid)}since_id=${sid}`
		if (type === 'dm') start = `https://${domain}/api/v1/conversations?since_id=${sid}`
		let json = await api<Toot[] | Conversation[]>(start, {
			method: 'get',
			headers: hdr,
		})
		const mute = getFilterTypeByAcct(acctId, convertColumnToFilter(type))
		if (isConvArr(json)) {
			json = json.map((j) => j.last_status as Toot)
		}
		const template = parse<string>(json, type, acctId, tlid, 0, mute)
		$('#timeline_' + tlid).prepend(template)
		additional(acctId, tlid)
		timeUpdate()
		globalThis.moreLoading = false
		todc()
	}
}
//WebSocket切断
export function tlCloser() {
	const websocket = globalThis.websocketOld || {}
	for (const tlid of Object.keys(websocket)) {
		if (globalThis.websocketOld[tlid]) {
			globalThis.websocketOld[tlid].close()
		}
		if (websocket[0]) {
			websocket[tlid].close()
		}
	}
	globalThis.websocketOld = []
	const baseStreaming = globalThis.mastodonBaseWs || {}
	for (const acctId of Object.keys(baseStreaming)) {
		if (globalThis.mastodonBaseWs[acctId]) {
			globalThis.mastodonBaseWs[acctId].close()
		}
	}
	globalThis.mastodonBaseWs = {}
	globalThis.mastodonBaseWsStatus = {}

	for (const wsHome of globalThis.wsHome) {
		if (wsHome) wsHome.close()
	}
	globalThis.wsHome = []
	for (const wsLocal of globalThis.wsLocal) {
		if (wsLocal) wsLocal.close()
	}
	globalThis.wsLocal = []
	for (const wsNotf of globalThis.websocketNotf) {
		if (wsNotf) wsNotf.close()
	}
}

//TLのタイトル
export function cap(type: IColumnType, data?: any, acctId?: string) {
	//独自ロケール
	const localeRaw = localStorage.getItem('locale')
	const locale = localeRaw !== 'yes'
	let response = 'Timeline'
	if (type === 'home') {
		if (localStorage.getItem('home_' + acctId) && !locale) {
			response = localStorage.getItem('home_' + acctId) || 'Home TL'
		} else {
			response = 'Home TL'
		}
	} else if (type === 'local') {
		if (localStorage.getItem('local_' + acctId) && !locale) {
			response = localStorage.getItem('local_' + acctId) || 'Local TL'
		} else {
			response = 'Local TL'
		}
	} else if (type === 'local-media') {
		if (localStorage.getItem('local_' + acctId) && !locale) {
			response = `${localStorage.getItem('local_' + acctId) || 'Local TL'}(${lang.lang_tl_media})`
		} else {
			response = 'Local TL(Media)'
		}
	} else if (type === 'pub') {
		if (localStorage.getItem('public_' + acctId) && !locale) {
			response = localStorage.getItem('public_' + acctId) || 'Federated TL'
		} else {
			response = 'Federated TL'
		}
	} else if (type === 'pub-media') {
		if (localStorage.getItem('public_' + acctId) && !locale) {
			response = `${localStorage.getItem('public_' + acctId) || 'Federated TL'}(${lang.lang_tl_media})`
		} else {
			response = 'Federated TL(Media)'
		}
	} else if (type === 'tag') {
		if (data) {
			if (data.name) {
				response = '#' + escapeHTML(data.name)
			} else {
				response = '#' + escapeHTML(data)
			}
		}
	} else if (type === 'list') {
		const ltitle = localStorage.getItem('list_' + data + '_' + acctId)
		response = `List(${ltitle})`
	} else if (type === 'notf') {
		if (localStorage.getItem('notification_' + acctId) && !locale) {
			response = localStorage.getItem('notification_' + acctId) || 'Notification TL'
		} else {
			response = 'Notification TL'
		}
	} else if (type === 'noauth') {
		response = 'Glance TL'
	} else if (type === 'dm') {
		response = 'DM'
	} else if (type === 'mix') {
		response = 'Integrated'
	} else if (type === 'plus') {
		response = 'Local+'
	} else if (type === 'webview') {
		response = 'Twitter'
	} else if (type === 'tootsearch') {
		response = 'tootsearch(' + escapeHTML(data) + ')'
	} else if (type === 'bookmark') {
		response = 'Bookmarks'
	} else if (type === 'fav') {
		response = 'Favourites'
	} else if (type === 'utl') {
		response = 'User TL(' + escapeHTML(data.acct) + ')'
	}
	return response
}

//TLのURL
export function com(type: IColumnType, data: IColumnData | undefined, tlid: string) {
	if (type === 'home') {
		return 'home?'
	} else if (type === 'local' || type === 'noauth') {
		return 'public?local=true&'
	} else if (type === 'local-media') {
		return 'public?local=true&only_media=true&'
	} else if (type === 'pub') {
		const add = remoteOnlyCk(tlid) ? 'remote=true&' : ''
		return 'public?' + add
	} else if (type === 'pub-media') {
		const add = remoteOnlyCk(tlid) ? 'remote=true&' : ''
		return 'public?only_media=true&' + add
	} else if (type === 'tag') {
		if (!data || !isTagData(data)) return
		const name = data.name
		const all = data.all
		const any = data.any
		const none = data.none
		return `tag/${name}?${buildQuery('all', all)}${buildQuery('any', any)}${buildQuery('none', none)}`
	} else if (type === 'list') {
		return `list/${data}?`
	} else if (type === 'dm') {
		return 'direct?'
	} else if (type === 'bookmark') {
		return 'bookmarks?'
	} else if (type === 'fav') {
		return 'favourites?'
	}
}

//TLのアイコン
export function icon(type: IColumnType) {
	if (type === 'home') {
		return 'home'
	} else if (type === 'local') {
		return 'people_outline'
	} else if (type === 'local-media') {
		return 'people_outline'
	} else if (type === 'pub') {
		return 'language'
	} else if (type === 'pub-media') {
		return 'language'
	} else if (type === 'tag') {
		return 'whatshot'
	} else if (type === 'list') {
		return 'view_headline'
	} else if (type === 'notf') {
		return 'notifications'
	} else if (type === 'noauth') {
		return 'people_outline'
	} else if (type === 'dm') {
		return 'mail_outline'
	} else if (type === 'mix') {
		return 'merge_type'
	} else if (type === 'plus') {
		return 'merge_type'
	} else if (type === 'webview') {
		return 'language'
	} else if (type === 'tootsearch') {
		return 'search'
	} else if (type === 'bookmark') {
		return 'bookmark'
	}
	return 'help'
}

export function reconnector(tlid: string, type: IColumnType, acctId: string, data?: IColumnData, mode?: 'error') {
	if (type === 'mix' || type === 'plus') {
		const voice = !!localStorage.getItem('voice_' + tlid)
		const mute = getFilterTypeByAcct(acctId, convertColumnToFilter(type))
		const wssh = parseInt(localStorage.getItem('wssH_' + tlid) || '0', 10)
		globalThis.wsHome[wssh].close()
		const wssl = parseInt(localStorage.getItem('wssL_' + tlid) || '0', 10)
		globalThis.wsLocal[wssl].close()
		mixre(acctId, tlid, type, mute, voice, mode)
	} else if (type === 'notf') {
		notfColumn(acctId, tlid)
	} else {
		const wss = localStorage.getItem('wss_' + tlid) || '0'
		globalThis.websocket[wss].close()
	}
	toast({ html: lang.lang_tl_reconnect, displayLength: 2000 })
}

export function columnReload(tlid: string, type: IColumnType) {
	$('#notice_icon_' + tlid).addClass('red-text')
	$(`#unread_${tlid} .material-icons`).removeClass('teal-text')
	const obj = getColumn()
	const acctId = obj[tlid].domain
	const domain = localStorage.getItem('domain_' + acctId) || ''
	if (globalThis.mastodonBaseWsStatus[domain] === 'available') {
		stremaingSubscribe(type, acctId, obj[tlid].data, true)
		parseColumn(tlid, true)
		return true
	}
	if (type === 'mix' || type === 'plus') {
		const wssh = parseInt(localStorage.getItem('wssH_' + tlid) || '0', 10)
		globalThis.wsHome[wssh].close()
		const wssl = parseInt(localStorage.getItem('wssL_' + tlid) || '0', 10)
		globalThis.wsLocal[wssl].close()
		parseColumn(tlid)
	} else if (type === 'notf') {
		$('#notice_icon_' + tlid).removeClass('red-text')
		notfColumn(acctId, tlid)
	} else if (type === 'bookmark') {
		$('#notice_icon_' + tlid).removeClass('red-text')
		getBookmark(acctId, tlid, false)
	} else if (type === 'fav') {
		$('#notice_icon_' + tlid).removeClass('red-text')
		getFav(acctId, tlid, false)
	} else {
		const wss = parseInt(localStorage.getItem('wss_' + tlid) || '0', 10)
		globalThis.websocket[wss].close()
		parseColumn(tlid, false)
	}
}
//Markers
export async function getMarker(tlid: string, type: IColumnType, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	let add = ''
	if (type === 'home') {
		add = 'home'
	} else if (type === 'notf') {
		add = 'notifications'
	}
	const start = `https://${domain}/api/v1/markers?timeline=${add}`
	let json = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (json) {
		if (json[add]) {
			json = json[add]
			$('#unread_' + tlid).attr('title', `${lang.lang_layout_unread}:${json.updated_at} v${json.version}`)
			$('#unread_' + tlid).attr('data-id', json.last_read_id)
		} else {
			$('#unread_' + tlid).attr('title', `${lang.lang_layout_unread}:${lang.lang_nothing}`)
			$('#unread_' + tlid).attr('data-id', '')
		}
	} else {
		$('#unread_' + tlid).attr('title', `${lang.lang_layout_unread}:${lang.lang_nothing}`)
		$('#unread_' + tlid).attr('data-id', '')
	}
}

export async function showUnread(tlidNum: number, type: IColumnType, acctId: string) {
	if ($(`#unread_${tlidNum} .material-icons`).hasClass('teal-text')) return goTop(tlidNum)
	const tlid = tlidNum.toString()
	$(`#unread_${tlid} .material-icons`).addClass('teal-text')
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const id = $('#unread_' + tlid).attr('data-id')
	let add = ''
	if (type === 'home') {
		add = 'timelines/home?min_id=' + id
	} else if (type === 'notf') {
		add = 'notifications?min_id=' + id
	}
	const start = `https://${domain}/api/v1/${add}`
	const json = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (!json || !json.length) columnReload(tlid, type)
	const mute = getFilterTypeByAcct(acctId, convertColumnToFilter(type))
	const template = parse<string>(json, type, acctId, tlid, 0, mute)
	const len = json.length - 1
	$('#timeline_' + tlid).html(template)
	if ($('#timeline_' + tlid + ' .cvo:eq(' + len + ')').length) {
		const to = $(`#timeline_${tlid} .cvo:eq(${len})`).offset()?.top || 0
		$('#timeline_box_' + tlid + '_box .tl-box').scrollTop(to)
	}
	additional(acctId, tlid)
	timeUpdate()
	todc()
}
globalThis.ueloadlock = false

export async function ueLoad(tlidStr: string) {
	const tlid = parseInt(tlidStr, 10)
	if (globalThis.ueloadlock) {
		return false
	}
	globalThis.ueloadlock = true
	const obj = getColumn()
	const acctId = obj[tlid].domain
	const type = obj[tlid].type
	const id = $(`#timeline_${tlidStr} .cvo:eq(0)`).attr('unique-id')
	let add = 'timelines/home?min_id=' + id
	if (type === 'notf') {
		add = 'notifications?min_id=' + id
	}
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/${add}`
	const json = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (!json) {
		columnReload(tlidStr, type)
	}
	const mute = getFilterTypeByAcct(acctId.toString(), convertColumnToFilter(type))
	const template = parse<string>(json, type, acctId.toString(), tlid.toString(), 0, mute)
	const len = json.length - 1
	$('#timeline_' + tlid).prepend(template)
	if ($(`#timeline_${tlid} .cvo:eq(${len})`).length) {
		const to = $(`#timeline_${tlid} .cvo:eq(${len})`).offset()?.top || 0
		$('#timeline_box_' + tlid + '_box .tl-box').scrollTop(to)
	}
	additional(acctId.toString(), tlidStr)
	timeUpdate()
	todc()
	globalThis.ueloadlock = false
}

export async function asRead(callback?: boolean) {
	//Markers
	const markersRaw = localStorage.getItem('markers')
	const markers = markersRaw === 'yes'
	if (markers) {
		const obj = getColumn()
		const obl = obj.length
		let ct = 0
		for (let i = 0; i < obl; i++) {
			const acctId = obj[i].domain
			const type = obj[i].type
			let poster: any
			if (type === 'home' || type === 'notf') {
				if (type === 'home') {
					const id = $('#timeline_' + i + ' .cvo:eq(0)').attr('unique-id')
					poster = {
						home: {
							last_read_id: id,
						},
					}
				} else {
					const id = $('#timeline_' + i + ' .cvo:eq(0)').attr('data-notf')
					poster = {
						notifications: {
							last_read_id: id,
						},
					}
				}
				const domain = localStorage.getItem(`domain_${acctId}`)
				const at = localStorage.getItem(`acct_${acctId}_at`)
				const start = `https://${domain}/api/v1/markers`
				const json = await api(start, {
					method: 'post',
					headers: {
						'content-type': 'application/json',
						Authorization: 'Bearer ' + at,
					},
					body: poster,
				})
				ct++
				if (ct === obl && callback) postMessage(['asReadComp', ''], '*')
			}
		}
	}
}

export function asReadEnd() {
	//Markers
	const markersRaw = localStorage.getItem('markers')
	const markers = markersRaw === 'yes'
	if (markers) {
		asRead(true)
		Swal.fire({
			title: lang.lang_tl_postmarkers_title,
			html: lang.lang_tl_postmarkers,
			showConfirmButton: false,
			showCloseButton: true,
			didOpen: () => {
				Swal.showLoading(null)
			},
			willClose: () => {
				return
			},
		})
	} else {
		postMessage(['asReadComp', ''], '*')
	}
}
//ブックマーク
function getBookmark(acctId: string, tlid: string, more?: boolean) {
	globalThis.moreLoading = true
	let ad = ''
	if (more) {
		const sid = $('#timeline_' + tlid + ' .notif-marker')
			.last()
			.attr('data-maxid')
		ad = '?max_id=' + sid
	}
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/bookmarks${ad}`
	const httpreq = new XMLHttpRequest()
	httpreq.open('GET', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
	httpreq.responseType = 'json'
	httpreq.send()
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === httpreq.DONE) {
			const json: Toot[] = httpreq.response
			const maxIds = httpreq.getResponseHeader('link')
			let maxId = 0
			if (maxIds) {
				const m = maxIds.match(/[?&]{1}max_id=([0-9]+)/)
				if (m) {
					maxId = parseInt(m[1], 10)
				}
			}
			let template = parse(json, 'bookmark', acctId, tlid, -1, [])
			template = `${template}<div class="hide notif-marker" data-maxid="${maxId}"></div>`
			if (more) {
				$('#timeline_' + tlid).append(template)
			} else {
				$('#timeline_' + tlid).html(template)
			}
			$('#landing_' + tlid).hide()
			timeUpdate()
			globalThis.moreLoading = false
			todc()
			parseRemainXmlHttpRequest(start,httpreq,'get')
			if ( localStorage.getItem('tips') === 'ver'){
				tips('refresh')
			}
		}
	}
}

//お気に入り
function getFav(acctId: string, tlid: string, more?: boolean) {
	globalThis.moreLoading = true
	let ad = ''
	if (more) {
		const sid = $('#timeline_' + tlid + ' .notif-marker')
			.last()
			.attr('data-maxid')
		ad = '?max_id=' + sid
	}
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/favourites${ad}`
	const httpreq = new XMLHttpRequest()
	httpreq.open('GET', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
	httpreq.responseType = 'json'
	httpreq.send()
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === httpreq.DONE) {
			const json: Toot[] = httpreq.response
			const maxIds = httpreq.getResponseHeader('link')
			let maxId = 0
			if (maxIds) {
				const m = maxIds.match(/[?&]{1}max_id=([0-9]+)/)
				if (m) {
					maxId = parseInt(m[1], 10)
				}
			}
			let template = parse(json, 'fav', acctId, tlid, -1, [])
			template = `${template}<div class="hide notif-marker" data-maxid="${maxId}"></div>`
			if (more) {
				$('#timeline_' + tlid).append(template)
			} else {
				$('#timeline_' + tlid).html(template)
			}
			$('#landing_' + tlid).hide()
			timeUpdate()
			globalThis.moreLoading = false
			todc()
			parseRemainXmlHttpRequest(start,httpreq,'get')
			if ( localStorage.getItem('tips') === 'ver'){
				tips('refresh')
			}
		}
	}
}

async function getUtl(acctId: string, tlid: string, data: IColumnData, more: boolean) {
	console.log(acctId, tlid, data, more)
	globalThis.moreLoading = true
	let ad = ''
	if (more) {
		const sid = $('#timeline_' + tlid + ' .cvo')
			.last()
			.attr('unique-id')
		ad = '?max_id=' + sid
	}
	const at = localStorage.getItem('acct_' + acctId + '_at')
	const domain = localStorage.getItem('domain_' + acctId)
	const isUtl = (item: IColumnData): item is IColumnUTL => typeof item !== 'string' && item['acct']
	if (!isUtl(data)) return Swal.fire('Migration Error')
	const start = `https://${domain}/api/v1/accounts/${data.id}/statuses${ad}`
	const json = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	const template = parse<string>(json, 'utl', acctId, tlid, -1, [])
	if (more) {
		$('#timeline_' + tlid).append(template)
	} else {
		$('#timeline_' + tlid).html(template)
	}
	$('#landing_' + tlid).hide()
	timeUpdate()
	globalThis.moreLoading = false
	todc()
}
//Announcement
export async function announ(acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/announcements`
	const json = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (json.length > 0) {
		$('.notf-announ_' + acctId).removeClass('hide')
		let ct = 0
		for (let i = 0; i < json.length; i++) {
			if (localStorage.getItem('announ_' + acctId) === json[i].id) {
				break
			}
			ct++
		}
		if (ct > 0) $(`.notf-announ_${acctId}_ct`).text(ct)
		localStorage.setItem(`announ_${acctId}`, json[0].id)
	} else {
		$('.notf-announ_' + acctId).addClass('hide')
	}
	const template = announParse(json, acctId) || ''
	$('.announce_' + acctId).html(template)
	timeUpdate()
	todc()
}
//buildQuery
function buildQuery(name: string, arr: string[]) {
	let str = ''
	for (let i = 0; i < arr.length; i++) {
		str = str + `${name}[]=${arr[i]}&`
	}
	return str
}
