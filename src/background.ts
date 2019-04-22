'use strict'

import { pick } from 'lodash'
import {
    app,
    ipcMain,
    protocol,
    Event,
} from 'electron'

import ContextMenu from 'electron-context-menu'

import Application from './main/Application'
import ApplicationMenu from "./main/ApplicationMenu";

export type PackageJson = typeof import('../package.json');
import { author, homepage } from '../package.json'
import TheDeskInfo from '../info.json'
export type TheDeskInfoObject = typeof TheDeskInfo;

ipcMain.on('thedesk-info', (event: Event) => {
    event.returnValue = Object.assign({
        productName: app.getName(),
        author: author,
        homePage: homepage,
        versions: Object.assign(pick(process.versions, ["chrome", "electron", "node"]), { internal: app.getVersion() }),
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

ContextMenu()

const TheDeskVueApp: Application = Application.shared
TheDeskVueApp.setApplicationMenu(ApplicationMenu.buildTemplate())