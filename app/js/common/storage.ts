import { IColumn, IMulti } from "../../interfaces/Storage";

export function getMulti() {
    return JSON.parse(localStorage.getItem('multi') || '[]') as IMulti[]
}
export function setMulti(data: IMulti[]) {
    localStorage.setItem('multi', JSON.stringify(data))
}
export function getColumn() {
    return JSON.parse(localStorage.getItem('column') || '[]') as IColumn[]
}
export function setColumn(data: IColumn[]) {
    localStorage.setItem('column', JSON.stringify(data))
}