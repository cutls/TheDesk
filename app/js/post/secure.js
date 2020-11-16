/*保護系*/
//画像保護
function nsfw() {
	if ($('#nsfw').hasClass('nsfw-avail')) {
		$('#nsfw').removeClass('yellow-text')
		$('#nsfw').html('visibility_off')
		$('#nsfw').removeClass('nsfw-avail')
	} else {
		$('#nsfw').addClass('yellow-text')
		$('#nsfw').html('visibility')
		$('#nsfw').addClass('nsfw-avail')
	}
}

//投稿公開範囲
function vis(set) {
	$('#vis').text(set)
	$('#vis-icon').removeClass('red-text')
	$('#vis-icon').removeClass('orange-text')
	$('#vis-icon').removeClass('blue-text')
	$('#vis-icon').removeClass('purple-text')
	$('#vis-icon').removeClass('light-blue-text')
	$('#vis-icon').removeClass('teal-text')
	if (set == 'public') {
		$('#vis-icon').text('public')
		$('#vis-icon').addClass('purple-text')
	} else if (set == 'unlisted') {
		$('#vis-icon').text('lock_open')
		$('#vis-icon').addClass('blue-text')
	} else if (set == 'private') {
		$('#vis-icon').text('lock')
		$('#vis-icon').addClass('orange-text')
	} else if (set == 'direct') {
		$('#vis-icon').text('mail')
		$('#vis-icon').addClass('red-text')
	} else if (set == 'limited') {
		$('#vis-icon').text('group')
		$('#vis-icon').addClass('teal-text')
	} else if (set == 'local') {
		$('#vis-icon').text('visibility')
		$('#vis-icon').addClass('light-blue-text')
	}
	var vis = localStorage.getItem('vis')
	if (vis == 'memory') {
		var acct_id = $('#post-acct-sel').val()
		localStorage.setItem('vis-memory-' + acct_id, set)
	}
	var ins = M.Dropdown.getInstance($('#dropdown1'))
	if (ins) {
		ins.close()
	}
}
function loadVis() {
	var vist = localStorage.getItem('vis')
	if (!vist) {
		vis('public')
	} else {
		if (vist == 'memory') {
			var acct_id = $('#post-acct-sel').val()
			var memory = localStorage.getItem('vis-memory-' + acct_id)
			if (!memory) {
				memory = 'public'
			}
			vis(memory)
		} else if (vist == 'useapi') {
			var acct_id = $('#post-acct-sel').val()
			var multi = localStorage.getItem('multi')
			var obj = JSON.parse(multi)
			var memory = obj[acct_id]['vis']
			if (!memory) {
				memory = 'public'
			}
			vis(memory)
		} else {
			vis(vist)
		}
	}
}
loadVis()

//コンテントワーニング
function cw() {
	if ($('#cw').hasClass('cw-avail')) {
		$('#cw-text').val()
		$('#cw-text').hide()
		$('#cw').removeClass('yellow-text')
		$('#cw').removeClass('cw-avail')
	} else {
		$('#cw-text').show()
		$('#cw').addClass('yellow-text')
		$('#cw').addClass('cw-avail')
		var cwt = localStorage.getItem('cw-text')
		if (cwt) {
			$('#cw-text').val(cwt)
		}
	}
}
//TLでコンテントワーニングを表示トグル
function cw_show(e) {
	$(e).parent().parent().find('.cw_hide').toggleClass('cw')
	$(e).parent().find('.cw_long').toggleClass('hide')
}
$(function () {
	$('#cw-text').on('change', function (event) {
		var acct_id = $('#post-acct-sel').val()
		var domain = localStorage.getItem('domain_' + acct_id)
		var cwlen = $('#cw-text').val().length

		if (idata[domain + '_letters']) {
			$('#textarea').attr('data-length', idata[domain + '_letters'] - cwlen)
		} else {
			$('#textarea').attr('data-length', 500 - cwlen)
		}
	})
})
//スケジュール
function schedule() {
	if ($('#sch-box').hasClass('sch-avail')) {
		$('#sch-box').hide()
		$('#sch-box').removeClass('sch-avail')
	} else {
		var date = new Date()

		$('#sch-box').show()
		$('#sch-date').val(formattime(date))
		$('#sch-box').addClass('sch-avail')
	}
}

//下書き機能
function draftToggle() {
	if ($('#draft').hasClass('hide')) {
		$('#draft').removeClass('hide')
		$('#right-side').show()
		$('#right-side').css('width', '300px')
		$('#left-side').css('width', 'calc(100% - 300px)')
		var width = localStorage.getItem('postbox-width')
		if (width) {
			width = width.replace('px', '') * 1 + 300
		} else {
			width = 600
		}
		$('#post-box').css('width', width + 'px')
		$('#suggest').html('')
		$('#draft').html('')
		draftDraw()
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
function draftDraw() {
	var draft = localStorage.getItem('draft')
	var html = `<button class="btn waves-effect green" style="width:100%; padding:0; margin-top:0;" onclick="addToDraft();">${lang.lang_secure_draft}</button>`
	if (draft) {
		var draftObj = JSON.parse(draft)
		for (let i = 0; i < draftObj.length; i++) {
			var toot = draftObj[i]
			html = html + `<div class="tootInDraft">
				<i class="waves-effect gray material-icons" onclick="useThisDraft(${i})" title="${lang.lang_secure_userThis}">reply</i>
				<i class="waves-effect gray material-icons" onclick="deleteThisDraft(${i})" title="${lang.lang_secure_deleteThis}">cancel</i>
				${escapeHTML(toot.status).replace(/\n/, '').substr(0, 10)}
			</div>`
		}
	}
	$('#draft').html(html)
}
function addToDraft() {
	var json = post(null, null, true)
	var draft = localStorage.getItem('draft')
	var draftObj = []
	if (draft) draftObj = JSON.parse(draft)
	draftObj.push(json)
	draft = JSON.stringify(draftObj)
	localStorage.setItem('draft', draft)
	draftDraw()
}
function useThisDraft(i) {
	var draft = localStorage.getItem('draft')
	var draftObj = JSON.parse(draft)
	draftToPost(draftObj[i], draftObj[i]['TheDeskAcctId'], 0)
	draftToggle()
}
function deleteThisDraft(i) {
	var draft = localStorage.getItem('draft')
	var draftObj = JSON.parse(draft)
	draftObj.splice(i, 1)
	draft = JSON.stringify(draftObj)
	localStorage.setItem('draft', draft)
	draftDraw()
}