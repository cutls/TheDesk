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
        ipc.send('ha', had);
    } else if (e.data[0] == "itunes") {
        if (ipc.listenerCount('itunes-np') > 0) {
            return false;
        } else {
            ipc.send("itunes", e.data[1])
        }
    } else if (e.data[0] == "themeCSSRequest") {
        ipc.send('theme-css-request', e.data[1]);
    } else if (e.data[0] == "downloadButton") {
        ipc.send('download-btn', e.data[1]);
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
//ui,img.js
ipc.on('general-dl-prog', function (event, arg) {
    console.log("Progress: " + arg);
})
ipc.on('general-dl-message', function (event, arg) {
    var argC = arg.replace(/\\/g, "\\\\") + "\\\\.";
    M.toast({ html: lang.lang_img_DLDone + arg + '<button class="btn-flat toast-action" onclick="openFinder(\'' + argC + '\')">Show</button>', displayLength: 5000 })
})
//layout.js
ipc.on('column-del-reply', function (event, args) {
    if (args[0] === 1) {
        localStorage.removeItem("card_" + args[1]);
        obj.splice(args[1], 1);
        for (var i = 0; i < obj.length; i++) {
            localStorage.setItem("card_" + i, "true");
            localStorage.removeItem("catch_" + i);
        }
        var json = JSON.stringify(obj);
        localStorage.setItem("column", json);
        parseColumn();
        sortload()
    }
})
//setting.js
ipc.on('langres', function (event, arg) {
    location.href = "../" + lang + "/setting.html"
});
ipc.on('exportSettingsFile', function (event, savedFiles) {
    var exp = exportSettingsCore()
    ipc.send('export', [savedFiles, JSON.stringify(exp)]);
    alert("Done.")
    //cards
    //lang
});
ipc.on('config', function (event, arg) {
    importSettingsCore(arg)
});
ipc.on('savefolder', function (event, arg) {
    localStorage.setItem("savefolder", arg);
});
ipc.on('font-list', function (event, arg) {
    fontList(arg)
});
ipc.on('customSoundRender', function (event, args) {
    customSoundSave(args[0], args[1])
});
ipc.on('theme-json-list-response', function (event, args) {
    ctLoadCore(args)
});
ipc.on('theme-json-delete-complete', function (event, args) {
    ctLoad()
});
ipc.on('theme-json-response', function (event, args) {
    customConnect(args)
});
ipc.on('theme-json-create-complete', function (event, args) {
    clearCustomImport()
    ctLoad()
});
//spotify.js
ipc.once('itunes-np', function (event, arg) {
    npCore(arg)
})
//tips.js
ipc.on('memory', function (event, arg) {
    var use = arg[0];
    var cpu = arg[1];
    var total = arg[2]
    renderMem(use, cpu, total)
})
//update.html
ipc.on('prog', function (event, arg) {
    updateProg(arg)
})
ipc.on('mess', function (event, arg) {
    updateMess(arg)
})
//about.html
ipc.on('aboutData', function (event, arg) {
    renderAbout(arg)
})
var webviewDom = document.getElementById('webview');
if(webviewDom){
    webviewDom.addEventListener('new-window', function (e) {
        shell.openExternal(e.url);
    });
}
