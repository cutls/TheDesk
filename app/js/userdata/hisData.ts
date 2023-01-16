//ユーザーデータ表示

import { Account, Toot } from '../../interfaces/MastodonApiReturns'
import api from '../common/fetch'
import lang from '../common/lang'
import { getColumn, setColumn } from '../common/storage'
import timeUpdate from '../common/time'
import { escapeHTML } from '../platform/first'
import { parse } from '../tl/parse'
import { userParse } from '../tl/userParse'
import { parseColumn } from '../ui/layout'
import { hisclose } from './showOnTL'
import $ from 'jquery'

//タイムライン
export async function utlShow(user: string, more: 'more' | '', acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	if (user === '--now') user = $('#his-data').attr('user-id')?.toString() || '0'
	const sid = more ? $('#his-tl .cvo').last().attr('toot-id') : ''
	const plus = more ? '?max_id=' + sid : ''
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/${user}/statuses${plus}`
	const json = await api(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	let template = parse<string>(json, null, acctId, 'user')
	if (!json[0]) template = lang.lang_details_nodata + '<br>'
	if (more) {
		$('#his-tl-contents').append(template)
	} else {
		pinutl(template, user, acctId)
	}
	timeUpdate()
}
export function utlAdd() {
	const acctId = $('#his-data').attr('use-acct') || '0'
	const user = $('#his-data').attr('user-id') || '0'
	const add = {
		domain: parseInt(acctId, 10),
		type: 'utl' as const,
		data: {
			id: user,
			acct: $('#his-acct').attr('fullname') || '',
		},
	}
	const obj = getColumn()
	localStorage.setItem('card_' + obj.length, 'true')
	obj.push(add)
	setColumn(obj)
	parseColumn('add')
	hisclose()
}
//ピン留めTL
async function pinutl(before: string, user: string, acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	if (user === '--now') user = $('#his-data').attr('user-id')?.toString() || '0'
	const plus = '?pinned=1'
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/${user}/statuses${plus}`
	const json = await api(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	let template = parse<string>(json, 'pinned', acctId, 'user')
	if (!json[0]) template = ''
	$('#his-tl-contents').html(template + before)
	timeUpdate()
}

//フォローリスト
export function flw(user: string, more: 'more' | '', acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	if (user === '--now') user = $('#his-data').attr('user-id')?.toString() || '0'
	const sid = more ? $('#his-follow-list .cusr').last().attr('user-id') : ''
	const plus = more ? '?max_id=' + sid : ''
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/${user}/following${plus}`
	const httpreq = new XMLHttpRequest()
	httpreq.open('GET', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
	httpreq.responseType = 'json'
	httpreq.send()
	httpreq.onreadystatechange = function () {
		const json: Account[] = httpreq.response
		if (httpreq.readyState === 4) {
			const template = userParse(json, acctId) || lang.lang_details_nodata + '<br>'
			const linkHeader = httpreq.getResponseHeader('link') || ''
			let link = ''
			if (linkHeader) {
				const m = linkHeader.match(/[?&]{1}max_id=([0-9]+)/)
				link = m ? m[1] : ''
			}
			if (link) $('#his-follow-list-contents').attr('max-id', link)
			if (more) {
				$('#his-follow-list-contents').append(template)
			} else {
				$('#his-follow-list-contents').html(template)
			}
			timeUpdate()
		}
	}
}

//フォロワーリスト
export function fer(user: string, more: 'more' | '', acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	if (user === '--now') user = $('#his-data').attr('user-id')?.toString() || '0'
	const sid = more ? $('#his-follower-list .cusr').last().attr('user-id') : ''
	const plus = more ? '?max_id=' + sid : ''
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/${user}/followers${plus}`
	const httpreq = new XMLHttpRequest()
	httpreq.open('GET', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
	httpreq.responseType = 'json'
	httpreq.send()
	httpreq.onreadystatechange = function () {
		const json: Account[] = httpreq.response
		if (httpreq.readyState === 4) {
			const template = userParse(json, acctId) || lang.lang_details_nodata + '<br>'
			const linkHeader = httpreq.getResponseHeader('link') || ''
			let link = ''
			if (linkHeader) {
				const m = linkHeader.match(/[?&]{1}max_id=([0-9]+)/)
				link = m ? m[1] : ''
			}
			if (link) $('#his-follower-list-contents').attr('max-id', link)
			if (more) {
				$('#his-follower-list-contents').append(template)
			} else {
				$('#his-follower-list-contents').html(template)
			}
			timeUpdate()
		}
	}
}

//以下自分のみ
//お気に入り一覧
export function showFav(more: 'more' | '', acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	const sid = more ? $('#his-fav-list-contents').attr('max-id') : ''
	const plus = more ? '?max_id=' + sid : ''
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/favourites${plus}`
	const httpreq = new XMLHttpRequest()
	httpreq.open('GET', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
	httpreq.responseType = 'json'
	httpreq.send()
	httpreq.onreadystatechange = function () {
		const json: Toot[] = httpreq.response
		if (httpreq.readyState === 4) {
			const template = parse<string>(json, null, acctId, 'user') || lang.lang_details_nodata + '<br>'
			const linkHeader = httpreq.getResponseHeader('link') || ''
			let link = ''
			if (linkHeader) {
				const m = linkHeader.match(/[?&]{1}max_id=([0-9]+)/)
				link = m ? m[1] : ''
			}
			if (link) $('#his-fav-list-contents').attr('max-id', link)
			if (more) {
				$('#his-fav-list-contents').append(template)
			} else {
				$('#his-fav-list-contents').html(template)
			}
			timeUpdate()
		}
	}
}

//ミュートリスト
export async function showMut(more: 'more' | '', acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	const sid = more ? $('#his-muting-list .cvo').last().attr('user-id') : ''
	const plus = more ? '?max_id=' + sid : ''
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/mutes${plus}`
	const json = await api<Account[]>(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	let template = userParse(json, acctId)
	if (!json[0]) template = lang.lang_details_nodata + '<br>'
	if (more) {
		$('#his-muting-list-contents').append(template)
	} else {
		$('#his-muting-list-contents').html(template)
	}
	timeUpdate()
}

//ブロックリスト
export async function showBlo(more: 'more' | '', acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	const sid = more ? $('#his-blocking-list .cvo').last().attr('user-id') : ''
	const plus = more ? '?max_id=' + sid : ''
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/blocks${plus}`
	const json = await api<Account[]>(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	let template = userParse(json, acctId)
	if (!json[0]) template = lang.lang_details_nodata + '<br>'
	if (more) {
		$('#his-blocking-list-contents').append(template)
	} else {
		$('#his-blocking-list-contents').html(template)
	}
	timeUpdate()
}

//フォロリクリスト
export async function showReq(more: 'more' | '', acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	const sid = more ? $('#his-request-list .cvo').last().attr('user-id') : ''
	const plus = more ? '?max_id=' + sid : ''
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/follow_requests${plus}`
	const json = await api<Account[]>(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	let template = userParse(json, acctId, 'follow_request')
	if (!json[0]) template = lang.lang_details_nodata + '<br>'
	if (more) {
		$('#his-request-list-contents').append(template)
	} else {
		$('#his-request-list-contents').html(template)
	}
	timeUpdate()
}

//ドメインブロックリスト
export async function showDom(more: 'more' | '', acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	const sid = more ? $('#his-domain-list .cvo').last().attr('user-id') : ''
	const plus = more ? '?max_id=' + sid : ''
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/domain_blocks${plus}`
	const json = await api(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	let template = ''
	if (!json[0]) template = lang.lang_details_nodata + '<br>'
	for (const domain of json) template = template + domain + `<i class="material-icons gray pointer" onclick="domainBlock('${domain}',false)">cancel</i><div class="divider"></div>`
	if (more) {
		$('#his-domain-list-contents').append(template)
	} else {
		$('#his-domain-list-contents').html(template)
	}
	timeUpdate()
}

//フォローレコメンデーションリスト
export async function showFrl(more: 'more' | '', acctId: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	const sid = more ? $('#his-follow-recom-list .cvo').last().attr('user-id') : ''
	const plus = more ? '?max_id=' + sid : ''
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/suggestions${plus}`
	const json = await api<Account[]>(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	let template = userParse(json, acctId)
	if (!json[0]) template = `${lang.lang_details_nodata}(${lang.lang_hisdata_frcwarn})<br>`
	if (more) {
		$('#his-follow-recom-list-contents').append(template)
	} else {
		$('#his-follow-recom-list-contents').html(template)
	}
	timeUpdate()
}
//Keybase
export async function udAdd(acctId: string, id: string, start: string) {
	if (!acctId) acctId = $('#his-data').attr('use-acct')?.toString() || '0'
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const proof = `https://${domain}/api/v1/accounts/${id}/identity_proofs`
	const json = await api(proof, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	const fields = json
	for (const field of fields) {
		const html = `<a href="${field.proof_url}" target="_blank" class="cbadge teal waves-effect" style="max-width:200px;" title="${lang.lang_hisdata_key.replace(
			'{{set}}',
			escapeHTML(field.provider)
		)}"><i class="fas fa-key" aria-hidden="true"></i>${escapeHTML(field.provider)}:${escapeHTML(field.provider_username)}</a>`
		$('#his-proof-prof').append(html)
	}
	const ns = `https://notestock.osa-p.net/api/v1/isstock.json?id=${start.replace('@', 'users/')}`
	const nsJson = await api(ns, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (nsJson.user.public_view) {
		const html = `<a href="${nsJson.user.url}" target="_blank" class="cbadge purple waves-effect" style="max-width:200px;" title="Notestock">Notestock</a>`
		$('#his-proof-prof').append(html)
	}
}
