//テーマ適用
function themes(theme) {
	if (!theme) {
		var theme = localStorage.getItem('theme')
		if (!theme) {
			var theme = 'black'
			localStorage.setItem('theme', 'black')
		}
	}
	var el = document.getElementsByTagName('html')[0]

	el.classList.remove('indigotheme')
	el.classList.remove('greentheme')
	el.classList.remove('browntheme')
	el.classList.remove('blacktheme')
	el.classList.remove('bluetheme')
	el.classList.remove('customtheme')
	el.classList.add(theme + 'theme')
	var font = localStorage.getItem('font')
	if (font) {
		font = font.replace(/"(.+)"/, '$1')
		el.style.fontFamily = '"' + font + '"'
	} else {
		el.style.fontFamily = ''
	}
	if (theme == 'custom') {
		if (localStorage.getItem('customtheme-id')) {
			postMessage(['themeCSSRequest', localStorage.getItem('customtheme-id')], '*')
		}
	}
	el.style.backgroundColor = 'var(--bg)'
}
themes()
