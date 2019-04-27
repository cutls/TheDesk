import { ipcMain, Event, shell, app } from "electron"
import Mastodon, { Response, Account, OAuth } from "megalodon"
import { join } from "path"
import Datastore from "nedb"

interface AccountDoc {
  _id?: string
  domain: string
  acct: string
  avatar: string
  avatarStatic: string
  accessToken: string
  color?: string
}

export default class Auth {
  public static ready() {
    let clientId: string
    let clientSecret: string
    ipcMain.on("new-account-setup", async (event: Event, instance: string) => {
      const SCOPES: string = "read write follow"
      let url: string | null
      try {
        let appData: OAuth.AppData = await Mastodon.registerApp(
          "TheDesk",
          {
            scopes: SCOPES
          },
          "https://" + instance
        )
        clientId = appData.clientId
        clientSecret = appData.clientSecret
        url = appData.url
        if (url === undefined || url === null) {
          event.sender.send(`error`, {
            id: "ERROR_GET_AUTHURL",
            message: "Failed to get auth URL to login."
          })
          return
        }
        shell.openExternal(
          url,
          {
            activate: false
          },
          err => {
            if (err) console.log(err)
          }
        )
      } catch (err) {
        let error: Error = err
        event.sender.send(`error`, {
          id: "ERROR_CONNECTION",
          message: "Connection error",
          meta: error
        })
      }
    })
    ipcMain.on(
      "new-account-auth",
      async (event: Event, code: string, instance: string) => {
        let url: string = "https://" + instance
        try {
          let tokenData: Partial<{ accessToken: string }> = await Mastodon.fetchAccessToken(clientId, clientSecret, code, url)
          if (tokenData.accessToken === undefined) {
            event.sender.send(`error`, {
              id: "ERROR_GET_TOKEN",
              message: "Failed to get access token."
            })
            return
          }

          const client = new Mastodon(
            tokenData.accessToken,
            url + "/api/v1"
          )

          let resp: Response<Account> = await client.get<Account>("/accounts/verify_credentials")
          let you = resp.data

          let db = new Datastore({
            filename: join(app.getPath("userData"), "account.db"),
            autoload: true
          })

          let docs: AccountDoc = {
            domain: instance,
            acct: you.acct,
            avatar: you.avatar,
            avatarStatic: you.avatar_static,
            accessToken: tokenData.accessToken,
          }

          db.insert(docs, function (err, newDocs) {
            if (err) {
              event.sender.send(`error`, {
                id: "ERROR_YOU_TRY_ANOTHER_ACCOUNT",
                message: "You cannot login already logined account."
              })
            } else {
              event.sender.send(`login-complete`, newDocs)
            }
          })
        } catch (err) {
          let error: Error = err
          event.sender.send(`error`, {
            id: "ERROR_CONNECTION",
            message: "Connection error",
            meta: error
          })
        }
      }
    )
  }
}
