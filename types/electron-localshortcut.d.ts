import { BrowserWindow, Accelerator } from 'electron'

export function disableAll(win: BrowserWindow): void
export function enableAll(win: BrowserWindow): void
export function isRegistered(win: BrowserWindow, accelerator: Accelerator): void
export function register(win: BrowserWindow, accelerator: Accelerator, callback: () => void): void
export function unregister(win: BrowserWindow, accelerator: Accelerator): void
export function unregisterAll(win: BrowserWindow): void