const dirname = __dirname
// Electronのモジュール
import electron from 'electron'
// アプリケーションをコントロールするモジュール
const app = electron.app
// Electronの初期化完了後に実行
app.on('ready', createWindow)
import * as fs from 'fs'
import language from './language'
import css from './css'
import dl from './dl'
import img from './img'
import np from './np'
import { system as systemFunc } from './system'
const { Menu, MenuItem, BrowserWindow, ipcMain } = electron
import  { join, dirname as getDirname } from 'path'

const info_path = join(app.getPath('userData'), 'window-size.json')
const max_info_path = join(app.getPath('userData'), 'max-window-size.json')
const ha_path = join(app.getPath('userData'), 'hardwareAcceleration')
const wv_path = join(app.getPath('userData'), 'webview')
const ua_path = join(app.getPath('userData'), 'useragent')
const lang_path = join(app.getPath('userData'), 'language')
const parent = getDirname(__dirname)
const homeDir = parent.replace('dist', '')
const dir = 'file://' + homeDir
const base = dir + '/view/'
// ウィンドウを作成するモジュール
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow: electron.BrowserWindow | null = null
let opening = true

// アプリが多重起動しないようにする
const gotTheLock = app.requestSingleInstanceLock()

interface IWindow {
	width: number
	height: number
	x: number | null
	y: number | null
	max: boolean
}

if (!gotTheLock) {
	app.quit()
} else {
	app.on('second-instance', (event, commandLine, workingDirector) => {
		if (!mainWindow) return
		opening = false
		const m = commandLine[2].match(/([a-zA-Z0-9]+)\/?\?[a-zA-Z-0-9]+=(.+)/)
		if (m) {
			mainWindow.webContents.send('customUrl', [m[1], m[2]])
		}
	})
}

// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function () {
	electron.session.defaultSession.clearCache()
	app.quit()
})
app.on('open-url', function (event, url) {
	if (!mainWindow) return
	event.preventDefault()
	const m = url.match(/([a-zA-Z0-9]+)\/?\?[a-zA-Z-0-9]+=(.+)/)
	if (m) {
		mainWindow.webContents.send('customUrl', [m[1], m[2]])
	}
})
function isFile(file: fs.PathLike) {
	try {
		fs.statSync(file)
		return true
	} catch (err: any) {
		if (err.code === 'ENOENT') return false
	}
}
let max_window_size: any
try {
	max_window_size = JSON.parse(fs.readFileSync(max_info_path, 'utf8'))
} catch (e) {
	max_window_size = {
		width: 'string',
		height: 'string',
		x: 'string',
		y: 'string',
	} // デフォルトバリュー
}
function createWindow() {
	console.log(lang_path)
	let lang: string
	if (isFile(lang_path)) {
		lang = fs.readFileSync(lang_path, 'utf8')
	} else {
		const langs = app.getLocale()
		console.log(langs)
		if (~langs.indexOf('ja')) {
			lang = 'ja'
		} else if (~langs.indexOf('de')) {
			lang = 'de'
		} else if (~langs.indexOf('cs')) {
			lang = 'cs'
		} else if (~langs.indexOf('bg')) {
			lang = 'bg'
		} else {
			lang = 'en'
		}
		fs.mkdir(app.getPath('userData'), function (err) {
			fs.writeFileSync(lang_path, lang)
		})
	}
	const packaged = process.argv.indexOf('--dev') === -1
	if (!packaged) console.log('your lang:' + app.getLocale())
	if (!packaged) console.log('launch:' + lang)
	//Opening
	console.log(homeDir)
	const packageJson = fs.readFileSync(homeDir + '/package.json').toString()
	let show = 'TheDesk 2018'
	if (lang === 'ja') {
		const maxims = JSON.parse(fs.readFileSync(homeDir + '/maxim.ja.json').toString())
		show = maxims[Math.floor(Math.random() * maxims.length)]
	} else if (lang === 'ja-KS') {
		//ja-KSも作れたらいいね
		const maxims = JSON.parse(fs.readFileSync(homeDir + '/maxim.ja.json').toString())
		show = maxims[Math.floor(Math.random() * maxims.length)]
	}
	const data = JSON.parse(packageJson)
	const version = data.version
	const codename = data.codename
	const openingWindow = new BrowserWindow({
		width: 300,
		height: 400,
		transparent: false,
		frame: false,
		resizable: false,
		show: opening
	})
	openingWindow.loadURL(`${homeDir}/opening.html?ver=${version}&codename=${codename}&maxim=${encodeURI(show)}`)
	if (!packaged) {
		console.log(
			'||\\\\\\ \n' +
			'||||  \\\\\\\\ \n' +
			'||||     \\\\\\\\ \n' +
			'|||| Am I a \\\\\\\\ \n' +
			'|||| cat? ^ ^   \\\\\\\\\\       _____ _          ____            _    \n' +
			'||||     (.-.)   \\\\\\\\\\      |_   _| |__   ___|  _ \\  ___  ___| | __\n' +
			"||||  ___>   )    |||||       | | | '_ \\ / _ \\ | | |/ _ \\/ __| |/ /\n" +
			'|||| <   _  _)   //////       | | | | | |  __/ |_| |  __/__ \\   < \n' +
			'||||  |_||_|   /////          |_| |_| |_|\\___|____/ \\___||___/_|\\_\\ \n' +
			'||||          /////         \n' +
			'||||       /////\n' +
			'||||     /////\n' +
			'||||//////'
		)
		console.log('If it does not show the window, you might forget `npm run construct`.')
	}

	try {
		fs.readFileSync(ha_path, 'utf8')
		app.disableHardwareAcceleration()
		if (!packaged) console.log('disabled: Hardware Acceleration')
	} catch {
		if (!packaged) console.log('enabled: Hardware Acceleration')
	}
	let webviewEnabled = false
	if (fs.existsSync(wv_path)) webviewEnabled = true
	let window_size: IWindow = {
		width: 1000,
		height: 750,
		x: null,
		y: null,
		max: false
	}
	if (fs.existsSync(info_path)) {
		const info = fs.readFileSync(info_path, 'utf8').toString() || '{}'
		if (JSON.parse(info)) {
			window_size = JSON.parse(info)
		}
	}

	// メイン画面の表示。ウィンドウの幅、高さを指定できる
	const platform = process.platform
	const arg: Electron.BrowserWindowConstructorOptions = {
		webPreferences: {
			webviewTag: webviewEnabled,
			nodeIntegration: false,
			contextIsolation: true,
			spellcheck: false,
			sandbox: false,
			preload: join(homeDir, 'js', 'platform', 'preload.js'),
		},
		width: window_size.width || 1000,
		height: window_size.height || 750,
		x: window_size.x || undefined,
		y: window_size.y || undefined,
		show: false,
	}
	if (platform === 'linux') {
		arg.resizable = true
		arg.icon = homeDir + '/desk.png'
	} else if (platform === 'win32') {
		arg.simpleFullscreen = true
	} else if (platform === 'darwin') {
		arg.simpleFullscreen = true
	}
	mainWindow = new BrowserWindow(arg)
	mainWindow.once('page-title-updated', () => {
		if (!mainWindow) return
		openingWindow.close()
		mainWindow.show()
		console.log('Accessibility: ' + app.accessibilitySupportEnabled)
		if (window_size.max) {
			mainWindow.maximize()
		}
	})
	mainWindow.webContents.on('page-title-updated', () => {
		if (!mainWindow) return
		const url = mainWindow.webContents.getURL()
		if (url.match(/https:\/\/crowdin.com\/profile/)) {
			app.relaunch()
			app.exit()
		}
	})
	if (!packaged) mainWindow.webContents.toggleDevTools()
	electron.session.defaultSession.clearCache()
	let plus = ''
	if (process.argv) {
		if (process.argv[1]) {
			const m = process.argv[1].match(/([a-zA-Z0-9]+)\/\?[a-zA-Z-0-9]+=(.+)/)
			if (m) {
				const mode = m[1]
				const code = m[2]
				plus = '?mode=' + mode + '&code=' + code
			}
		}
	}
	let ua: string
	try {
		ua = fs.readFileSync(ua_path, 'utf8')
	} catch (e) {
		//default UA Example:
		// Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) thedesk/18.11.3 Chrome/76.0.3809.146 Electron/6.0.12 Safari/537.36
		const crypto = require('crypto')
		const N = 100
		ua = 'Mastodon client: ' + crypto.randomBytes(N).toString('base64').substring(0, N)
	}
	mainWindow.loadURL(base + lang + '/index.html' + plus, { userAgent: ua })
	if (!window_size.x && !window_size.y) {
		mainWindow.center()
	}
	// ウィンドウが閉じられたらアプリも終了
	mainWindow.on('closed', function () {
		ipcMain.removeAllListeners()
		mainWindow = null
	})
	let closeArg = false
	// @ts-ignore
	mainWindow.on('close', function (e, arg) {
		if (!mainWindow) return
		writePos(mainWindow)
		if (!closeArg) {
			e.preventDefault()
		}
		const promise = new Promise<void>(function (resolve) {
			if (!mainWindow) return
			mainWindow.webContents.send('asReadEnd', '')
			let wait = 3000
			const url = mainWindow.webContents.getURL()
			if (!url.match(/index.html/)) wait = 0
			setTimeout(function () {
				resolve()
			}, wait)
		})
		promise.then(function (response) {
			if (!mainWindow) return
			closeArg = true
			mainWindow.close()
		})
	})
	ipcMain.on('sendMarkersComplete', function (e, arg) {
		if (!mainWindow) return
		closeArg = true
		mainWindow.close()
	})
	function writePos(mainWindow: electron.BrowserWindow) {
		let size = {
			width: mainWindow.getBounds().width,
			height: mainWindow.getBounds().height,
			x: mainWindow.getBounds().x,
			y: mainWindow.getBounds().y,
			max: false
		}
		if (
			max_window_size.width === mainWindow.getBounds().width &&
			max_window_size.height === mainWindow.getBounds().height &&
			max_window_size.x === mainWindow.getBounds().x &&
			max_window_size.y === mainWindow.getBounds().y
		) {
			size = {
				width: mainWindow.getBounds().width,
				height: mainWindow.getBounds().height,
				x: mainWindow.getBounds().x,
				y: mainWindow.getBounds().y,
				max: true,
			}
		}
		fs.writeFileSync(info_path, JSON.stringify(size))
	}
	mainWindow.on('maximize', function () {
		if (!mainWindow) return
		writePos(mainWindow)
		fs.writeFileSync(max_info_path, JSON.stringify(mainWindow.getBounds()))
	})
	mainWindow.on('minimize', function () {
		if (!mainWindow) return
		writePos(mainWindow)
		mainWindow.webContents.send('asRead', '')
	})
	Menu.setApplicationMenu(Menu.buildFromTemplate(language(lang, mainWindow, packaged, dir, dirname)))
	//CSS
	css()
	//アップデータとダウンロード
	dl(mainWindow, lang_path, base, dirname)
	//画像選択と画像処理
	img(mainWindow, lang)
	//NowPlaying
	np()
	//その他system
	systemFunc(mainWindow, dir, dirname)
	setInterval(function () {
		if (!mainWindow) return
		mouseTrack(mainWindow)
	}, 1000)
}
let x = 0
let y = 0
let unchanged = 0
let locked = false
function mouseTrack(mainWindow: electron.BrowserWindow) {
	let mousePos = electron.screen.getCursorScreenPoint()
	let xNow = mousePos.x
	let yNow = mousePos.x
	if (x !== xNow || y !== yNow) {
		unchanged = 0
		locked = false
	} else {
		unchanged++
		if (unchanged > 60 && !locked) {
			unchanged = 0
			locked = true
			mainWindow.webContents.send('asRead', '')
		}
	}
	x = xNow
	y = yNow
}

app.setAsDefaultProtocolClient('thedesk')
