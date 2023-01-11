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
