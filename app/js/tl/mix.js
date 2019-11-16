//Integrated TL
async function mixtl(acct_id, tlid, type, delc, voice) {
	localStorage.setItem('now', type)
	todo('Integrated TL Loading...(Local)')
	const domain = localStorage.getItem('domain_' + acct_id)
	let startLocal = 'https://' + domain + '/api/v1/timelines/public?local=true'
	let local = await getTL(startLocal, acct_id)
	let startHome = 'https://' + domain + '/api/v1/timelines/home'
	let home = await getTL(startHome, acct_id)
	let concated = _.concat(local, home)
	let uniqued = _.uniqBy(concated, 'id')
	let sorted = _.orderBy(uniqued, ['id'], ['desc'])
	let integrated = _.slice(sorted, 0, 19)
	$('#landing_' + tlid).hide()
	let mute = getFilterTypeByAcct(acct_id, 'mix')
	let templete = parse(integrated, type, acct_id, tlid, '', mute, type)
	localStorage.setItem('lastobj_' + tlid, integrated[0].id)
	$('#timeline_' + tlid).html(templete)
	additional(acct_id, tlid)
	jQuery('time.timeago').timeago()
	todc()
	mixre(acct_id, tlid, 'mix', mute, voice, '')
	$(window).scrollTop(0)
	lastId = integrated[0].id
	beforeLastId = integrated[1].id
}
async function getTL(start, acct_id) {
	const at = localStorage.getItem('acct_' + acct_id + '_at')
	let promise = await fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
	if (!promise.ok) {
		promise.text().then(function(text) {
			setLog(promise.url, promise.status, text)
		})
	}
	return await promise.json()
}

//Streamingに接続
function mixre(acct_id, tlid, TLtype, mute, voice, mode) {
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	if (localStorage.getItem('streaming_' + acct_id)) {
		var wss = localStorage.getItem('streaming_' + acct_id)
	} else {
		var wss = 'wss://' + domain
	}
	var startHome = wss + '/api/v1/streaming/?stream=user&access_token=' + at
	var startLocal = wss + '/api/v1/streaming/?stream=public:local&access_token=' + at
	var wshid = wsHome.length
	var wslid = wsLocal.length
	wsHome[wshid] = new WebSocket(startHome)
	wsLocal[wslid] = new WebSocket(startLocal)
	wsHome[wshid].onopen = function(mess) {
		localStorage.setItem('wssH_' + tlid, wshid)
		console.table({
			tlid: tlid,
			type: 'Connect Streaming API(Integrated:Home)',
			domain: domain,
			message: mess
		})
		$('#notice_icon_' + tlid).removeClass('red-text')
	}
	wsLocal[wslid].onopen = function(mess) {
		localStorage.setItem('wssL_' + tlid, wslid)
		console.table({
			tlid: tlid,
			type: 'Connect Streaming API(Integrated:Local)',
			domain: domain,
			message: mess
		})
		$('#notice_icon_' + tlid).removeClass('red-text')
	}
	wsLocal[wslid].onmessage = function(mess) {
		console.log('Receive Streaming API:(Integrated:Local)', mess)
		integratedMessage(mess, acct_id, tlid, mute, voice)
	}
	wsHome[wshid].onmessage = function(mess) {
		console.log(['Receive Streaming API:(Integrated:Home)', mess])
		integratedMessage(mess, acct_id, tlid, mute, voice)
	}
	wsLocal[wslid].onerror = function(error) {
		console.error('WebSocketLocal Error')
		console.error(error)
		$('#notice_icon_' + tlid).addClass('red-text')
		if (mode == 'error') {
			todo('WebSocket Error ' + error)
		} else {
			var errorct = localStorage.getItem('wserror_' + tlid) * 1 + 1
			localStorage.setItem('wserror_' + tlid, errorct)
			if (errorct < 3) {
				reconnector(tlid, TLtype, acct_id, '', 'error')
			}
		}
	}
	wsLocal[wslid].onclose = function() {
		console.warn('WebSocketLocal Closing:' + tlid)
		$('#notice_icon_' + tlid).addClass('red-text')
		if (mode == 'error') {
			todo('WebSocket Closed')
		} else {
			var errorct = localStorage.getItem('wserror_' + tlid) * 1 + 1
			localStorage.setItem('wserror_' + tlid, errorct)
			if (errorct < 3) {
				reconnector(tlid, TLtype, acct_id, '', 'error')
			}
		}
	}
	wsHome[wshid].onerror = function(error) {
		console.error(['WebSocketHome Error', error])
		$('#notice_icon_' + tlid).addClass('red-text')
		if (mode == 'error') {
			todo('WebSocket Error ' + error)
		} else {
			var errorct = localStorage.getItem('wserror_' + tlid) * 1 + 1
			localStorage.setItem('wserror_' + tlid, errorct)
			if (errorct < 3) {
				reconnector(tlid, TLtype, acct_id, '', 'error')
			}
		}
	}
	wsHome[wshid].onclose = function() {
		console.warn('WebSocketHome Closing:' + tlid)
		$('#notice_icon_' + tlid).addClass('red-text')
		if (mode == 'error') {
			todo('WebSocket Closed')
		} else {
			var errorct = localStorage.getItem('wserror_' + tlid) * 1 + 1
			localStorage.setItem('wserror_' + tlid, errorct)
			if (errorct < 3) {
				reconnector(tlid, TLtype, acct_id, '', 'error')
			}
		}
	}
}
function integratedMessage(mess, acct_id, tlid, mute, voice) {
	let data = JSON.parse(mess.data)
	let type = data.event
	let payload = data.payload
	if (type == 'delete') {
		$('[unique-id=' + payload + ']').hide()
		$('[unique-id=' + payload + ']').remove()
	} else if (type == 'update') {
		let obj = JSON.parse(payload)
		
		if (obj.id != lastId && obj.id != beforeLastId) {
			lastId = obj.id
			beforeLastId = obj.id
			let dom = parse([obj], '', acct_id, tlid, '', mute)
			if (voice) say(obj.content)
			if ($('timeline_box_' + tlid + '_box .tl-box').scrollTop() === 0) {
				$('#timeline_' + tlid).prepend(dom)
			} else {
				let pool = localStorage.getItem('pool_' + tlid)
				if (pool) {
					pool = dom + pool
				} else {
					pool = dom
				}
				localStorage.setItem('pool_' + tlid, pool)
			}
			scrollck()
			additional(acct_id, tlid)
			jQuery('time.timeago').timeago()
		}
	}
}
//ある程度のスクロールで発火
async function mixmore(tlid, type) {
	var multi = localStorage.getItem('column')
	var obj = JSON.parse(multi)
	var acct_id = obj[tlid].domain
	moreloading = true
	todo('Integrated TL MoreLoading...(Local)')
	const domain = localStorage.getItem('domain_' + acct_id)
	const sid = $('#timeline_' + tlid + ' .cvo')
	.last()
	.attr('unique-id')
	let startLocal = 'https://' + domain + '/api/v1/timelines/public?local=true&max_id=' + sid
	let local = await getTL(startLocal, acct_id)
	let startHome = 'https://' + domain + '/api/v1/timelines/home?max_id=' + sid
	let home = await getTL(startHome, acct_id)
	let concated = _.concat(local, home)
	let uniqued = _.uniqBy(concated, 'id')
	let sorted = _.orderBy(uniqued, ['id'], ['desc'])
	let integrated = _.slice(sorted, 0, 19)
	$('#landing_' + tlid).hide()
	let mute = getFilterTypeByAcct(acct_id, 'mix')
	let templete = parse(integrated, type, acct_id, tlid, '', mute, type)
	localStorage.setItem('lastobj_' + tlid, integrated[0].id)
	$('#timeline_' + tlid).append(templete)
	additional(acct_id, tlid)
	jQuery('time.timeago').timeago()
	moreloading = false
	todc()
}
