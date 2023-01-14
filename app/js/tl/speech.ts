import lang from "../common/lang"
import $ from 'jquery'
import { stripTags } from "../platform/first"
import { toast } from "../common/declareM"

let $voise: SpeechSynthesisVoice
const isBouyomi = !!localStorage.getItem('voice_bouyomi')
const $voiseName = lang.lang_speech
const $voices = speechSynthesis.getVoices()
const $synthes = new SpeechSynthesisUtterance()
$voise = $.grep($voices, function(n, i) {
	return n.name === $voiseName
})[0]
$synthes.voice = $voise // 音声の設定
localStorage.removeItem('voicebank')
speechSynthesis.cancel()
if (!localStorage.getItem('voice_vol')) localStorage.setItem('voice_vol', '1')
const voiceRate = parseInt(localStorage.getItem('voice_speed') || '1', 10)
$synthes.rate = voiceRate
const voicePitch = parseInt(localStorage.getItem('voice_pitch') || '1', 10)
$synthes.pitch = voicePitch
const voiceVol = localStorage.getItem('voice_vol') || '1'
$synthes.volume = parseInt(voiceVol, 10)
export function say(msgr: string) {
	const msg = voiceParse(msgr)
	const voice = localStorage.getItem('voicebank') || '[]'
	const obj = JSON.parse(voice)
	if (!obj.lenth) {
		const json = JSON.stringify([msg])
		localStorage.setItem('voicebank', json)
	} else {
		obj.push([msg])
		const json = JSON.stringify(obj)
		localStorage.setItem('voicebank', json)
	}
}
let $repeat = setInterval(function() {
	if (!speechSynthesis.speaking) {
		const voice = localStorage.getItem('voicebank')
		if (voice) {
			const obj = JSON.parse(voice)
			if (obj[0]) {
				if (isBouyomi) {
					const delim = '<bouyomi>'
					const thisVoiceRate = voiceRate * 10 + 70
					const thisVoicePitch = voicePitch * 50 + 70
					const thisVoiceVol = parseInt(voiceVol, 10) * 100
					console.log(thisVoiceRate, thisVoicePitch, thisVoiceVol)
					const command = 0x0001
					const type = 0
					const sends =`${command}${delim}${thisVoiceRate}${delim}${thisVoicePitch}${delim}${thisVoiceVol}${delim}${type}${delim}${obj[0]}`
					bouyomiConnect(sends)
				} else {
					$synthes.text = obj[0]
					speechSynthesis.speak($synthes)
				}

				obj.splice(0, 1)
				const json = JSON.stringify(obj)
				localStorage.setItem('voicebank', json)
			}
		}
	}
}, 300)
function voiceParse(msg: string) {
	msg = stripTags(msg)
	msg = msg.replace(/#/g, '')
	msg = msg.replace(/'/g, '')
	msg = msg.replace(/"/g, '')
	msg = msg.replace(/https?:\/\/[a-zA-Z0-9./-@_=?%&-]+/g, '')
	return msg
}
export function voiceToggle(tlid: string) {
	const voiceck = localStorage.getItem('voice_' + tlid)
	if (voiceck) {
		localStorage.removeItem('voice_' + tlid)
		speechSynthesis.cancel()
		if (localStorage.getItem('voice_bouyomi')) {
			const command = 0x0010
			const sends = '' + command
			bouyomiConnect(sends)
		}
		$('#sta-voice-' + tlid).text('Off')
		$('#sta-voice-' + tlid).css('color', 'red')
		parseColumn(tlid)
	} else {
		localStorage.setItem('voice_' + tlid, 'true')
		$('#sta-voice-' + tlid).text('On')
		$('#sta-voice-' + tlid).css('color', '#009688')
		parseColumn(tlid)
	}
}
export function voiceCheck(tlid: string) {
	const voiceck = localStorage.getItem('voice_' + tlid)
	if (voiceck) {
		$('#sta-voice-' + tlid).text('On')
		$('#sta-voice-' + tlid).css('color', '#009688')
	} else {
		$('#sta-voice-' + tlid).text('Off')
		$('#sta-voice-' + tlid).css('color', 'red')
	}
}
export function voicePlay() {
	if (speechSynthesis.speaking) {
		speechSynthesis.cancel()
	} else {
		const text = $('#voicetxt').val()?.toString() || ''
		let rate = parseInt($('#voicespeed').val()?.toString() || '1', 10)
		let pitch = parseInt($('#voicepitch').val()?.toString() || '1', 10)
		const vol = parseInt($('#voicevol').val()?.toString() || '1', 10)
		if (localStorage.getItem('voice_bouyomi')) {
			const delim = '<bouyomi>'
			rate = rate * 1 + 70
			pitch = pitch * 1 + 70
			const command = 0x0001 // コマンドです。0x0001.読み上げ/0x0010.ポーズ/0x0020.再開/0x0030.スキップ
			/*const speed = 100; // 速度50-200。-1を指定すると本体設定
            const pitch = 100; // ピッチ50-200。-1を指定すると本体設定
            const volume = 100; // ボリューム0-100。-1を指定すると本体設定*/
			const type = 0 // 声質(0.本体設定/1.女性1/2.女性2/3.男性1/4.男性2/5.中性/6.ロボット/7.機械1/8.機械2)
			const sends =
				'' + command + delim + rate + delim + pitch + delim + vol + delim + type + delim + text
			bouyomiConnect(sends)
		} else {
			$synthes.text = text
			$synthes.rate = rate / 10
			$synthes.pitch = pitch / 50
			$synthes.volume = vol / 100
			speechSynthesis.speak($synthes)
		}
	}
}

export function voiceSettings() {
	const awk = $('[name=bym]:checked').val()
	if (awk === 'yes') {
		localStorage.setItem('voice_bouyomi', 'yes')
		toast({ html: 'Bouyomi Chan connection requires WebSocket Plugin', displayLength: 3000 })
	} else {
		localStorage.removeItem('voice_bouyomi')
	}
	localStorage.setItem('voice_speed', (parseInt($('#voicespeed').val()?.toString() || '1', 10) / 10).toString())
	localStorage.setItem('voice_pitch', (parseInt($('#voicepitch').val()?.toString() || '1', 10) / 50).toString())
	localStorage.setItem('voice_vol', (parseInt($('#voicevol').val()?.toString() || '1', 10) / 100).toString())
	toast({ html: lang.lang_speech_refresh, displayLength: 3000 })
}
export function voiceSettingLoad() {
	const flag = localStorage.getItem('voice_bouyomi')
	if (flag) {
		$('#bym_yes').prop('checked', true)
	} else {
		$('#bym_no').prop('checked', true)
	}
	const speed = parseInt(localStorage.getItem('voice_speed') || '1', 10)
	const pitch = parseInt(localStorage.getItem('voice_pitch') || '1', 10)
	const vol = parseInt(localStorage.getItem('voice_vol') || '1', 10)
	if (speed) {
		$('#voicespeed').val(speed * 10)
		$('#voicespeedVal').text(speed * 10)
	}
	if (pitch) {
		$('#voicepitch').val(pitch * 50)
		$('#voicepitchVal').text(pitch * 50)
	}
	if (vol) {
		$('#voicevol').val(vol * 100)
		$('#voicevolVal').text(vol * 100)
	}
}
function bouyomiConnect(sends: string) {
	const socket = new WebSocket('ws://localhost:50002/')
	socket.onopen = function() {
		socket.send(sends)
	}
}
