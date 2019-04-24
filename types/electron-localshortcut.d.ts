import { BrowserWindow, Accelerator } from 'electron'

declare module 'electron-localshortcut' {
    function disableAll(win: BrowserWindow): void
    function enableAll(win: BrowserWindow): void
    function isRegistered(win: BrowserWindow, accelerator: Accelerator): void
    function register(win: BrowserWindow, accelerator: Accelerator, callback: () => void): void
    function unregister(win: BrowserWindow, accelerator: Accelerator): void
    function unregisterAll(win: BrowserWindow): void
}