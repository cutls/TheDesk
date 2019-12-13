//プラットフォーム別　最後に読むやつ
//リンクを外部で開くか内部で出すか
$(document).on('click', 'a', e => {
	var $a = $(e.target)
	var url = $a.attr('href')
	if (!url) {
		var url = $a.parent().attr('href')
	}
	var urls = []
	if (url) {
		urls = url.match(/https?:\/\/(.+)/)
		//トゥートのURLぽかったら
		toot = url.match(/https:\/\/([^+_]+)\/@([a-zA-Z0-9_]+)\/([0-9]+)/)
		if (!toot) {
			//Pleroma対策
			toot = url.match(/https:\/\/([^+_]+)\/users\/([a-zA-Z0-9_]+)\/statuses\/([0-9]+)/)
		}
		//タグのURLぽかったら
		var tags = []
		tags = url.match(/https:\/\/([^+_]+)\/tags\/([_a-zA-Z0-9\&=+\%]+)/)
		//メンションっぽかったら
		var ats = []
		ats = url.match(/https:\/\/([^+_]+)\/@([_a-zA-Z0-9\&=+\%]+)/)
		if (toot) {
			if (toot[1]) {
				var acct_id = $a.parent().attr('data-acct')
				if (!acct_id) {
					acct_id = 0
				}
				$a.parent().addClass('loadp')
				$a.parent().text('Loading...')
				detEx(url, acct_id)
			}
		} else if (tags) {
			if (tags[2]) {
				var acct_id = $a.parent().attr('data-acct')
				if (!acct_id) {
					acct_id = 0
				}
				tl('tag', decodeURI(tags[2]), acct_id, 'add')
			}
		} else if (ats) {
			if (ats[2]) {
				//Quesdon判定
				if (!~ats[2].indexOf('@')) {
					udgEx(url, 'main')
					return false
				} else {
					postMessage(['openUrl', url], '*')
				}
			}
		} else {
			//hrefがhttp/httpsならブラウザで
			if (urls) {
				if (urls[0]) {
					if (~url.indexOf('thedeks.top')) {
						//alert("If you recieve this alert, let the developer(Cutls@kirishima.cloud) know it with a screenshot.");
						url = 'https://thedesk.top'
					}
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
function execCopy(string) {
	postMessage(['copy', string], '*')
	return true
}
function progshow(e) {
	if (e.lengthComputable) {
		var percent = e.loaded / e.total
		console.log('Progress: ' + percent * 100)
		$('#imgsel').hide()
		if (percent < 1) {
			$('#imgup').text(Math.floor(percent * 100) + '%')
		} else {
			$('#imgup').text(lang.lang_progress)
		}
	}
}
function opendev() {
	var webview = document.getElementById('webview')
	webview.openDevTools()
	/*webview.sendInputEvent({
		type: "keyDown",
		keyCode: '2'
	  });
	  */
}
var soundFile
function playSound() {
	window.AudioContext = window.AudioContext || window.webkitAudioContext
	if (soundFile) {
		soundFile.stop()
	}
	context = new AudioContext()
	context.createBufferSource().start(0)
	context.decodeAudioData(request.response, function(buf) {
		//console.log("Playing:" , source)
		source.buffer = buf
		source.loop = false
	})
	source = context.createBufferSource()
	volumeControl = context.createGain()
	source.connect(volumeControl)
	volumeControl.connect(context.destination)
	var cvol = localStorage.getItem('customVol')
	if (cvol) {
		vol = cvol
	} else {
		vol = 0.8
	}
	volumeControl.gain.value = vol
	source.start(0)
	soundFile = source

	function newFunction() {
		var source
		return source
	}
}
function nano() {
	postMessage(['nano', null], '*')
}
onmessage = function(e) {
	if (e.data[0] == 'details') {
		details(e.data[1][0], e.data[1][1])
	} else if (e.data[0] == 'udg') {
		udg(e.data[1][0], e.data[1][1])
	} else if (e.data[0] == 'media') {
		media(e.data[1][0], e.data[1][1], e.data[1][2], e.data[1][3])
	} else if (e.data[0] == 'post') {
		post('pass')
	} else if (e.data[0] == 'toastSaved') {
		var show = `${lang.lang_img_DLDone}${
			e.data[1][0]
		}<button class="btn-flat toast-action" onclick="openFinder('${e.data[1][1]}')">Show</button>`
		M.toast({ html: show, displayLength: 5000 })
	} else if (e.data[0] == 'parseColumn') {
		parseColumn(e.data[1])
	} else if (e.data[0] == 'exportSettingsCore') {
		var exp = exportSettingsCore()
		postMessage(['exportSettingsCoreComplete', [e.data[1], exp]], '*')
	} else if (e.data[0] == 'importSettingsCore') {
		importSettingsCore(e.data[1])
	} else if (e.data[0] == 'fontList') {
		fontList(e.data[1])
	} else if (e.data[0] == 'customSoundSave') {
		customSoundSave(e.data[1][0], e.data[1][1])
	} else if (e.data[0] == 'ctLoadCore') {
		ctLoadCore(e.data[1])
	} else if (e.data[0] == 'ctLoad') {
		ctLoad()
	} else if (e.data[0] == 'customConnect') {
		customConnect(e.data[1])
	} else if (e.data[0] == 'clearCustomImport') {
		clearCustomImport()
	} else if (e.data[0] == 'npCore') {
		npCore(e.data[1])
	} else if (e.data[0] == 'renderMem') {
		renderMem(e.data[1][0], e.data[1][1], e.data[1][2])
	} else if (e.data[0] == 'updateProg') {
		updateProg(e.data[1])
	} else if (e.data[0] == 'updateMess') {
		updateMess(e.data[1])
	} else if (e.data[0] == 'renderAbout') {
		renderAbout(e.data[1])
	} else if (e.data[0] == 'asRead') {
		asRead()
	} else if (e.data[0] == 'asReadEnd') {
		asReadEnd()
	} else if (e.data[0] == 'logData') {
		$('#logs').val(e.data[1])
		var obj = document.getElementById('logs')
		obj.scrollTop = obj.scrollHeight
	} else if (e.data[0] == 'alert') {
		Swal.fire({
			type: 'info',
			title: e.data[1]
		})
	}
}
