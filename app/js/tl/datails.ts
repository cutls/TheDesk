import { collapsibleInitGetInstance, modalInitGetInstance, toast } from "../common/declareM"
import api from "../common/fetch"
import lang from "../common/lang"
import $ from 'jquery'
import { Account, Context, Toot } from "../../interfaces/MastodonApiReturns"
import { setLog, stripTags } from "../platform/first"
import { todo } from "../ui/tips"
import Swal from "sweetalert2"
import { execCopy } from "../platform/end"
declare var jQuery

//トゥートの詳細
export async function details(id: string, acctId: string, tlid=0, isDm?: boolean) {
	if (isDm) {
		$('.dm-hide').hide()
	} else {
		$('.dm-hide').show()
	}
	const context = localStorage.getItem('moreContext')
	if (context !== 'yes') {
		$('.contextTool').hide()
	} else {
		$('.contextTool').show()
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
			Authorization: 'Bearer ' + at
		}
	}
	try {
		const json = await api<Toot>(start, i)
		console.log(['Toot data:', json])
		if (!$('#timeline_' + tlid + ' #pub_' + id).length) {
			const mute = getFilterTypeByAcct(acctId, 'thread')
			const html = parse([json], '', acctId, '', '', mute)
			$('#toot-this').html(html)
			jQuery('time.timeago').timeago()
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
		const fullAcct = local ? `${scn}@${domain}` : scn
		$('#tootmodal').attr('data-user', fullAcct)
		getContext(id, acctId)
		const dom = local ? domain : scn.replace(/.+@/g, '')
		beforeToot(id, acctId, dom || '')
		userToot(id, acctId, uid)
		afterToot(id, acctId, dom || '')
		afterUserToot(id, acctId, uid)
		afterFTLToot(id, acctId, dom || '')
		faved(id, acctId)
		rted(id, acctId)
		if (json.edited_at) {
			$('.edited-hide').show()
			try {
				const history = await api(`https://${domain}/api/v1/statuses/${id}/history`, i)
				const temp = parse(history, 'noauth', acctId)
				console.log(temp)
				$('#toot-edit').html(temp)
			} catch (e) { console.error(e) }
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
			colInstance.open(4)
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
			Authorization: 'Bearer ' + at
		}
	})
	const mute = getFilterTypeByAcct(acctId, 'thread')
	const template = parse(json.descendants, '', acctId, '', '', mute)
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
	const template2 = parse(json.ancestors, '', acctId, '', '', mute)
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
	jQuery('time.timeago').timeago()
}

//前のトゥート(Back TL)
async function beforeToot(id: string, acctId: string, domain: string) {
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/timelines/public?local=true&max_id=${id}`
	const json = await api<Toot[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
	const template = parse(json, 'noauth', acctId)
	if (template !== '') $('#toot-before .no-data').hide()
	$('#toot-before').html(template)
	jQuery('time.timeago').timeago()
}
//前のユーザーのトゥート
async function userToot(id: string, acctId: string, user: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/${user}/statuses?max_id=${id}`
	const json = await api<Toot[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
	const template = parse(json, '', acctId)
	if (template !== '') $('#user-before .no-data').hide()
	$('#user-before').html(template)
	jQuery('time.timeago').timeago()
}
//後のLTL
async function afterToot(id: string, acctId: string, domain: string) {
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/timelines/public?local=true&min_id=${id}`
	const json = await api<Toot[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
	const template = parse(json, '', acctId)
	if (template !== '') $('#ltl-after .no-data').hide()
	$('#ltl-after').html(template)
	jQuery('time.timeago').timeago()
}
//後のUTL
async function afterUserToot(id: string, acctId: string, user: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/accounts/${user}/statuses?min_id=${id}`
	const json = await api<Toot[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
	const template = parse(json, '', acctId)
	if (template !== '') $('#user-after .no-data').hide()
	$('#user-after').html(template)
	jQuery('time.timeago').timeago()
}
//後のFTL
async function afterFTLToot(id: string, acctId: string, domain: string) {
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const start = `https://${domain}/api/v1/timelines/public?min_id=${id}`
	const json = await api<Toot[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
	const template = parse(json, '', acctId)
	if (template !== '') $('#ftl-after .no-data').hide()
	$('#ftl-after').html(template)
	jQuery('time.timeago').timeago()
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
			Authorization: 'Bearer ' + at
		}
	})
	const template = userParse(json, '', acctId)
	if (template !== '') $('#toot-fav .no-data').hide()
	$('#toot-fav').html(template)
	jQuery('time.timeago').timeago()
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
			Authorization: 'Bearer ' + at
		}
	})
	const template = userParse(json, '', acctId)
	if (template !== '') $('#toot-rt .no-data').hide()
	$('#toot-rt').html(template)
	jQuery('time.timeago').timeago()
}
//URL等のコピー
export function cbCopy(isEmb: boolean) {
	const url = $('#tootmodal').attr('data-url') || ''
	const urls = url.match(/https?:\/\/([-.a-zA-Z0-9]+)/)
	if (!urls) return
	const domain = urls[1]
	if (isEmb) {
		const emb =
			`<iframe src="${url}/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400"></iframe>
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
	console.log('Copy it:\n' + html)
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
			Authorization: 'Bearer ' + at
		}
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
			Swal.showLoading(null)
		},
		willClose: () => {
		}
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
			Authorization: 'Bearer ' + at
		}
	})
	if (json) {
		return json
	} else {
		return false
	}
}
