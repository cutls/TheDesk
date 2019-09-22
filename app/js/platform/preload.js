var electron = require("electron");
const shell = electron.shell;
var ipc = electron.ipcRenderer;
onmessage = function (e) {
    if (e.data[0] == "openUrl") {
        urls = e.data[1].match(/https?:\/\/(.+)/);
        if (urls) {
            shell.openExternal(e.data[1]);
        }
    } else if (e.data[0] == "sendSinmpleIpc") {
        ipc.send(e.data[1], "")
    } else if (e.data[0] == "dialogStore") {
        ipc.send("dialogStore", e.data[1])
    } else if (e.data[0] == "bmpImage") {
        ipc.send('bmp-image', e.data[1]);
    } else if (e.data[0] == "dialogCW") {
        ipc.send("dialogCW", e.data[1])
    } else if (e.data[0] == "nativeNotf") {
        console.log(e.data[1])
        ipc.send('native-notf', e.data[1]);
    } else if (e.data[0] == "dialogClient") {
        ipc.send("dialogClient", e.data[1])
    } else if (e.data[0] == "generalDL") {
        ipc.send('general-dl', e.data[1]);
    } else if (e.data[0] == "openFinder") {
        ipc.send('open-finder', e.data[1]);
    } else if (e.data[0] == "columnDel") {
        ipc.send('column-del', e.data[1]);
    } else if (e.data[0] == "lang") {
        ipc.send('lang', e.data[1]);
    } else if (e.data[0] == "exportSettings") {
        ipc.send('exportSettings', e.data[1]);
    }  else if (e.data[0] == "exportSettingsCoreComplete") {
        ipc.send('export', e.data[1]);
    } else if (e.data[0] == "importSettings") {
        ipc.send('importSettings', e.data[1]);
    } else if (e.data[0] == "customSound") {
        ipc.send('customSound', e.data[1]);
    } else if (e.data[0] == "themeJsonDelete") {
        ipc.send('theme-json-delete', e.data[1]);
    } else if (e.data[0] == "themeJsonCreate") {
        ipc.send('theme-json-create', e.data[1]);
    } else if (e.data[0] == "themeJsonRequest") {
        ipc.send('theme-json-request', e.data[1]);
    } else if (e.data[0] == "ha") {
        ipc.send('ha', e.data[1]);
    } else if (e.data[0] == "aboutData") {
        ipc.send('aboutData', "");
    } else if (e.data[0] == "itunes") {
        console.log("NowPlaying")
        ipc.send("itunes", e.data[1])
    } else if (e.data[0] == "themeCSSRequest") {
        ipc.send('theme-css-request', e.data[1]);
    } else if (e.data[0] == "customCSSRequest") {
        ipc.send('custom-css-request', e.data[1]);
    } else if (e.data[0] == "downloadButton") {
        ipc.send('download-btn', e.data[1]);
    } else if (e.data[0] == "nano") {
        ipc.send('nano', null);
    } else if (e.data[0] == "asReadComp") {
        ipc.send('sendMarkersComplete', null);
    }
}
//version.js
ipc.send("getPlatform", "")
ipc.on('platform', function (event, args) {
    localStorage.setItem("platform", args[0])
    localStorage.setItem("bit", args[1])
    localStorage.setItem("about", JSON.stringify([args[2], args[3], args[4], args[5]]))
})

ipc.on('reload', function (event, arg) {
    location.reload();
})
//Native Notf
ipc.on('shownotf', function (event, args) {
    if (args["type"] == "toot") {
        postMessage(["details", [id, acct_id]], "*")
    } else if (args["type"] == "userdata") {
        postMessage(["udg", [user, acct_id]], "*")
    }
})

//first.js
ipc.on('custom-css-response', function (event, arg) {
    if (arg == "") { return false; }
    var styleNode = document.createElement("style");
    styleNode.setAttribute("type", "text/css")

    var content = document.createTextNode(arg)
    styleNode.append(content)
    document.getElementsByTagName("head")[0].append(styleNode)
})
ipc.on('theme-css-response', function (event, arg) {
    if (arg == "") { return false; }
    var styleNode = document.createElement("style");
    styleNode.setAttribute("type", "text/css")

    var content = document.createTextNode(arg)
    styleNode.append(content)
    document.getElementsByTagName("head")[0].append(styleNode)
})
//img.js
ipc.on('bmp-img-comp', function (event, b64) {
    postMessage(["media", [b64[0], "image/png", b64[1]]], "*")
});
//ui,img.js
ipc.on('general-dl-prog', function (event, arg) {
    console.log("Progress: " + arg);
})
ipc.on('general-dl-message', function (event, arg) {
    var argC = arg.replace(/\\/g, "\\\\") + "\\\\.";
    console.log("saved")
    postMessage(["toastSaved", [arg, argC]], "*")
})
//setting.js
ipc.on('langres', function (event, arg) {
    location.href = "../" + arg + "/setting.html"
});
ipc.on('exportSettingsFile', function (event, arg) {
    postMessage(["exportSettingsCore", arg], "*")
});
ipc.on('exportAllComplete', function (event, arg) {
    postMessage(["alert", "Complete"], "*")
});
ipc.on('config', function (event, arg) {
    postMessage(["importSettingsCore", arg], "*")
});
ipc.on('savefolder', function (event, arg) {
    localStorage.setItem("savefolder", arg);
});
ipc.on('font-list', function (event, arg) {
    postMessage(["fontList", arg], "*")
});
ipc.on('customSoundRender', function (event, args) {
    postMessage(["customSoundSave", [args[0], args[1]]], "*")
});
ipc.on('theme-json-list-response', function (event, args) {
    postMessage(["ctLoadCore", args], "*")
});
ipc.on('theme-json-delete-complete', function (event, args) {
    postMessage(["ctLoad", ""], "*")
});
ipc.on('theme-json-response', function (event, args) {
    postMessage(["customConnect", args], "*")
});
ipc.on('theme-json-create-complete', function (event, args) {
    postMessage(["clearCustomImport", ""], "*")
    postMessage(["ctLoad", ""], "*")
});
//spotify.js
ipc.on('itunes-np', function (event, arg) {
    postMessage(["npCore", arg], "*")
})
//tips.js
ipc.on('memory', function (event, arg) {
    var use = arg[0];
    var cpu = arg[1];
    var total = arg[2]
    postMessage(["renderMem", [use, cpu, total]], "*")
})
//update.html
ipc.on('prog', function (event, arg) {
    postMessage(["updateProg", arg], "*")
})
ipc.on('mess', function (event, arg) {
    postMessage(["updateMess", arg], "*")
})
ipc.on('asRead', function (event, arg) {
    postMessage(["asRead", ""], "*")
})
ipc.on('asReadEnd', function (event, arg) {
    postMessage(["asReadEnd", ""], "*")
})
var webviewDom = document.getElementById('webview');
if (webviewDom) {
    webviewDom.addEventListener('new-window', function (e) {
        shell.openExternal(e.url);
    });
}
