import { toast } from "./declareM"
type IMode = 'remaining' | 'limit' | 'resetTime'

class RemainApiObject {
    instance?: string
    remaining: number
    limit: number
    resetTime: Date
    constructor(){
        this.remaining = -1
        this.limit = -1
        this.resetTime = new Date()
    }
}

class RemainApi {
    upload: RemainApiObject
    delete: RemainApiObject
    others: RemainApiObject
    constructor(){
        this.upload =  {
            remaining: -1,
            limit: -1,
            resetTime: new Date
        }
        this.delete =  {
            remaining: -1,
            limit: -1,
            resetTime: new Date
        }
        this.others =  {
            remaining: -1,
            limit: -1,
            resetTime: new Date
        }
    }
}

let remain: Map<string, RemainApi> = new Map()

let last: RemainApiObject = {
    instance: '',
    remaining: -1,
    limit: -1,
    resetTime: new Date
}

let remainingDelete: number = -1
let limitDelete: number = -1
let resetTimeDelete: Date = new Date

export function parseRemain(url:string,headers:Headers,method:string){
    try {
        let tmp_url = new URL(url)
        let tmp_instance = tmp_url.host
        let tmp_remaining = -1
        let tmp_limit = -1
        let tmp_resetTime = new Date

        if (headers.get('X-RateLimit-Remaining')){
            tmp_remaining = Number(headers.get('X-RateLimit-Remaining'))
        } else {
            return
        }
        if (headers.get('X-RateLimit-Limit')) {
            tmp_limit = Number(headers.get('X-RateLimit-Limit')) 
        } else {
            return
        }
        if (headers.get('X-RateLimit-Reset')) {
            const tmp:string = headers.get('X-RateLimit-Reset')!
            tmp_resetTime = new Date(tmp)
        } else {
            return
        }
        //
        // 3つのヘッダがすべて取得できたら内部変数を書き換え
        last.instance = tmp_instance
        last.remaining = tmp_remaining
        last.limit = tmp_limit
        last.resetTime = tmp_resetTime

        let tmp_remain = remain.get(tmp_instance)

        if (typeof tmp_remain === 'undefined'){
            tmp_remain = new RemainApi
        }

        if (method === 'delete' || (method === 'post' && tmp_url.pathname.endsWith('/unreblog'))) {
            // delete,unreblog
            tmp_remain.delete = {...last}
            remain.set(tmp_instance,tmp_remain)
        } else if (method === 'post' && tmp_url.pathname.match('\/api\/v[12]\/media')) {
            tmp_remain.upload = {...last}
            remain.set(tmp_instance,tmp_remain)
        } else {
            tmp_remain.others = {...last}
            remain.set(tmp_instance,tmp_remain)
        }

    } catch (error) {
        // エラーの場合は読み捨てる
        console.log(error)
    }
}

export function getApiInstance(){
    return last.instance
}

export function getApiRemaining(){
    return last.remaining
}

export function getApiLimit(){
    return last.limit
}

export function getApiResetTime(){
    return last.resetTime
}

function checkResetWithToString(obj:RemainApiObject,mode:IMode):string{
    if (checkReset(obj)){
        if ( mode === 'remaining'  ) {
            return '???'
        } else if ( mode  === 'limit' ) {
            return '???'
        } else if ( mode === 'resetTime' ) {
            return '???'
        }
    } else {
        if ( mode === 'remaining' ) {
            return obj.remaining.toString()
        } else if ( mode === 'limit' ) {
            return obj.limit.toString()
        } else if ( mode === 'resetTime' ) {
            return obj.resetTime.toString()
        }
    }
    return ''
}
function checkReset(obj:RemainApiObject) {
    if ( obj.resetTime.getTime() < new Date().getTime() ){
        obj = {
            remaining: -1,
            limit: -1,
            resetTime: new Date()
        }
        return true
    } else {
        return false
    }
}
export function toastApiRemain(){
    let tmp: string = ''
    
    for (const key of remain.keys()) {
        let tmp_remain = remain.get(key)!
        tmp += `instance: ${key}<br>
        delete/unreblog: ${checkResetWithToString(tmp_remain.delete,'remaining')}/${checkResetWithToString(tmp_remain.delete,'limit')} reset: ${checkResetWithToString(tmp_remain.delete,'resetTime')}<br>
        media upload:${checkResetWithToString(tmp_remain.upload,'remaining')}/${checkResetWithToString(tmp_remain.upload,'limit')} reset: ${checkResetWithToString(tmp_remain.upload,'resetTime')}<br>
        others: ${checkResetWithToString(tmp_remain.others,'remaining')}/${checkResetWithToString(tmp_remain.others,'limit')} reset: ${checkResetWithToString(tmp_remain.others,'resetTime')}<br>
        <br>`
    }
    toast({ html: `${tmp}`, displayLength: 3000 })
}