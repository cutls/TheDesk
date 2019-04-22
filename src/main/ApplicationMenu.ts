import {
    app,
    shell,
    Menu,
    MenuItemConstructorOptions
} from 'electron'

import Window from './Window'

import { bugs } from '../../package.json'
import { documentURL } from '../../info.json'

const isMac = process.platform === 'darwin'

export default class ApplicationMenu {
    // Mac only menu. prefix `macOnly`. First Item always separator
    private static macOnlyAppMenu: MenuItemConstructorOptions[] = [
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
    ]
    private static macOnlyEditMenu: MenuItemConstructorOptions[] = [
        { type: 'separator' },
        {
            label: 'Speech',
            submenu: [
                { role: 'startspeaking' },
                { role: 'stopspeaking' },
            ]
        }
    ]
    private static aboutMenuItem: MenuItemConstructorOptions = {
        label: !isMac ? 'About' : `About ${app.getName()}`,
        click: () => Window.About(),
    }

    public static get menuConstruct(): MenuItemConstructorOptions[] {
        return [
            this.AppMenu(),
            this.EditMenu(),
            this.ViewMenu(),
            this.WindowMenu(),
            this.HelpMenu(),
        ]
    }

    public static buildTemplate(): Menu {
        return Menu.buildFromTemplate(this.menuConstruct)
    }
    private static AppMenu(): MenuItemConstructorOptions {
        let appMenu: MenuItemConstructorOptions[] = [
            this.aboutMenuItem,
            ...(isMac ? this.macOnlyAppMenu : []),
            { type: 'separator' },
            { role: 'quit' },
        ]
        return {
            label: app.getName(),
            submenu: appMenu,
        }
    }
    private static EditMenu(): MenuItemConstructorOptions {
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
    private static ViewMenu(): MenuItemConstructorOptions {
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
    private static WindowMenu(): MenuItemConstructorOptions {
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
    private static HelpMenu(): MenuItemConstructorOptions {
        let helpMenu: MenuItemConstructorOptions[] = [
            {
                label: 'Report an issue',
                click: () => shell.openExternal(`${bugs.url}/new`),
            },
            {
                label: 'Learn More',
                click: () => shell.openExternal(documentURL),
            }
        ]
        return {
            label: 'Help',
            submenu: helpMenu,
        }
    }
}
