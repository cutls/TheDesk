import electron from 'electron'
import * as fs from 'fs'
import { download } from 'electron-dl'
import { join } from 'path'
export default function dl(mainWindow: electron.BrowserWindow, lang_path: string, base: string, dirname: string) {
	const shell = electron.shell
	const BrowserWindow = electron.BrowserWindow
	const dialog = electron.dialog
	let updatewin: electron.BrowserWindow | null = null
	const ipc = electron.ipcMain
	const app = electron.app
	ipc.on('update', function () {
		const platform = process.platform
		if (platform !== 'win32' && platform !== 'linux' && platform !== 'darwin') {
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
			const lang = fs.readFileSync(lang_path, 'utf8')
			//updatewin.toggleDevTools()
			updatewin.loadURL(base + lang + '/update.html')
			updatewin.webContents.once('dom-ready', () => {
				if (updatewin) updatewin.show()
			})
			return 'true'
		} else {
			return false
		}
	})
	//アプデDL
	ipc.on('download-btn', async (e, args) => {
		function dl(url, file, dir, e) {
			e.sender.send('mess', 'Start...')
			const opts = {
				directory: dir,
				filename: file,
				openFolderWhenDone: true,
				onProgress: function (event) {
					e.sender.send('prog', [event, args[2]])
				},
				saveAs: false
			}
			if (!updatewin) return
			download(updatewin, url, opts)
				.then(() => {
					e.sender.send('mess', 'ダウンロードが完了しました。')
					app.quit()
				})
				.catch(console.error)
		}
		const platform = process.platform
		const options = {
			title: 'Save',
			defaultPath: app.getPath('home') + '/' + args[1]
		}
		if (!updatewin) return
		const file = await dialog.showSaveDialog(updatewin, options)
		const savedFiles = file.filePath
		console.log(savedFiles)
		if (!savedFiles) {
			return false
		}
		const m = platform === 'win32' ? savedFiles.match(/(.+)\\(.+)$/) : savedFiles.match(/(.+)\/(.+)$/)
		if (!m) return
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
		} catch (err: any) {
			if (err.code === 'ENOENT') return false
		}
	}

	ipc.on('general-dl', (event, args) => {
		const name = ''
		const platform = process.platform
		const filename = args[0].match(/https:\/\/.+\/(.+\..+)$/)
		let dir = args[1]
		if (args[1] === '') {
			if (platform === 'win32') {
				dir = app.getPath('home') + '\\Pictures\\TheDesk'
			} else if (platform === 'linux' || platform === 'darwin') {
				dir = app.getPath('home') + '/Pictures/TheDesk'
			}
		}
		const opts = {
			directory: dir,
			filename: name,
			openFolderWhenDone: false,
			onProgress: function (e) {
				event.sender.send('general-dl-prog', e)
			},
			saveAs: false
		}
		const w = BrowserWindow.getFocusedWindow()
		if (!w) return
		download(w, args[0], opts)
			.then(() => {
				let name = dir
				if (filename[1]) {
					if (platform === 'win32') {
						name = dir + '\\' + filename[1]
					} else if (platform === 'linux' || platform === 'darwin') {
						name = dir + '/' + filename[1]
					}
				}
				event.sender.send('general-dl-message', name)
			})
			.catch(console.error)
	})
	ipc.on('openFinder', (e, folder) => {
		console.log(folder)
		shell.showItemInFolder(folder)
	})
}
