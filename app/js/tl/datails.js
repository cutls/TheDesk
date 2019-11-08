//トゥートの詳細
function details(id, acct_id, tlid, mode) {
	if (mode == 'dm') {
		$('.dm-hide').hide()
	} else {
		$('.dm-hide').show()
	}
	$('.toot-reset').html('<span class="no-data">' + lang.lang_details_nodata + '</span>')
	var html = $('#timeline_' + tlid + ' [toot-id=' + id + ']').html()
	$('#toot-this').html(html)
	$('#tootmodal').modal('open')
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	if (localStorage.getItem('mode_' + domain) == 'misskey') {
		var start = 'https://' + domain + '/api/notes/show'
		var i = {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				i: at,
				noteId: id
			})
		}
	} else {
		var start = 'https://' + domain + '/api/v1/statuses/' + id
		var i = {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at
			}
		}
	}

	fetch(start, i)
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
			console.log(['Toot data:', json])
			if (!$('#timeline_' + tlid + ' #pub_' + id).length) {
				var html = parse([json], '', acct_id)
				$('#toot-this').html(html)
				jQuery('time.timeago').timeago()
			}
			if (localStorage.getItem('mode_' + domain) == 'misskey') {
				var url = 'https://' + domain + '/notes/' + json.id
				var scn = json.user.username
				if (!json.user.host) {
					var local = true
				} else {
					var local = false
					scn = scn + '@' + host
				}
				var rep = ''
				var uid = json.user.id
				if (json._replyIds) {
					replyTL(json._replyIds[0], acct_id)
				}
			} else {
				var url = json.url
				if (json.account.acct == json.account.username) {
					var local = true
				} else {
					var local = false
				}
				var scn = json.account.acct
				var uid = json.account.id
				if (json['in_reply_to_id']) {
					replyTL(json['in_reply_to_id'], acct_id)
				}
			}
			$('#toot-this .fav_ct').text(json.favourites_count)
			$('#toot-this .rt_ct').text(json.reblogs_count)
			$('#tootmodal').attr('data-url', url)
			$('#tootmodal').attr('data-id', json.id)
			$('#tootmodal').attr('data-acct', acct_id)
			if (local) {
				$('#tootmodal').attr('data-user', scn + '@' + domain)
			} else {
				$('#tootmodal').attr('data-user', scn)
			}
			getContext(id, acct_id)
			var dom = null
			if (!local) {
				dom = scn.replace(/.+@/g, '')
			} else {
				dom = domain
			}
			beforeToot(id, acct_id, dom)
			userToot(id, acct_id, uid)
			afterToot(id, acct_id, dom)
			afterUserToot(id, acct_id, uid)
			afterFTLToot(id, acct_id, dom)
			faved(id, acct_id)
			rted(id, acct_id)
			if ($('#toot-this div').hasClass('cvo')) {
				$('#toot-this').removeClass('cvo')
			} else {
				if (!$('#toot-this .cvo').hasClass('cvo')) {
					$('#toot-this').addClass('cvo')
				}
			}
			if (!$('#activator').hasClass('active')) {
				$('#det-col').collapsible('open', 4)
			}
		})
}

//返信タイムライン
function replyTL(id, acct_id) {
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	if (localStorage.getItem('mode_' + domain) == 'misskey') {
		var start = 'https://' + domain + '/api/notes/show'
		var i = {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				i: at,
				noteId: id
			})
		}
	} else {
		return false
	}
	fetch(start, i)
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
			if (localStorage.getItem('filter_' + acct_id) != 'undefined') {
				var mute = getFilterType(JSON.parse(localStorage.getItem('filter_' + acct_id)), 'thread')
			} else {
				var mute = []
			}
			if (localStorage.getItem('mode_' + domain) == 'misskey') {
				var templete = misskeyParse([json], '', acct_id, '', '', mute)
				$('#toot-after').prepend(templete)
				$('#toot-after .hide').html(lang.lang_details_filtered)
				$('#toot-after .by_filter').css('display', 'block')
				$('#toot-after .by_filter').removeClass('hide')
				var rep = '_replyIds'
				if (json[rep]) {
					replyTL(json[rep][0], acct_id)
				}
			}
		})
}

//コンテクストってなんですか
function getContext(id, acct_id) {
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	if (localStorage.getItem('mode_' + domain) == 'misskey') {
		var start = 'https://' + domain + '/api/notes/conversation'
		var i = {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				i: at,
				noteId: id
			})
		}
	} else {
		var start = 'https://' + domain + '/api/v1/statuses/' + id + '/context'
		var i = {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at
			}
		}
	}
	fetch(start, i)
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
			if (localStorage.getItem('mode_' + domain) == 'misskey') {
				json.reverse()
				var templete = misskeyParse(json, '', acct_id, '', '', [])
				$('#toot-reply').html(templete)
				$('#toot-reply .hide').html(lang.lang_details_filtered)
				$('#toot-reply .by_filter').css('display', 'block')
				$('#toot-reply .by_filter').removeClass('hide')
				jQuery('time.timeago').timeago()
			} else {
				if (localStorage.getItem('filter_' + acct_id) != 'undefined') {
					var mute = getFilterType(JSON.parse(localStorage.getItem('filter_' + acct_id)), 'thread')
				} else {
					var mute = []
				}
				var templete = parse(json.descendants, '', acct_id, '', '', mute)
				if (templete != '') {
					$('#toot-after .no-data').hide()
				}
				$('#toot-after').html(templete)
				$('#toot-after .hide').html(lang.lang_details_filtered)
				$('#toot-after .by_filter').css('display', 'block')
				$('#toot-after .by_filter').removeClass('hide')
				var templete = parse(json.ancestors, '', acct_id, '', '', mute)
				if (templete != '') {
					$('#toot-reply .no-data').hide()
				}
				$('#toot-reply').prepend(templete)
				$('#toot-reply .hide').html(lang.lang_details_filtered)
				$('#toot-reply .by_filter').css('display', 'block')
				$('#toot-reply .by_filter').removeClass('hide')
				jQuery('time.timeago').timeago()
			}
		})
}

//前のトゥート(Back TL)
function beforeToot(id, acct_id, domain) {
	//var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	if (localStorage.getItem('mode_' + domain) == 'misskey') {
		var start = 'https://' + domain + '/api/notes/local-timeline'
		fetch(start, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				i: at,
				untilID: id
			})
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
				var templete = misskeyParse(json, 'noauth', acct_id)
				$('#toot-before').html(templete)
				jQuery('time.timeago').timeago()
			})
	} else {
		var start = 'https://' + domain + '/api/v1/timelines/public?local=true&max_id=' + id
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
				var templete = parse(json, 'noauth', acct_id)
				if (templete != '') {
					$('#toot-before .no-data').hide()
				}
				$('#toot-before').html(templete)
				jQuery('time.timeago').timeago()
			})
	}
}
//前のユーザーのトゥート
function userToot(id, acct_id, user) {
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	if (localStorage.getItem('mode_' + domain) == 'misskey') {
		var start = 'https://' + domain + '/api/users/notes'
		fetch(start, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				i: at,
				untilID: id,
				userId: user
			})
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
				var templete = misskeyParse(json, 'noauth', acct_id)
				$('#user-before').html(templete)
				jQuery('time.timeago').timeago()
			})
	} else {
		var start = 'https://' + domain + '/api/v1/accounts/' + user + '/statuses?max_id=' + id
		fetch(start, {
			method: 'GET',
			headers: {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at
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
				var templete = parse(json, '', acct_id)
				if (templete != '') {
					$('#user-before .no-data').hide()
				}
				$('#user-before').html(templete)
				jQuery('time.timeago').timeago()
			})
	}
}
//後のLTL
function afterToot(id, acct_id, domain) {
	//var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var start = 'https://' + domain + '/api/v1/timelines/public?local=true&min_id=' + id
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
			var templete = parse(json, 'noauth', acct_id)
			if (templete != '') {
				$('#ltl-after .no-data').hide()
			}
			$('#ltl-after').html(templete)
			jQuery('time.timeago').timeago()
		})
}
//後のUTL
function afterUserToot(id, acct_id, user) {
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var start = 'https://' + domain + '/api/v1/accounts/' + user + '/statuses?min_id=' + id
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
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
			var templete = parse(json, '', acct_id)
			if (templete != '') {
				$('#user-after .no-data').hide()
			}
			$('#user-after').html(templete)
			jQuery('time.timeago').timeago()
		})
}
//後のFTL
function afterFTLToot(id, acct_id, domain) {
	//var domain = localStorage.getItem("domain_" + acct_id);
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var start = 'https://' + domain + '/api/v1/timelines/public?min_id=' + id
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
			var templete = parse(json, 'noauth', acct_id)
			if (templete != '') {
				$('#ftl-after .no-data').hide()
			}
			$('#ftl-after').html(templete)
			jQuery('time.timeago').timeago()
		})
}

//ふぁぼ一覧
function faved(id, acct_id) {
	var domain = localStorage.getItem('domain_' + acct_id)
	if (localStorage.getItem('mode_' + domain) == 'misskey') {
		return false
	}
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var start = 'https://' + domain + '/api/v1/statuses/' + id + '/favourited_by'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
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
			var templete = userparse(json, '', acct_id)
			if (templete != '') {
				$('#toot-fav .no-data').hide()
			}
			$('#toot-fav').html(templete)
			jQuery('time.timeago').timeago()
		})
}

//ブースト一覧
function rted(id, acct_id) {
	var domain = localStorage.getItem('domain_' + acct_id)
	if (localStorage.getItem('mode_' + domain) == 'misskey') {
		return false
	}
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var start = 'https://' + domain + '/api/v1/statuses/' + id + '/reblogged_by'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
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
			var templete = userparse(json, '', acct_id)
			$('#toot-rt').html(templete)
			jQuery('time.timeago').timeago()
		})
}
//URL等のコピー
function cbCopy(mode) {
	var url = $('#tootmodal').attr('data-url')
	var urls = url.match(/https?:\/\/([-.a-zA-Z0-9]+)/)
	var domain = urls[1]
	if (mode == 'emb') {
		var emb =
			`<iframe src="${url}/embed" class="mastodon-embed" style="max-width: 100%; border: 0" width="400"></iframe>
			<script src="https://${domain}/embed.js" async="async"></script>`
		execCopy(emb)
		M.toast({ html: lang.lang_details_embed, displayLength: 1500 })
	} else {
		if (execCopy(url)) {
			M.toast({ html: lang.lang_details_url, displayLength: 1500 })
		}
	}
}
//本文のコピー
function staCopy(id) {
	var html = $('[toot-id=' + id + '] .toot').html()
	html = html.replace(/^<p>(.+)<\/p>$/, '$1')
	html = html.replace(/<br\s?\/?>/, '\n')
	html = html.replace(/<p>/, '\n')
	html = html.replace(/<\/p>/, '\n')
	console.log('Copy it:\n' + html)
	html = html.replace(/<img[\s\S]*alt="(.+?)"[\s\S]*?>/g, '$1')
	html = $.strip_tags(html)
	if (execCopy(html)) {
		M.toast({ html: lang.lang_details_txt, displayLength: 1500 })
	}
}
//翻訳
function trans(tar, to) {
	var html = $('#toot-this .toot').html()
	if (html.match(/^<p>(.+)<\/p>$/)) {
		html = html.match(/^<p>(.+)<\/p>$/)[1]
	}
	html = html.replace(/<br\s?\/?>/g, '\n')
	html = html.replace(/<p>/g, '\n')
	html = html.replace(/<\/p>/g, '\n')
	html = $.strip_tags(html)
	if (~tar.indexOf('zh')) {
		tar = 'zh'
	}
	$('#toot-this .additional').text('Loading...(Powered by Google Translate)')
	var exec =
		'https://script.google.com/macros/s/AKfycbxhwW5tjjop9Irg-y1zr_WsXlCKEzwWG6KuoOt_vVRDfEbRv0c/exec?format=json&text=' +
		encodeURIComponent(html) +
		'&source=' +
		tar +
		'&target=' +
		to
	console.log('Try to translate from ' + tar + ' to ' + to + ' at ' + exec)
	fetch(exec, {
		method: 'GET'
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
		.then(function(text) {
			$('#toot-this .additional').html('<span class="gray translate">' + text.text + '</span>')
		})
}
//ブラウザで開く
function brws() {
	var url = $('#tootmodal').attr('data-url')
	postMessage(['openUrl', url], '*')
}
//外部からトゥート開く
function detEx(url, acct_id) {
	if (acct_id == 'main') {
		acct_id = localStorage.getItem('main')
	}
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var start = 'https://' + domain + '/api/v2/search?resolve=true&q=' + url
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
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
			if (!json.statuses) {
				postMessage(['openUrl', url], '*')
			} else {
				var id = json.statuses[0].id
				$('.loadp').text($('.loadp').attr('href'))
				$('.loadp').removeClass('loadp')
				details(id, acct_id, 0)
			}
		})
	return
}
