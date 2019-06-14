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
            var { NowPlaying, PlayerName } = require("nowplaying-node");
            var nppath = join(app.getPath("userData"), "nowplaying");
            var npProvider;
            try {
                npProvider = args[1];
            } catch (e) {
                npProvider = "AIMP";
            }
            var myAIMP = new NowPlaying({
                fetchCover: true,
                player: PlayerName[npProvider],
            });
            fs.writeFileSync(nppath, npProvider);
        } else {
            var platform = process.platform;
            var bit = process.arch;
            if (platform == "darwin") {
                try {
                    const nowplaying = require("itunes-nowplaying-mac");
                    const value = await nowplaying.getRawData();
                    e.sender.webContents.send('itunes-np', value);
                } catch (error) {
                    // エラーを返す
                    console.error(error);
                    e.sender.webContents.send('itunes-np', error);
                }
            } else {
                var { NowPlaying, PlayerName } = require("nowplaying-node");
                var nppath = join(app.getPath("userData"), "nowplaying");
                var npProvider;
                try {
                    npProvider = fs.readFileSync(nppath, 'utf8');
                } catch (e) {
                    npProvider = "AIMP";
                }
                var myAIMP = new NowPlaying({
                    fetchCover: true,
                    player: PlayerName[npProvider],
                });
                myAIMP.update();
                var path = myAIMP.getCoverPath();
                if (path) {
                    var bin = fs.readFileSync(path, 'base64');
                } else {
                    var bin = false;
                }

                var value = {
                    win: true,
                    name: myAIMP.getTitle(),
                    artist: myAIMP.getArtist(),
                    album: myAIMP.getAlbum(),
                    path: bin
                }
                e.sender.webContents.send('itunes-np', value);
            }
        }

    });
}
exports.TheDeskNowPlaying = np;