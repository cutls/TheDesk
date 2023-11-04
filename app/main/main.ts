const dirname = __dirname
// Electronのモジュール
import electron, { powerMonitor } from 'electron'
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
import crypto from 'crypto'
import { system as systemFunc } from './system'
const { Menu, BrowserWindow, ipcMain } = electron
import { join, dirname as getDirname } from 'path'
console.log(`Your personal data is located on ${app.getPath('userData')}`)
const info_path = join(app.getPath('userData'), 'window-size.json')
const max_info_path = join(app.getPath('userData'), 'max-window-size.json')
const ha_path = join(app.getPath('userData'), 'hardwareAcceleration')
const wv_path = join(app.getPath('userData'), 'webview')
const ua_path = join(app.getPath('userData'), 'useragent')
const lang_path = join(app.getPath('userData'), 'language')
const debugPath = join(app.getPath('userData'), 'debug')
const parent = getDirname(__dirname)
const homeDir = parent.replace('dist', '')
const dir = 'file://' + homeDir
const base = dir + '/view/'
// ウィンドウを作成するモジュール
// メインウィンドウはGCされないようにグローバル宣言
let mainWindow: electron.BrowserWindow | null = null
let willQuit = false

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
	app.on('second-instance', (event, commandLine) => {
		if (!mainWindow) return
		const m = commandLine[2].match(/([a-zA-Z0-9]+)\/?\?[a-zA-Z-0-9]+=([^&]+)/)
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
	const m = url.match(/([a-zA-Z0-9]+)\/?\?[a-zA-Z-0-9]+=([^&]+)/)
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
	let lang: string
	if (isFile(lang_path)) {
		lang = fs.readFileSync(lang_path, 'utf8')
	} else {
		const langs = app.getLocale()
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
		fs.mkdir(app.getPath('userData'), function () {
			fs.writeFileSync(lang_path, lang)
		})
	}
	const packaged = process.argv.indexOf('--dev') === -1
	if (!packaged) console.log('your lang:' + app.getLocale())
	if (!packaged) console.log('launch:' + lang)
	//Opening
	let show = 'TheDesk 2018'
	if (lang === 'ja') {
		const maxims = JSON.parse(fs.readFileSync(homeDir + '/maxim.ja.json').toString())
		show = maxims[Math.floor(Math.random() * maxims.length)]
	} else if (lang === 'ja-KS') {
		//ja-KSも作れたらいいね
		const maxims = JSON.parse(fs.readFileSync(homeDir + '/maxim.ja.json').toString())
		show = maxims[Math.floor(Math.random() * maxims.length)]
	}
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
	const initWindowSize: IWindow = {
		width: 1000,
		height: 750,
		x: null,
		y: null,
		max: false
	}
	let windowSize: IWindow = initWindowSize
	if (fs.existsSync(info_path)) {
		const info = fs.readFileSync(info_path, 'utf8').toString() || JSON.stringify(initWindowSize)
		if (JSON.parse(info)) {
			windowSize = JSON.parse(info)
			if (windowSize.width < 256 || windowSize.height < 256) {
				windowSize = initWindowSize
			}
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
	mainWindow.setBounds({
		width: windowSize.width,
		height: windowSize.height,
		x: windowSize.x || 1000,
		y: windowSize.y || 750,
	})
	mainWindow.once('page-title-updated', () => {
		if (!mainWindow) return
		mainWindow.show()
		console.log('Accessibility: ' + app.accessibilitySupportEnabled)
		if (windowSize.max) {
			mainWindow.maximize()
		}
	})
	mainWindow.webContents.on('dom-ready', () => {
		if (!mainWindow) return
		if (!packaged) console.log('Updater diabled: isDev')
		if (!packaged) mainWindow.webContents.send('isDev', true)
	})
	mainWindow.webContents.on('page-title-updated', () => {
		if (!mainWindow) return
		const url = mainWindow.webContents.getURL()
		if (url.match(/https:\/\/crowdin.com\/profile/)) {
			app.relaunch()
			app.exit()
		}
	})
	const isDebug = fs.existsSync(debugPath) && fs.readFileSync(debugPath).toString() === 'true'
	if (!packaged || isDebug) mainWindow.webContents.toggleDevTools()
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
		const N = 100
		ua = 'Mastodon client: ' + crypto.randomBytes(N).toString('base64').substring(0, N)
	}
	mainWindow.loadURL(base + lang + '/index.html' + plus, { userAgent: ua })
	if (!windowSize.x && !windowSize.y) {
		mainWindow.center()
	}
	// ウィンドウが閉じられたらアプリも終了
	app.on('quit', function () {
		console.log('quit completely')
		ipcMain.removeAllListeners()
		mainWindow = null
	})
	let closeArg = false

	app.on('before-quit', function (e) {
		willQuit = true
		if (!mainWindow) return
		writePos(mainWindow)
		if (!closeArg) e.preventDefault()
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
		promise.then(function () {
			if (!mainWindow) return
			closeArg = true
			if (mainWindow.isClosable()) mainWindow.close()
		})
	})
	ipcMain.on('sendMarkersComplete', function () {
		if (!mainWindow) return
		closeArg = true
		mainWindow.close()
	})
	function writePos(mainWindow: electron.BrowserWindow) {
		const { width, height, x, y } = mainWindow.getBounds()
		const isMax = max_window_size.width === width &&
			max_window_size.height === height &&
			max_window_size.x === x &&
			max_window_size.y === y
		const size = {
			width: width,
			height: height,
			x: x,
			y: y,
			max: isMax
		}
		fs.writeFileSync(info_path, JSON.stringify(size))
	}
	mainWindow.on('maximize', function () {
		if (!mainWindow) return
		writePos(mainWindow)
		fs.writeFileSync(max_info_path, JSON.stringify(mainWindow.getBounds()))
	})
	mainWindow.on('unmaximize', function () {
		if (!mainWindow) return
		writePos(mainWindow)
	})
	mainWindow.on('resized', function () {
		if (!mainWindow) return
		writePos(mainWindow)
	})
	mainWindow.on('moved', function () {
		if (!mainWindow) return
		writePos(mainWindow)
	})
	mainWindow.on('minimize', function () {
		if (!mainWindow) return
		writePos(mainWindow)
		mainWindow.webContents.send('asRead', '')
	})
	mainWindow.on('close', function (e) {
		if (platform !== 'darwin' || willQuit) return
		mainWindow?.hide()
		e.preventDefault()
	})
	app.on('activate', function () {
		// is only darwin
		mainWindow?.show()
	})
	Menu.setApplicationMenu(Menu.buildFromTemplate(language(lang, mainWindow, packaged, dir, isDebug)))
	//CSS
	css()
	//アップデータとダウンロード
	dl(mainWindow, lang_path, base, homeDir)
	//画像選択と画像処理
	img(mainWindow, lang)
	//NowPlaying
	np()
	//その他system
	systemFunc(mainWindow, dir, homeDir)
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
	const mousePos = electron.screen.getCursorScreenPoint()
	const xNow = mousePos.x
	const yNow = mousePos.x
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

powerMonitor.on('resume', function () {
	mainWindow?.webContents.send('reload', '')
})
app.setAsDefaultProtocolClient('thedesk')
