//左下のメッセージ

import { escapeHTML } from '../platform/first'
import $ from 'jquery'
import { execPlugin } from '../platform/plugin'
import { toast } from '../common/declareM'
import api  from '../common/fetch'
import Swal from 'sweetalert2'
import lang from '../common/lang'
import { getApiInstance, getApiLimit, getApiRemaining, getApiResetTime, toastApiRemain} from '../common/apiRemain'
const tipsList = ['ver', 'clock', 'memory', 'spotify', 'custom']
export const isITips = (item: string): item is ITips => tipsList.includes(item)

export function todo(mes: string) {
	let todcTrigger: NodeJS.Timeout | null = null
	if (todcTrigger) clearInterval(todcTrigger)
	$('#message').text(mes)
	$('#message').fadeIn()
	todcTrigger = setTimeout(todc, 4000)
}
export function todc() {
	$('#message').fadeOut()
}
//reverse
export function bottomReverse() {
	$('#bottom').toggleClass('reverse')
	$('.leftside').toggleClass('reverse')
	if ($('#bottom').hasClass('reverse')) {
		localStorage.removeItem('reverse')
	} else {
		localStorage.setItem('reverse', 'true')
	}
}
let spotint: NodeJS.Timer | null = null
type ITips = 'ver' | 'clock' | 'memory' | 'spotify' | 'custom' | 'refresh'
export function tips(mode: ITips, custom?: any) {
	postMessage(['sendSinmpleIpc', 'endmem'], '*')
	if ( clockint ) {
		clearInterval(clockint)
		clockint = null
	}
	if ( spotint ) {
		clearInterval(spotint)
		spotint = null
	}
	const isRefresh:boolean = mode === 'refresh'
	if (isRefresh){
		mode = localStorage.getItem('tips') as ITips
	}
	if (mode === 'ver') {
		if (!isRefresh) tipsToggle()
		$('#tips-text').html(
			`<img src="../../img/desk.png" width="20" onclick="todo('TheDesk is a nice client!: TheDesk ${localStorage.getItem('ver')} git: ${globalThis.gitHash}')">
			${localStorage.getItem('ver')} {${globalThis.gitHash.slice(0, 7)}}
			[<i class="material-icons" style="font-size:1.2rem;top: 3px;position: relative;">supervisor_account</i><span id="persons">1+</span>]
			<div onclick="toastApiRemain()" title="reset time = ${getApiResetTime()}">[API(${getApiInstance()}):${getApiRemaining().toString()}/${getApiLimit().toString()}]</div>`
		)
		localStorage.setItem('tips', 'ver')
	} else if (mode === 'clock') {
		if (!isRefresh) tipsToggle()
		localStorage.setItem('tips', 'clock')
		clock()
	} else if (mode === 'memory') {
		if (!isRefresh) tipsToggle()
		localStorage.setItem('tips', 'memory')
		startMem()
	} else if (mode === 'spotify') {
		if (!isRefresh) tipsToggle()
		localStorage.setItem('tips', 'spotify')
		spotifyTips()
	} else if (mode === 'custom') {
		if (!isRefresh) tipsToggle()
		localStorage.setItem('tips', `custom:${custom}`)
		execPlugin(custom, 'tips', null)
	}
}
//メモリ
function startMem() {
	postMessage(['sendSinmpleIpc', 'startmem'], '*')
}
export function renderMem(use: number, cpu: string, total: number, core: number, uptime: number) {
	const day = Math.floor(uptime / 60 / 60 / 24)
	const hour = Math.floor((uptime / 60 / 60) % 24)
		.toString()
		.padStart(2, '0')
	const min = Math.floor((uptime / 60) % 60)
		.toString()
		.padStart(2, '0')
	const sec = Math.floor(uptime % 60)
		.toString()
		.padStart(2, '0')
	const time = `${day ? day + ' days ' : ''}${hour ? hour + ':' : ''}${min}:${sec}`
	//Intel
	cpu = cpu.replace('Intel(R)', '').replace('(TM)', '').replace(' CPU', '')
	//AMD
	cpu = cpu.replace('AMD ', '').replace(/\s[0-9]{1,3}-Core\sProcessor/, '')
	$('#tips-text').html(
		`${escapeHTML(cpu)} x ${core} RAM: ${Math.floor(use / 1024 / 1024 / 102.4) / 10}/${Math.floor(total / 1024 / 1024 / 102.4) / 10}GB(${Math.floor((use / total) * 100)}%) UP:${time}
		<div onclick="toastApiRemain()" title="reset time = ${getApiResetTime()}">[API(${getApiInstance()}):${getApiRemaining().toString()}/${getApiLimit().toString()}]</div>`
	)
}
//Spotify
export async function spotifyTips() {
	if (spotint) {
		clearInterval(spotint)
		spotint = null
	}
	const at = localStorage.getItem('spotify-token')
	if (!at) return toast({ html: 'Error Spotify Connection' })
	const start = `https://spotify.thedesk.top/current-playing?code=${localStorage.getItem('spotify-token')}`
	if (at) {
		const jsonRaw = await api(start, {
			method: 'get',
			headers: {
				'content-type': 'application/json',
			},
		})
		const code = jsonRaw.token
		localStorage.setItem('spotify-token', code)
		const json = jsonRaw.data
		let ms = json.progress_ms
		if (!ms) return tips('ver')
		const last = 1000 - (ms % 1000)
		const item = json.item
		const img = item.album.images[0].url
		const artisttxt = item.artists.map((a) => escapeHTML(a.name)).join(',')
		await sleep(last)
		let tms = item.duration_ms
		const per = (ms / item.duration_ms) * 100
		ms = ms / 1000
		tms = tms / 1000
		const s = (Math.round(ms) % 60).toString().padStart(2, '0')
		const m = (Math.round(ms) - (Math.round(ms) % 60)) / 60
		const ts = (Math.round(tms) % 60).toString().padStart(2, '0')
		const tm = (Math.round(tms) - (Math.round(tms) % 60)) / 60
		const html = `
				<div id="spot-box">
					<div id="spot-refresh">
						<i class="material-icons pointer" onclick="spotifyTips  ()" style="font-size:20px">refresh</i>
						<i class="material-icons pointer" onclick="nowplaying('spotify');show()" style="font-size:20px">send</i>
					</div>
					<div id="spot-cover">
						<img src="${img}" id="spot-img" draggable="false">
					</div>
					<div id="spot-name">
						${escapeHTML(item.name)}
						<span class="gray sml" id="spot-art">${artisttxt}</span>
					</div>
					<div id="spot-time">
						<span id="spot-m">${m}</span>:<span id="spot-s">${s}</span>/${tm}:${ts}</span>
					</div>
					<div class="progress grey">
					<div class="determinate spotify-prog grey lighten-2"
					 style="width:${per}%" data-s="${Math.round(ms)}" data-total="${item.duration_ms}">
					</div>
				</div>
				</div>`
		$('#tips-text').html(html)
		spotint = setInterval(spotStart, 1000)
	} else {
		Swal.fire({
			icon: 'info',
			text: lang.lang_spotify_acct,
		})
		tips('ver')
		return false
	}
}
function spotStart() {
	const total = parseInt($('.spotify-prog').attr('data-total') || '0', 10)
	const s = parseInt($('.spotify-prog').attr('data-s') || '0', 10)
	const news = s + 1
	const per = (news * 100000) / total
	const ns = (news % 60).toString().padStart(2, '0')
	const nm = (news - (news % 60)) / 60
	if (per >= 100) {
		if (spotint) {
			clearInterval(spotint)
			spotint = null
		}
		spotifyTips()
	} else {
		$('#spot-m').text(nm)
		$('#spot-s').text(ns)
	}
	$('.spotify-prog').attr('data-s', news)
	$('.spotify-prog').css('width', per + '%')
}
//時計
let clockint: NodeJS.Timer | null = null
async function clock() {
	const now = new Date()
	const last = 1000 - (now.getTime() % 1000)
	await sleep(last)
	if (!clockint) {
		clockint = setInterval(clockStart, 1000)
	}
}
function clockStart() {
	const nowTime = new Date()
	const nowHour = nowTime.getHours().toString().padStart(2, '0')
	const nowMin = nowTime.getMinutes().toString().padStart(2, '0')
	const nowSec = nowTime.getSeconds().toString().padStart(2, '0')
	const msg = `${nowTime.getFullYear()}/${nowTime.getMonth() + 1}/${nowTime.getDate()}
		<span style="font-size:20px">${nowHour}:${nowMin}:${nowSec}</span>`
	$('#tips-text').html(`${msg}
	<div onclick="toastApiRemain()" title="reset time = ${getApiResetTime()}">[API(${getApiInstance()}):${getApiRemaining().toString()}/${getApiLimit().toString()}]</div>`)
}

const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec))
export function tipsToggle() {
	$('#tips').toggleClass('hide')
	$('#tips-menu').toggleClass('hide')
}
