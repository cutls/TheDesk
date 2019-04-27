
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