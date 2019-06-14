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
        ipc.send('native-notf', e.data[1]);
    } else if (e.data[0] == "dialogClient") {
        ipc.send("dialogClient", e.data[1])
    }
}
//version.js
ipc.send("getPlatform", "")
ipc.on('platform', function (event, arg) {
    localStorage.setItem("platform", arg)
})
ipc.on('winstore', function (event, arg) {
    localStorage.setItem("winstore", arg)
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
    media(b64[0], "image/png", b64[1]);
});
//post.js
ipc.on('dialogCWRender', function (event, arg) {
    if (arg === 1) {
        $("#cw-text").show();
        $("#cw").addClass("yellow-text");
        $("#cw").addClass("cw-avail");
        $("#cw-text").val(plus);
        post("pass");
    } else if (arg === 2) {
        post("pass");
    }
});
//parse.js
ipc.on('dialogClientRender', function (event, arg) {
    if (arg === 1) {
        var cli = localStorage.getItem("client_emp");
        var obj = JSON.parse(cli);
        if (!obj) {
            var obj = [];
            obj.push(name);
            M.toast({ html: escapeHTML(name) + lang.lang_status_emphas, displayLength: 2000 })
        } else {
            var can;
            Object.keys(obj).forEach(function (key) {
                var cliT = obj[key];
                if (cliT != name && !can) {
                    can = false;
                } else {
                    can = true;
                    obj.splice(key, 1);
                    M.toast({ html: escapeHTML(name) + lang.lang_status_unemphas, displayLength: 2000 })
                }
            });
            if (!can) {
                obj.push(name);
                M.toast({ html: escapeHTML(name) + lang.lang_status_emphas, displayLength: 2000 })
            } else {

            }
        }
        var json = JSON.stringify(obj);
        localStorage.setItem("client_emp", json);
    } else if (arg === 2) {
        var cli = localStorage.getItem("client_mute");
        var obj = JSON.parse(cli);
        if (!obj) {
            obj = [];
        }
        obj.push(name);
        var json = JSON.stringify(obj);
        localStorage.setItem("client_mute", json);
        M.toast({ html: escapeHTML(name) + lang.lang_parse_mute, displayLength: 2000 })
    } else {
        return;
    }
    parseColumn();
});
/*
var webviewDom = document.getElementById('webview');
const {
    shell
} = require('electron');
webviewDom.addEventListener('new-window', function (e) {
    shell.openExternal(e.url);
});
*/