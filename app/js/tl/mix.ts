import $ from 'jquery'
import { todc, todo } from '../ui/tips'
import { additional } from './card'
import { getFilterTypeByAcct } from './filter'
import _ from 'lodash'
import api from '../common/fetch'
import { getColumn } from '../common/storage'
import { IColumnType } from '../../interfaces/Storage'
import { reconnector } from './tl'
import timeUpdate from '../common/time'
import { parse } from './parse'
import { say } from './speech'
import { scrollCk } from '../ui/scroll'

//Integrated TL
let lastId: string
let beforeLastId: string
export async function mixTl(acctId, tlid, type: 'plus' | 'mix', voice?: boolean) {
	const mastodonBaseWsStatus = globalThis.mastodonBaseWsStatus
	localStorage.setItem('now', type)
	todo('Integrated TL Loading...(Local)')
	const domain = localStorage.getItem(`domain_${acctId}`) || ''
	const userId = localStorage.getItem(`user-id_${acctId}`) || ''
	const startLocal = `https://${domain}/api/v1/timelines/public?local=true`
	const local = await getTL(startLocal, acctId)
	const startHome = `https://${domain}/api/v1/timelines/home`
	const home = await getTL(startHome, acctId)
	const concated = _.concat(local, home)
	const uniqued = _.uniqBy(concated, 'id')
	const sorted = _.orderBy(uniqued, ['id'], ['desc'])
	const integrated = _.slice(sorted, 0, 19)
	$('#landing_' + tlid).hide()
	const mute = getFilterTypeByAcct(acctId, 'mix')
	const template = parse<string>(integrated, type, acctId, tlid, 0, mute)
	$('#timeline_' + tlid).html(template)
	additional(acctId, tlid)
	timeUpdate()
	todc()
	if (mastodonBaseWsStatus[domain]?.[userId] === 'cannotuse') {
		mixre(acctId, tlid, 'mix', mute, voice)
	} else if (mastodonBaseWsStatus[domain]?.[userId] === 'undetected' || mastodonBaseWsStatus[domain][userId] === 'connecting') {
		const mbws = setInterval(function () {
			if (mastodonBaseWsStatus[domain]?.[userId] === 'cannotuse') {
				mixre(acctId, tlid, 'mix', mute, voice)
				clearInterval(mbws)
			} else if (mastodonBaseWsStatus[domain]?.[userId] === 'available') {
				globalThis.mastodonBaseWs[domain][userId].send(JSON.stringify({ type: 'subscribe', stream: 'public:local' }))
				clearInterval(mbws)
			}
		}, 1000)
	} else if (mastodonBaseWsStatus[domain]?.[userId] === 'available') {
		globalThis.mastodonBaseWs[domain][userId].send(JSON.stringify({ type: 'subscribe', stream: 'public:local' }))
	}

	$(window).scrollTop(0)
	lastId = integrated[0].id
	beforeLastId = integrated[1].id
}
async function getTL(start, acctId) {
	const at = localStorage.getItem('acct_' + acctId + '_at')
	const promise = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	return promise
}

//Streamingに接続
export function mixre(acctId: string, tlid: string, TLtype: IColumnType, mute: string[], voice?: boolean, mode?: 'error') {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const wss = localStorage.getItem('streaming_' + acctId) || 'wss://' + domain
	const startHome = `${wss}/api/v1/streaming/?stream=user&access_token=${at}`
	const startLocal = `${wss}/api/v1/streaming/?stream=public:local&access_token=${at}`
	const wsHome: WebSocket[] = globalThis.wsHome
	const wsLocal: WebSocket[] = globalThis.wsHome
	const wsHId = wsHome.length
	const wsLId = wsLocal.length
	wsHome[wsHId] = new WebSocket(startHome)
	wsLocal[wsLId] = new WebSocket(startLocal)
	wsHome[wsHId].onopen = function (mess) {
		localStorage.setItem('wssH_' + tlid, `${wsHId}`)
		$('#notice_icon_' + tlid).removeClass('red-text')
	}
	wsLocal[wsLId].onopen = function (mess) {
		localStorage.setItem('wssL_' + tlid, `${wsLId}`)
		$('#notice_icon_' + tlid).removeClass('red-text')
	}
	wsLocal[wsLId].onmessage = function (mess) {
		integratedMessage(mess, acctId, tlid, mute, voice || false)
	}
	wsHome[wsHId].onmessage = function (mess) {
		integratedMessage(mess, acctId, tlid, mute, voice || false)
	}
	wsLocal[wsLId].onerror = function (error) {
		console.error('WebSocketLocal Error')
		console.error(error)
		$('#notice_icon_' + tlid).addClass('red-text')
		if (mode === 'error') {
			todo('WebSocket Error ' + error)
		} else {
			const errorCt = parseInt(localStorage.getItem('wserror_' + tlid) || '0', 10) + 1
			localStorage.setItem('wserror_' + tlid, `${errorCt}`)
			if (errorCt < 3) {
				reconnector(tlid, TLtype, acctId, '', 'error')
			}
		}
	}
	wsLocal[wsLId].onclose = function () {
		console.warn('WebSocketLocal Closing:' + tlid)
		$('#notice_icon_' + tlid).addClass('red-text')
		if (mode === 'error') {
			todo('WebSocket Closed')
		} else {
			const errorCt = parseInt(localStorage.getItem('wserror_' + tlid) || '0', 10) + 1
			localStorage.setItem('wserror_' + tlid, `${errorCt}`)
			if (errorCt < 3) {
				reconnector(tlid, TLtype, acctId, '', 'error')
			}
		}
	}
	wsHome[wsHId].onerror = function (error) {
		console.error(['WebSocketHome Error', error])
		$('#notice_icon_' + tlid).addClass('red-text')
		if (mode === 'error') {
			todo('WebSocket Error ' + error)
		} else {
			const errorCt = parseInt(localStorage.getItem('wserror_' + tlid) || '0', 10) + 1
			localStorage.setItem('wserror_' + tlid, `${errorCt}`)
			if (errorCt < 3) {
				reconnector(tlid, TLtype, acctId, '', 'error')
			}
		}
	}
	wsHome[wsHId].onclose = function () {
		console.warn('WebSocketHome Closing:' + tlid)
		$('#notice_icon_' + tlid).addClass('red-text')
		if (mode === 'error') {
			todo('WebSocket Closed')
		} else {
			const errorCt = parseInt(localStorage.getItem('wserror_' + tlid) || '0', 10) + 1
			localStorage.setItem('wserror_' + tlid, `${errorCt}`)
			if (errorCt < 3) {
				reconnector(tlid, TLtype, acctId, '', 'error')
			}
		}
	}
}
function integratedMessage(mess: any, acctId: string, tlid: string, mute: string[], voice: boolean) {
	const data = JSON.parse(mess.data)
	const type = data.event
	const payload = data.payload
	if (type === 'delete') {
		$('[unique-id=' + payload + ']').hide()
		$('[unique-id=' + payload + ']').remove()
	} else if (type === 'update') {
		const obj = JSON.parse(payload)
		if (obj.id !== lastId && obj.id !== beforeLastId) {
			lastId = obj.id
			beforeLastId = obj.id
			const dom = parse<string>([obj], null, acctId, tlid, 0, mute)
			if (voice) say(obj.content)
			if ($('timeline_box_' + tlid + '_box .tl-box').scrollTop() === 0) {
				$('#timeline_' + tlid).prepend(dom)
			} else {
				let pool = localStorage.getItem('pool_' + tlid) || ''
				if (pool) {
					pool = dom + pool
				} else {
					pool = dom
				}
				localStorage.setItem('pool_' + tlid, pool)
			}
			scrollCk()
			additional(acctId, tlid)
			timeUpdate()
		}
	}
}
//ある程度のスクロールで発火
export async function mixMore(tlid: string, type: IColumnType) {
	const obj = getColumn()
	const tlidNum = parseInt(tlid, 10)
	const acctId = obj[tlidNum].domain.toString()
	globalThis.moreLoading = true
	todo('Integrated TL MoreLoading...(Local)')
	const domain = localStorage.getItem('domain_' + acctId)
	const sid = $('#timeline_' + tlid + ' .cvo')
		.last()
		.attr('unique-id')
	const startLocal = `https://${domain}/api/v1/timelines/public?local=true&max_id=${sid}`
	const local = await getTL(startLocal, acctId)
	const startHome = `https://${domain}/api/v1/timelines/home?max_id=${sid}`
	const home = await getTL(startHome, acctId)
	const concated = _.concat(local, home)
	const uniqued = _.uniqBy(concated, 'id')
	const sorted = _.orderBy(uniqued, ['id'], ['desc'])
	const integrated = _.slice(sorted, 0, 19)
	$('#landing_' + tlid).hide()
	const mute = getFilterTypeByAcct(acctId, 'mix')
	const template = parse<string>(integrated, type, acctId, tlid, 0, mute)
	$('#timeline_' + tlid).append(template)
	additional(acctId, tlid)
	timeUpdate()
	globalThis.moreLoading = false
	todc()
}
