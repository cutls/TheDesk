var electron = require("electron");
var ipc = electron.ipcRenderer;
onmessage = function (e) {
    if (e.data[0] == "openUrl") {
        shell.openExternal(e.data[1]);
    } else if (e.data[0] == "sendSinmpleIpc") {
        ipc.send(e.data[1], "")

    }
}
//version.js
ipc.send("getPlatform", "")
ipc.on('platform', function (event, arg) {
    localStorage.setItem("platform",arg)
})
ipc.on('winstore', function (event, arg) {
    localStorage.setItem("winstore",arg)
})

ipc.on('reload', function (event, arg) {
    location.reload();
})
ipc.on('mess', function (event, arg) {
    if (arg == "unzip") {
        if (lang == "ja") {
            $("body").text("アップデートを展開中です。");
        } else {
            $("body").text("Unzipping...");
        }

    }
})
//Native Notf
ipc.on('shownotf', function (event, args) {
    if (args["type"] == "toot") {
        details(id, acct_id)
    } else if (args["type"] == "userdata") {
        udg(user, acct_id)
    }
})
function nano() {
    ipc.send('nano', "");
}
/*
var webviewDom = document.getElementById('webview');
const {
    shell
} = require('electron');
webviewDom.addEventListener('new-window', function (e) {
    shell.openExternal(e.url);
});
*/