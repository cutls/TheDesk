import { stripTags } from '../platform/first'
import { tips, todo } from '../ui/tips'
import { parseRemain } from './apiRemain'

interface IOptions {
	method: 'post' | 'get' | 'put' | 'delete' | 'patch'
	headers?: { [key: string]: string }
	body?: any
}

export default async function api<T = any>(url: string, options?: IOptions, throughJsonStringify?: boolean) {
	try {
		if (options?.body && typeof options?.body === 'object' && !throughJsonStringify) options.body = JSON.stringify(options.body)
		const response = await fetch(url, options)
		if (!response.ok) {
			if (response.status === 422) throw 422
			const text = await response.text()
			let ret = text
			try {
				const json = JSON.parse(text)
				ret = json.error || text
			} catch (e) {
				console.error(e)
			}
			throw ret
		}
		const json = await response.json()
		parseRemain(url,response.headers, !options ? 'get' : options.method)
		if ( localStorage.getItem('tips') === 'ver'){
			tips('refresh')
		}
		return json as T
	} catch (e: any) {
		const eStr = typeof e === 'string' ? e : e[0]
		todo(`Error: ${stripTags(eStr)}`)
		throw e
	}
}
