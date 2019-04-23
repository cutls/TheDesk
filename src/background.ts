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
import ApplicationMenu from './main/ApplicationMenu'
import Timeline from './main/Timeline'

export type PackageJson = typeof import('../package.json')
import { author, contributors, homepage } from '../package.json'
import TheDeskInfo from '../info.json'
export type TheDeskInfoObject = typeof TheDeskInfo

ipcMain.on('thedesk-info', (event: Event) => {
    event.returnValue = Object.assign({
        productName: app.getName(),
        author: author,
        contributors: contributors,
        homePage: homepage,
        versions: Object.assign(pick(process.versions, ['chrome', 'electron', 'node']), { internal: app.getVersion() }),
    }, TheDeskInfo)
})

if (process.env.NODE_ENV !== 'production') {
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
//この書き方がいいのかは知りません。(cutls|main/Timeline.ts)
Timeline.timelineReady()

const TheDeskVueApp: Application = Application.shared
TheDeskVueApp.setApplicationMenu(ApplicationMenu.buildTemplate())