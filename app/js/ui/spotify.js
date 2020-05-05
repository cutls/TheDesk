function spotifyConnect() {
	var auth = 'https://accounts.spotify.com/authorize?client_id=0f18e54abe0b4aedb4591e353d3aff69&redirect_uri=https://thedesk.top/spotify-connect&response_type=code&scope=user-read-currently-playing'
	var platform = localStorage.getItem('platform')
	if (platform == 'win32') {
		postMessage(['openUrl', auth], '*')
		postMessage(['sendSinmpleIpc', 'quit'], '*')
	} else {
		auth = auth + '&state=code'
		$('#spotify-code-show').removeClass('hide')
		postMessage(['openUrl', auth], '*')
	}
}
function spotifyAuth() {
	var code = $('#spotify-code').val()
	localStorage.setItem('spotify', 'code')
	localStorage.setItem('spotify-refresh', code)
	$('#spotify-code-show').addClass('hide')
	$('#spotify-enable').addClass('disabled')
	$('#spotify-disable').removeClass('disabled')
}
function spotifyDisconnect() {
	localStorage.removeItem('spotify')
	localStorage.removeItem('spotify-refresh')
	checkSpotify()
}
function checkSpotify() {
	if (localStorage.getItem('spotify')) {
		$('#spotify-enable').addClass('disabled')
		$('#spotify-disable').removeClass('disabled')
	} else {
		$('#spotify-enable').removeClass('disabled')
		$('#spotify-disable').addClass('disabled')
	}
	var content = localStorage.getItem('np-temp')
	if (!content || content == '' || content == 'null') {
		var content = '#NowPlaying {song} / {album} / {artist}\n{url} #SpotifyWithTheDesk'
	}
	$('#np-temp').val(content)
	var flag = localStorage.getItem('artwork')
	if (flag) {
		$('#awk_yes').prop('checked', true)
	} else {
		$('#awk_no').prop('checked', true)
	}
	var flag2 = localStorage.getItem('complete-artwork')
	if (flag2) {
		$('#amw_yes').prop('checked', true)
	} else {
		$('#amw_no').prop('checked', true)
	}
}
function spotifyFlagSave() {
	var awk = $('[name=awk]:checked').val()
	if (awk == 'yes') {
		localStorage.setItem('artwork', 'yes')
		M.toast({ html: lang.lang_spotify_img, displayLength: 3000 })
	} else {
		localStorage.removeItem('artwork')
		M.toast({ html: lang.lang_spotify_imgno, displayLength: 3000 })
	}
}
function aMusicFlagSave() {
	var awk = $('[name=amw]:checked').val()
	if (awk == 'yes') {
		localStorage.setItem('complete-artwork', 'yes')
		M.toast({ html: lang.lang_spotify_img, displayLength: 3000 })
	} else {
		localStorage.removeItem('complete-artwork')
		M.toast({ html: lang.lang_spotify_imgno, displayLength: 3000 })
	}
}
function nowplaying(mode) {
	if (mode == 'spotify') {
		var start = 'https://thedesk.top/now-playing?at=' + localStorage.getItem('spotify') + '&rt=' + localStorage.getItem('spotify-refresh')
		var at = localStorage.getItem('spotify')
		if (at) {
			fetch(start, {
				method: 'GET',
				headers: {
					'content-type': 'application/json',
				},
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
					todo(error)
					setLog(start, 'JSON', error)
					console.error(error)
				})
				.then(function (json) {
					console.table(json)
					if (json.length < 1) {
						return false
					}
					var item = json.item
					var img = item.album.images[0].url
					var flag = localStorage.getItem('artwork')
					if (flag) {
						postMessage(['bmpImage', [img, 0]], '*')
					}
					var content = localStorage.getItem('np-temp')
					if (!content || content == '' || content == 'null') {
						var content = '#NowPlaying {song} / {album} / {artist}\n{url}'
					}
					var regExp = new RegExp('{song}', 'g')
					content = content.replace(regExp, item.name)
					var regExp = new RegExp('{album}', 'g')
					content = content.replace(regExp, item.album.name)
					var regExp = new RegExp('{artist}', 'g')
					content = content.replace(regExp, item.artists[0].name)
					var regExp = new RegExp('{url}', 'g')
					content = content.replace(regExp, item.external_urls.spotify)
					var regExp = new RegExp('{composer}', 'g')
					content = content.replace(regExp, '')
					var regExp = new RegExp('{hz}', 'g')
					content = content.replace(regExp, '')
					var regExp = new RegExp('{bitRate}', 'g')
					content = content.replace(regExp, '')
					var regExp = new RegExp('{lyricist}', 'g')
					content = content.replace(regExp, '')
					var regExp = new RegExp('{bpm}', 'g')
					content = content.replace(regExp, '')
					var regExp = new RegExp('{genre}', 'g')
					content = content.replace(regExp, '')
					$('#textarea').val(content)
				})
		} else {
			Swal.fire({
				type: 'info',
				title: lang.lang_spotify_acct,
			})
		}
	} else if (mode == 'itunes') {
		postMessage(['itunes', ''], '*')
	} else if (mode == 'lastFm') {
		var user = localStorage.getItem('lastFmUser')
		var start = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + user + '&limit=1&api_key=8f113803bfea951b6dde9e56d32458b2&format=json'

		if (user) {
			fetch(start, {
				method: 'GET',
				headers: {
					'content-type': 'application/json',
				},
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
					todo(error)
					setLog(start, 'JSON', error)
					console.error(error)
				})
				.then(function (json) {
					console.table(json)
					if (!json || !json.recenttracks) {
						console.error('no data')
						return false
					}
					var item = json.recenttracks.track[0]
					if(!item['@attr']) return false
					var img = item.image[3]['#text']
					var isImg = item.streamable*1
					var flag = localStorage.getItem('artwork')
					if (flag && isImg && img) {
						postMessage(['bmpImage', [img, 0]], '*')
					}
					var content = localStorage.getItem('np-temp')
					if (!content || content == '' || content == 'null') {
						var content = '#NowPlaying {song} / {album} / {artist}\n{url}'
					}
					var regExp = new RegExp('{song}', 'g')
					content = content.replace(regExp, item.name)
					var regExp = new RegExp('{album}', 'g')
					content = content.replace(regExp, item.album['#text'])
					var regExp = new RegExp('{artist}', 'g')
					content = content.replace(regExp, item.artist['#text'])
					var regExp = new RegExp('{url}', 'g')
					content = content.replace(regExp,'')
					var regExp = new RegExp('{composer}', 'g')
					content = content.replace(regExp, '')
					var regExp = new RegExp('{hz}', 'g')
					content = content.replace(regExp, '')
					var regExp = new RegExp('{bitRate}', 'g')
					content = content.replace(regExp, '')
					var regExp = new RegExp('{lyricist}', 'g')
					content = content.replace(regExp, '')
					var regExp = new RegExp('{bpm}', 'g')
					content = content.replace(regExp, '')
					var regExp = new RegExp('{genre}', 'g')
					content = content.replace(regExp, '')
					$('#textarea').val(content)
				})
		} else {
			Swal.fire({
				type: 'info',
				title: lang.lang_spotify_acct,
			})
		}
	}
}
async function npCore(arg) {
	console.table(arg)
	var content = localStorage.getItem('np-temp')
	if (!content || content == '' || content == 'null') {
		var content = '#NowPlaying {song} / {album} / {artist}\n{url}'
	}
	var flag = localStorage.getItem('artwork')
	var platform = localStorage.getItem('platform')
	var aaw = { aaw: '', album: '' }
	if (platform == 'win32') {
		if (flag && arg.path) {
			media(arg.path, 'image/png', 'new')
		}
	} else if (platform == 'darwin') {
		if (flag && arg.artwork) {
			media(arg.artwork, 'image/png', 'new')
		} else if (flag && localStorage.getItem('complete-artwork')) {
			var q = arg.artist + ' ' + arg.album.name + ' ' + arg.name
			aaw = await getUnknownAA(q)
			postMessage(['bmpImage', [aaw.aaw, 0]], '*')
		}
	}
	var regExp = new RegExp('{song}', 'g')
	content = content.replace(regExp, arg.name)
	var regExp = new RegExp('{album}', 'g')
	if (arg.album) {
		if (arg.album.name) {
			content = content.replace(regExp, arg.album.name)
		} else {
			if (aaw.album) content = content.replace(regExp, aaw.album)
			content = content.replace(regExp, '-')
		}
	} else {
		if (aaw.album) content = content.replace(regExp, aaw.album)
		content = content.replace(regExp, '-')
	}
	var regExp = new RegExp('{artist}', 'g')
	content = content.replace(regExp, arg.artist)
	var regExp = new RegExp('{url}', 'g')
	content = content.replace(regExp, '')
	var regExp = new RegExp('{composer}', 'g')
	content = content.replace(regExp, arg.composer)
	var regExp = new RegExp('{hz}', 'g')
	content = content.replace(regExp, arg.sampleRate / 1000 + 'kHz')
	var regExp = new RegExp('{lyricist}', 'g')
	content = content.replace(regExp, '')
	var regExp = new RegExp('{bpm}', 'g')
	content = content.replace(regExp, '')
	var regExp = new RegExp('{bitRate}', 'g')
	content = content.replace(regExp, arg.bitRate + 'kbps')
	var regExp = new RegExp('{genre}', 'g')
	content = content.replace(regExp, arg.genre)
	$('#textarea').val(content)
}
function spotifySave() {
	var temp = $('#np-temp').val()
	localStorage.setItem('np-temp', temp)
	M.toast({ html: lang.lang_spotify_np, displayLength: 3000 })
}
if (location.search) {
	var m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/)
	var mode = m[1]
	var codex = m[2]
	if (mode == 'spotify') {
		var coder = codex.split(':')
		localStorage.setItem('spotify', coder[0])
		localStorage.setItem('spotify-refresh', coder[1])
	} else {
	}
}
async function getUnknownAA(q) {
	const start = 'https://itunes.apple.com/search?term=' + q + '&country=JP&entity=song'
	let promise = await fetch(start, {
		method: 'GET',
	})
	const json = await promise.json()
	if (!json.resultCount) {
		return []
	}
	const data = json.results[0].artworkUrl100
	return { aaw: data.replace(/100x100/, '512x512'), album: json.results[0].collectionName }
}
