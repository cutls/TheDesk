
import { ipcMain, Event } from 'electron'
import { default as Mastodon, Status, WebSocket } from 'megalodon'

import Window from './Window'
import Client from './Client'

export default class Streaming {
    private static _instance: Streaming
    public static get shared(): Streaming {
        return this._instance || (this._instance = new this())
    }

    public static ready() {
        ipcMain.on('open-streaming', (_: Event, name: string, type: string) => {
            return this.shared.openStreaming(name, type)
        })
    }

    private sockets: Map<string, WebSocket>

    private constructor() {
        this.sockets = new Map()
    }

    private openStreaming(name: string, type: string) {
        let client: Mastodon
        let stream: string

        switch (type) {
            case 'no-auth':
                client = Client.getNoAuthClient(name)
                stream = 'public:local'
                break
            default:
                return
        }

        let socketName = name + ':' + type
        if (this.sockets.has(socketName)) {
            return
        }

        const socket: WebSocket = client.socket('/streaming', stream)

        socket.on('connect', () => {
            console.log('start streaming:', socketName)
        })

        socket.on('update', (status: Status) => {
            if (Window.windowMap.has('main')) {
                Window.windowMap.get('main')!.webContents.send(`update-${name}-${type}`, status)
            }
        })

        socket.on('notification', (notification: Notification) => {
            console.log(notification)
        })

        socket.on('delete', (id: number) => {
            if (Window.windowMap.has('main')) {
                Window.windowMap.get('main')!.webContents.send(`delete-${name}-${type}`, id)
            }
        })

        socket.on('error', (err: Error) => {
            console.error(err)
        })

        socket.on('heartbeat', () => {
            console.log('thump.')
        })

        socket.on('close', () => {
            console.log('close streaming:', socketName)
        })

        socket.on('parser-error', (err: Error) => {
            console.error(err)
        })

        this.sockets.set(socketName, socket)
    }
}