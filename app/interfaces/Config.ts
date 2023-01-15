import { IColumn, IMulti, IPlugin } from "./Storage";

export interface ITheDeskConfig {
    accts: IMulti[]
    columns: IColumn[]
    config: IConfig
    ksc: string[]
    clientMute: string[]
    wordMute: string[]
    spotifyArtwork: 'yes' | null
    spotifyTemplete: string | null
    favoriteTags: string[]
    plugins: IPlugin[]
    revisons: number
    meta: {
        date: string
        thedesk: string
        platform: string
    }
}
export interface IConfig {
    [x: string]: string
}