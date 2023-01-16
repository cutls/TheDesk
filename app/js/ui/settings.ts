import { getMeta, testExec } from '../platform/plugin'
import { createApp } from 'vue/dist/vue.esm-bundler'
import { chipInit, chipInitGetInstance, formSelectInit, toast } from '../common/declareM'
import lang from '../common/lang'
import { themes } from './theme'
import { playSound } from '../platform/end'
import { escapeHTML, makeCID } from '../platform/first'
import JSON5 from 'json5'
import Swal from 'sweetalert2'
import { getColumn, getMulti, setColumn, setMulti } from '../common/storage'
import { IConfig, ITheDeskConfig } from '../../interfaces/Config'
import { IPlugin } from '../../interfaces/Storage'
import api from '../common/fetch'
import $ from 'jquery'
import settingLang from '../common/settingLang'
const { envConstruction, tlConstruction, postConstruction } = settingLang

declare let editor

//設定(setting.html)で読む
const envView: any = createApp({
	data() {
		return {
			config: envConstruction,
		}
	},
	methods: {
		complete: function (i, val) {
			let ls = envView.config[i]
			const header = ls.text.head
			const after = ls.text.after || ''
			const hasCheckbox = ls.text.checkbox
			let showVal = val
			if (!ls.data) {
				ls = [ls]
			} else {
				ls = ls.data
			}
			console.log(ls)
			for (let j = 0; j < ls.length; j++) {
				const lsi = ls[j]
				if (!val || j > 0) showVal = showVal ? `${showVal} - ${lsi.setValue}` : lsi.setValue
				if (!val || j > 0) val = lsi.setValue
				localStorage.setItem(lsi.storage, val)
			}
			if (ls[0].id === 'ha') {
				hardwareAcceleration(val)
			}
			if (ls[0].id === 'webview') {
				postMessage(['webviewSetting', val], '*')
			}
			if (ls[0].id === 'ua_setting') {
				useragent(val)
			}
			if (ls[0].id === 'size') {
				$('html,body').css('font-size', `${val}px`)
			}

			const cbTxt = hasCheckbox ? hasCheckbox.find((i) => i.value === val).text : showVal
			toast({ html: `Updated: "${header}" to "${cbTxt}${after}"`, displayLength: 3000 })
			return true
		},
	},
}).mount('#envView')
globalThis.envView = envView
const tlView: any = createApp({
	data() {
		return { config: tlConstruction }
	},
	methods: {
		complete: function (i, val) {
			let ls = tlView.config[i]
			const header = ls.text.head
			if (val) {
				localStorage.setItem(ls.storage, val)
			} else {
				if (!ls.data) {
					ls = [ls]
				} else {
					ls = ls.data
				}
				for (let j = 0; j < ls.length; j++) {
					const id = ls[j].id
					const val =
						$('#' + id)
							.val()
							?.toString() || ''
					localStorage.setItem(ls[j].storage, val)
				}
			}
			toast({ html: `Updated: ${header}`, displayLength: 3000 })
			return true
		},
	},
}).mount('#tlView')
globalThis.tlView = tlView
const postView: any = createApp({
	data() {
		return {
			config: postConstruction,
			quoters: localStorage.getItem('quoters'),
		}
	},
	methods: {
		complete: function (i, val) {
			let ls = postView.config[i]
			const header = ls.text.head
			if (val) {
				localStorage.setItem(ls.storage, val)
			} else {
				if (!ls.data) {
					ls = [ls]
				} else {
					ls = ls.data
				}
				for (let j = 0; j < ls.length; j++) {
					toast({ html: 'Complete', displayLength: 3000 })
					const id = ls[j].id
					const val =
						$('#' + id)
							.val()
							?.toString() || ''
					localStorage.setItem(ls[j].storage, val)
				}
			}
			toast({ html: `Updated: ${header}`, displayLength: 3000 })
			return true
		},
	},
}).mount('#postView')
globalThis.postView
//設定ボタン押した。
export function settings() {
	const fontd = $('#font').val()?.toString() || ''
	if (fontd) {
		if (fontd !== localStorage.getItem('font')) {
			toast({ html: lang.lang_setting_font.replace('{{set}}', fontd), displayLength: 3000 })
		}
		localStorage.setItem('font', fontd)
		themes()
	} else {
		if (localStorage.getItem('font')) {
			localStorage.removeItem('font')
			toast({ html: lang.lang_setting_font.replace('{{set}}', '"default"'), displayLength: 3000 })
			themes()
		}
	}
}

//読み込み時の設定ロード
export function configLoad() {
	const currentLang = lang.language
	console.log(currentLang)
	$('#langsel-sel').val(currentLang)
	formSelectInit($('#langsel-sel'))
	const maxEnv = envView.config.length
	for (let i = 0; i < maxEnv; i++) {
		let ls = envView.config[i].storage
		if (ls) {
			if (localStorage.getItem(ls)) {
				console.log(envView.config[i].setValue, localStorage.getItem(ls))
				envView.config[i].setValue = localStorage.getItem(ls)
			}
		} else {
			ls = envView.config[i].data
			for (let j = 0; j < ls.length; j++) {
				envView.config[i].data[j].setValue = localStorage.getItem(ls[j].storage)
			}
		}
	}
	const maxTl = tlView.config.length
	for (let i = 0; i < maxTl; i++) {
		let ls = tlView.config[i].storage
		if (ls) {
			if (localStorage.getItem(ls)) {
				tlView.config[i].setValue = localStorage.getItem(ls)
			}
		} else {
			ls = tlView.config[i].data
			for (let j = 0; j < ls.length; j++) {
				if (localStorage.getItem(tlView.config[i].data[j].storage)) {
					tlView.config[i].data[j].setValue = localStorage.getItem(tlView.config[i].data[j].storage)
				}
			}
		}
	}
	const maxPost = postView.config.length
	for (let i = 0; i < maxPost; i++) {
		let ls = postView.config[i].storage
		if (ls) {
			if (localStorage.getItem(ls)) {
				postView.config[i].setValue = localStorage.getItem(ls)
			}
		} else {
			ls = postView.config[i].data
			for (let j = 0; j < ls.length; j++) {
				postView.config[i].data[j].setValue = localStorage.getItem(ls[j].storage)
			}
		}
	}
	const theme = localStorage.getItem('theme') || 'white'
	$('#' + theme).prop('checked', true)
	const font = localStorage.getItem('font') || ''
	$('#font').val(font)
	$('#c1-file').text(localStorage.getItem('custom1') || '')
	$('#c2-file').text(localStorage.getItem('custom2') || '')
	$('#c3-file').text(localStorage.getItem('custom3') || '')
	$('#c4-file').text(localStorage.getItem('custom4') || '')
	const cvol = parseInt(localStorage.getItem('customVol') || '0', 10)
	if (cvol) {
		$('#soundvol').val(cvol * 100)
		$('#soundVolVal').text(cvol * 100)
	}
	//$("#log").val(localStorage.getItem("errors"))
	$('#lastFmUser').val(localStorage.getItem('lastFmUser') || '')
}

export function customVol() {
	const cvol = parseInt($('#soundvol').val()?.toString() || '1', 10)
	$('#soundVolVal').text(cvol)
	localStorage.setItem('customVol', (cvol / 100).toString())
	const sound = localStorage.getItem('favSound')
	let file = '../../source/notif.wav'
	if (sound === 'c1') {
		file = localStorage.getItem('custom1') || ''
	} else if (sound === 'c2') {
		file = localStorage.getItem('custom2') || ''
	} else if (sound === 'c3') {
		file = localStorage.getItem('custom3') || ''
	} else if (sound === 'c4') {
		file = localStorage.getItem('custom4') || ''
	}
	const request = new XMLHttpRequest()
	request.open('GET', file, true)
	request.responseType = 'arraybuffer'
	request.onload = () => playSound(request)
	request.send()
}

export function climute() {
	//クライアントミュート
	const cli = localStorage.getItem('client_mute') || '[]'
	const obj = JSON.parse(cli)
	if (!obj) {
		$('#mute-cli').html(lang.lang_setting_nomuting)
	} else {
		if (!obj[0]) {
			$('#mute-cli').html(lang.lang_setting_nomuting)
			return
		}
		let template
		let key = 0
		for (const cli of obj) {
			const list = key + 1
			template = `<div class="acct" id="acct_${key}">
                ${list}.${escapeHTML(cli)}
                <button class="btn waves-effect red disTar" onclick="cliMuteDel(${key})">${lang.lang_del}</button>
                <br>
            </div>`
			key++
		}
		$('#mute-cli').html(template)
	}
}

export function cliMuteDel(key: number) {
	const cli = localStorage.getItem('client_mute') || '[]'
	const obj = JSON.parse(cli)
	obj.splice(key, 1)
	const json = JSON.stringify(obj)
	localStorage.setItem('client_mute', json)
	climute()
}

export function wordmute() {
	const word = localStorage.getItem('word_mute') || '[]'
	const obj = JSON.parse(word)
	chipInit($('#wordmute'), {
		data: obj,
	})
}

export function wordmuteSave() {
	const wordMap = chipInitGetInstance($('#wordmute')).chipsData
	const word = wordMap.map((n) => n.tag)
	const json = JSON.stringify(word)
	localStorage.setItem('word_mute', json)
}

export function wordemp() {
	const word = localStorage.getItem('word_emp') || '[]'
	const obj = JSON.parse(word)
	chipInit($('#wordemp'), {
		data: obj,
	})
}

export function wordempSave() {
	const wordMap = chipInitGetInstance($('#wordemp')).chipsData
	const word = wordMap.map((n) => n.tag)
	const json = JSON.stringify(word)
	localStorage.setItem('word_emp', json)
}

export function notfTest() {
	const options = {
		body: `${lang.lang_setting_notftest}(${lang.lang_setting_notftestprof})`,
		icon: localStorage.getItem('prof_0') || undefined,
	}
	new Notification('TheDesk' + lang.lang_setting_notftest, options)
}

export function oks(no: number) {
	const txt =
		$('#oks-' + no)
			.val()
			?.toString() || ''
	localStorage.setItem('oks-' + no, txt)
	toast({ html: lang.lang_setting_ksref, displayLength: 3000 })
}

export function oksload() {
	if (localStorage.getItem('oks-1')) {
		$('#oks-1').val(localStorage.getItem('oks-1') || '')
	}
	if (localStorage.getItem('oks-2')) {
		$('#oks-2').val(localStorage.getItem('oks-2') || '')
	}
	if (localStorage.getItem('oks-3')) {
		$('#oks-3').val(localStorage.getItem('oks-3') || '')
	}
}

export function changeLang() {
	const lang = $('#langsel-sel').val()
	console.log(lang)
	if (lang) postMessage(['lang', lang], '*')
}

export async function exportSettings() {
	const exp = exportSettingsCore()
	$('#imp-exp').val(JSON5.stringify(exp))
	const result = await Swal.fire({
		title: 'Warning',
		text: lang.lang_setting_exportwarn,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
	})
	if (result.value) {
		postMessage(['exportSettings', ''], '*')
	}
}

export function exportSettingsCore() {
	const exp = {} as ITheDeskConfig
	//Accounts
	const acct = getMulti()
	exp.accts = acct
	//Columns
	const column = getColumn()
	exp.columns = column
	//Themes
	const config = {} as IConfig
	config.theme = localStorage.getItem('theme') || 'black'
	//Other configs
	for (const lsr of envView.config) {
		const ls = lsr.storage
		config[ls] = localStorage.getItem(ls) || ''
	}
	for (const lsr of tlView.config) {
		const ls = lsr.storage
		config[ls] = localStorage.getItem(ls) || ''
	}
	for (const lsr of postView.config) {
		const ls = lsr.storage
		config[ls] = localStorage.getItem(ls) || ''
	}
	//Font
	config.font = localStorage.getItem('font') || ''
	exp.config = config
	//keysc
	exp.ksc = [localStorage.getItem('oks-1') || '', localStorage.getItem('oks-2') || '', localStorage.getItem('oks-3') || '']
	//climu
	const cli = localStorage.getItem('client_mute') || '[]'
	const climu = JSON.parse(cli)
	exp.clientMute = climu
	//wordmu
	const wdm = localStorage.getItem('word_mute') || '[]'
	const wordmu = JSON.parse(wdm)
	exp.wordMute = wordmu
	//spotify
	exp.spotifyArtwork = localStorage.getItem('artwork') === 'yes' ? 'yes' : null
	const content = localStorage.getItem('np-temp')
	exp.spotifyTemplete = content
	//tags
	const tagarr = localStorage.getItem('tag') || '[]'
	exp.favoriteTags = JSON.parse(tagarr)
	//plugins
	const plugins = localStorage.getItem('plugins') || '[]'
	const plugin = JSON.parse(plugins)
	exp.plugins = plugin

	exp.revisons = 2.3
	exp.meta.date = new Date().toISOString()
	exp.meta.thedesk = localStorage.getItem('ver') || ''
	exp.meta.platform = localStorage.getItem('platform') || ''
	return exp
}

export async function importSettings() {
	const result = await Swal.fire({
		title: 'Warning',
		text: lang.lang_setting_importwarn,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonText: lang.lang_yesno,
		cancelButtonText: lang.lang_no,
	})
	if (result.value) {
		if ($('#imp-exp').val()) {
			importSettingsCore(JSON5.parse($('#imp-exp').val()?.toString() || '[]'))
			return false
		}
		postMessage(['importSettings', ''], '*')
	}
}

export function importSettingsCore(obj: ITheDeskConfig) {
	if (obj) {
		localStorage.clear()
		setMulti(obj.accts)
		for (let key = 0; key < obj.accts.length; key++) {
			const acct = obj.accts[key]
			localStorage.setItem('name_' + key, acct.name)
			localStorage.setItem('user_' + key, acct.user)
			localStorage.setItem('user-id_' + key, acct.id)
			localStorage.setItem('prof_' + key, acct.prof)
			localStorage.setItem('domain_' + key, acct.domain)
			localStorage.setItem('acct_' + key + '_at', acct.at)
			if (acct.rt) localStorage.setItem('acct_' + key + '_rt', acct.rt)
		}
		setColumn(obj.columns)
		if (obj.config) {
			//Version 2~
			for (const lsr of envView.config) {
				const ls = lsr.storage
				if (obj.config[ls]) localStorage.setItem(ls, obj.config[ls])
			}
			for (const lsr of tlView.config) {
				const ls = lsr.storage
				if (obj.config[ls]) localStorage.setItem(ls, obj.config[ls])
			}
			for (const lsr of postView.config) {
				const ls = lsr.storage
				if (obj.config[ls]) localStorage.setItem(ls, obj.config[ls])
			}
		}
		if (obj.ksc[0]) localStorage.setItem('oks-1', obj.ksc[0])
		if (obj.ksc[1]) localStorage.setItem('oks-2', obj.ksc[1])
		if (obj.ksc[2]) localStorage.setItem('oks-3', obj.ksc[2])
		if (obj.clientMute) localStorage.setItem('client_mute', JSON.stringify(obj.clientMute))
		if (obj.wordMute) localStorage.setItem('word_mute', JSON.stringify(obj.wordMute))
		if (obj.favoriteTags) localStorage.setItem('tag', JSON.stringify(obj.favoriteTags))

		localStorage.setItem('np-temp', obj.spotifyTemplete || '')
		for (let i = 0; i < obj.columns.length; i++) {
			localStorage.setItem('card_' + i, 'true')
			localStorage.removeItem('catch_' + i)
		}
		location.href = 'index.html'
	} else {
		Swal.fire({
			icon: 'error',
			title: 'Error',
		})
	}
}

export function saveFolder() {
	postMessage(['sendSinmpleIpc', 'savefolder'], '*')
}

export function font() {
	if ($('#fonts').hasClass('hide')) {
		postMessage(['sendSinmpleIpc', 'fonts'], '*')
		$('#fonts').removeClass('hide')
	} else {
		$('#fonts').addClass('hide')
	}
}

export function fontList(arg: string[]) {
	$('#fonts').removeClass('hide')
	for (const font of arg) $('#fonts').append(`<div class="font pointer" style="font-family:${font}" onclick="insertFont('${font}')">${font}</div>`)
}

export function insertFont(name: string) {
	$('#fonts').addClass('hide')
	$('#font').val(name)
}

export function copyColor(from: string, to: string) {
	const props = ['background', 'subcolor', 'text', 'accent', 'modal', 'modalFooter', 'third', 'forth', 'bottom', 'emphasized', 'postbox', 'active', 'selected', 'selectedWithShared']
	let i = 0
	let color
	for (const tag of props) {
		if (tag === from) {
			const used = $(`#use-color_${i}`).prop('checked')
			if (!used) {
				Swal.fire({
					icon: 'error',
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
	for (const tag of props) {
		if (tag === to) {
			$(`#color-picker${i}_value`).val(color)
			$(`#use-color_${i}`).prop('checked', true)
			break
		}
		i++
	}
}

export function customComp(preview: boolean) {
	const nameC = $('#custom_name').val()
	if (!nameC && !preview) {
		return false
	}
	const descC = $('#custom_desc').val()
	const bgC = $('#color-picker0_value').val()
	const subcolorC = $('#color-picker2_value').val()
	const textC = $('#color-picker1_value').val()
	const accentC = $('#color-picker3_value').val()
	const obj = getMulti()
	const advanced = ['modal', 'modalFooter', 'third', 'forth', 'bottom', 'emphasized', 'postbox', 'active', 'selected', 'selectedWithShared']
	const advanceTheme = {}
	let i = 4
	for (const tag of advanced) {
		const used = $(`#use-color_${i}`).prop('checked')
		if (used) {
			advanceTheme[tag] = $(`#color-picker${i}_value`).val()
		}
		i++
	}

	const my = obj[0].name
	let id = $('#custom-edit-sel').val()?.toString() || ''
	const defaults = ['black', 'blue', 'brown', 'green', 'indigo', 'polar', 'snow', 'white']
	if (id === 'add_new' || defaults.includes(id)) {
		id = makeCID()
	}
	if (!preview) localStorage.setItem('customtheme-id', id)
	const json = {
		name: nameC,
		author: my,
		desc: descC,
		base: $('[name=direction]:checked').val(),
		primary: {
			background: bgC,
			subcolor: subcolorC,
			text: textC,
			accent: accentC,
		},
		advanced: advanceTheme,
		id: id,
		version: '2',
	}
	$('#custom_json').val(JSON.stringify(json))
	if (preview) {
		postMessage(['themeCSSPreview', json], '*')
	} else {
		$('#custom-edit-sel').val(id)
		formSelectInit($('select'))
		Swal.fire({
			icon: 'success',
			title: 'Saved',
		})
		postMessage(['themeJsonCreate', JSON.stringify(json)], '*')
	}
}

export function deleteIt() {
	const id = $('#custom-sel-sel').val()
	$('#custom_name').val('')
	$('#custom_desc').val('')
	$('#dark').prop('checked', true)
	$('#custom_json').val('')
	for (let i = 0; i <= 13; i++) {
		if (i >= 4) $(`#use-color_${i}`).prop('checked', false)
		$('#color-picker' + i + '_value').val('')
	}
	postMessage(['themeJsonDelete', id + '.thedesktheme'], '*')
}

export function ctLoad() {
	postMessage(['sendSinmpleIpc', 'theme-json-list'], '*')
}

export function ctLoadCore(args: any) {
	let template = ''
	let editTemplate = ''
	for (const theme of args) {
		const themeid = theme.id
		template = template + `<option value="${themeid}">${theme.name}${theme.compatible ? `(${lang.lang_setting_compat})` : ''}</option>`
		if (!theme.compatible) editTemplate = editTemplate + `<option value="${themeid}">${theme.name}</option>`
	}
	$('#custom-sel-sel').html(template)
	editTemplate = '<option value="add_new">' + $('#edit-selector').attr('data-add') + '</option>' + editTemplate
	$('#custom-edit-sel').html(editTemplate)
	$('#custom-sel-sel').val(localStorage.getItem('customtheme-id') || '')
	formSelectInit($('select'))
}
export function customSel() {
	const id = $('#custom-sel-sel').val()?.toString() || ''
	localStorage.setItem('customtheme-id', id)
	themes(id)
}
export function custom() {
	const id = $('#custom-edit-sel').val()
	if (id === 'add_new') {
		$('#custom_name').val('')
		$('#custom_desc').val('')
		$('#dark').prop('checked', true)
		$('#custom_json').val('')
		for (let i = 0; i <= 13; i++) {
			if (i >= 4) $(`#use-color_${i}`).prop('checked', false)
			$('#color-picker' + i + '_value').val('')
		}
		$('#delTheme').addClass('disabled')
	} else {
		$('#delTheme').removeClass('disabled')
		postMessage(['themeJsonRequest', id + '.thedesktheme'], '*')
	}
}
export function customConnect(raw: any) {
	const args = raw[0]
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
	const advanced = ['modal', 'modalFooter', 'third', 'forth', 'bottom', 'emphasized', 'postbox', 'active', 'selected', 'selectedWithShared']
	let i = 4
	for (const tag of advanced) {
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
export function customImp() {
	const json = $('#custom_import').val()?.toString() || '[]'
	if (JSON5.parse(json)) {
		postMessage(['themeJsonCreate', json], '*')
	} else {
		Swal.fire({
			icon: 'error',
			title: 'Error',
		})
	}
}
export function advanced() {
	$('.advanced').toggleClass('hide')
	$('#pickers').toggleClass('advanceTheme')
}
export function clearCustomImport() {
	$('#custom_import').val('')
}
export function hardwareAcceleration(had: 'true' | 'false') {
	postMessage(['ha', had], '*')
}
export function useragent(val: string) {
	postMessage(['ua', val], '*')
}
export function frameSet(val: 'true' | 'false') {
	postMessage(['frameSet', val], '*')
}
export function customSound(key: number) {
	postMessage(['customSound', key], '*')
}
export function customSoundSave(key: number, file: string) {
	localStorage.setItem('custom' + key, file)
	$(`#c${key}-file`).text(file)
}
export function pluginLoad() {
	$('#plugin-edit-sel').val('add_new')
	$('.plugin_delete').addClass('disabled')
	let template = ''
	const pgns = localStorage.getItem('plugins')
	const args = JSON.parse(pgns ? pgns : '[]')
	Object.keys(args).forEach(function (key) {
		const theme = args[key]
		const themeid = theme.id
		template = template + `<option value="${themeid}">${getMeta(theme.content).data.name}</option>`
	})
	template = '<option value="add_new">' + $('#plugin-selector').attr('data-add') + '</option>' + template
	$('#plugin-edit-sel').html(template)
	formSelectInit($('select'))
}
export function pluginEdit() {
	const id = $('#plugin-edit-sel').val()?.toString() || ''
	$('#plugin').attr('data-id', id)
	if (id === 'add_new') {
		editor.setValue('', -1)
		$('.plugin_delete').addClass('disabled')
	} else {
		$('.plugin_delete').removeClass('disabled')
		const pgns = localStorage.getItem('plugins')
		const args = JSON.parse(pgns ? pgns : '[]')
		Object.keys(args).forEach(function (key) {
			const plugin = args[key]
			const targetId = plugin.id
			if (targetId === id) editor.setValue(plugin.content, -1)
		})
	}
}
export function completePlugin(comp?: boolean) {
	const pgns = localStorage.getItem('plugins')
	const args = JSON.parse(pgns ? pgns : '[]')
	let id = $('#plugin').attr('data-id')

	const inputPlugin = editor.getValue()
	try {
		const meta = getMeta(inputPlugin)
		if (!meta.data) {
			const metaAny: any = meta
			Swal.fire({
				icon: 'error',
				title: 'Syntax Error',
				text: `error on line ${metaAny.location.start.line}`,
			})
			return false
		}

		if (!meta.data.name || !meta.data.version || !meta.data.event || !meta.data.author) {
			Swal.fire({
				icon: 'error',
				title: 'Meta data error',
				text: 'Syntax Error of META DATA',
			})
			return false
		}
		if (id === 'add_new') {
			id = makeCID()
			args.push({
				id: id,
				content: inputPlugin,
			})
		} else {
			for (const plugin of args) {
				const targetId = plugin.id
				if (targetId === id) plugin.content = inputPlugin
			}
		}
		const ss = args
		localStorage.setItem('plugins', JSON.stringify(ss))
		if (comp) return false
		$('#plugin').attr('data-id', 'add_new')
		editor.setValue('', -1)
		pluginLoad()
	} catch (e: any) {
		Swal.fire({
			icon: 'error',
			title: 'Syntax Error',
			text: `error on line ${e.location.start.line}`,
		})
		return false
	}
}
export function testExecTrg() {
	const inputPlugin = editor.getValue()
	try {
		const meta: any = getMeta(inputPlugin)
		if (meta.location) {
			Swal.fire({
				icon: 'error',
				title: 'Error',
				text: `error on line ${meta.location.start.line}`,
			})
			return false
		}
		Swal.fire({
			icon: 'success',
			title: 'Success',
			text: `Good syntax`,
		})
	} catch (e: any) {
		Swal.fire({
			icon: 'error',
			title: 'Error',
			text: `error on line ${e.location.start.line}`,
		})
	}

	testExec(inputPlugin)
}
export async function deletePlugin() {
	const delIsIt = await Swal.fire({
		title: 'delete',
		icon: 'warning',
		showCancelButton: true,
	})
	if (!delIsIt.isConfirmed) return false
	editor.setValue('', -1)
	const pgns = localStorage.getItem('plugins')
	const args = JSON.parse(pgns ? pgns : '[]')
	const id = $('#plugin').attr('data-id')
	$('#plugin').attr('data-id', 'add_new')
	const ss: IPlugin[] = []
	for (const plugin of args) {
		const targetId = plugin.id
		if (targetId !== id) ss.push(plugin)
	}
	localStorage.setItem('plugins', JSON.stringify(ss))
	pluginLoad()
}

export async function checkUpd() {
	const winstore = localStorage.getItem('winstore') === 'brewcask' || localStorage.getItem('winstore') === 'snapcraft' || localStorage.getItem('winstore') === 'winstore'
	const ver = localStorage.getItem('ver')
	const start = 'https://thedesk.top/ver.json'
	const mess = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json',
		},
	})
	if (mess) {
		const platform = localStorage.getItem('platform')
		const newest = platform === 'darwin' ? mess.desk_mac : mess.desk
		if (newest === ver) {
			Swal.fire({
				icon: 'info',
				text: lang.lang_setting_noupd,
				html: ver || '',
			})
		} else if ((ver && ver.indexOf('beta') !== -1) || winstore) {
			Swal.fire({
				icon: 'info',
				text: lang.lang_setting_thisisbeta,
				html: ver || '',
			})
		} else {
			localStorage.removeItem('new-ver-skip')
			location.href = 'index.html'
		}
	}
}
export function lastFmSet() {
	if ($('#lastFmUser').val()) {
		localStorage.setItem('lastFmUser', $('#lastFmUser').val()?.toString() || '')
	} else {
		localStorage.removeItem('lastFmUser')
	}
	toast({ html: 'Complete: last.fm', displayLength: 3000 })
}
