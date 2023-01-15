import electron from 'electron'
import * as fs from 'fs'
import path, { join } from 'path'
import JSON5 from 'json5'
interface ITheme {
	name: string
	id: string
	compatible: boolean
	default: boolean
}
export default function () {
	const ipc = electron.ipcMain
	const app = electron.app
	const customcss = join(app.getPath('userData'), 'custom.css')

	ipc.on('custom-css-create', function (e, arg) {
		fs.writeFileSync(customcss, arg)
		e.sender.send('custom-css-create-complete', '')
	})
	ipc.on('custom-css-request', function (e, arg) {
		if (!fs.existsSync(customcss)) return
		const css = fs.readFileSync(customcss, 'utf8').toString() || ''
		e.sender.send('custom-css-response', css)
	})
	ipc.on('theme-json-create', function (e, arg) {
		const themecss = join(app.getPath('userData'), JSON5.parse(arg)['id'] +
			'.thedesktheme')
		fs.writeFileSync(themecss, JSON5.stringify(JSON5.parse(arg)))
		if (JSON5.parse(arg)['id']) {
			e.sender.send('theme-json-create-complete', '')
		} else {
			e.sender.send('theme-json-create-complete', 'error')
		}
	})
	ipc.on('theme-json-delete', function (e, arg) {
		try {
			const themecss = join(app.getPath('userData'), arg)
			console.log(themecss)
			fs.unlink(themecss, function (err) {
				e.sender.send('theme-json-delete-complete', '')
			})
		} catch {
			e.sender.send('theme-json-delete-complete', 'cannot delete')
		}

	})
	ipc.on('theme-json-request', function (e, arg) {
		let raw = ''
		try {
			if (!arg) return
			const themecss = join(app.getAppPath(), '/source/themes', arg)
			raw = fs.readFileSync(themecss, 'utf8')
		} catch {
			const themecss = join(app.getPath('userData'), arg)
			raw = fs.readFileSync(themecss, 'utf8')
		}
		const json = JSON5.parse(raw)
		e.sender.send('theme-json-response', [json, raw])
	})
	ipc.on('theme-css-request', function (e, args) {
		let json
		if (args[0] === 'themeCSSPreview') {
			json = args[1]
		} else {
			try {
				const themecss = join(app.getAppPath(), '/source/themes', args[1])
				json = JSON5.parse(fs.readFileSync(themecss, 'utf8'))
			} catch {
				const themecss = join(app.getPath('userData'), args[1])
				json = JSON5.parse(fs.readFileSync(themecss, 'utf8'))
			}
		}

		try {
			let css
			if (json.version) {
				const bg = json.primary.background
				const subcolor = json.primary.subcolor
				const text = json.primary.text
				const accent = json.primary.accent
				const isLight = json.base === 'light'
				const drag = isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
				const beforehover = isLight ? '#757575' : '#9e9e9e'
				const selectedThemed = isLight ? '#3f3f3f' : '#c0c0c0'
				const selectedWithShareThemed = isLight ? '#b2babd' : '#003a30'
				const gray = isLight ? '#757575' : '#cccccc'
				const hisData = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)'
				if (!json.advanced) {
					json.advanced = {}
				}
				const modal = json.advanced.modal || bg
				const modalFooter = json.advanced.modalFooter || (modal !== bg ? modal : bg)
				const thirdColor = json.advanced.thirdColor || subcolor
				const forthColor = json.advanced.forthColor || (thirdColor !== subcolor ? thirdColor : subcolor)
				const bottom = json.advanced.bottom || subcolor
				const emphasized = json.advanced.emphasized || accent
				const postbox = json.advanced.postbox || subcolor
				const active = json.advanced.active || accent
				const selected = json.advanced.selected || selectedThemed
				const selectedWithShare = json.advanced.selectedWithShare || selectedWithShareThemed

				css = `:root {--bg:${bg};--drag:${drag};--text:${text};--beforehover:${beforehover};--modal:${modal};--thirdColor:${thirdColor};--subcolor:${forthColor};--bottom:${bottom};--accent:${accent};--emphasized:${emphasized};--his-data:${hisData};--active:${active};--postbox:${postbox};--modalfooter:${modalFooter};--selected:${selected};--selectedWithShare:${selectedWithShare};--gray:${gray}}.customtheme #imagemodal{background: url('../img/pixel.svg')}`
			} else {
				css = compatibleTheme(json)
			}
			e.sender.send('theme-css-response', css)
		} catch (e) {
			const css = ''
		}

	})
	function compatibleTheme(json) {
		const primary = json.consts.primary
		const secondary = json.consts.secondary
		const text = json.consts.text
		const isLight = json.base === 'light'
		const drag = isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
		const beforehover = isLight ? '#757575' : '#9e9e9e'
		const selectedThemed = isLight ? '#3f3f3f' : '#c0c0c0'
		const selectedWithShareThemed = isLight ? '#b2babd' : '#003a30'
		const gray = isLight ? '#757575' : '#cccccc'
		const emphasized = json.advanced.TheDeskAccent || secondary
		const active = json.advanced.TheDeskActive || primary
		const modal = json.advanced.TheDeskModal || secondary
		const bottom = json.advanced.TheDeskBottom || primary
		const postbox = json.advanced.TheDeskPostbox || primary
		const subcolor = json.advanced.TheDeskSubcolor || primary
		const css = `.customtheme {--bg:${secondary};--drag:${drag};--text:${text};--beforehover:${beforehover};-modal:${modal};--thirdColor:${subcolor };--subcolor:${subcolor};--bottom:${bottom };--accent:${emphasized};--subcolor:${secondary};--emphasized:${active };--his-data:${secondary};--active:${active};--postbox:${postbox};--modalfooter:${primary};--active:${subcolor};--selected:${selectedThemed};--selectedWithShare:${selectedWithShareThemed};--gray:${gray};}.customtheme #imagemodal{background: url('../img/pixel.svg')}`
		return css
	}
	ipc.on('theme-json-list', function (e, arg) {
		const files1 = fs.readdirSync(join(app.getAppPath(), '/source/themes'))
		const file1List = files1.filter(function (file) {
			if (file.match(/\.thedesktheme$/)) {
				const tfile = join(app.getAppPath(), '/source/themes', file)
				return fs.statSync(tfile).isFile() && /.*\.thedesktheme$/.test(tfile)
			} else {
				return null
			}
		})
		const themes: ITheme[] = []
		for (let i = 0; i < file1List.length; i++) {
			const themecss = join(app.getAppPath(), '/source/themes', file1List[i])
			const json = JSON5.parse(fs.readFileSync(themecss, 'utf8'))
			let compat = true
			if (json.version) compat = false
			themes.push({
				name: json.name,
				id: json.id,
				compatible: compat,
				default: true
			})
		}
		const files2 = fs.readdirSync(app.getPath('userData'))
		const file2List = files2.filter(function (file) {
			if (file.match(/\.thedesktheme$/)) {
				const tfile = join(app.getPath('userData'), file)
				return fs.statSync(tfile).isFile() && /.*\.thedesktheme$/.test(tfile)
			} else {
				return null
			}
		})
		for (let i = 0; i < file2List.length; i++) {
			const themecss = join(app.getPath('userData'), file2List[i])
			const json = JSON5.parse(fs.readFileSync(themecss, 'utf8'))
			let compat = true
			if (json.version) compat = false
			themes.push({
				name: json.name,
				id: json.id,
				compatible: compat,
				default: false
			})
		}
		e.sender.send('theme-json-list-response', themes)
	})
}