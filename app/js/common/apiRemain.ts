
let instance: string = ""
let remaining: number = -1
let limit: number = -1
let resetTime: Date = new Date

export function parseRemain(url:string,headers:Headers){
    try {
        let tmp_instance = new URL(url).host
        let tmp_remaining = -1
        let tmp_limit = -1
        let tmp_resetTime = new Date
        if (headers.get('X-RateLimit-Remaining')){
            tmp_remaining = Number(headers.get('X-RateLimit-Remaining'))
        }
        if (headers.get('X-RateLimit-Limit')) {
            tmp_limit = Number(headers.get('X-RateLimit-Limit')) 
        }
        if (headers.get('X-RateLimit-Reset')) {
            const tmp:string = headers.get('X-RateLimit-Reset')!
            tmp_resetTime = new Date(tmp)
        }
        //
        // エラーでなかったら内部変数を書き換え
        instance = tmp_instance
        remaining = tmp_remaining
        limit = tmp_limit
        resetTime = tmp_resetTime
    } catch (error) {
        // エラーの場合は読み捨てる
        console.log(error)
    }
}

export function getApiInstance(){
    return instance
}

export function getApiRemaining(){
    return remaining
}

export function getApiLimit(){
    return limit
}

export function getApiResetTime(){
    return resetTime
}