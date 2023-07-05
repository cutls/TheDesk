// Create the Application's main menu
import electron from 'electron'
import { join } from 'path'
import fs from 'fs'
import { about } from './system'
const { Menu, MenuItem, ipcMain, BrowserWindow, app } = electron
const debugPath = join(app.getPath('userData'), 'debug')
const isMac = process.platform === 'darwin'

export default function (lang: string, mainWindow: electron.BrowserWindow, packaged: boolean, dir: string, isDebug: boolean) {
    //フレーム
    if (lang !== 'ja' && lang !== 'en') {
        lang = 'en'
    }
    const dict = {
        'application': {
            'ja': 'アプリケーション',
            'en': 'Application'
        },
        'about': {
            'ja': 'TheDeskについて',
            'en': 'About TheDesk'
        },
        'quit': {
            'ja': '終了',
            'en': 'Quit'
        },
        'edit': {
            'ja': '編集',
            'en': 'Edit'
        },
        'undo': {
            'ja': '元に戻す',
            'en': 'Undo'
        },
        'redo': {
            'ja': 'やり直す',
            'en': 'Redo'
        },
        'cut': {
            'ja': '切り取り',
            'en': 'Cut'
        },
        'copy': {
            'ja': 'コピー',
            'en': 'Copy'
        },
        'paste': {
            'ja': '貼り付け',
            'en': 'Paste'
        },
        'selall': {
            'ja': 'すべて選択',
            'en': 'Select All'
        },
        'view': {
            'ja': '表示',
            'en': 'View'
        },
        'reload': {
            'ja': '再読み込み',
            'en': 'Reload'
        },
        'window': {
            'ja': 'ウィンドウ',
            'en': 'Window'
        },
        'minimun': {
            'ja': '最小化',
            'en': 'Minimarize'
        },
        'hide': {
            'ja': '隠す',
            'en': 'Hide'
        },
        'close': {
            'ja': '閉じる',
            'en': 'Close'
        }
    }
    let ifDev = [
        {
            label: 'Toggle Developer Tools',
            accelerator: 'Alt+Command+I',
            click: function () { mainWindow.webContents.toggleDevTools() }
        },
        {
            label: dict.reload[lang],
            accelerator: 'CmdOrCtrl+R',
            click: function () { mainWindow.reload() }
        }
    ]

    if (packaged) {
        ifDev = [
            {
                label: dict.reload[lang],
                accelerator: 'CmdOrCtrl+R',
                click: function () { mainWindow.reload() }
            }
        ]
    }
    const menu: Electron.MenuItemConstructorOptions[] = [{
        label: dict.application[lang],
        submenu: [
            {
                label: dict.about[lang], click: function () {
                    about(dir)
                }
            },
            { type: 'separator' },
            { label: 'Debug mode', click: function () {
                fs.writeFileSync(debugPath, (!isDebug).toString())
                mainWindow.webContents.toggleDevTools()
            }, type: 'checkbox', checked: isDebug },
            { label: dict.quit[lang], accelerator: 'Command+Q', click: function () { app.quit() } }

        ]
    }, {
        label: dict.edit[lang],
        submenu: [
            { label: dict.undo[lang], accelerator: 'CmdOrCtrl+Z', role: 'undo' },
            { label: dict.redo[lang], accelerator: 'Shift+CmdOrCtrl+Z', role: 'redo' },
            { type: 'separator' },
            { label: dict.cut[lang], accelerator: 'CmdOrCtrl+X', role: 'cut' },
            { label: dict.copy[lang], accelerator: 'CmdOrCtrl+C', role: 'copy' },
            { label: dict.paste[lang], accelerator: 'CmdOrCtrl+V', role: 'paste' },
            { label: dict.selall[lang], accelerator: 'CmdOrCtrl+A', role: 'selectAll' }
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
                label: dict.hide[lang],
                accelerator: 'Cmd+H',
                role: 'hide'
            },
            {
                label: dict.close[lang],
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
        ]
    }
    ]
    // コピペメニュー
    const ctxMenu = new Menu()
    ctxMenu.append(new MenuItem({
        label: dict.cut[lang],
        role: 'cut',
        click: () => true
    }))
    ctxMenu.append(new MenuItem({
        label: dict.copy[lang],
        role: 'copy',
        click: () => true
    }))
    ctxMenu.append(new MenuItem({
        label: dict.paste[lang],
        role: 'paste',
        click: () => true
    }))


    ipcMain.on('textareaContextMenu', function (e, params) {
        ctxMenu.popup({ window: mainWindow, x: params.x, y: params.y })
    })
    return menu
}