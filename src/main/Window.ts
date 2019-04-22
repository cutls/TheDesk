import { join } from 'path'

import {
    shell,
    BrowserWindow,
    BrowserWindowConstructorOptions,
    Event,
    Input,
    app,
} from 'electron'
import { register as shortcutRegister } from 'electron-localshortcut'

declare const __static: string;
const isDevelopment = process.env.NODE_ENV !== 'production'

export interface CreateWindowOptions {
    windowName: string
    loadPath: string
    windowOptions?: BrowserWindowConstructorOptions
    singleton?: boolean
    lastAction?: (win: BrowserWindow) => void
    openDevTools?: boolean
}

export default class Window {
    public static single: Map<string, BrowserWindow> = new Map()
    public static list: BrowserWindow[]

    public static Main() {
        const opts: CreateWindowOptions = {
            windowName: 'main',
            loadPath: 'index.html',
            windowOptions: {
                icon: join(__static, 'icon.png'),
                width: 800,
                height: 600,
                autoHideMenuBar: true,
            },
            singleton: true,
            lastAction: (win) => {
                shortcutRegister(win, 'F5', () => this.single.get('main')!.reload())
            },
            openDevTools: !process.env.IS_TEST
        }

        this.createWindow(opts)
    }

    public static About() {
        const opts: CreateWindowOptions = {
            windowName: 'about',
            loadPath: 'about.html',
            windowOptions: {
                width: 312,
                height: 496,
                resizable: false,
                minimizable: false,
                maximizable: false,
                fullscreenable: false,
                autoHideMenuBar: true,
                titleBarStyle: 'hiddenInset',
            },
            singleton: true,
            lastAction: (win) => {
                win.setMenuBarVisibility(false)
                win.webContents.on('before-input-event', (event: Event, input: Input) => {
                    this.single.get('about')!.webContents.setIgnoreMenuShortcuts((process.platform === 'darwin' ? input.meta : input.control) && input.key === "r")
                })
                shortcutRegister(win, 'Esc', () => this.single.get('about')!.destroy())
            },
            openDevTools: !process.env.IS_TEST
        }
        this.createWindow(opts)
    }

    public static async createWindow(options: CreateWindowOptions) {
        if (options.singleton && this.single.has(options.windowName)) {
            this.single.get(options.windowName)!.show()
            return
        }
        let win = new BrowserWindow(options.windowOptions)
        win.hide()
        win.webContents.on('did-finish-load', () => {
            win.show()
        })

        win.on('closed', () => {
            this.single.delete(options.windowName)
        })

        let openUrl = (event: Event, url: string) => {
            if (isDevelopment && url === process.env.WEBPACK_DEV_SERVER_URL + options.loadPath) {
                return
            }
            event.preventDefault()
            shell.openExternal(url, {
                activate: false
            }, (err) => {
                if (err) console.log(err)
            })
        }
        win.webContents.on('will-navigate', openUrl)
        win.webContents.on('new-window', openUrl)

        if (process.env.WEBPACK_DEV_SERVER_URL) {
            // `electron:serve`で起動した時の読み込み
            win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + options.loadPath)
        } else {
            // ビルドしたアプリでの読み込み
            win.loadURL(`app://./${options.loadPath}`)
        }

        if (isDevelopment && options.openDevTools) win.webContents.openDevTools()

        if (typeof options.lastAction === 'function') options.lastAction(win)

        this.single.set(options.windowName, win)
    }
}