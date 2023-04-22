//カード処理やメンション、ハッシュタグの別途表示
//全てのTL処理で呼び出し
import $ from 'jquery'
import _ from 'lodash'
import { Card, Toot } from '../../interfaces/MastodonApiReturns'
import { dropdownInitGetInstance } from '../common/declareM'
import api from '../common/fetch'
import lang from '../common/lang'
import { escapeHTML } from '../platform/first'
export function additional(acctId: string, tlid: string) {
	//メンション系
	//$(".mention").attr("href", "");

	$('#timeline-container .mention').addClass('parsed')

	//トゥートサムネ
	$(`#timeline_${tlid} .toot a:not(.parsed)`).each(function () {
		const text = $(this).attr('href')
		if (!text) return
		const urls = text.match(/https?:\/\/([-a-zA-Z0-9@.]+)\/media\/([-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)/)

		//トゥートのURLぽかったら
		const toot = text.match(/https:\/\/([a-zA-Z0-9.-]+)\/@([a-zA-Z0-9_]+)\/([0-9]+)/)
		if (toot) {
			if (toot[1]) {
				$(this).attr('data-acct', acctId)
			}
		}
		if (urls) {
			$(this).remove()
		} else {
			$(this).attr('title', text)
		}
	})

	$(`#timeline_${tlid} .toot:not(:has(a:not(.add-show,.parsed)))`).each(function () {
		$(this).parent().find('.add-show').hide()
	})
}

export async function additionalIndv(tlid: string, acctId: string, idStr: string) {
	const domain = localStorage.getItem(`domain_${acctId}`)
	const at = localStorage.getItem(`acct_${acctId}_at`)
	const text = $(`[toot-id=${idStr}] .toot a`).attr('href') || ''
	const urls = text.match(/https?:\/\/([-a-zA-Z0-9@.]+)\/media\/([-_.!~*'()a-zA-Z0-9;/?:@&=+$,%#]+)/)
	if (urls) {
		$(`[toot-id=${idStr}] .toot a`).remove()
	} else {
		const id =
			$('[toot-id=' + idStr + '] .toot a')
				.parents('.cvo')
				.attr('toot-id') || ''
		const start = `https://${domain}/api/v1/statuses/${id}`
		const json = await api<Toot>(start, {
			method: 'get',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + at,
			},
		})
		const cards = json.card
		if (!cards) return
		const analyze = cardHtml(cards, acctId, id)
		$(`[toot-id=${id}] .additional`).html(analyze)
		if (cards.title) {
			$(`[toot-id=${id}] a:not(.parsed)`).addClass('parsed')
			$(`[toot-id=${id}]`).addClass('parsed')
		}
	}
}
export function cardHtml(json: Card, acctId: string, id: string) {
	let analyze = ''
	const m = json.url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)
	const domain = m ? m[1] : null
	if (!domain) return ''
	const trustedDomains = ['pixiv.net', 'twitter.com', 'mobile.twitter.com', 'open.spotify.com', 'youtube.com', 'youtu.be', 'm.youtube.com', 'www.youtube.com', 'nicovideo.jp', 'twitcasting.tv']
	const isHad = _.includes(trustedDomains, domain)
	if (json.provider_name === 'pixiv') {
		let pxvImg = ''
		if (json.image) {
			pxvImg = `<br><img src="${json.image}" style="max-width:100%" data-type="image">`
		}
		analyze = `<div class="pixiv-post"><b><a href="${json.author_url || json.url}" target="_blank">${escapeHTML(json.author_name || escapeHTML(json.title))}</a></b><br>
				${json.author_name ? escapeHTML(json.title) : ''}${pxvImg}
			</div>`
	} else {
		if (json.title) {
			analyze = `<span class="gray">URL${lang.lang_cards_check}:<br>Title:${escapeHTML(json.title)}<br>${escapeHTML(json.description)}</span>`
		}

		if (json.html || json.provider_name === 'Twitter') {
			let prved
			const title = isHad ? lang.lang_cards_trusted : lang.lang_cards_untrusted
			if (isHad) {
				prved = `<img class="emoji" draggable="false" alt="✅" 
					src="../../${globalThis.pwa ? 'dependencies' : 'node_modules'}/twemoji-asset/assets/72x72/2705.png">`
			} else {
				prved = `<img class="emoji" draggable="false" alt="⚠️" src="../../${globalThis.pwa ? 'dependencies' : 'node_modules'}/twemoji-asset/assets/72x72/26a0.png">`
			}
			analyze = `<a onclick="cardHtmlShow('${acctId}','${id}')" class="add-show pointer" title="${title}">
							${lang.lang_parse_html}(${domain})${prved}
						</a>${analyze}<br>`
		}
	}
	return analyze
}
export async function cardHtmlShow(acctId: string, idStr: string) {
	const domain = localStorage.getItem('domain_' + acctId)
	const at = localStorage.getItem('acct_' + acctId + '_at')
	const id = $('[toot-id=' + idStr + '] .toot a')
		.parents('.cvo')
		.attr('toot-id')
	const start = `https://${domain}/api/v1/statuses/${id}`
	let analyze
	const jsonRaw = await api(start, {
		method: 'get',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	const json = jsonRaw.card
	if (!json) return
	if (json.provider_name === 'Twitter') {
		const url = json.url
		analyze = `
			<blockquote class="twitter-tweet" data-dnt="true"><strong>${json.author_name}</strong><br>${json.description}<a href="${url}">${json.url}</a></blockquote>
			<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
			`
	}
	$('[toot-id=' + id + '] .additional').html(analyze)
}
//各TL上方のLink[On/Off]
export function cardToggle(tlid: string) {
	const card = localStorage.getItem('card_' + tlid)
	if (!card) {
		localStorage.setItem('card_' + tlid, 'true')
		$('#sta-card-' + tlid).text('Off')
		$('#sta-card-' + tlid).css('color', 'red')
	} else {
		localStorage.removeItem('card_' + tlid)
		$('#sta-card-' + tlid).text('On')
		$('#sta-card-' + tlid).css('color', '#009688')
	}
}
//各TL上方のLink[On/Off]をチェック
export function cardCheck(tlid: number) {
	const card = localStorage.getItem('card_' + tlid)
	if (!card) {
		$('#sta-card-' + tlid).text('On')
		$('#sta-card-' + tlid).css('color', '#009688')
	} else {
		$('#sta-card-' + tlid).text('Off')
		$('#sta-card-' + tlid).css('color', 'red')
	}
}

export function mov(id: string, tlid: string, type: string, rand: string, target: Element, acctId: string) {
	const dropdownTrigger = `dropdown_${rand}`
	let elm = document.querySelector(`#timeline_${tlid} #${dropdownTrigger}`)
	let notfIndvColumn : string | undefined = undefined
	if (tlid === 'notf') {
		const timeline = $(target).parents('.notf-timeline').attr('tlid')
		if (timeline) {
			elm = document.querySelector(`#timeline_${timeline} #${dropdownTrigger}`)
			tlid = timeline
		} else {
			const nTlId = $(target).parents('.notf-timeline').attr('id')
			elm = document.querySelector(`#${nTlId} #${dropdownTrigger}`)
			notfIndvColumn = nTlId
		}
		
	}
	if (elm) {
		const instance = dropdownInitGetInstance(elm)
		if (instance && instance.isOpen) return false
	}

	let click = false
	let tlide = `[tlid=${tlid}]`
	if (notfIndvColumn) {
		tlide = `#${notfIndvColumn}`
	} else if (tlid === 'user') {
		tlide = '#his-data'
	}
	let mouseover = localStorage.getItem('mouseover') || ''
	if (mouseover === 'yes') {
		mouseover = 'hide'
	} else if (mouseover === 'click') {
		if (type === 'mv') {
			mouseover = ''
		} else {
			mouseover = 'hide'
		}
		click = true
	} else if (mouseover === 'no') {
		mouseover = ''
	}
	if (mouseover === 'hide') {
		if (click) {
			$(`${tlide} [unique-id=${id}]`).toggleClass('hide-actions')
		} else {
			$(`${tlide} [unique-id=${id}]`).removeClass('hide-actions')
		}
	}
}

export function resetmv(type: string) {
	let mouseover = localStorage.getItem('mouseover') || ''
	if (mouseover === 'yes') {
		mouseover = 'hide'
	} else if (mouseover === 'no') {
		mouseover = ''
	} else if (mouseover === 'click' && type !== 'mv') {
		mouseover = 'hide'
	}
	if (mouseover === 'hide') {
		$('.cvo').addClass('hide-actions')
	}
}
