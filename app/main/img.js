function img(mainWindow, dir) {
	const electron = require('electron')
	const dialog = electron.dialog
	const fs = require('fs')
	var Jimp = require('jimp')
	var ipc = electron.ipcMain
	const BrowserWindow = electron.BrowserWindow
	ipc.on('file-select', (e, args) => {
		let fileNames = dialog.showOpenDialogSync(mainWindow, {
			properties: ['openFile', 'multiSelections'],
			title: '添付ファイルを選択',
			defaultPath: '.',
			filters: [
				{
					name: 'メディアファイル',
					extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'mp4', 'webm'],
				},
				{ name: '画像', extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg'] },
				{ name: '動画', extensions: ['mp4', 'webm'] },
				{ name: '全てのファイル', extensions: ['*'] },
			],
		})
		if (!fileNames) {
			return false
		}
		for (var i = 0; i < fileNames.length; i++) {
			var path = fileNames[i]
			var bin = fs.readFileSync(path, 'base64')
			e.sender.webContents.send('resizeJudgement', [bin, 'new'])
		}
	})
	ipc.on('bmp-image', (e, args) => {
		Jimp.read(args[0], function (err, lenna) {
			if (err) throw err
			lenna.getBase64(Jimp.MIME_PNG, function (err, src) {
				e.sender.webContents.send('bmp-img-comp', [src, args[1]])
			})
		})
	})
	ipc.on('resize-image', (e, args) => {
		var ext = args[0].toString().slice(args[0].indexOf('/') + 1, args[0].indexOf(';'))
		if (ext == 'jpeg') {
			var use = 'MIME_JPEG'
		} else {
			var use = 'MIME_PNG'
		}
		var b64 = args[0].replace(/^data:\w+\/\w+;base64,/, '')
		var decodedFile = new Buffer(b64, 'base64')
		Jimp.read(decodedFile, function (err, lenna) {
			if (err) throw err
			lenna.scaleToFit(args[1], args[1]).getBase64(Jimp[use], function (err, src) {
				e.sender.webContents.send('bmp-img-comp', [src, args[1]])
			})
		})
	})
	ipc.on('stamp-image', (e, args) => {
		var text = args[1]
		var b64 = args[0].replace(/^data:\w+\/\w+;base64,/, '')
		var decodedFile = new Buffer(b64, 'base64')
		console.log(text)
		Jimp.read(decodedFile, function (err, image) {
			if (err) throw err
			Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then((font) => {
				var evWidth = Jimp.measureText(font, text)
				var width = image.bitmap.width
				var height = image.bitmap.height
				var left = width - evWidth - 10
				var top = height - 30
				var color = Jimp.intToRGBA(image.getPixelColor(left, top))
				console.log(left, top, color)
				var ave = (color.r + color.g + color.b) / 3
				if (ave > 128) {
					image.print(font, left, top, args[1]).getBase64(Jimp.MIME_PNG, function (err, src) {
						e.sender.webContents.send('bmp-img-comp', [src, args[1], true])
					})
				} else {
					Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then((font) => {
						image.print(font, left, top, args[1]).getBase64(Jimp.MIME_PNG, function (err, src) {
							e.sender.webContents.send('bmp-img-comp', [src, args[1], true])
						})
					})
				}
			})
		})
	})
}
exports.img = img
