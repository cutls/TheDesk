import lang from '../common/lang'
import * as emojiPack from './emojiPack'
import twemoji from 'twemoji'
import $ from 'jquery'
import { emojiList } from '../post/emoji'
const defaultEmojiDict = {
	activity: emojiPack.activity,
	flag: emojiPack.flag,
	food: emojiPack.food,
	nature: emojiPack.nature,
	object: emojiPack.object,
	people: emojiPack.people,
	place: emojiPack.place,
	symbol: emojiPack.symbol,
}
function getEmojiName(target: string) {
	if (globalThis.useLang === 'ja') {
		const defaultEmojiName = {
			activity: '活動',
			flag: '国旗',
			food: '食べ物',
			nature: '自然',
			object: 'もの',
			people: 'ひと',
			place: '場所',
			symbol: '記号',
		}
		return defaultEmojiName[target]
	} else {
		const defaultEmojiName = {
			activity: 'Activities',
			flag: 'Flags',
			food: 'Foods',
			nature: 'Nature',
			object: 'Tools',
			people: 'People',
			place: 'Places',
			symbol: 'Symbols',
		}
		return defaultEmojiName[target]
	}
}

export function defaultEmoji(target: keyof typeof defaultEmojiDict) {
	const announcement = $('#media').val() === 'announcement'
	const json = defaultEmojiDict[target]
	let emojis = ''
	for (const emoji of json) {
		const def = `<a onclick="${announcement ? 'emojiReactionDef' : 'defEmoji'}('${emoji.shortcode}')" class="pointer">`
		emojis =
			emojis +
			`${def}
            <span style="
                width: 20px; height: 20px; display: inline-block; background-image: url('../../img/sheet.png'); background-size: 4900%;
                 background-position:${emoji.css};"></span>
            </a>`
	}
	$('#emoji-list').html(emojis)
	$('#now-emoji').text(lang.lang_defaultemojis_text.replace('{{cat}}', getEmojiName(target)))
	$('.emoji-control').addClass('hide')
}
export function customEmoji() {
	$('#emoji-suggest').val('')
	$('.emoji-control').removeClass('hide')
	emojiList('home', false)
}
export function defEmoji(target: string) {
	const selin = parseInt($('#textarea').prop('selectionStart'), 10) || 0
	const emojiraw = emojiPack.newpack.filter(function (item) {
		if (item.short_name === target) return true
	})
	const hex = emojiraw[0].unified.split('-')
	let emoji = twemoji.convert.fromCodePoint(hex[0])
	if (hex.length === 2) emoji = twemoji.convert.fromCodePoint(hex[0]) + twemoji.convert.fromCodePoint(hex[1])
	const now = $('#textarea').val()?.toString() || ''
	const before = now.substr(0, selin)
	const after = now.substr(selin, now.length)
	const newt = before + emoji + after
	$('#textarea').val(newt)
	$('#textarea').focus()
}
