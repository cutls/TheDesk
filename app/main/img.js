function img(mainWindow, dir) {
    const electron = require("electron");
    const dialog = electron.dialog;
    const fs = require("fs");
    var Jimp = require("jimp");
    var ipc = electron.ipcMain;
    const BrowserWindow = electron.BrowserWindow;
    ipc.on('file-select', (e, args) => {

        dialog.showOpenDialog(null, {
            properties: ['openFile', 'multiSelections'],
            title: '添付ファイルを選択',
            defaultPath: '.',
            filters: [
                { name: 'メディアファイル', extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg', 'mp4', 'webm'] },
                { name: '画像', extensions: ['jpg', 'png', 'gif', 'bmp', 'jpeg'] },
                { name: '動画', extensions: ['mp4', 'webm'] },
                { name: '全てのファイル', extensions: ['*'] }
            ]
        }, (fileNames) => {
            if (!fileNames) {
                return false;
            }
            for (var i = 0; i < fileNames.length; i++) {
                var path = fileNames[i];
                var bin = fs.readFileSync(path, 'base64');
                e.sender.webContents.send('bmp-img-comp', [bin, 'new']);
            }
        });
    });
    ipc.on('bmp-image', (e, args) => {

        var m = args[0].match(/(.+)\\(.+)\.(.+)$/);
        Jimp.read(args[0], function (err, lenna) {
            if (err) throw err;
            lenna.getBase64(Jimp.MIME_PNG, function (err, src) {
                e.sender.webContents.send('bmp-img-comp', [src, args[1]]);
            });
        });

    });
}
exports.img = img;