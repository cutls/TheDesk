function np(mainWindow) {
	const electron = require('electron')
	const join = require('path').join
	const app = electron.app
    const fs = require('fs')
    const fpath = join(app.getPath('userData'), 'npexec')
    const npExec = fs.readFileSync(fpath, 'utf8')
	const ipc = electron.ipcMain

	const { exec } = require('child_process')
	ipc.on('itunes', async (e, args) => {
		console.log('Access')
		if (args[0] == 'set') {
		} else {
			var platform = process.platform
			var bit = process.arch
			if (platform == 'darwin') {
				try {
					const nowplaying = require('itunes-nowplaying-mac')
					let value = await nowplaying()
                    if(!value && npExec) {
                        exec(npExec, (error, stdout, stderr) => {
                            e.sender.webContents.send('itunes-np', stdout)
                        })
                    } else {
                        const artwork = await nowplaying.getThumbnailBuffer(value.databaseID)
					    const base64 = artwork.toString('base64')
					    value.artwork = base64
                        e.sender.webContents.send('itunes-np', value)
                    }
				} catch (error) {
					// エラーを返す
					console.error(error)
					e.sender.webContents.send('itunes-np', error)
				}
			} else {
			}
		}
    })
    
}
exports.TheDeskNowPlaying = np
