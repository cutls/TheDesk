//タグ表示
if (location.search) {
	var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/)
	var mode = m[1]
	var codex = m[2]
	if (mode == 'tag') {
		var acct_id = localStorage.getItem('main')
		tl('tag', decodeURI(codex), acct_id, 'add')
	}
}
//よく使うタグ
function tagShow(tag, elm) {
	tag = decodeURIComponent(tag)
	const tagTL = lang.lang_parse_tagTL.replace('{{tag}}', '#' + tag)
	const tagPin = lang.lang_parse_tagpin.replace('{{tag}}', '#' + tag)
	const tagToot = lang.lang_parse_tagtoot.replace('{{tag}}', '#' + tag)
	$('#tagCMTL').text(tagTL)
	$('#tagCMPin').text(tagPin)
	$('#tagCMToot').text(tagToot)
	const acct_id = $(elm).parents('.tl').attr('data-acct')
	const rect = elm.getBoundingClientRect()
	$('#tagContextMenu').css('top', `calc(${rect.top}px + 1rem)`)
	$('#tagContextMenu').css('left', `${rect.left}px`)
	$('#tagContextMenu').attr('data-tag', tag)
	$('#tagContextMenu').attr('data-acct', acct_id)
	$('#tagContextMenu').removeClass('hide')
	setTimeout(() => tShowBox('open'), 500)
}
function tShowBox(mode) {
	if (mode == 'open') {
		$('#tagContextMenu').removeClass('hide')
	} else if (mode == 'close') {
		if (!$('#tagContextMenu').hasClass('hide')) $('#tagContextMenu').addClass('hide')
		$('#tagContextMenu').removeClass('keep')
	} else {
		$('#tagContextMenu').toggleClass('hide')
	}
}
function doTShowBox(type) {
	$('#tagContextMenu').addClass('hide')
	$('#tagContextMenu').removeClass('keep')
	const q = $('#tagContextMenu').attr('data-tag')
	const acct_id = $('#tagContextMenu').attr('data-acct')
	if (type == 'tl') {
		tl('tag', q, acct_id, 'add')
	} else if (type == 'toot') {
		brInsert(`#${q}`)
	} else if (type == 'pin') {
		tagPin(q)
	} else if (type == 'f') {
		tagFeature(q, acct_id)
	}
}
//タグ追加
function tagPin(tag) {
	var tags = localStorage.getItem('tag')
	if (!tags) {
		var obj = []
	} else {
		var obj = JSON.parse(tags)
	}
	var can
	Object.keys(obj).forEach(function (key) {
		var tagT = obj[key]
		if (tagT == tag) {
			can = true
		} else {
			can = false
		}
	})
	if (!can) {
		obj.push(tag)
	}
	var json = JSON.stringify(obj)
	localStorage.setItem('tag', json)
	favTag()
}
//タグ削除
function tagRemove(key) {
	var tags = localStorage.getItem('tag')
	var obj = JSON.parse(tags)
	obj.splice(key, 1)
	var json = JSON.stringify(obj)
	localStorage.setItem('tag', json)
	favTag()
}
function favTag() {
	$('#taglist').html('')
	var tagarr = localStorage.getItem('tag')
	if (!tagarr) {
		var obj = []
	} else {
		var obj = JSON.parse(tagarr)
	}
	var tags = ''
	var nowPT = localStorage.getItem('stable')
	Object.keys(obj).forEach(function (key) {
		var tag = obj[key]
		if (nowPT != tag) {
			console.log('stable tags:' + nowPT + '/' + tag)
			var ptt = lang.lang_tags_realtime
			var nowon = ''
		} else {
			var ptt = lang.lang_tags_unrealtime
			var nowon = '(' + lang.lang_tags_realtime + ')'
		}
		tag = escapeHTML(tag)
		tags =
			tags +
			`<a onclick="tagShowHorizon('${tag}')" class="pointer">#${tag}</a>
			${nowon}<span class="hide" data-tag="${tag}" data-regTag="${tag.toLowerCase()}">　
			<a onclick=\"tagTL('tag','${tag}',false,'add')" class="pointer" title="${lang.lang_parse_tagTL.replace('{{tag}}', '#' + tag)}">
				TL
			</a>
			<a onclick="brInsert('#${tag}')" class="pointer" title="${lang.lang_parse_tagtoot.replace('{{tag}}', '#' + tag)}">
				Toot
			</a>
			<a onclick="autoToot('${tag}');" class="pointer" title="${lang.lang_tags_always}${lang.lang_parse_tagtoot.replace('{{tag}}', '#' + tag)}">
				${ptt}
			</a>
			<a onclick="tagRemove('${key}')" class="pointer" title="${lang.lang_tags_tagunpin.replace('{{tag}}', '#' + tag)}">
				${lang.lang_del}
			</a>
			</span> `
	})
	if (obj.length > 0) {
		$('#taglist').append('My Tags: ' + tags)
	} else {
		$('#taglist').append('')
	}
}
function tagShowHorizon(tag) {
	$('[data-regTag=' + decodeURI(tag).toLowerCase() + ']').toggleClass('hide')
}
function trendTag() {
	$('.trendtag').remove()
	var domain = 'imastodon.net'
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var start = 'https://' + domain + '/api/v1/trend_tags'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function (json) {
			if (json) {
				var tags = ''
				json = json.score
				Object.keys(json).forEach(function (tag) {
					tag = escapeHTML(tag)
					tags =
						tags +
						`<a onclick="tagShow('${tag}', this)" class="pointer">#${tag}</a>
						<span class="hide" data-tag="${tag}" data-regTag="${tag.toLowerCase()}">　
						<a onclick=\"tagTL('tag','${tag}',false,'add')" class="pointer" title="#${tag}のタイムライン">TL</a>　
						<a onclick="show();brInsert('#${tag}')" class="pointer" title="#${tag}でトゥート">
							Toot
						</a>
						</span> `
				})
				$('#taglist').append(
					'<div class="trendtag">アイマストドントレンドタグ<i class="material-icons pointer" onclick="trendTag()" style="font-size:12px">refresh</i>:' +
					tags +
					'</div>'
				)
				trendintervalset()
			} else {
				$('#taglist').html('')
			}
		})
}

function trendintervalset() {
	setTimeout(trendTag, 6000000)
}
function tagTL(a, b, c, d) {
	var acct_id = $('#post-acct-sel').val()
	tl(a, b, acct_id, d)
}
function autoToot(tag) {
	tag = escapeHTML(tag)
	var nowPT = localStorage.getItem('stable')
	if (nowPT == tag) {
		localStorage.removeItem('stable')
		M.toast({ html: lang.lang_tags_unrealtime, displayLength: 3000 })
	} else {
		localStorage.setItem('stable', tag)
		M.toast({
			html: lang.lang_tags_tagwarn.replace('{{tag}}', tag).replace('{{tag}}', tag),
			displayLength: 3000
		})
		brInsert('#' + tag + ' ')
	}
	favTag()
}
//タグをフィーチャー
function tagFeature(name, acct_id) {
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var start = 'https://' + domain + '/api/v1/featured_tags'
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		},
		body: JSON.stringify({
			name: name
		})
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			return false
		})
		.then(function (json) {
			console.log(json)
			M.toast({ html: 'Complete: ' + escapeHTML(name), displayLength: 3000 })
		})
}
//タグのフィルタ
function addTag(id) {
	var columns = JSON.parse(localStorage.getItem('column'))
	var column = columns[id]
	if (!column.data.name) {
		var name = column.data
	} else {
		var name = column.data.name
	}
	var col = localStorage.getItem('column')
	var o = JSON.parse(col)
	var obj = o[id]
	obj.data = {
		'name': name,
		'all': $(`#all_tm-${id}`).val(),
		'any': $(`#any_tm-${id}`).val(),
		'none': $(`#none_tm-${id}`).val(),
	}
	o[id] = obj
	var json = JSON.stringify(o)
	console.log(json)
	localStorage.setItem('column', json)
	columnReload(id, 'tag')
}

