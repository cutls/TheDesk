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
        ipcMain.on('timeline', async (event: Event, name: string, type: string) => {
            const client = Client.getAuthClient(name)
            try {
                let url: string = ""
                //home/notify/dm/local/fediverse/integrated/localPlus
                //integratedはまだ。dmはAPI構造が違う。notifyはmax_idとかのためにヘッダー取らないといけない。
                if(type=="home"){
                    url="/timelines/home"
                }else if(type=="notify"){
                    url="/timelines/notifications"
                }else if(type=="dm"){
                    url="/conversations"
                }else if(type=="local"){
                    url="/timelines/public?local=true"
                }else if(type=="fediverse"){
                    url="/timelines/public"
                }
                let res: Response<[Status]> = await client.get<[Status]>(url)
                event.sender.send(`timeline-${name}-no-auth`, res.data)
            } catch (error) {
                event.sender.send(`timeline-${name}-no-auth`, [], error)
            }
        })
    }
}