import $ from 'jquery'
import { modalInitGetInstance, toast } from '../common/declareM'
import lang from '../common/lang'
import { execCopy } from '../platform/end'
import { details } from '../tl/datails'
/*イメージビューワー*/
//postのimg.jsとは異なります。
export function imgv(id: string, key: number, acctId?: string) {
	let murl = $(`#${id}-image-${key}`).attr('data-url')
	if (!murl) return
	$('#imgprog').text(0)
	$('#imgsec').text(0)
	$('#imgmodal').hide()
	rotate(true)
	$('#imgmodal').attr('src', '../../img/loading.svg')
	let ourl = $(`#${id}-image-${key}`).attr('data-original')
	if (!ourl || ourl === 'null') ourl = murl
	const type = $(`#${id}-image-${key}`).attr('data-type')
	$('#imagemodal').attr('data-id', id)
	if (acctId) $('#imagemodal').attr('data-acct', acctId)
	$('#imagemodal').attr('data-original', ourl)
	$('#imagemodal').attr('data-image', murl)
	$('#imgprog').text(0)
	$('#imgsec').text(0)
	$('#imgmodal').attr('src', '../../img/loading.svg')
	//表示はリモートを使うか(どちらにしろコピーはオリジナル)
	const remoteImg = localStorage.getItem('remote_img') === 'yes'
	if (remoteImg) murl = ourl
	if (type === 'image') {
		const i = document.getElementById('imagemodal')
		if (i) {
			const instance = modalInitGetInstance(i)
			instance.open()
		}
		imageXhr(id, key, murl)
		const elem = <HTMLElement>document.getElementById('imagewrap')
		dragScroll(elem) // ドラッグスクロール設定
		$('#imgmodal').show()
		$('#imagemodal').attr('data-key', key)
		$('#imagemodal').attr('data-id', id)
	} else if (type === 'video' || type === 'gifv') {
		$('#video').attr('src', murl)
		const instance = modalInitGetInstance($('#videomodal'))
		instance.open()
		$('#imgmodal').show()
	}
}
//イメージビューワーの送り
export function imgCont(mode: 'next' | 'prev') {
	let key = parseInt($('#imagemodal').attr('data-key') || '0', 10)
	const id = $('#imagemodal').attr('data-id') || ''
	if (mode === 'next') {
		key++
	} else if (mode === 'prev') {
		key = key * 1 - 1
	}
	imgv(id, key)
}
function imageXhr(id: string, key: number, murl: string) {
	let time = 0
	const startTime = new Date()
	const timer = setInterval(function () {
		time = time + 1
	}, 10)
	$('#imgmodal-progress div').removeClass('determinate')
	$('#imgmodal-progress div').addClass('indeterminate')
	$('#imgmodal-progress').removeClass('hide')
	const xhr = new XMLHttpRequest()
	xhr.open('GET', murl, true)
	xhr.responseType = 'arraybuffer'
	xhr.addEventListener(
		'progress',
		function (event) {
			if (event.lengthComputable) {
				const total = event.total
				const now = event.loaded
				$('#imgbyte').text(`${Math.floor(now / 1024)}KB/${Math.floor(total / 1024)}`)
				const per = (now / total) * 100
				$('#imgmodal-progress div').removeClass('indeterminate')
				$('#imgmodal-progress div').addClass('determinate')
				$('#imgmodal-progress div').css('width', `${per}%`)
				$('#imgprog').text(Math.floor(per))
			}
		},
		false
	)
	xhr.addEventListener(
		'loadend',
		function (event) {
			const total = event.total
			$('#imgbyte').text(Math.floor(total / 1024))
			const now = event.loaded
			const per = (now / total) * 100
			$('#imgprog').text(Math.floor(per))
			$('#imgmodal-progress').addClass('hide')
			$('#imgmodal-progress div').css('width', '0%')
			$('#imgmodal-progress div').removeClass('determinate')
			$('#imgmodal-progress div').addClass('indeterminate')
		},
		false
	)
	xhr.addEventListener(
		'error',
		function () {
			$('#imgmodal').attr('src', murl)
			clearInterval(timer)
			const proctime = '?'
			$('#imgsec').text(proctime)
			$('#imgmodal-progress div').removeClass('determinate')
			$('#imgmodal-progress div').addClass('indeterminate')
			$('#imgbyte').text('?')
		},
		false
	)
	xhr.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			const r = new FileReader()
			r.readAsDataURL(this.response)
			r.onload = function () {
				const b64 = r.result
				const element = new Image()
				element.onload = function () {
					const width = element.naturalWidth
					const height = element.naturalHeight
					calcNiceAspect(width, height)
					$('#imagemodal').attr('data-naturalWidth', width)
					$('#imagemodal').attr('data-naturalHeight', height)
				}
				if ($(`#${id}-image-${key + 1}`).length === 0) {
					$('#image-next').prop('disabled', true)
				} else {
					$('#image-next').prop('disabled', false)
				}
				if ($(`#${id}-image-${key - 1}`).length === 0) {
					$('#image-prev').prop('disabled', true)
				} else {
					$('#image-prev').prop('disabled', false)
				}
				const src = b64?.toString() || murl
				element.src = src
				const endTime = new Date()
				clearInterval(timer)
				const proctime = endTime.getTime() - startTime.getTime()
				$('#imgsec').text(proctime)
				$('#imgmodal').attr('src', src)
			}
		}
	}
	xhr.responseType = 'blob'
	xhr.send()
}
function calcNiceAspect(width: number, height: number) {
	if (width < 650) width = 650
	const windowH = $(window).height() || 0
	const windowW = $(window).width() || 0
	$('#imagemodal').css('bottom', '0')
	$('#imagemodal img').css('width', 'auto')
	if (height < windowH) {
		$('#imagemodal').css('height', height + 100 + 'px')
		$('#imagemodal img').css('height', height + 'px')
		if (width > windowW * 0.8) {
			$('#imagemodal').css('width', '80vw')
			$('#imagemodal img').css('width', 'auto')
			const heightS = ((windowW * 0.8) / width) * height
			$('#imagemodal').css('height', heightS + 100 + 'px')
		} else {
			$('#imagemodal').css('width', width + 'px')
		}
	} else {
		$('#imagemodal img').css('width', 'auto')
		const widthS = (windowH / height) * width
		if (widthS < windowW) {
			$('#imagemodal').css('width', widthS + 'px')
		} else {
			$('#imagemodal').css('width', '100vw')
		}

		$('#imagemodal').css('height', '100vh')
		$('#imagemodal img').css('height', 'calc(100vh - 60px)')
	}
}
//ズームボタン(z:倍率)
export function zoom(z: number) {
	let wdth = $('#imagewrap img').width() || 0
	wdth = wdth * z
	$('#imagewrap img').css('width', wdth + 'px')
	let hgt = $('#imagewrap img').height() || 0
	hgt = hgt * z
	$('#imagewrap img').css('height', hgt + 'px')
}
//スマホ対応ドラッグ移動システム
function dragScroll(elem: HTMLElement) {
	const target = elem
	$(target)
		.mousedown(function (event) {
			$(this).data('down', true).data('x', event.clientX).data('y', event.clientY).data('scrollLeft', this.scrollLeft).data('scrollTop', this.scrollTop)
			return false
		})
		.css({
			overflow: 'hidden', // スクロールバー非表示
			cursor: 'move',
		})
	// ウィンドウから外れてもイベント実行
	$(document)
		.mousemove(function (event) {
			if ($(target).data('down') === true) {
				// スクロール
				$(target).scrollLeft($(target).data('scrollLeft') + $(target).data('x') - event.clientX)
				$(target).scrollTop($(target).data('scrollTop') + $(target).data('y') - event.clientY)
				return false // 文字列選択を抑止
			}
		})
		.mouseup(function () {
			$(target).data('down', false)
		})
	$(target)
		.on('touchstart', function (event) {
			$(this).data('down', true).data('x', getX(event)).data('y', getY(event)).data('scrollLeft', this.scrollLeft).data('scrollTop', this.scrollTop)
			return false
		})
		.css({
			overflow: 'hidden', // スクロールバー非表示
			cursor: 'move',
		}) //指が触れたか検知
	$(target).on('touchmove', function (event) {
		if ($(target).data('down') === true) {
			// スクロール
			$(target).scrollLeft($(target).data('scrollLeft') + $(target).data('x') - getX(event))
			$(target).scrollTop($(target).data('scrollTop') + $(target).data('y') - getY(event))
			return false // 文字列選択を抑止
		}
	}) //指が動いたか検知
	$(target).on('touchend', function () {
		$(target).data('down', false)
	})

	return target
}

function getX(event: JQuery.TouchStartEvent | JQuery.TouchMoveEvent) {
	return event.originalEvent?.touches[0].pageX || 0
}

function getY(event: JQuery.TouchStartEvent | JQuery.TouchMoveEvent) {
	return event.originalEvent?.touches[0].pageY || 0
}
//マウスホイールで拡大
const element = <any>document.getElementById('imagemodal')
if (element)
	element.onmousewheel = function (e) {
		const delta = e.wheelDelta
		if (delta > 0) {
			zoom(1.1)
		} else {
			zoom(0.9)
		}
	}
export function rotate(reset: boolean) {
	if (reset) {
		$('#imagewrap img').removeClass('rotate-90')
		$('#imagewrap img').removeClass('rotate-180')
		$('#imagewrap img').removeClass('rotate-270')
		$('#imagemodal').attr('data-naturalWidth', null)
		$('#imagemodal').attr('data-naturalWidth', null)
		return true
	}
	const width = parseInt($('#imagemodal').attr('data-naturalWidth') || '0', 10)
	const height = parseInt($('#imagemodal').attr('data-naturalHeight') || '0', 10)
	if ($('#imagewrap img').hasClass('rotate-90')) {
		$('#imagewrap img').removeClass('rotate-90')
		$('#imagewrap img').addClass('rotate-180')
		calcNiceAspect(width, height)
	} else if ($('#imagewrap img').hasClass('rotate-180')) {
		$('#imagewrap img').removeClass('rotate-180')
		$('#imagewrap img').addClass('rotate-270')
		calcNiceAspect(height, width)
	} else if ($('#imagewrap img').hasClass('rotate-270')) {
		$('#imagewrap img').removeClass('rotate-270')
		calcNiceAspect(width, height)
	} else {
		$('#imagewrap img').addClass('rotate-90')
		calcNiceAspect(height, width)
	}
}

//当該トゥート
export function detFromImg() {
	const id = $('#imagemodal').attr('data-id') || ''
	const acctId = $('#imagemodal').attr('data-acct') || ''
	const instance = modalInitGetInstance($('#imagemodal'))
	instance.close()
	details(id, acctId)
}
//画像保存
export function dlImg() {
	const ourl = $('#imagemodal').attr('data-original')
	let murl = $('#imagemodal').attr('data-image')
	const remoteImg = localStorage.getItem('remote_img') === 'yes'
	if (remoteImg) murl = ourl
	const save = localStorage.getItem('savefolder') || ''
	postMessage(['generalDL', [murl, save, false]], '*')
}
export function openFinder(dir: string) {
	postMessage(['openFinder', dir], '*')
}
export function stopVideo() {
	const v = <HTMLVideoElement>document.getElementById('video')
	v.pause()
}
export function copyImgUrl() {
	const murl = $('#imagemodal').attr('data-original')
	execCopy(murl)
	toast({ html: lang.lang_img_copyDone, displayLength: 1500 })
}
export async function copyImgBinary() {
	const murl = $('#imagemodal').attr('data-original')
	if (!murl) return
	const blob = await (await fetch(murl)).blob()
	const reader = new FileReader()
	reader.onloadend = function () {
		postMessage(['copyBinary', reader.result], '*')
		toast({ html: lang.lang_imgBin_copyDone, displayLength: 1500 })
	}
	reader.readAsDataURL(blob)
}
