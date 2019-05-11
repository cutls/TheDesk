import { app } from "electron"
import Mastodon from 'megalodon'
import Datastore from "nedb-promises"
import { join } from "path"

type Protocol = 'http' | 'websocket'

export default class Client {
    // Authorized Accounts. keyには`username@domain`を設定します
    private static authorizedHTTP: Map<string, Mastodon> = new Map()
    private static authorizedWebSocket: Map<string, Mastodon> = new Map()

    // Non-authorized Accounts. keyには`domain`を設定します
    private static nonAuthorizedHTTP: Map<string, Mastodon> = new Map()
    private static nonAuthorizedWebSocket: Map<string, Mastodon> = new Map()

    public static async getAuthClient(username: string, protocol: Protocol = 'http'): Promise<Mastodon> {
        let clients = protocol === 'http' ? this.authorizedHTTP : this.authorizedWebSocket

        if (!clients.has(username)) {
            // usernameからドメインをとトークンをデータベースから取得してクライアントを作る
            let db = new Datastore({
                filename: join(app.getPath("userData"), "account.db"),
                autoload: true
            })
            try {
                let doc = await db.findOne<{ domain: string; accessToken: string; }>({ full: username })
                Client.setAuthClient(protocol, username, Client.createAuthClient(protocol, doc.domain, doc.accessToken))
            } catch (err) {
                throw err
            }
        }

        return clients.get(username)!
    }

    public static setAuthClient(protocol: Protocol, username: string, client: Mastodon) {
        let clients = protocol === 'http' ? this.authorizedHTTP : this.authorizedWebSocket
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
        let clients = protocol === 'http' ? this.nonAuthorizedHTTP : this.nonAuthorizedWebSocket

        if (!clients.has(domain)) {
            this.setNoAuthClient(protocol, domain, this.createNoAuthClient(protocol, domain))
        }

        return clients.get(domain)!
    }

    public static setNoAuthClient(protocol: Protocol, domain: string, client: Mastodon) {
        let clients = protocol === 'http' ? this.nonAuthorizedHTTP : this.nonAuthorizedWebSocket
        clients.set(domain, client)
    }

    private static createNoAuthClient(protocol: Protocol, domain: string): Mastodon {
        let scheme = protocol === 'http' ? 'https://' : 'wss://'
        return new Mastodon(
            null, // pleromaでは空文字ではなくnullを指定しないと毎秒403エラーになるアクセスを繰り返すことになる。TypeScriptではnullを入れられないのでmegalodonの方を修正する必要あり
            scheme + domain + '/api/v1'
        )
    }
}