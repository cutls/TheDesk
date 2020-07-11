/*ログイン処理・認証までのJS*/
//最初に読むやつ

localStorage.removeItem('kirishima')
localStorage.removeItem('quoters')
localStorage.removeItem('imas')
//stable, 固定タグのことらしい。ふざけるな。
localStorage.removeItem('stable')
const acctList = JSON.parse(localStorage.getItem('multi'))

function ck() {
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
				req = refresh(key, true)
			}
		}
		if(req) {
			Swal.fire({
				title: 'Reload required',
				text: lang.lang_login_changedData,
				type: 'info',
				showCancelButton: true,
				confirmButtonText: lang.lang_no,
				cancelButtonText: lang.lang_yesno
			}).then(result => {
				if(result) location.reload()
			})
		}
		if (obj[0].domain) {
			showElm('#tl')
			ticker()
			multiSelector(false)
			verck(ver)
			showElm('.stw')
			const tips = localStorage.getItem('tips')
			if (tips) {
				tips(tips)
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
	const json = await getApi(start, at)
	if (json.error) {
		console.error('Error:' + json.error)
		M.toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
		return
	}
	let avatar = json['avatar']
	//missingがmissingなやつ
	if (avatar == '/avatars/original/missing.png' || !avatar) {
		avatar = './img/missing.svg'
	}
	const { newName, newProf, newVis } = json
	if (newName != name || newProf != prof || newVis != vis) {
		let ref = {
			at: at,
			name: json['display_name'],
			domain: domain,
			user: json['acct'],
			prof: avatar,
			id: json['id'],
			vis: json['source']['privacy']
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
function ckdb(acct_id) {
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
		var json = idata
		if (json[quoteMarker] == 'enabled') {
			localStorage.setItem('quoters', true)
			localStorage.setItem(`quote_${acct_id}`, true)
		}
	}
	if (!isMisskey(domain)) {
		const start = `https://${domain}/api/v1/instance`
		const json = getApi(start, null)
		if (!json || json.error) {
			return
		}
		const mtc = json['max_toot_chars']
		if (mtc) {
			localStorage.setItem(`letters_${acct_id}`, mtc)
		}
		if (json['feature_quote']) {
			localStorage.setItem(`quote_${acct_id}`, true)
		}
		const str = json['urls']['streaming_api']
		if (str) {
			localStorage.setItem(`streaming_${acct_id}`, str)
		}
	}
}

//アカウントを選択…を実装
function multiSelector(parseC) {
	if (!acctList) return false
	const obj = acctList
	let template
	//StringなのはlocalStorageがStringしか返さないから
	let lastUsed = '0'
	if (localStorage.getItem('mainuse') == 'main') {
		lastUsed = localStorage.getItem('main')
	} else if (localStorage.getItem('last-use')) {
		lastUsed = localStorage.getItem('last-use')
		if (lastUsed == 'webview' || last == 'noauth') {
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
			const strKey = i?.toString()
			if (key == lastUsed) {
				sel = 'selected'
				const domain = acct.domain
				const letters = idata[`${domain}_letters`]
				const textarea = document.querySelector('#textarea')
				if (letters) {
					textarea.setAttribute('data-length', letters)
				} else {
					//手動でアカマネで変えれちゃうから
					const maxLetters = localStorage.getItem('letters_' + key)
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
				document.querySelector('#acct-sel-pro').setAttribute('src', profimg)
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
					document.querySelector('#trendtag').innerHTML = ''
				}
			} else {
				sel = ''
			}
			template = `
			<option value="${key}" data-icon="${acct.prof}" class="left circle" ${sel}>
				@${acct.user} ${acct.domain}
			</option>
			`
			appendPrepend('.acct-sel', template, 'append')
		}
		$('#src-acct-sel').append('<option value="tootsearch">Tootsearch</option>')
		$('#add-acct-sel').append(
			'<option value="noauth">' +
			lang.lang_login_noauth +
			'</option><option value="webview">Twitter</option>'
		)
		$('#dir-acct-sel').append('<option value="noauth">' + lang.lang_login_noauth + '</option>')
	}
	$('select').formSelect()
	if (!parseC) {
		parseColumn(null, true)
	}
}
//インスタンスティッカー
function ticker() {
	const start = 'https://toot-app.thedesk.top/toot/index.php'
	const json = getApi(start, null)
	if(json) localStorage.setItem('ticker', JSON.stringify(json))
}
function isMisskey(domain) {
	return localStorage.getItem(`mode_${domain}`) == 'misskey'
}