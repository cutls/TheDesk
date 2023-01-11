import { IMulti } from "../../interfaces/Storage";

export function getMulti() {
    return JSON.parse(localStorage.getItem('multi') || '[]') as IMulti[]
}
export function setMulti(data: IMulti[]) {
    localStorage.setItem('multi', JSON.stringify(data))
}