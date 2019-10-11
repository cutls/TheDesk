function np(mainWindow) {
    const electron = require("electron");
    const join = require('path').join;
    const app = electron.app;
    const fs = require("fs");
    var ipc = electron.ipcMain;
    ipc.on('itunes', async (e, args) => {
        //Verified on Windows
        console.log("Access");
        if (args[0] == "set") {
            
        } else {
            var platform = process.platform;
            var bit = process.arch;
            if (platform == "darwin") {
                try {
                    const nowplaying = require("itunes-nowplaying-mac");
                    const value = await nowplaying();

                    const artwork = await nowplaying.getThumbnailBuffer(value.databaseID);
                    console.log(artwork)
                    e.sender.webContents.send('itunes-np', value);
                } catch (error) {
                    // エラーを返す
                    console.error(error);
                    e.sender.webContents.send('itunes-np', error);
                }
            } else {
                
            }
        }

    });
}
exports.TheDeskNowPlaying = np;