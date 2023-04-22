import $ from 'jquery'
import Swal from 'sweetalert2'
import { toast } from '../common/declareM'
import lang from '../common/lang'
import { asReadEnd, code } from '../login/manager'
import { media } from '../post/img'
import { post } from '../post/post'
import { details, detEx } from '../tl/datails'
import { asRead, tl } from '../tl/tl'
import { parseColumn } from '../ui/layout'
import { show } from '../ui/postBox'
import { exportSettingsCore, importSettingsCore, fontList, ctLoad, clearCustomImport, ctLoadCore, customConnect, customSoundSave } from '../ui/settings'
import { npCore } from '../ui/spotify'
import { renderMem } from '../ui/tips'
import { udg, udgEx } from '../userdata/showOnTL'
declare let updateMess, updateProg
//プラットフォーム別 最後に読むやつ
//リンクを外部で開くか内部で出すか
$(document).on('click', 'a', (e) => {
	if (location.href.match(/about.html/)) return
	const $a = $(e.target)
	const url = $a.attr('href') || $a.parent().attr('href')
	if (url) {
		const urls = url.match(/https?:\/\/(.+)/)
		//トゥートのURLぽかったら
		let toot = url.match(/https:\/\/([^+_]+)\/@([a-zA-Z0-9_]+)\/([0-9]+)/)
		if (!toot) {
			//Pleroma対策
			toot = url.match(/https:\/\/([^+_]+)\/users\/([a-zA-Z0-9_]+)\/statuses\/([0-9]+)/)
		}
		//タグのURLぽかったら
		const tags = url.match(/https:\/\/([^+_]+)\/tags\/([_a-zA-Z0-9&=+%]+)/)
		//メンションっぽかったら
		const ats = url.match(/https:\/\/([^+_]+)\/@([_a-zA-Z0-9&=+%]$+)/)
		if (toot) {
			if (toot[1]) {
				const acctId = $a.parent().attr('data-acct') || '0'
				$a.parent().addClass('loadp')
				detEx(url, acctId)
			}
		} else if (tags) {
			if (tags[2]) {
				const acctId = $a.parent().attr('data-acct') || '0'
				tl('tag', decodeURI(tags[2]), acctId, 'add')
			}
		} else if (ats) {
			if (ats[2]) {
				const acctId = $a.parent().attr('data-acct') || localStorage.getItem('main')
				udgEx(url, acctId)
			}
		} else {
			if (globalThis.pwa) return
			//hrefがhttp/httpsならブラウザで
			if (urls) {
				if (urls[0]) {
					postMessage(['openUrl', url], '*')
				} else {
					location.href = url
				}
			} else {
				location.href = url
			}
		}
	}
	return false
})

//よく使うライブラリ

//コピー
export function execCopy(string) {
	postMessage(['copy', string], '*')
	return true
}
export function nano() {
	postMessage(['nano', null], '*')
}
onmessage = function (e) {
	if (e.data[0] === 'details') {
		details(e.data[1][0], e.data[1][1])
	} else if (e.data[0] === 'udg') {
		udg(e.data[1][0], e.data[1][1])
	} else if (e.data[0] === 'media') {
		media(e.data[1][0], e.data[1][1], e.data[1][2], e.data[1][3])
	} else if (e.data[0] === 'post') {
		post()
	} else if (e.data[0] === 'toastSaved') {
		const showTxt = `${lang.lang_img_DLDone}${e.data[1][0]}<button class="btn-flat toast-action" onclick="openFinder('${e.data[1][1]}')">Show</button>`
		toast({ html: showTxt, displayLength: 5000 })
	} else if (e.data[0] === 'parseColumn') {
		parseColumn(e.data[1])
	} else if (e.data[0] === 'exportSettingsCore') {
		const exp = exportSettingsCore()
		postMessage(['exportSettingsCoreComplete', [e.data[1], exp]], '*')
	} else if (e.data[0] === 'importSettingsCore') {
		importSettingsCore(e.data[1])
	} else if (e.data[0] === 'fontList') {
		fontList(e.data[1])
	} else if (e.data[0] === 'customSoundSave') {
		customSoundSave(e.data[1][0], e.data[1][1])
	} else if (e.data[0] === 'ctLoadCore') {
		ctLoadCore(e.data[1])
	} else if (e.data[0] === 'ctLoad') {
		ctLoad()
	} else if (e.data[0] === 'customConnect') {
		customConnect(e.data[1])
	} else if (e.data[0] === 'clearCustomImport') {
		clearCustomImport()
	} else if (e.data[0] === 'npCore') {
		npCore(e.data[1])
	} else if (e.data[0] === 'renderMem') {
		renderMem(e.data[1][0], e.data[1][1], e.data[1][2], e.data[1][3], e.data[1][4])
	} else if (e.data[0] === 'isDev') {
		globalThis.isDev = true
		$('body').addClass('dev')
	} else if (e.data[0] === 'asRead') {
		asRead()
	} else if (e.data[0] === 'asReadEnd') {
		asReadEnd()
	} else if (e.data[0] === 'accessibility') {
		console.log('accessibility mode')
		$('body').addClass('accessibility')
		$('.window-title').before('<div class="accessMark">Screen Reader Optimized</div>')
	} else if (e.data[0] === 'logData') {
		$('#logs').val(e.data[1])
		const obj = document.getElementById('logs')
		if (obj) obj.scrollTop = obj.scrollHeight
	} else if (e.data[0] === 'alert') {
		Swal.fire({
			icon: 'info',
			title: e.data[1],
		})
	} else if (e.data[0] === 'twitterLoginComplete') {
		location.reload()
	} else if (e.data[0] === 'customUrl') {
		const mode = e.data[1][0]
		const codex = e.data[1][1]
		if (mode === 'share') {
			$('textarea').focus()
			$('#textarea').val(decodeURI(codex))
			show()
			$('body').removeClass('mini-post')
			$('.mini-btn').text('expand_less')
		} else if (mode === 'manager' || mode === 'login') {
			code(codex)
		} else if (mode === 'spotify') {
			const coder = codex.split(':')
			localStorage.setItem('spotify', coder[0])
			localStorage.setItem('spotify-refresh', coder[1])
		}
	}
}
/* PWA */
if (globalThis.pwa) {
	globalThis.postMessage = function (e) {
		if (e[0] === 'openUrl') {
			const urls = e[1].match(/https?:\/\/(.+)/)
			if (!urls) return
			const openedWindow = window.open(urls, '_blank')
			if (!openedWindow && urls) {
				Swal.fire({
					title: 'Open URL',
					icon: 'info',
					html: `Click to open this link: <a href="${urls[0]}" target="_blank" class="btn waves-effect">${urls[0]}</a>`,
					showCloseButton: false,
					showCancelButton: false,
					focusConfirm: false,
					confirmButtonText: 'Close',
				})
			}
		}
	}
}

$('html').addClass(localStorage.getItem('scroll') || '')
export const connection = function () {
	console.log(navigator.onLine, 'network state')
	if (!navigator.onLine) {
		$('#re-online').addClass('hide')
		$('#offline').removeClass('hide')
	} else if (!$('#offline').hasClass('hide')) {
		$('#offline').addClass('hide')
		$('#re-online').removeClass('hide')
		parseColumn()
	}
}
window.onoffline = connection
window.ononline = connection

let lastSelection: Range | null = null
let isSame = true
$(document).on('keyup mouseup', function () {
	const ls = window.getSelection()?.toString() !== '' ? window.getSelection()?.getRangeAt(0) : null
	lastSelection = typeof ls === 'undefined' ? null : ls
	if (!isSame) $('#pageSrc').addClass('hide')
})

// カスタム右クリックメニュー
$(document).on('contextmenu', function (e) {
	// テキスト選択中であれば何もしない
	if (lastSelection !== null) {
		const currentSelection = window.getSelection()?.getRangeAt(0)
		if (!currentSelection) return
		for (const key in currentSelection) {
			if (currentSelection[key] !== lastSelection[key]) {
				isSame = false
				break
			}
		}

		if (isSame) {
			$('#pageSrc').removeClass('hide')
			$('#pageSrc').css('left', e.pageX)
			$('#pageSrc').css('top', e.pageY)
			$('.srcQ').text(currentSelection.toString())
		}
	}
})
$('textarea, input').on('contextmenu', function (e) {
	postMessage(['textareaContextMenu', { x: e.pageX, y: e.pageY }], '*')
})
let soundFile
export function playSound(request: XMLHttpRequest) {
	if (soundFile) {
		soundFile.stop()
	}
	const context = new AudioContext()
	context.createBufferSource().start(0)
	context.decodeAudioData(request.response, function (buf) {
		source.buffer = buf
		source.loop = false
	})
	const source = context.createBufferSource()
	const volumeControl = context.createGain()
	source.connect(volumeControl)
	volumeControl.connect(context.destination)
	const vol = parseInt(localStorage.getItem('customVol') || '0.8', 10)
	volumeControl.gain.value = vol
	source.start(0)
	soundFile = source
}
