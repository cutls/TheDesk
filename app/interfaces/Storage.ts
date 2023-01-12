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
export type IColumnType = string
export interface IColumn {
    domain: number
    type: IColumnType
    data?: any
    background?: string
    text?: string
    left_fold?: boolean
}