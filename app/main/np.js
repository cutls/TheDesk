function np(mainWindow){
    const electron = require("electron");
    const join = require('path').join;
    const app = electron.app;
    const fs = require("fs");
    var ipc = electron.ipcMain;
    ipc.on('itunes', (e, args) => {
        //Verified on Windows
        console.log("Access");
        if(args[0]=="set"){
            var {NowPlaying,PlayerName} = require("nowplaying-node");
            var nppath=join(app.getPath("userData"), "nowplaying");
            var npProvider;
            try {
                npProvider = args[1];
            } catch (e) {
                npProvider="AIMP";
            }
            var myAIMP = new NowPlaying({
                fetchCover: true,
                player: PlayerName[npProvider],
            });
            fs.writeFileSync(nppath, npProvider);
        }else{
            var platform=process.platform;
            var bit=process.arch;
            if(platform=="darwin"){
            const nowplaying = require("itunes-nowplaying-mac")
            nowplaying.getRawData().then(function (value) {
                mainWindow.webContents.send('itunes-np', value);
            }).catch(function (error) {
                // 非同期処理失敗。呼ばれない
                console.log(error);
            });
            }else{
                var {NowPlaying,PlayerName} = require("nowplaying-node");
                var nppath=join(app.getPath("userData"), "nowplaying");
                var npProvider;
                try {
                    npProvider = fs.readFileSync(nppath, 'utf8');
                } catch (e) {
                    npProvider="AIMP";
                }
                var myAIMP = new NowPlaying({
                    fetchCover: true,
                    player: PlayerName[npProvider],
                });
                myAIMP.update();
                var path=myAIMP.getCoverPath();
                if(path){
                    var bin = fs.readFileSync(path, 'base64');
                }else{
                    var bin=false;
                }
                
                var value={
                    win:true,
                    name:myAIMP.getTitle(),
                    artist:myAIMP.getArtist(),
                    album:myAIMP.getAlbum(),
                    path:bin
                }
                mainWindow.webContents.send('itunes-np', value);
            }
            }
        
    });
}
exports.TheDeskNowPlaying = np;