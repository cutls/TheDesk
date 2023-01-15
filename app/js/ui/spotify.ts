import $ from 'jquery'
import Swal from 'sweetalert2'
import { toast } from '../common/declareM'
import api from '../common/fetch'
import lang from '../common/lang'
import { media } from '../post/img'
export function spotifyConnect() {
	const auth = 'https://spotify.thedesk.top/connect'
	$('#spotify-code-show').removeClass('hide')
	postMessage(['openUrl', auth], '*')
}
export function spotifyAuth() {
	const code = $('#spotify-code').val()?.toString()
	if (!code) return Swal.fire('Please input `code`')
	localStorage.setItem('spotify-token', code)
	$('#spotify-code-show').addClass('hide')
	$('#spotify-enable').addClass('disabled')
	$('#spotify-disable').removeClass('disabled')
}
export async function spotifyDisconnect() {
	const start = `https://spotify.thedesk.top/disconnect?code=${localStorage.getItem('spotify-token')}`
	const json = await api(start, {
		method: 'get',
		headers: {
			'content-type': 'application/json'
		}
	})
	if (!json.success) alert('error')
	localStorage.removeItem('spotify-token')
	checkSpotify()
}
export function checkSpotify() {
	if (localStorage.getItem('spotify-token')) {
		$('#spotify-enable').addClass('disabled')
		$('#spotify-disable').removeClass('disabled')
	} else {
		$('#spotify-enable').removeClass('disabled')
		$('#spotify-disable').addClass('disabled')
	}
	const content = localStorage.getItem('np-temp') || '#NowPlaying {song} / {album} / {artist}\n{url} #SpotifyWithTheDesk'
	$('#np-temp').val(content)
	const flag = localStorage.getItem('artwork')
	if (flag) {
		$('#awk_yes').prop('checked', true)
	} else {
		$('#awk_no').prop('checked', true)
	}
	const flag2 = localStorage.getItem('complete-artwork')
	if (flag2) {
		$('#amw_yes').prop('checked', true)
	} else {
		$('#amw_no').prop('checked', true)
	}
	const flag3 = localStorage.getItem('control-center-np')
	if (flag3) {
		$('#cmw_yes').prop('checked', true)
	} else {
		$('#cmw_no').prop('checked', true)
	}
}
export function spotifyFlagSave() {
	const awk = $('[name=awk]:checked').val()
	if (awk === 'yes') {
		localStorage.setItem('artwork', 'yes')
		toast({ html: lang.lang_spotify_img, displayLength: 3000 })
	} else {
		localStorage.removeItem('artwork')
		toast({ html: lang.lang_spotify_imgno, displayLength: 3000 })
	}
}
export function aMusicFlagSave() {
	const awk = $('[name=amw]:checked').val()
	if (awk === 'yes') {
		localStorage.setItem('complete-artwork', 'yes')
		toast({ html: lang.lang_spotify_img, displayLength: 3000 })
	} else {
		localStorage.removeItem('complete-artwork')
		toast({ html: lang.lang_spotify_imgno, displayLength: 3000 })
	}
}
export function cMusicFlagSave() {
	const awk = $('[name=cmw]:checked').val()
	if (awk === 'yes') {
		localStorage.setItem('control-center-np', 'yes')
		toast({ html: 'コントロールセンターNPをオンにしました', displayLength: 3000 })
	} else {
		localStorage.removeItem('control-center-np')
		toast({ html: 'コントロールセンターNPをオフにしました', displayLength: 3000 })
	}
}
export async function nowplaying(mode: 'spotify' | 'itunes' | 'anynp' | 'lastFm') {
	if (mode === 'spotify') {
		const at = localStorage.getItem('spotify-token')
		if (!at) return Swal.fire(`No token`)
		const start = `https://spotify.thedesk.top/current-playing?code=${at}`
		if (at) {
			const jsonRaw = await api(start, {
				method: 'get',
				headers: {
					'content-type': 'application/json'
				}
			})
			const code = jsonRaw.token
			localStorage.setItem('spotify-token', code)
			const json = jsonRaw.data
			console.table(json)
			if (json.length < 1) {
				return false
			}
			const item = json.item
			const img = item.album.images[0].url
			const flag = localStorage.getItem('artwork')
			if (flag) {
				postMessage(['bmpImage', [img, 0]], '*')
			}
			let content = localStorage.getItem('np-temp') || '#NowPlaying {song} / {album} / {artist}\n{url}'
			const regExp1 = new RegExp('{song}', 'g')
			content = content.replace(regExp1, item.name)
			const regExp2 = new RegExp('{album}', 'g')
			content = content.replace(regExp2, item.album.name)
			const regExp3 = new RegExp('{artist}', 'g')
			content = content.replace(regExp3, item.artists[0].name)
			const regExp4 = new RegExp('{url}', 'g')
			content = content.replace(regExp4, item.external_urls.spotify)
			const regExp5 = new RegExp('{composer}', 'g')
			content = content.replace(regExp5, '')
			const regExp6 = new RegExp('{hz}', 'g')
			content = content.replace(regExp6, '')
			const regExp7 = new RegExp('{bitRate}', 'g')
			content = content.replace(regExp7, '')
			const regExp8 = new RegExp('{lyricist}', 'g')
			content = content.replace(regExp8, '')
			const regExp9 = new RegExp('{bpm}', 'g')
			content = content.replace(regExp9, '')
			const regExp0 = new RegExp('{genre}', 'g')
			content = content.replace(regExp0, '')
			$('#textarea').val(content)
		} else {
			Swal.fire({
				icon: 'info',
				text: lang.lang_spotify_acct,
			})
		}
	} else if (mode === 'itunes') {
		postMessage(['itunes', ''], '*')
	} else if (mode === 'anynp') {
		postMessage(['itunes', 'anynp'], '*')
	} else if (mode === 'lastFm') {
		const user = localStorage.getItem('lastFmUser')
		const start = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&limit=1&api_key=8f113803bfea951b6dde9e56d32458b2&format=json`
		if (user) {
			const json = await api(start, {
				method: 'get',
				headers: {
					'content-type': 'application/json'
				}
			})
			console.table(json)
			if (!json || !json.recenttracks) {
				console.error('no data')
				return false
			}
			const item = json.recenttracks.track[0]
			if (!item['@attr']) return false
			const img = item.image[3]['#text']
			const flag = localStorage.getItem('artwork')
			if (flag && img !== 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png' && img) {
				postMessage(['bmpImage', [img, 0]], '*')
			}
			let content = localStorage.getItem('np-temp') || '#NowPlaying {song} / {album} / {artist}\n{url}'
			const regExp1 = new RegExp('{song}', 'g')
			content = content.replace(regExp1, item.name)
			const regExp2 = new RegExp('{album}', 'g')
			content = content.replace(regExp2, item.album['#text'])
			const regExp3 = new RegExp('{artist}', 'g')
			content = content.replace(regExp3, item.artist['#text'])
			const regExp4 = new RegExp('{url}', 'g')
			content = content.replace(regExp4, '')
			const regExp5 = new RegExp('{composer}', 'g')
			content = content.replace(regExp5, '')
			const regExp6 = new RegExp('{hz}', 'g')
			content = content.replace(regExp6, '')
			const regExp7 = new RegExp('{bitRate}', 'g')
			content = content.replace(regExp7, '')
			const regExp8 = new RegExp('{lyricist}', 'g')
			content = content.replace(regExp8, '')
			const regExp9 = new RegExp('{bpm}', 'g')
			content = content.replace(regExp9, '')
			const regExp0 = new RegExp('{genre}', 'g')
			content = content.replace(regExp0, '')
			$('#textarea').val(content)
		} else {
			Swal.fire({
				icon: 'info',
				text: lang.lang_spotify_acct,
			})
		}
	}
}
export async function npCore(arg: any) {
	console.table(arg)
	if (arg.anynp) {
		const flag = localStorage.getItem('artwork')
		const q = arg.title
		if (flag && localStorage.getItem('complete-artwork')) {
			const aaw = await getUnknownAA(q)
			postMessage(['bmpImage', [aaw.aaw, 0]], '*')
		}
		$('#textarea').val(q)
		return false
	}
	let content = localStorage.getItem('np-temp') || '#NowPlaying {song} / {album} / {artist}\n{url}'
	const flag = localStorage.getItem('artwork')
	const platform = localStorage.getItem('platform')
	const aaw = { aaw: '', album: '' }
	if (platform === 'win32') {
		if (flag && arg.path) {
			media(arg.path, 'image/png', 'new')
		}
	} else if (platform === 'darwin') {
		if (flag && arg.artwork) {
			media(arg.artwork, 'image/png', 'new')
		} else if (flag && localStorage.getItem('complete-artwork')) {
			const q = arg.artist + ' ' + arg.album.name + ' ' + arg.name
			const aaw = await getUnknownAA(q)
			postMessage(['bmpImage', [aaw.aaw, 0]], '*')
		}
	}
	const regExp1 = new RegExp('{song}', 'g')
	content = content.replace(regExp1, arg.name)
	const regExp2 = new RegExp('{album}', 'g')
	if (arg.album) {
		if (arg.album.name) {
			content = content.replace(regExp2, arg.album.name)
		} else {
			if (aaw.album) content = content.replace(regExp2, aaw.album)
			content = content.replace(regExp2, '-')
		}
	} else {
		if (aaw.album) content = content.replace(regExp2, aaw.album)
		content = content.replace(regExp2, '-')
	}
	const regExp3 = new RegExp('{artist}', 'g')
	content = content.replace(regExp3, arg.artist)
	const regExp4 = new RegExp('{url}', 'g')
	content = content.replace(regExp4, '')
	const regExp5 = new RegExp('{composer}', 'g')
	content = content.replace(regExp5, arg.composer)
	const regExp6 = new RegExp('{hz}', 'g')
	content = content.replace(regExp6, arg.sampleRate / 1000 + 'kHz')
	const regExp7 = new RegExp('{lyricist}', 'g')
	content = content.replace(regExp7, '')
	const regExp8 = new RegExp('{bpm}', 'g')
	content = content.replace(regExp8, '')
	const regExp9 = new RegExp('{bitRate}', 'g')
	content = content.replace(regExp9, arg.bitRate + 'kbps')
	const regExp0 = new RegExp('{genre}', 'g')
	content = content.replace(regExp0, arg.genre)
	$('#textarea').val(content)
}
export function spotifySave() {
	const temp = $('#np-temp').val()?.toString()
	if (!temp) return toast({ html: 'No Data', displayLength: 3000 })
	localStorage.setItem('np-temp', temp)
	toast({ html: lang.lang_spotify_np, displayLength: 3000 })
}
if (location.search) {
	const m = location.search.match(/\?mode=([a-zA-Z-0-9]+)\&code=(.+)/)
	if (m) {
		const mode = m[1]
		const codex = m[2]
		if (mode === 'spotify') {
			const coder = codex.split(':')
			localStorage.setItem('spotify', coder[0])
			localStorage.setItem('spotify-refresh', coder[1])
		}
	}
}
async function getUnknownAA(q: string) {
	const start = 'https://itunes.apple.com/search?term=' + q + '&country=JP&entity=song'
	const promise = await fetch(start, {
		method: 'GET',
	})
	const json = await promise.json()
	if (!json.resultCount) {
		return { aaw: '', album: '' }
	}
	const data = json.results[0].artworkUrl100
	return { aaw: data.replace(/100x100/, '512x512'), album: json.results[0].collectionName }
}
