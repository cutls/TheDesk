import {
    app,
    ipcMain,
    Event
} from 'electron'
import { Status, Response } from 'megalodon'
import { join } from "path"
import Datastore from "nedb"

import Client from './Client'

interface TimelineDoc {
    _id?: string
    name: string
    type: string
}

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
        ipcMain.on('add-timeline', (event: Event, name: string, type: string) => this.onAddTimeline(event, name, type))

        ipcMain.on('no-auth-timeline', (event: Event, name: string) => this.onNoAuthTimeline(event, name))

        ipcMain.on('timeline', (event: Event, name: string, type: string) => this.onTimeline(event, name, type))
    }

    private static async onAddTimeline(event: Event, name: string, type: string) {
        if (!(type in this.endpoints) && type !== 'no-auth') {
            event.sender.send(`add-timeline`, undefined, new Error("Not supported type"))
            return
        }

        let db = new Datastore({
            filename: join(app.getPath("userData"), "timeline.db"),
            autoload: true
        })

        let docs: TimelineDoc = {
            name: name,
            type: type,
        }

        db.insert(docs, function (err, newDocs) {
            if (err) {
                let error = new Error("You cannot login already logined account.")
                error.name = "ERROR_YOU_TRY_ANOTHER_ACCOUNT"
                event.sender.send(`add-timeline`, undefined, error)
            } else {
                event.sender.send(`add-timeline`, newDocs)
            }
        })
    }

    private static async onNoAuthTimeline(event: Event, name: string) {
        try {
            const client = Client.getNoAuthClient(name)
            let res: Response<[Status]> = await client.get<[Status]>('/timelines/public?local=true')
            event.sender.send(`timeline-${name}-no-auth`, res.data)
        } catch (error) {
            event.sender.send(`timeline-${name}-no-auth`, [], error)
        }
    }

    private static async onTimeline(event: Event, name: string, type: string) {
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
    }
}