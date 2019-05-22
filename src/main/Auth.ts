import { ipcMain, Event, shell, app } from "electron"
import Mastodon, { Response, Account, OAuth } from "megalodon"
import { join } from "path"
import Datastore from "nedb-promises"

import Client from "./Client"

interface AccountDoc {
  domain: string
  acct: string
  full: string
  avatar: string
  avatarStatic: string
  accessToken: string
  color?: string
}

export default class Auth {
  private static redirectUri: string = 'thedesk://login'

  public static ready() {
    ipcMain.on("new-account-setup", (event: Event, instance: string, useURLScheme: boolean = false) => this.setup(event, instance, useURLScheme))
  }

  private static async setup(event: Event, instance: string, useURLScheme: boolean) {
    let appData: OAuth.AppData

    try {
      let options: Partial<{ scopes: string, redirect_uris: string, website: string }> = {
        scopes: "read write follow",
        website: "https://thedesk.top",
      }
      if (useURLScheme) {
        options.redirect_uris = this.redirectUri
      }
      appData = await Mastodon.registerApp(
        "TheDesk",
        options,
        "https://" + instance
      )
    } catch (err) {
      let error: Error = err
      event.sender.send(`error`, {
        id: "ERROR_CONNECTION",
        message: "Connection error",
        meta: error
      })
      return
    }

    let url: string | null = appData.url
    if (url === null) {
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

    ipcMain.once("new-account-auth", (event: Event, code: string, instance: string) => {
      this.auth(event, code, instance, appData.clientId, appData.clientSecret, appData.redirectUri)
    })
  }

  private static async auth(event: Event, code: string, instance: string, clientId: string, clientSecret: string, redirectUri: string) {
    let tokenData: Partial<{ accessToken: string }>
    try {
      tokenData = await Mastodon.fetchAccessToken(clientId, clientSecret, code, "https://" + instance, redirectUri)
    } catch (err) {
      let error: Error = err
      error.name = "ERROR_CONNECTION"
      event.sender.send(`login-complete`, undefined, error)
      return
    }

    if (tokenData.accessToken === undefined) {
      let error = new Error("Failed to get access token.")
      error.name = "ERROR_GET_TOKEN"
      event.sender.send(`login-complete`, undefined, error)
      return
    }

    const client = Client.createAuthClient('http', instance, tokenData.accessToken)

    let resp: Response<Account> = await client.get<Account>("/accounts/verify_credentials")
    let you = resp.data

    let db = Datastore.create({
      filename: join(app.getPath("userData"), "account.db"),
      autoload: true
    })

    let docs: AccountDoc = {
      domain: instance,
      acct: you.acct,
      full: you.acct + "@" + instance,
      avatar: you.avatar,
      avatarStatic: you.avatar_static,
      accessToken: tokenData.accessToken,
    }

    try {
      let newDoc = await db.insert(docs)
      Client.setAuthClient('http', newDoc.full, client)
      event.sender.send(`login-complete`, newDoc)
    } catch (err) {
      let error = new Error("You cannot login already logined account.")
      error.name = "ERROR_YOU_TRY_ANOTHER_ACCOUNT"
      event.sender.send(`login-complete`, undefined, error)
    }
  }
}
