import { execSync } from 'child_process'
import { join } from 'path'
import nowplaying, * as np from 'itunes-nowplaying-mac'
import electron from 'electron'
type PromiseType<T extends Promise<any>> = T extends Promise<infer P> ? P : never
type INpFunc = ReturnType<typeof nowplaying>
type INp = PromiseType<INpFunc>
type INpWithArtwork = INp & { artwork?: string }

export default function () {
	const platform = process.platform
	if (platform !== 'darwin') return false
	const ipc = electron.ipcMain
	ipc.on('itunes', async (e, args) => {
		console.log('Access')
		if (args === 'anynp') {
			const dir = join(__dirname, "..", "main", "script", "macOSNP.scpt").replace("app.asar","app.asar.unpacked")

			const stdout = execSync(`osascript ${dir}`).toString()
			const m = stdout.substring(0, stdout.length - 100).match(/"(.+)?"/)
			const title = m ? m[1].replace('\\"','"') : ''
			const ret = {
				title: title,
				anynp: true
			}
			e.sender.send('itunes-np', ret)
		} else {
				try {
					const valueRaw = await nowplaying()
					if (!valueRaw) throw 'Error'
					const value: INpWithArtwork = valueRaw
					try {
						const artwork = await np.getThumbnailBuffer(value.databaseID)
						if(artwork) {
							const base64 = artwork.toString('base64')
							value.artwork = base64
							e.sender.send('itunes-np', value)
						}
					} catch (error) {
						console.error(error)
						e.sender.send('itunes-np', value)
					}
					
				} catch (error) {
					console.error(error)
					e.sender.send('itunes-np', error)
				}
		}
    })
    
}
