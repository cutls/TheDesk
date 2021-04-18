//設定(setting.html)で読む
var envView = new Vue({
	el: '#envView',
	data: { config: envConstruction },
	methods: {
		complete: function (i, val) {
			var ls = envView.config[i]
			let header = ls.text.head
			if (!ls.data) {
				ls = [ls]
			} else {
				ls = ls.data
			}
			for (var j = 0; j < ls.length; j++) {
				var id = ls[j].id
				localStorage.setItem(ls[j].storage, val)
			}
			if (ls[0].id == 'ha') {
				hardwareAcceleration(val)
			}
			if (ls[0].id == 'webview') {
				postMessage(['webviewSetting', val], '*')
			}
			if (ls[0].id == 'ua_setting') {
				useragent(val)
			}
			if (ls[0].id == 'frame') {
				frameSet(val)
			}
			M.toast({ html: `Updated: ${header}`, displayLength: 3000 })
			return true
		},
	},
})
var tlView = new Vue({
	el: '#tlView',
	data: { config: tlConstruction },
	methods: {
		complete: function (i, val) {
			var ls = tlView.config[i]
			let header = ls.text.head
			if (val) {
				localStorage.setItem(ls.storage, val)
			} else {
				if (!ls.data) {
					ls = [ls]
				} else {
					ls = ls.data
				}
				for (var j = 0; j < ls.length; j++) {
					var id = ls[j].id
					var val = $('#' + id).val()
					localStorage.setItem(ls[j].storage, val)
				}
			}
			M.toast({ html: `Updated: ${header}`, displayLength: 3000 })
			return true
		},
	},
})
var postView = new Vue({
	el: '#postView',
	data: {
		config: postConstruction,
		kirishima: localStorage.getItem('kirishima'),
		quoters: localStorage.getItem('quoters'),
	},
	methods: {
		complete: function (i, val) {
			var ls = postView.config[i]
			let header = ls.text.head
			if (val) {
				localStorage.setItem(ls.storage, val)
			} else {
				if (!ls.data) {
					ls = [ls]
				} else {
					ls = ls.data
				}
				for (var j = 0; j < ls.length; j++) {
					M.toast({ html: 'Complete', displayLength: 3000 })
					var id = ls[j].id
					var val = $('#' + id).val()
					localStorage.setItem(ls[j].storage, val)
				}
			}
			M.toast({ html: `Updated: ${header}`, displayLength: 3000 })
			return true
		},
	},
})
//設定ボタン押した。
function settings() {
	var fontd = $('#font').val()
	if (fontd) {
		if (fontd != localStorage.getItem('font')) {
			M.toast({ html: lang.lang_setting_font.replace('{{set}}', fontd), displayLength: 3000 })
		}
		localStorage.setItem('font', fontd)
		themes()
	} else {
		if (localStorage.getItem('font')) {
			localStorage.removeItem('font')
			M.toast({ html: lang.lang_setting_font.replace('{{set}}', '"default"'), displayLength: 3000 })
			themes()
		}
	}
}

//読み込み時の設定ロード
function load() {
	var currentLang = lang.language
	console.log(currentLang)
	$(`#langsel-sel`).val(currentLang)
	$('#langsel-sel').formSelect()
	var max = envView.config.length
	for (var i = 0; i < max; i++) {
		var ls = envView.config[i].storage
		if (ls) {
			if (localStorage.getItem(ls)) {
				envView.config[i].setValue = localStorage.getItem(ls)
			}
		} else {
			ls = envView.config[i].data
			for (var j = 0; j < ls.length; j++) {
				envView.config[i].data[j].setValue = localStorage.getItem(ls[j].storage)
			}
		}
	}
	var max = tlView.config.length
	for (var i = 0; i < max; i++) {
		var ls = tlView.config[i].storage
		if (ls) {
			if (localStorage.getItem(ls)) {
				tlView.config[i].setValue = localStorage.getItem(ls)
			}
		} else {
			ls = tlView.config[i].data
			for (var j = 0; j < ls.length; j++) {
				if (localStorage.getItem(tlView.config[i].data[j].storage)) {
					tlView.config[i].data[j].setValue = localStorage.getItem(tlView.config[i].data[j].storage)
				}
			}
		}
	}
	var max = postView.config.length
	for (var i = 0; i < max; i++) {
		var ls = postView.config[i].storage
		if (ls) {
			if (localStorage.getItem(ls)) {
				postView.config[i].setValue = localStorage.getItem(ls)
			}
		} else {
			ls = postView.config[i].data
			for (var j = 0; j < ls.length; j++) {
				postView.config[i].data[j].setValue = localStorage.getItem(ls[j].storage)
			}
		}
	}
	if (localStorage.getItem('imas')) {
		$('.imas').removeClass('hide')
	}
	if (localStorage.getItem('kirishima')) {
		$('.kirishima').removeClass('hide')
	}
	var theme = localStorage.getItem('theme')
	if (!theme) {
		var theme = 'white'
	}
	$('#' + theme).prop('checked', true)
	var font = localStorage.getItem('font')
	if (!font) {
		var font = ''
	}
	$('#font').val(font)
	$('#c1-file').text(localStorage.getItem('custom1') != 'null' ? localStorage.getItem('custom1') : '')
	$('#c2-file').text(localStorage.getItem('custom2') != 'null' ? localStorage.getItem('custom2') : '')
	$('#c3-file').text(localStorage.getItem('custom3') != 'null' ? localStorage.getItem('custom3') : '')
	$('#c4-file').text(localStorage.getItem('custom4') != 'null' ? localStorage.getItem('custom4') : '')
	var cvol = localStorage.getItem('customVol')
	if (cvol) {
		$('#soundvol').val(cvol * 100)
		$('#soundVolVal').text(cvol * 100)
	}
	//$("#log").val(localStorage.getItem("errors"))
	$('#lastFmUser').val(localStorage.getItem('lastFmUser'))
}
function customVol() {
	var cvol = $('#soundvol').val()
	$('#soundVolVal').text(cvol)
	localStorage.setItem('customVol', cvol / 100)
	var sound = localStorage.getItem('favSound')
	if (sound == 'default') {
		var file = '../../source/notif.wav'
	} else {
		if (sound == 'c1') {
			var file = localStorage.getItem('custom1')
		} else if (sound == 'c2') {
			var file = localStorage.getItem('custom2')
		} else if (sound == 'c3') {
			var file = localStorage.getItem('custom3')
		} else if (sound == 'c4') {
			var file = localStorage.getItem('custom4')
		}
	}
	request = new XMLHttpRequest()
	request.open('GET', file, true)
	request.responseType = 'arraybuffer'
	request.onload = playSound
	request.send()
}

function climute() {
	//クライアントミュート
	var cli = localStorage.getItem('client_mute')
	var obj = JSON.parse(cli)
	if (!obj) {
		$('#mute-cli').html(lang.lang_setting_nomuting)
	} else {
		if (!obj[0]) {
			$('#mute-cli').html(lang.lang_setting_nomuting)
			return
		}
		var templete
		Object.keys(obj).forEach(function (key) {
			var cli = obj[key]
			var list = key * 1 + 1
			templete =
				'<div class="acct" id="acct_' +
				key +
				'">' +
				list +
				'.' +
				escapeHTML(cli) +
				'<button class="btn waves-effect red disTar" onclick="cliMuteDel(' +
				key +
				')">' +
				lang.lang_del +
				'</button><br></div>'
			$('#mute-cli').append(templete)
		})
	}
}
function cliMuteDel(key) {
	var cli = localStorage.getItem('client_mute')
	var obj = JSON.parse(cli)
	obj.splice(key, 1)
	var json = JSON.stringify(obj)
	localStorage.setItem('client_mute', json)
	climute()
}

function wordmute() {
	var word = localStorage.getItem('word_mute')
	var obj = JSON.parse(word)
	if (!obj) {
		obj = []
	}
	$('#wordmute').chips({
		data: obj,
	})
}
function wordmuteSave() {
	var word = M.Chips.getInstance($('#wordmute')).chipsData
	var json = JSON.stringify(word)
	localStorage.setItem('word_mute', json)
}

function wordemp() {
	var word = localStorage.getItem('word_emp')
	var obj = JSON.parse(word)
	if (!obj) {
		obj = []
	}
	$('#wordemp').chips({
		data: obj,
	})
}
function wordempSave() {
	var word = M.Chips.getInstance($('#wordemp')).chipsData
	var json = JSON.stringify(word)
	localStorage.setItem('word_emp', json)
}
function notftest() {
	var os = localStorage.getItem('platform')
	var options = {
		body: lang.lang_setting_notftest + '(' + lang.lang_setting_notftestprof + ')',
		icon: localStorage.getItem('prof_0'),
	}
	var n = new Notification('TheDesk' + lang.lang_setting_notftest, options)
}
function oks(no) {
	var txt = $('#oks-' + no).val()
	localStorage.setItem('oks-' + no, txt)
	M.toast({ html: lang.lang_setting_ksref, displayLength: 3000 })
}
function oksload() {
	if (localStorage.getItem('oks-1')) {
		$('#oks-1').val(localStorage.getItem('oks-1'))
	}
	if (localStorage.getItem('oks-2')) {
		$('#oks-2').val(localStorage.getItem('oks-2'))
	}
	if (localStorage.getItem('oks-3')) {
		$('#oks-3').val(localStorage.getItem('oks-3'))
	}
}
function changeLang() {
	const lang = $('#langsel-sel').val()
	console.log(lang)
	if (lang) postMessage(['lang', lang], '*')
}
function exportSettings() {
	var exp = exportSettingsCore()
	$('#imp-exp').val(JSON5.stringify(exp))
	Swal.fire({
		title: 'Warning',
		text: lang.lang_setting_exportwarn,
		type: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
	}).then((result) => {
		if (result.value) {
			postMessage(['exportSettings', ''], '*')
		}
	})
}
function exportSettingsCore() {
	var exp = {}
	//Accounts
	var multi = localStorage.getItem('multi')
	var acct = JSON.parse(multi)
	exp.accts = acct
	//Columns
	var multi = localStorage.getItem('column')
	var column = JSON.parse(multi)
	exp.columns = column
	//Themes
	var config = {}
	config.theme = localStorage.getItem('theme')
	//Other configs
	var max = envView.config.length
	for (var i = 0; i < max; i++) {
		var ls = envView.config[i].storage
		config[ls] = localStorage.getItem(ls)
	}
	var max = tlView.config.length
	for (var i = 0; i < max; i++) {
		var ls = tlView.config[i].storage
		config[ls] = localStorage.getItem(ls)
	}
	var max = postView.config.length
	for (var i = 0; i < max; i++) {
		var ls = postView.config[i].storage
		config[ls] = localStorage.getItem(ls)
	}
	//Font
	config.font = localStorage.getItem('font')
	exp.config = config
	//keysc
	exp.ksc = [localStorage.getItem('oks-1'), localStorage.getItem('oks-2'), localStorage.getItem('oks-3')]
	//climu
	var cli = localStorage.getItem('client_mute')
	var climu = JSON.parse(cli)
	exp.clientMute = climu
	//wordmu
	var wdm = localStorage.getItem('word_mute')
	var wordmu = JSON.parse(wdm)
	exp.wordMute = wordmu
	//spotify
	exp.spotifyArtwork = localStorage.getItem('artwork')
	var content = localStorage.getItem('np-temp')
	if (content || content == '' || content == 'null') {
		exp.spotifyTemplete = content
	} else {
		exp.spotifyTemplete = null
	}
	//tags
	var tagarr = localStorage.getItem('tag')
	var favtag = JSON.parse(tagarr)
	//plugins
	var plugins = localStorage.getItem('plugins')
	var plugin = JSON.parse(plugins)
	exp.plugins = plugin

	exp.revisons = 2.2
	exp.meta = {}
	exp.meta.date = new Date()
	exp.meta.thedesk = localStorage.getItem('ver')
	exp.meta.platform = localStorage.getItem('platform')
	return exp
}
function importSettings() {
	Swal.fire({
		title: 'Warning',
		text: lang.lang_setting_importwarn,
		type: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
	}).then((result) => {
		if (result.value) {
			if ($('#imp-exp').val()) {
				importSettingsCore(JSON5.parse($('#imp-exp').val()))
				return false
			}
			postMessage(['importSettings', ''], '*')
		}
	})
}
function importSettingsCore(obj) {
	if (obj) {
		localStorage.clear()
		localStorage.setItem('multi', JSON.stringify(obj.accts))
		for (var key = 0; key < obj.accts.length; key++) {
			var acct = obj.accts[key]
			localStorage.setItem('name_' + key, acct.name)
			localStorage.setItem('user_' + key, acct.user)
			localStorage.setItem('user-id_' + key, acct.id)
			localStorage.setItem('prof_' + key, acct.prof)
			localStorage.setItem('domain_' + key, acct.domain)
			localStorage.setItem('acct_' + key + '_at', acct.at)
			localStorage.setItem('acct_' + key + '_rt', acct.rt ? acct.rt : null)
		}
		localStorage.setItem('column', JSON.stringify(obj.columns))
		if (obj.config) {
			//Version 2~
			var max = envView.config.length
			for (var i = 0; i < max; i++) {
				var ls = envView.config[i].storage
				if (obj.config[ls]) {
					localStorage.setItem(ls, obj.config[ls])
				}
			}
			var max = tlView.config.length
			for (var i = 0; i < max; i++) {
				var ls = tlView.config[i].storage
				if (obj.config[ls]) {
					localStorage.setItem(ls, obj.config[ls])
				}
			}
			var max = postView.config.length
			for (var i = 0; i < max; i++) {
				var ls = postView.config[i].storage
				if (obj.config[ls]) {
					localStorage.setItem(ls, obj.config[ls])
				}
			}
		} else {
			//Version 1
			localStorage.setItem('theme', obj.theme)
			if (obj.width) {
				localStorage.setItem('width', obj.width)
			}
			if (obj.font) {
				localStorage.setItem('font', obj.font)
			}
			if (obj.size) {
				localStorage.setItem('size', obj.size)
			}
			themes(obj.theme)
			if (obj.imgheight) {
				localStorage.setItem('img-height', obj.imgheight)
			}
			localStorage.setItem('mainuse', obj.mainuse)
			if (obj.cw) {
				localStorage.setItem('cwtext', obj.cw)
			}
			localStorage.setItem('vis', obj.vis)
			//End
		}
		if (obj.ksc[0]) {
			localStorage.setItem('oks-1', obj.ksc[0])
		}
		if (obj.ksc[1]) {
			localStorage.setItem('oks-2', obj.ksc[1])
		}
		if (obj.ksc[2]) {
			localStorage.setItem('oks-3', obj.ksc[2])
		}
		if (obj.clientMute) {
			localStorage.setItem('client_mute', JSON.stringify(obj.clientMute))
		}
		if (obj.wordMute) {
			localStorage.setItem('word_mute', JSON.stringify(obj.wordMute))
		}
		if (obj.favoriteTags) {
			localStorage.setItem('tag', JSON.stringify(obj.favoriteTags))
		}

		localStorage.setItem('np-temp', obj.spotifyTemplete)
		for (var i = 0; i < obj.columns.length; i++) {
			localStorage.setItem('card_' + i, 'true')
			localStorage.removeItem('catch_' + i)
		}
		location.href = 'index.html'
	} else {
		Swal.fire({
			type: 'error',
			title: 'Error',
		})
	}
}
function savefolder() {
	postMessage(['sendSinmpleIpc', 'savefolder'], '*')
}

function font() {
	if($('#fonts').hasClass('hide')) {
		postMessage(['sendSinmpleIpc', 'fonts'], '*')
		$('#fonts').removeClass('hide')
	} else {
		$('#fonts').addClass('hide')
	}
}
function fontList(arg) {
	$('#fonts').removeClass('hide')
	for (var i = 0; i < arg.length; i++) {
		var font = arg[i]
		$('#fonts').append('<div class="font pointer" style="font-family:' + font + '" onclick="insertFont(\'' + font + '\')">' + font + '</div>')
	}
}
function insertFont(name) {
	$('#fonts').addClass('hide')
	$('#font').val(name)
}
function copyColor(from, to) {
	let props = [
		'background', 'subcolor', 'text', 'accent',
		'modal', 'modalFooter', 'third', 'forth',
		'bottom', 'emphasized', 'postbox', 'active',
		'selected', 'selectedWithShared'
	]
	let i = 0
	let color
	for (tag of props) {
		if (tag == from) {
			let used = $(`#use-color_${i}`).prop('checked')
			if (!used) {
				Swal.fire({
					type: 'error',
					title: 'Not checked',
				})
				break
			}
			color = $(`#color-picker${i}_value`).val()
			break
		}
		i++
	}
	if (!color) return false
	for (tag of props) {
		if (tag == to) {
			$(`#color-picker${i}_value`).val(color)
			$(`#use-color_${i}`).prop('checked', true)
			break
		}
		i++
	}
}
function customComp(preview) {
	var nameC = $('#custom_name').val()
	if (!nameC && !preview) {
		return false
	}
	var descC = $('#custom_desc').val()
	var bgC = $('#color-picker0_value').val()
	var subcolorC = $('#color-picker2_value').val()
	var textC = $('#color-picker1_value').val()
	var accentC = $('#color-picker3_value').val()
	var multi = localStorage.getItem('multi')
	let advanced = [
		'modal', 'modalFooter', 'third', 'forth',
		'bottom', 'emphasized', 'postbox', 'active',
		'selected', 'selectedWithShared'
	]
	var advanceTheme = {}
	let i = 4
	for (tag of advanced) {
		let used = $(`#use-color_${i}`).prop('checked')
		if (used) {
			advanceTheme[tag] = $(`#color-picker${i}_value`).val()
		}
		i++
	}

	var my = JSON.parse(multi)[0].name
	var id = $('#custom-edit-sel').val()
	const defaults = [
		'black', 'blue', 'brown', 'green', 'indigo', 'polar', 'snow', 'white'
	]
	if (id == 'add_new' || defaults.includes(id)) {
		id = makeCID()
	}
	if (!preview) localStorage.setItem('customtheme-id', id)
	var json = {
		name: nameC,
		author: my,
		desc: descC,
		base: $('[name=direction]:checked').val(),
		primary: {
			background: bgC,
			subcolor: subcolorC,
			text: textC,
			accent: accentC
		},
		advanced: advanceTheme,
		id: id,
		version: '2'
	}
	$('#custom_json').val(JSON.stringify(json))
	if (preview) {
		postMessage(['themeCSSPreview', json], '*')
	} else {
		$('#custom-edit-sel').val(id)
		$('select').formSelect()
		Swal.fire({
			type: 'success',
			title: 'Saved',
		})
		postMessage(['themeJsonCreate', JSON.stringify(json)], '*')
	}

}
function deleteIt() {
	var id = $('#custom-sel-sel').val()
	$('#custom_name').val('')
	$('#custom_desc').val('')
	$('#dark').prop('checked', true)
	$('#custom_json').val('')
	for (var i = 0; i <= 13; i++) {
		if (i >= 4) $(`#use-color_${i}`).prop('checked', false)
		$('#color-picker' + i + '_value').val('')
	}
	postMessage(['themeJsonDelete', id + '.thedesktheme'], '*')
}
function ctLoad() {
	postMessage(['sendSinmpleIpc', 'theme-json-list'], '*')
}
function ctLoadCore(args) {
	var template = ''
	var editTemplate = ''
	Object.keys(args).forEach(function (key) {
		var theme = args[key]
		var themeid = theme.id
		template = template + `<option value="${themeid}">${theme.name}${theme.compatible ? `(${lang.lang_setting_compat})` : ''}</option>`
		if (!theme.compatible) editTemplate = editTemplate + `<option value="${themeid}">${theme.name}</option>`
	})
	$('#custom-sel-sel').html(template)
	editTemplate = '<option value="add_new">' + $('#edit-selector').attr('data-add') + '</option>' + editTemplate
	$('#custom-edit-sel').html(editTemplate)
	$('#custom-sel-sel').val(localStorage.getItem('customtheme-id'))
	$('select').formSelect()
}
function customSel() {
	var id = $('#custom-sel-sel').val()
	localStorage.setItem('customtheme-id', id)
	themes(id)
}
function custom() {
	var id = $('#custom-edit-sel').val()
	if (id == 'add_new') {
		$('#custom_name').val('')
		$('#custom_desc').val('')
		$('#dark').prop('checked', true)
		$('#custom_json').val('')
		for (var i = 0; i <= 13; i++) {
			if (i >= 4) $(`#use-color_${i}`).prop('checked', false)
			$('#color-picker' + i + '_value').val('')
		}
		$('#delTheme').addClass('disabled')
	} else {
		$('#delTheme').removeClass('disabled')
		postMessage(['themeJsonRequest', id + '.thedesktheme'], '*')
	}
}
function customConnect(raw) {
	var args = raw[0]
	$('#custom_name').val(`${args.name} ${args.default ? 'Customed' : ''}`)
	$('#custom_desc').val(args.default ? 'TheDesk default theme with some changes by user' : args.desc)
	$('#' + args.base).prop('checked', true)
	//Background
	$('#color-picker0_value').val(args.primary.background)
	//Text
	$('#color-picker1_value').val(args.primary.text)
	//Subcolor
	$('#color-picker2_value').val(args.primary.subcolor)
	//Accent
	$('#color-picker3_value').val(args.primary.accent)
	let advanced = [
		'modal', 'modalFooter', 'third', 'forth',
		'bottom', 'emphasized', 'postbox', 'active',
		'selected', 'selectedWithShared'
	]
	let i = 4
	for (tag of advanced) {
		if (args.advanced[tag]) {
			$(`#color-picker${i}_value`).val(args.advanced[tag])

		}
		$(`#use-color_${i}`).prop('checked', true)
		i++
	}
	$('#custom_json').val(raw[1])
	if (args.default) {
		$('#delTheme').addClass('disabled')
	}
}
function customImp() {
	var json = $('#custom_import').val()
	if (JSON5.parse(json)) {
		postMessage(['themeJsonCreate', json], '*')
	} else {
		Swal.fire({
			type: 'error',
			title: 'Error',
		})
	}
}
function advanced() {
	$('.advanced').toggleClass('hide')
	$('#pickers').toggleClass('advanceTheme')
}
function clearCustomImport() {
	$('#custom_import').val('')
}
function hardwareAcceleration(had) {
	postMessage(['ha', had], '*')
}
function useragent(val) {
	postMessage(['ua', val], '*')
}
function frameSet(val) {
	postMessage(['frameSet', val], '*')
}
function customSound(key) {
	postMessage(['customSound', key], '*')
}
function customSoundSave(key, file) {
	localStorage.setItem('custom' + key, file)
	$(`#c${key}-file`).text(file)
}
function pluginLoad() {
	$('#plugin-edit-sel').val('add_new')
	$(".plugin_delete").addClass('disabled')
	var template = ''
	var pgns = localStorage.getItem('plugins')
	var args = JSON.parse(pgns ? pgns : '[]')
	Object.keys(args).forEach(function (key) {
		var theme = args[key]
		var themeid = theme.id
		template = template + `<option value="${themeid}">${getMeta(theme.content).data.name}</option>`
	})
	template = '<option value="add_new">' + $('#plugin-selector').attr('data-add') + '</option>' + template
	$('#plugin-edit-sel').html(template)
	$('select').formSelect()
}
function pluginEdit() {
	var id = $('#plugin-edit-sel').val()
	$('#plugin').attr('data-id', id)
	if (id == 'add_new') {
		editor.setValue('', -1)
		$(".plugin_delete").addClass('disabled')
	} else {
		$(".plugin_delete").removeClass('disabled')
		var pgns = localStorage.getItem('plugins')
		var args = JSON.parse(pgns ? pgns : '[]')
		Object.keys(args).forEach(function (key) {
			var plugin = args[key]
			var targetId = plugin.id
			if (targetId == id) editor.setValue(plugin.content, -1)
		})
	}
}
function completePlugin(comp) {
	var pgns = localStorage.getItem('plugins')
	var args = JSON.parse(pgns ? pgns : '[]')
	var id = $('#plugin').attr('data-id')

	var inputPlugin = editor.getValue()
	var meta = getMeta(inputPlugin)
	if (!meta.data) {
		Swal.fire({
			icon: 'error',
			title: 'Syntax Error',
			text: `error on line ${meta.location.start.line}`,
			text: meta,
		})
		return false
	}
	if (!meta.data.name || !meta.data.version || !meta.data.event || !meta.data.author) {
		Swal.fire({
			icon: 'error',
			title: 'Meta data error',
			title: 'Syntax Error of META DATA',
		})
		return false
	}
	if (id == 'add_new') {
		id = makeCID()
		args.push({
			id: id,
			content: inputPlugin
		})
	} else {
		Object.keys(args).forEach(function (key) {
			var plugin = args[key]
			var targetId = plugin.id
			if (targetId == id) args[key].content = inputPlugin
		})
	}
	var ss = args
	localStorage.setItem('plugins', JSON.stringify(ss))
	if (comp) return false
	$('#plugin').attr('data-id', 'add_new')
	editor.setValue('', -1)
	pluginLoad()
}
function testExecTrg() {
	var inputPlugin = editor.getValue()
	var meta = getMeta(inputPlugin)
	if (meta.location) {
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: `error on line ${meta.location.start.line}`,
			text: meta,
		})
		return false
	}
	testExec(inputPlugin)
}
async function deletePlugin() {
	const alert = await Swal.fire({
		title: 'delete',
		icon: 'warning',
		showCancelButton: true
	})
	if (!alert) return false
	editor.setValue('', -1)
	var pgns = localStorage.getItem('plugins')
	var args = JSON.parse(pgns ? pgns : '[]')
	var id = $('#plugin').attr('data-id')
	$('#plugin').attr('data-id', 'add_new')
	var ss = []
	Object.keys(args).forEach(function (key) {
		var plugin = args[key]
		var targetId = plugin.id
		if (targetId != id) ss.push(plugin)
	})
	localStorage.setItem('plugins', JSON.stringify(ss))
	pluginLoad()
}
function execEditPlugin() {
	completePlugin(true)
	var id = $('#plugin').attr('data-id')
	var inputPlugin = editor.getValue()
	var meta = getMeta(inputPlugin).data
	execPlugin(id, meta.event, { acct_id: 0, id: null })
}
window.onload = function () {
	//最初に読む
	load()
	climute()
	wordmute()
	wordemp()
	checkSpotify()
	voiceSettingLoad()
	oksload()
	ctLoad()
	pluginLoad()
	$('body').addClass(localStorage.getItem('platform'))
}
//設定画面で未読マーカーは要らない
function asReadEnd() {
	postMessage(['asReadComp', ''], '*')
}
function checkupd() {
	if (localStorage.getItem('winstore') == 'brewcask' || localStorage.getItem('winstore') == 'snapcraft' || localStorage.getItem('winstore') == 'winstore') {
		var winstore = true
	} else {
		var winstore = false
	}
	var ver = localStorage.getItem('ver')
	var start = 'https://thedesk.top/ver.json'
	fetch(start, {
		method: 'GET',
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function (mess) {
			console.table(mess)
			if (mess) {
				var platform = localStorage.getItem('platform')
				if (platform == 'darwin') {
					var newest = mess.desk_mac
				} else {
					var newest = mess.desk
				}
				if (newest == ver) {
					Swal.fire({
						type: 'info',
						text: lang.lang_setting_noupd,
						html: ver,
					})
				} else if (ver.indexOf('beta') != -1 || winstore) {
					Swal.fire({
						type: 'info',
						text: lang.lang_setting_thisisbeta,
						html: ver,
					})
				} else {
					localStorage.removeItem('new-ver-skip')
					location.href = 'index.html'
				}
			}
		})
}
function lastFmSet() {
	if ($('#lastFmUser').val()) {
		localStorage.setItem('lastFmUser', $('#lastFmUser').val())
	} else {
		localStorage.removeItem('lastFmUser')
	}
	M.toast({ html: 'Complete: last.fm', displayLength: 3000 })
}

function stopVideo() { return false }