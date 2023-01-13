//TL取得
let websocket
function tl(data) {
	const tlid = 0
	if (websocket) websocket.close()
	const acct_id = $('#post-acct-sel').val()
	const type = $('#type-sel').val()?.toString() || 'local'
	const domain = localStorage.getItem('domain_' + acct_id)
	//タグの場合はカラム追加して描画
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	$('#notice_nano').text(
		cap(type, data) + ' TL(' + localStorage.getItem('user_' + acct_id) + '@' + domain + ')'
	)
	const start = 'https://' + domain + '/api/v1/timelines/' + com(type, data)
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
			console.error(error)
		})
		.then(function (json) {
			const templete = parse([json[0]], '', acct_id, tlid)
			$('#timeline_nano').html(templete)
			jQuery('time.timeago').timeago()
			$('#menu').addClass('hide')
		})
	//Streaming接続
	let wssStart
	if (type === 'home') {
		wssStart = 'wss://' + domain + '/api/v1/streaming/?stream=user&access_token=' + at
	} else if (type === 'pub') {
		wssStart = 'wss://' + domain + '/api/v1/streaming/?stream=public&access_token=' + at
	} else if (type === 'local') {
		wssStart = 'wss://' + domain + '/api/v1/streaming/?stream=public:local&access_token=' + at
	} else if (type === 'tag') {
		wssStart =
			'wss://' + domain + '/api/v1/streaming/?stream=hashtag&tag=' + data + '&access_token=' + at
	}
	websocket = new WebSocket(start)
	websocket.onopen = function (mess) {
		$('#notice_icon_' + tlid).removeClass('red-text')
	}
	websocket.onmessage = function (mess) {
		const typeA = JSON.parse(mess.data).event
		if (typeA === 'update') {
			const obj = JSON.parse(JSON.parse(mess.data).payload)
			const templete = parse([obj], '', acct_id, tlid)
			jQuery('time.timeago').timeago()
			$('#timeline_nano').html(templete)
		}
	}
	websocket.onerror = function (error) {
		console.error('WebSocket Error ' + error)
	}
	websocket.onclose = function (mess) {
		console.error('Close Streaming API:' + type)
	}
}
//TLのタイトル
function cap(type, data) {
	if (type === 'home') {
		return 'Home'
	} else if (type === 'local') {
		return 'Local'
	} else if (type === 'pub') {
		return 'Public'
	} else if (type === 'tag') {
		return '#' + data
	} else if (type === 'list') {
		return 'List(id:' + data + ')'
	} else if (type === 'notf') {
		return 'Notification'
	}
}

//TLのURL
function com(type, data) {
	if (type === 'home') {
		return 'home?'
	} else if (type === 'local') {
		return 'public?local=true&'
	} else if (type === 'pub') {
		return 'public?'
	} else if (type === 'tag') {
		return 'tag/' + data + '?'
	}
	if (type === 'list') {
		return 'list/' + data + '?'
	}
}

//TLのアイコン
function icon(type) {
	if (type === 'home') {
		return 'home'
	} else if (type === 'local') {
		return 'people_outline'
	} else if (type === 'pub') {
		return 'language'
	} else if (type === 'tag') {
		return 'search'
	}
	if (type === 'list') {
		return 'subject'
	}
}
function todo() { }
function todc() { }
function hide() { }
$(function ($) {
	//キーボードショートカット
	$(window).keydown(function (e) {
		//Ctrl+Enter:投稿
		if (e.ctrlKey) {
			if (e.keyCode === 13) {
				post()
				return false
			}
		}
	})
})
function set() {
	$('#menu').toggleClass('hide')
	if ($('#menu').hasClass('hide')) {
		$('#setting').text('Setting')
	} else {
		$('#setting').text('Close')
	}
}

const obj = getMulti()
const last = localStorage.getItem('last-use')
let key = 0
for (const acct of obj) {
	const list = key * 1 + 1
	const sel = key.toString() === last ? 'selected' : ''
	const template = `<option value="${key}" ${sel}>${acct.user}@${acct.domain}</option>`
	$('#post-acct-sel').append(template)
	key++
}
function mov() {
	return false
}
function resetmv() {
	return false
}
function post() {
	const acct_id = $('#post-acct-sel').val()
	const domain = localStorage.getItem('domain_' + acct_id)
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	const start = 'https://' + domain + '/api/v1/statuses'
	const str = $('#textarea').val()
	const toot = {
		status: str
	}
	const vis = loadVis(acct_id)
	toot.visibility = vis
	const httpreq = new XMLHttpRequest()
	httpreq.open('POST', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.setRequestHeader('Authorization', 'Bearer ' + at)
	httpreq.responseType = 'json'
	httpreq.send(JSON.stringify(toot))
	httpreq.onreadystatechange = function () {
		if (httpreq.readyState === 4) {
			if (this.status !== 200) {
				setLog(start, this.status, this.response)
			}
			$('#textarea').val('')
		}
	}
}
function loadVis(acct_id) {
	const vist = localStorage.getItem('vis')
	if (!vist) {
		return 'public'
	} else {
		if (vist === 'memory') {
			return localStorage.getItem('vis-memory-' + acct_id) || 'public'
		} else if (vist === 'server' || vist === 'useapi') {
			const multi = getMulti()
			const obj = JSON.parse(multi)
			return obj[acct_id]['vis'] || 'public'
		} else {
			return vist
		}
	}
}
function loader() {
	const acct_id = $('#post-acct-sel').val()
	console.log(loadVis(acct_id))
	$('#vis-sel').val(loadVis(acct_id))
}
loader()
$('textarea').height(15) //init
$('textarea').css('lineHeight', '1rem') //init

$('textarea').on('input', function (evt) {
	if (evt.target.scrollHeight > evt.target.offsetHeight) {
		$(evt.target).height(evt.target.scrollHeight)
	} else {
		const lineHeight = Number(
			$(evt.target)
				.css('lineHeight')
				.split('px')[0]
		)
		while (true) {
			$(evt.target).height(($(evt.target).height() || 0) - lineHeight)
			if (evt.target.scrollHeight > evt.target.offsetHeight) {
				$(evt.target).height(evt.target.scrollHeight)
				break
			}
		}
	}
})
