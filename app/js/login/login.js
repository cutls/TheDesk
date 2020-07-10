/*ログイン処理・認証までのJS*/
//最初に読むやつ

localStorage.removeItem('kirishima')
localStorage.removeItem('quoters')
localStorage.removeItem('imas')
//stable, 固定タグのことらしい。ふざけるな。
localStorage.removeItem('stable')

function ck() {
	const main = localStorage.getItem('main')
	if (!main) {
		localStorage.setItem('main', 0)
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
		for (let i = 0; i < keymap.length; i++) {
			const key = keymap[i]
			const acct = obj[key]
			if (acct.domain) {
				refresh(key, true)
			}
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
	const multi = localStorage.getItem('multi')
	let obj = JSON.parse(multi)
	const {mode, domain, at, background, text} = obj[target]
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
		localStorage.setItem('nsfw_' + target, 'true')
	} else {
		localStorage.removeItem('nsfw_' + target)
	}
	obj[target] = ref
	const save = JSON.stringify(obj)
	localStorage.setItem('multi', save)
	if (!loadskip) {
		load()
	}
}
//MarkdownやBBCodeの対応、文字数制限をチェック
//絶対ストリーミングを閉じさせないマン
function ckdb(acct_id) {
	const domain = localStorage.getItem(`domain_${acct_id}`)
	if (domain == 'kirishima.cloud') {
		localStorage.setItem('kirishima', 'true')
	} else if (domain == 'imastodon.net') {
		localStorage.setItem('imas', 'true')
		showElm('.imasonly')
	}
	const at = localStorage.getItem(`acct_${acct_id}_at`)
	const letters = `${domain}_letters`
	const quoteMarker = `${domain}_quote`
	
	if (idata) {
		//check and replace json to idata
		var json = idata
		if (json[quoteMarker] == 'enabled') {
			localStorage.setItem('quoters', 'true')
			localStorage.setItem('quote_' + acct_id, 'true')
		}
		if (json[bbcode]) {
			if (json[bbcode] == 'enabled') {
				localStorage.setItem('bb_' + acct_id, 'true')
			} else {
				localStorage.removeItem('bb_' + acct_id)
				$("[data-activates='bbcode']").addClass('disabled')
				$("[data-activates='bbcode']").prop('disabled', true)
			}
		} else {
			localStorage.removeItem('bb_' + acct_id)
			$("[data-activates='bbcode']").addClass('disabled')
			$("[data-activates='bbcode']").addClass('disabled', true)
		}

		if (json[domain + '_markdown'] == 'enabled') {
			localStorage.setItem('md_' + acct_id, 'true')
			$('.markdown').show()
		} else {
			$('.anti-markdown').hide()
			$('.markdown').hide()
			localStorage.removeItem('bb_' + acct_id)
		}
		if (json[domain + '_home']) {
			localStorage.setItem('home_' + acct_id, json[domain + '_home'])
		}
		if (json[domain + '_local']) {
			localStorage.setItem('local_' + acct_id, json[domain + '_local'])
		}
		if (json[domain + '_public']) {
			localStorage.setItem('public_' + acct_id, json[domain + '_public'])
		}
		if (json[domain + '_notification']) {
			localStorage.setItem('notification_' + acct_id, json[domain + '_notification'])
		}
		if (json[domain + '_post']) {
			localStorage.setItem('post_' + acct_id, json[domain + '_post'])
		}
		if (json[domain + '_fav']) {
			localStorage.setItem('fav_' + acct_id, json[domain + '_fav'])
		}
		if (json[domain + '_bt']) {
			localStorage.setItem('bt_' + acct_id, json[domain + '_bt'])
		}
		if (json[domain + '_follow']) {
			localStorage.setItem('followlocale_' + acct_id, json[domain + '_follow'])
		}
	}
	if (localStorage.getItem('mode_' + domain) != 'misskey') {
		var start = 'https://' + domain + '/api/v1/instance'
		fetch(start, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		})
			.then(function (response) {
				return response.json()
			})
			.catch(function (error) {
				console.error(error)
			})
			.then(function (json) {
				if (json.error) {
					console.error(json.error)
					return
				}
				if (json) {
					if (json['max_toot_chars']) {
						localStorage.setItem('letters_' + acct_id, json['max_toot_chars'])
					}
					if (json['urls']['streaming_api']) {
						localStorage.setItem('streaming_' + acct_id, json['urls']['streaming_api'])
					} else {
						localStorage.removeItem('streaming_' + acct_id)
					}
				}
			})
	} else {
	}
}

//アカウントを選択…を実装
function multiSelector(parseC) {
	var multi = localStorage.getItem('multi')
	if (!multi) {
		var obj = []
		var json = JSON.stringify(obj)
		localStorage.setItem('multi', json)
	} else {
		var obj = JSON.parse(multi)
	}
	var templete
	if (localStorage.getItem('mainuse') == 'main') {
		var last = localStorage.getItem('main')
	} else if (localStorage.getItem('last-use')) {
		var last = localStorage.getItem('last-use')
		if (last == 'webview' || last == 'noauth') {
			last = '0'
		}
	} else {
		var last = '0'
	}
	last = last + ''
	var sel
	if (obj.length < 1) {
		$('#src-acct-sel').html('<option value="tootsearch">Tootsearch</option>')
		$('#add-acct-sel').html('<option value="noauth">' + lang.lang_login_noauth + '</option>')
	} else {
		Object.keys(obj).forEach(function (key) {
			var acct = obj[key]
			var list = key * 1 + 1
			if (key + '' === last) {
				sel = 'selected'
				var domain = acct.domain
				localStorage.setItem('domain_' + key, domain)
				if (idata[domain + '_letters']) {
					$('#textarea').attr('data-length', idata[domain + '_letters'])
				} else {
					var maxletters = localStorage.getItem('letters_' + key)
					if (maxletters > 0) {
						$('#textarea').attr('data-length', maxletters)
					} else {
						$('#textarea').attr('data-length', 500)
					}
				}
				if (idata[domain + '_glitch']) {
					$('#local-button').removeClass('hide')
				}
				var profimg = acct.prof
				//localStorage.setItem("prof_" + key, profimg);
				if (!profimg) {
					profimg = '../../img/missing.svg'
				}
				$('#acct-sel-prof').attr('src', profimg)
				if (domain) {
					var cc = '(' + domain + ')'
				} else {
					var cc = ''
				}
				$('#toot-post-btn').text(lang.lang_toot + cc)
				if (acct.background && acct.background != 'def' && acct.text && acct.text != 'def') {
					$('#toot-post-btn').removeClass('indigo')
					$('#toot-post-btn').css('background-color', '#' + acct.background)
					$('#toot-post-btn').css('color', acct.text)
				} else {
				}
				if (domain == 'kirishima.cloud') {
					$('#faicon-btn').show()
				} else {
					$('#faicon-btn').hide()
				}
				if (domain == 'imastodon.net') {
					trendTag()
				} else {
					$('#trendtag').html('')
				}
			} else {
				sel = ''
			}
			templete =
				'<option value="' +
				key +
				'" data-icon="' +
				acct.prof +
				'" class="left circle" ' +
				sel +
				'>' +
				acct.user +
				'@' +
				acct.domain +
				'</option>'
			$('.acct-sel').append(templete)
		})
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

//バージョンエンコ
function enc(ver) {
	var ver = ver.replace(/\s/g, '')
	var ver = ver.replace(/\(/g, '-')
	var ver = ver.replace(/\)/g, '')
	var ver = ver.replace(/\[/g, '_')
	var ver = ver.replace(/\]/g, '')
	return ver
}
//インスタンスティッカー
function ticker() {
	var start = 'https://toot-app.thedesk.top/toot/index.php'
	fetch(start, {
		method: 'GET',
		cors: true,
		headers: {
			'content-type': 'application/json'
		}
	})
		.then(function (response) {
			if (!response.ok) {
				response.text().then(function (text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function (error) {
			console.error(error)
		})
		.then(function (json) {
			if (json) {
				localStorage.setItem('ticker', JSON.stringify(json))
			}
		})
}
