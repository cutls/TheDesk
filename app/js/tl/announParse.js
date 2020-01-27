function announParse(obj, acct_id, tlid) {
	var template = ''
	var datetype = localStorage.getItem('datetype')
	var gif = localStorage.getItem('gif')
	//Ticker
	var tickerck = localStorage.getItem('ticker_ok')
	if (tickerck == 'yes') {
		var ticker = true
	} else if (!ticker || ticker == 'no') {
		var ticker = false
	}
	if (!datetype) {
		datetype = 'absolute'
	}
	if (!gif) {
		var gif = 'yes'
	}
	Object.keys(obj).forEach(function(key) {
		var toot = obj[key]
		var content = toot.content
		if (toot.emojis) {
			Object.keys(toot.emojis).forEach(function(key1) {
				var emoji = toot.emojis[key1]
				var shortcode = emoji.shortcode
				if (gif == 'yes') {
					var emoSource = emoji.url
				} else {
					var emoSource = emoji.static_url
				}
				var emoji_url = `
					<img draggable="false" src="${emoSource}" class="emoji-img" data-emoji="${shortcode}" 
						alt=" :${shortcode}: " title="${shortcode}" onclick="this.classList.toggle('bigemoji');">
				`
				var regExp = new RegExp(':' + shortcode + ':', 'g')
				content = content.replace(regExp, emoji_url)
			})
		}
		content = twemoji.parse(content)
		var reactions = ''
		//既存のリアクション
		if (toot.reactions) {
			Object.keys(toot.reactions).forEach(function(key2) {
				var reaction = toot.reactions[key2]
				//普通の絵文字 or カスタム絵文字 は文字数判断。ただしスコットランド国旗みたいなやべぇやつに注意
				var splitter = new GraphemeSplitter()
				if (splitter.splitGraphemes(reaction.name).length > 1) {
					//カスタム絵文字
					var shortcode = reaction.shortcode
					if (gif == 'yes') {
						var emoSource = reaction.url
					} else {
						var emoSource = reaction.static_url
					}
					var emoji_url = `
					<img draggable="false" src="${emoSource}" class="emoji-img" data-emoji="${shortcode}" 
                        alt=" :${shortcode}: " title="${shortcode}">`
				} else {
					emoji_url = twemoji.parse(reaction.name)
				}
				var addClass = ''
				if (reaction.me) {
					addClass = 'reactioned'
				}
				reactions =
					reactions +
                    `<div class="announReaction ${addClass}" onclick="announReaction('${toot.id}', '${acct_id}', '${tlid}', ${reaction.me},'${reaction.name}')">
                        ${emoji_url} ${reaction.count}
                    </div>`
			})
		}
		if (toot.ends_at) {
			var ended = `<div class="announReaction" title="${date(poll.expires_at, 'absolute')}" style="width: auto; cursor: default;">
            <i class="fas fa-arrow-right"></i>
            ${date(toot.ends_at, datetype)}
        </div>`
		} else {
			var ended = ''
		}

		template =
			template +
			`<div class="announcement">
            ${content}
            <div class="reactionsPack">
                ${reactions}
                <div class="announReaction add" onclick="announReactionNew('${toot.id}', '${acct_id}', '${tlid}')"><i class="fas fa-plus"></i></div>
                ${ended}
            </div>
        </div>`
	})
	return template
}
function announReaction(id, acct_id, tlid, del, name) {
    var at = localStorage.getItem('acct_' + acct_id + '_at')
	var domain = localStorage.getItem('domain_' + acct_id)
	var start = 'https://' + domain + '/api/v1/announcements/' + id + '/reactions/' + encodeURIComponent(name)
    var httpreq = new XMLHttpRequest()
    if(del) {
        var method = 'DELETE'
    } else {
        var method = 'PUT'
    }
	httpreq.open(method, start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
	httpreq.responseType = 'json'
	httpreq.send()
	httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response
			if (this.status !== 200) {
				setLog(start, this.status, this.response)
			}
			announ(acct_id, tlid)
		}
	}
}
function announReactionNew(id, acct_id, tlid) {
    $('#reply').val(id)
	$('#media').val('announcement')
	$('#unreact').hide()
	$('#addreact').removeClass('hide')
	$('#post-acct-sel').val(acct_id)
	$('select').formSelect()
	localStorage.setItem('nohide', true)
	show()
	emojiToggle(true)
	$('#left-side').hide()
}
function emojiReactionDef(target) {
    var emojiraw = newpack.filter(function(item, index) {
		if (item.short_name == target) return true
	})
	var hex = emojiraw[0].unified.split('-')
	if (hex.length === 2) {
		emoji = twemoji.convert.fromCodePoint(hex[0]) + twemoji.convert.fromCodePoint(hex[1])
	} else {
		emoji = twemoji.convert.fromCodePoint(hex[0])
    }
	var acct_id = $('#post-acct-sel').val()
	var id = $('#reply').val()
	announReaction(id, acct_id, 0, false, emoji)
	clear()
	hide()
}