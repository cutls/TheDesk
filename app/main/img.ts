
import electron from 'electron'
import * as fs from 'fs'
import Jimp from 'jimp'
export default function img(mainWindow: electron.BrowserWindow, lang: string) {
	const dialog = electron.dialog
	const ipc = electron.ipcMain
	const ja = ['添付ファイルを選択', 'メディアファイル', '画像', '動画', '全てのファイル']
	const en = ['Attachment', 'Media', 'Pictures', 'Videos', 'All files']
	const dict = lang === 'ja' ? ja : en
	ipc.on('file-select', (e) => {
		const fileNames = dialog.showOpenDialogSync(mainWindow, {
			properties: ['openFile', 'multiSelections'],
			title: dict[0],
			defaultPath: '.',
			filters: [
				{
					name: dict[1],
					extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'mp4', 'webm'],
				},
				{ name: dict[2], extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg'] },
				{ name: dict[3], extensions: ['mp4', 'webm'] },
				{ name: dict[4], extensions: ['*'] },
			],
		})
		if (!fileNames) {
			return false
		}
		for (let i = 0; i < fileNames.length; i++) {
			const path = fileNames[i]
			const bin = fs.readFileSync(path, 'base64')
			e.sender.send('resizeJudgement', [bin, 'new'])
		}
	})
	ipc.on('bmp-image', (e, args) => {
		Jimp.read(args[0], function (err, lenna) {
			if (err) throw err
			lenna.getBase64(Jimp.MIME_PNG, function (err, src) {
				e.sender.send('bmp-img-comp', [src, args[1]])
			})
		})
	})
	ipc.on('resize-image', (e, args) => {
		const ext = args[0].toString().slice(args[0].indexOf('/') + 1, args[0].indexOf(';'))
		const use = ext === 'jpeg' ? 'MIME_JPEG' : 'MIME_PNG'
		const b64 = args[0].replace(/^data:\w+\/\w+;base64,/, '')
		const decodedFile = new Buffer(b64, 'base64')
		Jimp.read(decodedFile, function (err, lenna) {
			if (err) throw err
			lenna.scaleToFit(args[1], args[1]).getBase64(Jimp[use], function (err, src) {
				e.sender.send('bmp-img-comp', [src, args[1]])
			})
		})
	})
	ipc.on('stamp-image', (e, args) => {
		const text = args[1]
		const b64 = args[0].replace(/^data:\w+\/\w+;base64,/, '')
		const decodedFile = new Buffer(b64, 'base64')
		console.log(text)
		Jimp.read(decodedFile, function (err, image) {
			if (err) throw err
			Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then((font) => {
				const evWidth = Jimp.measureText(font, text)
				const width = image.bitmap.width
				const height = image.bitmap.height
				const left = width - evWidth - 10
				const top = height - 30
				const color = Jimp.intToRGBA(image.getPixelColor(left, top))
				console.log(left, top, color)
				const ave = (color.r + color.g + color.b) / 3
				if (ave > 128) {
					image.print(font, left, top, args[1]).getBase64(Jimp.MIME_PNG, function (err, src) {
						e.sender.send('bmp-img-comp', [src, args[1], true])
					})
				} else {
					Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then((font) => {
						image.print(font, left, top, args[1]).getBase64(Jimp.MIME_PNG, function (err, src) {
							e.sender.send('bmp-img-comp', [src, args[1], true])
						})
					})
				}
			})
		})
	})
}
