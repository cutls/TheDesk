$voise = null
isBouyomi = localStorage.getItem('voice_bouyomi')
$voiseName = lang.lang_speech
$voices = speechSynthesis.getVoices()
$synthes = new SpeechSynthesisUtterance()
$voise = $.grep($voices, function(n, i) {
	return n.name == $voiseName
})[0]
$synthes.voice = $voise // 音声の設定
localStorage.removeItem('voicebank')
speechSynthesis.cancel()
if (!localStorage.getItem('voice_vol')) {
	localStorage.setItem('voice_vol', 1)
}
voiceRate = localStorage.getItem('voice_speed')
$synthes.rate = voiceRate
voicePitch = localStorage.getItem('voice_pitch')
$synthes.pitch = voicePitch
voiceVol = localStorage.getItem('voice_vol')
$synthes.volume = voiceVol
function say(msgr) {
	msg = voiceParse(msgr)
	var voice = localStorage.getItem('voicebank')
	var obj = JSON.parse(voice)
	if (!obj) {
		var json = JSON.stringify([msg])
		localStorage.setItem('voicebank', json)
	} else {
		obj.push([msg])
		var json = JSON.stringify(obj)
		localStorage.setItem('voicebank', json)
	}
}
$repeat = setInterval(function() {
	if (!speechSynthesis.speaking) {
		var voice = localStorage.getItem('voicebank')
		if (voice) {
			var obj = JSON.parse(voice)
			if (obj[0]) {
				if (localStorage.getItem('voice_bouyomi')) {
					var delim = '<bouyomi>'
					var thisVoiceRate = voiceRate * 10 + 70
					var thisVoicePitch = voicePitch * 50 + 70
					var thisVoiceVol = voiceVol * 100
					console.log(thisVoiceRate, thisVoicePitch, thisVoiceVol)
					var command = 0x0001
					var type = 0
					var sends =
						'' +
						command +
						delim +
						thisVoiceRate +
						delim +
						thisVoicePitch +
						delim +
						thisVoiceVol +
						delim +
						type +
						delim +
						obj[0]
					bouyomiConnect(sends)
				} else {
					$synthes.text = obj[0]
					speechSynthesis.speak($synthes)
				}

				obj.splice(0, 1)
				var json = JSON.stringify(obj)
				localStorage.setItem('voicebank', json)
			}
		}
	}
}, 300)
function voiceParse(msg) {
	msg = $.strip_tags(msg)
	msg = msg.replace(/#/g, '')
	msg = msg.replace(/'/g, '')
	msg = msg.replace(/"/g, '')
	msg = msg.replace(/https?:\/\/[a-zA-Z0-9./-@_=?%&-]+/g, '')
	return msg
}
function voiceToggle(tlid) {
	var voiceck = localStorage.getItem('voice_' + tlid)
	if (voiceck) {
		localStorage.removeItem('voice_' + tlid)
		speechSynthesis.cancel()
		if (localStorage.getItem('voice_bouyomi')) {
			var command = 0x0010
			var sends = '' + command
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
function voiceCheck(tlid) {
	var voiceck = localStorage.getItem('voice_' + tlid)
	if (voiceck) {
		$('#sta-voice-' + tlid).text('On')
		$('#sta-voice-' + tlid).css('color', '#009688')
	} else {
		$('#sta-voice-' + tlid).text('Off')
		$('#sta-voice-' + tlid).css('color', 'red')
	}
}
function voicePlay() {
	if (speechSynthesis.speaking) {
		speechSynthesis.cancel()
	} else {
		var text = $('#voicetxt').val()
		var rate = $('#voicespeed').val()
		var pitch = $('#voicepitch').val()
		var vol = $('#voicevol').val()
		if (localStorage.getItem('voice_bouyomi')) {
			var delim = '<bouyomi>'
			rate = rate * 1 + 70
			pitch = pitch * 1 + 70
			var command = 0x0001 // コマンドです。0x0001.読み上げ/0x0010.ポーズ/0x0020.再開/0x0030.スキップ
			/*var speed = 100; // 速度50-200。-1を指定すると本体設定
            var pitch = 100; // ピッチ50-200。-1を指定すると本体設定
            var volume = 100; // ボリューム0-100。-1を指定すると本体設定*/
			var type = 0 // 声質(0.本体設定/1.女性1/2.女性2/3.男性1/4.男性2/5.中性/6.ロボット/7.機械1/8.機械2)
			var sends =
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

function voiceSettings() {
	var awk = $('[name=bym]:checked').val()
	if (awk == 'yes') {
		localStorage.setItem('voice_bouyomi', 'yes')
		Mtoast({ html: 'Bouyomi Chan connection requires WebSocket Plugin', displayLength: 3000 })
	} else {
		localStorage.removeItem('voice_bouyomi')
	}
	localStorage.setItem('voice_speed', $('#voicespeed').val() / 10)
	localStorage.setItem('voice_pitch', $('#voicepitch').val() / 50)
	localStorage.setItem('voice_vol', $('#voicevol').val() / 100)
	Mtoast({ html: lang.lang_speech_refresh, displayLength: 3000 })
}
function voiceSettingLoad() {
	var flag = localStorage.getItem('voice_bouyomi')
	if (flag) {
		$('#bym_yes').prop('checked', true)
	} else {
		$('#bym_no').prop('checked', true)
	}
	var speed = localStorage.getItem('voice_speed')
	var pitch = localStorage.getItem('voice_pitch')
	var vol = localStorage.getItem('voice_vol')
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
function bouyomiConnect(sends) {
	var socket = new WebSocket('ws://localhost:50002/')
	socket.onopen = function() {
		socket.send(sends)
	}
}
