const { execSync } = require('child_process')
const { join } = require('path')
function np(mainWindow) {
	var platform = process.platform
	if (platform !== 'darwin') return false
	const electron = require('electron')
	const ipc = electron.ipcMain
	ipc.on('itunes', async (e, args) => {
		console.log('Access')
		if (args == 'anynp') {
			const dir = join(__dirname, "..", "main", "script", "macOSNP.scpt").replace("app.asar","app.asar.unpacked")

			const stdout = execSync(`osascript ${dir}`).toString()
			const title = stdout.substring(0, stdout.length - 100).match(/"(.+)?"/)[1].replace('\"','"')
			const ret = {
				title: title,
				anynp: true
			}
			e.sender.webContents.send('itunes-np', ret)
		} else {
			
				try {
					const nowplaying = require('itunes-nowplaying-mac')
					let value = await nowplaying()
					try {
						const artwork = await nowplaying.getThumbnailBuffer(value.databaseID)
						if(artwork) {
							const base64 = artwork.toString('base64')
							value.artwork = base64
							e.sender.webContents.send('itunes-np', value)
						}
					} catch (error) {
						console.error(error)
						e.sender.webContents.send('itunes-np', value)
					}
					
				} catch (error) {
					console.error(error)
					e.sender.webContents.send('itunes-np', error)
				}
		}
    })
    
}
exports.TheDeskNowPlaying = np
