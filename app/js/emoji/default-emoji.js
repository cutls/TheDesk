var defaultemojiList = ['activity', 'flag', 'food', 'nature', 'object', 'people', 'place', 'symbol']
var defaultemoji = {
	activity: activity,
	flag: flag,
	food: food,
	nature: nature,
	object: object,
	people: people,
	place: place,
	symbol: symbol
}
if (lang == 'ja') {
	var defaultemojiname = {
		activity: '活動',
		flag: '国旗',
		food: '食べ物',
		nature: '自然',
		object: 'もの',
		people: 'ひと',
		place: '場所',
		symbol: '記号'
	}
} else {
	var defaultemojiname = {
		activity: 'Activities',
		flag: 'Flags',
		food: 'Foods',
		nature: 'Nature',
		object: 'Tools',
		people: 'People',
		place: 'Places',
		symbol: 'Symbols'
	}
}

function defaultEmoji(target) {
    var announcement = false
    if ($('#media').val() == 'announcement') {
        announcement = true
    }
	var json = defaultemoji[target]
	var emojis = ''
	Object.keys(json).forEach(function(key) {
        var emoji = json[key]
        if (announcement) {
            var def = `<a onclick="emojiReactionDef('${emoji['shortcode']}')" class="pointer">`
        } else {
            var def = `<a onclick="defEmoji('${emoji['shortcode']}')" class="pointer">`
        }
		emojis =
			emojis +
			`${def}
            <span style="
                width: 1.538rem; height: 1.538rem; display: inline-block; background-image: url('../../img/sheet.png'); background-size: 4900%;
                 background-position:${emoji['css']};"></span>
            </a>`
	})
	$('#emoji-list').html(emojis)
	$('#now-emoji').text(lang.lang_defaultemojis_text.replace('{{cat}}', defaultemojiname[target]))
	$('.emoji-control').addClass('hide')
}
function customEmoji() {
	$('#emoji-suggest').val('')
	$('.emoji-control').removeClass('hide')
	emojiList('home')
}
function defEmoji(target) {
	var selin = $('#textarea').prop('selectionStart')
	if (!selin) {
		selin = 0
	}
	var emojiraw = newpack.filter(function(item, index) {
		if (item.short_name == target) return true
	})
	var hex = emojiraw[0].unified.split('-')
	if (hex.length === 2) {
		emoji = twemoji.convert.fromCodePoint(hex[0]) + twemoji.convert.fromCodePoint(hex[1])
	} else {
		emoji = twemoji.convert.fromCodePoint(hex[0])
	}
	var now = $('#textarea').val()
	var before = now.substr(0, selin)
	var after = now.substr(selin, now.length)
	newt = before + emoji + after
	$('#textarea').val(newt)
	$('#textarea').focus()
}
function faicon() {
	var json = faicons
	var emojis = ''
	Object.keys(json).forEach(function(key) {
		var emoji = json[key]
		var eje = emoji.replace(/fa-/g, '')
		emojis =
			emojis +
			'<a onclick="emojiInsert(\'[faicon]' +
			eje +
			'[/faicon]\')" class="pointer white-text" style="font-size:1.8rem"><i class="fa ' +
			emoji +
			'"></i></a>'
	})
	$('#emoji-list').html(emojis)
	$('#now-emoji').text('faicon')
	$('.emoji-control').addClass('hide')
}
