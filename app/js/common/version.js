//バージョンチェッカー
function verck(ver) {
	console.log("%c Welcome😊", "color: red;font-size:200%;")
	if (localStorage.getItem("ver") != ver) {
		localStorage.setItem("ver", ver);
		console.log("%c Thank you for your update🎉", "color: red;font-size:200%;");
		$(document).ready(function () {
			$('#releasenote').modal('open');
			verp = ver.replace('(', '');
			verp = verp.replace('.', '-');
			verp = verp.replace('.', '-');
			verp = verp.replace('[', '-');
			verp = verp.replace(']', '');
			verp = verp.replace(')', '');
			verp = verp.replace(' ', '_');
			console.log("%c " + verp, "color: red;font-size:200%;");
			if (lang.language == "ja") {
				$("#release-" + verp).show();
			} else {
				$("#release-en").show();
			}

		});
	}
	var electron = require("electron");
	var remote = electron.remote;
	var dialog = remote.dialog;
	var platform = remote.process.platform;
	console.log("Your platform:"+remote.process.platform)
	if (platform == "win32") {
		const options = {
			type: 'info',
			title: "Select your platform",
			message: lang.lang_version_platform,
			buttons: [lang.lang_no, lang.lang_yesno]
		}
		if (!localStorage.getItem("winstore")) {

			dialog.showMessageBox(options, function (arg) {
				if (arg == 1) {
					localStorage.setItem("winstore", "winstore")
				} else {
					localStorage.setItem("winstore", "localinstall")
				}
			});
		}
	} else if (platform == "linux") {
		if (localStorage.getItem("winstore") == "unix") {
			localStorage.removeItem("winstore")
		}
		if (!localStorage.getItem("winstore")) {
			const options = {
				type: 'info',
				title: "Select your platform",
				message: lang.lang_version_platform_linux,
				buttons: [lang.lang_no, lang.lang_yesno]
			}
			dialog.showMessageBox(options, function (arg) {
				if (arg == 1) {
					localStorage.setItem("winstore", "snapcraft")
				} else {
					localStorage.setItem("winstore", "localinstall")
				}
			});
		}
	} else if (platform == "darwin") {
		if (localStorage.getItem("winstore") == "unix") {
			localStorage.removeItem("winstore")
		}
		if (!localStorage.getItem("winstore")) {
			const options = {
				type: 'info',
				title: "Select your platform",
				message: lang.lang_version_platform_mac,
				buttons: [lang.lang_no, lang.lang_yesno]
			}
			dialog.showMessageBox(options, function (arg) {
				if (arg == 1) {
					localStorage.setItem("winstore", "brewcask")
				} else {
					localStorage.setItem("winstore", "localinstall")
				}
			});
		}
	} else {
		localStorage.setItem("winstore", "unix")
	}
	if (localStorage.getItem("winstore") == "brewcask" || localStorage.getItem("winstore") == "snapcraft" || localStorage.getItem("winstore") == "winstore") {
		var winstore = true;
	} else {
		var winstore = false;
	}
	var l = 5;
	// 生成する文字列に含める文字セット
	var c = "abcdefghijklmnopqrstuvwxyz0123456789";
	var cl = c.length;
	var r = "";
	for (var i = 0; i < l; i++) {
		r += c[Math.floor(Math.random() * cl)];
	}
	var start = "https://thedesk.top/ver.json";
	fetch(start, {
		method: 'GET'
	}).then(function (response) {
		return response.json();
	}).catch(function (error) {
		todo(error);
		console.error(error);
	}).then(function (mess) {
		console.table(mess);
		if (mess) {
			var electron = require("electron");
			var remote = electron.remote;
			var platform = remote.process.platform;
			if (platform == "darwin") {
				var newest = mess.desk_mac;
			} else {
				var newest = mess.desk;
			}
			if (newest == ver) {
				todo(lang.lang_version_usever.replace("{{ver}}", mess.desk));
				//betaかWinstoreならアプデチェックしない
			} else if (ver.indexOf("beta") != -1 || winstore) {

			} else {
				localStorage.removeItem("instance")
				if (localStorage.getItem("new-ver-skip")) {
					if (localStorage.getItem("next-ver") != newest) {
						var ipc = electron.ipcRenderer;
						ipc.send('update', "true");
					} else {
						console.warn(lang.lang_version_skipver);
						todo(lang.lang_version_skipver);
					}
				} else {
					var ipc = electron.ipcRenderer;
					ipc.send('update', "true");
				}
			}
		}
	});
	if (!localStorage.getItem("last-notice-id")) {
		localStorage.setItem("last-notice-id", 0)
	}
	var start = "https://thedesk.top/notice?since_id=" + localStorage.getItem("last-notice-id");
	fetch(start, {
		method: 'GET'
	}).then(function (response) {
		return response.json();
	}).catch(function (error) {
		todo(error);
		console.error(error);
	}).then(function (mess) {
		if (mess.length < 1) {
			return false;
		} else {
			var last = localStorage.getItem("last-notice-id")
			localStorage.setItem("last-notice-id", mess[0].ID)
			for (i = 0; i < mess.length; i++) {
				var obj = mess[i];
				if (obj.ID * 1 <= last) {
					break;
				} else {
					var show = true;
					if (obj.Toot != "") {
						var toot = '<button class="btn-flat toast-action" onclick="detEx(\'' + obj.Toot + '\',\'main\')">Show</button>';
					} else {
						var toot = "";
					}
					if (obj.Ver != "") {
						if (obj.Ver == ver) {
							show = true;
						} else {
							show = false;
						}
					}
					if (obj.Domain != "") {
						var multi = localStorage.getItem("multi");
						if (multi) {
							show = false;
							var accts = JSON.parse(multi);
							Object.keys(accts).forEach(function (key) {
								var acct = accts[key];
								if (acct.domain == obj.Domain) {
									show = true;
								}
							});
						}
					}
					if (show) {
						Materialize.toast(escapeHTML(obj.Text) + toot + '<span class="sml grey-text">(スライドして消去)</span>', 86400);
					}
				}

			}
		}
	});
}
var infostreaming = false;
function infowebsocket() {
	infows = new WebSocket("wss://thedesk.top/ws/");
	infows.onopen = function (mess) {
		console.log([tlid, ":Connect Streaming Info:", mess]);
		infostreaming = true;
	}
	infows.onmessage = function (mess) {
		console.log([tlid, ":Receive Streaming:", JSON.parse(mess.data)]);
		var obj = JSON.parse(mess.data);
		if (obj.type != "counter") {
			localStorage.setItem("last-notice-id", obj.id)
			var show = true;
			if (obj.toot != "") {
				var toot = '<button class="btn-flat toast-action" onclick="detEx(\'' + obj.toot + '\',\'main\')">Show</button>';
			} else {
				var toot = "";
			}
			if (obj.ver != "") {
				if (obj.ver == ver) {
					show = true;
				} else {
					show = false;
				}
			}
			if (obj.domain != "") {
				var multi = localStorage.getItem("multi");
				if (multi) {
					show = false;
					var accts = JSON.parse(multi);
					Object.keys(accts).forEach(function (key) {
						var acct = accts[key];
						if (acct.domain == obj.domain) {
							show = true;
						}
					});
				}
			}
			if (show) {
				Materialize.toast(escapeHTML(obj.text) + toot + '<span class="sml grey-text">(スライドして消去)</span>', 86400);
			}
		} else {
			$("#persons").text(obj.text);
		}
	}
	infows.onerror = function (error) {
		infostreaming = false;
		console.error("Error closing:info");
		console.error(error);
		return false;
	};
	infows.onclose = function () {
		infostreaming = false;
		console.error("Closing:info");
	};
}
setInterval(function () {
	if (!infostreaming) {
		console.log("try to connect to base-streaming")
		infowebsocket();
	}
}, 10000);
function openRN() {
	$('#releasenote').modal('open');
	if (lang.language == "ja") {
		verp = ver.replace('(', '');
		verp = verp.replace('.', '-');
		verp = verp.replace('.', '-');
		verp = verp.replace('[', '-');
		verp = verp.replace(']', '');
		verp = verp.replace(')', '');
		verp = verp.replace(' ', '_');
		$("#release-" + verp).show();
	} else {
		$("#release-en").show();
	}
}