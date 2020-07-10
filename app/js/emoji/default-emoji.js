const defaultemojiList = ['activity', 'flag', 'food', 'nature', 'object', 'people', 'place', 'symbol']
const defaultemoji = {
	activity: activity,
	flag: flag,
	food: food,
	nature: nature,
	object: object,
	people: people,
	place: place,
	symbol: symbol
}
let defaultemojiname = {
	activity: 'Activities',
	flag: 'Flags',
	food: 'Foods',
	nature: 'Nature',
	object: 'Tools',
	people: 'People',
	place: 'Places',
	symbol: 'Symbols'
}
if (lang == 'ja') {
	defaultemojiname = {
		activity: '活動',
		flag: '国旗',
		food: '食べ物',
		nature: '自然',
		object: 'もの',
		people: 'ひと',
		place: '場所',
		symbol: '記号'
	}
}

function defaultEmoji(target) {
	let announcement = false
	if (document.querySelector('#media').value == 'announcement') {
		announcement = true
	}
	const json = defaultemoji[target]
	const keymap = Object.keys(json)
	let emojis = ''
	for (let i = 0; i < json.length; i++) {
		const key = keymap[i]
		const emoji = json[key]
		let def = `<a data-shortcode="${emoji['shortcode']}" class="pointer defEmoji">`
		if (announcement) {
			def = `<a data-shortcode="${emoji['shortcode']}" class="pointer defEmoji">`
		}
		emojis =
			emojis +
			`${def}
            <span style="
                width: 20px; height: 20px; display: inline-block; background-image: url('../../img/sheet.png'); background-size: 4900%;
                 background-position:${emoji['css']};"></span>
            </a>`
	}
	document.querySelector('#emoji-list').innerHTML = emojis
	document.querySelector('#now-emoji').innerText = lang.lang_defaultemojis_text.replace('{{cat}}', defaultemojiname[target])
	document.querySelector('.emoji-control').classList.add('hide')
	const targets = document.querySelectorAll('.defEmoji')
	for (let j = 0; j < targets.length; j++) {
		const target = targets[j]
		const sc = target.getAttribute('data-shortcode')
		target.addEventListener('click', () => defEmoji(sc))
	}
}

function customEmoji() {
	document.querySelector('#emoji-suggest').value = ''
	document.querySelector('.emoji-control').classList.remove('hide')
	emojiList('home')
}

function defEmoji(target) {
	const textarea = document.querySelector('#textarea')
	let selin = textarea.selectionStart
	if (!selin) {
		selin = 0
	}
	const hex = emojipack[target].unified.split('-')
	let emoji = twemoji.convert.fromCodePoint(hex[0])
	if (hex.length === 2) {
		emoji = twemoji.convert.fromCodePoint(hex[0]) + twemoji.convert.fromCodePoint(hex[1])
	}
	const now = textarea.value
	const before = now.substr(0, selin)
	const after = now.substr(selin, now.length)
	const newt = before + emoji + after
	textarea.value = newt
	textarea.focus()
}
