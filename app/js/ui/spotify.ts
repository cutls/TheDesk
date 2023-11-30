import $ from 'jquery'
import Swal from 'sweetalert2'
import { toast } from '../common/declareM'
import api from '../common/fetch'
import lang from '../common/lang'
import { media } from '../post/img'
const apiGateway = `https://ep9jquu2w4.execute-api.ap-northeast-1.amazonaws.com/thedesk/spotify`
export function spotifyConnect() {
	const auth = `${apiGateway}?state=connect`
	$('#spotify-code-show').removeClass('hide')
	postMessage(['openUrl', auth], '*')
}
export async function spotifyAuth(code: string) {
	$('#spotify-enable').addClass('disabled')
	const start = `${apiGateway}?state=auth&code=${code}`
	try {
		const json = await api(start, {
			method: 'get',
			headers: {
				'content-type': 'application/json',
			}
		})
		const { accessToken, refreshToken } = json
		localStorage.removeItem('spotify-token')
		localStorage.setItem('spotifyV2Token', accessToken)
		localStorage.setItem('spotifyV2Refresh', refreshToken)
		localStorage.setItem('spotifyV2Expires', `${(new Date().getTime() / 1000) + 3600}`)
	} catch (e: any) {
		Swal.fire({
			icon: 'info',
			text: `Error Spotify Auth`
		})
	} finally {
		checkSpotify()
	}
}
export async function spotifyDisconnect() {
	localStorage.removeItem('spotifyV2Token')
	localStorage.removeItem('spotifyV2Refresh')
	localStorage.removeItem('spotifyV2Expires')
	checkSpotify()
}
export function checkSpotify() {
	if (localStorage.getItem('spotifyV2Token')) {
		$('#spotify-enable').addClass('disabled')
		$('#spotify-disable').removeClass('disabled')
	} else {
		$('#spotify-enable').removeClass('disabled')
		$('#spotify-disable').addClass('disabled')
	}
	const contentRaw = localStorage.getItem('np-temp')
	const content = (contentRaw === 'null' || !contentRaw) ? '#NowPlaying {song} / {album} / {artist}\n{url} #SpotifyWithTheDesk' : contentRaw
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
		const json = await getSpotifyData()
		if (json.length < 1) {
			return false
		}
		const item = json.item
		const img = item.album.images[0].url
		const flag = localStorage.getItem('artwork')
		if (flag) {
			postMessage(['bmpImage', [img, 0]], '*')
		}
		const contentRaw = localStorage.getItem('np-temp')
		let content = (contentRaw === 'null' || !contentRaw) ? '#NowPlaying {song} / {album} / {artist}\n{url} #SpotifyWithTheDesk' : contentRaw
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
					'content-type': 'application/json',
				},
			})
			if (!json || !json.recenttracks) {
				console.warn('no data')
				return false
			}
			const item = json.recenttracks.track[0]
			if (!item['@attr']) return false
			const img = item.image[3]['#text']
			const flag = localStorage.getItem('artwork')
			if (flag && img !== 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png' && img) {
				postMessage(['bmpImage', [img, 0]], '*')
			}
			const contentRaw = localStorage.getItem('np-temp')
			let content = (contentRaw === 'null' || !contentRaw) ? '#NowPlaying {song} / {album} / {artist}\n{url} #SpotifyWithTheDesk' : contentRaw
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
	const contentRaw = localStorage.getItem('np-temp')
	let content = (contentRaw === 'null' || !contentRaw) ? '#NowPlaying {song} / {album} / {artist}\n{url} #SpotifyWithTheDesk' : contentRaw
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
async function getUnknownAA(q: string) {
	const start = `https://itunes.apple.com/search?term=${q}&country=JP&entity=song`
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
export async function getSpotifyData() {
	if (localStorage.getItem('spotify-token')) {
		const result = await Swal.fire({
			title: lang.lang_spotify_migrateV2,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: lang.lang_yesno,
			cancelButtonText: lang.lang_no,
		})
		if (result.value) return spotifyConnect()
	}
	const expires = localStorage.getItem('spotifyV2Expires') || `${new Date().getTime()}`
	if (new Date().getTime() / 1000 > parseInt(expires, 10)) await refreshSpotifyToken()
	const at = localStorage.getItem('spotifyV2Token')
	if (!at) return Swal.fire(`No token`)
	const start = `https://api.spotify.com/v1/me/player/currently-playing`
	if (at) {
		try {
			const jsonRaw = await fetch(start, {
				method: 'get',
				headers: {
					'content-type': 'application/json',
					Authorization: `Bearer ${at}`
				},
			})
			if (jsonRaw.status === 204) return
			const json = await jsonRaw.json()
			return json
		} catch (e: any) {
			console.log(e)
			Swal.fire({
				icon: 'info',
				text: `Error Spotify Auth`
			})
			return null
		}
	}
}
async function refreshSpotifyToken() {
	const refreshToken = localStorage.getItem('spotifyV2Refresh')
	const start = `${apiGateway}?state=refresh&refreshToken=${refreshToken}`
	try {
		const json = await api(start, {
			method: 'get',
			headers: {
				'content-type': 'application/json',
			}
		})
		const { accessToken, refreshToken } = json
		localStorage.setItem('spotifyV2Token', accessToken)
		localStorage.setItem('spotifyV2Refresh', refreshToken)
		localStorage.setItem('spotifyV2Expires', `${(new Date().getTime() / 1000) + 3600}`)
	} catch (e: any) {
		Swal.fire({
			icon: 'info',
			text: `Error Spotify Auth`
		})
	}
}