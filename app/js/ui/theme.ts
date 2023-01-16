//テーマ適用
export function themes(theme?: string) {
	theme = localStorage.getItem('customtheme-id') || ''
	if (!theme) {
		if (!theme) {
			localStorage.setItem('customtheme-id', 'black')
			theme = 'black'
		}
	}
	postMessage(['themeCSSRequest', theme + '.thedesktheme'], '*')
	const el = document.getElementsByTagName('html')[0]
	el.style.backgroundColor = 'var(--bg)'
	const font = localStorage.getItem('font')
	if (font) {
		el.style.fontFamily = font
	} else {
		el.style.fontFamily = ''
	}
}
themes()
