//カード処理やメンション、ハッシュタグの別途表示
//全てのTL処理で呼び出し
function additional(acct_id, tlid) {
	//メンション系
	//$(".mention").attr("href", "");

	$('#timeline-container .mention').addClass('parsed')

	$('#timeline-container .hashtag, #timeline-container [rel=tag]').each(function(i, elem) {
		var tags = $(this)
			.attr('href')
			.match(/https?:\/\/([-a-zA-Z0-9@.]+)\/tags?\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/)
		if (tags) {
			var tagThis = tags[2]
		} else {
			var tagThis = $(this).attr('data-regTag')
		}

		if (tagThis) {
			$(this).attr('href', "javascript:tagShow('" + tagThis + "')")
			
		}
	})

	//トゥートサムネ
	$('#timeline_' + tlid + ' .toot a:not(.parsed)').each(function(i, elem) {
		var text = $(this).attr('href')
		if (text) {
			if (text.indexOf('twimg.com') === -1) {
				var urls = text.match(
					/https?:\/\/([-a-zA-Z0-9@.]+)\/media\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/
				)
			}
		} else {
			text = ''
			var urls = []
		}

		//トゥートのURLぽかったら
		toot = text.match(/https:\/\/([a-zA-Z0-9.-]+)\/@([a-zA-Z0-9_]+)\/([0-9]+)/)
		if (toot) {
			if (toot[1]) {
				$(this).attr('data-acct', acct_id)
			}
		}
		if (urls) {
			$(this).remove()
		} else {
			$(this).attr('title', text)
		}
	})
	$('i.unparsed').each(function(i, elem) {
		var dem = $(this).text()
		var dom = $(this)
		var start = './js/emoji/emoji-map.json'
		var xmlHttpRequest = new XMLHttpRequest()
		xmlHttpRequest.onreadystatechange = function() {
			if (this.readyState === 4 && this.status === 200) {
				if (this.response) {
					var json = this.response
					if (this.status !== 200) {
						setLog(start, this.status, this.response)
					}
					var emojis = json.emojis
					for (i = 0; i < emojis.length; i++) {
						var emojie = emojis[i]
						var regExp = new RegExp(dem, 'g')
						if (emojie.emoji.match(regExp)) {
							var sc = emojie.name
							var sc = 'twa-' + sc.replace(/_/g, '-')
							dom.addClass(sc)
							dom.text('')
							dom.removeClass('unparsed')
							break
						}
					}
				}
			}
		}
		xmlHttpRequest.open('GET', start, true)
		xmlHttpRequest.responseType = 'json'
		xmlHttpRequest.send(null)
	})

	$('#timeline_' + tlid + ' .toot:not(:has(a:not(.add-show,.parsed)))').each(function(i, elem) {
		$(this)
			.parent()
			.find('.add-show')
			.hide()
	})
	//Markdownイメージビューワー
	$('#timeline_' + tlid + ' .toot a:not(.img-parsed):has(img)').each(function(i, elem) {
		var ilink = $(this).attr('href')
		var id = $(this)
			.parents('.cvo')
			.attr('toot-id')
		$(this).attr('href', `javascript:imgv('${id}','${i}')`)
		$(this).attr('data-type', 'image')
		$(this).attr('id', id + '-image-' + i)
		$(this).attr('data-url', ilink)
		$(this).addClass('img-parsed')
	})
}

function additionalIndv(tlid, acct_id, id) {
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var text = $('[toot-id=' + id + '] .toot a').attr('href')
	var urls = text.match(
		/https?:\/\/([-a-zA-Z0-9@.]+)\/media\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/
	)
	if (urls) {
		$('[toot-id=' + id + '] .toot a').remove()
	} else {
		if (localStorage.getItem('mode_' + domain) == 'misskey') {
			var start = 'https://' + domain + '/url?url=' + text
			fetch(start, {
				method: 'GET',
				headers: {
					'content-type': 'application/json'
				}
				//body: JSON.stringify({})
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
					if (json.title) {
						$('[toot-id=' + id + '] .additional').html(
							`<span class="gray">URL${lang.lang_cards_check}:<br>Title:${escapeHTML(
								json.title
							)}<br>${escapeHTML(json.description)}</span>`
						)
						$('[toot-id=' + id + '] a:not(.parsed)').addClass('parsed')
						$('[toot-id=' + id + ']').addClass('parsed')
					}
				})
		} else {
			var id = $('[toot-id=' + id + '] .toot a')
				.parents('.cvo')
				.attr('toot-id')
			var start = 'https://' + domain + '/api/v1/statuses/' + id
			fetch(start, {
				method: 'GET',
				headers: {
					'content-type': 'application/json',
					Authorization: 'Bearer ' + at
				}
				//body: JSON.stringify({})
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
					cards = json.card
					var analyze = cardHtml(cards, acct_id, id)
					$('[toot-id=' + id + '] .additional').html(analyze)
					if (json.title) {
						$('[toot-id=' + id + '] a:not(.parsed)').addClass('parsed')
						$('[toot-id=' + id + ']').addClass('parsed')
					}
				})
		}
	}
}
function cardHtml(json, acct_id, id) {
	var analyze = ''
	var domain = json.url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1];
	var ok = [
		"pixiv.net",
		"twitter.com",
		"mobile.twitter.com",
		"open.spotify.com",
		"youtube.com",
		"youtu.be",
		"m.youtube.com",
		"www.youtube.com",
		"nicovideo.jp",
		"twitcasting.tv"
	]
	var isHad = _.includes(ok, domain);
	if (json.provider_name == 'pixiv') {
		if (json.image) {
			var pxvImg = `
			<br><img src="${json.image}" style="max-width:100%" 
					onclick="imgv('pixiv_${id}',0,'pixiv')" id="pixiv_${id}-image-0" 
					data-url="${json.embed_url}" 
				data-type="image">
			`
		} else {
			var pxvImg = ''
		}
		analyze = `<div class="pixiv-post"><b><a href="
				${json.author_url}
				" target="_blank">
				${escapeHTML(json.author_name)}
				</a></b><br>
				${escapeHTML(json.title)}
				${pxvImg}
				</div>`
	} else {
		if (json.title) {
			analyze = `<span class="gray">URL
					${lang.lang_cards_check}
					:<br>Title:
					${escapeHTML(json.title)}
					<br>
					${escapeHTML(json.description)}
					</span>`
		}

		if (json.html || json.provider_name == 'Twitter') {
			if(isHad) {
				var prved = `<img class="emoji" draggable="false" alt="✅" 
					src="https://twemoji.maxcdn.com/v/12.1.3/72x72/2705.png">`
				var title = lang.lang_cards_trusted
			}else{
				var prved = '<img class="emoji" draggable="false" alt="⚠️" src="https://twemoji.maxcdn.com/v/12.1.4/72x72/26a0.png">'
				var title = lang.lang_cards_untrusted
			}
			analyze =`<a onclick="cardHtmlShow('${acct_id}','${id}')" class="add-show pointer" title="${title}">
			${lang.lang_parse_html}(${domain})${prved}
			</a>${analyze}<br>`
		}
	}
	return analyze
}
function cardHtmlShow(acct_id, id) {
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var text = $('[toot-id=' + id + '] .toot a').attr('href')
	var urls = text.match(
		/https?:\/\/([-a-zA-Z0-9@.]+)\/media\/([-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/
	)
	var id = $('[toot-id=' + id + '] .toot a')
		.parents('.cvo')
		.attr('toot-id')
	var start = 'https://' + domain + '/api/v1/statuses/' + id
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
		//body: JSON.stringify({})
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
			json = json.card
			if (json.html) {
				analyze =
					json.html +
					`<i class="material-icons sml pointer" onclick="pip('
								${id}
								')" title="
								${lang.lang_cards_pip}
								">picture_in_picture_alt</i>`
			}
			if (json.provider_name == 'Twitter') {
				var url = json.author_url
				var status = json.url.match(/^https:\/\/twitter.com\/[_a-zA-Z0-9-]+\/status\/([0-9]+)/);
				var statusId = false
				if(status){
					if(status.length > 0){
						var statusId = status[1]
					}
				}
				console.log(statusId)
				if(statusId){
					url = json.url
					analyze = `
					<blockquote class="twitter-tweet" data-dnt="true"><strong>${json.author_name}</strong><br>${json.description}<a href="${url}">${json.url}</a></blockquote>
					<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 
					`
				}
			}
			$('[toot-id=' + id + '] .additional').html(analyze)
		})
}
//各TL上方のLink[On/Off]
function cardToggle(tlid) {
	var card = localStorage.getItem('card_' + tlid)
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
function cardCheck(tlid) {
	var card = localStorage.getItem('card_' + tlid)
	if (!card) {
		$('#sta-card-' + tlid).text('On')
		$('#sta-card-' + tlid).css('color', '#009688')
	} else {
		$('#sta-card-' + tlid).text('Off')
		$('#sta-card-' + tlid).css('color', 'red')
	}
}

function mov(id, tlid, type) {
	const dropdownTrigger = `dropdown_${tlid}_${id}`
	const elm = document.getElementById(dropdownTrigger)
	const instance = M.Dropdown.getInstance(elm)
	if(instance) {
		if(instance.isOpen) return false
	}
	
	var click = false
	if (tlid == 'notf') {
		var tlide = '[data-notf=' + acct_id + ']'
	} else if (tlid == 'user') {
		var tlide = '#his-data'
	} else {
		var tlide = '[tlid=' + tlid + ']'
	}
	var mouseover = localStorage.getItem('mouseover')
	if (!mouseover) {
		mouseover = ''
	}
	if (mouseover == 'yes') {
		mouseover = 'hide'
	} else if (mouseover == 'click') {
		if (type == 'mv') {
			mouseover = ''
		} else {
			mouseover = 'hide'
		}
		click = true
	} else if (mouseover == 'no') {
		mouseover = ''
	}
	if (mouseover == 'hide') {
		if (click) {
			$(tlide + ' [unique-id=' + id + ']').toggleClass('hide-actions')
		} else {
			$(tlide + ' [unique-id=' + id + ']').removeClass('hide-actions')
		}

		//$(tlide + " [toot-id=" + id + "] .area-vis").toggleClass("hide")
		//$(tlide + " [toot-id=" + id + "] .area-actions").toggleClass("hide")
		//$(tlide + " [toot-id=" + id + "] .area-side").toggleClass("hide")
	}
}

function resetmv(type) {
	var mouseover = localStorage.getItem('mouseover')
	if (!mouseover) {
		mouseover = ''
	} else if (mouseover == 'yes') {
		mouseover = 'hide'
	} else if (mouseover == 'no') {
		mouseover = ''
	} else if (mouseover == 'click' && type != 'mv') {
		mouseover = 'hide'
	}
	if (mouseover == 'hide') {
		$('.cvo').addClass('hide-actions')
		//$(".area-vis").addClass("hide");
		//$(".area-actions").addClass("hide");
		//$(".area-side").addClass("hide");
	}
}
