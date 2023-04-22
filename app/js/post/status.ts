//お気に入り登録やブースト等、フォローやブロック等

import Swal from 'sweetalert2'
import { Account, Media, Search, Toot } from '../../interfaces/MastodonApiReturns'
import { dropdownInit, dropdownInitGetInstance, formSelectInit, toast } from '../common/declareM'
import api from '../common/fetch'
import lang from '../common/lang'
import { execCopy } from '../platform/end'
import { show, mdCheck } from '../ui/postBox'
import { showReq, showDom } from '../userdata/hisData'
import { cw, IVis, vis } from './secure'
import { reEx } from './useTxtBox'
import $ from 'jquery'
import { StatusTheDeskExtend } from '../../interfaces/MastodonApiRequests'

//お気に入り登録
export async function fav(id: string, acctId: string) {
	const flag = $(`.cvo[unique-id=${id}]`).hasClass('faved') ? 'unfavourite' : 'favourite'
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/statuses/${id}/${flag}`
	let json = await api<Toot>(start, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})

	if (json.reblog) json = json.reblog
	//APIのふぁぼカウントがおかしい
	$(`[unique-id=${id}] .rt_ct`).text(json.reblogs_count)
	if ($(`[unique-id=${id}]`).hasClass('faved')) {
		const fav = json.favourites_count - 1
		$(`[unique-id=${id}] .fav_ct`).text(fav >= 0 ? fav : 0)
		$(`[unique-id=${id}]`).removeClass('faved')
		$(`.fav_${id}`).removeClass('yellow-text')
	} else {
		const fav = json.favourites_count || json.reblog?.favourites_count || 0
		$(`[unique-id=${id}] .fav_ct`).text(fav)
		$(`[unique-id=${id}]`).addClass('faved')
		$(`.fav_${id}`).addClass('yellow-text')
	}
}

//ブースト
export async function rt(id: string, acctId: string, remote: boolean, vis?: IVis) {
	const flag = $(`.cvo[toot-id=${id}]`).hasClass('rted') ? 'unreblog' : 'reblog'
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/statuses/${id}/${flag}`
	let json = await api<Toot>(start, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
		body: vis ? { visibility: vis } : undefined,
	})
	const fav = json.favourites_count || json.reblog?.favourites_count || 0
	$('[toot-id=' + id + '] .fav_ct').text(fav)
	let rt = json.reblogs_count
	if (!json.reblog) {
		rt = rt - 1
		if (flag === 'unreblog') {
			if (rt * 1 < 0) {
				rt = 0
			}
		}
	} else {
		rt = json.reblog.reblogs_count
	}
	$(`[toot-id=${id}] .rt_ct`).text(rt)

	if ($(`[toot-id=${id}]`).hasClass('rted')) {
		$(`[toot-id=${id}]`).removeClass('rted')
		$('.rt_' + id).removeClass('light-blue-text')
	} else {
		$(`[toot-id=${id}]`).addClass('rted')
		$('.rt_' + id).addClass('light-blue-text')
	}
}

export function boostWith(vis) {
	const id = $('#tootmodal').attr('data-id')
	const acctId = $('#tootmodal').attr('data-acct')
	if (!id || !acctId) return Swal.fire(`No toot`)
	rt(id, acctId, false, vis)
}
//ブックマーク
export async function bkm(id: string, acctId: string) {
	const flag = $(`.cvo[unique-id=${id}]`).hasClass('bkmed') ? 'unbookmark' : 'bookmark'
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/statuses/${id}/${flag}`
	let json = await api(start, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (json.reblog) json = json.reblog
	const fav = json.favourites_count
	$(`[toot-id=${id}] .fav_ct`).text(fav)
	$(`[toot-id=${id}] .rt_ct`).text(json.reblogs_count)
	if (flag === 'unbookmark') {
		$('.bkmStr_' + id).text(lang.lang_parse_bookmark)
		$('.bkm_' + id).removeClass('red-text')
		$(`[toot-id=${id}]`).removeClass('bkmed')
	} else {
		$('.bkmStr_' + id).text(lang.lang_parse_unbookmark)
		$('.bkm_' + id).addClass('red-text')
		$(`[toot-id=${id}]`).addClass('bkmed')
	}
}

//フォロー
export async function follow(acctId: string, resolve: boolean) {
	const locked = $('#his-data').hasClass('locked')
	if (!acctId && acctId !== 'selector') {
		acctId = $('#his-data').attr('use-acct') || ''
	} else if (acctId === 'selector') {
		acctId = $('#user-acct-sel').val()?.toString() || ''
	}
	let flag = 'follow'
	if (!resolve && $('#his-data').hasClass('following')) {
		flag = 'unfollow'
	}

	let id = $('#his-data').attr('user-id')
	if (resolve) {
		const fullacct = $('#his-acct').attr('fullname')
		if (!fullacct) return toast({ html: 'Error' })
		const data = await acctResolve(acctId, fullacct)
		if (!data) return toast({ html: `Error to resolve account ${fullacct}` })
		id = data.id
	}
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/${id}/${flag}`
	const json = await api(start, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if ($('#his-data').hasClass('following')) {
		$('#his-data').removeClass('following')
		$('#his-follow-btn-text').text(lang.lang_status_follow)
	} else {
		$('#his-data').addClass('following')
		if (locked) {
			$('#his-follow-btn-text').text(lang.lang_status_requesting)
		} else {
			$('#his-follow-btn-text').text(lang.lang_status_unfollow)
		}
	}
}
// スレッドミュート

export async function muteThread(id: string, acctId: string) {
	const toMute = !$(`.cvo[unique-id=${id}] .threadMute`).hasClass('inMute')
	const flag = toMute ? 'mute' : 'unmute'
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/statuses/${id}/${flag}`
	let json = await api<Toot>(start, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (toMute) {
		$(`.cvo[unique-id=${id}] .threadMute`).addClass('inMute')
		$(`.cvo[unique-id=${id}] .threadMute`).html(`<i class="material-icons">voice_over_off</i>${lang.lang_status_unmuteThread}`)
	} else {
		$(`.cvo[unique-id=${id}] .threadMute`).removeClass('inMute')
		$(`.cvo[unique-id=${id}] .threadMute`).html(`<i class="material-icons">voice_over_off</i>${lang.lang_status_muteThread}`)
	}

}

export async function acctResolve(acctId: string, user: string) {
	const domain = localStorage.getItem(`domain_${acctId}`) || ''
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const options = {
		method: 'get' as const,
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	}
	try {
		const start = `https://${domain}/api/v1/accounts/lookup?acct=${user}`
		const idJson = await api<Account>(start, options)
		if (idJson) {
			return idJson
		} else {
			return await acctResolveLegacy(domain, user, options)
		}
	} catch {
		return await acctResolveLegacy(domain, user, options)
	}
}
export async function acctResolveLegacy(domain: string, user: string, options: any) {
	try {
		const start = 'https://' + domain + '/api/v2/search?resolve=true&q=' + user
		const idJson = await api<Search>(start, options)
		if (idJson.accounts[0]) {
			return idJson.accounts[0]
		} else {
			toast({ html: lang.lang_fatalerroroccured, displayLength: 2000 })
		}
	} catch {

	}
}
//ブロック
export async function block(acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct') || ''
	const isBlock = $('#his-data').hasClass('blocking')
	const flag = isBlock ? 'unblock' : 'block'
	const txt = isBlock ? lang.lang_status_unblock : lang.lang_status_block
	const result = await Swal.fire({
		title: txt,
		text: '',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
	})
	if (result.value) {
		const id = $('#his-data').attr('user-id')
		const domain = localStorage.getItem(`domain_${acctId}`)
		const at = localStorage.getItem(`acct_${acctId}_at`)
		const start = `https://${domain}/api/v1/accounts/${id}/${flag}`
		await api(start, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + at,
			},
		})
		if ($('#his-data').hasClass('blocking')) {
			$('#his-data').removeClass('blocking')
			$('#his-block-btn-text').text(lang.lang_status_block)
		} else {
			$('#his-data').addClass('blocking')
			$('#his-block-btn-text').text(lang.lang_status_unblock)
		}
	}
}

//ミュート
export async function muteDo(acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct') || ''
	const isMute = $('#his-data').hasClass('muting')
	const flag = isMute ? 'unmute' : 'mute'
	const txt = isMute ? lang.lang_status_unmute : lang.lang_status_mute
	const result = await Swal.fire({
		title: txt,
		text: '',
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
	})
	if (result.value) {
		const id = $('#his-data').attr('user-id')
		const domain = localStorage.getItem(`domain_${acctId}`)
		const at = localStorage.getItem(`acct_${acctId}_at`)
		const start = `https://${domain}/api/v1/accounts/${id}/${flag}`
		const days = parseInt($('#days_mute').val()?.toString() || '0', 10)
		const hours = parseInt($('#hours_mute').val()?.toString() || '0', 10)
		const mins = parseInt($('#mins_mute').val()?.toString() || '0', 10)
		const notf = $('#notf_mute:checked').val() === '1'
		const duration = days * 24 * 60 * 60 + hours * 60 + mins
		const q: any = {
			notifications: notf,
		}
		if (duration > 0) q.duration = duration * 60
		if (days < 0 || hours < 0 || mins < 0) return Swal.fire('Invalid number')
		await api(start, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + at,
			},
			body: q,
		})
		if ($('#his-data').hasClass('muting')) {
			$('#his-data').removeClass('muting')
			$('#his-mute-btn-text').text(lang.lang_status_mute)
			$('#his-mute-btn').text(lang.lang_status_mute)
		} else {
			$('#his-data').addClass('muting')
			$('#his-mute-btn-text').text(lang.lang_status_unmute)
			$('#his-mute-btn').text(lang.lang_status_unmute)
		}
		muteMenu()
	}
}
export function muteMenu() {
	$('#muteDuration').toggleClass('hide')
	if (!$('#muteDuration').hasClass('hide')){
		$('#his-des').css('max-height', '0px') 
	} else {
		$('#his-des').css('max-height', '196px')
	}
	if (!$('#his-data').hasClass('muting')) {
		$('#his-mute-btn-text').text(lang.lang_status_mute)
		$('#his-mute-btn').text(lang.lang_status_mute)
	} else {
		$('#his-mute-btn-text').text(lang.lang_status_unmute)
		$('#his-mute-btn').text(lang.lang_status_unmute)
	}
}
export function muteTime(day: number, hour: number, min: number) {
	$('#days_mute').val(day)
	$('#hours_mute').val(hour)
	$('#mins_mute').val(min)
}

//投稿削除
export async function del(id: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/statuses/${id}`
	const json = await api(start, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	return json
}
//redraft
export async function redraft(id: string, acctId: string) {
	const result = await Swal.fire({
		title: lang.lang_status_redraftTitle,
		text: lang.lang_status_redraft,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
	})
	if (result.value) {
		show()
		const json = await del(id, acctId)
		draftToPost(json, acctId)
	}
}
// edit
export async function editToot(id: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const sourceStart = `https://${domain}/api/v1/statuses/${id}/source`
	const sourceJson = await api(sourceStart, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	const { text } = sourceJson
	const start = `https://${domain}/api/v1/statuses/${id}`
	const json = await api<Toot>(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	json.text = text
	draftToPost(json, acctId, id)
}

export function draftToPost(json: Toot, acctId: string, id?: string) {
	$('#post-acct-sel').prop('disabled', true)
	$('#post-acct-sel').val(acctId)
	formSelectInit($('select'))
	if (id) $('#tootmodal').attr('data-edit', id)
	mdCheck()
	const mediaCk = json.media_attachments ? json.media_attachments[0] : null
	//メディアがあれば
	const media_ids: string[] = []
	if (mediaCk) {
		for (let i = 0; i <= 4; i++) {
			if (!json.media_attachments[i]) break
			media_ids.push(json.media_attachments[i].id)
			$('#preview').append(`<img src="${json.media_attachments[i].preview_url}" style="width:50px; max-height:100px;" data-acct="${acctId}" data-media="${json.media_attachments[i].id}" oncontextmenu="deleteImage('${json.media_attachments[i].id}')" title="${lang.lang_postimg_delete}">`)
		}
	}
	const visMode = json.visibility
	vis(visMode)
	const medias = media_ids.join(',')
	$('#media').val(medias)
	localStorage.setItem('nohide', 'true')
	show()
	const html = json.text || json.content.replace(/<br \/>/gi,'\r\n').replace(/(<([^>]+)>)/gi, '')
	$('#textarea').val(html)
	if (json.spoiler_text) {
		cw(true)
		$('#cw-text').val(json.spoiler_text)
	}
	if (json.sensitive) {
		$('#nsfw').addClass('yellow-text')
		$('#nsfw').html('visibility')
		$('#nsfw').addClass('nsfw-avail')
	}
	if (json.in_reply_to_id) $('#reply').val(json.in_reply_to_id)
}

export async function localDraftToPost(json: StatusTheDeskExtend, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	$('#post-acct-sel').prop('disabled', true)
	$('#post-acct-sel').val(acctId)
	formSelectInit($('select'))
	mdCheck()
	//メディアがあれば
	const media_ids: string[] = []
	if (json.media_ids) {
		for (const media of json.media_ids) {
			const start = `https://${domain}/api/v1/media/${media}`
			const json = await api<Media>(start, {
				method: 'get',
				headers: {
					'content-type': 'application/json',
					Authorization: 'Bearer ' + at,
				},
			})
			if (!json.id) continue
			media_ids.push(json.id)
			$('#preview').append(`<img src="${json.preview_url}" style="width:50px; max-height:100px;" data-acct="${acctId}" data-media="${json.id}" oncontextmenu="deleteImage('${json.id}')" onclick="altImage('${acctId}','${json.id}')" title="${lang.lang_postimg_delete}">`)
		}
	}
	const visMode = json.visibility
	if (visMode) vis(visMode)
	$('#media').val(media_ids?.join(','))
	localStorage.setItem('nohide', 'true')
	show()
	const html = json.status || ''
	$('#textarea').val(html)
	if (json.spoiler_text) {
		cw(true)
		$('#cw-text').val(json.spoiler_text)
	}
	if (json.sensitive) {
		$('#nsfw').addClass('yellow-text')
		$('#nsfw').html('visibility')
		$('#nsfw').addClass('nsfw-avail')
	}
	if (json.in_reply_to_id) $('#reply').val(json.in_reply_to_id)
}
//ピン留め
export async function pin(id: string, acctId: string) {
	const flag = $(`.cvo[unique-id=${id}]`).hasClass('pined') ? 'unpin' : 'pin'
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/statuses/${id}/${flag}`
	const json = await api(start, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (flag === 'unpin') {
		$(`[toot-id=${id}]`).removeClass('pined')
		$('.pin_' + id).removeClass('blue-text')
		$('.pinStr_' + id).text(lang.lang_parse_pin)
	} else {
		$(`[toot-id=${id}]`).addClass('pined')
		$('.pin_' + id).addClass('blue-text')
		$('.pinStr_' + id).text(lang.lang_parse_unpin)
	}
}

//フォロリク
export async function request(id: string, flag: 'authorize' | 'reject', acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/follow_requests/${id}/${flag}`
	await api(start, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	showReq('', acctId)
}

//ドメインブロック
export async function domainBlock(add: string, isPositive: boolean, acctId?: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/domain_blocks`
	await api(start, {
		method: isPositive ? 'post' : 'delete',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
		body: { domain: add },
	})
	showDom('', acctId || '0')
}

export function addDomainblock() {
	const domain = $('#domainblock').val()?.toString() || ''
	if (!domain) return Swal.fire(`No instance`)
	domainBlock(domain, true)
}
//ユーザー強調
export function empUser() {
	const usr = localStorage.getItem('user_emp') || '[]'
	const obj: string[] = JSON.parse(usr)
	const id = $('#his-acct').attr('fullname')
	if (!id) return
	if (!obj) {
		const obj = [id]
		const json = JSON.stringify(obj)
		localStorage.setItem('user_emp', json)
		toast({ html: id + lang.lang_status_emphas, displayLength: 4000 })
	} else {
		let can = false
		let key = 0
		for (const usT of obj) {
			if (usT !== id && !can) {
				can = false
			} else {
				can = true
				obj.splice(key, 1)
				toast({ html: id + lang.lang_status_unemphas, displayLength: 4000 })
			}
			key++
		}
	}
}
//Endorse
export async function pinUser() {
	const id = $('#his-data').attr('user-id')
	const acctId = $('#his-data').attr('use-acct')
	if (!acctId) return
	const flag = $('#his-end-btn').hasClass('endorsed') ? 'unpin' : 'pin'
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/${id}/${flag}`
	await api(start, {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if ($('#his-end-btn').hasClass('endorsed')) {
		$('#his-end-btn').removeClass('endorsed')
		$('#his-end-btn').text(lang.lang_status_endorse)
	} else {
		$('#his-end-btn').addClass('endorsed')
		$('#his-end-btn').text(lang.lang_status_unendorse)
	}
}
//URLコピー
export function tootUriCopy(url: string) {
	execCopy(url)
	toast({ html: lang.lang_details_url, displayLength: 1500 })
}

//他のアカウントで…
export async function staEx(mode: 'rt' | 'fav' | 'reply') {
	const url = $('#tootmodal').attr('data-url')
	const acctId = $('#status-acct-sel').val()?.toString()
	if (!acctId) return
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v2/search?resolve=true&q=${url}`
	const json = await api<Search>(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (json.statuses) {
		if (json.statuses[0]) {
			const id = json.statuses[0].id
			if (mode === 'rt') {
				rt(id, acctId, true)
			} else if (mode === 'fav') {
				fav(id, acctId)
			} else if (mode === 'reply') {
				reEx(id)
			}
		}
	}
	return
}

export function toggleAction(id: string, target: Element, tlid: string) {
	const dropdownTrigger = `trigger_${id}`
	const dropdownContent = `dropdown_${id}`
	let elmTrigger = document.querySelector(`#timeline_${tlid} #${dropdownTrigger}`)
	let elmContent = document.querySelector(`#timeline_${tlid} #${dropdownContent}`)
	if (tlid === 'notf') {
		const timeline = $(target).parents('.notf-timeline').attr('tlid')
		if (timeline) {
			elmTrigger = document.querySelector(`#timeline_${timeline} #${dropdownTrigger}`)
			elmContent = document.querySelector(`#timeline_${timeline} #${dropdownContent}`)
		} else {
			const nTlId = $(target).parents('.notf-timeline').attr('id')
			elmTrigger = document.querySelector(`#${nTlId} #${dropdownTrigger}`)
			elmContent = document.querySelector(`#${nTlId} #${dropdownContent}`)
		}
	}
	const trigger = elmTrigger
	const menu = elmContent
	if (!trigger || !menu) return
	if (menu.getAttribute('style')) return console.log(menu)
	dropdownInit(trigger)
	const instance = dropdownInitGetInstance(trigger)
	instance.open()
}
