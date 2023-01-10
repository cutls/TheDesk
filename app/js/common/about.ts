//このソフトについて
export function about() {
	postMessage(['sendSinmpleIpc', 'about'], '*')
}