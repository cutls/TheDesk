//バージョンチェッカー
function verck(ver) {
	console.log("%c Welcome😊", "color: red;font-size:200%;")
	var date = new Date();
	var show = false
	if (localStorage.getItem("ver") != ver && localStorage.getItem("winstore")) {
		//ちょっと削除とリンク解析の都合上アレ(s)
		//対象外のアプデ:storageが20の最初まで"Usamin (18.6.5)"
		if (!localStorage.getItem("usamin_18_6_5_flag")) {
			localStorage.setItem("usamin_18_6_5_flag", true)
			var multi = localStorage.getItem("column");
			var obj = JSON.parse(multi);
			for (var i = 0; i < obj.length; i++) {
				localStorage.removeItem("card_" + i);
			}
		}
		//ちょっと削除とリンク解析の都合上アレ(e)
		localStorage.setItem("ver", ver);
		show = true
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
	if (!show) {
		console.log(show)
		if (date.getMonth() + 1 >= localStorage.getItem("showSupportMe") || !localStorage.getItem("showSupportMe")) {
			if (date.getMonth() == 11) {
				var nextmonth = 1
			} else {
				var nextmonth = date.getMonth() + 2
			}
			if (lang.language != "ja") {
				$("#support-btm-ja").addClass("hide");
				$("#support-btm-en").removeClass("hide");
			}
			localStorage.setItem("showSupportMe", nextmonth)
			$("#support-btm").removeClass("hide")
			$("#support-btm").animate({
				'bottom': '0'
			}, {
					'duration': 300
				});
		}
	}
	var platform = localStorage.getItem("platform");
	console.log("Your platform:" + platform)
	if (!localStorage.getItem("winstore")) {
		storeDialog(platform, ver)
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
			var platform = localStorage.getItem("platform");
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
						postMessage(["sendSinmpleIpc", "update"], "*")
					} else {
						console.warn(lang.lang_version_skipver);
						todo(lang.lang_version_skipver);
					}
				} else {
					postMessage(["sendSinmpleIpc", "update"], "*")
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
						M.toast({ html: escapeHTML(obj.text) + toot + '<span class="sml grey-text">(スライドして消去)</span>', displayLength: 86400 })
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
				M.toast({ html: escapeHTML(obj.Text) + toot + '<span class="sml grey-text">(スライドして消去)</span>', displayLength: 86400 })
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
function closeSupport() {
	$("#support-btm").animate({
		'bottom': '-300px'
	}, {
			'duration': 300,
			'complete': function () {
				$("#support-btm").addClass("hide")
			}
		});
}
function storeDialog(platform, ver) {
	if (platform == "win32") {
		var mes = lang.lang_version_platform;
	} else if (platform == "linux") {
		var mes = lang.lang_version_platform_linux;
	} else if (platform == "darwin") {
		var mes = lang.lang_version_platform_mac;
	}
	Swal.fire({
		title: "Select your platform",
		text: mes,
		type: 'info',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#3085d6',
		confirmButtonText: lang.lang_no,
		cancelButtonText: lang.lang_yesno
	}).then((result) => {
		//逆にしてる
		if (!result.value) {
			localStorage.setItem("winstore", "winstore")
		} else {
			localStorage.setItem("winstore", "localinstall")
		}
		localStorage.setItem("ver", ver);
		show = true
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
	})
}