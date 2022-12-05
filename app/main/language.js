// Create the Application's main menu
function templete(lang, mainWindow, packaged, dir, dirname) {
    //フレーム
    if (lang != "ja" && lang != "en") {
        lang = "en"
    }
    const electron = require("electron")
    const { Menu, MenuItem, ipcMain, BrowserWindow, app } = electron
    const join = require('path').join;
    const dict = {
        "application": {
            "ja": "アプリケーション",
            "en": "Application"
        },
        "about": {
            "ja": "TheDeskについて",
            "en": "About TheDesk"
        },
        "quit": {
            "ja": "終了",
            "en": "Quit"
        },
        "edit": {
            "ja": "編集",
            "en": "Edit"
        },
        "undo": {
            "ja": "元に戻す",
            "en": "Undo"
        },
        "redo": {
            "ja": "やり直す",
            "en": "Redo"
        },
        "cut": {
            "ja": "切り取り",
            "en": "Cut"
        },
        "copy": {
            "ja": "コピー",
            "en": "Copy"
        },
        "paste": {
            "ja": "貼り付け",
            "en": "Paste"
        },
        "selall": {
            "ja": "すべて選択",
            "en": "Select All"
        },
        "view": {
            "ja": "表示",
            "en": "View"
        },
        "reload": {
            "ja": "再読み込み",
            "en": "Reload"
        },
        "window": {
            "ja": "ウィンドウ",
            "en": "Window"
        },
        "minimun": {
            "ja": "最小化",
            "en": "Minimarize"
        },
        "close": {
            "ja": "閉じる",
            "en": "Close"
        }
    }
    if (packaged) {
        var ifDev = [
            {
                label: dict.reload[lang],
                accelerator: 'CmdOrCtrl+R',
                click: function () { mainWindow.reload(); }
            }
        ]
    } else {
        var ifDev = [
            {
                label: 'Toggle Developer Tools',
                accelerator: 'Alt+Command+I',
                click: function () { mainWindow.toggleDevTools(); }
            },
            {
                label: dict.reload[lang],
                accelerator: 'CmdOrCtrl+R',
                click: function () { mainWindow.reload(); }
            }
        ]
    }
    const menu = [{
        label: dict.application[lang],
        submenu: [
            {
                label: dict.about[lang], click: function () {
                    var ver = app.getVersion()
                    var window = new BrowserWindow({
                        webPreferences: {
                            webviewTag: false,
                            nodeIntegration: false,
                            contextIsolation: true,
                            preload: join(dirname, "js", "platform", "preload.js")
                        },
                        width: 300, height: 500,
                        "transparent": false,    // ウィンドウの背景を透過
                        "frame": false,     // 枠の無いウィンドウ
                        "resizable": false
                    });
                    window.loadURL(dir + '/about.html?ver=' + ver);
                }
            },
            { type: "separator" },
            { label: dict.quit[lang], accelerator: "Command+Q", click: function () { app.quit(); } }

        ]
    }, {
        label: dict.edit[lang],
        submenu: [
            { label: dict.undo[lang], accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: dict.redo[lang], accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: dict.cut[lang], accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: dict.copy[lang], accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: dict.paste[lang], accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: dict.selall[lang], accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]
    }, {
        label: dict.view[lang],
        submenu: ifDev
    },
    {
        label: dict.window[lang],
        role: 'window',
        submenu: [
            {
                label: dict.minimun[lang],
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: dict.close[lang],
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
        ]
    }
    ];
    // コピペメニュー
    const ctxMenu = new Menu()
    ctxMenu.append(new MenuItem({
        label: dict.cut[lang],
        role: 'cut',
        click: () => { console.log('Cut clicked!') }
    }))
    ctxMenu.append(new MenuItem({
        label: dict.copy[lang],
        role: 'copy',
        click: () => { console.log('Copy clicked!') }
    }))
    ctxMenu.append(new MenuItem({
        label: dict.paste[lang],
        role: 'paste',
        click: () => { console.log('Paste clicked!') }
    }))


    ipcMain.on('textareaContextMenu', function (e, params) {
        ctxMenu.popup(mainWindow, params.x, params.y)
    })
    return menu;
}

exports.template = templete;