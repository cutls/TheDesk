//左下のメッセージ
var todcTrigger = null;
function todo(mes) {
	clearInterval(todcTrigger);
	$('#message').text(mes);
	$('#message').fadeIn();
	todcTrigger = setTimeout(todc, 4000);
}
function todc() {
	$('#message').fadeOut();
}
//reverse
function bottomReverse() {
	$("#bottom").toggleClass("reverse");
	$(".leftside").toggleClass("reverse");
	if ($("#bottom").hasClass("reverse")) {
		localStorage.removeItem("reverse")
	} else {
		localStorage.setItem("reverse", "true")
	}
}
function tips(mode) {
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('endmem', "");
	clearInterval(clockint);
	clearInterval(spotStart);
	if (mode == "ver") {
		tipsToggle()
		$("#tips-text").html('<img src="../../img/desk.png" width="20" onclick="todo(\'!TheDesk! It\\\'s a nice client!\')"><span style="font-size:20px">TheDesk</span> ' + localStorage.getItem("ver") + '[<i class="material-icons" style="font-size:1.2rem;top: 3px;position: relative;">supervisor_account</i><span id="persons">1+</span>]')
		localStorage.setItem("tips", "ver")
	} else if (mode == "clock") {
		tipsToggle()
		localStorage.setItem("tips", "clock")
		clock()
	} else if (mode == "memory") {
		tipsToggle()
		localStorage.setItem("tips", "memory")
		startmem();
	} else if (mode == "trend") {
		tipsToggle()
		localStorage.setItem("tips", "trend")
		trendTagonTip()
	} else if (mode == "spotify") {
		tipsToggle()
		localStorage.setItem("tips", "spotify")
		var json = nowplaying("spotifytips")
		spotifytips(json)
	}
}
//メモリ
function startmem() {
	var electron = require("electron");
	var ipc = electron.ipcRenderer;
	ipc.send('startmem', "");
	ipc.on('memory', function (event, arg) {
		var use = arg[0];
		var cpu = arg[1];
		var total = arg[2]
		$("#tips-text").html(escapeHTML(cpu) + "<br>Memory:" + Math.floor(use / 1024 / 1024 / 102.4) / 10 + "/" + Math.floor(total / 1024 / 1024 / 102.4) / 10 + "GB(" + Math.floor(use / total * 100) + "%)")
	})
}
//トレンドタグ
function trendTagonTip() {
	$(".trendtag").remove();
	var domain = "imastodon.net"
	var at = localStorage.getItem("acct_" + acct_id + "_at");
	var start = "https://" + domain + "/api/v1/trend_tags"
	fetch(start, {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'Authorization': 'Bearer ' + at
		},
	}).then(function (response) {
		return response.json();
	}).catch(function (error) {
		todo(error);
		console.error(error);
	}).then(function (json) {
		if (json) {
			var tags = "";
			json = json.score;
			Object.keys(json).forEach(function (tag) {
				tags = tags + '<a onclick="tagShow(\'' + tag + '\')" class="pointer">#' + escapeHTML(tag) + '</a><span class="hide" data-tag="' + tag + '">　<a onclick="tagTL(\'tag\',\'' + tag + '\',false,\'add\')" class="pointer" title="#' + tag + 'のタイムライン">TL</a>　<a onclick="show();brInsert(\'#' + tag + '\')" class="pointer" title="#' + tag + 'でトゥート">Toot</a></span><br>';
			});
			$("#tips-text").html('<div class="trendtag">トレンドタグ<i class="material-icons pointer" onclick="trendTagonTip()" style="font-size:12px">refresh</i>:<br>' + tags + '</div>');
			trendTagonTipInterval()
		} else {
			$("#tips-text").html("");
		}
	});

}
//Spotify
function spotifytips() {
	var start = "https://thedesk.top/now-playing?at=" + localStorage.getItem("spotify") + "&rt=" + localStorage.getItem("spotify-refresh");
	var at = localStorage.getItem("spotify");
	if (at) {
		fetch(start, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		}).then(function (response) {
			return response.json();
		}).catch(function (error) {
			todo(error);
			console.error(error);
		}).then(function (json) {
			var ms = json.progress_ms;
			var last = 1000 - ms % 1000;
			var item = json.item;
			var img = item.album.images[0].url;
			var artisttxt = "";
			for (i = 0; i < item.artists.length; i++) {
				if (i > 0) {
					artisttxt = artisttxt + "," + item.artists[i].name;
				} else {
					artisttxt = item.artists[0].name;
				}
			}
			artisttxt = escapeHTML(artisttxt);
			sleep(last);
			var tms = item.duration_ms;
			var per = ms / item.duration_ms * 100;
			ms = ms / 1000;
			tms = tms / 1000;
			var s = Math.round(ms) % 60;
			if (s < 10) {
				s = "0" + s;
			}
			var m = (Math.round(ms) - Math.round(ms) % 60) / 60;
			var ts = Math.round(tms) % 60;
			if (ts < 10) {
				ts = "0" + ts;
			}
			var tm = (Math.round(tms) - Math.round(tms) % 60) / 60;
			$("#tips-text").html('<div id="spot-box"><i class="material-icons pointer" onclick="spotifytips()" style="font-size:12px">refresh</i><img src="' + img + '" width="20" id="spot-img">' + escapeHTML(item.name) + '<span class="gray sml" id="spot-art">' + artisttxt + '</span><span id="spot-m">' + m + '</span>:<span id="spot-s">' + s + '</span>/' + tm + ":" + ts + '</span></div><div class="progress grey"><div class="determinate spotify-prog grey lighten-2" style="width: ' + per + '%" data-s="' + Math.round(ms) + '" data-total="' + item.duration_ms + '"></div></div>');
			spotint = setInterval(spotStart, 1000);
		});
	} else {
		alert(lang.lang_spotify_acct);
	}
}
function spotStart() {
	var total = $(".spotify-prog").attr("data-total");
	var s = $(".spotify-prog").attr("data-s");
	var news = s * 1 + 1;
	var per = news * 100000 / total;
	var ns = news % 60;
	var nm = (news - ns) / 60;
	if (ns < 10) {
		ns = "0" + ns;
	}
	if (per >= 100) {
		clearInterval(spotStart);
		spotifytips()
	} else {
		$("#spot-m").text(nm);
		$("#spot-s").text(ns);
	}
	$(".spotify-prog").attr("data-s", news);
	$(".spotify-prog").css("width", per + "%");
}


function trendTagonTipInterval() {
	setTimeout(trendTagonTip, 6000000);
}
//時計
var clockint;
function clock() {
	var now = new Date();
	var last = 1000 - now.getTime() % 1000;
	sleep(last);
	clockint = setInterval(clockStart, 1000);
}
function clockStart() {
	var nowTime = new Date(); //  現在日時を得る
	var nowHour = nowTime.getHours(); // 時を抜き出す
	if (nowHour < 10) { nowHour = "0" + nowHour }
	var nowMin = nowTime.getMinutes(); // 分を抜き出す
	if (nowMin < 10) { nowMin = "0" + nowMin }
	var nowSec = nowTime.getSeconds(); // 秒を抜き出す
	if (nowSec < 10) { nowSec = "0" + nowSec }
	var msg = nowTime.getFullYear() + "/" + (nowTime.getMonth() + 1) + "/" + nowTime.getDate() + '<span style="font-size:20px; font-family:Open Sans">' + nowHour + ":" + nowMin + ":" + nowSec + "</span>";
	$("#tips-text").html(msg);
}
function sleep(waitMsec) {
	var startMsec = new Date();
	while (new Date() - startMsec < waitMsec);
}
function tipsToggle() {
	$("#tips").toggleClass("hide");
	$("#tips-menu").toggleClass("hide");
}
if (localStorage.getItem("tips")) {
	tips(localStorage.getItem("tips"));
}
