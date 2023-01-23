//バージョンチェッカー
async function verck(ver, jp) {
	localStorage.setItem('ver', ver)
}
var infostreaming = false
function infowebsocket() {
	infows = new WebSocket('wss://thedesk.top/ws/')
	infows.onopen = function (mess) {
		console.log([tlid, ':Connect Streaming Info:', mess])
		infostreaming = true
	}
	infows.onmessage = function (mess) {
		console.log([tlid, ':Receive Streaming:', JSON.parse(mess.data)])
		var obj = JSON.parse(mess.data)
		if (obj.type != 'counter') {
			if (obj.type == 'textv2') {
				if (~obj.languages.indexOf(lang.language)) {
					localStorage.setItem('last-notice-id', obj.id)
					var showVer = true
					if (obj.toot != '') {
						var toot =
							'<button class="btn-flat toast-action" onclick="detEx(\'' +
							obj.toot +
							"','main')\">Show</button>"
					} else {
						var toot = ''
					}
					if (obj.ver != '') {
						if (obj.ver == ver) {
							showVer = true
						} else {
							showVer = false
						}
					}
					if (obj.domain != '') {
						var multi = localStorage.getItem('multi')
						if (multi) {
							showVer = false
							var accts = JSON.parse(multi)
							Object.keys(accts).forEach(function (key) {
								var acct = accts[key]
								if (acct.domain == obj.domain) {
									showVer = true
								}
							})
						}
					}
					if (showVer) {
						console.log(obj.text)
						console.log(escapeHTML(obj.text))
						M.toast({
							html:
								escapeHTML(obj.text) +
								toot +
								'<span class="sml grey-text">(スライドして消去)</span>',
							displayLength: 86400
						})
					}
				}
			}
		} else {
			$('#persons').text(obj.text)
		}
	}
	infows.onerror = function (error) {
		infostreaming = false
		console.error('Error closing:info')
		console.error(error)
		return false
	}
	infows.onclose = function () {
		infostreaming = false
		console.error('Closing:info')
	}
}
setInterval(function () {
	if (!infostreaming) {
		console.log('try to connect to base-streaming')
		infowebsocket()
	}
}, 10000)
function openRN() {
	$('#releasenote').modal('open')
	if (lang.language == 'ja') {
		verp = ver.replace('(', '')
		verp = verp.replace('.', '-')
		verp = verp.replace('.', '-')
		verp = verp.replace('[', '-')
		verp = verp.replace(']', '')
		verp = verp.replace(')', '')
		verp = verp.replace(' ', '_')
		$('#release-' + verp).show()
	} else {
		$('#release-en').show()
	}
}
function closeSupport() {
	$('#support-btm').animate(
		{
			bottom: '-300px'
		},
		{
			duration: 300,
			complete: function () {
				$('#support-btm').addClass('hide')
			}
		}
	)
}
function closeStart() {
	$('#start').css('display', 'none')
	var platform = localStorage.getItem('platform')
	var ver = localStorage.getItem('ver')
}
