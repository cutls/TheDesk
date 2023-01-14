/*ささやきボックス(Cr民並感)*/
//✕隠す
function hide() {
	$('#right-side').hide()
	$('#right-side').css('width', '300px')
	$('#left-side').css('width', '100%')
	var width = localStorage.getItem('postbox-width')
	if (width) {
		width = width.replace('px', '') * 1
	} else {
		width = 300
	}
	$('#post-box').css('width', width)
	$('#post-box').fadeOut()
	$('#post-box').removeClass('appear')
	$('#emoji').addClass('hide')
	$('#left-side').show()
	$('#default-emoji').show()
	$('#unreact').show()
	$('#addreact').addClass('hide')
}
//最小化
function mini() {
	$('body').toggleClass('mini-post')
	if ($('body').hasClass('mini-post')) {
		$('.mini-btn').text('expand_less')
	} else {
		$('.mini-btn').text('expand_more')
	}
}
//最小化時に展開
function show() {
	$('#post-box').addClass('appear')
	$('#textarea').focus()
	console.log('show' + localStorage.getItem('postbox-left'))
	var left = localStorage.getItem('postbox-left')
	if (left > $('body').width() - $('#post-box').width()) {
		left = $('body').width() - $('#post-box').width()
	} else if (left < 0) {
		left = 0
	}
	var top = localStorage.getItem('postbox-top')
	if (top > $('body').height() - $('#post-box').height()) {
		top = $('body').height() - $('#post-box').height()
	} else if (top < 0) {
		top = 0
	}
	$('#post-box').css('left', left + 'px')
	$('#post-box').css('top', top + 'px')
	var width = localStorage.getItem('postbox-width')
	if (width) {
		$('#post-box').css('width', width + 'px')
	} else {
		$('#post-box').css('width', '300px')
	}
	$('#post-box').fadeIn()
	$('#textarea').characterCounter()
	mdCheck()
}

$(function () {
	$('#post-box').draggable({
		handle: '#post-bar',
		stop: function () {
			var left = $('#post-box').offset().left
			if (left > $('body').width() - $('#post-box').width()) {
				left = $('body').width() - $('#post-box').width()
			} else if (left < 0) {
				left = 0
			}
			var top = $('#post-box').offset().top
			if (top > $('body').height() - $('#post-box').height()) {
				top = $('body').height() - $('#post-box').height()
			} else if (top < 0) {
				top = 0
			}
			localStorage.setItem('postbox-left', left)
			localStorage.setItem('postbox-top', top)
		},
	})
	$('#post-box').resizable({
		minHeight: 150,
		minWidth: 100,
		stop: function (event, ui) {
			$('#textarea').blur()
			localStorage.setItem('postbox-width', ui.size.width)
		},
	})
})

//コード受信
if (location.search) {
	var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/)
	var mode = m[1]
	var codex = m[2]
	if (mode === 'share') {
		$('textarea').focus()
		$('#textarea').val(decodeURI(codex))
		show()
		$('body').removeClass('mini-post')
		$('.mini-btn').text('expand_less')
	}
}

function initPostbox() {
	$('#posttgl').click(function (e) {
		if (!$('#post-box').hasClass('appear')) {
			show()
		} else {
			hide()
		}
		$('.cvo').removeClass('selectedToot')
		selectedColumn = 0
		selectedToot = 0
	})

	$('#timeline-container,#group').click(function (e) {
		if (localStorage.getItem('box') !== 'absolute') {
			if ($('#post-box').hasClass('appear') && !localStorage.getItem('nohide')) {
				hide()
			}
		}
		$('.cvo').removeClass('selectedToot')
		selectedColumn = 0
		selectedToot = 0
		localStorage.removeItem('nohide')
		srcBox('close')
		tShowBox('close')
	})
	$('#textarea,#cw-text').focusout(function (e) {
		localStorage.setItem('nohide', true)
		var countup = function () {
			localStorage.removeItem('nohide')
		}
		//setTimeout(remove, 100);
		$('.cvo').removeClass('selectedToot')
		selectedColumn = 0
		selectedToot = 0
	})
}

function mdCheck() {
	var acct_id = $('#post-acct-sel').val()
	var profimg = localStorage.getItem('prof_' + acct_id)
	if (!profimg) {
		profimg = '../../img/missing.svg'
	}
	$('#acct-sel-prof').attr('src', profimg)
	if (localStorage.getItem('post_' + acct_id)) {
		$('#toot-post-btn').text(
			localStorage.getItem('post_' + acct_id) +
				'(' +
				localStorage.getItem('domain_' + acct_id) +
				')'
		)
	} else {
		$('#toot-post-btn').text(lang.lang_toot + '(' + localStorage.getItem('domain_' + acct_id) + ')')
	}
	if (!localStorage.getItem('bb_' + acct_id) && !localStorage.getItem('md_' + acct_id)) {
		$('.markdown').addClass('hide')
		$('.anti-markdown').addClass('hide')
	} else {
		$('.anti-markdown').removeClass('hide')
	}
	if ($('.markdown').hasClass('hide')) {
		localStorage.setItem('md', 'hide')
	} else {
		localStorage.removeItem('md')
	}
	var domain = localStorage.getItem('domain_' + acct_id)
	if (domain === 'itabashi.0j0.jp') {
		$('#limited-button').removeClass('hide')
	} else {
		$('#limited-button').addClass('hide')
	}
	if (localStorage.getItem('mode_' + domain) === 'misskey') {
		toast({ html: lang.lang_bbmd_misskey, displayLength: 5000 })
	}
	if (idata[domain + '_letters']) {
		$('#textarea').attr('data-length', idata[domain + '_letters'])
	} else {
		var maxletters = localStorage.getItem('letters_' + acct_id)
		if (maxletters > 0) {
			$('#textarea').attr('data-length', maxletters)
		} else {
			$('#textarea').attr('data-length', 500)
		}
	}
	if (idata[domain + '_glitch'] === 'true') {
		$('#local-button').removeClass('hide')
	} else {
		$('#local-button').addClass('hide')
	}
	var obj = getMulti()
	if (multi) {
		if (
			obj[acct_id].background &&
			obj[acct_id].background !== 'def' &&
			obj[acct_id].text &&
			obj[acct_id].text !== 'def'
		) {
			$('#toot-post-btn').removeClass('indigo')
			$('#toot-post-btn').css('background-color', '#' + obj[acct_id].background)
			$('#toot-post-btn').css('color', obj[acct_id].text)
		} else {
			$('#toot-post-btn').css('background-color', '')
			$('#toot-post-btn').css('color', '')
			$('#toot-post-btn').addClass('indigo')
		}
	}
	loadVis()
}