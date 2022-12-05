const fs = require('fs')
const path = require('path')
const construct = require('./make.js')
const basefile = path.join(__dirname, '../../')
const package = fs.readFileSync(basefile + 'package.json')
const data = JSON.parse(package)
const version = data.version
const codename = data.codename
let ver = `${version} (${codename})`
if (process.argv.indexOf('--prompt') != -1) {
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

construct(ver, basefile, pwa, store)

//if --watch, to yarn dev
if (process.argv.indexOf('--watch') !== -1) {
	const chokidar = require('chokidar')
	console.log(
		'watch mode(not hot-watch): when construction files are changed, refresh view files but not reload. Please reload manually.'
	)
	const watcher = chokidar.watch(basefile + 'view/make', {
		ignored: /view\/make\/(make.*\.js|.*\.generated\.html)/,
		persistent: true
	})
	watcher.on('ready', function () {
		console.log('watching...')
		watcher.on('change', function (path) {
			console.log(path + ' changed.')
			construct(ver, basefile)
		})
	})
}
