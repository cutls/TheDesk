/*ログイン処理・認証までのJS*/
//最初に読むやつ
//アスタルテ判定初期化

localStorage.removeItem('kirishima')
localStorage.removeItem('quoters')
localStorage.removeItem('imas')
localStorage.removeItem('image')
localStorage.removeItem('stable')
localStorage.setItem('mode_misskey.xyz', 'misskey')
function ck() {
	var main = localStorage.getItem('main')
	if (!main) {
		localStorage.setItem('main', 0)
	}

	//コード受信
	if (location.search) {
		var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/)
		var mode = m[1]
		var codex = m[2]
		if (mode == 'manager' || mode == 'login') {
			code(codex, mode)
		} else {
		}
	}
	var multi = localStorage.getItem('multi')
	if (!multi || multi == '[]') {
		var date = new Date()
		localStorage.setItem('showSupportMe', date.getMonth() + 2)
		location.href = 'acct.html?mode=first&code=true'
	} else {
		var obj = JSON.parse(multi)
		var jp = false
		Object.keys(obj).forEach(function(key) {
			var acct = obj[key]
			if (acct.domain) {
				refresh(key, true)
			}
			if (acct.domain == 'mstdn.jp') {
				jp = true
			}
		})
		if (obj[0].domain) {
			$('#tl').show()
			ticker()
			multiSelector(false)
			verck(ver, jp)
			$('.stw').show()
			if (localStorage.getItem('tips')) {
				tips(localStorage.getItem('tips'))
			}
			$('#something-wrong img').attr('src', '../../img/thinking.svg')
		}
	}
}
ck()

//ログインポップアップ
function login(url) {
	if ($('#linux:checked').val() == 'on') {
		var red = 'urn:ietf:wg:oauth:2.0:oob'
	} else {
		var red = 'thedesk://login'
	}
	localStorage.setItem('redirect', red)
	var start = 'https://' + url + '/api/v1/apps'
	var httpreq = new XMLHttpRequest()
	httpreq.open('POST', start, true)
	httpreq.setRequestHeader('Content-Type', 'application/json')
	httpreq.responseType = 'json'
	httpreq.send(
		JSON.stringify({
			scopes: 'read write follow',
			client_name: 'TheDesk(PC)',
			redirect_uris: red,
			website: 'https://thedesk.top'
		})
	)
	httpreq.onreadystatechange = function() {
		if (httpreq.readyState === 4) {
			var json = httpreq.response
			if (this.status !== 200) {
				setLog(start, this.status, json)
			}
			var auth =
				'https://' +
				url +
				'/oauth/authorize?client_id=' +
				json['client_id'] +
				'&client_secret=' +
				json['client_secret'] +
				'&response_type=code&redirect_uri=' +
				red +
				'&scope=read+write+follow'
			localStorage.setItem('domain_' + acct_id, url)
			localStorage.setItem('client_id', json['client_id'])
			localStorage.setItem('client_secret', json['client_secret'])
			$('#auth').show()
			$('#masara').hide()
			postMessage(['openUrl', auth], '*')

			if ($('#linux:checked').val() == 'on') {
			} else {
				postMessage(['sendSinmpleIpc', 'quit'], '*')
			}
		}
	}
}

//テキストボックスにURL入れた
function instance() {
	var url = $('#url').val()
	login(url)
}

//コードを入れた後認証
function code(code, mode) {
	var red = localStorage.getItem('redirect')
	localStorage.removeItem('redirect')
	if (!code) {
		var code = $('#code').val()
	}
	if (localStorage.getItem('domain_tmp')) {
		var url = localStorage.getItem('domain_tmp')
	} else {
		var url = localStorage.getItem('domain_' + acct_id)
	}
	var start = 'https://' + url + '/oauth/token'
	var id = localStorage.getItem('client_id')
	var secret = localStorage.getItem('client_secret')
	fetch(start, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			grant_type: 'authorization_code',
			redirect_uri: red,
			client_id: id,
			client_secret: secret,
			code: code
		})
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function(error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function(json) {
			todo(json)
			if (json['access_token']) {
				localStorage.setItem(url + '_at', json['access_token'])
				if (mode == 'manager') {
					getdataAdv(url, json['access_token'])
				} else {
					getdata()
				}
			}
		})
}

//ユーザーデータ取得(最初)
function getdata() {
	var acct_id = 0
	var domain = localStorage.getItem('domain_' + acct_id)
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var start = 'https://' + domain + '/api/v1/accounts/verify_credentials'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function(error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function(json) {
			if (json.error) {
				console.error('Error:' + json.error)
				M.toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
				return
			}
			var avatar = json['avatar']
			//missingがmissingなやつ
			if (avatar == '/avatars/original/missing.png') {
				avatar = './img/missing.svg'
			}
			var obj = [
				{
					at: at,
					name: json['display_name'],
					domain: domain,
					user: json['acct'],
					prof: avatar,
					id: json['id'],
					vis: json['source']['privacy']
				}
			]
			var json = JSON.stringify(obj)
			localStorage.setItem('multi', json)
			localStorage.setItem('name_' + acct_id, json['display_name'])
			localStorage.setItem('user_' + acct_id, json['acct'])
			localStorage.setItem('user-id_' + acct_id, json['id'])
			localStorage.setItem('prof_' + acct_id, avatar)
			$('#masara').hide()
			$('#auth').hide()
			$('#tl').show()
			parseColumn()
			ckdb()
		})
}
//ユーザーデータ取得(追加)
function getdataAdv(domain, at) {
	var start = 'https://' + domain + '/api/v1/accounts/verify_credentials'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + at
		}
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function(error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function(json) {
			if (json.error) {
				console.error('Error:' + json.error)
				M.toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
				return
			}
			var avatar = json['avatar']
			//missingがmissingなやつ
			if (avatar == '/avatars/original/missing.png') {
				avatar = '../../img/missing.svg'
			}
			if (json['source']['privacy']) {
				var priv = json['source']['privacy']
			} else {
				var priv = 'public'
			}
			var add = {
				at: at,
				name: json['display_name'],
				domain: domain,
				user: json['acct'],
				prof: avatar,
				id: json['id'],
				vis: priv
			}
			var multi = localStorage.getItem('multi')
			var obj = JSON.parse(multi)
			var target = obj.lengtth
			obj.push(add)
			localStorage.setItem('name_' + target, json['display_name'])
			localStorage.setItem('user_' + target, json['acct'])
			localStorage.setItem('user-id_' + target, json['id'])
			localStorage.setItem('prof_' + target, avatar)
			var json = JSON.stringify(obj)
			localStorage.setItem('multi', json)
			location.href = 'index.html'
		})
}
//ユーザーデータ更新
function refresh(target, loadskip) {
	var multi = localStorage.getItem('multi')
	var obj = JSON.parse(multi)
	if (obj[target].mode == 'misskey') {
		return
	}
	var start = 'https://' + obj[target].domain + '/api/v1/accounts/verify_credentials'
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			Authorization: 'Bearer ' + obj[target].at
		}
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function(error) {
			todo(error)
			setLog(start, 'JSON', error)
			console.error(error)
		})
		.then(function(json) {
			if (json.error) {
				console.error('Error:' + json.error)
				M.toast({ html: lang.lang_fatalerroroccured + 'Error:' + json.error, displayLength: 5000 })
				return
			}
			var avatar = json['avatar']
			//missingがmissingなやつ
			if (avatar == '/avatars/original/missing.png' || !avatar) {
				avatar = './img/missing.svg'
			}
			var ref = {
				at: obj[target].at,
				name: json['display_name'],
				domain: obj[target].domain,
				user: json['acct'],
				prof: avatar,
				id: json['id'],
				vis: json['source']['privacy']
			}
			if (obj[target].background) {
				ref.background = obj[target].background
			}
			if (obj[target].text) {
				ref.text = obj[target].text
			}
			localStorage.setItem('name_' + target, json['display_name'])
			localStorage.setItem('user_' + target, json['acct'])
			localStorage.setItem('user-id_' + target, json['id'])
			localStorage.setItem('prof_' + target, avatar)
			localStorage.setItem('follow_' + target, json['following_count'])
			if (json['source']['sensitive']) {
				localStorage.setItem('nsfw_' + target, 'true')
			} else {
				localStorage.removeItem('nsfw_' + target)
			}
			obj[target] = ref
			var json = JSON.stringify(obj)
			localStorage.setItem('multi', json)
			if (!loadskip) {
				load()
			}
		})
}
//MarkdownやBBCodeの対応、文字数制限をチェック
//絶対ストリーミングを閉じさせないマン
function ckdb(acct_id) {
	var domain = localStorage.getItem('domain_' + acct_id)
	localStorage.removeItem('home_' + acct_id)
	localStorage.removeItem('bb_' + acct_id)
	localStorage.removeItem('md_' + acct_id)
	localStorage.removeItem('local_' + acct_id)
	localStorage.removeItem('public_' + acct_id)
	localStorage.removeItem('notification_' + acct_id)
	localStorage.removeItem('post_' + acct_id)
	localStorage.removeItem('fav_' + acct_id)
	localStorage.removeItem('bt_' + acct_id)
	localStorage.removeItem('followlocale_' + acct_id)
	if (domain == 'kirishima.cloud') {
		localStorage.setItem('kirishima', 'true')
	} else if (domain == 'imastodon.net') {
		localStorage.setItem('imas', 'true')
		$('.imasonly').show()
	}
	var at = localStorage.getItem('acct_' + acct_id + '_at')
	var bbcode = domain + '_bbcode'
	var letters = domain + '_letters'
	var quoteMarker = domain + '_quote'
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
			.then(function(response) {
				return response.json()
			})
			.catch(function(error) {
				console.error(error)
			})
			.then(function(json) {
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
		Object.keys(obj).forEach(function(key) {
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
	var start = 'https://toot.app/toot/index.php'
	fetch(start, {
		method: 'GET',
		cors: true,
		headers: {
			'content-type': 'application/json'
		}
	})
		.then(function(response) {
			if (!response.ok) {
				response.text().then(function(text) {
					setLog(response.url, response.status, text)
				})
			}
			return response.json()
		})
		.catch(function(error) {
			console.error(error)
		})
		.then(function(json) {
			if (json) {
				localStorage.setItem('ticker', JSON.stringify(json))
			}
		})
}
