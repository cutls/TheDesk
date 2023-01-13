import { IVis } from "../js/post/secure"

export interface IMulti {
    at: string
    name: string
    domain: string
    user: string
    prof: string
    id: string
    vis: IVis
    background?: string
    text?: string
    rt?: string
}
export interface IPlugin {
    id: string
    content: string
}
export type IColumnType = 'home' | 'local' | 'local-media' | 'pub' | 'pub-media' | 'tag' | 'list' | 'notf' | 'noauth' | 'dm' | 'mix' | 'plus' | 'webview' | 'tootsearch' | 'bookmark' | 'utl' | 'fav'
export interface IColumn {
    domain: number
    type: IColumnType
    data?: any
    background?: string
    text?: string
    left_fold?: boolean
}
export interface IEmojiStorage {
    categorized: {
        [key: string]: IEmoji[]
    }
    uncategorized: IEmoji[]
    ifCategorized: boolean
}
export interface IEmoji {
    shortcode: string
    url: string
    listed: boolean
}