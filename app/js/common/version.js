//バージョンチェッカー
async function verck(ver) {
	console.log('%c Welcome😊 ' + ver, 'color: red;font-size:200%;')
	document.querySelector('body').classList.add(localStorage.getItem('platform'))
	const date = new Date()
	let showVer = false
	if (localStorage.getItem('ver') != ver && localStorage.getItem('winstore')) {
		showVer = true
		console.log('%c Thank you for your update🎉', 'color: red;font-size:200%;')
		if (localStorage.getItem('winstore') && !pwa) {
			openRN()
		}
	}
	localStorage.setItem('ver', ver)
	if (!showVer) {
		console.log(showVer)
		if (
			date.getFullYear() * 100 + date.getMonth() + 1 >= localStorage.getItem('showSupportMe') ||
			!localStorage.getItem('showSupportMe')
		) {
			if (date.getMonth() == 11) {
				yrs = date.getFullYear() + 1
				nextmonth = yrs * 100 + 1
			} else {
				yrs = date.getFullYear()
				nextmonth = yrs * 100 + date.getMonth() + 2
			}
			if (lang.language != 'ja') {
				document.querySelector('#support-btm-ja').classList.add('hide')
				document.querySelector('#support-btm-en').classList.remove('hide')
			}
			localStorage.setItem('showSupportMe', nextmonth)
			document.querySelector('#support-btm').classList.remove('hide')
			document.querySelector('#support-btm').animate([
				{
					bottom: '-500px'
				},
				{
					bottom: '0'
				}
			], 300);
		}
	}
	const platform = localStorage.getItem('platform')
	console.log('Your platform:' + platform)
	if (!localStorage.getItem('winstore') && !pwa) {
		document.querySelector('#start').style.display = 'flex'
	}
	let winstore = false
	if (
		localStorage.getItem('winstore') == 'brewcask' ||
		localStorage.getItem('winstore') == 'snapcraft' ||
		localStorage.getItem('winstore') == 'winstore'
	) {
		winstore = true
	} else {
		winstore = false
	}
	const l = 5
	// 生成する文字列に含める文字セット
	const c = 'abcdefghijklmnopqrstuvwxyz0123456789'
	const cl = c.length
	let r = ''
	for (var i = 0; i < l; i++) {
		r += c[Math.floor(Math.random() * cl)]
	}
	const start = 'https://thedesk.top/ver.json'
	const mess = await getApi(start, null)
	console.table(mess)
	if (mess) {
		let newest = null
		if (platform == 'darwin') {
			newest = mess.desk_mac
		} else {
			newest = mess.desk
		}
		if (newest == ver) {
			todo(lang.lang_version_usever.replace('{{ver}}', mess.desk))
			//betaかWinstoreならアプデチェックしない
		} else if (ver.indexOf('beta') != -1 || winstore) {
			//skipped
		} else {
			if (localStorage.getItem('new-ver-skip')) {
				if (localStorage.getItem('next-ver') != newest) {
					postMessage(['sendSinmpleIpc', 'update'], '*')
				} else {
					console.warn(lang.lang_version_skipver)
					todo(lang.lang_version_skipver)
				}
			} else {
				postMessage(['sendSinmpleIpc', 'update'], '*')
			}
		}
	}
	let lni = localStorage.getItem('last-notice-id')
	if (!lni) {
		localStorage.setItem('last-notice-id', 0)
		lni = 0
	}
	const getNotice = 'https://thedesk.top/notice/index.php?since_id=' + lni
	const notices = await getApi(getNotice, null)
	if (notices.length < 1) {
		return false
	} else {
		localStorage.setItem('last-notice-id', notices[0].ID)
		for (i = 0; i < notices.length; i++) {
			var obj = notices[i]
			if (obj.ID * 1 <= lni) {
				break
			} else {
				toastInterpret(obj)
			}
		}
	}
}
let infostreaming = false
function infowebsocket() {
	infows = new WebSocket('wss://thedesk.top/ws/')
	infows.onopen = function (mess) {
		console.log([tlid, ':Connect Streaming Info:', mess])
		infostreaming = true
	}
	infows.onmessage = function (mess) {
		console.log([tlid, ':Receive Streaming:', JSON.parse(mess.data)])
		const obj = JSON.parse(mess.data)
		localStorage.setItem('last-notice-id', obj.id)
		if (obj.type != 'counter') {
			toastInterpret(obj)
		} else {
			const people = document.querySelector('#persons')
			if(people) {
				people.innerText = obj.text
			}
		}
	}
	infows.onerror = function (error) {
		infostreaming = false
		console.error('Error closing:info')
		console.error(error)
		return false
	}
	infows.onclose = function () {
		infostreaming = false
		console.error('Closing:info')
	}
}
setInterval(function () {
	if (!infostreaming) {
		console.log('try to connect to base-streaming')
		infowebsocket()
	}
}, 10000)
async function toastInterpret(obj) {
	if (obj.type == 'textv2') {
		if (~obj.languages.indexOf(lang.language)) {
			let showVer = true
			let toot = null
			if (obj.toot != '') {
				toot = `<button class="btn-flat toast-action" data-toot="${obj.toot}">Show</button>`
			}
			if (obj.ver == ver) {
				showVer = true
			} else {
				showVer = false
			}
			if (obj.domain != '') {
				const multi = localStorage.getItem('multi')
				if (multi) {
					showVer = false
					const accts = JSON.parse(multi)
					const keys = Object.keys(accts)
					for (let i = 0; i < accts.length; i++) {
						const key = keys[i]
						const acct = accts[key]
						if (acct.domain == obj.domain) {
							showVer = true
							break
						}
					}
				}
			}
			if (showVer) {
				M.toast({
					html: `${escapeHTML(obj.text)} ${toot} <span class="sml grey-text">(スライドして消去)</span>`,
					displayLength: 86400
				})
				await sleep(500)
				const targets = document.querySelectorAll('.toast-action')
				for (let j = 0; j < targets.length; j++) {
					const target = targets[j]
					const toot = target.getAttribute('data-toot')
					target.addEventListener('click', () => detEx(toot, 'main'))
				}

			}
		}
	}
}
function openRN() {
	console.log(kirishima)
	M.Modal.getInstance(document.querySelector('#releasenote')).open()
	if (lang.language == 'ja') {
		verp = ver.replace('(', '').replace('.', '-').replace('.', '-').replace('[', '-').replace(']', '').replace(')', '').replace(' ', '_')
		showElm(`#release-${verp}`)
	} else {
		showElm('#release-en')
	}
}
async function closeSupport() {
	document.querySelector('#support-btm').animate([
		{
			bottom: '0'
		},
		{
			bottom: '-300px'
		}
	], 300);
	await sleep(300)
	document.querySelector('#support-btm').classList.add('hide')
}
function storeDialog(platform, ver) {
	if (document.querySelector('body').classList.contain('accessibility')) return false
	let mes = false
	if (platform == 'win32') {
		mes = lang.lang_version_platform
	} else if (platform == 'linux') {
		mes = lang.lang_version_platform_linux
	} else if (platform == 'darwin') {
		mes = lang.lang_version_platform_mac
	}
	if (mes) {
		Swal.fire({
			title: 'Select your platform',
			text: mes,
			type: 'info',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#3085d6',
			confirmButtonText: lang.lang_no,
			cancelButtonText: lang.lang_yesno
		}).then(result => {
			//逆にしてる
			if (!result.value) {
				localStorage.setItem('winstore', 'winstore')
			} else {
				localStorage.setItem('winstore', 'localinstall')
			}
			localStorage.setItem('ver', ver)
			showVer = true
			if (pwa) return false
			console.log('%c Thank you for your update🎉', 'color: red;font-size:200%;')
			openRN()
		})
	} else {
		localStorage.setItem('ver', ver)
		showVer = true
		console.log('%c Thank you for your update🎉', 'color: red;font-size:200%;')
		openRN()
	}

}
function closeStart() {
	$('#start').css('display', 'none')
	document.querySelector('#start').style.display = 'none'
	const platform = localStorage.getItem('platform')
	const ver = localStorage.getItem('ver')
	storeDialog(platform, ver)
}
