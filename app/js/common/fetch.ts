import { setLog } from "../platform/first"
import { toast } from "./declareM"
import lang from "./lang"

interface IOptions {
    method: 'post' | 'get' | 'put' | 'delete'
    headers?: { [key: string]: string }
    body?: any
}
export default async function api<T=any>(url: string, options?: IOptions) {
    try {
        if (options?.body && typeof options?.body !== 'string') options.body = JSON.stringify(options.body)
        const response = await fetch(url, options)
        if (!response.ok) {
            if (response.status === 422) throw 422
            const text = await response.text()
            let ret = text
            try {
                const json = JSON.parse(text)
                ret = json.error || text
            } catch (e) {
                
            }
            throw ret
        }
        const json = await response.json()
        return json as T
    } catch (e: any) {
        toast({ html: `Error: ${e[0]}`, displayLength: 5000 })
        throw e
    }
}