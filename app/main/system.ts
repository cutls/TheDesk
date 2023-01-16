import electron, { BrowserWindow, shell } from "electron"
import { join } from "path"
import fs from 'fs'
import JSON5 from 'json5'
import os from 'os'
import SystemFonts from 'system-font-families'

export function system(mainWindow: BrowserWindow, dir: string, dirname: string) {
	const app = electron.app
	const ipc = electron.ipcMain
	const clipboard = electron.clipboard
	const nativeImage = electron.nativeImage
	const haPath = join(app.getPath('userData'), 'hardwareAcceleration')
	const wvPath = join(app.getPath('userData'), 'webview')
	const uaPath = join(app.getPath('userData'), 'useragent')
	const langPath = join(app.getPath('userData'), 'language')
	const longDirPath = join(app.getPath('userData'), 'logs')
	//ログ
	const today = new Date()
	//今日のやつ
	const todayStr = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '.log'
	//昨日のやつ
	today.setDate(today.getDate() - 1)
	const yestStr = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '.log'
	//一昨日のやつ
	today.setDate(today.getDate() - 1)
	const yest2Str = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '.log'

	const BrowserWindow = electron.BrowserWindow
	const dialog = electron.dialog
	//プラットフォーム
	ipc.on('getPlatform', function (e) {
		let gitHash = ''
		try {
			gitHash = fs.readFileSync('git', 'utf8')
		} catch {
			gitHash = ''
		}
		e.sender.send('platform', [process.platform, process.arch, process.version, process.versions.chrome, process.versions.electron, gitHash])
	})
	//言語
	ipc.on('lang', function (e, arg) {
		console.log('set:' + arg)
		fs.writeFileSync(langPath, arg)
		e.sender.send('langres', arg)
	})
	//エクスポートのダイアログ
	ipc.on('exportSettings', function (e) {
		const savedFiles = dialog.showSaveDialogSync(mainWindow, {
			title: 'Export',
			properties: ['createDirectory'],
			defaultPath: 'export.thedeskconfig.json5',
		})
		if (!savedFiles) return false
		e.sender.send('exportSettingsFile', savedFiles)
	})
	//インポートのダイアログ
	ipc.on('importSettings', function (e) {
		const fileNames = dialog.showOpenDialogSync(mainWindow, {
			title: 'Import',
			properties: ['openFile'],
			filters: [{ name: 'TheDesk Config', extensions: ['thedeskconfig', 'thedeskconfigv2', 'json5'] }],
		})
		console.log('imported from: ', fileNames)
		if (!fileNames) return false
		e.sender.send('config', JSON5.parse(fs.readFileSync(fileNames[0], 'utf8')))
	})
	//保存フォルダのダイアログ
	ipc.on('savefolder', function (e) {
		const fileNames = dialog.showOpenDialogSync(
			mainWindow,
			{
				title: 'Save folder',
				properties: ['openDirectory'],
			}
		)
		if (!fileNames) return false
		e.sender.send('savefolder', fileNames[0])
	})
	//カスタムサウンドのダイアログ
	ipc.on('customSound', function (e, arg) {
		const fileNames = dialog.showOpenDialogSync(
			mainWindow,
			{
				title: 'Custom sound',
				properties: ['openFile'],
				filters: [
					{ name: 'Audio', extensions: ['mp3', 'aac', 'wav', 'flac', 'm4a'] },
					{ name: 'All', extensions: ['*'] },
				],
			}
		)
		if (!fileNames) return false
		e.sender.send('customSoundRender', [arg, fileNames[0]])
	})

	//ハードウェアアクセラレーションの無効化
	ipc.on('ha', function (e, arg) {
		if (arg === 'true') {
			fs.writeFileSync(haPath, arg)
		} else {
			fs.unlink(haPath, () => true)
		}
		app.relaunch()
		app.exit()
	})
	ipc.on('webview', function (e, arg) {
		if (arg === 'true') {
			fs.writeFileSync(wvPath, arg)
		} else {
			fs.unlink(wvPath, () => true)
		}
		app.relaunch()
		app.exit()
	})
	//ユーザーエージェント
	ipc.on('ua', function (e, arg) {
		if (arg === '') {
			fs.unlink(uaPath, () => true)
		} else {
			fs.writeFileSync(uaPath, arg)
		}
		app.relaunch()
		app.exit()
	})
	//スクリーンリーダー
	ipc.on('acsCheck', function () {
		if (app.accessibilitySupportEnabled) {
			mainWindow.webContents.send('accessibility', 'true')
		}
	})
	ipc.on('quit', () => {
		app.quit()
	})
	ipc.on('about', () => {
		about()
	})
	ipc.on('openUrl', function (event, arg) {
		shell.openExternal(arg)
	})
	function about() {
		const ver = app.getVersion()
		const window = new BrowserWindow({
			webPreferences: {
				webviewTag: false,
				nodeIntegration: false,
				contextIsolation: true,
				spellcheck: false,
				sandbox: false,
				preload: join(__dirname, 'js', 'platform', 'preload.js'),
			},
			width: 300,
			height: 500,
			transparent: false, // ウィンドウの背景を透過
			frame: false, // 枠の無いウィンドウ
			resizable: false,
		})
		window.loadURL(dir + '/about.html?ver=' + ver)
		return 'true'
	}
	ipc.on('nano', function () {
		const nano_info_path = join(app.getPath('userData'), 'nano-window-position.json')
		let windowsPos
		try {
			windowsPos = JSON.parse(fs.readFileSync(nano_info_path, 'utf8'))
		} catch (e) {
			windowsPos = [0, 0] // デフォルトバリュー
		}
		const nanowindow = new BrowserWindow({
			webPreferences: {
				webviewTag: false,
				nodeIntegration: false,
				contextIsolation: true,
				sandbox: false,
				preload: join(dirname, 'js', 'platform', 'preload.js'),
			},
			width: 350,
			height: 140,
			transparent: false, // ウィンドウの背景を透過
			frame: false, // 枠の無いウィンドウ
			resizable: false,
		})
		nanowindow.loadURL(dir + '/nano.html')
		nanowindow.setAlwaysOnTop(true)
		//nanowindow.toggleDevTools()
		nanowindow.setPosition(windowsPos[0], windowsPos[1])
		nanowindow.on('close', function () {
			fs.writeFileSync(nano_info_path, JSON.stringify(nanowindow.getPosition()))
		})
		return true
	})
	let cbTimer1
	ipc.on('startmem', (e) => {
		const event = e.sender
		cbTimer1 = setInterval(mems, 1000)
		function mems() {
			const mem = os.totalmem() - os.freemem()
			if (mainWindow && event) {
				event.send('memory', [mem, os.cpus()[0].model, os.totalmem(), os.cpus().length, os.uptime()])
			}
		}
	})

	ipc.on('endmem', () => {
		if (cbTimer1) clearInterval(cbTimer1)
	})

	ipc.on('export', (e, args) => {
		fs.writeFileSync(args[0], JSON5.stringify(args[1]))
		e.sender.send('exportAllComplete', '')
	})
	//フォント
	ipc.on('fonts', (e) => {
		const fm = new SystemFonts()
		const fontList = fm.getFontsSync()
		e.sender.send('font-list', fontList)
	})
	//コピー
	ipc.on('copy', (e, arg) => {
		clipboard.writeText(arg)
	})
	ipc.on('copyBinary', (e, arg) => {
		const ni = nativeImage.createFromDataURL(arg)
		clipboard.writeImage(ni)
	})
	//ログ
	ipc.on('log', (e, arg) => {
		const today = new Date()
		const todayStr = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate()
		const log_path = join(longDirPath, todayStr + '.log')
		fs.appendFile(log_path, '\n' + arg, function (err) {
			if (err) {
				throw err
			}
		})
	})
	ipc.on('getLogs', (e) => {
		let logs = ''
		let todayLog = ''
		let yestLog = ''
		let yest2Log = ''
		fs.readdir(longDirPath, function (err, files) {
			if (err) throw err
			files.filter(function (file) {
				if (file === todayStr) todayLog = fs.readFileSync(join(longDirPath, file), 'utf8')
				if (file === yestStr) yestLog = logs + fs.readFileSync(join(longDirPath, file), 'utf8')
				if (file === yest2Str) yest2Log = fs.readFileSync(join(longDirPath, file), 'utf8')
				logs = todayLog + yestLog + yest2Log
			})
			logs = yest2Log + yestLog + todayLog
			e.sender.send('logData', logs)
		})
	})

	//起動時ログディレクトリ存在確認と作成、古ログ削除
	fs.access(longDirPath, fs.constants.R_OK | fs.constants.W_OK, (error) => {
		if (error) {
			if (error.code === 'ENOENT') {
				fs.mkdirSync(longDirPath)
			} else {
				return
			}
		} else {
			fs.readdir(longDirPath, function (err, files) {
				if (err) throw err
				files.filter(function (file) {
					if (file !== todayStr && file !== yestStr && file !== yest2Str) {
						fs.unlinkSync(join(longDirPath, file))
					}
				})
			})
		}
	})

	ipc.on('twitterLogin', (e, args) => {
		const window = new BrowserWindow({
			webPreferences: {
				webviewTag: false,
				nodeIntegration: false,
				contextIsolation: true,
				sandbox: false,
				preload: join(dirname, 'js', 'platform', 'preload.js'),
			},
			width: 414,
			height: 736,
		})
		const login = `https://mobile.twitter.com/login?hide_message=true&redirect_after_login=https%3A%2F%2Ftweetdeck.twitter.com%2F%3Fvia_twitter_login%3Dtrue`
		const logout = `https://mobile.twitter.com/logout?redirect_after_logout=https%3A%2F%2Ftweetdeck.twitter.com%2F`
		window.loadURL(args ? logout : login)
		window.webContents.on('did-navigate', () => {
			const url = window.webContents.getURL()
			if (url.match("https://tweetdeck.twitter.com")) {
				window.close()
				e.sender.send('twitterLoginComplete', '')
			}
		})
	})
}
