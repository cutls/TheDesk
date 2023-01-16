//絵文字ピッカー
import $ from 'jquery'
import { Emoji } from '../../interfaces/MastodonApiReturns'
import { IEmojiStorage } from '../../interfaces/Storage'
import api from '../common/fetch'
import lang from '../common/lang'
import { show } from '../ui/postBox'
//絵文字ボタンのトグル
export function emojiToggle(reaction: boolean) {
	const acctId = $('#post-acct-sel').val()
	if ($('#emoji').hasClass('hide')) {
		$('#emoji').removeClass('hide')
		$('#right-side').show()
		$('#right-side').css('width', '300px')
		$('#left-side').css('width', 'calc(100% - 300px)')
		let width = parseInt(localStorage.getItem('postbox-width')?.toString().replace('px', '') || '0', 10)
		if (width) {
			width = width * 1 + 300
		} else {
			width = reaction ? 300 : 600
		}
		$('#post-box').css('width', width + 'px')
		$('#suggest').html('')
		$('#draft').html('')
		if (!localStorage.getItem('emojis_' + acctId)) {
			const html = `<button class="btn waves-effect green" style="width:100%; padding:0; margin-top:0;" onclick="emojiGet(true);">${lang.lang_emoji_get}</button>`
			$('#emoji-list').html(html)
		} else {
			emojiList('home', reaction)
		}
	} else {
		$('#poll').addClass('hide')
		$('#draft').addClass('hide')
		$('#right-side').hide()
		$('#right-side').css('width', '300px')
		$('#emoji').addClass('hide')
		$('#suggest').html('')
		$('#draft').html('')
		$('#left-side').css('width', '100%')
		const width = parseInt(localStorage.getItem('postbox-width')?.toString().replace('px', '') || '300', 10)
		$('#post-box').css('width', width + 'px')
	}
}

//絵文字リスト挿入

export async function emojiGet() {
	$('#emoji-list').text('Loading...')
	const acctId = $('#post-acct-sel').val()
	const domain = localStorage.getItem('domain_' + acctId)
	const start = `https://${domain}/api/v1/custom_emojis`
	const json = await api<Emoji[]>(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
		},
	})
	$('#emoji-list').text('Parsing...')
	const md: IEmojiStorage = {
		categorized: {},
		uncategorized: [],
		ifCategorized: false,
	}
	let ifCategorized = false
	for (const emoji of json) {
		const listed = emoji.visible_in_picker || true
		if (emoji.category) {
			const cat = emoji.category
			if (!md.categorized[cat]) {
				md.categorized[cat] = []
			}
			md.categorized[cat].push({
				shortcode: emoji.shortcode,
				url: emoji.url,
				listed: listed,
			})
			ifCategorized = true
		} else {
			md.uncategorized.push({
				shortcode: emoji.shortcode,
				url: emoji.url,
				listed: listed,
			})
		}
	}
	//絵文字をマストドン公式と同順にソート
	md.uncategorized.sort(function (a, b) {
		if (a.shortcode < b.shortcode) return -1
		if (a.shortcode > b.shortcode) return 1
		return 0
	})
	for (const key of Object.keys(md.categorized)) {
		md.categorized[key].sort(function (a, b) {
			if (a.shortcode < b.shortcode) return -1
			if (a.shortcode > b.shortcode) return 1
			return 0
		})
	}

	md.ifCategorized = ifCategorized
	localStorage.setItem('emojis_' + acctId, JSON.stringify(md))
	localStorage.setItem(`emojis_raw_${acctId}`, JSON.stringify(json))
	localStorage.setItem('emojiseek', '0')
	emojiList('home')
}

//リストの描画
export function emojiList(target: 'next' | 'before' | 'home', reaction?: boolean) {
	$('#now-emoji').text(lang.lang_emoji_custom)
	const acctId = $('#post-acct-sel').val()
	let start = parseInt(localStorage.getItem('emojiseek') || '0', 10)
	if (target === 'next') {
		start = start * 1 + 127
	} else if (target === 'before') {
		start = start - 127
	} else {
		start = 0
	}
	localStorage.setItem('emojiseek', start.toString())
	let html = ''
	const raw: IEmojiStorage = JSON.parse(localStorage.getItem('emojis_' + acctId) || '{}')
	if (raw.ifCategorized === undefined) return
	let obj: any
	if (raw.ifCategorized) {
		obj = [
			{
				divider: true,
				cat: lang.lang_emoji_uncat,
			},
		]
		const cats = raw.uncategorized
		obj = obj.concat(cats)
		for (const [key, cats] of Object.entries(raw.categorized)) {
			obj = obj.concat([
				{
					divider: true,
					cat: key,
				},
			])
			obj = obj.concat(cats)
		}
	} else {
		obj = raw.uncategorized
	}

	const num = obj.length
	if (num < start) localStorage.setItem('emojiseek', '0')
	if (num < start) start = 0
	const page = Math.ceil(num / 126)
	$('#emoji-sum').text(page)
	let ct = Math.ceil(start / 126)
	if (ct === 0) {
		if (num > 0) ct = 1
		$('#emoji-before').addClass('disabled')
	} else {
		$('#emoji-before').removeClass('disabled')
	}
	if (page !== 1) {
		$('#emoji-next').removeClass('disabled')
	} else {
		$('#emoji-next').addClass('disabled')
	}
	$('#emoji-count').text(ct)
	for (let i = start; i < start + 126; i++) {
		const emoji = obj[i]
		if (emoji) {
			if (reaction) {
				if (emoji.divider) {
					html = html + '<p style="margin-bottom:0">' + emoji.cat + '</p>'
				} else {
					if (emoji.listed) {
						const shortcode = emoji.shortcode
						html = html + `<a onclick="emojiReaction('${shortcode}')" class="pointer"><img src="${emoji.url}" width="20" title="${emoji.shortcode}"></a>`
					}
				}
			} else {
				if (emoji.divider) {
					html = html + `<p style="margin-bottom:0">${emoji.cat}</p>`
				} else {
					if (emoji.listed) {
						html = html + `<a onclick="emojiInsert(':${emoji.shortcode}:')" class="pointer"><img src="${emoji.url}" width="20" title="${emoji.shortcode}"></a>`
					}
				}
			}
		}
	}
	$('#emoji-list').html(html)
}

//絵文字など様々なものをテキストボックスに挿入
export function emojiInsert(code: string, del?: string) {
	const isUseZeroWidth = localStorage.getItem('emoji-zero-width') === 'yes'
	let blankBefore = isUseZeroWidth ? ' ' : '​'
	let blankAfter = isUseZeroWidth ? ' ' : '​'
	const textarea = <HTMLInputElement>document.querySelector('#textarea')
	let sentence = textarea.value
	const len = sentence.length
	const pos = textarea.selectionStart || 0
	const delLen = del ? del.length : 0
	const before = sentence.substr(0, pos - delLen)
	const last = before.substr(-1, 1)
	if (last === ' ') blankBefore = ''
	const after = sentence.substr(pos, len)
	const start = after.substr(0, 1)
	if (start === ' ') blankAfter = ''
	let word = blankBefore + code + blankAfter
	if (len === 0) {
		word = code
	} else if (len === pos) {
		word = blankBefore + code
	} else if (pos === 0) {
		word = code + blankAfter
	}
	sentence = before + word + after
	textarea.value = sentence
	textarea.focus()
	textarea.setSelectionRange(pos + word.length, pos + word.length)
}
//改行挿入
export function brInsert(code: string) {
	if (!$('#post-box').hasClass('appear')) {
		localStorage.setItem('nohide', 'true')
		show()
	}
	const now = $('#textarea').val()
	$('#textarea').val(now + code)
	$('#textarea').focus()
}
