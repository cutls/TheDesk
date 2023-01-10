export interface MastodonApiError {
    error: string
}
export interface Account {
    id: string
    username: string
    acct: string
    display_name: string | null
    locked: boolean
    bot: boolean
    created_at: string
    note: string
    url: string
    avatar: string
    avatar_static: string
    header: string
    header_static: string
    followers_count: number
    following_count: number
    statuses_count: number
    last_status_at?: string
    emojis: Emoji[]
    fileds?: {
        name: string
        value: string
        verified_at?: string | null
    }[]
    [x: string]: any
}
export interface Emoji {
    shortcode: string
    url: string
    static_url: string
    visible_in_picker?: boolean
    [x: string]: any
}
export interface Credential extends Account {
    source: {
        privacy: string
        sensitive: boolean
        language: string
        note: string
        fields?: {
            name: string
            value: string
            verified_at: string
            [x: string]: any
        }[]
        follow_requests_count?: number
        [x: string]: any
    }
}
export interface Toot {
    id: string
    created_at: string
    in_reply_to_id: string | null
    in_reply_to_account_id: string | null
    sensitive: boolean
    spoiler_text: string
    visibility: 'public' | 'unlisted' | 'private' | 'direct' | string
    language?: string
    uri: string
    url: string
    replies_count?: number
    reblogs_count: number
    muted: boolean
    bookmarked?: boolean
    content: string
    reblog: Toot | null
    application?: {
        name: string | null
        website: string | null
    } | null | {}
    account: Account
    media_attachments: Attachment[] | []
    mentions: Mention[] | []
    tags: Tag[] | []
    emojis: Emoji[] | []
    card: Card | null
    poll?: Poll | null
    pinned?: boolean
    customPinned?: boolean
    [x: string]: any
}
export interface Attachment {
    id: string
    type: string | 'image' | 'video' | 'gifv' | 'audio'
    url: string
    preview_url: string
    remote_url: string | null
    text_url: string | null
    meta: any //後で定義する
    description?: string | null
    blurhash?: string | null
    [x: string]: any
}
interface Mention {
    id: string
    usrename: string
    url: string
    acct: string
    [x: string]: any
}
export interface Tag {
    name: string
    url: string
    history?: {
        day: string
        uses: string
        accounts: string
        [x: string]: any
    }[]
    [x: string]: any
}
export interface Card {
    url: string
    title: string
    description: string
    type: string | 'video' | 'photo' | 'link' | 'rich'
    author_name?: string
    provider_name?: string
    html?: string
    width?: number
    height?: number
    image?: string | null
    blurhash?: string | null
    [x: string]: any
}
export interface Poll {
    id: string
    expires_at: string
    expired: boolean
    multiple: boolean
    votes_count: number
    voters_count: null
    voted: boolean
    own_votes: number[]
    options: {
        title: string
        votes_count: number | null
    }[]
    emojis: Emoji[]
    [x: string]: any
}
export interface CustomEmoji {
    shortcode: string
    static_url: string
    url: string
    visible_in_picker?: boolean
}
export interface Media {
    id: string
    type: 'unknown' | 'image' | 'gifv' | 'video'
    url: string
    preview_url: string
    remote_url: string | null
    text_url: string
    meta: {
        focus: {
            x: number
            y: number
        },
        original?: {
            width: number
            height: number
            size: string
            aspect: number
        },
        small?: {
            width: number
            height: number
            size: string
            aspect: number
        },
    },
    description: string | null
    blurhash: string | null
}
export interface Notification {
    id: string
    type: 'follow' | 'follow_request' | 'mention' | 'reblog' | 'favourite' | 'poll' | 'status'
    created_at: string
    account: Account,
    status?: Toot
}
export interface Relationship {
    id: string,
    following: boolean,
    showing_reblogs: boolean,
    notifying: boolean,
    followed_by: boolean,
    blocking: boolean,
    blocked_by: boolean,
    muting: boolean,
    muting_notifications: boolean,
    requested: boolean,
    domain_blocking: boolean,
    endorse: boolean,
    note: string
}
export interface PushSubscription {
    id: string
    endpoint: string
    alerts: {
        poll?: boolean
        follow: boolean
        favourite: boolean
        reblog: boolean
        mention: boolean
    }
    server_key: string
}
export interface List {
    replies_policy?: string
    id: string
    title: string
}
export interface Context {
    descendants: Toot[]
    ancestors: Toot[]
}
export interface Search {
    accounts: Account[]
    statuses: Toot[]
    hashtags: Tag[]
}