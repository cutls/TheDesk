import { app } from "electron"
import Mastodon from 'megalodon'
import Datastore from "nedb"
import { join } from "path"
type Protocol = 'http' | 'websocket'

export default class Clients {
    // Authorized Accounts. keyには`@username@domain`を設定します
    private static authorizedHTTP: Map<string, Mastodon> = new Map()
    private static authorizedWebSocket: Map<string, Mastodon> = new Map()

    // Non-authorized Accounts. keyには`domain`を設定します
    private static nonAuthorizedHTTP: Map<string, Mastodon> = new Map()
    private static nonAuthorizedWebsocket: Map<string, Mastodon> = new Map()

    public static getAuthClient(username: string, protocol: Protocol = 'http'): Mastodon {
        let clients = protocol === 'http' ? this.authorizedHTTP : this.authorizedWebSocket

        if (!clients.has(username)) {
            // usernameからドメインをとトークンをデータベースから取得してクライアントを作る
            let db = new Datastore({
                filename: join(app.getPath("userData"), "account.db"),
                autoload: true
              })
            db.find({ full: username }, function(err: any, docs: { domain: string; accessToken: string; }){
                if (err) {
                    console.log(err)
                  } else {
                    Clients.setAuthClient(protocol, username, Clients.createAuthClient(protocol, docs.domain, docs.accessToken))
                  }
            });
        }

        return clients.get(username)!
    }

    public static setAuthClient(protocol: Protocol, username: string, client: Mastodon) {
        let clients = protocol === 'http' ? this.nonAuthorizedHTTP : this.nonAuthorizedWebsocket
        clients.set(username, client)
    }

    public static createAuthClient(protocol: Protocol, domain: string, accessToken: string): Mastodon {
        let scheme = protocol === 'http' ? 'https://' : 'wss://'
        return new Mastodon(
            accessToken,
            scheme + domain + '/api/v1'
        )
    }

    public static getNoAuthClient(domain: string, protocol: Protocol = 'http'): Mastodon {
        let clients = protocol === 'http' ? this.nonAuthorizedHTTP : this.nonAuthorizedWebsocket

        if (!clients.has(domain)) {
            this.setNoAuthClient(protocol, domain, this.createNoAuthClient(protocol, domain))
        }

        return clients.get(domain)!
    }

    public static setNoAuthClient(protocol: Protocol, domain: string, client: Mastodon) {
        let clients = protocol === 'http' ? this.nonAuthorizedHTTP : this.nonAuthorizedWebsocket
        clients.set(domain, client)
    }

    private static createNoAuthClient(protocol: Protocol, domain: string): Mastodon {
        let scheme = protocol === 'http' ? 'https://' : 'wss://'
        return new Mastodon(
            '',
            scheme + domain + '/api/v1'
        )
    }
}