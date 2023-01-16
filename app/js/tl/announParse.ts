import { Announce } from '../../interfaces/MastodonApiReturns'
import { twemojiParse } from '../platform/first'
import GraphemeSplitter from 'grapheme-splitter'
import api from '../common/fetch'
import { formSelectInit } from '../common/declareM'
import { emojiToggle } from '../post/emoji'
import { newpack } from '../emoji/emojiPack'
import twemoji from 'twemoji'
import Swal from 'sweetalert2'
import { clear } from '../post/post'
import { date, isDateType } from './date'
import { announ } from './tl'
import $ from 'jquery'
import { customEmojiReplace } from './parse'
import { hide, show } from '../ui/postBox'

export function announParse(obj: Announce[], acctId: string) {
	let template = ''
	const dateType = localStorage.getItem('datetype') || 'absolute'
	if (!isDateType(dateType)) return
	const gif = localStorage.getItem('gif') || 'yes'
	const isGif = gif === 'yes'
	for (const toot of obj) {
		let content = toot.content
		if (toot.emojis) content = customEmojiReplace(content, toot, isGif)
		content = twemojiParse(content)
		let reactions = ''
		//既存のリアクション
		if (toot.reactions) {
			for (const reaction of toot.reactions) {
				let emojiUrl: string
				//普通の絵文字 or カスタム絵文字 は文字数判断。ただしスコットランド国旗みたいなやべぇやつに注意
				const splitter = new GraphemeSplitter()
				if (splitter.splitGraphemes(reaction.name).length > 1) {
					//カスタム絵文字
					const shortcode = reaction.name
					const emoSource = isGif ? reaction.url : reaction.static_url
					emojiUrl = `
					<img draggable="false" src="${emoSource}" class="emoji-img" data-emoji="${shortcode}" 
                        alt=" :${shortcode}: " title="${shortcode}">`
				} else {
					emojiUrl = twemojiParse(reaction.name)
				}
				const addClass = reaction.me ? 'reactioned' : ''
				reactions =
					reactions +
					`<div class="announReaction ${addClass}" onclick="announReaction('${toot.id}', '${acctId}', ${reaction.me},'${reaction.name}')">
                        ${emojiUrl} ${reaction.count}
                    </div>`
			}
		}
		const ended = toot.ends_at
			? `<div class="announReaction" title="${date(toot.ends_at, 'absolute')}" style="width: auto; cursor: default;">
            <i class="fas fa-arrow-right"></i>
            ${date(toot.ends_at, dateType)}
        </div>`
			: ''

		template =
			template +
			`<div class="announcement" data-id="${toot.id}">
            ${content}
            <div class="reactionsPack">
                ${reactions}
                <div class="announReaction add" onclick="announReactionNew('${toot.id}', '${acctId}')"><i class="fas fa-plus"></i></div>
                ${ended}
            </div>
        </div>`
	}
	return template
}
export async function announReaction(id: string, acctId: string, del: boolean, name: string) {
	const at = localStorage.getItem('acct_' + acctId + '_at')
	const domain = localStorage.getItem('domain_' + acctId)
	const start = `https://${domain}/api/v1/announcements/${id}/reactions/${encodeURIComponent(name)}`
	const method = del ? 'delete' : 'put'
	await api(start, {
		method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + at,
		},
	})
	announ(acctId)
}
export function announReactionNew(id: string, acctId: string) {
	$('#reply').val(id)
	$('#media').val('announcement')
	$('#unreact').hide()
	$('#addreact').removeClass('hide')
	$('#post-acct-sel').val(acctId)
	formSelectInit($('select'))
	localStorage.setItem('nohide', 'true')
	show()
	emojiToggle(true)
	$('#left-side').hide()
}
export function emojiReactionDef(target: string) {
	const emojiRaw = newpack.find(function (item) {
		if (item.short_name === target) return true
	})
	if (!emojiRaw) return
	const hex = emojiRaw.unified.split('-')
	let emoji = twemoji.convert.fromCodePoint(hex[0])
	if (hex.length === 2) {
		emoji = twemoji.convert.fromCodePoint(hex[0]) + twemoji.convert.fromCodePoint(hex[1])
	}
	const acctId = $('#post-acct-sel').val()?.toString()
	const id = $('#reply').val()?.toString()
	if (!id || !acctId) return Swal.fire('Error')
	announReaction(id, acctId, false, emoji)
	clear()
	hide()
}
