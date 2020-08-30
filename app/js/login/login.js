/*ログイン処理・認証までのJS*/
//最初に読むやつ

localStorage.removeItem('kirishima')
localStorage.removeItem('quoters')
localStorage.removeItem('imas')
//stable, 固定タグのことらしい。ふざけるな。
localStorage.removeItem('stable')
const acctList = JSON.parse(localStorage.getItem('multi'))

async function ck() {
	const main = localStorage.getItem('main')
	if (!main) {
		localStorage.setItem('main', '0')
	}

	//コード受信
	if (location.search) {
		const m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/)
		const mode = m[1]
		const codex = m[2]
		if (mode == 'manager' || mode == 'login') {
			code(codex, mode)
		} else {
		}
	}
	const multi = localStorage.getItem('multi')
	if (!multi || multi == '[]') {
		const date = new Date()
		localStorage.setItem('showSupportMe', date.getMonth() + 2)
		location.href = 'acct.html?mode=first&code=true'
	} else {
		const obj = JSON.parse(multi)
		const keymap = Object.keys(obj)
		let req = false
		for (let i = 0; i < keymap.length; i++) {
			const key = keymap[i]
			const acct = obj[key]
			if (acct.domain) {
				let refreshed = await refresh(key, true)
				if (refreshed) req = true
			}
		}
		if (req) {
			Swal.fire({
				title: 'Reload required',
				text: lang.lang_login_changedData,
				type: 'info',
				showCancelButton: true,
				confirmButtonText: lang.lang_no,
				cancelButtonText: lang.lang_yesno
			}).then(result => {
				if (result) location.reload()
			})
		}
		if (obj[0].domain) {
			showElm('#tl')
			ticker()
			parseColumn()
			verck(ver)
			showElm('.stw')
			const tipsType = localStorage.getItem('tips')
			if (tipsType) {
				tips(tipsType)
			}
			document.querySelector('#something-wrong img').setAttribute('src', '../../img/thinking.svg')
		}
	}
}
ck()
//ユーザーデータ更新
async function refresh(target, loadskip) {
	let obj = acctList
	let requireReload = false
	const { mode, domain, at, background, text, name, prof, vis } = obj[target]
	if (mode == 'misskey') {
		return
	}
	const start = `https://${domain}/api/v1/accounts/verify_credentials`
	let json
	try {
		json = await getApi(start, at)
	} catch {
		return false
	}
	if (json.error) {
		console.error('Error:' + json.error)
		M.toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
		return
	}
	if (!json) return false
	let avatar = json['avatar']
	//missingがmissingなやつ
	if (avatar == '/avatars/original/missing.png' || !avatar) {
		avatar = './img/missing.svg'
	}
	const newName = json.display_name
	const newProf = avatar
	const newVis = json.source.privacy
	if (newName != name || newProf != prof || newVis != vis) {
		let ref = {
			at: at,
			name: newName,
			domain: domain,
			user: json['acct'],
			prof: avatar,
			id: json['id'],
			vis: newVis
		}
		if (background) {
			ref.background = background
		}
		if (text) {
			ref.text = text
		}
		if (json['source']['sensitive']) {
			localStorage.setItem('nsfw_' + target, true)
		} else {
			localStorage.removeItem('nsfw_' + target)
		}
		obj[target] = ref
		const save = JSON.stringify(obj)
		localStorage.setItem('multi', save)
		requireReload = true
	}
	if (!loadskip) {
		load()
	} else {
		return requireReload
	}
}
//MarkdownやBBCodeの対応、文字数制限をチェック
//絶対ストリーミングを閉じさせないマン
async function ckdb(acct_id) {
	const domain = localStorage.getItem(`domain_${acct_id}`)
	if (domain == 'kirishima.cloud') {
		localStorage.setItem('kirishima', true)
	} else if (domain == 'imastodon.net') {
		localStorage.setItem('imas', true)
		showElm('.imasonly')
	}
	const at = localStorage.getItem(`acct_${acct_id}_at`)
	const letters = `${domain}_letters`
	const quoteMarker = `${domain}_quote`

	if (idata) {
		//check and replace json to idata
		const json = idata
		if (json[quoteMarker] == 'enabled') {
			localStorage.setItem('quoters', true)
			localStorage.setItem(quoteMarker, true)
		}
	}
	if (!isMisskey(domain)) {
		const start = `https://${domain}/api/v1/instance`
		let json
		try {
			json = await getApi(start, null)
		} catch {
			return null
		}
		if (!json || json.error) {
			return
		}
		const mtc = json['max_toot_chars']
		if (mtc) {
			localStorage.setItem(letters, mtc)
		}
		if (json['feature_quote']) {
			localStorage.setItem(quoteMarker, true)
		}
		const str = json['urls']['streaming_api']
		if (str) {
			localStorage.setItem(`streaming_${domain}`, str)
		}
	}
}

//アカウントを選択…を実装
function multiSelector() {
	let obj = acctList
	//if (!obj) obj = JSON.parse(localStorage.getItem('multi'))
	let template = ''
	//StringなのはlocalStorageがStringしか返さないから
	let lastUsed = '0'
	if (localStorage.getItem('mainuse') == 'main') {
		lastUsed = localStorage.getItem('main')
	} else if (localStorage.getItem('last-use')) {
		lastUsed = localStorage.getItem('last-use')
		if (lastUsed == 'webview' || lastUsed == 'noauth') {
			lastUsed = '0'
		}
	} else {
		lastUsed = '0'
	}
	let sel
	if (obj.length < 1) {
		document.querySelector('#src-acct-sel').innerHTML = '<option value="tootsearch">Tootsearch</option>'
		document.querySelector('#add-acct-sel').innerHTML = `<option value="noauth">${lang.lang_login_noauth}</option>`
	} else {
		for (let i = 0; i < obj.length; i++) {
			const acct = obj[i]
			const strKey = i.toString()
			if (strKey == lastUsed) {
				sel = 'selected'
				const domain = acct.domain
				const letters = idata[`${domain}_letters`]
				const textarea = document.querySelector('#textarea')
				if (letters) {
					textarea.setAttribute('data-length', letters)
				} else {
					//手動でアカマネで変えれちゃうから
					const maxLetters = localStorage.getItem(`${domain}_letters`)
					if (maxLetters > 0) {
						textarea.setAttribute('data-length', maxLetters)
					} else {
						textarea.setAttribute('data-length', 500)
					}
				}
				if (idata[`${domain}_glitch`]) {
					document.querySelector('#local-button').classList.remove('hide')
				}
				let profimg = acct.prof
				if (!profimg) {
					profimg = '../../img/missing.svg'
				}
				document.querySelector('#acct-sel-prof').setAttribute('src', profimg)
				let cc = ''
				if (domain) {
					cc = `(${domain})`
				}
				const tpb = document.querySelector('#toot-post-btn')
				tpb.innerText = lang.lang_toot + cc
				if (acct.background && acct.background != 'def' && acct.text && acct.text != 'def') {
					tpb.classList.remove('indigo')
					tpb.style.backgroundColor = `#${acct.background}`
					tpb.style.color = `#${acct.text}`
				}
				if (domain == 'imastodon.net') {
					trendTag()
				} else {
					if (document.querySelector('#trendtag')) document.querySelector('#trendtag').innerHTML = ''
				}
			} else {
				sel = ''
			}
			template = template + `
			<option value="${strKey}" data-icon="${acct.prof}" class="left circle" ${sel}>@${acct.user}@${acct.domain}
			</option>
			`
		}
		const forSrc = template + '<option value="tootsearch">Tootsearch</option>'
		const forAdd = template + `
			<option value="noauth">${lang.lang_login_noauth}</option>
			<option value="webview">Twitter</option>
		`
		const forDir = template + `<option value="noauth">${lang.lang_login_noauth}</option>`
		document.querySelector('#post-acct-sel').innerHTML = template
		document.querySelector('#list-acct-sel').innerHTML = template
		document.querySelector('#filter-acct-sel').innerHTML = template
		document.querySelector('#src-acct-sel').innerHTML = forSrc
		document.querySelector('#add-acct-sel').innerHTML = forAdd
		document.querySelector('#dir-acct-sel').innerHTML = forDir
	}
	const elems = document.querySelectorAll('select')
	M.FormSelect.init(elems, null)
}
//インスタンスティッカー
async function ticker() {
	const start = 'https://toot-app.thedesk.top/toot/index.php'
	const json = await getApi(start, null)
	if (json) localStorage.setItem('ticker', JSON.stringify(json))
}
function isMisskey(domain) {
	return localStorage.getItem(`mode_${domain}`) == 'misskey'
}