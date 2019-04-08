'use strict'

import * as path from 'path'
import { pick } from 'lodash'
import {
    app,
    ipcMain,
    protocol,
    shell,
    BrowserWindow,
    Menu,
} from 'electron'
// Electron types
import {
    App,
    BrowserWindowConstructorOptions,
    Event,
    MenuItemConstructorOptions,
} from 'electron'

import ContextMenu from 'electron-context-menu'
import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
// tslint:disable-next-line:no-var-requires
const localShortcut = require('electron-localshortcut')

export type PackageJson = typeof import('../package.json');
import { bugs, homepage } from '../package.json'
import TheDeskInfo from '../info.json'
export type TheDeskInfoObject = typeof TheDeskInfo;

declare const __static: string;

ipcMain.on('thedesk-info', (event: Event) => {
    event.returnValue =  Object.assign({
        productName: app.getName(),
        homePage: homepage,
        versions: Object.assign(pick(process.versions, ["chrome","electron","node"]), {internal: app.getVersion()}),
    }, TheDeskInfo)
})

const isDevelopment = process.env.NODE_ENV !== 'production'

if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', data => {
            if (data === 'graceful-exit') {
                app.quit()
            }
        })
    } else {
        process.on('SIGTERM', () => {
            app.quit()
        })
    }
}

protocol.registerStandardSchemes(['app'], { secure: true })

interface CreateWindowOptions {
    windowName: string
    loadPath: string
    windowOptions?: BrowserWindowConstructorOptions
    singleton?: boolean
    lastAction?: (win: BrowserWindow) => void
    openDevTools?: boolean
}

class Application {
    public app: App;
    public windows: { [key: string]: BrowserWindow } = {};

    constructor(app: App) {
        this.app = app;
        ContextMenu()
        this.app.on('window-all-closed', () => this.onWindowAllClosed())
        this.app.on('ready', () => this.onReady());
        this.app.on('activate', () => this.onActivated());
    }

    private onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            this.app.quit()
        }
    }

    private async onReady() {
        if (isDevelopment && !process.env.IS_TEST) {
            // Install Vue Devtools
            try {
                await installVueDevtools()
            } catch (e) {
                //console.error('Vue Devtools failed to install:', e.toString())
            }
        }
        if (!process.env.WEBPACK_DEV_SERVER_URL) createProtocol('app')
        this.openMainWindow()
    }

    private onActivated() {
        if (typeof this.windows.main === 'undefined') {
            this.openMainWindow()
        }
    }

    public openMainWindow() {
        const opts: CreateWindowOptions = {
            windowName: 'main',
            loadPath: 'index.html',
            windowOptions: {
                icon: path.join(__static, 'icon.png'),
                width: 800,
                height: 600,
                autoHideMenuBar: true,
            },
            singleton: true,
            lastAction: (win) => {
                localShortcut.register(win, 'F5', () => this.windows.main.reload())
            },
            openDevTools: !process.env.IS_TEST
        }
        this.createWindow(opts)
    }

    public openAboutWindow() {
        const opts: CreateWindowOptions = {
            windowName: 'about',
            loadPath: 'about.html',
            windowOptions: {
                width: 296,
                height: 432,
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
                win.webContents.on('before-input-event', (event, input) => {
                    if (typeof this.windows.about !== 'undefined')
                        this.windows.about.webContents.setIgnoreMenuShortcuts((input.meta || input.control) && input.key !== "R" || input.key === "F5")
                })
                localShortcut.register(win, 'Esc', () => this.windows.about.destroy())
            },
            openDevTools: !process.env.IS_TEST
        }
        this.createWindow(opts)
    }

    private async createWindow(options: CreateWindowOptions) {
        if (typeof this.windows[options.windowName] !== 'undefined') {
            this.windows[options.windowName].show()
            return
        }
        let win = new BrowserWindow(options.windowOptions)
        win.hide()
        win.webContents.on('did-finish-load', () => {
            this.windows[options.windowName].show()
        })

        win.on('closed', () => {
            delete this.windows[options.windowName]
        })

        let openUrl = (event: Event, url: string) => {
            if (url === process.env.WEBPACK_DEV_SERVER_URL + options.loadPath) {
                return
            }
            event.preventDefault()
            shell.openExternal(url, {
                activate: false
            }, (err) => {
                //if (err) console.log(err)
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

        this.windows[options.windowName] = win
    }
}

class ApplicationMenu {
    private app: Application;

    // Mac only menu. prefix `macOnly`. First Item always separator
    private macOnlyAppMenu: MenuItemConstructorOptions[] = [
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
    ];
    private macOnlyEditMenu: MenuItemConstructorOptions[] = [
        { type: 'separator' },
        {
            label: 'Speech',
            submenu: [
                { role: 'startspeaking' },
                { role: 'stopspeaking' },
            ]
        }
    ];

    private get aboutMenuItem(): MenuItemConstructorOptions {
        return {
            label: process.platform !== 'darwin' ? 'About' : `About ${this.app.app.getName()}`,
            click: () => this.app.openAboutWindow(),
        }
    }

    constructor(app: Application) {
        this.app = app;
    }

    public setApplicationMenu() {
        const menu = Menu.buildFromTemplate(this.buildTemplate(process.platform === 'darwin'))
        Menu.setApplicationMenu(menu)
    }

    private buildTemplate(isMac: boolean): MenuItemConstructorOptions[] {
        return [
            this.AppMenu(isMac),
            this.EditMenu(isMac),
            this.ViewMenu(),
            this.WindowMenu(isMac),
            this.HelpMenu(),
        ]
    }

    private AppMenu(isMac: boolean): MenuItemConstructorOptions {
        let appMenu: MenuItemConstructorOptions[] = [
            this.aboutMenuItem,
            ...(isMac ? this.macOnlyAppMenu : []),
            { type: 'separator' },
            { role: 'quit' },
        ]
        return {
            label: this.app.app.getName(),
            submenu: appMenu,
        }
    }

    private EditMenu(isMac: boolean): MenuItemConstructorOptions {
        let editMenu: MenuItemConstructorOptions[] = [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
            { role: 'pasteandmatchstyle' },
            { role: 'delete' },
            { role: 'selectall' },
            ...(isMac ? this.macOnlyEditMenu : []),
        ]
        return {
            label: 'Edit',
            submenu: editMenu,
        }
    }

    private ViewMenu(): MenuItemConstructorOptions {
        let viewMenu: MenuItemConstructorOptions[] = [
            { role: 'reload' },
            { role: 'forcereload' },
            { role: 'toggledevtools' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
        ]
        return {
            label: 'View',
            submenu: viewMenu
        }
    }

    private WindowMenu(isMac: boolean): MenuItemConstructorOptions {
        let windowMenu: MenuItemConstructorOptions[] = isMac ? [
            { role: 'close' },
            { role: 'minimize' },
            { role: 'zoom' },
            { type: 'separator' },
            { role: 'front' },
        ] : [
            { role: 'minimize' },
            { role: 'close' },
        ]
        return {
            label: 'Window',
            submenu: windowMenu,
        }
    }

    private HelpMenu(): MenuItemConstructorOptions {
        let helpMenu: MenuItemConstructorOptions[] = [
            {
                label: 'Report an issue',
                click: () => shell.openExternal(`${bugs.url}/new`),
            },
            {
                label: 'Learn More',
                click: () => shell.openExternal(TheDeskInfo.documentURL),
            }
        ]
        return {
            label: 'Help',
            submenu: helpMenu,
        }
    }
}

const TheDeskVueApp: Application = new Application(app)
const MainMenu: ApplicationMenu = new ApplicationMenu(TheDeskVueApp)
MainMenu.setApplicationMenu()

