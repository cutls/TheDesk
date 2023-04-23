//検索
//検索ボックストグル
import $ from 'jquery'
import { Card, Search, Tag, Toot } from '../../interfaces/MastodonApiReturns'
import api from '../common/fetch'
import lang from '../common/lang'
import timeUpdate from '../common/time'
import { execCopy } from '../platform/end'
import { escapeHTML } from '../platform/first'
import { brInsert } from '../post/emoji'
import { cardHtml } from './card'
import { parse } from './parse'
import { userParse } from './userParse'

export function searchMenu() {
	$('#src-contents').html('')
	trend()
	$('#left-menu a').removeClass('active')
	$('#searchMenu').addClass('active')
	$('.menu-content').addClass('hide')
	$('#src-box').removeClass('hide')
	//$('ul.tabs').tabs('select_tab', 'src-sta');
}

//検索取得
export async function src(mode?: any, offset?: any) {
	if (!offset) {
		$('#src-contents').html(`
		<div class="preloader-wrapper small active" style="margin-left: calc(50% - 36px);">
			<div class="spinner-layer spinner-blue-only">
				<div class="circle-clipper left">
					<div class="circle"></div>
				</div>
				<div class="gap-patch">
					<div class="circle"></div>
				</div>
				<div class="circle-clipper right">
					<div class="circle"></div>
				</div>
			</div>
		</div>
		`)
	}
	const add = offset ? '&type=accounts&offset=' + $('#src-accts .cvo').length : ''

	let q = $('#src').val()
	const acct_id = $('#src-acct-sel').val()
	$('#src-contents').html('')
	if (acct_id === 'tootsearch' && typeof q === 'string') {
		tsAdd(q)
		return false
	}
	if (typeof acct_id !== 'string' || typeof q !== 'string') return
	localStorage.setItem('last-use', acct_id)
	const domain = localStorage.getItem('domain_' + acct_id)
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	const m = q.match(/^#(.+)$/)
	if (m) q = m[1]
	const start = 'https://' + domain + '/api/v2/search?resolve=true&q=' + encodeURIComponent(q) + (!mode ? add : '')
	const json = await api<Search>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	//ハッシュタグ
	if (json.hashtags[0]) {
		let tags = ''
		for (const tag of json.hashtags) {
			if (mode) {
				tags =
					tags +
					`<a onclick="tl('tag','${tag}','${acct_id}','add')" class="pointer">
						#${escapeHTML(tag.name)}
					</a>
					<br> `
			} else {
				tags = tags + graphDraw(tag, parseInt(acct_id, 10))
			}
		}
		$('#src-contents').append('Tags<br>' + tags)
	}
	//トゥート
	if (json.statuses[0]) {
		const templete = parse(json.statuses, null, acct_id, 'search')
		$('#src-contents').append('<br>Mentions<br>' + templete)
	}
	//アカウント
	if (json.accounts[0]) {
		const templete = userParse(json.accounts, acct_id)
		if (!offset) {
			$('#src-contents').append(
				`<br>Accounts<div id="src-accts">
					${templete}
					</div><a onclick="src(false,'more')" class="pointer">more...</a>`
			)
		} else {
			$('#src-accts').append(templete)
		}
	}
	timeUpdate()
}
function tsAdd(q: string) {
	return q
	// const add = {
	// 	domain: 0,
	// 	type: 'tootsearch',
	// 	data: q
	// }
	// const multi = localStorage.getItem('column')
	// const obj = JSON.parse(multi || '{}')
	// localStorage.setItem('card_' + obj.length, 'true')
	// obj.push(add)
	// const json = JSON.stringify(obj)
	// localStorage.setItem('column', json)
	// parseColumn('add')
}

// Tootsearch is terminated
export function tootsearch(tlid: number, q: string) {
	if (!q || q === 'undefined') {
		return false
	}
	// const start = 'https://tootsearch.chotto.moe/api/v1/search?from=0&sort=created_at%3Adesc&q=' + q
	// $('#notice_' + tlid).text('tootsearch(' + q + ')')
	// $('#notice_icon_' + tlid).text('search')
	// fetch(start, {
	// 	method: 'GET',
	// 	headers: {
	// 		'content-type': 'application/json'
	// 	}
	// })
	// 	.then(function (response) {
	// 		if (!response.ok) {
	// 			response.text().then(function (text) {
	// 				setLog(response.url, response.status, text)
	// 			})
	// 		}
	// 		return response.json()
	// 	})
	// 	.catch(function (error) {
	// 		todo(error)
	// 		setLog(start, 'JSON', error)
	// 		console.error(error)
	// 	})
	// 	.then(function (raw) {
	// 		const templete = ''
	// 		const json = raw.hits.hits
	// 		const max_id = raw['hits'].length
	// 		for (const i = 0; i < json.length; i++) {
	// 			const toot = json[i]['_source']
	// 			if (lastid !== toot.uri) {
	// 				if (toot && toot.account) {
	// 					templete = templete + parse([toot], 'noauth', null, tlid, 0, [], 'tootsearch')
	// 				}
	// 			}
	// 			const lastid = toot.uri
	// 		}
	// 		if (!templete) {
	// 			templete = lang.lang_details_nodata
	// 		} else {
	// 			templete = templete + `<div class="hide ts-marker" data-maxid="${max_id}"></div>`
	// 		}
	// 		$('#timeline_' + tlid).html(templete)

	// 		timeUpdate()
	// 	})
}
export function moreTs(tlid, q) {
	return tlid && q
	// const sid = $('#timeline_' + tlid + ' .ts-marker')
	// 	.last()
	// 	.attr('data-maxid')
	// moreLoading = true
	// const start =
	// 	'https://tootsearch.chotto.moe/api/v1/search?from=' + sid + '&sort=created_at%3Adesc&q=' + q
	// $('#notice_' + tlid).text('tootsearch(' + q + ')')
	// $('#notice_icon_' + tlid).text('search')
	// fetch(start, {
	// 	method: 'GET',
	// 	headers: {
	// 		'content-type': 'application/json'
	// 	}
	// })
	// 	.then(function (response) {
	// 		if (!response.ok) {
	// 			response.text().then(function (text) {
	// 				setLog(response.url, response.status, text)
	// 			})
	// 		}
	// 		return response.json()
	// 	})
	// 	.catch(function (error) {
	// 		todo(error)
	// 		setLog(start, 'JSON', error)
	// 		console.error(error)
	// 	})
	// 	.then(function (raw) {
	// 		const templete = ''
	// 		const json = raw.hits.hits
	// 		const max_id = raw['hits'].length
	// 		for (const i = 0; i < json.length; i++) {
	// 			const toot = json[i]['_source']
	// 			if (lastid !== toot.uri) {
	// 				if (toot && toot.account) {
	// 					templete = templete + parse([toot], 'noauth', null, tlid, 0, [], 'tootsearch')
	// 				}
	// 			}
	// 			const lastid = toot.uri
	// 		}
	// 		if (!templete) {
	// 			templete = lang.lang_details_nodata
	// 		} else {
	// 			templete = templete + `<div class="hide ts-marker" data-maxid="${max_id}"></div>`
	// 		}
	// 		$('#timeline_' + tlid).append(templete)
	// 		globalThis.timeUpdate()
	// 	})
}
function graphDraw(tag: Tag, acct_id: number) {
	const his = tag.history
	return graphDrawCore(his, tag, acct_id)
}
function graphDrawCore(his: Tag['history'], tag: Tag, acct_id: number) {
	if (!his) return ''
	const max = Math.max.apply(null, [
		parseInt(his[0].uses, 10),
		parseInt(his[1].uses, 10),
		parseInt(his[2].uses, 10),
		parseInt(his[3].uses, 10),
		parseInt(his[4].uses, 10),
		parseInt(his[5].uses, 10),
		parseInt(his[6].uses, 10),
	])
	const six = 50 - (parseInt(his[6].uses, 10) / max) * 50
	const five = 50 - (parseInt(his[5].uses, 10) / max) * 50
	const four = 50 - (parseInt(his[4].uses, 10) / max) * 50
	const three = 50 - (parseInt(his[3].uses, 10) / max) * 50
	const two = 50 - (parseInt(his[2].uses, 10) / max) * 50
	const one = 50 - (parseInt(his[1].uses, 10) / max) * 50
	const zero = 50 - (parseInt(his[0].uses, 10) / max) * 50
	return `<div class="tagComp">
				<div class="tagCompSvg">
					<svg version="1.1" viewbox="0 0 60 50" width="60" height="50">
						<g>
							<path d="M0,${six} L10,${five} 20,${four} 30,${three} 40,${two} 50,${one} 60,${zero} 61,61 0,61" 
							style="stroke: #0f8c0c;fill: rgba(13,113,19,.25); stroke-width: 1;">
								</path>
						</g>
					</svg>
				</div>
				<div class="tagCompToot">
					<span style="font-size:200%">${his[0].uses}</span>
				</div>
				<div class="tagCompToots">
					toot
				</div>
				<div class="tagCompTag">
					<a onclick="tl('tag','${escapeHTML(tag.name)}','${acct_id}','add')" class="pointer" title="${escapeHTML(tag.name)}">
						#${escapeHTML(tag.name)}
					</a>
				</div>
				<div class="tagCompUser">
					${his[0].accounts}
					${lang.lang_src_people}
				</div>
				</div>`
}
export async function trend() {
	$('#src-contents').html('')
	const acct_id = $('#src-acct-sel').val()
	if (acct_id === 'tootsearch') {
		return false
	}
	if (typeof acct_id !== 'string') return
	const domain = localStorage.getItem('domain_' + acct_id)
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	try {
		const tagTrendUrl = 'https://' + domain + '/api/v1/trends'
		const tagTrends = await api<Tag[]>(tagTrendUrl, {
			method: 'get',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at,
			},
		})
		let tags = ''
		for (const tag of tagTrends) {
			const his = tag.history
			tags = tags + graphDrawCore(his, tag, parseInt(acct_id, 10))
		}
		$('#src-contents').append(`<div id="src-content-tag">Trend Tags<br />${tags || 'none'}</div>`)
	} catch (e: any) {
		console.error(e)
	}

	try {
		const tootTrendUrl = 'https://' + domain + '/api/v1/trends/statuses'
		const tootTrends = await api<Toot[]>(tootTrendUrl, {
			method: 'get',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at,
			},
		})
		if (tootTrends.length) {
			const templete = parse(tootTrends, null, acct_id, '')
			$('#src-contents').append(`<div id="src-content-status">Trend Statuses<br />${templete}</div>`)
		} else {
			$('#src-contents').append('<div id="src-content-status">Trend Statuses<br />none</div>')
		}
	} catch (e: any) {
		console.error(e)
	}

	try {
		const linkTrendUrl = 'https://' + domain + '/api/v1/trends/links'
		const linkTrends = await api<Card[]>(linkTrendUrl, {
			method: 'get',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at,
			},
		})
		let links = ''
		for (const link of linkTrends) {
			links = links + `<a href="${link.url}" target="_blank">${link.url}</a><br />${cardHtml(link, acct_id, '')}<hr />`
		}
		$('#src-contents').append(`<div id="src-content-link">Trend Links<br />${links}</div>`)
	} catch (e: any) {
		console.error(e)
	}
}
export function srcBox(mode: 'open' | 'close' | 'toggle') {
	if (mode === 'open') {
		$('#pageSrc').removeClass('hide')
	} else if (mode === 'close') {
		$('#pageSrc').addClass('hide')
		$('#pageSrc').removeClass('keep')
	} else {
		$('#pageSrc').toggleClass('hide')
	}
}
export function doSrc(type: 'web' | 'ts' | 'copy' | 'toot') {
	$('#pageSrc').addClass('hide')
	$('#pageSrc').removeClass('keep')
	const q = $('.srcQ').text()
	if (type === 'web') {
		const start = localStorage.getItem('srcUrl') || 'https://google.com/search?q={q}'
		postMessage(['openUrl', start.replace(/{q}/, q)], '*')
	} else if (type === 'ts') {
		tsAdd(q)
	} else if (type === 'copy') {
		execCopy(q)
	} else if (type === 'toot') {
		brInsert(q)
	}
}
