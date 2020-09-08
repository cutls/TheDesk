//テーマ適用
function themes(theme) {
	if (!theme) {
		var theme = localStorage.getItem('customtheme-id')
		if (!theme) {
			localStorage.setItem('customtheme-id', 'black')
		}
	}
	postMessage(['themeCSSRequest', theme + '.thedesktheme'], '*')
	var el = document.getElementsByTagName('html')[0]
	el.style.backgroundColor = 'var(--bg)'
}
themes()
