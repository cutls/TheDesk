export interface TL {
    max_id?: string
    since_id?: string
    min_id?: string
    limit?: string
}
export interface HTL extends TL {
    local?: boolean
}
export interface FTL extends TL {
    remote?: boolean
    only_media?: boolean
}
export interface TTL extends TL {
    local?: boolean
    only_media?: boolean
}
export interface UTL extends TL {
    pinned?: boolean
    exclude_reblogs?: boolean
    tagged?: boolean
}
export interface Media {
    file: any,
    thumbnail?: any
    description?: string
    focus?: string
}
export interface Status {
    status?: string
    media_ids?: string[]
    poll?: {
        options: string[]
        expires_in?: number
        multiple?: boolean
        hide_totals?: boolean
    }
    in_reply_to_id?: string
    sensitive?: boolean
    spoiler_text?: string
    visibility?: 'public' | 'unlisted' | 'private' | 'direct' | 'limited' // limited is for Mod instance
    scheduled_at?: string
    expires_at?: string // Mod instance
    language?: string
    quote_id?: string // Mod instance
}
export interface StatusTheDeskExtend extends Status {
    TheDeskAcctId?: string
}
export interface PushSubscription {
    subscription: {
        endpoint: string
        keys: {
            p256dh: string
            auth: string
        }
    }
    data?: {
        alerts?: {
            poll?: boolean
            follow?: boolean
            favourite?: boolean
            reblog?: boolean
            mention?: boolean
        }
    }
}
export interface Search {
    account_id?: string
    max_id?: string
    min_id?: string
    type?: 'accounts' | 'hashtags' | 'statuses'
    exclude_unreviewed?: boolean
    q: string
    resolve?: boolean
    limit?: number
    offset?: number
    following?: boolean
}
export interface Directory {
    order: 'active' | 'new'
    local: boolean
    limit?: number
}