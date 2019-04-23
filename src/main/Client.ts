
import Mastodon from 'megalodon'

type Protocol = 'http' | 'websocket'

export default class Clients {
    // Authorized Accounts. keyには`@username@domain`を設定します
    private static authorizedHTTP: Map<string, Mastodon> = new Map()
    private static authorizedWebSocket: Map<string, Mastodon> = new Map()

    // Non-authorized Accounts. keyには`domain`を設定します
    private static nonAuthorizedHTTP: Map<string, Mastodon> = new Map()
    private static nonAuthorizedWebsocket: Map<string, Mastodon> = new Map()

    public static getNoAuthClient(domain: string, protocol: Protocol = 'http'): Mastodon {
        let clients = protocol === 'http' ? this.nonAuthorizedHTTP : this.nonAuthorizedWebsocket

        if (!clients.has(domain)) {
            this.createNoAuthClient(domain)
        }

        return clients.get(domain)!
    }

    private static createNoAuthClient(domain: string) {

        this.nonAuthorizedHTTP.set(domain, new Mastodon(
            '',
            'https://' + domain + '/api/v1'
        ))
        this.nonAuthorizedWebsocket.set(domain, new Mastodon(
            '',
            'wss://' + domain + '/api/v1'
        ))
    }
}