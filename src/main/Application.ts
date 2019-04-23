import {
    app,
    shell,
    Menu,
} from 'electron'
import {
    createProtocol,
    installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib'

import Window from './Window'
import Timeline from './Timeline'

const isDevelopment = process.env.NODE_ENV !== 'production'

export default class Application {
    private static _instance: Application

    public static get shared(): Application {
        // Do you need arguments? Make it a regular static method instead.
        return this._instance || (this._instance = new this())
    }

    private constructor() {
        app.on('window-all-closed', () => this.onWindowAllClosed())
        app.on('ready', () => this.onReady())
        app.on('activate', () => this.onActivated())
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