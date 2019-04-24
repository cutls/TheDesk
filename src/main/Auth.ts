import { ipcMain, Event, shell } from "electron"
import Mastodon from "megalodon"

export default class Auth {
  public static ready() {
    ipcMain.on("new-account-setup", async (event: Event, instance: string) => {
      const SCOPES: string = "read write follow"
      let clientId: string
      let clientSecret: string
      let url: string | null
      Mastodon.registerApp(
        "TheDesk",
        {
          scopes: SCOPES
        },
        "https://"+instance
      ).then(appData => {
        clientId = appData.clientId
        clientSecret = appData.clientSecret
        url = appData.url
        if(url){
            shell.openExternal(
                url,
                {
                  activate: false
                },
                err => {
                  if (err) console.log(err)
                }
              )
        }else{
            console.log(appData)
        }
        
      })
    })
  }
}
