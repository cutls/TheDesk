/*ささやきボックス(Cr民並感)*/

import { characterCounterInit } from '../common/declareM'
import lang from '../common/lang'
import { getMulti } from '../common/storage'
import { idata } from '../login/instance'
import { loadVis } from '../post/secure'
import { srcBox } from '../tl/src'
import { tShowBox } from '../tl/tag'
import $ from 'jquery'
declare let jQuery

//✕隠す
export function hide() {
	$('#right-side').hide()
	$('#right-side').css('width', '300px')
	$('#left-side').css('width', '100%')
	const width = parseInt(localStorage.getItem('postbox-width')?.replace('px', '') || '300', 10)
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
export function mini() {
	$('body').toggleClass('mini-post')
	if ($('body').hasClass('mini-post')) {
		$('.mini-btn').text('expand_less')
	} else {
		$('.mini-btn').text('expand_more')
	}
}
//最小化時に展開
export function show() {
	$('#post-box').addClass('appear')
	$('#textarea').focus()
	let left = parseInt(localStorage.getItem('postbox-left') || '0', 10)
	const bodyWidth = $('body').width() || 0
	const bodyHeight = $('body').height() || 0
	const pbWidth = $('#post-box').width() || 0
	const pbHeight = $('#post-box').height() || 0

	if (left > bodyWidth - pbWidth) {
		left = bodyWidth - pbWidth
	} else if (left < 0) {
		left = 0
	}
	let top = parseInt(localStorage.getItem('postbox-top') || '0', 10)
	if (top > bodyHeight - pbHeight) {
		top = bodyHeight - pbHeight
	}
	if (top < 0) {
		top = 0
	}
	$('#post-box').css('left', left + 'px')
	$('#post-box').css('top', top + 'px')
	const width = localStorage.getItem('postbox-width')
	if (width) {
		$('#post-box').css('width', width + 'px')
	} else {
		$('#post-box').css('width', '300px')
	}
	$('#post-box').fadeIn()
	characterCounterInit($('#textarea'))
	mdCheck()
}

$(function () {
	jQuery('#post-box').draggable({
		handle: '#post-bar',
		stop: function () {
			let left = $('#post-box').offset()?.left || 0
			const bodyWidth = $('body').width() || 0
			const bodyHeight = $('body').height() || 0
			const pbWidth = $('#post-box').width() || 0
			const pbHeight = $('#post-box').height() || 0
			if (left > bodyWidth - pbWidth) {
				left = bodyWidth - pbWidth
			} else if (left < 0) {
				left = 0
			}
			let top = $('#post-box').offset()?.top || 0
			if (top > bodyHeight - pbHeight) {
				top = bodyHeight - pbHeight
			} else if (top < 0) {
				top = 0
			}
			localStorage.setItem('postbox-left', left.toString())
			localStorage.setItem('postbox-top', top.toString())
		},
	})
	jQuery('#post-box').resizable({
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
	const m = location.search.match(/\?mode=([a-zA-Z-0-9]+)&code=(.+)/)
	if (m) {
		const mode = m[1]
		const codex = m[2]
		if (mode === 'share') {
			$('textarea').focus()
			$('#textarea').val(decodeURI(codex))
			show()
			$('body').removeClass('mini-post')
			$('.mini-btn').text('expand_less')
		}
	}
}

export function initPostbox() {
	$('#posttgl').click(function () {
		if (!$('#post-box').hasClass('appear')) {
			show()
		} else {
			hide()
		}
		$('.cvo').removeClass('selectedToot')
		globalThis.selectedColumn = 0
		globalThis.selectedToot = 0
	})

	$('#timeline-container,#group').click(function () {
		if (localStorage.getItem('box') !== 'absolute') {
			if ($('#post-box').hasClass('appear') && !localStorage.getItem('nohide')) {
				hide()
			}
		}
		$('.cvo').removeClass('selectedToot')
		globalThis.selectedColumn = 0
		globalThis.selectedToot = 0
		localStorage.removeItem('nohide')
		srcBox('close')
		tShowBox('close')
	})
	$('#textarea,#cw-text').focusout(function () {
		localStorage.setItem('nohide', 'true')
		//setTimeout(remove, 100);
		$('.cvo').removeClass('selectedToot')
		globalThis.selectedColumn = 0
		globalThis.selectedToot = 0
	})
}

export function mdCheck() {
	const acctId = parseInt($('#post-acct-sel').val()?.toString() || '0', 10)
	const profimg = localStorage.getItem('prof_' + acctId) || '../../img/missing.svg'
	$('#acct-sel-prof').attr('src', profimg)
	if (localStorage.getItem('post_' + acctId)) {
		$('#toot-post-btn').text(`${localStorage.getItem('post_' + acctId)}(${localStorage.getItem('domain_' + acctId)})`)
	} else {
		$('#toot-post-btn').text(`${lang.lang_toot}(${localStorage.getItem('domain_' + acctId)})`)
	}
	const domain = localStorage.getItem('domain_' + acctId)
	if (domain === 'itabashi.0j0.jp') {
		$('#limited-button').removeClass('hide')
	} else {
		$('#limited-button').addClass('hide')
	}
	if (idata[domain + '_letters']) {
		$('#textarea').attr('data-length', idata[domain + '_letters'])
	} else {
		const maxletters = parseInt(localStorage.getItem('letters_' + acctId) || '500', 10)
		$('#textarea').attr('data-length', maxletters)
	}
	if (idata[domain + '_glitch'] === 'true') {
		$('#local-button').removeClass('hide')
	} else {
		$('#local-button').addClass('hide')
	}
	const obj = getMulti()
	if (obj[acctId].background && obj[acctId].background !== 'def' && obj[acctId].text && obj[acctId].text !== 'def') {
		$('#toot-post-btn').removeClass('indigo')
		$('#toot-post-btn').css('background-color', '#' + obj[acctId].background)
		$('#toot-post-btn').css('color', obj[acctId].text || '')
	} else {
		$('#toot-post-btn').css('background-color', '')
		$('#toot-post-btn').css('color', '')
		$('#toot-post-btn').addClass('indigo')
	}
	loadVis()
}
