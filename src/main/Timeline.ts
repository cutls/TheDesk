import {
    ipcMain,
    Event
} from 'electron'
import { Status, Response } from 'megalodon'

import Client from './Client'

export default class Timeline {
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
    }
}