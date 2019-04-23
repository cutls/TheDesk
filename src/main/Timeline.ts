import {
    ipcMain
} from 'electron'
import Mastodon, { Status, Response } from 'megalodon'

import Client from './Client'

export default class Timeline {
    public static ready() {
        ipcMain.on('no-auth-streaming', (event: Event, instance: string) => {
            const client = Client.getNoAuthClient(instance)

            client.get<[Status]>('/timelines/public?local=true')
                .then((resp: Response<[Status]>) => {
                    console.log(resp.data)
                })
        })
    }
}