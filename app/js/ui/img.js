/*イメージビューワー*/
//postのimg.jsとは異なります。
function imgv(id, key, acct_id) {
	$('#imgprog').text(0)
	$('#imgsec').text(0)
	$('#imgmodal').hide()
	$('#imgmodal').attr('src', '../../img/loading.svg')
	var murl = $('#' + id + '-image-' + key).attr('data-url')
	var ourl = $('#' + id + '-image-' + key).attr('data-original')
	if (!ourl || ourl == 'null') {
		ourl = murl
	}
	var type = $('#' + id + '-image-' + key).attr('data-type')
	$('#imagemodal').attr('data-id', id)
	$('#imagemodal').attr('data-acct', acct_id)
	$('#imagemodal').attr('data-original', ourl)
	$('#imagemodal').attr('data-image', murl)
	//表示はリモートを使うか(どちらにしろコピーはオリジナル)
	var remote_img = localStorage.getItem('remote_img')
	if (remote_img == 'yes') {
		murl = ourl
	}
	$(document).ready(function() {
		if (type == 'image') {
			$('#imagemodal').modal('open')
			imageXhr(id, key, murl)
			$('#imagewrap').dragScroll() // ドラッグスクロール設定
			$('#imgmodal').show()
			$('#imagemodal').attr('data-key', key)
			$('#imagemodal').attr('data-id', id)
		} else if (type == 'video' || type == 'gifv') {
			$('#video').attr('src', murl)
			$('#videomodal').modal('open')
			$('#imgmodal').show()
		}
	})
}
//イメージビューワーの送り
function imgCont(type) {
	var key = $('#imagemodal').attr('data-key')
	var id = $('#imagemodal').attr('data-id')
	if (type == 'next') {
		key++
	} else if (type == 'prev') {
		key = key * 1 - 1
	}
	var murl = $('#' + id + '-image-' + key).attr('data-url')
	var ourl = $('#' + id + '-image-' + key).attr('data-original')
	var type = $('#' + id + '-image-' + key).attr('data-type')
	$('#imagemodal').attr('data-id', id)
	$('#imagemodal').attr('data-acct', acct_id)
	$('#imagemodal').attr('data-original', ourl)
	$('#imagemodal').attr('data-image', murl)
	//表示はリモートを使うか(どちらにしろコピーはオリジナル)
	var remote_img = localStorage.getItem('remote_img')
	if (remote_img == 'yes' && ourl != 'null') {
		murl = ourl
	}
	if (murl) {
		$('#imgprog').text(0)
		$('#imgsec').text(0)
		$('#imgmodal').attr('src', '../../img/loading.svg')
		var type = $('#' + id + '-image-' + key).attr('data-type')
		$(document).ready(function() {
			if (type == 'image') {
				imageXhr(id, key, murl)
				$('#imagewrap').dragScroll() // ドラッグスクロール設定
				$('#imagemodal').attr('data-key', key)
				$('#imagemodal').attr('data-id', id)
			} else if (type == 'video' || type == 'gifv') {
				$('#video').attr('src', murl)
				$('#videomodal').modal('open')
			}
		})
	}
}
function imageXhr(id, key, murl) {
	var startTime = new Date()
	xhr = new XMLHttpRequest()
	xhr.open('GET', murl, true)
	xhr.responseType = 'arraybuffer'
	xhr.addEventListener(
		'progress',
		function(event) {
			if (event.lengthComputable) {
				var total = event.total
				var now = event.loaded
				var per = (now / total) * 100
				$('#imgprog').text(Math.floor(per))
			}
		},
		false
	)
	xhr.addEventListener(
		'loadend',
		function(event) {
			var total = event.total
			$('#imgbyte').text(Math.floor(total/1024))
			var now = event.loaded
			var per = (now / total) * 100
			$('#imgprog').text(Math.floor(per))
		},
		false
	)
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			r = new FileReader()
			r.readAsDataURL(this.response)
			r.onload = function() {
				var b64 = r.result
				var element = new Image()
				var width
				element.onload = function() {
					var width = element.naturalWidth
					var height = element.naturalHeight
					var windowH = $(window).height()
					var windowW = $(window).width()
					$('#imagemodal').css('bottom', '0')
					$('#imagemodal img').css('width', 'auto')
					if (height < windowH) {
						$('#imagemodal').css('height', height + 60 + 'px')
						$('#imagemodal img').css('height', '100%')
						if (width > windowW * 0.8) {
							$('#imagemodal').css('width', '80vw')
							$('#imagemodal img').css('width', '100%')
							var heightS = ((windowW * 0.8) / width) * height
							$('#imagemodal').css('height', heightS + 60 + 'px')
						} else {
							$('#imagemodal').css('width', width + 'px')
						}
					} else {
						$('#imagemodal img').css('width', 'auto')
						var widthS = (windowH / height) * width
						if (widthS < windowW) {
							$('#imagemodal').css('width', widthS + 'px')
						} else {
							$('#imagemodal').css('width', '100vw')
						}

						$('#imagemodal').css('height', '100vh')
						$('#imagemodal img').css('height', 'calc(100vh - 60px)')
					}
				}
				if ($('#' + id + '-image-' + (key * 1 + 1)).length == 0) {
					$('#image-next').prop('disabled', true)
				} else {
					$('#image-next').prop('disabled', false)
				}
				if ($('#' + id + '-image-' + (key * 1 - 1)).length == 0) {
					$('#image-prev').prop('disabled', true)
				} else {
					$('#image-prev').prop('disabled', false)
				}
				element.src = b64
				var endTime = new Date()
				var proctime = endTime.getTime() - startTime.getTime()
				$('#imgsec').text(proctime)
				$('#imgmodal').attr('src', b64)
			}
		}
	}
	xhr.responseType = 'blob'
	xhr.send()
}
//ズームボタン(z:倍率)
function zoom(z) {
	var wdth = $('#imagewrap img').width()
	var wdth = wdth * z
	$('#imagewrap img').css('width', wdth + 'px')
	var hgt = $('#imagewrap img').height()
	var hgt = hgt * z
	$('#imagewrap img').css('height', hgt + 'px')
}
//スマホ対応ドラッグ移動システム
;(function() {
	$.fn.dragScroll = function() {
		var target = this
		$(this)
			.mousedown(function(event) {
				$(this)
					.data('down', true)
					.data('x', event.clientX)
					.data('y', event.clientY)
					.data('scrollLeft', this.scrollLeft)
					.data('scrollTop', this.scrollTop)
				return false
			})
			.css({
				overflow: 'hidden', // スクロールバー非表示
				cursor: 'move'
			})
		// ウィンドウから外れてもイベント実行
		$(document)
			.mousemove(function(event) {
				if ($(target).data('down') == true) {
					// スクロール
					target.scrollLeft($(target).data('scrollLeft') + $(target).data('x') - event.clientX)
					target.scrollTop($(target).data('scrollTop') + $(target).data('y') - event.clientY)
					return false // 文字列選択を抑止
				}
			})
			.mouseup(function(event) {
				$(target).data('down', false)
			})
		$(this)
			.on('touchstart', function(event) {
				$(this)
					.data('down', true)
					.data('x', getX(event))
					.data('y', getY(event))
					.data('scrollLeft', this.scrollLeft)
					.data('scrollTop', this.scrollTop)
				return false
			})
			.css({
				overflow: 'hidden', // スクロールバー非表示
				cursor: 'move'
			}) //指が触れたか検知
		$(this).on('touchmove', function(event) {
			if ($(target).data('down') === true) {
				// スクロール
				target.scrollLeft($(target).data('scrollLeft') + $(target).data('x') - getX(event))
				target.scrollTop($(target).data('scrollTop') + $(target).data('y') - getY(event))
				return false // 文字列選択を抑止
			} else {
			}
		}) //指が動いたか検知
		$(this).on('touchend', function(event) {
			$(target).data('down', false)
		})

		return this
	}
})(jQuery)

function getX(event) {
	return event.originalEvent.touches[0].pageX
}

function getY(event) {
	return event.originalEvent.touches[0].pageY
}
//マウスホイールで拡大
var element = document.getElementById('imagemodal')
element.onmousewheel = function(e) {
	var delta = e.wheelDelta
	if (delta > 0) {
		zoom(1.1)
	} else {
		zoom(0.9)
	}
}

//当該トゥート
function detFromImg() {
	var id = $('#imagemodal').attr('data-id')
	var acct_id = $('#imagemodal').attr('data-acct')
	$('#imagemodal').modal('close')
	details(id, acct_id)
}
//画像保存
function dlImg() {
	var ourl = $('#imagemodal').attr('data-original')
	var murl = $('#imagemodal').attr('data-image')
	var remote_img = localStorage.getItem('remote_img')
	if (remote_img == 'yes') {
		murl = ourl
	}
	if (localStorage.getItem('savefolder')) {
		var save = localStorage.getItem('savefolder')
	} else {
		var save = ''
	}
	postMessage(['generalDL', [murl, save, false]], '*')
}
function openFinder(dir) {
	postMessage(['openFinder', dir], '*')
}
function stopVideo() {
	document.getElementById('video').pause()
}
function copyImgUrl() {
	var murl = $('#imagemodal').attr('data-original')
	execCopy(murl)
	M.toast({ html: lang.lang_img_copyDone, displayLength: 1500 })
}
