import { IColumn, IMulti } from "../../interfaces/Storage";

export function getMulti() {
    return JSON.parse(localStorage.getItem('multi') || '[]') as IMulti[]
}
export function setMulti(data: IMulti[]) {
    localStorage.setItem('multi', JSON.stringify(data))
}
export function initColumn() {
    const b = [
        {
            domain: 0,
            type: 'home' as const,
        },
        {
            domain: 0,
            type: 'local' as const,
        }
    ]
    let c = localStorage.getItem('column')
    if (!c) {
        setColumn(b)
        c = JSON.stringify(b)
    }
    return JSON.parse(c) as IColumn[]
}
export function getColumn() {
    return JSON.parse(localStorage.getItem('column') || '[]') as IColumn[]
}
export function setColumn(data: IColumn[]) {
    localStorage.setItem('column', JSON.stringify(data))
}