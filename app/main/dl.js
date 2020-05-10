function dl(mainWindow, lang_path, base, dirname) {
	const electron = require('electron')
	const shell = electron.shell
	const fs = require('fs')
	const { download } = require('electron-dl')
	const BrowserWindow = electron.BrowserWindow
	const dialog = electron.dialog
	var updatewin = null
	var ipc = electron.ipcMain
	const app = electron.app
	const join = require('path').join
	ipc.on('update', function(e, x, y) {
		var platform = process.platform
		var bit = process.arch
		if (platform != 'others') {
			updatewin = new BrowserWindow({
				webPreferences: {
					webviewTag: false,
					nodeIntegration: false,
					contextIsolation: true,
					preload: join(dirname, 'js', 'platform', 'preload.js')
				},
				width: 600,
				height: 400,
				transparent: false, // ウィンドウの背景を透過
				frame: false, // 枠の無いウィンドウ
				resizable: false,
				show: false
			})
			var lang = fs.readFileSync(lang_path, 'utf8')
			updatewin.loadURL(base + lang + '/update.html')
			updatewin.webContents.once('dom-ready', () => {
				updatewin.show()
			 })
			return 'true'
		} else {
			return false
		}
	})
	//アプデDL
	ipc.on('download-btn', async (e, args) => {
		function dl(url, file, dir, e) {
			e.sender.webContents.send('mess', 'Start...')
			const opts = {
				directory: dir,
				filename: file,
				openFolderWhenDone: true,
				onProgress: function(event) {
					e.sender.webContents.send('prog', [event, args[2]])
				},
				saveAs: false
			}
			download(updatewin, url, opts)
				.then(dl => {
					e.sender.webContents.send('mess', 'ダウンロードが完了しました。')
					app.quit()
				})
				.catch(console.error)
		}
		var platform = process.platform
		var bit = process.arch
		var options = {
			title: 'Save',
			defaultPath: app.getPath('home') + '/' + args[1]
		}
		const file = await dialog.showSaveDialog(null, options)
		const savedFiles = file.filePath
		console.log(savedFiles)
		if (!savedFiles) {
			return false
		}
		if (platform == 'win32') {
			var m = savedFiles.match(/(.+)\\(.+)$/)
		} else {
			var m = savedFiles.match(/(.+)\/(.+)$/)
		}
		//console.log(m);
		if (isExistFile(savedFiles)) {
			fs.unlinkSync(savedFiles)
		}
		console.log(m)
		dl(args[0], m[2], m[1], e)
	})

	function isExistFile(file) {
		try {
			fs.statSync(file)
			return true
		} catch (err) {
			if (err.code === 'ENOENT') return false
		}
	}

	ipc.on('general-dl', (event, args) => {
		var name = ''
		var platform = process.platform
		var bit = process.arch
		if (args[1] == '') {
			if (platform == 'win32') {
				var dir = app.getPath('home') + '\\Pictures\\TheDesk'
			} else if (platform == 'linux' || platform == 'darwin') {
				var dir = app.getPath('home') + '/Pictures/TheDesk'
			}
		} else {
			var dir = args[1]
		}
		const opts = {
			directory: dir,
			filename: name,
			openFolderWhenDone: false,
			onProgress: function(e) {
				event.sender.webContents.send('general-dl-prog', e)
			},
			saveAs: false
		}
		download(BrowserWindow.getFocusedWindow(), args[0], opts)
			.then(dl => {
				event.sender.webContents.send('general-dl-message', dir)
			})
			.catch(console.error)
	})
	ipc.on('open-finder', (e, folder) => {
		shell.showItemInFolder(folder)
	})
}
exports.dl = dl
