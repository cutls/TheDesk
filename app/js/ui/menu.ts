import $ from 'jquery'
declare let jQuery
export function menu(forceOpen?: boolean) {
	localStorage.setItem('menu-done', 'true')
	$('#fukidashi').addClass('hide')
	if (!$('#menu').hasClass('appear') || forceOpen) {
		$('#menu').addClass('appear')
		const bodyWidth = $('body').width() || 0
		const bodyHeight = $('body').height() || 0
		const menuWidth = $('#menu').width() || 0
		const menuHeight = $('#menu').height() || 0
		let left = parseInt(localStorage.getItem('menu-left') || '0', 10)
		if (left > bodyWidth - menuWidth) {
			left = bodyWidth - menuWidth
		} else if (left < 0) {
			left = 0
		}
		let top = parseInt(localStorage.getItem('menu-top') || '0', 10)
		if (top > bodyHeight - menuHeight) {
			top = bodyHeight - menuHeight
		} else if (top < 0) {
			top = 0
		}
		$('#menu').css('left', left + 'px')
		$('#menu').css('top', top + 'px')
		const height = localStorage.getItem('menu-height')
		const width = localStorage.getItem('menu-width')
		if (height) {
			$('#menu').css('height', height + 'px')
		} else {
			$('#menu').css('height', '460px')
		}
		if (width) $('#menu').css('width', width + 'px')
		$('#menu').fadeIn()
		$('#menu-bar').html('TheDesk ' + localStorage.getItem('ver'))
		$('.menu-content').addClass('hide')
		$('#add-box').removeClass('hide')
		$('#left-menu div').removeClass('active')
		$('#addColumnMenu').addClass('active')
		$('#addColumnMenu').click()
	} else {
		$('#menu').fadeOut()
		$('#menu').removeClass('appear')
	}
}
$(function () {
	jQuery('#menu').draggable({
		handle: '#menu-bar',
		stop: function () {
			let left = $('#menu').offset()?.left || 0
			const bodyWidth = $('body').width() || 0
			const bodyHeight = $('body').height() || 0
			const menuWidth = $('#menu').width() || 0
			const menuHeight = $('#menu').height() || 0
			if (left > bodyWidth - menuWidth) {
				left = bodyWidth - menuWidth
			} else if (left < 0) {
				left = 0
			}
			let top = $('#menu').offset()?.top || 0
			if (top > bodyHeight - menuHeight) {
				top = bodyHeight - menuHeight
			} else if (top < 0) {
				top = 0
			}
			localStorage.setItem('menu-left', left.toString())
			localStorage.setItem('menu-top', top.toString())
		},
	})
	jQuery('#menu').resizable({
		minHeight: 150,
		minWidth: 200,
		stop: function (event, ui) {
			localStorage.setItem('menu-height', ui.size.height)
			localStorage.setItem('menu-width', ui.size.width)
		},
	})
})
export function help() {
	$('#left-menu a').removeClass('active')
	$('#helpMenu').addClass('active')
	$('.menu-content').addClass('hide')
	$('#help-box').removeClass('hide')
	postMessage(['sendSinmpleIpc', 'getLogs'], '*')
}
export function keyShortcut() {
	$('#left-menu a').removeClass('active')
	$('#ksMenu').addClass('active')
	$('.menu-content').addClass('hide')
	$('#ks-box').removeClass('hide')
}