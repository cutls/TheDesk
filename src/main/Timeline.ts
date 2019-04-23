import {
  ipcMain
} from 'electron'
import Mastodon, { Status, Response } from 'megalodon'
//この書き方がいいのかは知りません。(cutls|background.ts)
export default class Timeline {
    static timelineReady() {
      ipcMain.on('no-auth-streaming', (event: Event, instance :String) => {
        const client = new Mastodon(
          "",
          "https://"+instance + '/api/v1'
        )
        
        client.get<[Status]>('/timelines/public?local=true')
          .then((resp: Response<[Status]>) => {
            console.log(resp.data)
          })
      })
    }
}