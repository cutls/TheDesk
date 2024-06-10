var electron = require('electron')
const shell = electron.shell
var ipc = electron.ipcRenderer
//title bar
window.addEventListener('DOMContentLoaded', () => {
	document.title = 'TheDesk'
	ipc.send('acsCheck', '')
})

onmessage = async function (e) {
	if (e.data[0] === 'openUrl') {
		urls = e.data[1].match(/https?:\/\/(.+)/)
		if (urls) {
			shell.openExternal(e.data[1])
		}
	} else if (e.data[0] === 'openUrlMainProcess') {
		urls = e.data[1].match(/https?:\/\/(.+)/)
		if (urls) {
			ipc.send('openUrl', e.data[1])
		}
	} else if (e.data[0] === 'sendSinmpleIpc') {
		ipc.send(e.data[1], '')
	} else if (e.data[0] === 'dialogStore') {
		ipc.send('dialogStore', e.data[1])
	} else if (e.data[0] === 'bmpImage') {
		ipc.send('bmp-image', e.data[1])
	} else if (e.data[0] === 'resizeImage') {
		ipc.send('resize-image', e.data[1])
	} else if (e.data[0] === 'stampImage') {
		ipc.send('stamp-image', e.data[1])
	} else if (e.data[0] === 'dialogCW') {
		ipc.send('dialogCW', e.data[1])
	} else if (e.data[0] === 'nativeNotf') {
		ipc.send('native-notf', e.data[1])
	} else if (e.data[0] === 'dialogClient') {
		ipc.send('dialogClient', e.data[1])
	} else if (e.data[0] === 'generalDL') {
		ipc.send('general-dl', e.data[1])
	} else if (e.data[0] === 'openFinder') {
		ipc.send('openFinder', e.data[1])
	} else if (e.data[0] === 'columnDel') {
		ipc.send('column-del', e.data[1])
	} else if (e.data[0] === 'lang') {
		ipc.send('lang', e.data[1])
	} else if (e.data[0] === 'exportSettings') {
		ipc.send('exportSettings', e.data[1])
	} else if (e.data[0] === 'exportSettingsCoreComplete') {
		ipc.send('export', e.data[1])
	} else if (e.data[0] === 'migrateSettingsCoreComplete') {
		ipc.send('exportMigrate', e.data[1])
	} else if (e.data[0] === 'importSettings') {
		ipc.send('importSettings', e.data[1])
	} else if (e.data[0] === 'customSound') {
		ipc.send('customSound', e.data[1])
	} else if (e.data[0] === 'themeJsonDelete') {
		ipc.send('theme-json-delete', e.data[1])
	} else if (e.data[0] === 'themeJsonCreate') {
		ipc.send('theme-json-create', e.data[1])
	} else if (e.data[0] === 'themeJsonRequest') {
		ipc.send('theme-json-request', e.data[1])
	} else if (e.data[0] === 'ha') {
		ipc.send('ha', e.data[1])
	} else if (e.data[0] === 'webviewSetting') {
		ipc.send('webview', e.data[1])
	} else if (e.data[0] === 'frameSet') {
		ipc.send('frameSet', e.data[1])
	} else if (e.data[0] === 'ua') {
		ipc.send('ua', e.data[1])
	} else if (e.data[0] === 'aboutData') {
		ipc.send('aboutData', '')
	} else if (e.data[0] === 'itunes') {
		ipc.send('itunes', e.data[1])
	} else if (e.data[0] === 'themeCSSRequest') {
		ipc.send('theme-css-request', e.data)
	} else if (e.data[0] === 'themeCSSPreview') {
		ipc.send('theme-css-request', e.data)
	} else if (e.data[0] === 'customCSSRequest') {
		ipc.send('custom-css-request', e.data[1])
	} else if (e.data[0] === 'downloadButton') {
		ipc.send('download-btn', e.data[1])
	} else if (e.data[0] === 'nano') {
		ipc.send('nano', null)
	} else if (e.data[0] === 'asReadComp') {
		ipc.send('sendMarkersComplete', null)
	} else if (e.data[0] === 'copy') {
		ipc.send('copy', e.data[1])
	} else if (e.data[0] === 'copyBinary') {
		ipc.send('copyBinary', e.data[1])
	} else if (e.data[0] === 'log') {
		ipc.send('log', e.data[1])
	} else if (e.data[0] === 'twitterLogin') {
		ipc.send('twitterLogin', e.data[1])
	} else if (e.data[0] === 'textareaContextMenu') {
		ipc.send('textareaContextMenu', e.data[1])
	}
}
//version.js
ipc.send('getPlatform', '')
ipc.on('platform', function (event, args) {
	localStorage.setItem('platform', args[0])
	localStorage.setItem('bit', args[1])
	localStorage.setItem('about', JSON.stringify([args[2], args[3], args[4], args[5]]))
})
ipc.on('reload', function (event, arg) {
	location.reload()
})
//Native Notf
ipc.on('shownotf', function (event, args) {
	if (args['type'] === 'toot') {
		postMessage(['details', [id, acct_id]], '*')
	} else if (args['type'] === 'userdata') {
		postMessage(['udg', [user, acct_id]], '*')
	}
})

//first.js
ipc.on('custom-css-response', function (event, arg) {
	if (arg === '') {
		return false
	}
	var styleNode = document.createElement('style')
	styleNode.setAttribute('type', 'text/css')

	var content = document.createTextNode(arg)
	styleNode.append(content)
	document.getElementsByTagName('head')[0].append(styleNode)
})
ipc.on('theme-css-response', function (event, arg) {
	if (arg === '') {
		return false
	}
	var styleNode = document.createElement('style')
	styleNode.setAttribute('type', 'text/css')

	var content = document.createTextNode(arg)
	styleNode.append(content)
	document.getElementsByTagName('head')[0].append(styleNode)
})
//img.js
ipc.on('bmp-img-comp', function (event, b64) {
	if (b64[2]) {
		var stamped = true
	} else {
		var stamped = false
	}
	postMessage(['media', [b64[0], 'image/png', b64[1], stamped]], '*')
})
ipc.on('resizeJudgement', function (event, b64) {
	var resize = localStorage.getItem('uploadCrop') * 1
	if (resize > 0) {
		var element = new Image()
		var width
		element.onload = function () {
			var width = element.naturalWidth
			var height = element.naturalHeight
			if (width > resize || height > resize) {
				ipc.send('resize-image', [b64[0], resize])
			} else {
				postMessage(['media', [b64[0], 'image/png', b64[1]]], '*')
			}
		}
		element.src = 'data:image/png;base64,' + b64[0]
	} else {
		postMessage(['media', [b64[0], 'image/png', b64[1]]], '*')
	}
})
//ui,img.js
ipc.on('general-dl-prog', function (event, arg) {
	console.log('Progress: ' + arg)
})
ipc.on('general-dl-message', function (event, arg) {
	var argC = arg.replace(/\\/g, '\\\\')
	postMessage(['toastSaved', [arg, argC]], '*')
})
//setting.js
ipc.on('langres', function (event, arg) {
	location.href = '../' + arg + '/setting.html'
})
ipc.on('exportSettingsFile', function (event, arg) {
	postMessage(['exportSettingsCore', arg], '*')
})
ipc.on('exportAllComplete', function (event, arg) {
	postMessage(['alert', 'Complete'], '*')
})
ipc.on('config', function (event, arg) {
	postMessage(['importSettingsCore', arg], '*')
})
ipc.on('savefolder', function (event, arg) {
	localStorage.setItem('savefolder', arg)
})
ipc.on('font-list', function (event, arg) {
	postMessage(['fontList', arg], '*')
})
ipc.on('customSoundRender', function (event, args) {
	postMessage(['customSoundSave', [args[0], args[1]]], '*')
})
ipc.on('theme-json-list-response', function (event, args) {
	postMessage(['ctLoadCore', args], '*')
})
ipc.on('theme-json-delete-complete', function (event, args) {
	postMessage(['ctLoad', ''], '*')
})
ipc.on('theme-json-response', function (event, args) {
	postMessage(['customConnect', args], '*')
})
ipc.on('theme-json-create-complete', function (event, args) {
	if (args !== '') alert(args)
	postMessage(['clearCustomImport', ''], '*')
	postMessage(['ctLoad', ''], '*')
})
//spotify.js
ipc.on('itunes-np', function (event, arg) {
	postMessage(['npCore', arg], '*')
})
//tips.js
ipc.on('memory', function (event, arg) {
	var use = arg[0]
	var cpu = arg[1]
	var total = arg[2]
	postMessage(['renderMem', [use, cpu, total, arg[3], arg[4]]], '*')
})
//log
ipc.on('logData', function (event, args) {
	postMessage(['logData', args], '*')
})
//update.html
ipc.on('prog', function (event, arg) {
	postMessage(['updateProg', arg], '*')
})
ipc.on('mess', function (event, arg) {
	postMessage(['updateMess', arg], '*')
})
//misc
ipc.on('asRead', function (event, arg) {
	postMessage(['asRead', ''], '*')
})
ipc.on('asReadEnd', function (event, arg) {
	postMessage(['asReadEnd', ''], '*')
})
ipc.on('accessibility', function (event, arg) {
	postMessage(['accessibility', 'true'], '*')
})
ipc.on('twitterLoginComplete', function (event, arg) {
	postMessage(['twitterLoginComplete', ''], '*')
})
ipc.on('alert', function (event, arg) {
	postMessage(['alert', arg], '*')
})
ipc.on('customUrl', function (event, args) {
	postMessage(['customUrl', args], '*')
})
ipc.on('isDev', function (event, args) {
	postMessage(['isDev', true], '*')
})
