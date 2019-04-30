import {
    ipcMain,
    Event
} from 'electron'
import { Status, Response } from 'megalodon'

import Client from './Client'

export default class Timeline {
    private static readonly endpoints: Readonly<{
        [key: string]: string
    }> = {
            home: "/timelines/home",
            notify: "/timelines/notifications",
            dm: "/conversations",
            local: "/timelines/public?local=true",
            fediverse: "/timelines/public",
        }

    public static ready() {
        ipcMain.on('no-auth-timeline', async (event: Event, name: string) => {
            const client = Client.getNoAuthClient(name)
            try {
                let res: Response<[Status]> = await client.get<[Status]>('/timelines/public?local=true')
                event.sender.send(`timeline-${name}-no-auth`, res.data)
            } catch (error) {
                event.sender.send(`timeline-${name}-no-auth`, [], error)
            }
        })
        ipcMain.on('timeline', async (event: Event, name: string, type: string) => {
            // home/notify/dm/local/fediverse/integrated/localPlus
            // integratedはまだ。dmはAPI構造が違う。notifyはmax_idとかのためにヘッダー取らないといけない。
            // integratedはレンダラープロセス側でそれぞれ取得させる形で、ここでは考慮しないのがいいのかな
            if (!(type in this.endpoints)) {
                event.sender.send(`timeline-${name}-${type}`, [], new Error("Not supported type"))
                return
            }

            let url = this.endpoints[type]
            try {
                const client = Client.getAuthClient(name)
                let res: Response<[Status]> = await client.get<[Status]>(url)
                event.sender.send(`timeline-${name}-${type}`, res.data)
            } catch (error) {
                console.log(error)
                event.sender.send(`timeline-${name}-${type}`, [], error)
            }
        })
    }
}