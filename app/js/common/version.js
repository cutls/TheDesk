//バージョンチェッカー
function verck(ver) {
	localStorage.setItem("ver", ver);
	var l = 5;

	// 生成する文字列に含める文字セット
	var c = "abcdefghijklmnopqrstuvwxyz0123456789";

	var cl = c.length;
	var r = "";
	for(var i=0; i<l; i++){
  		r += c[Math.floor(Math.random()*cl)];
	}
	var start = "https://thedesk.top/ver.json";
	fetch(start, {
		method: 'GET'
	}).then(function(response) {
		return response.json();
	}).catch(function(error) {
		todo(error);
		console.error(error);
	}).then(function(mess) {
		console.log(mess);
		if (mess) {
			if (mess.desk == ver) {
				todo("お使いのバージョン" + mess.desk + "は最新です。");
				//betaならアプデチェックしない
			} else if (ver != "beta") {
				localStorage.removeItem("instance")
				var electron = require("electron");
				var ipc = electron.ipcRenderer;
				ipc.send('update', "true");
			}
		}
	});
}
