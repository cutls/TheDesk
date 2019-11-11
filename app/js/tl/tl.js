//TL取得
moreloading = false
var errorct = 0
function tl(type, data, acct_id, tlid, delc, voice, mode) {
	scrollevent()
	$('#unread_' + tlid + ' .material-icons').removeClass('teal-text')
	localStorage.removeItem('pool')
	var domain = localStorage.getItem('domain_' + acct_id)
	//タグとかの場合はカラム追加して描画
	if (tlid == 'add') {
		console.log('add new column')
		var newtab = $('.box').length
		var add = {
			domain: acct_id,
			type: type,
			data: data
		}
		var multi = localStorage.getItem('column')
		var obj = JSON.parse(multi)
		localStorage.setItem('card_' + obj.length, 'true')
		obj.push(add)
		var json = JSON.stringify(obj)
		localStorage.setItem('column', json)
		parseColumn('add')
		return
	}

	if (!type) {
		var type = localStorage.getItem('now')
		if (!type) {
			//デフォルト
			var type = 'local'
		}
	}
	if (type == 'mix' && localStorage.getItem('mode_' + domain) != 'misskey') {
		//Integratedなら飛ばす
		$('#notice_' + tlid).text(
			'Integrated TL(' + localStorage.getItem('user_' + acct_id) + '@' + domain + ')'
		)
		$('#notice_icon_' + tlid).text('merge_type')
		mixtl(acct_id, tlid, 'integrated', delc, voice)
		return
	} else if (type == 'plus') {
		//Local+なら飛ばす
		$('#notice_' + tlid).text(
			'Local+ TL(' + localStorage.getItem('user_' + acct_id) + '@' + domain + ')'
		)
		$('#notice_icon_' + tlid).text('people_outline')
		mixtl(acct_id, tlid, 'plus', delc, voice)
		return
	} else if (type == 'notf') {
		//通知なら飛ばす
		notf(acct_id, tlid, 'direct')
		$('#notice_' + tlid).text(
			cap(type, data, acct_id) + '(' + localStorage.getItem('user_' + acct_id) + '@' + domain + ')'
		)
		$('#notice_icon_' + tlid).text('notifications')
		return
	} /*else if (type == "dm") {
		//DMなら飛ばす
		dm(acct_id, tlid, "plus",delc,voice);
		$("#notice_" + tlid).text(cap(type, data, acct_id) + "(" + localStorage.getItem(
			"user_" + acct_id) + "@" + domain + ")");
			$("#notice_icon_" + tlid).text("mail_outline");
		return;
	}*/
	localStorage.setItem('now', type)
	todo(cap(type) + ' TL Loading...')
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	if (type != 'noauth') {
		var hdr = {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
		$('#notice_' + tlid).text(
			cap(type, data, acct_id) + '(' + localStorage.getItem('user_' + acct_id) + '@' + domain + ')'
		)
	} else {
		var hdr = {
			'content-type': 'application/json'
		}
		domain = acct_id
		$('#notice_' + tlid).text('Glance TL(' + domain + ')')
	}
	$('#notice_icon_' + tlid).text(icon(type))
	if (localStorage.getItem('mode_' + domain) == 'misskey') {
		var misskey = true
		var url = misskeycom(type, data)
		var start = 'https://' + domain + '/api/notes/' + url
		var method = 'POST'
		var req = {}
		if (type != 'noauth') {
			req.i = at
		}

		if (type == 'local-media' || type == 'pub-media') {
			req.mediaOnly = true
		}
		if (type == 'tag') {
			req.tag = data
		}
		if (type == 'list') {
			req.listId = data
		}
		req.limit = 20
		var i = {
			method: method,
			headers: hdr,
			body: JSON.stringify(req)
		}
	} else {
		var misskey = false
		var url = com(type, data)
		if (type == 'tag') {
			var tag = localStorage.getItem('tag-range')
			if (tag == 'local') {
				url = url + 'local=true'
			}
		}
		if (type == 'dm') {
			var start = 'https://' + domain + '/api/v1/conversations'
		} else {
			var start = 'https://' + domain + '/api/v1/timelines/' + url
		}
		var method = 'GET'
		var i = {
			method: method,
			headers: hdr
		}
	}

	console.log(['Try to get timeline of ' + tlid, start])
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
			console.log(['Result of getting timeline of ' + tlid, json])
			$('#landing_' + tlid).hide()
			var mute = getFilterTypeByAcct(acct_id, type)
			if (misskey) {
				var templete = misskeyParse(json, type, acct_id, tlid, '', mute)
			} else {
				var templete = parse(json, type, acct_id, tlid, '', mute, type)
				localStorage.setItem('lastobj_' + tlid, json[0].id)
			}
			$('#timeline_' + tlid).html(templete)
			additional(acct_id, tlid)
			jQuery('time.timeago').timeago()
			todc()
			reload(type, '', acct_id, tlid, data, mute, delc, voice)
			if (type == 'home' || type == 'notf') {
				//Markers
				var markers = localStorage.getItem('markers')
				if (markers == 'yes') {
					markers = true
				} else {
					markers = false
				}
				if (markers) {
					getMarker(tlid, type, acct_id)
				}
			}
			$(window).scrollTop(0)
		})
}

//Streaming接続
function reload(type, cc, acct_id, tlid, data, mute, delc, voice, mode) {
	if (!type) {
		var type = localStorage.getItem('now')
	}
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	localStorage.setItem('now', type)
	if (localStorage.getItem('mode_' + domain) == 'misskey') {
		var misskey = true
		var key = localStorage.getItem('misskey_wss_' + acct_id)
		var send = '{"type":"connect","body":{"channel":"' + typePs(type) + '","id":"' + tlid + '"}}'
		var mskyset = setInterval(function() {
			if (misskeywsstate[key]) {
				misskeyws[key].send(send)
				clearInterval(mskyset)
			}
		}, 100)
	} else {
		var misskey = false
		if (localStorage.getItem('streaming_' + acct_id)) {
			var wss = localStorage.getItem('streaming_' + acct_id)
		} else {
			var wss = 'wss://' + domain
		}
		if (type == 'home') {
			var start = wss + '/api/v1/streaming/?stream=user&access_token=' + at
		} else if (type == 'pub') {
			var start = wss + '/api/v1/streaming/?stream=public&access_token=' + at
		} else if (type == 'pub-media') {
			var start = wss + '/api/v1/streaming/?stream=public:media&access_token=' + at
		} else if (type == 'local') {
			var start = wss + '/api/v1/streaming/?stream=public:local&access_token=' + at
		} else if (type == 'local-media') {
			var start =
				wss + '/api/v1/streaming/?stream=public:local:media&only_media=true&access_token=' + at
		} else if (type == 'tag') {
			if (type == 'tag') {
				var tag = localStorage.getItem('tag-range')
				if (tag == 'local') {
					data = data + '&local=true'
				}
			}
			var start = wss + '/api/v1/streaming/?stream=hashtag&tag=' + data + '&access_token=' + at
		} else if (type == 'noauth') {
			var start = 'wss://' + acct_id + '/api/v1/streaming/?stream=public:local'
		} else if (type == 'list') {
			var start = wss + '/api/v1/streaming/?stream=list&list=' + data + '&access_token=' + at
		} else if (type == 'dm') {
			var start = wss + '/api/v1/streaming/?stream=direct&access_token=' + at
		}
		var wsid = websocket.length
		localStorage.setItem('wss_' + tlid, wsid)
		websocket[wsid] = new WebSocket(start)
		websocket[wsid].onopen = function(mess) {
			console.table({
				tlid: tlid,
				type: 'Connect Streaming API' + type,
				domain: domain,
				message: [mess]
			})
			errorct = 0
			$('#notice_icon_' + tlid).removeClass('red-text')
		}
		websocket[wsid].onmessage = function(mess) {
			console.log([tlid + ':Receive Streaming API:', JSON.parse(mess.data)])
			if (misskey) {
				if (JSON.parse(mess.data).type == 'note') {
					var obj = JSON.parse(mess.data).body
					if (voice) {
						say(obj.text)
					}
					websocketNotf[acct_id].send(
						JSON.stringify({
							type: 'capture',
							id: obj.id
						})
					)
					var templete = misskeyParse([obj], type, acct_id, tlid, '', mute)
					var pool = localStorage.getItem('pool_' + tlid)
					if (pool) {
						pool = templete + pool
					} else {
						pool = templete
					}
					localStorage.setItem('pool_' + tlid, pool)
					scrollck()
					jQuery('time.timeago').timeago()
				}
			} else {
				var typeA = JSON.parse(mess.data).event
				if (typeA == 'delete') {
					var obj = JSON.parse(mess.data).payload
					if (delc == 'true') {
						$('#timeline_' + tlid + ' [toot-id=' + JSON.parse(mess.data).payload + ']').addClass(
							'emphasized'
						)
						$('#timeline_' + tlid + ' [toot-id=' + JSON.parse(mess.data).payload + ']').addClass(
							'by_delcatch'
						)
					} else {
						$('[toot-id=' + JSON.parse(mess.data).payload + ']').hide()
						$('[toot-id=' + JSON.parse(mess.data).payload + ']').remove()
					}
				} else if (typeA == 'update' || typeA == 'conversation') {
					if (!$('#unread_' + tlid + ' .material-icons').hasClass('teal-text')) {
						//markers show中はダメ
						var obj = JSON.parse(JSON.parse(mess.data).payload)
						if ($('#timeline_' + tlid + ' [toot-id=' + obj.id + ']').length < 1) {
							if (voice) {
								say(obj.content)
							}
							var templete = parse([obj], type, acct_id, tlid, '', mute, type)
							if ($('timeline_box_' + tlid + '_box .tl-box').scrollTop() === 0) {
								$('#timeline_' + tlid).prepend(templete)
							} else {
								var pool = localStorage.getItem('pool_' + tlid)
								if (pool) {
									pool = templete + pool
								} else {
									pool = templete
								}
								localStorage.setItem('pool_' + tlid, pool)
							}
							scrollck()
							additional(acct_id, tlid)
							jQuery('time.timeago').timeago()
						} else {
							todo('二重取得発生中')
						}

						todc()
					}
				} else if (typeA == 'filters_changed') {
					filterUpdate(acct_id)
				}
			}
		}
		websocket[wsid].onerror = function(error) {
			console.error('Error closing')
			console.error(error)
			if (mode == 'error') {
				$('#notice_icon_' + tlid).addClass('red-text')
				todo('WebSocket Error ' + error)
			} else {
				errorct++
				console.log(errorct)
				if (errorct < 3) {
					reconnector(tlid, type, acct_id, data, 'error')
				}
			}
			return false
		}
		websocket[wsid].onclose = function() {
			console.warn('Closing ' + tlid)
			if (mode == 'error') {
				$('#notice_icon_' + tlid).addClass('red-text')
				todo('WebSocket Closed')
			} else {
				errorct++
				console.log(errorct)
				if (errorct < 3) {
					reconnector(tlid, type, acct_id, data, 'error')
				}
			}
			return false
		}
	}
}

//一定のスクロールで発火
function moreload(type, tlid) {
	var multi = localStorage.getItem('column')
	var obj = JSON.parse(multi)
	var acct_id = obj[tlid].domain
	if (!type) {
		var type = obj[tlid].type
	} else {
		var data
	}
	if (type == 'tag') {
		var data = obj[tlid].data
		var tag = localStorage.getItem('tag-range')
		if (tag == 'local') {
			data = data + '&local=true'
		}
	} else if (type == 'list') {
		var data = obj[tlid].data
	}
	var sid = $('#timeline_' + tlid + ' .cvo')
		.last()
		.attr('unique-id')
	if (sid && !moreloading) {
		if (
			type == 'mix' &&
			localStorage.getItem('mode_' + localStorage.getItem('domain_' + acct_id)) != 'misskey'
		) {
			mixmore(tlid, 'integrated')
			return
		} else if (
			type == 'plus' &&
			localStorage.getItem('mode_' + localStorage.getItem('domain_' + acct_id)) != 'misskey'
		) {
			mixmore(tlid, 'plus')
			return
		} else if (type == 'notf') {
			notfmore(tlid)
			return
		} else if (type == 'tootsearch') {
			var data = obj[tlid].data
			moreTs(tlid, data)
			return
		}
		moreloading = true
		localStorage.setItem('now', type)
		todo(cap(type) + ' TL MoreLoading')
		if (type != 'noauth') {
			var at = localStorage.getItem('acct_' + acct_id + '_at')
			var hdr = {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at
			}
			var domain = localStorage.getItem('domain_' + acct_id)
		} else {
			var hdr = {
				'content-type': 'application/json'
			}
			domain = acct_id
		}
		if (localStorage.getItem('mode_' + domain) == 'misskey') {
			var misskey = true
			hdr = {
				'content-type': 'application/json'
			}
			var url = misskeycom(type, data)
			var start = 'https://' + domain + '/api/notes/' + url
			var method = 'POST'
			var req = {}
			if (type != 'noauth') {
				req.i = at
			}
			if (type == 'local-media' || type == 'pub-media') {
				req.mediaOnly = true
			}
			if (type == 'tag') {
				req.tag = data
			}
			if (type == 'list') {
				req.listId = data
			}
			req.untilId = sid
			req.limit = 20
			var i = {
				method: method,
				headers: hdr,
				body: JSON.stringify(req)
			}
		} else {
			var misskey = false
			var start = 'https://' + domain + '/api/v1/timelines/' + com(type, data) + 'max_id=' + sid
			if (type == 'dm') {
				var start = 'https://' + domain + '/api/v1/conversations?' + 'max_id=' + sid
			}
			var method = 'GET'
			var i = {
				method: method,
				headers: hdr
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
				var mute = getFilterTypeByAcct(acct_id, type)
				if (misskey) {
					var templete = misskeyParse(json, '', acct_id, tlid, '', mute)
				} else {
					var templete = parse(json, '', acct_id, tlid, '', mute, type)
				}
				$('#timeline_' + tlid).append(templete)
				additional(acct_id, tlid)
				jQuery('time.timeago').timeago()
				moreloading = false
				todc()
			})
	}
}
//TL差分取得
function tlDiff(type, data, acct_id, tlid, delc, voice, mode) {
	console.log('Get diff of TL' + tlid)
	var multi = localStorage.getItem('column')
	var obj = JSON.parse(multi)
	var acct_id = obj[tlid].domain
	if (!type) {
		var type = obj[tlid].type
	} else {
		var data
	}
	if (type == 'tag') {
		var data = obj[tlid].data
		var tag = localStorage.getItem('tag-range')
		if (tag == 'local') {
			data = data + '&local=true'
		}
	} else if (type == 'list') {
		var data = obj[tlid].data
	}
	var sid = $('#timeline_' + tlid + ' .cvo')
		.first()
		.attr('unique-id')
	if (sid && !moreloading) {
		if (
			type == 'mix' &&
			localStorage.getItem('mode_' + localStorage.getItem('domain_' + acct_id)) != 'misskey'
		) {
			return
		} else if (
			type == 'plus' &&
			localStorage.getItem('mode_' + localStorage.getItem('domain_' + acct_id)) != 'misskey'
		) {
			return
		} else if (type == 'notf') {
			return
		}
		moreloading = true
		localStorage.setItem('now', type)
		todo(cap(type) + ' TL MoreLoading')
		if (type != 'noauth') {
			var at = localStorage.getItem('acct_' + acct_id + '_at')
			var hdr = {
				'content-type': 'application/json',
				Authorization: 'Bearer ' + at
			}
			var domain = localStorage.getItem('domain_' + acct_id)
		} else {
			var hdr = {
				'content-type': 'application/json'
			}
			domain = acct_id
		}
		if (localStorage.getItem('mode_' + domain) == 'misskey') {
			var misskey = true
			hdr = {
				'content-type': 'application/json'
			}
			var url = misskeycom(type, data)
			var start = 'https://' + domain + '/api/notes/' + url
			var method = 'POST'
			var req = {}
			if (type != 'noauth') {
				req.i = at
			}
			if (type == 'local-media' || type == 'pub-media') {
				req.mediaOnly = true
			}
			if (type == 'tag') {
				req.tag = data
			}
			if (type == 'list') {
				req.listId = data
			}
			req.sinceId = sid
			req.limit = 20
			var i = {
				method: method,
				headers: hdr,
				body: JSON.stringify(req)
			}
		} else {
			var misskey = false
			var start = 'https://' + domain + '/api/v1/timelines/' + com(type, data) + 'since_id=' + sid
			if (type == 'dm') {
				var start = 'https://' + domain + '/api/v1/conversations?' + 'since_id=' + sid
			}
			var method = 'GET'
			var i = {
				method: method,
				headers: hdr
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
				console.log(['Result diff of TL' + tlid, json])
				if (misskey) {
					var templete = misskeyParse(json, '', acct_id, tlid, '', mute)
				} else {
					var templete = parse(json, '', acct_id, tlid, '', mute, type)
				}
				$('#timeline_' + tlid).prepend(templete)
				additional(acct_id, tlid)
				jQuery('time.timeago').timeago()
				moreloading = false
				todc()
			})
	}
}
//TL再取得
function reloadTL(type, data, acct_id, key, delc, voice) {
	tl(type, data, acct_id, key, delc, voice, '')
}

//WebSocket切断
function tlCloser() {
	Object.keys(websocket).forEach(function(tlid) {
		if (websocketOld[tlid]) {
			websocketOld[tlid].close()
			console.log('%c Close Streaming API: Old' + tlid, 'color:blue')
		}
		if (websocket[0]) {
			console.log(websocket[0])
			websocket[tlid].close()
			console.log('%c Close Streaming API:' + tlid, 'color:blue')
		}
	})
	websocket = []
	Object.keys(wsHome).forEach(function(tlid) {
		if (wsHome[tlid]) {
			wsHome[tlid].close()
			console.log('%c Close Streaming API:Integrated Home' + tlid, 'color:blue')
		}
	})
	wsHome = []
	Object.keys(wsLocal).forEach(function(tlid) {
		if (wsLocal[tlid]) {
			wsLocal[tlid].close()
			console.log('%c Close Streaming API:Integrated Local' + tlid, 'color:blue')
		}
	})
	wsLocal = []
	Object.keys(websocketNotf).forEach(function(tlid) {
		if (websocketNotf[tlid]) {
			websocketNotf[tlid].close()
			console.log('%c Close Streaming API:Notf' + tlid, 'color:blue')
		}
	})
	Object.keys(misskeyws).forEach(function(tlid) {
		if (misskeyws[tlid]) {
			misskeyws[tlid].close()
			console.log('%c Close Streaming API:Misskey' + tlid, 'color:blue')
		}
	})
	misskeyws = {}
}

//TLのタイトル
function cap(type, data, acct_id) {
	//独自ロケール
	var locale = localStorage.getItem('locale')
	if (locale == 'yes') {
		var locale = false
	}
	if (type == 'home') {
		if (localStorage.getItem('home_' + acct_id) && !locale) {
			var response = localStorage.getItem('home_' + acct_id)
		} else {
			var response = 'Home TL'
		}
	} else if (type == 'local') {
		if (localStorage.getItem('local_' + acct_id) && !locale) {
			var response = localStorage.getItem('local_' + acct_id)
		} else {
			var response = 'Local TL'
		}
	} else if (type == 'local-media') {
		if (localStorage.getItem('local_' + acct_id) && !locale) {
			var response = localStorage.getItem('local_' + acct_id) + '(' + lang.lang_tl_media + ')'
		} else {
			var response = 'Local TL(Media)'
		}
	} else if (type == 'pub') {
		if (localStorage.getItem('public_' + acct_id) && !locale) {
			var response = localStorage.getItem('public_' + acct_id)
		} else {
			var response = 'Federated TL'
		}
	} else if (type == 'pub-media') {
		if (localStorage.getItem('public_' + acct_id) && !locale) {
			var response = localStorage.getItem('public_' + acct_id) + '(' + lang.lang_tl_media + ')'
		} else {
			var response = 'Federated TL(Media)'
		}
	} else if (type == 'tag') {
		var response = '#' + escapeHTML(data)
	} else if (type == 'list') {
		var ltitle = localStorage.getItem('list_' + data + '_' + acct_id)
		var response = 'List(' + ltitle + ')'
	} else if (type == 'notf') {
		if (localStorage.getItem('notification_' + acct_id) && !locale) {
			var response = localStorage.getItem('notification_' + acct_id)
		} else {
			var response = 'Notification TL'
		}
	} else if (type == 'noauth') {
		var response = 'Glance TL'
	} else if (type == 'dm') {
		var response = 'DM'
	} else if (type == 'mix') {
		if (localStorage.getItem('mode_' + localStorage.getItem('domain_' + acct_id)) == 'misskey') {
			var response = 'Social TL'
		} else {
			var response = 'Integrated'
		}
	} else if (type == 'plus') {
		var response = 'Local+'
	} else if (type == 'webview') {
		var response = 'Twitter'
	} else if (type == 'tootsearch') {
		var response = 'tootsearch(' + escapeHTML(data) + ')'
	}
	return response
}

//TLのURL
function com(type, data) {
	if (type == 'home') {
		return 'home?'
	} else if (type == 'local' || type == 'noauth') {
		return 'public?local=true&'
	} else if (type == 'local-media') {
		return 'public?local=true&only_media=true&'
	} else if (type == 'pub') {
		return 'public?'
	} else if (type == 'pub-media') {
		return 'public?only_media=true&'
	} else if (type == 'tag') {
		return 'tag/' + data + '?'
	} else if (type == 'list') {
		return 'list/' + data + '?'
	} else if (type == 'dm') {
		return 'direct?'
	}
}
//Misskey
function typePs(type) {
	if (type == 'home') {
		return 'homeTimeline'
	} else if (type == 'local' || type == 'noauth') {
		return 'localTimeline'
	} else if (type == 'local-media') {
		return 'localTimeline'
	} else if (type == 'pub') {
		return 'globalTimeline'
	} else if (type == 'mix') {
		return 'hybridTimeline'
	} else if (type == 'tag') {
		return 'hashtag'
	} else if (type == 'list') {
		return 'userList'
	}
}
function misskeycom(type, data) {
	if (type == 'home') {
		return 'timeline'
	} else if (type == 'mix') {
		return 'hybrid-timeline'
	} else if (type == 'local' || type == 'noauth') {
		return 'local-timeline'
	} else if (type == 'local-media') {
		return 'local-timeline'
	} else if (type == 'pub') {
		return 'global-timeline'
	} else if (type == 'pub-media') {
		return 'global-timeline'
	} else if (type == 'tag') {
		return 'search_by_tag'
	} else if (type == 'list') {
		return 'user-list-timeline'
	}
}

//TLのアイコン
function icon(type) {
	if (type == 'home') {
		var response = 'home'
	} else if (type == 'local') {
		var response = 'people_outline'
	} else if (type == 'local-media') {
		var response = 'people_outline'
	} else if (type == 'pub') {
		var response = 'language'
	} else if (type == 'pub-media') {
		var response = 'language'
	} else if (type == 'tag') {
		var response = 'whatshot'
	} else if (type == 'list') {
		var response = 'view_headline'
	} else if (type == 'notf') {
		var response = 'notifications'
	} else if (type == 'noauth') {
		var response = 'people_outline'
	} else if (type == 'dm') {
		var response = 'mail_outline'
	} else if (type == 'mix') {
		var response = 'merge_type'
	} else if (type == 'plus') {
		var response = 'merge_type'
	} else if (type == 'webview') {
		var response = 'language'
	} else if (type == 'tootsearch') {
		var response = 'search'
	}
	return response
}
function reconnector(tlid, type, acct_id, data, mode) {
	console.log('%c Reconnector:' + mode + '(timeline' + tlid + ')', 'color:pink')
	if (type == 'mix' || type == 'integrated' || type == 'plus') {
		if (localStorage.getItem('voice_' + tlid)) {
			var voice = true
		} else {
			var voice = false
		}
		var mute = getFilterTypeByAcct(acct_id, type)
		var wssh = localStorage.getItem('wssH_' + tlid)
		wsHome[wssh].close()
		var wssl = localStorage.getItem('wssL_' + tlid)
		wsLocal[wssl].close()
		mixre(acct_id, tlid, type, mute, '', voice, mode)
	} else if (type == 'notf') {
		notfColumn(acct_id, tlid, '')
	} else {
		var wss = localStorage.getItem('wss_' + tlid)
		websocket[wss].close()
		if (localStorage.getItem('voice_' + tlid)) {
			var voice = true
		} else {
			var voice = false
		}
		var mute = getFilterTypeByAcct(acct_id, type)
		reload(type, '', acct_id, tlid, data, mute, '', voice, mode)
	}
	M.toast({ html: lang.lang_tl_reconnect, displayLength: 2000 })
}
function columnReload(tlid, type) {
	$('#notice_icon_' + tlid).addClass('red-text')
	$('#unread_' + tlid + ' .material-icons').removeClass('teal-text')
	if (type == 'mix' || type == 'integrated' || type == 'plus') {
		if (localStorage.getItem('voice_' + tlid)) {
			var voice = true
		} else {
			var voice = false
		}
		var mute = getFilterTypeByAcct(acct_id, type)
		var wssh = localStorage.getItem('wssH_' + tlid)
		wsHome[wssh].close()
		var wssl = localStorage.getItem('wssL_' + tlid)
		wsLocal[wssl].close()
		parseColumn(tlid)
	} else if (type == 'notf') {
		$('#notice_icon_' + tlid).removeClass('red-text')
		notfColumn(acct_id, tlid, '')
	} else {
		var wss = localStorage.getItem('wss_' + tlid)
		websocket[wss].close()
		if (localStorage.getItem('voice_' + tlid)) {
			var voice = true
		} else {
			var voice = false
		}
		var mute = getFilterTypeByAcct(acct_id, type)
		parseColumn(tlid)
	}
}
//Markers
function getMarker(tlid, type, acct_id) {
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	if (type == 'home') {
		var add = 'home'
	} else if (type == 'notf') {
		var add = 'notifications'
	}
	var start = 'https://' + domain + '/api/v1/markers?timeline=' + add
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
			$('#unread_' + tlid).attr('title', lang.lang_layout_unread + ':' + lang.lang_nothing)
			$('#unread_' + tlid).attr('data-id', '')
			return false
		})
		.then(function(json) {
			if (json) {
				if (json[add]) {
					json = json[add]
					$('#unread_' + tlid).attr(
						'title',
						lang.lang_layout_unread + ':' + json.updated_at + ' v' + json.version
					)
					$('#unread_' + tlid).attr('data-id', json.last_read_id)
				} else {
					$('#unread_' + tlid).attr('title', lang.lang_layout_unread + ':' + lang.lang_nothing)
					$('#unread_' + tlid).attr('data-id', '')
				}
			} else {
				$('#unread_' + tlid).attr('title', lang.lang_layout_unread + ':' + lang.lang_nothing)
				$('#unread_' + tlid).attr('data-id', '')
			}
		})
}
function showUnread(tlid, type, acct_id) {
	if ($('#unread_' + tlid + ' .material-icons').hasClass('teal-text')) {
		goTop(tlid)
		return
	}
	$('#unread_' + tlid + ' .material-icons').addClass('teal-text')
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var id = $('#unread_' + tlid).attr('data-id')
	if (type == 'home') {
		var add = 'timelines/home?min_id=' + id
	} else if (type == 'notf') {
		var add = 'notifications?min_id=' + id
	}
	var start = 'https://' + domain + '/api/v1/' + add
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
			if (!json || !json.length) {
				columnReload(tlid, type)
			}
			var mute = getFilterTypeByAcct(acct_id, type)
			var templete = parse(json, type, acct_id, tlid, '', mute, type)
			var len = json.length - 1
			$('#timeline_' + tlid).html(templete)
			if ($('#timeline_' + tlid + ' .cvo:eq(' + len + ')').length) {
				var to = $('#timeline_' + tlid + ' .cvo:eq(' + len + ')').offset().top
				$('#timeline_box_' + tlid + '_box .tl-box').scrollTop(to)
			}
			additional(acct_id, tlid)
			jQuery('time.timeago').timeago()
			todc()
		})
}
var ueloadlock = false
function ueload(tlid) {
	if (ueloadlock) {
		return false
	}
	ueloadlock = true
	var multi = localStorage.getItem('column')
	var obj = JSON.parse(multi)
	var acct_id = obj[tlid * 1].domain
	var type = obj[tlid * 1].type
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var id = $('#timeline_' + tlid + ' .cvo:eq(0)').attr('unique-id')
	if (type == 'home') {
		var add = 'timelines/home?min_id=' + id
	} else if (type == 'notf') {
		var add = 'notifications?min_id=' + id
	}
	var start = 'https://' + domain + '/api/v1/' + add
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
			if (!json) {
				columnReload(tlid, type)
			}
			var mute = getFilterTypeByAcct(acct_id, type)
			var templete = parse(json, '', acct_id, tlid, '', mute, type)
			var len = json.length - 1
			$('#timeline_' + tlid).prepend(templete)
			if ($('#timeline_' + tlid + ' .cvo:eq(' + len + ')').length) {
				var to = $('#timeline_' + tlid + ' .cvo:eq(' + len + ')').offset().top
				$('#timeline_box_' + tlid + '_box .tl-box').scrollTop(to)
			}
			additional(acct_id, tlid)
			jQuery('time.timeago').timeago()
			todc()
			ueloadlock = false
		})
}
function asRead(callback) {
	//Markers
	var markers = localStorage.getItem('markers')
	if (markers == 'no') {
		markers = false
	} else {
		markers = true
	}
	if (markers) {
		var multi = localStorage.getItem('column')
		var obj = JSON.parse(multi)
		var obl = obj.length
		ct = 0
		for (var i = 0; i < obl; i++) {
			var acct_id = obj[i].domain
			var type = obj[i].type
			if (type == 'home' || type == 'notf') {
				if (type == 'home') {
					var id = $('#timeline_' + i + ' .cvo:eq(0)').attr('unique-id')
					var poster = {
						home: {
							last_read_id: id
						}
					}
				} else {
					var id = $('#timeline_' + i + ' .cvo:eq(0)').attr('data-notf')
					var poster = {
						notifications: {
							last_read_id: id
						}
					}
				}

				var domain = localStorage.getItem('domain_' + acct_id)
				var at = localStorage.getItem('acct_' + acct_id + '_at')
				var httpreq = new XMLHttpRequest()
				var start = 'https://' + domain + '/api/v1/markers'
				httpreq.open('POST', start, true)
				httpreq.setRequestHeader('Content-Type', 'application/json')
				httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
				httpreq.responseType = 'json'
				httpreq.send(JSON.stringify(poster))
				httpreq.onreadystatechange = function() {
					if (httpreq.readyState === 4) {
						var json = httpreq.response
						if (this.status !== 200) {
							setLog(start, this.status, this.response)
						}
						console.log(json)
						ct++
						if (ct == obl && callback) {
							postMessage(['asReadComp', ''], '*')
						}
					}
				}
			}
		}
	}
}
function asReadEnd() {
	//Markers
	var markers = localStorage.getItem('markers')
	if (markers == 'no') {
		markers = false
	} else {
		markers = true
	}
	if (markers) {
		asRead(true)
		Swal.fire({
			title: lang.lang_tl_postmarkers_title,
			html: lang.lang_tl_postmarkers,
			timer: 3000,
			onBeforeOpen: () => {
				Swal.showLoading()
			},
			onClose: () => {}
		}).then(result => {})
	} else {
		postMessage(['asReadComp', ''], '*')
	}
}
