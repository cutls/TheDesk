//日付パーサー
export type IDateType = 'relative' | 'unix' | 'full' | 'absolute' | 'medium' | 'double' | 'unix'
const dateTypes = ['relative', 'unix', 'full', 'absolute', 'medium', 'double', 'unix']
export const isDateType = (item: string): item is IDateType => dateTypes.includes(item)
export function date(str: string, datetype: IDateType) {
	if (datetype === 'relative') {
		return `<time class="timeago" datetime="${str}"></time>`
	} else {
		const date = new Date(str)
		if (datetype === 'unix') {
			const unixm = date.getTime()
			return Math.floor(unixm / 1000)
		}
		const now = new Date()
		const month = date.getMonth() + 1
		const min = date.getMinutes().toString().padStart(2, '0')
		const sec = date.getSeconds().toString().padStart(2, '0')
		let ret: string
		if (datetype === 'full') {
			ret = `${date.getFullYear()}/${month}/${date.getDate()} ${date.getHours()}:${min}:${sec}`
		}
		if (date.getFullYear() === now.getFullYear()) {
			if (date.getMonth() === now.getMonth()) {
				if (date.getDate() === now.getDate()) {
					if (datetype === 'medium') {
						ret = `<time class="timeago" datetime="${str}"></time>`
					} else {
						ret = `${date.getHours()}:${min}:${sec}`
					}
				} else {
					ret = `${month}/${date.getDate()} ${date.getHours()}:${min}:${sec}`
				}
			} else {
				ret = `${month}/${date.getDate()} ${date.getHours()}:${min}:${sec}`
			}
		} else {
			ret = `${date.getFullYear()}/${month}/${date.getDate()} ${date.getHours()}:${min}:${sec}`
		}
		if (datetype === 'double') {
			return `<time class="timeago" datetime="${str}"></time>/${ret}`
		} else {
			return ret
		}
	}
}

//特殊フォーマット(インスタンス情報で利用)
export function crat(str: string) {
	const date = new Date(str)
	let mnt
	if (date.getMonth() < 9) {
		mnt = '0' + (date.getMonth() + 1)
	} else {
		mnt = date.getMonth() + 1
	}
	const dat = date.getDate().toString().padStart(2, '0')
	const hrs = date.getHours().toString().padStart(2, '0')
	const mns = date.getMinutes().toString().padStart(2, '0')
	const sec = date.getSeconds().toString().padStart(2, '0')
	let formatStr = 'YYYY-MM-DD hh:mm:ss'
	formatStr = formatStr.replace(/YYYY/g, date.getFullYear().toString())
	formatStr = formatStr.replace(/MM/g, mnt)
	formatStr = formatStr.replace(/DD/g, dat)
	formatStr = formatStr.replace(/hh/g, hrs)
	formatStr = formatStr.replace(/mm/g, mns)
	formatStr = formatStr.replace(/ss/g, sec)

	return formatStr
}
