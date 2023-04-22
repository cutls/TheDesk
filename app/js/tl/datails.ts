import { collapsibleInitGetInstance, modalInitGetInstance, toast } from '../common/declareM'
import api from '../common/fetch'
import lang from '../common/lang'
import $ from 'jquery'
import { Account, Context, Toot } from '../../interfaces/MastodonApiReturns'
import { setLog, stripTags } from '../platform/first'
import { todo } from '../ui/tips'
import Swal from 'sweetalert2'
import { execCopy } from '../platform/end'
import timeUpdate from '../common/time'
import { getFilterTypeByAcct } from './filter'
import { userParse } from './userParse'
import { parse } from './parse'

//トゥートの詳細
export async function details(id: string, acctId: string, tlid = 0, isDm?: boolean) {
	if (isDm) {
		$('.dm-hide').hide()
	} else {
		$('.dm-hide').show()
	}
	$('.toot-reset').html(`<span class="no-data">${lang.lang_details_nodata}</span>`)
	const html = $(`#timeline_${tlid} [toot-id=${id}]`).html()
	$('#toot-this').html(html)
	const instance = modalInitGetInstance($('#tootmodal'))
	if (instance) instance.open()
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/statuses/${id}`
	const i = {
		method: 'get' as const,
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	}
	try {
		const json = await api<Toot>(start, i)
		if (!$('#timeline_' + tlid + ' #pub_' + id).length) {
			const mute = getFilterTypeByAcct(acctId, 'thread')
			const html = parse<string>([json], null, acctId, '', 0, mute)
			$('#toot-this').html(html)
			timeUpdate()
		}
		const url = json.url
		const local = json.account.acct === json.account.username
		const scn = json.account.acct
		const uid = json.account.id
		$('#toot-this .fav_ct').text(json.favourites_count)
		$('#toot-this .rt_ct').text(json.reblogs_count)
		$('#tootmodal').attr('data-url', url)
		$('#tootmodal').attr('data-id', json.id)
		$('#tootmodal').attr('data-acct', acctId)
		$('#tootmodal').attr('data-userId', uid)
		const fullAcct = local ? `${scn}@${domain}` : scn
		$('#tootmodal').attr('data-user', fullAcct)
		getContext(id, acctId)
		contextToolChange()
		const dom = local ? domain : scn.replace(/.+@/g, '')
		faved(id, acctId)
		rted(id, acctId)
		if (json.edited_at) {
			$('.edited-hide').show()
			try {
				const history = await api(`https://${domain}/api/v1/statuses/${id}/history`, i)
				const temp = parse<string>(history, 'noauth', acctId, '')
				$('#toot-edit').html(temp)
			} catch (e) {
				console.error(e)
			}
		} else {
			$('#toot-edit').html('')
			$('.edited-hide').hide()
		}
		if ($('#toot-this div').hasClass('cvo')) {
			$('#toot-this').removeClass('cvo')
		} else {
			if (!$('#toot-this .cvo').hasClass('cvo')) $('#toot-this').addClass('cvo')
		}
		if (!$('#activator').hasClass('active')) {
			const colInstance = collapsibleInitGetInstance($('#det-col'))
			colInstance.open(1)
		}
	} catch (error: any) {
		todo(error)
		setLog(start, 'JSON', error)
		console.error(error)
	}
}

//コンテクスト
async function getContext(id: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/statuses/${id}/context`
	const json = await api<Context>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	const mute = getFilterTypeByAcct(acctId, 'thread')
	const template = parse<string>(json.descendants, null, acctId, '', 0, mute)
	if (template !== '') {
		$('#toot-after .no-data').hide()
		$('#toot-after-new').removeClass('hide')
	} else {
		$('#toot-after-new').addClass('hide')
		$('#toot-after').html('<span class="no-data">' + lang.lang_details_nodata + '</span>')
	}
	$('#toot-after').html(template)
	$('#toot-after .hide').html(lang.lang_details_filtered)
	$('#toot-after .by_filter').css('display', 'block')
	$('#toot-after .by_filter').removeClass('hide')
	const template2 = parse<string>(json.ancestors, null, acctId, '', 0, mute)
	if (template2 !== '') {
		$('#toot-reply .no-data').hide()
		$('#toot-reply-new').removeClass('hide')
	} else {
		$('#toot-reply-new').addClass('hide')
	}
	$('#toot-reply').prepend(template2)
	$('#toot-reply .hide').html(lang.lang_details_filtered)
	$('#toot-reply .by_filter').css('display', 'block')
	$('#toot-reply .by_filter').removeClass('hide')
	timeUpdate()
}

export async function contextToolChange() {
	const id = $('#tootmodal').attr('data-id')
	const acctId = $('#tootmodal').attr('data-acct')
	const userId = $('#tootmodal').attr('data-userId')
	const tootUrl = $('#tootmodal').attr('data-url')
	if (!id || !acctId || !tootUrl) return
	const m = tootUrl.match(/^https:\/\/([^/]+)/)
	if (!m || !m[1]) return
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const type = $('[name=contextToolChangeType]:checked').val()?.toString() || 'utl'
	const domain = type === 'utl' ? localStorage.getItem(`domain_${acctId}`) : m[1]
	const url = type === 'utl' ? `accounts/${userId}/statuses?` : type === 'ltl' ? `timelines/public?local=true&` : `timelines/public?`
	const time = $('[name=contextToolChangeTime]:checked').val()?.toString() || 'before'
	const param = time === 'before' ? 'max_id' : 'min_id'
	const start = `https://${domain}/api/v1/${url}${param}=${id}`
	const json = await api<Toot[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	const template = parse<string>(json, 'noauth', acctId, '')
	if (template !== '') $('#contextToolTl .no-data').hide()
	$('#contextToolTl').html(template)
	timeUpdate()
}

//ふぁぼ一覧
async function faved(id: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/statuses/${id}/favourited_by`
	const json = await api<Account[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	const template = userParse(json, acctId)
	if (template !== '') $('#toot-fav .no-data').hide()
	$('#toot-fav').html(template)
	timeUpdate()
}

//ブースト一覧
async function rted(id: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/statuses/${id}/reblogged_by`
	const json = await api<Account[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	const template = userParse(json, acctId)
	if (template !== '') $('#toot-rt .no-data').hide()
	$('#toot-rt').html(template)
	timeUpdate()
}
//URL等のコピー
export function cbCopy(isEmb: boolean) {
	const url = $('#tootmodal').attr('data-url') || ''
	const urls = url.match(/https?:\/\/([-.a-zA-Z0-9]+)/)
	if (!urls) return
	const domain = urls[1]
	if (isEmb) {
		const emb = `<iframe src="${url}/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400"></iframe>
			<script src="https://${domain}/embed.js" async="async"></script>`
		execCopy(emb)
		toast({ html: lang.lang_details_embed, displayLength: 1500 })
	} else {
		if (execCopy(url)) toast({ html: lang.lang_details_url, displayLength: 1500 })
	}
}
//本文のコピー
export function staCopy(id: string) {
	let html = $(`[toot-id=${id}] .toot`).html()
	html = html.replace(/^<p>(.+)<\/p>$/, '$1')
	html = html.replace(/<br\s?\/?>/, '\n')
	html = html.replace(/<p>/, '\n')
	html = html.replace(/<\/p>/, '\n')
	html = html.replace(/<img[\s\S]*alt="(.+?)"[\s\S]*?>/g, '$1')
	html = stripTags(html)
	if (execCopy(html)) toast({ html: lang.lang_details_txt, displayLength: 1500 })
}
//翻訳
export async function trans(acctId: string, elem: JQuery<HTMLElement>) {
	const id = elem.parents('.cvo').attr('toot-id')
	//alert(id)
	$('#toot-this .additional').text('Loading...(Powered by Mastodon API)')
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const exec = `https://${domain}/api/v1/statuses/${id}/translate`
	const json = await api(exec, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	elem.parents('.cvo').find('.toot').append(`<span class="gray translate">${json.content}</span>`)
}
//ブラウザで開く
export function brws() {
	const url = $('#tootmodal').attr('data-url')
	postMessage(['openUrl', url], '*')
}
//外部からトゥート開く
export async function detEx(url: string, acctId: string) {
	if (acctId === 'main') acctId = localStorage.getItem('main') || '0'
	Swal.fire({
		title: 'Loading...',
		html: lang.lang_details_fetch,
		showConfirmButton: false,
		showCloseButton: true,
		didOpen: () => {
			Swal.showLoading()
		},
		willClose: () => {
			return
		},
	})
	const json = await detExCore(url, acctId)
	Swal.close()
	if (!json.statuses) {
		postMessage(['openUrl', url], '*')
	} else {
		const id = json.statuses[0].id
		$('.loadp').text($('.loadp').attr('href') || '')
		$('.loadp').removeClass('loadp')
		details(id, acctId, 0)
	}
	return
}
export async function detExCore(url: string, acctId: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v2/search?resolve=true&q=${encodeURIComponent(url)}`
	const json = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	if (json) {
		return json
	} else {
		return false
	}
}
