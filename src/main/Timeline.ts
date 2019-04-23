import {
    ipcMain
} from 'electron'
import Mastodon, { Status, Response } from 'megalodon'

export default class Timeline {
    public static ready() {
        ipcMain.on('no-auth-streaming', (event: Event, instance: string) => {
            const client = new Mastodon(
                '',
                'https://' + instance + '/api/v1'
            )

            client.get<[Status]>('/timelines/public?local=true')
                .then((resp: Response<[Status]>) => {
                    console.log(resp.data)
                })
        })
    }
}