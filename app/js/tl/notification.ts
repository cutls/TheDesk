//通知
//取得+Streaming接続
import $ from 'jquery'
import { Notification } from '../../interfaces/MastodonApiReturns'
import api from '../common/fetch'
import lang from '../common/lang'
import { getColumn, getMulti } from '../common/storage'
import timeUpdate from '../common/time'
import { escapeHTML, setLog, statusModel } from '../platform/first'
import { tips, todc, todo } from '../ui/tips'
import { getFilterTypeByAcct } from './filter'
import { parse } from './parse'
import { getMarker } from './tl'
import { userParse } from './userParse'
import { parseRemainXmlHttpRequest } from '../common/apiRemain'

export function notf(acctId: string, tlid: string, sys?: 'direct') {
	if (sys === 'direct') {
		notfColumn(acctId, tlid)
	} else {
		notfCommon(acctId, tlid, false)
	}
}

export async function notfColumn(acctId: string, tlid: string) {
	todo('Notifications Loading...')
	const native = localStorage.getItem('nativenotf') || 'yes'
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	let exc = ''
	if (localStorage.getItem('exclude-' + tlid)) exc = localStorage.getItem('exclude-' + tlid) || ''
	if (exc === 'null') exc = ''
	const start = `https://${domain}/api/v1/notifications${exc}`
	const httpreq = new XMLHttpRequest()
	httpreq.open('GET', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
	httpreq.responseType = 'json'
	httpreq.send()
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === httpreq.DONE) {
			const json: Notification[] = httpreq.response
			if (this.status !== 200) {
				$('#landing_' + tlid).append(`<div>${this.status}</div><div>${escapeHTML(this.response)}`)
				setLog(start, this.status, this.response)
			}
			let maxId = httpreq.getResponseHeader('link') || ''
			const m = maxId.match(/[?&]{1}max_id=([0-9]+)/)
			if (m) {
				maxId = m[1]
			}
			if (json[0]) {
				let template = ''
				const lastnotf = localStorage.getItem('lastnotf_' + acctId)
				localStorage.setItem('lastnotf_' + acctId, json[0].id)
				let key = 0
				for (const obj of json) {
					if (lastnotf === obj.id && key > 0 && native === 'yes') {
						let ct = key.toString()
						if (key > 14) {
							ct = '15+'
						}
						const options = {
							body: ct + lang.lang_notf_new,
							icon: localStorage.getItem('prof_' + acctId) || undefined,
						}
						new Notification('TheDesk:' + domain, options)
					}
					const mute = getFilterTypeByAcct(acctId, 'notf')
					const popup = parseInt(localStorage.getItem('popup') || '0', 10)
					const { type } = obj
					const nEvent = {
						event: type,
						eventBy: obj.account,
						id: obj.id,
						createdAt: obj.created_at,
						fromStreaming: false
					}
					if (type === 'mention' || type === 'status' || type === 'reblog' || type === 'favourite' || type === 'poll' || type === 'update') {
						const status = obj.status || statusModel()
						template = template + parse([status], 'notf', acctId, 'notf', popup, mute, nEvent)
					} else if (type === 'follow_request' || type === 'follow' || type === 'moved' || type === 'admin.sign_up') {
						template = template + userParse([obj.account], acctId, type, 'notf', -1)
					} else {
						const status = obj.status
						template = status ? template + parse([status], 'notf', acctId, 'notf', popup) : template + userParse([obj.account], acctId, type, 'notf', -1)
					}
					key++
				}
				template = template + `<div class="hide notif-marker" data-maxid="${maxId}"></div>`
				$('#timeline_' + tlid).html(template)
				// $('#landing_' + tlid).hide()
				timeUpdate()
			}
			$('#notf-box').addClass('fetched')
			todc()
			//Markers
			const markers = localStorage.getItem('markers') === 'yes'
			if (markers) getMarker(tlid, 'notf', acctId)
			parseRemainXmlHttpRequest(start,httpreq, 'get')
			if ( localStorage.getItem('tips') === 'ver'){
				tips('refresh')
			}
		}
	}
}

export async function notfCommon(acctId: string, tlid: string, isStreamOnly: boolean) {
	todo('Notifications Loading...')
	const native = localStorage.getItem('nativenotf') || 'yes'
	const domain = localStorage.getItem(`domain_${acctId}`) || ''
	const at = localStorage.getItem(`acct_${acctId}_at`) || ''
	const start = `https://${domain}/api/v1/notifications`
	if (isStreamOnly) {
		notfWS(acctId, tlid, domain, at)
		return false
	}
	try {
		const json = await api(start, {
			method: 'get',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at,
			},
		})
		if (json[0]) {
			let template = ''
			const lastnotf = localStorage.getItem('lastnotf_' + acctId)
			localStorage.setItem('lastnotf_' + acctId, json[0].id)
			let key = 0
			for (const obj of json) {
				if (lastnotf === obj.id && key > 0 && native === 'yes') {
					let ct = key.toString()
					if (key > 14) ct = '15+'
					const options = {
						body: ct + lang.lang_notf_new,
						icon: localStorage.getItem('prof_' + acctId) || undefined,
					}
					new Notification('TheDesk:' + domain, options)
				}
				//Pleromaにはmoveというtypeがあるらしい。何が互換APIじゃ
				const type = obj.type
				const mute = getFilterTypeByAcct(acctId, 'notf')
				const popup = parseInt(localStorage.getItem('popup') || '0', 10)
				const nEvent = {
					event: type,
					eventBy: obj.account,
					id: obj.id,
					createdAt: obj.created_at,
					fromStreaming: false
				}
				if (type === 'mention' || type === 'status' || type === 'reblog' || type === 'favourite' || type === 'poll' || type === 'update') {
					const status = obj.status || statusModel()
					template = parse([status], 'notf', acctId, 'notf', popup, mute, nEvent)
				} else if (type === 'follow_request' || type === 'follow' || type === 'moved' || type === 'admin.sign_up') {
					template = userParse([obj.account], acctId, type, 'notf', -1)
				} else {
					const status = obj.status
					template = status ? parse([status], 'notf', acctId, 'notf', 0) : userParse([obj.account], acctId, type, 'notf', -1)
				}
				$('div[data-notf=' + acctId + ']').append(template)
				key++
			}
			// $('#landing_' + tlid).hide()
			timeUpdate()
		}
		$('#notf-box').addClass('fetched')
		todc()
		if (isStreamOnly && domain && at) notfWS(acctId, tlid, domain, at)
	} catch (e: any) {
		$('div[data-notf=' + acctId + '] .landing').append(`<div>${escapeHTML(e)}`)
	}
}
let errorCt = 0
function notfWS(acctId: string, tlid: string, domain: string, at: string) {
	if (globalThis.mastodonBaseWsStatus[domain] === 'available') return false
	const wss = localStorage.getItem('streaming_' + acctId) || 'wss://' + domain
	const start = `${wss}/api/v1/streaming/?stream=user&access_token=${at}`
	const websocketNotf: WebSocket[] = globalThis.websocketNotf
	websocketNotf[acctId] = new WebSocket(start)
	websocketNotf[acctId].onopen = function (mess) {
		$(`i[data-notf=${acctId}]`).removeClass('red-text')
	}
	websocketNotf[acctId].onmessage = function (mess) {
		$('#landing_' + tlid).hide()
		const popup = parseInt(localStorage.getItem('popup') || '0', 10)
		const obj: Notification = JSON.parse(JSON.parse(mess.data).payload)
		const type = JSON.parse(mess.data).event
		if (type === 'notification') {
			let template = ''
			localStorage.setItem('lastnotf_' + acctId, obj.id)
			if (!$('#unread_' + tlid + ' .material-icons').hasClass('teal-text')) {
				//markers show中はダメ
				const { type } = obj
				const mute = getFilterTypeByAcct(acctId, 'notf')
				const nEvent = {
					event: type,
					eventBy: obj.account,
					id: obj.id,
					createdAt: obj.created_at,
					fromStreaming: true
				}
				if (type === 'mention' || type === 'status' || type === 'reblog' || type === 'favourite' || type === 'poll' || type === 'update') {
					const status = obj.status || statusModel()
					template = parse([status], 'notf', acctId, 'notf', popup, mute, nEvent)
				} else if (type === 'follow_request' || type === 'follow' || type === 'moved' || type === 'admin.sign_up') {
					template = userParse([obj.account], acctId, type, 'notf', -1)
				} else {
					const status = obj.status
					template = status ? parse([status], 'notf', acctId, 'notf', popup, mute) : userParse([obj.account], acctId, type, 'notf', -1)
				}
				if (!$('div[data-notfIndv=' + acctId + '_' + obj.id + ']').length) {
					$('div[data-notf=' + acctId + ']').prepend(template)
					$('div[data-const=notf_' + acctId + ']').prepend(template)
				}
				timeUpdate()
			}
		} else if (type === 'delete') {
			$(`[toot-id=${obj}]`).hide()
			$(`[toot-id=${obj}]`).remove()
		}
	}
	websocketNotf[acctId].onerror = function (error) {
		console.error('WebSocket Error ', error)
		errorCt++
		if (errorCt < 3) {
			notfWS(acctId, tlid, domain, at)
		}
	}
	websocketNotf[acctId].onclose = function (error) {
		console.error('WebSocket Close ', error)
		errorCt++
		if (errorCt < 3) {
			notfWS(acctId, tlid, domain, at)
		}
	}
}
//一定のスクロールで発火
export function notfMore(tlid: string) {
	const obj = getColumn()
	const acctId = obj[tlid].domain
	const sid = $(`#timeline_${tlid} .notif-marker`).last().attr('data-maxid')
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	if (sid && !globalThis.moreLoading) {
		globalThis.moreLoading = true
		const httpreq = new XMLHttpRequest()
		let exc = '?max_id=' + sid
		if (localStorage.getItem('exclude-' + tlid)) {
			exc = localStorage.getItem('exclude-' + tlid) + '&max_id=' + sid
		}
		const start = `https://${domain}/api/v1/notifications${exc}`
		httpreq.open('GET', start, true)
		httpreq.setRequestHeader('Content-Type', 'application/json')
		httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
		httpreq.responseType = 'json'
		httpreq.send()
		httpreq.onreadystatechange = function () {
			if (httpreq.readyState === httpreq.DONE) {
				const json: Notification[] = httpreq.response
				const headerM = httpreq.getResponseHeader('link')?.match(/[?&]{1}max_id=([0-9]+)/)
				const maxId = headerM && headerM[1]
				if (json[0]) {
					let template = ''
					localStorage.setItem('lastnotf_' + acctId, json[0].id)
					for (const obj of json) {
						const { type } = obj
						const mute = getFilterTypeByAcct(acctId, 'notf')
						const popup = parseInt(localStorage.getItem('popup') || '0', 10)
						const nEvent = {
							event: type,
							eventBy: obj.account,
							id: obj.id,
							createdAt: obj.created_at,
							fromStreaming: false
						}
						if (type === 'mention' || type === 'status' || type === 'reblog' || type === 'favourite' || type === 'poll' || type === 'update') {
							const status = obj.status || statusModel()
							template = parse([status], 'notf', acctId, 'notf', popup, mute, nEvent)
						} else if (type === 'follow_request' || type === 'follow' || type === 'moved' || type === 'admin.sign_up') {
							template = userParse([obj.account], acctId, type, 'notf', -1)
						} else {
							const status = obj.status
							template = status ? parse([status], 'notf', acctId, 'notf', popup, mute) : userParse([obj.account], acctId, type, 'notf', -1)
						}
					}
					globalThis.moreLoading = false
					template = template + `<div class="hide notif-marker" data-maxid="${maxId}"></div>`
					$('#timeline_' + tlid).append(template)
					// $('#landing_' + tlid).hide()
					timeUpdate()
				}
				$('#notf-box').addClass('fetched')
				todc()
				parseRemainXmlHttpRequest(start,httpreq,'get')
				if ( localStorage.getItem('tips') === 'ver'){
					tips('refresh')
				}
			}
		}
	}
}

//通知トグルボタン
export function notfToggle(acct: string, tlid: string) {
	if ($('#notf-box_' + tlid).hasClass('column-hide')) {
		$('#notf-box_' + tlid).css('display', 'block')
		$('#notf-box_' + tlid).animate(
			{
				height: '400px',
			},
			{
				duration: 300,
				complete: function () {
					$('#notf-box_' + tlid).css('overflow-y', 'scroll')
					$('#notf-box_' + tlid).removeClass('column-hide')
				},
			}
		)
	} else {
		$('#notf-box_' + tlid).css('overflow-y', 'hidden')
		$('#notf-box_' + tlid).animate(
			{
				height: '0',
			},
			{
				duration: 300,
				complete: function () {
					$('#notf-box_' + tlid).addClass('column-hide')
					$('#notf-box_' + tlid).css('display', 'none')
				},
			}
		)
	}
	notfCanceler(acct)
}

function notfCanceler(acct: string) {
	$('.notf-reply_' + acct).text(0)
	localStorage.removeItem('notf-reply_' + acct)
	$('.notf-reply_' + acct).addClass('hide')
	$('.notf-fav_' + acct).text(0)
	localStorage.removeItem('notf-fav_' + acct)
	$('.notf-fav_' + acct).addClass('hide')
	$('.notf-bt_' + acct).text(0)
	localStorage.removeItem('notf-bt_' + acct)
	$('.notf-bt_' + acct).addClass('hide')
	$('.notf-follow_' + acct).text(0)
	localStorage.removeItem('notf-follow_' + acct)
	$('.notf-follow_' + acct).addClass('hide')
	$('.notf-icon_' + acct).removeClass('red-text')
	const id = $('#announce_' + acct + ' .announcement')
		.first()
		.attr('data-id')
	$('.notf-announ_' + acct + '_ct').text('')
	$(`.boxIn[data-acct=${acct}] .notice-box`).removeClass('has-notf')
	if (id) {
		localStorage.setItem('announ_' + acct, id)
	}
}

export function allNotfRead() {
	const obj = getMulti()
	for (const key of Object.keys(obj)) {
		notfCanceler(key)
	}
}
allNotfRead()
