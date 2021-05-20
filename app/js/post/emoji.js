//絵文字ピッカー
//最初に読み込む
$('#emoji-before').addClass('disabled')
$('#emoji-next').addClass('disabled')

//絵文字ボタンのトグル
function emojiToggle(reaction) {
	var acct_id = $('#post-acct-sel').val()
	var selin = $('#textarea').prop('selectionStart')
	if (!selin) {
		selin = 0
	}
	if ($('#emoji').hasClass('hide')) {
		$('#emoji').removeClass('hide')
		$('#right-side').show()
		$('#right-side').css('width', '300px')
		$('#left-side').css('width', 'calc(100% - 300px)')
		var width = localStorage.getItem('postbox-width')
		if (width) {
			width = width.replace('px', '') * 1 + 300
		} else {
			width = reaction ? 300 : 600
		}
		$('#post-box').css('width', width + 'px')
		$('#suggest').html('')
		$('#draft').html('')
		if (!localStorage.getItem('emojis_' + acct_id)) {
			var html = `<button class="btn waves-effect green" style="width:100%; padding:0; margin-top:0;" onclick="emojiGet('true');">${lang.lang_emoji_get}</button>`
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
		var width = localStorage.getItem('postbox-width')
		if (width) {
			width = width.replace('px', '') * 1
		} else {
			width = 300
		}
		$('#post-box').css('width', width + 'px')
	}
}

//絵文字リスト挿入
function emojiGet(parse, started) {
	$('#emoji-list').text('Loading...')
	var acct_id = $('#post-acct-sel').val()
	var domain = localStorage.getItem('domain_' + acct_id)
	if (localStorage.getItem('mode_' + domain) != 'misskey') {
		var start = 'https://' + domain + '/api/v1/custom_emojis'
		fetch(start, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		})
			.then(function(response) {
				if (!response.ok) {
					response.text().then(function(text) {
						setLog(response.url, response.status, text)
					})
				}
				return response.json()
			})
			.catch(function(error) {
				todo(error)
				setLog(start, 'JSON', error)
				console.error(error)
			})
			.then(function(json) {
				if (parse == 'true') {
					$('#emoji-list').text('Parsing...')
					var md = {
						categorized: {},
						uncategorized: []
					}
					var if_categorized = false
					Object.keys(json).forEach(function(key) {
						var emoji = json[key]
						if (emoji.visible_in_picker) {
							var listed = true
						} else {
							var listed = false
						}
						if (emoji.category) {
							var cat = emoji.category
							if (!md['categorized'][cat]) {
								md['categorized'][cat] = []
							}
							md['categorized'][cat].push({
								shortcode: emoji.shortcode,
								url: emoji.url,
								listed: listed
							})
							if_categorized = true
						} else {
							md['uncategorized'].push({
								shortcode: emoji.shortcode,
								url: emoji.url,
								listed: listed
							})
						}
					})
					console.log(md)
					//絵文字をマストドン公式と同順にソート
					md['uncategorized'].sort(function(a, b) {
						if (a.shortcode < b.shortcode) return -1
						if (a.shortcode > b.shortcode) return 1
						return 0
					})
					Object.keys(md['categorized']).forEach(function(key) {
						md['categorized'][key].sort(function(a, b) {
							if (a.shortcode < b.shortcode) return -1
							if (a.shortcode > b.shortcode) return 1
							return 0
						})
					})

					md['if_categorized'] = if_categorized
					localStorage.setItem('emojis_' + acct_id, JSON.stringify(md))
					localStorage.setItem(`emojis_raw_${acct_id}`, JSON.stringify(json))
				} else {
					localStorage.setItem('emojis_' + acct_id, JSON.stringify(md))
					localStorage.setItem(`emojis_raw_${acct_id}`, JSON.stringify(json))
				}
				localStorage.setItem('emojiseek', 0)
				if (!started) {
					emojiList('home')
				}
			})
	} else {
		var start = 'https://' + domain + '/api/meta'
		fetch(start, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			}
		})
			.then(function(response) {
				if (!response.ok) {
					response.text().then(function(text) {
						setLog(response.url, response.status, text)
					})
				}
				return response.json()
			})
			.catch(function(error) {
				todo(error)
				setLog(start, 'JSON', error)
				console.error(error)
			})
			.then(function(json) {
				if (json.enableEmojiReaction) {
					localStorage.setItem('emojiReaction_' + acct_id, 'true')
				} else {
					localStorage.setItem('emojiReaction_' + acct_id, 'disabled')
				}
				var emojis = json.emojis
				var md = { uncategorized: [] }
				Object.keys(emojis).forEach(function(key) {
					var emoji = emojis[key]
					md['uncategorized'].push({
						shortcode: emoji.name,
						url: emoji.url,
						listed: true
					})
				})
				md['if_categorized'] = false
				if (parse == 'true') {
					$('#emoji-list').text('Parsing...')
					//絵文字をマストドン公式と同順にソート
					md['uncategorized'].sort(function(a, b) {
						if (a.shortcode < b.shortcode) return -1
						if (a.shortcode > b.shortcode) return 1
						return 0
					})
					localStorage.setItem('emojis_' + acct_id, JSON.stringify(md))
				} else {
					localStorage.setItem('emojis_' + acct_id, JSON.stringify(md))
				}
				localStorage.setItem('emojiseek', 0)
				if (!started) {
					emojiList('home')
				}
			})
	}
}

//リストの描画
function emojiList(target, reaction) {
	$('#now-emoji').text(lang.lang_emoji_custom)
	var acct_id = $('#post-acct-sel').val()
	if(reaction && $('#media').val() == 'misskey') {
		var misskeyReact = true
	} else {
		var misskeyReact = false
	}
	if (
		misskeyReact &&
		localStorage.getItem('emojiReaction_' + acct_id) != 'true'
	) {
		console.error('Disabled')
		clear()
		hide()
		return false
	}
	var start = localStorage.getItem('emojiseek')
	if (target == 'next') {
		var start = start * 1 + 127
		localStorage.setItem('emojiseek', start)
	} else if (target == 'before') {
		var start = start - 127
		localStorage.setItem('emojiseek', start)
	} else {
		var start = 0
		localStorage.getItem('emojiseek', 0)
	}
	var html = ''
	var raw = JSON.parse(localStorage.getItem('emojis_' + acct_id))
	console.log(raw)
	if (raw.if_categorized) {
		var obj = [
			{
				divider: true,
				cat: lang.lang_emoji_uncat
			}
		]
		var cats = raw['uncategorized']
		obj = obj.concat(cats)
		Object.keys(raw['categorized']).forEach(function(key) {
			var cats = raw['categorized'][key]
			obj = obj.concat([
				{
					divider: true,
					cat: key
				}
			])
			obj = obj.concat(cats)
		})
	} else {
		var obj = raw['uncategorized']
	}
	console.log(obj)

	var num = obj.length
	if (num < start) {
		var start = 0
		localStorage.setItem('emojiseek', start)
	}
	var page = Math.ceil(num / 126)
	$('#emoji-sum').text(page)
	var ct = Math.ceil(start / 126)
	if (ct === 0) {
		if (num > 0) {
			var ct = 1
		}
		$('#emoji-before').addClass('disabled')
	} else {
		$('#emoji-before').removeClass('disabled')
	}
	if (page != 1) {
		$('#emoji-next').removeClass('disabled')
	} else {
		$('#emoji-next').addClass('disabled')
	}
	$('#emoji-count').text(ct)
	for (i = start; i < start + 126; i++) {
		var emoji = obj[i]
		if (emoji) {
			if (reaction) {
				if (emoji.divider) {
					html = html + '<p style="margin-bottom:0">' + emoji.cat + '</p>'
				} else {
					if (emoji.listed) {
						if(misskeyReact) {
							var shortcode = `:${emoji.shortcode}:`
						} else {
							var shortcode = emoji.shortcode
						}
						html =
							html +
							`<a onclick="emojiReaction('${shortcode}')" class="pointer"><img src="${emoji.url}" width="20" title="${emoji.shortcode}"></a>`
					}
				}
			} else {
				if (emoji.divider) {
					html = html + '<p style="margin-bottom:0">' + emoji.cat + '</p>'
				} else {
					if (emoji.listed) {
						html =
							html +
							`<a onclick="emojiInsert(':${emoji.shortcode}:')" class="pointer"><img src="${emoji.url}" width="20" title="${emoji.shortcode}"></a>`
					}
				}
			}
		}
	}
	$('#emoji-list').html(html)
}

//絵文字など様々なものをテキストボックスに挿入
function emojiInsert(code, del) {
	if (localStorage.getItem('emoji-zero-width') == 'yes') {
		var blankBefore = '​'
		var blankAfter = '​'
	} else {
		var blankBefore = ' '
		var blankAfter = ' '
	}
	var textarea = document.querySelector('#textarea')
	var sentence = textarea.value
	var len = sentence.length
	var pos = textarea.selectionStart
	if (del) {
		var delLen = del.length
	} else {
		var delLen = 0
	}
	var before = sentence.substr(0, pos - delLen)
	var last = before.substr(-1, 1)
	if (last == ' ') blankBefore = ''
	var after = sentence.substr(pos, len)
	var start = after.substr(0, 1)
	if (start == ' ') blankAfter = ''
	if (len == 0) {
		var word = code
	} else if (len == pos) {
		var word = blankBefore + code
	} else if (pos == 0) {
		var word = code + blankAfter
	} else {
		var word = blankBefore + code + blankAfter
	}
	sentence = before + word + after
	textarea.value = sentence
	textarea.focus()
	textarea.setSelectionRange(pos + word.length, pos + word.length)
}
//改行挿入
function brInsert(code) {
	if (!$('#post-box').hasClass('appear')) {
		localStorage.setItem('nohide', true)
		show()
	}
	var now = $('#textarea').val()
	$('#textarea').val(now + code)
	$('#textarea').focus()
}
