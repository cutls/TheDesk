import { ipcMain, Event, shell } from "electron"
import Mastodon from "megalodon"

export default class Auth {
  public static ready() {
    let clientId: string
    let clientSecret: string
    ipcMain.on("new-account-setup", async (event: Event, instance: string) => {
      const SCOPES: string = "read write follow"
      let url: string | null
      Mastodon.registerApp(
        "TheDesk",
        {
          scopes: SCOPES
        },
        "https://" + instance
      ).then(appData => {
        clientId = appData.clientId
        clientSecret = appData.clientSecret
        url = appData.url
        if (url) {
          shell.openExternal(
            url,
            {
              activate: false
            },
            err => {
              if (err) console.log(err)
            }
          )
        } else {
          console.log(appData)
        }
      })
    })
    ipcMain.on("new-account-auth", async (event: Event, code: string, instance: string) => {
      Mastodon.fetchAccessToken(clientId, clientSecret, code, "https://"+instance)
        .then((tokenData: Partial<{ accessToken: string }>) => {
          console.log(tokenData.accessToken)
        })
        .catch((err: Error) => console.error(err))
    })
  }
}
