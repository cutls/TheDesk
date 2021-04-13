function system(mainWindow, dir, lang, dirname) {
	const electron = require('electron')
	const app = electron.app
	const join = require('path').join
	var Jimp = require('jimp')
	const fs = require('fs')
	var JSON5 = require('json5')
	var ipc = electron.ipcMain
	const clipboard = electron.clipboard
	var tmp_img = join(app.getPath('userData'), 'tmp.png')
	var ha_path = join(app.getPath('userData'), 'hardwareAcceleration')
	var wv_path = join(app.getPath('userData'), 'webview')
	var ua_path = join(app.getPath('userData'), 'useragent')
	var lang_path = join(app.getPath('userData'), 'language')
	var log_dir_path = join(app.getPath('userData'), 'logs')
	var frame_path = join(app.getPath('userData'), 'frame')
	//ログ
	var today = new Date()
	//今日のやつ
	var todayStr = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '.log'
	//昨日のやつ
	today.setDate(today.getDate() - 1)
	var yestStr = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '.log'
	//一昨日のやつ
	today.setDate(today.getDate() - 1)
	var yest2Str = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate() + '.log'

	const BrowserWindow = electron.BrowserWindow
	const dialog = electron.dialog
	const os = require('os')
	const language = require('../main/language.js')
	//プラットフォーム
	ipc.on('getPlatform', function (e, arg) {
		try {
			var gitHash = fs.readFileSync('git', 'utf8')
		} catch {
			var gitHash = null
		}
		e.sender.send('platform', [process.platform, process.arch, process.version, process.versions.chrome, process.versions.electron, gitHash])
	})
	//言語
	ipc.on('lang', function (e, arg) {
		console.log('set:' + arg)
		fs.writeFileSync(lang_path, arg)
		e.sender.send('langres', arg)
	})
	//エクスポートのダイアログ
	ipc.on('exportSettings', function (e, args) {
		let savedFiles = dialog.showSaveDialogSync(mainWindow, {
			title: 'Export',
			properties: ['openFile', 'createDirectory'],
			defaultPath: 'export.thedeskconfig.json5',
		})
		if (!savedFiles) {
			return false
		}
		e.sender.send('exportSettingsFile', savedFiles)
	})
	//インポートのダイアログ
	ipc.on('importSettings', function (e, args) {
		let fileNames = dialog.showOpenDialogSync(mainWindow, {
			title: 'Import',
			properties: ['openFile'],
			filters: [{ name: 'TheDesk Config', extensions: ['thedeskconfig', 'thedeskconfigv2', 'json5'] }],
		})
		console.log('imported from: ', fileNames)
		if (!fileNames) {
			return false
		}
		e.sender.send('config', JSON5.parse(fs.readFileSync(fileNames[0], 'utf8')))
	})
	//保存フォルダのダイアログ
	ipc.on('savefolder', function (e, args) {
		let fileNames = dialog.showOpenDialogSync(
			mainWindow,
			{
				title: 'Save folder',
				properties: ['openDirectory'],
			}
		)
		e.sender.send('savefolder', fileNames[0])
	})
	//カスタムサウンドのダイアログ
	ipc.on('customSound', function (e, arg) {
		let fileNames = dialog.showOpenDialogSync(
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
		e.sender.send('customSoundRender', [arg, fileNames[0]])
	})

	//ハードウェアアクセラレーションの無効化
	ipc.on('ha', function (e, arg) {
		if (arg == 'true') {
			fs.writeFileSync(ha_path, arg)
		} else {
			fs.unlink(ha_path, function (err) { })
		}
		app.relaunch()
		app.exit()
	})
	ipc.on('webview', function (e, arg) {
		if (arg == 'true') {
			fs.writeFileSync(wv_path, arg)
		} else {
			fs.unlink(wv_path, function (err) { })
		}
		app.relaunch()
		app.exit()
	})
	//ユーザーエージェント
	ipc.on('ua', function (e, arg) {
		if (arg == '') {
			fs.unlink(ua_path, function (err) { })
		} else {
			fs.writeFileSync(ua_path, arg)
		}
		app.relaunch()
		app.exit()
	})
	//フレームのありなし
	ipc.on('frameSet', function (e, arg) {
		fs.writeFileSync(frame_path, arg)
		app.relaunch()
		app.exit()
	})
	//スクリーンリーダー
	ipc.on('acsCheck', function (e, arg) {
		if (app.accessibilitySupportEnabled) {
			mainWindow.send('accessibility', 'true')
		}
	})
	ipc.on('quit', (e, args) => {
		app.quit()
	})
	ipc.on('about', (e, args) => {
		about()
	})
	function about() {
		var ver = app.getVersion()
		var window = new BrowserWindow({
			webPreferences: {
				webviewTag: false,
				nodeIntegration: false,
				contextIsolation: true,
				preload: join(dirname, 'js', 'platform', 'preload.js'),
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
	ipc.on('nano', function (e, x, y) {
		var nano_info_path = join(app.getPath('userData'), 'nano-window-position.json')
		var window_pos
		try {
			window_pos = JSON.parse(fs.readFileSync(nano_info_path, 'utf8'))
		} catch (e) {
			window_pos = [0, 0] // デフォルトバリュー
		}
		var nanowindow = new BrowserWindow({
			webPreferences: {
				webviewTag: false,
				nodeIntegration: false,
				contextIsolation: true,
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
		nanowindow.setPosition(window_pos[0], window_pos[1])
		nanowindow.on('close', function () {
			fs.writeFileSync(nano_info_path, JSON.stringify(nanowindow.getPosition()))
		})
		return true
	})
	var cbTimer1
	ipc.on('startmem', (e, arg) => {
		event = e.sender
		cbTimer1 = setInterval(mems, 1000)
	})
	function mems() {
		var mem = os.totalmem() - os.freemem()
		if (mainWindow && event) {
			event.send('memory', [mem, os.cpus()[0].model, os.totalmem(), os.cpus().length, os.uptime()])
		}
	}
	ipc.on('endmem', (e, arg) => {
		if (cbTimer1) {
			clearInterval(cbTimer1)
		}
	})

	ipc.on('export', (e, args) => {
		fs.writeFileSync(args[0], JSON5.stringify(args[1]))
		e.sender.send('exportAllComplete', '')
	})
	//フォント
	function object_array_sort(data, key, order, fn) {
		//デフォは降順(DESC)
		var num_a = -1
		var num_b = 1

		if (order === 'asc') {
			//指定があれば昇順(ASC)
			num_a = 1
			num_b = -1
		}

		data = data.sort(function (a, b) {
			var x = a[key]
			var y = b[key]
			if (x > y) return num_a
			if (x < y) return num_b
			return 0
		})

		//重複排除
		var arrObj = {}
		for (var i = 0; i < data.length; i++) {
			arrObj[data[i]['family']] = data[i]
		}

		data = []
		for (var key in arrObj) {
			data.push(arrObj[key])
		}

		fn(data) // ソート後の配列を返す
	}
	ipc.on('fonts', (e, arg) => {
		var SystemFonts = require('system-font-families').default
		var fm = new SystemFonts()
		const fontList = fm.getFontsSync()
		e.sender.send('font-list', fontList)
	})
	//コピー
	ipc.on('copy', (e, arg) => {
		clipboard.writeText(arg)
	})
	//ログ
	ipc.on('log', (e, arg) => {
		var today = new Date()
		var todayStr = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate()
		var log_path = join(log_dir_path, todayStr + '.log')
		fs.appendFile(log_path, '\n' + arg, function (err) {
			if (err) {
				throw err
			}
		})
	})
	ipc.on('getLogs', (e, arg) => {
		var logs = ''
		var todayLog = ''
		var yestLog = ''
		var yest2Log = ''
		fs.readdir(log_dir_path, function (err, files) {
			if (err) throw err
			files.filter(function (file) {
				if (file == todayStr) {
					todayLog = fs.readFileSync(join(log_dir_path, file), 'utf8')
				}
				if (file == yestStr) {
					yestLog = logs + fs.readFileSync(join(log_dir_path, file), 'utf8')
				}
				if (file == yest2Str) {
					yest2Log = fs.readFileSync(join(log_dir_path, file), 'utf8')
				}
				logs = todayLog + yestLog + yest2Log
			})
			logs = yest2Log + yestLog + todayLog
			e.sender.send('logData', logs)
		})
	})

	//起動時ログディレクトリ存在確認と作成、古ログ削除
	fs.access(log_dir_path, fs.constants.R_OK | fs.constants.W_OK, (error) => {
		if (error) {
			if (error.code === 'ENOENT') {
				fs.mkdirSync(log_dir_path)
			} else {
				return
			}
		} else {
			fs.readdir(log_dir_path, function (err, files) {
				if (err) throw err
				files.filter(function (file) {
					if (file != todayStr && file != yestStr && file != yest2Str) {
						fs.unlinkSync(join(log_dir_path, file))
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
exports.system = system
