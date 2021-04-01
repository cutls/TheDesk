const fs = require('fs')
const path = require('path')
const basefile = path.join(__dirname, '../../')
const package = fs.readFileSync(basefile + 'package.json')
const data = JSON.parse(package)
const version = data.version
const codename = data.codename
let ver = `${version} (${codename})`
if (process.argv.indexOf('--automatic') === -1) {
	let input = require('readline-sync').question('version string [empty: ' + ver + ' (default)]? ')
	if (input) {
		ver = input
	}
}
var pwa = false
if (process.argv.indexOf('--pwa') > 0) {
	var pwa = true
}
var store = false
if (process.argv.indexOf('--store') > 0) {
	var store = true
}

function main(ver, basefile, pwa, store) {
	const execSync = require('child_process').execSync
	let gitHash = execSync('git rev-parse HEAD')
		.toString()
		.trim()
	fs.writeFileSync(basefile + 'git', gitHash)
	console.log('Constructing view files ' + ver)
	const langs = ['ja', 'ja-KS', 'en', 'bg', 'cs', 'de',
	 'es-AR', 'it-IT', 'zh-CN', 'zh-TW', 'fr-FR', 'no-NO', 'pt-BR', 'ru-RU', 'es-ES', 'ps']
	const langsh = [
		'日本語',
		'日本語(関西)',
		'English',
		'български',
		'Česky',
		'Deutsch',
		'Español, argentina',
		'italiano',
		'简体中文',
		'繁體中文(β)',
		'français(β)',
		'norsk(β)',
		'Português, brasileiro(β)',
		'русский(β)',
		'Español(β)',
		'Crowdin translate system(beta)'
	]
	const simples = ['acct', 'index', 'setting', 'update', 'setting']
	const samples = [
		'acct.sample.html',
		'index.sample.html',
		'setting.sample.html',
		'update.sample.html',
		'setting.sample.js'
	]
	const pages = ['acct.html', 'index.html', 'setting.html', 'update.html', 'setting.vue.js']
	let langstr = ''
	let refKey = []
	const enJson = JSON.parse(fs.readFileSync(basefile + 'view/make/language/en/main.json', 'utf8'))
	const jaJson = JSON.parse(fs.readFileSync(basefile + 'view/make/language/ja/main.json', 'utf8'))
	for (let n = 0; n < langs.length; n++) {
		let lang = langs[n]
		let targetDir = basefile + 'view/' + lang
		if (!fs.existsSync(targetDir)) {
			fs.mkdirSync(targetDir)
		}
		langstr =
			langstr + `<option value="${lang}">${langsh[n]}</option>`
		let mainJson = JSON.parse(
			fs.readFileSync(basefile + 'view/make/language/' + lang + '/main.json', 'utf8')
		)
		if (lang == 'ja-KS') {
			Object.keys(jaJson).forEach(function (key) {
				if (!mainJson[key]) {
					mainJson[key] = jaJson[key]
				}
			})
		} else if (lang != 'en') {
			Object.keys(enJson).forEach(function (key) {
				if (!mainJson[key]) {
					mainJson[key] = enJson[key]
				}
			})
		}
		mainJson.language = lang
		fs.writeFileSync(
			basefile + 'view/' + lang + '/main.js',
			JSON.stringify(mainJson).replace(/^{/, 'var lang = {')
		)
	}
	for (let i = 0; i < samples.length; i++) {
		let sample = samples[i]
		let sourceParent = fs.readFileSync(basefile + 'view/make/' + sample, 'utf8')
		let englishRefer = JSON.parse(
			fs.readFileSync(basefile + 'view/make/language/en/' + simples[i] + '.json', 'utf8')
		)
		let jaRefer = JSON.parse(
			fs.readFileSync(basefile + 'view/make/language/ja/' + simples[i] + '.json', 'utf8')
		)
		for (let j = 0; j < langs.length; j++) {
			let source = sourceParent
			let lang = langs[j]
			let target = JSON.parse(
				fs.readFileSync(
					basefile + 'view/make/language/' + lang + '/' + simples[i] + '.json',
					'utf8'
				)
			)
			if (lang == 'ja') {
				Object.keys(target).forEach(function (key) {
					refKey.push(key)
					let str = target[key]
					if (pages[i] == 'setting.vue.js') {
						str = str.replace(/'/g, "\\'")
					}
					var regExp = new RegExp('@@' + key + '@@', 'g')
					source = source.replace(regExp, str)
				})
			} else {
				for (let k = 0; k < refKey.length; k++) {
					let tarKey = refKey[k]
					if (target[tarKey]) {
						var str = target[tarKey]
					} else {
						if (lang == 'ja-KS') {
							var str = jaRefer[tarKey]
						} else {
							var str = englishRefer[tarKey]
						}
					}
					if (pages[i] == 'setting.vue.js') {
						if (str) {
							str = str.replace(/'/g, '\\')
						}
					}
					var regExp = new RegExp('@@' + tarKey + '@@', 'g')
					source = source.replace(regExp, str)
				}
			}
			if (lang == 'ps') {
				source = source.replace(/@@comment-start@@/g, '')
				source = source.replace(/@@comment-end@@/g, '')
			} else {
				source = source.replace(/@@comment-start@@/g, '<!--')
				source = source.replace(/@@comment-end@@/g, '-->')
			}
			source = source.replace(/@@versionLetter@@/g, ver)
			source = source.replace(/@@gitHash@@/g, gitHash)
			source = source.replace(/@@gitHashShort@@/g, gitHash.slice(0, 7))
			source = source.replace(/@@lang@@/g, lang)
			source = source.replace(/@@langlist@@/g, langstr)
			if (pwa) {
				source = source.replace(/@@pwa@@/g, `<link rel="manifest" href="../../manifest.json" />
				<script>var pwa = true;"serviceWorker"in navigator&&navigator.serviceWorker.register("/sw.pwa.js").then(e=>{});</script>`)
				source = source.replace(/@@node_base@@/g, 'dependencies')
				source = source.replace(/@@pwaClass@@/g, 'pwaView')
			} else {
				source = source.replace(/@@pwa@@/g, '<script>var pwa = false;</script>')
				source = source.replace(/@@node_base@@/g, 'node_modules')
				source = source.replace(/@@pwaClass@@/g, '')
			}
			if (store) {
				source = source.replace(/@@store@@/g, '<script>var store = true;</script>')
			} else {
				source = source.replace(/@@store@@/g, '<script>var store = false;</script>')
			}
			fs.writeFileSync(basefile + 'view/' + lang + '/' + pages[i], source)
		}
	}
}
main(ver, basefile, pwa, store)

//if --watch, to yarn dev
if (process.argv.indexOf('--watch') !== -1) {
	const chokidar = require('chokidar')
	console.log(
		'watch mode(not hot-watch): when construction files are changed, refresh view files but not reload. Please reload manually.'
	)
	const watcher = chokidar.watch(basefile + 'view/make', {
		ignored: 'view/make/make.js',
		persistent: true
	})
	watcher.on('ready', function () {
		console.log('watching...')
		watcher.on('change', function (path) {
			console.log(path + ' changed.')
			main(ver, basefile)
		})
	})
}
