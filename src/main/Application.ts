import {
    app,
    ipcMain,
    shell,
    systemPreferences,
    Event,
    Menu,
} from 'electron'
import {
    createProtocol,
    installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib'

import Window from './Window'
import Timeline from './Timeline'
import Streaming from './Streaming'
import Auth from './Auth'

const isDevelopment = process.env.NODE_ENV !== 'production'

export default class Application {
    private static _instance: Application

    public static get shared(): Application {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this())
    }

    public isDarkMode: boolean

    private constructor() {
        this.isDarkMode = systemPreferences.isDarkMode()

        app.on('window-all-closed', () => this.onWindowAllClosed())
        app.on('ready', () => this.onReady())
        app.on('activate', () => this.onActivated())

        systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
            this.isDarkMode = systemPreferences.isDarkMode()
            Window.windowMap.forEach(win => {
                win.webContents.send('change-color-theme')
            })
        })
    }

    public setApplicationMenu(menu: Menu) {
        Menu.setApplicationMenu(menu)
    }

    private onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    }

    private async onReady() {
        if (isDevelopment && !process.env.IS_TEST) {
            // Install Vue Devtools
            try {
                await installVueDevtools()
            } catch (e) {
                console.error('Vue Devtools failed to install:', e.toString())
            }
        }
        if (!process.env.WEBPACK_DEV_SERVER_URL) createProtocol('app')

        Timeline.ready()
        Streaming.ready()
        Auth.ready()

        ipcMain.on('dark-theme', (e: Event) => e.returnValue = this.isDarkMode)

        Window.Main()
    }

    private onActivated() {
        if (!Window.windowMap.has('main')) {
            Window.Main()
        }
    }

    public static openUrl(event: Event, url: string) {
        shell.openExternal(url, {
            activate: false
        }, (err) => {
            if (err) console.log(err)
        })
    }
}