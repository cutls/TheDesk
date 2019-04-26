import { ipcMain, Event, shell, app } from "electron"
import Mastodon, { Response, Account } from "megalodon"
import { join } from "path"
import Datastore from "nedb"
import Window from "./Window"

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
      )
        .then(appData => {
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
            event.sender.send(`error`, {
              id: "ERROR_GET_AUTHURL",
              message: "Failed to get auth URL to login."
            })
          }
        })
        .catch((err: Error) =>
          event.sender.send(`error`, {
            id: "ERROR_CONNECTION",
            message: "Connection error",
            meta: err
          })
        )
    })
    ipcMain.on(
      "new-account-auth",
      async (event: Event, code: string, instance: string) => {
        let url: string = "https://" + instance
        Mastodon.fetchAccessToken(clientId, clientSecret, code, url)
          .then((tokenData: Partial<{ accessToken: string }>) => {
            if (tokenData.accessToken) {
              const client = new Mastodon(
                tokenData.accessToken,
                url + "/api/v1"
              )

              client
                .get<Account>("/accounts/verify_credentials")
                .then((resp: Response<Account>) => {
                  let you = resp.data
                  let db = new Datastore({
                    filename: join(app.getPath("userData"), "account.db"),
                    autoload: true
                  })
                  let docs = {
                    domain: instance,
                    acct: you.acct,
                    avatar: you.avatar,
                    avatarStatic: you.avatar_static,
                    accessToken: tokenData.accessToken,
                    color: undefined
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
                })
            } else {
              event.sender.send(`error`, {
                id: "ERROR_GET_TOKEN",
                message: "Failed to get access token."
              })
            }
          })
          .catch((err: Error) =>
            event.sender.send(`error`, {
              id: "ERROR_CONNECTION",
              message: "Connection error",
              meta: err
            })
          )
      }
    )
  }
}
